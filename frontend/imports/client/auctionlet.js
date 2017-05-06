import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Tokens from '/imports/api/tokens.js';

import './auctionlet.html';

function calculateTimeRemaining(auctionletId, timeRemaining) {
  const auctionlet = Auctionlets.findAuctionlet(auctionletId);
  const auction = Auctions.findAuction(auctionlet.auction_id);
  const currentTime = (new Date()).getTime();
  if (auction !== undefined && auctionlet !== undefined) {
    const countdown = Math.round(((auction.ttl * 1000) - (currentTime - auctionlet.last_bid_time.getTime())));
    if (countdown >= 0) {
      timeRemaining.set(countdown);
    }
  }
}

Template.auctionlet.viewmodel({
  onCreated() {
    const instance = Template.instance();
    const auctionletId = instance.data.auctionlet.auctionlet_id;
    instance.timeRemaining = new ReactiveVar(0);
    const calculateTime = () => calculateTimeRemaining(auctionletId, instance.timeRemaining);
    Meteor.setInterval(calculateTime, 1000);
    calculateTime();
  },
  timeRemaining() {
    return Template.instance().timeRemaining.get();
  },
});
