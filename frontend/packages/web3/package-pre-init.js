if (typeof web3 !== 'undefined') {
  console.log('Reusing web3.currentProvider');
  web3 = new Web3(web3.currentProvider);
} else if (typeof window.web3 !== 'undefined') {
  console.log('Reusing window.web3.currentProvider');
  web3 = new Web3(window.web3.currentProvider);
} else {
  console.log('New Web3.providers.HttpProvider');
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

web3.checkAccounts = function checkAccounts() {
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
};
