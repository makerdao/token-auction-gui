import { Template } from 'meteor/templating';
import Auctionlets from '/imports/api/auctionlets.js';

import './unclaimed.html';

Template.unclaimed.viewmodel({
  auctionlets() {
    const auctionlets = Auctionlets.find({ isExpired: true, unclaimed: true });
    return auctionlets;
  },
  count() {
    return this.auctionlets().fetch().length;
  },
});
