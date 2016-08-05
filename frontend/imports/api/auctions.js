import { Mongo } from 'meteor/mongo';
import { Tokens } from './tokens.js';
import { Transactions } from '../lib/_transactions.js';
import { auctionPath } from '/imports/startup/routes.js';

const Auctions = new Mongo.Collection(null);
const AUCTION_GAS = 1000000

Auctions.getAuction = function() {
  let currentAuctionId = Session.get('currentAuctionId')
  TokenAuction.objects.auction.getAuctionInfo(currentAuctionId, function (error, result) {
    if(!error) {
      Auctions.remove({});
      var auction = {
        auctionId: currentAuctionId,
        creator: result[0],
        selling: result[1],
        buying: result[2],
        start_bid: result[3].toString(10),
        min_increase: result[4].toNumber(),
        min_decrease: result[5].toNumber(),
        sell_amount: result[6].toString(10),
        duration: result[7].toNumber(),
        reversed: result[8],
        unsold: result[9]
      };
      Auctions.insert(auction);
    }
    else {
      console.log("error: ", error);
    }
  })
}

Auctions.createAuction = function(sellAmount) {
    Tokens.setMkrAllowance(sellAmount);
}

Auctions.newAuction = function(account, selling, buying, sellAmount, startBid, minIncrease, duration) {
    TokenAuction.objects.auction.newAuction(account, selling, buying, sellAmount, startBid,
    minIncrease, duration, {gas: AUCTION_GAS }, function (error, result) {
      if(!error) {
        console.log('New auction transaction started')
        Transactions.add('auction', result, { selling: selling, sellAmount: sellAmount })
      }
      else {
          console.log(error);
      }
    });
}

Auctions.watchNewAuction = function() {
      TokenAuction.objects.auction.NewAuction(function (error, result) {
      if(!error) {
        let auctionId = result.args.id.toNumber()
        console.log("AuctionId: ", auctionId)
        let auctionUrl = Meteor.absoluteUrl() + '#' + auctionPath + auctionId
        Session.set('newAuctionUrl', auctionUrl)
      }
      else {
        console.log("error: ", error);
      }
    });
}

Auctions.watchNewAuctionTransactions = function() {
  Transactions.observeRemoved('auction', function (document) {
      if (document.receipt.logs.length === 0) {
        console.log('Creating auction went wrong')
        Session.set('newAuctionMessage', 'Error creating new auction')
      } else {
        console.log('Creating auction is succesful')
        Session.set('newAuctionMessage', 'New Auction successfully created')
      }
  })
}

Auctions.findAuction = function() {
  return Auctions.findOne({"auctionId": Session.get('currentAuctionId')})
}

export { Auctions }