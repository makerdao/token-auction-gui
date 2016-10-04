import { Template } from 'meteor/templating';
import './network-status.html';

Template.networkStatus.viewmodel({
  network: () => Session.get('network'),
  openTransactions: () => Session.get('openTransactions'),
  isConnected: () => Session.get('isConnected'),
  latestBlock: () => Session.get('latestBlock'),
  account: () => Session.get('address'),
  contract: () => Session.get('contractAddress'),
});
