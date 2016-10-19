import { Template } from 'meteor/templating';
import Auctions from '/imports/api/auctions.js';
import './share.html';

Template.share.viewmodel({
  auction() {
    const singleAuction = Auctions.findAuction();
    return singleAuction;
  },
  absoluteUrl() {
    return 'https://makerdao.github.io/weekly-mkr-auction';
  },
});
