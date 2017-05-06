import Auctions from '/imports/api/auctions.js';
import './auctions.html';

Template.auctions.viewmodel({
  auctions() {
    return Auctions.findAuctions();
  },
});
