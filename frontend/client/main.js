import { Template } from 'meteor/templating';
import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Tokens from '/imports/api/tokens.js';

import '/imports/client/accountselector.js';
import '/imports/client/network-status.js';
import '/imports/client/balance.js';
import '/imports/client/auctions.js';
import '/imports/client/auction.js';
import '/imports/client/auctionlet.js';
import '/imports/client/bid-history.js';

import '/imports/startup/client/index.js';
import '/imports/helpers.js';
import './main.html';

Template.body.onCreated(function created() {
  this.autorun(() => {
    const network = Session.get('network');
    const address = Session.get('address');
    if (network && address) {
      // filters specific to the current address
    }
  });

  //TODO will some other observing be needed here?
  //this is needed only for observing collections
});
