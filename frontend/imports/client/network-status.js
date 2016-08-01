import { Template } from 'meteor/templating'

import './network-status.html'

Template.networkStatus.helpers({
  network: function() {
    return Session.get('network')
  },
  loading: function() {
    return Session.get('loading')
  },
  syncing: function() {
    return Session.get('syncing')
  },
  outOfSync: function() {
    return Session.get('outOfSync')
  },
  isConnected: function() {
    return Session.get('isConnected')
  },
  latestBlock: function() {
    return Session.get('latestBlock')
  }
})
