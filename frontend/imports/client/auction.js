import { Template } from 'meteor/templating';
import Auctionlets from '/imports/api/auctionlets.js';
import './auction.html';

Template.auction.helpers({
  auctionlets: function auctionlets() {
    const auctionId = Template.instance().data.auction.auction_id;
    return Auctionlets.findAuctionletsByAuctionId(auctionId);
  },
});
