import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Auctions } from '/imports/api/auctions.js';
import { Auctionlets } from '/imports/api/auctionlets.js';
import { Tokens, ETH, MKR } from '/imports/api/tokens.js';
import { Transactions } from '/imports/lib/_transactions.js';
import { currentAuctionId, currentAuctionletId } from '/imports/startup/client/routes.js';

import './main.html';
import '/imports/client/network-status.js';
import '/imports/startup/client/index.js';
import '/imports/helpers.js';

Template.body.onCreated(function() {
  console.log('On body created');
  this.autorun(() => {
    Auctionlets.watchBid();
    Tokens.watchEthApproval()
    Tokens.watchMkrApproval();
  });

  Tokens.watchEthAllowanceTransactions();
  Tokens.watchMkrAllowanceTransactions();
  Auctionlets.watchBidTransactions();
  Auctions.watchNewAuction();
  Auctions.watchNewAuctionTransactions();
  Auctionlets.watchClaimTransactions();

  console.log('AuctionId:', currentAuctionId)
})

Template.balance.viewmodel({
  account() {
    return Session.get("address")
  }
});

Template.auction.viewmodel({
  auction() {
    let singleAuction = Auctions.findAuction()
    return singleAuction;
  },
  contractaddress() {
    return TokenAuction.objects.auction.address;
  }
});

Template.auctionlet.viewmodel({
  auctionlet() {
    let singleAuctionlet = Auctionlets.findAuctionlet()
    let singleAuction = Auctions.findAuction()
    if(singleAuctionlet != undefined && singleAuction != undefined) {
      let requiredBid = Auctionlets.calculateRequiredBid(singleAuctionlet.buy_amount, singleAuction.min_increase)
      this.bid(web3.fromWei(requiredBid))
    }
    return singleAuctionlet
  },
  bid: 0,
  bidMessage() {
    return Session.get('bidMessage')
  },
  create(event) {
    event.preventDefault();
    Session.set('bidMessage', null)
    let auctionletBid = web3.toWei(this.bid())
    let auction = Auctions.findAuction();
    let auctionlet = Auctionlets.findAuctionlet()

    if(auction != undefined && Tokens.isBalanceSufficient(auctionletBid, auction.buying)) {
      if(auctionlet != undefined && auctionletBid >= Auctionlets.calculateRequiredBid(auctionlet.buy_amount, auction.min_increase)) {
        Auctionlets.doBid(auctionletBid);
      }
      else {
        Session.set('bidMessage', 'Bid is not high enough')
      }
    }
    else {
      Session.set('bidMessage', 'Your balance is insufficient for your current bid')
    }
  },
  expired() {
    let auctionlet = Auctionlets.findAuctionlet()
    return auctionlet != undefined && auctionlet.isExpired
  },
  unclaimed() {
    let auctionlet = Auctionlets.findAuctionlet()
    return auctionlet != undefined && auctionlet.auction_id != "0" && auctionlet.unclaimed
  },
  auctionwinner() {
    let auctionlet = Auctionlets.findAuctionlet()
    return this.expired() && auctionlet != undefined && Session.get('address') == auctionlet.last_bidder && auctionlet.unclaimed
  },
  claimMessage() {
    return Session.get('claimMessage')
  },
  claim(event) {
    event.preventDefault();
    let auctionlet = Auctionlets.findAuctionlet()
    if(auctionlet.unclaimed && this.expired()) {
      Auctionlets.doClaim(currentAuctionletId)
    }
  }
});

Template.newauction.viewmodel({
  sellamount: 0,
  startbid: 0,
  minimumincrease: 0,
  duration: 0,
  newAuctionMessage() {
    return Session.get('newAuctionMessage')
  },
  newAuctionUrl() {
    return Session.get('newAuctionUrl')
  },
  create(event) {
    event.preventDefault();
    let weiSellAmount = web3.toWei(this.sellamount())
    let weiStartBid = web3.toWei(this.startbid())

    let newAuction = {
                      sellamount: weiSellAmount,
                      startbid: weiStartBid,
                      min_increase: this.minimumincrease(),
                      duration: this.duration()
                    }
    Session.set("newAuction", newAuction)
    Auctions.createAuction(web3.toWei(this.sellamount()));
  }
});

Template.transactions.viewmodel({
  transactions() {
    return Transactions.find({});
  }
});

Template.tokens.viewmodel({
  tokens() {
    return Tokens.find({});
  }
});