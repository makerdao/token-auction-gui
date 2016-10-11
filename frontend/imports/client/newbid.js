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
    'keyup #inputUnitPrice, focus #inputUnitPrice, blur #inputUnitPrice, change #inputUnitPrice': function eventUnitPrice(event) {
      event.preventDefault();
      this.checkUnitPrice();
    },
  },
  checkBid() {
    if (Session.get('bidProgress') > 0) {
      return;
    }
    Session.set('newBidMessage', null);
    const auctionletBid = web3.toWei(this.bid(), 'ether');
    const auction = this.auction();
    const auctionlet = this.auctionlet();

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
  checkUnitPrice() {
    if (Session.get('bidProgress') > 0) {
      return;
    }
    Session.set('newBidMessage', null);
    // how much its selling times unit price
    const unitPrice = web3.toWei(this.unitPrice(), 'ether');
    if (Tokens !== undefined && this.auction() !== undefined) {
      if (Tokens.isBalanceSufficient(unitPrice, this.auction().buying)) {
        if (this.auctionlet() !== undefined && web3.toBigNumber(unitPrice)
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
    const auction = this.auction();
    const auctionlet = this.auctionlet();

    if (auction !== undefined && Tokens.isBalanceSufficient(auctionletBid, auction.buying)) {
      if (auctionlet !== undefined && web3.toBigNumber(auctionletBid)
      .gt(Auctionlets.calculateRequiredBid(auctionlet.buy_amount, auction.min_increase))) {
        console.log('New Bid Button', auctionlet.auctionletId, auctionletBid, auction.sell_amount);
        Auctionlets.doBid(auctionlet.auctionletId, auctionletBid, auction.sell_amount);
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
