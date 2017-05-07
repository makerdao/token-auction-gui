import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

Meteor.disconnect();
Session.set('network', false);
Session.set('outOfSync', false);
Session.set('syncing', false);
Session.set('isConnected', false);
Session.set('latestBlock', 0);

function setupFilters() {
  // log events need to be reset for each network
  if (Session.get('network')) {
    Auctions.initialize();
    Auctionlets.initialize();
  }

  web3.eth.filter('latest', () => {
    Session.get('network');
    Auctionlets.resyncAuctionlets();
  });
}

// Initialize everything on new network
function initNetwork(newNetwork) {
  Session.set('network', newNetwork);
  Session.set('isConnected', true);
  Session.set('latestBlock', 0);

  TokenAuction.init(newNetwork);
  Session.get('network');

  // filters need to be (re)registered after network switch.
  setupFilters();
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
              case '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9':
                network = 'kovan';
                break;
              case '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d':
                network = 'ropsten';
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

Meteor.startup(() => {
  checkNetwork();

  toastr.options = {
    closeButton: false,
    preventDuplicates: true,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
  };

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
      }
    }
  });

  Meteor.setInterval(checkNetwork, 2503);
});

Tracker.autorun(() => {
  Session.get('network');
});
