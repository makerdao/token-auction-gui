import { Auctions } from '../../api/auctions.js';
import { Auctionlets } from '../../api/auctionlets.js';
import { Tokens } from '../../api/tokens.js';
import { Tracker } from 'meteor/tracker';
import { Transactions } from '../../lib/_transactions.js';

TokenAuction.init('morden')
Session.set('network', false)
Session.set('outOfSync', false)
Session.set('syncing', false)
Session.set('isConnected', false)
Session.set('latestBlock', 0)

Meteor.startup(function() {
  checkNetwork()

  web3.eth.filter('latest', function () {
    Tokens.sync()
    Transactions.sync()
    Auctionlets.syncExpired()
  })

  web3.eth.isSyncing(function (error, sync) {
    if (!error) {
      Session.set('syncing', sync !== false)

      // Stop all app activity
      if (sync === true) {
        // We use `true`, so it stops all filters, but not the web3.eth.syncing polling
        web3.reset(true)
        checkNetwork()
      // show sync info
      } else if (sync) {
        Session.set('startingBlock', sync.startingBlock)
        Session.set('currentBlock', sync.currentBlock)
        Session.set('highestBlock', sync.highestBlock)
      } else {
        Session.set('outOfSync', false)
        web3.eth.filter('latest', function () {
          Tokens.sync()
          Transactions.sync()
        })
      }
    }
  })

  Meteor.setInterval(checkNetwork, 2503)
  //Meteor.setInterval(web3.checkAccounts, 10657)
})

Tracker.autorun(function() {
  web3.checkAccounts();
  Auctions.getAuction();
  Auctionlets.getAuctionlet();
  Tokens.sync()
})

// Initialize everything on new network
function initNetwork (newNetwork) {
  Session.set('network', newNetwork)
  Session.set('isConnected', true)
  Session.set('latestBlock', 0)
  Tokens.sync()
}

// CHECK FOR NETWORK
function checkNetwork () {
  web3.version.getNode(function (error, node) {
    var isConnected = !error

    // Check if we are synced
    if (isConnected) {
      web3.eth.getBlock('latest', function (e, res) {
        if (res.number >= Session.get('latestBlock')) {
           Session.set('outOfSync', e != null || new Date().getTime() / 1000 - res.timestamp > 600)
           Session.set('latestBlock', res.number)
         } else {
           // XXX MetaMask frequently returns old blocks
           // https://github.com/MetaMask/metamask-plugin/issues/504
           console.debug('Skipping old block')
         }
      })
    }

    // Check which network are we connected to
    // https://github.com/ethereum/meteor-dapp-wallet/blob/90ad8148d042ef7c28610115e97acfa6449442e3/app/client/lib/ethereum/walletInterface.js#L32-L46
    if (!Session.equals('isConnected', isConnected)) {
      if (isConnected === true) {
        web3.eth.getBlock(0, function (e, res) {
          var network = false
          if (!e) {
            switch (res.hash) {
              case '0x0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303':
                network = 'test'
                break
              case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
                network = 'main'
                break
              default:
                console.log('setting network to private')
                console.log('res.hash:', res.hash)
                network = 'private'
            }
          }
          if (!Session.equals('network', network)) {
            initNetwork(network)
          }
        })
      } else {
        Session.set('isConnected', isConnected)
        Session.set('network', false)
        Session.set('latestBlock', 0)
      }
    }
  })
}