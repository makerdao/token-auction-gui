import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Tokens from '/imports/api/tokens.js';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import Transactions from '/imports/api/transactions.js';
import clearMessages from '/imports/utils/clearmessages.js';

Meteor.disconnect();
Session.set('network', false);
Session.set('outOfSync', false);
Session.set('syncing', false);
Session.set('isConnected', false);
Session.set('latestBlock', 0);

// Clear UI Messages
clearMessages();

Session.set('lastMessages', []);
Session.set('bidProgress', 0);
Session.set('newAuctionProgress', 0);

let lastMessages = [];

// Check which accounts are available and if defaultAccount is still available,
// Otherwise set it to localStorage, Session, or first element in accounts
function checkAccounts() {
  web3.eth.getAccounts((error, accounts) => {
    if (!error) {
      if (!_.contains(accounts, web3.eth.defaultAccount)) {
        if (_.contains(accounts, localStorage.getItem('address'))) {
          web3.eth.defaultAccount = localStorage.getItem('address');
        } else if (_.contains(accounts, Session.get('address'))) {
          web3.eth.defaultAccount = Session.get('address');
        } else if (accounts.length > 0) {
          web3.eth.defaultAccount = accounts[0];
        } else {
          web3.eth.defaultAccount = undefined;
        }
      }
      localStorage.setItem('address', web3.eth.defaultAccount);
      Session.set('address', web3.eth.defaultAccount);
      Session.set('accounts', accounts);
    }
  });
}

function setupFilters() {
  // log events need to be reset for each network
  if (Session.get('network')) {
    Auctions.watchNewAuction();
    Auctionlets.watchBid();
  }

  web3.eth.filter('latest', () => {
    Tokens.sync();
    Transactions.sync();
    Auctionlets.syncExpired();
  });
}

// Initialize everything on new network
function initNetwork(newNetwork) {
  checkAccounts();
  Session.set('network', newNetwork);
  Session.set('isConnected', true);
  Session.set('latestBlock', 0);
  const networkSettings = Meteor.settings.public[newNetwork];
  const currentAuctionId = Session.get('currentAuctionId');
  if (!currentAuctionId) {
    // setting default auction id for the current network
    Session.set('currentAuctionId', networkSettings.auctionId);
  }
  const currentAuctionletId = Session.get('currentAuctionletId');
  if (!currentAuctionletId) {
    // setting default auction id for the current network
    Session.set('currentAuctionletId', networkSettings.auctionletId);
  }

  TokenAuction.init(newNetwork);
  Tokens.sync();
  Tokens.initialize(newNetwork);

  // filters need to be (re)registered after network switch.
  setupFilters();
}

// Check if there are notifications to route through toastr
function showNotification(notification) {
  const syncing = Session.set('syncing');
  if (!syncing) {
    if (typeof (notification) !== 'undefined' && notification !== null) {
      const message = notification.message;
      const type = notification.type ? notification.type : 'warning';
      if (lastMessages.indexOf(message) === -1) {
        switch (type) {
          case 'success':
            toastr.success(message);
            break;
          case 'info':
            toastr.info(message);
            break;
          case 'warning':
            toastr.warning(message);
            break;
          case 'danger':
            toastr.error(message);
            break;
          default:
            toastr.warning(message);
            break;
        }
        lastMessages.unshift(message);
        if (lastMessages.length > 3) {
          lastMessages = lastMessages.splice(0, 3);
        }
      }
    }
  }
}

function checkBidNotifications() {
  if (Session.get('newBidMessage') !== null) {
    showNotification(Session.get('newBidMessage'));
  }
}

function checkAuctionNotifications() {
  if (Session.get('newAuctionMessage') !== null) {
    showNotification(Session.get('newAuctionMessage'));
  }
}

function checkTransactionNotifications() {
  if (Session.get('newTransactionMessage') !== null) {
    showNotification(Session.get('newTransactionMessage'));
  }
}

function checkClaimNotifications() {
  if (Session.get('claimMessage') !== null) {
    showNotification(Session.get('claimMessage'));
  }
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
  Meteor.setInterval(checkAccounts, 10657);
});

Tracker.autorun(() => {
  checkBidNotifications();
  checkAuctionNotifications();
  checkTransactionNotifications();
  checkClaimNotifications();
  checkAccounts();
  const currentAuctionId = Session.get('currentAuctionId');
  if (currentAuctionId) {
    Auctions.loadAuction(currentAuctionId);
  }
  const currentAuctionletId = Session.get('currentAuctionletId');
  if (currentAuctionletId) {
    Auctionlets.loadAuctionlet(currentAuctionletId);
  }
  Tokens.sync();
});
