import { Mongo } from 'meteor/mongo';

const Auctionlets = new Mongo.Collection(null);

Auctionlets.getAuctionlet = function() {
    TokenAuction.objects.auction.getAuctionletInfo(Meteor.settings.public.auctionletId, function (error, result) {
      if(!error) {
        Auctionlets.remove({});
        var auctionlet = {
          auctionletId: Meteor.settings.public.auctionletId,
          auction_id: result[0].toNumber(),
          last_bidder: result[1],
          last_bid_time: new Date(result[2].toNumber()*1000),
          buy_amount: result[3].toNumber(),
          sell_amount: result[4].toNumber(),
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

export { Auctionlets }