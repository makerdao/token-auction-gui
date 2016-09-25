import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Tokens from '/imports/api/tokens.js';
import { moment } from 'meteor/momentjs:moment';

import './auctionlet.html';

const timeRemaining = new ReactiveVar(0);

function doCountdown() {
  const singleAuctionlet = Auctionlets.findAuctionlet();
  const singleAuction = Auctions.findAuction();
  const currentTime = (new Date()).getTime();
  // console.log('current time', currentTime);
  if (singleAuction !== undefined && singleAuctionlet !== undefined) {
    // console.log('single auction:', singleAuction, ' and singleAuctionlet:', singleAuctionlet);
    const countdown = Math.round(((singleAuction.duration * 1000) -
                      (currentTime - singleAuctionlet.last_bid_time.getTime())));
    // console.log(countdown);
    if (countdown >= 0) {
      timeRemaining.set(countdown);
    }
  }
}

Template.auctionlet.viewmodel({
  onCreated() {
    Meteor.setInterval(doCountdown, 1000);
    Session.set('bidProgress', 0);
  },
  autorun() {
    this.checkBid();
  },
  events: {
    'keyup #inputBid': function keyUpBid(event) {
      event.preventDefault();
      this.checkBid();
    },
  },
  auctionlet() {
    const singleAuctionlet = Auctionlets.findAuctionlet();
    const singleAuction = Auctions.findAuction();
    if (singleAuctionlet !== undefined && singleAuction !== undefined) {
      const requiredBid = Auctionlets.calculateRequiredBid(singleAuctionlet.buy_amount, singleAuction.min_increase);
      if (this.bid() === 0) {
        console.log('set minimal bid');
        this.bid(web3.fromWei(requiredBid));
      }
    }
    return singleAuctionlet;
  },
  bid: 0,
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
  countdown() {
    if (timeRemaining.get() !== undefined) {
      const time = moment.duration(timeRemaining.get());
      return `${time.days()}d ${time.hours()}h ${time.minutes()}m ${time.seconds()}s`;
    }
    return timeRemaining.get();
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
  checkBid() {
    if (Session.get('bidProgress') > 0) {
      return;
    }
    if (!$('#inputBid').is(':focus')) {
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
  expired() {
    const auctionlet = Auctionlets.findAuctionlet();
    return auctionlet !== undefined && auctionlet.isExpired;
  },
  unclaimed() {
    const auctionlet = Auctionlets.findAuctionlet();
    return auctionlet !== undefined && auctionlet.auction_id !== '0' && auctionlet.unclaimed;
  },
  auctionwinner() {
    const auctionlet = Auctionlets.findAuctionlet();
    return this.expired() && auctionlet !== undefined && Session.get('address') === auctionlet.last_bidder
    && auctionlet.unclaimed;
  },
  claimMessage() {
    return Session.get('claimMessage') !== null ? Session.get('claimMessage').message : Session.get('claimMessage');
  },
  claimMessageType() {
    return Session.get('claimMessage') !== null ? Session.get('claimMessage').type : 'info';
  },
  claim(event) {
    event.preventDefault();
    const auctionlet = Auctionlets.findAuctionlet();
    if (auctionlet.unclaimed && this.expired()) {
      Auctionlets.doClaim(Session.get('currentAuctionletId'));
    }
  },
});
