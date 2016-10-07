import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Tokens from '/imports/api/tokens.js';

import './bid.html';

Template.auctionlet.viewmodel({
  onCreated() {
    Session.set('bidProgress', 0);
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
    const auction = Auctions.findAuction();
    const auctionlet = Auctionlets.findAuctionlet();
    if (Tokens !== undefined && auction !== undefined) {
      if (Tokens.isBalanceSufficient(auctionletBid, auction.buying)) {
        if (auctionlet !== undefined && web3.toBigNumber(auctionletBid)
        .lt(Auctionlets.calculateRequiredBid(auctionlet.buy_amount, auction.min_increase))) {
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
