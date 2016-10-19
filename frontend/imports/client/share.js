import { Template } from 'meteor/templating';
import Auctions from '/imports/api/auctions.js';
import './share.html';

Template.share.viewmodel({
  shareUrl() {
    // TODO: get real url
    const url = 'https://makerdao.github.io/weekly-mkr-auction';
    const singleAuction = Auctions.findAuction();
    return `${url}/#!/auction/${singleAuction.auctionId}`;
  },
  copy() {
    const el = document.querySelector('#shareTextbox');
    el.select();
    document.execCommand('copy');
  },
});
