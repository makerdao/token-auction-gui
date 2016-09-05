import { Template } from 'meteor/templating';
import Auctions from '/imports/api/auctions.js';
import './auction.html';

Template.auction.viewmodel({
  auction() {
    const singleAuction = Auctions.findAuction();
    return singleAuction;
  },
});
