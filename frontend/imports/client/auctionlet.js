import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Tokens from '/imports/api/tokens.js';

import './auctionlet.html';

const timeRemaining = new ReactiveVar(0);

function doCountdown() {
  const singleAuctionlet = Auctionlets.findAuctionlet();
  const singleAuction = Auctions.findAuction();
  const currentTime = (new Date()).getTime();
  // console.log('current time', currentTime);
  if (singleAuction !== undefined && singleAuctionlet !== undefined) {
    // console.log('single auction:', singleAuction, ' and singleAuctionlet:', singleAuctionlet);
    const countdown = Math.round(((singleAuction.ttl * 1000) -
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
    const singleAuction = Auctions.findAuction();
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
});
