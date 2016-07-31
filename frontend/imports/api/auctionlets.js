import { Mongo } from 'meteor/mongo';
import { Tokens } from './tokens.js';
import { Transactions } from '../lib/_transactions.js';

const Auctionlets = new Mongo.Collection(null);

Auctionlets.findAuctionlet = function() {
  return Auctionlets.findOne({"auctionletId": Meteor.settings.public.auctionletId});
}

Auctionlets.getAuctionlet = function() {
    TokenAuction.objects.auction.getAuctionletInfo(Meteor.settings.public.auctionletId, function (error, result) {
      if(!error) {
        Auctionlets.remove({});
        var auctionlet = {
          auctionletId: Meteor.settings.public.auctionletId,
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
  TokenAuction.objects.auction.isExpired(Meteor.settings.public.auctionletId, function (error, result) {
    if(!error) {
        if(result) {
          Auctionlets.update({ auctionletId: Meteor.settings.public.auctionletId }, { $set: { isExpired: result } })
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
  TokenAuction.objects.auction.bid['uint256,uint256,uint256'](auctionletId, bidAmount, quantity, {gas: 1500000 }, function (error, result) {
    if(!error) {
      //TODO Add the necessary transaction info
      console.log(result)
      Transactions.add('bid', result, { auctionletId: auctionletId, bid: bidAmount.toString(10) })
      console.log(result);
    }
    else {
      console.log("error: ", error);
    }
  })
}

Auctionlets.watchBid = function() {
  TokenAuction.objects.auction.Bid(function (error, result) {
    //TODO Set this via session and template
    //document.getElementById("spnPlacingBid").style.display = "none";
    if(!error) {
      console.log('bid is set');
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
        //Show error in User interface
        console.log('bid went wrong')
      } else {
        //Show bid is succesful
        console.log('bid is succesful')
        console.log('auctionletId', document.object.auctionletId);
        console.log('bid', document.object.bid);
      }
  })
}

Auctionlets.doClaim = function(auctionletId) {
  TokenAuction.objects.auction.claim(auctionletId, {gas: 1500000 }, function (error, result) {
    if(!error) {
      Transactions.add('claim', result, { auctionletId: auctionletId })      
      console.log(result)
    }
    else {
      console.log("error: ", error);
    }
  })
}

Auctionlets.watchClaimTransactions = function() {
  Transactions.observeRemoved('claim', function (document) {
      if (document.receipt.logs.length === 0) {
        //Show error in User interface
        console.log('claim went wrong')
      } else {
        //TODO Show claim is succesful in UI
        console.log('claim is succesful')
        Auctionlets.getAuctionlet()
      }
  })
}

export { Auctionlets }