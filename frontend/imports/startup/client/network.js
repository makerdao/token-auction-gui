import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Tokens from '/imports/api/tokens.js';
import { Tracker } from 'meteor/tracker';
import Transactions from '/imports/lib/_transactions.js';

Meteor.disconnect();
TokenAuction.init('morden');
Session.set('network', false);
Session.set('outOfSync', false);
Session.set('syncing', false);
Session.set('isConnected', false);
Session.set('latestBlock', 0);

// Initialize everything on new network
function initNetwork(newNetwork) {
  Session.set('network', newNetwork);
  Session.set('isConnected', true);
  Session.set('latestBlock', 0);
  Tokens.sync();
  Tokens.initialize(newNetwork);
}

// CHECK FOR NETWORK
function checkNetwork() {
  web3.version.getNode((error) => {
    const isConnected = !error;

    // Check if we are synced
    if (isConnected) {
      web3.eth.getBlock('latest', (e, res) => {
        if (res.number >= Session.get('latestBlock')) {
          Session.set('outOfSync', e != null || ((new Date().getTime() / 1000) - res.timestamp) > 600);
          Session.set('latestBlock', res.number);
        } else {
          // XXX MetaMask frequently returns old blocks
          // https://github.com/MetaMask/metamask-plugin/issues/504
          console.debug('Skipping old block');
        }
      });
    }

    // Check which network are we connected to
    // https://github.com/ethereum/meteor-dapp-wallet/blob/90ad8148d042ef7c28610115e97acfa6449442e3/app/client/lib/ethereum/walletInterface.js#L32-L46
    if (!Session.equals('isConnected', isConnected)) {
      if (isConnected === true) {
        web3.eth.getBlock(0, (e, res) => {
          let network = false;
          if (!e) {
            switch (res.hash) {
              case '0x0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303':
                network = 'morden';
                break;
              case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
                network = 'live';
                break;
              default:
                console.log('setting network to private');
                console.log('res.hash:', res.hash);
                network = 'private';
            }
          }
          if (!Session.equals('network', network)) {
            initNetwork(network);
          }
        });
      } else {
        Session.set('isConnected', isConnected);
        Session.set('network', false);
        Session.set('latestBlock', 0);
      }
    }
  });
}

function setupFilters() {
  web3.eth.filter('latest', () => {
    Tokens.sync();
    Transactions.sync();
    Auctionlets.syncExpired();
  });
}

Meteor.startup(() => {
  checkNetwork();
  setupFilters();

  web3.eth.isSyncing((error, sync) => {
    if (!error) {
      Session.set('syncing', sync !== false);

      // Stop all app activity
      if (sync === true) {
        // We use `true`, so it stops all filters, but not the web3.eth.syncing polling
        web3.reset(true);
        checkNetwork();
      // show sync info
      } else if (sync) {
        Session.set('startingBlock', sync.startingBlock);
        Session.set('currentBlock', sync.currentBlock);
        Session.set('highestBlock', sync.highestBlock);
      } else {
        Session.set('outOfSync', false);
        setupFilters();
      }
    }
  });

  Meteor.setInterval(checkNetwork, 2503);
  Meteor.setInterval(web3.checkAccounts, 1571);
});

Tracker.autorun(() => {
  web3.checkAccounts();
  Auctions.getAuction();
  Auctionlets.getAuctionlet();
  Tokens.sync();
});
