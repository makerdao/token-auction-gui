import { Template } from 'meteor/templating';
import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Tokens from '/imports/api/tokens.js';

import './newbid.html';

Template.newbid.viewmodel({
  onCreated() {
    Session.set('bidProgress', 0);
  },
  bid: 0,
  auction() {
    const singleAuctionlet = this.auctionlet();
    const singleAuction = Auctions.findOne({ auctionId: parseInt(singleAuctionlet.auction_id, 10) });
    if (singleAuctionlet !== undefined && singleAuction !== undefined) {
      const requiredBid = Auctionlets.calculateRequiredBid(singleAuctionlet.buy_amount, singleAuction.min_increase);
      if (this.bid() === 0) {
        console.log('set minimal bid');
        this.bid(web3.fromWei(requiredBid));
      }
    }
    return singleAuction;
  },
  events: {
    'keyup #inputBid, focus #inputBid, blur #inputBid, change #inputBid': function eventBid(event) {
      event.preventDefault();
      this.checkBid();
    },
  },
  checkBid() {
    if (Session.get('bidProgress') > 0) {
      return;
    }
    Session.set('newBidMessage', null);
    const auctionletBid = web3.toWei(this.bid(), 'ether');
    if (Tokens !== undefined && this.auction() !== undefined) {
      if (Tokens.isBalanceSufficient(auctionletBid, this.auction().buying)) {
        if (this.auctionlet() !== undefined && web3.toBigNumber(auctionletBid)
        .lt(Auctionlets.calculateRequiredBid(this.auctionlet().buy_amount, this.auction().min_increase))) {
          Session.set('newBidMessage', { message: 'Bid is not high enough', type: 'danger' });
        } else {
          Session.set('newBidMessage', null);
        }
      } else {
        Session.set('newBidMessage', {
          message: 'Your balance is insufficient for your current bid',
          type: 'danger' });
      }
    }
  },
  create(event) {
    event.preventDefault();
    if (Session.get('bidProgress') > 0) {
      return;
    }
    Session.set('newBidMessage', null);
    const auctionletBid = web3.toWei(this.bid());
    const auction = Auctions.findAuction();
    const auctionlet = Auctionlets.findAuctionlet();

    if (auction !== undefined && Tokens.isBalanceSufficient(auctionletBid, auction.buying)) {
      if (auctionlet !== undefined && web3.toBigNumber(auctionletBid)
      .gt(Auctionlets.calculateRequiredBid(auctionlet.buy_amount, auction.min_increase))) {
        Auctionlets.doBid(auctionletBid);
      } else {
        Session.set('newBidMessage', { message: 'Bid is not high enough', type: 'danger' });
      }
    } else {
      Session.set('newBidMessage', { message: 'Your balance is insufficient for your current bid', type: 'danger' });
    }
  },
  bidsDisabled() {
    return (Session.get('bidProgress') > 0 ? 'disabled' : '');
  },
  bidMessage() {
    return Session.get('newBidMessage') !== null ? Session.get('newBidMessage').message : Session.get('newBidMessage');
  },
  bidMessageType() {
    return Session.get('newBidMessage') !== null ? Session.get('newBidMessage').type : 'info';
  },
  bidProgress() {
    return Session.get('bidProgress');
  },
});
