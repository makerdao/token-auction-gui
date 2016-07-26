import { Mongo } from 'meteor/mongo';

const Auctions = new Mongo.Collection(null);

Auctions.getAuction = function() {
    TokenAuction.objects.auction.getAuctionInfo(Meteor.settings.public.auctionId, function (error, result) {
      if(!error) {
        Auctions.remove({});
        var auction = {
          auctionId: Meteor.settings.public.auctionId,
          creator: result[0],
          selling: result[1],
          buying: result[2],
          start_bid: result[3].toString(10),
          min_increase: result[4].toString(10),
          min_decrease: result[5].toString(10),
          sell_amount: result[6].toString(10),
          duration: result[7].toString(10),
          reversed: result[8],
          unsold: result[9]
        };
        Auctions.insert(auction);
      }
      else {
        console.log("error: ", error);
      }
    });
}

Auctions.newAuction = function(account, selling, buying, sellAmount, startBid, minIncrease, duration) {
    TokenAuction.objects.auction.newAuction(account, selling, 
    buying, sellAmount, startBid, minIncrease, duration, 
    {gas: 4700000 }, function (error, result) {
      if(!error) {
          console.log('New auction transaction started')
      }
      else {
          console.log(error);
      }
    });
}

export { Auctions }