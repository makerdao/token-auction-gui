import { Template } from 'meteor/templating';
import './network-status.html';

Template.networkStatus.viewmodel({
  network: () => Session.get('network'),
  syncing: () => Session.get('syncing'),
  outOfSync: () => Session.get('outOfSync'),
  isConnected: () => Session.get('isConnected'),
  latestBlock: () => Session.get('latestBlock'),
  account: () => Session.get('address'),
  contract: () => Session.get('contractAddress'),
});
