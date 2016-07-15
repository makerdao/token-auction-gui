//import { web3 } from 'meteor/ethereum:web3';
import { Auctions } from '../../api/auctions.js';
import { Auctionlets } from '../../api/auctionlets.js';

Meteor.startup(function() {
    console.log('Running startup function');
    var dapple = new tokenauction.class(web3, 'morden');
    dapple.objects.auction.getAuctionInfo(Meteor.settings.public.auctionId, {gas: 500000 },function (error, result) {
      if(!error) {
        Auctions.remove({});
        var auction = {
          auctionId: Meteor.settings.public.auctionId,
          creator: result[0],
          selling: result[1],
          buying: result[2],
          start_bid: result[3],
          min_increase: result[4],
          min_decrease: result[5],
          sell_amount: result[6],
          duration: result[7],
          reversed: result[8],
          unsold: result[9]
        };
        Auctions.insert(auction);
      }
      else {
        console.log("error: ", error);
      }
    });

    dapple.objects.auction.getAuctionletInfo(Meteor.settings.public.auctionletId, {gas: 500000 }, function (error, result) {
      if(!error) {
        console.log(result);
        Auctionlets.remove({});
        var auctionlet = {
          auctionletId: Meteor.settings.public.auctionletId,
          auction_id: result[0],
          last_bidder: result[1],
          last_bid_time: result[2],
          buy_amount: result[3],
          sell_amount: result[4],
          unclaimed: result[5],
          base: result[6]
        };
        Auctionlets.insert(auctionlet);
      }
      else {
        console.log("error: ", error);
      }
    })
})