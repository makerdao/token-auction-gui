import Auctionlets from '/imports/api/auctionlets.js';
import './auctions.html';

Template.auctions.viewmodel({
  auctionlets() {
    const auctionlets = Auctionlets.find({ });
    return auctionlets;
  },
});
