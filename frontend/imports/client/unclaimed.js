import { Template } from 'meteor/templating';
import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Tokens from '/imports/api/tokens.js';

import './unclaimed.html';

Template.unclaimed.viewmodel({
  claim(event) {
    console.log(event);
  },
});
