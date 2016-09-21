import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import Tokens from '/imports/api/tokens';
import clearMessages from '/imports/utils/clearmessages.js';

import './accountselector.html';

Template.accountSelector.helpers({
  accounts() {
    return Session.get('accounts');
  },
});

Template.accountSelector.viewmodel({
  account: () => Session.get('address'),
  contract: () => Session.get('contractAddress'),
});

Template.accountSelector.events({
  change(event) {
    Session.set('address', event.target.value);
    localStorage.setItem('address', event.target.value);
    web3.eth.defaultAccount = event.target.value;

    // Remove messages from UI
    clearMessages();
    Tokens.sync();
  },
});
