import Auctionlets from '/imports/api/auctionlets.js';
import { ReactiveVar } from 'meteor/reactive-var';
import Auctions from '/imports/api/auctions.js';
import './auctions.html';

const timeRemaining = [];

function doCountdown() {
  const auctionlets = Auctionlets.find({ });
  const currentTime = (new Date()).getTime();
  let countdown = 0;

  auctionlets.forEach((auctionlet) => {
    if (auctionlet.duration >= 0) {
      countdown = Math.round(((auctionlet.duration * 1000) -
                    (currentTime - auctionlet.last_bid_time.getTime())));
      // console.log(countdown);
      if (countdown >= 0) {
        timeRemaining[auctionlet.auctionletId] = new ReactiveVar(0);
        timeRemaining[auctionlet.auctionletId].set(countdown);
      }
    }
  });
  console.log(timeRemaining);
}

Template.auctions.viewmodel({
  onCreated() {
    Meteor.setInterval(doCountdown, 1000);
  },
  auctionlets() {
    const auctionlets = Auctionlets.find({ });
    return auctionlets;
  },
  timeRemaining(auctionletId) {
    return timeRemaining[auctionletId];
  },
});
