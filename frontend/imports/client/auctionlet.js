import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';

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
  },
  auctionlet() {
    const singleAuctionlet = Auctionlets.findAuctionlet();
    return singleAuctionlet;
  },
  timeRemaining() {
    return timeRemaining.get();
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
