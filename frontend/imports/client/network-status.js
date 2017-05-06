import { Template } from 'meteor/templating';
import './network-status.html';

Template.networkStatus.viewmodel({
  network: () => Session.get('network'),
  isConnected: () => Session.get('isConnected'),
  latestBlock: () => Session.get('latestBlock'),
});
