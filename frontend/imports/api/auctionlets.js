import { Mongo } from 'meteor/mongo';
import { Tokens } from './tokens.js';
import { Transactions } from '../lib/_transactions.js';

const Auctionlets = new Mongo.Collection(null);
const BID_GAS = 1000000
const CLAIM_GAS = 1000000

Auctionlets.findAuctionlet = function() {
  return Auctionlets.findOne({"auctionletId": Session.get('currentAuctionletId')});
}

Auctionlets.getAuctionlet = function() {
  let currentAuctionletId = Session.get('currentAuctionletId')
  TokenAuction.objects.auction.getAuctionletInfo(currentAuctionletId, function (error, result) {
    if(!error) {
      Auctionlets.remove({});
      var auctionlet = {
        auctionletId: currentAuctionletId,
        auction_id: result[0].toString(10),
        last_bidder: result[1],
        last_bid_time: new Date(result[2].toNumber()*1000),
        buy_amount: result[3].toString(10),
        sell_amount: result[4].toString(10),
        unclaimed: result[5],
        base: result[6],
        isExpired: false
      };
      Auctionlets.insert(auctionlet);
      Auctionlets.syncExpired();
    }
    else {
      console.log("auctionlet info error: ", error);
    }
  })
}

//Check whether an auctionlet is expired and if so update the auctionlet
Auctionlets.syncExpired = function() {
  let currentAuctionletId = Session.get('currentAuctionletId')
  TokenAuction.objects.auction.isExpired(currentAuctionletId, function (error, result) {
    if(!error) {
        if(result) {
          Auctionlets.update({ auctionletId: currentAuctionletId }, { $set: { isExpired: result } })
        }
    }
    else {
      console.log('syncExpired error', error)
    }
  })
}

Auctionlets.calculateRequiredBid = function(buy_amount, min_increase) {
  let requiredBid = web3.toBigNumber(buy_amount).mul(100 + min_increase).div(100)
  return requiredBid
}

Auctionlets.doBid = function(bidAmount) {
  console.log('doBid function called')
  Tokens.setEthAllowance(bidAmount);
}

Auctionlets.bidOnAuctionlet = function(auctionletId, bidAmount, quantity) {
  TokenAuction.objects.auction.bid['uint256,uint256,uint256'](auctionletId, bidAmount, quantity, {gas: BID_GAS }, function (error, result) {
    if(!error) {
      console.log(result)
      Transactions.add('bid', result, { auctionletId: auctionletId, bid: bidAmount.toString(10) })
    }
    else {
      console.log("error: ", error);
    }
  })
}

Auctionlets.watchBid = function() {
  TokenAuction.objects.auction.Bid(function (error, result) {
    if(!error) {
      console.log('Bid is set');
      Auctionlets.getAuctionlet();
    }
    else {
      console.log("error: ", error);
    }
  });
}

Auctionlets.watchBidTransactions = function() {
  Transactions.observeRemoved('bid', function (document) {
      if (document.receipt.logs.length === 0) {
        Session.set('bidMessage', 'Error placing bid')
      } else {
        console.log('bid', document.object.bid);
        Session.set('bidMessage', 'Bid placed succesfully')
      }
  })
}

Auctionlets.doClaim = function(auctionletId) {
  TokenAuction.objects.auction.claim(auctionletId, {gas: CLAIM_GAS }, function (error, result) {
    if(!error) {
      Transactions.add('claim', result, { auctionletId: auctionletId })
      Session.set('claimMessage', 'Claiming your tokens')
    }
    else {
      console.log("Claim error: ", error);
      Session.set('claimMessage', 'Error claiming tokens: ' + error.toString())
    }
  })
}

Auctionlets.watchClaimTransactions = function() {
  Transactions.observeRemoved('claim', function (document) {
      if (document.receipt.logs.length === 0) {
        console.log('Claim went wrong')
        Session.set('claimMessage', 'Error claiming tokens')
      } else {
        console.log('Claim is succesful')
        Session.set('claimMessage', 'Tokens successfully claimed')
        Auctionlets.getAuctionlet()
      }
  })
}

export { Auctionlets }