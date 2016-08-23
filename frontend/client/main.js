import { Template } from 'meteor/templating';
import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Tokens from '/imports/api/tokens.js';

import '/imports/client/network-status.js';
import '/imports/client/balance.js';
import '/imports/client/newauction.js';
import '/imports/client/tokens.js';
import '/imports/client/transactions.js';
import '/imports/client/auction.js';
import '/imports/client/auctionlet.js';

import '/imports/startup/client/index.js';
import '/imports/helpers.js';
import './main.html';

Template.body.onCreated(function created() {
  this.autorun(() => {
    const network = Session.get('network');
    const address = Session.get('address');
    if (network && address) {
      Auctionlets.watchBid();
      Tokens.watchEthApproval();
      Tokens.watchMkrApproval();
    }
  });

  Tokens.watchEthAllowanceTransactions();
  Tokens.watchMkrAllowanceTransactions();
  Auctionlets.watchBidTransactions();
  Auctions.watchNewAuction();
  Auctions.watchNewAuctionTransactions();
  Auctionlets.watchClaimTransactions();
});
