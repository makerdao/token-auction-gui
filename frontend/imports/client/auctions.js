import Auctionlets from '/imports/api/auctionlets.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveArray } from 'meteor/templates:array';
import './auctions.html';

const timeRemaining = new ReactiveArray();

function doCountdown() {
  const auctionlets = Auctionlets.find({ });
  const currentTime = (new Date()).getTime();
  let countdown = 0;
  const countdownArray = [];

  auctionlets.forEach((auctionlet) => {
    if (auctionlet.duration !== 'undefined' && auctionlet.duration >= 0) {
      countdown = Math.round(((auctionlet.duration * 1000) -
                    (currentTime - auctionlet.last_bid_time.getTime())));
      // console.log(countdown);
      if (countdown >= 0) {
        /* if (typeof timeRemaining[auctionlet.auctionletId] === 'undefined') {
          timeRemaining[auctionlet.auctionletId] = new ReactiveVar(0);
        }*/
        countdownArray[auctionlet.auctionletId] = countdown;
      }
    }
  });
  timeRemaining.set(countdownArray);
  // console.log(timeRemaining);
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
    return timeRemaining.get()[auctionletId];
  },
  loadingAuctionlets() {
    return (Auctionlets.find({ }).count() === 0);
  }
});
