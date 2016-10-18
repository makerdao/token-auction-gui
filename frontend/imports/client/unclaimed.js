import { Template } from 'meteor/templating';
import Auctionlets from '/imports/api/auctionlets.js';

import './unclaimed.html';

Template.unclaimed.viewmodel({
  auctionlets() {
    const auctionlets = Auctionlets.find({ isExpired: true });
    return auctionlets;
  },
  count() {
    console.log('AAAAAAA', this.auctionlets().fetch().length);
    return this.auctionlets().fetch().length;
  },
  claim(event) {
    console.log(event);
  },
});
