import { Mongo } from 'meteor/mongo';
import { Balances } from './balances.js';
import { Transactions } from '../lib/_transactions.js';

const Auctionlets = new Mongo.Collection(null);

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
          base: result[6]
        };
        Auctionlets.insert(auctionlet);
      }
      else {
        console.log("auctionlet info error: ", error);
      }
    })
}

Auctionlets.bidOnAuctionlet = function(auctionletId, bidAmount, quantity) {
  TokenAuction.objects.auction.bid['uint256,uint256,uint256'](auctionletId, bidAmount, quantity, {gas: 1500000 }, function (error, result) {
    if(!error) {
      //TODO Add the necessary transaction info
      console.log(result)
      Transactions.add('bid', result, { auctionletId: auctionletId, bid: bidAmount })
      console.log(result);
    }
    else {
      console.log("error: ", error);
    }
  })
}

Auctionlets.doBid = function(bidAmount) {
  Balances.setEthAllowance(bidAmount);
}

Auctionlets.watchBid = function() {
  TokenAuction.objects.auction.Bid(function (error, result) {
    //TODO Set this via session and template
    //document.getElementById("spnPlacingBid").style.display = "none";
    if(!error) {
      //Transactions.add('bid', result.transactionHash, { id: idx, status: Status.BID })
      console.log('bid is set');
      Auctionlets.getAuctionlet();
    }
    else {
      console.log("error: ", error);
    }
  }); 
}

Auctionlets.calculateRequiredBid = function(buy_amount, min_increase) {
  return web3.toBigNumber(buy_amount).mul(100 + min_increase).div(100)
}

Auctionlets.findAuctionlet = function() {
  return Auctionlets.findOne({"auctionletId": Meteor.settings.public.auctionletId});
}

export { Auctionlets }