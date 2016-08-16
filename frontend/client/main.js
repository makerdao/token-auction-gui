import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Tokens from '/imports/api/tokens.js';

import '/imports/client/network-status.js';
import '/imports/client/balance.js';
import '/imports/client/newauction.js';
import '/imports/client/tokens.js';
import '/imports/client/transactions.js';
import '/imports/client/auction.js';

import '/imports/startup/client/index.js';
import '/imports/helpers.js';
import './main.html';

const timeRemaining = new ReactiveVar(0);

function doCountdown() {
  const singleAuctionlet = Auctionlets.findAuctionlet();
  const singleAuction = Auctions.findAuction();
  const currentTime = (new Date()).getTime();
  // console.log('current time', currentTime);
  if (singleAuction !== undefined && singleAuctionlet !== undefined) {
    // console.log('single auction:', singleAuction, ' and singleAuctionlet:', singleAuctionlet);
    const countdown = Math.round(((singleAuction.duration * 1000) -
                      (currentTime - singleAuctionlet.last_bid_time.getTime())) / 1000);
    // console.log(countdown);
    if (countdown >= 0) {
      timeRemaining.set(countdown);
    }
  }
}

Template.body.onCreated(function created() {
  this.autorun(() => {
    const network = Session.get('network');
    const address = Session.get('address');
    if (network && address) {
      Auctionlets.watchBid();
      Tokens.watchEthApproval();
      Tokens.watchMkrApproval();
    }
  });

  Tokens.watchEthAllowanceTransactions();
  Tokens.watchMkrAllowanceTransactions();
  Auctionlets.watchBidTransactions();
  Auctions.watchNewAuction();
  Auctions.watchNewAuctionTransactions();
  Auctionlets.watchClaimTransactions();
  Meteor.setInterval(doCountdown, 1000);
});

Template.auctionlet.viewmodel({
  auctionlet() {
    const singleAuctionlet = Auctionlets.findAuctionlet();
    const singleAuction = Auctions.findAuction();
    if (singleAuctionlet !== undefined && singleAuction !== undefined) {
      const requiredBid = Auctionlets.calculateRequiredBid(singleAuctionlet.buy_amount, singleAuction.min_increase);
      this.bid(web3.fromWei(requiredBid));
    }
    return singleAuctionlet;
  },
  bid: 0,
  bidMessage() {
    return Session.get('bidMessage').message;
  },
  bidMessageType() {
    return Session.get('bidMessage').type;
  },
  countdown() {
    return timeRemaining.get();
  },
  create(event) {
    event.preventDefault();
    Session.set('bidMessage', null);
    const auctionletBid = web3.toWei(this.bid());
    const auction = Auctions.findAuction();
    const auctionlet = Auctionlets.findAuctionlet();

    if (auction !== undefined && Tokens.isBalanceSufficient(auctionletBid, auction.buying)) {
      if (auctionlet !== undefined && auctionletBid >= Auctionlets.calculateRequiredBid(auctionlet.buy_amount,
      auction.min_increase)) {
        Auctionlets.doBid(auctionletBid);
      } else {
        Session.set('bidMessage', { message: 'Bid is not high enough', type: 'alert-danger' });
      }
    } else {
      Session.set('bidMessage', { message: 'Your balance is insufficient for your current bid', type: 'alert-danger' });
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
    return Session.get('claimMessage').message;
  },
  claimMessageType() {
    return Session.get('claimMessage').type;
  },
  claim(event) {
    event.preventDefault();
    const auctionlet = Auctionlets.findAuctionlet();
    if (auctionlet.unclaimed && this.expired()) {
      Auctionlets.doClaim(Session.get('currentAuctionletId'));
    }
  },
});
