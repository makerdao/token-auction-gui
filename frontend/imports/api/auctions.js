import { Mongo } from 'meteor/mongo';

const Auctions = new Mongo.Collection(null);

Auctions.findAuctions = function findAuctions() {
  return Auctions.find({ }, {sort: {auction_id: -1}});
};

Auctions.findAuction = function findAuction() {
  return Auctions.findOne({ auction_id: Session.get('currentAuctionId') });
};

Auctions.getAuction = function getAuction(auctionId) {
  return new Promise((resolve, reject) => {
    TokenAuction.objects.auction.getAuctionInfo(auctionId, (error, result) => {
      if (!error) {
        const auction = {
          auction_id: auctionId,
          creator: result[0],
          selling: result[1],
          buying: result[2],
          start_bid: result[3].toString(10),
          min_increase: result[4].toNumber(),
          min_decrease: result[5].toNumber(),
          sell_amount: result[6].toString(10),
          ttl: result[7].toNumber(),
          reversed: result[8],
          unsold: result[9],
        };
        resolve(auction);
      } else {
        reject(error);
      }
    });
  });
};

Auctions.initialize = function initialize() {
  // discover existing auctions from past auction creation events
  TokenAuction.objects.auction.LogNewAuction({ }, { fromBlock: 0 }).get((error, events) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    Promise.all(events
      .map((event) => event.args['id'].toNumber())
      .map((auctionId) => Auctions.syncAuction(auctionId)));
  });

  // watch future auction creation events for new auctions being created
  TokenAuction.objects.auction.LogNewAuction((error, result) => {
    const auctionId = result.args['id'].toNumber();
    Auctions.syncAuction(auctionId);
  });
};

Auctions.syncAuction = function syncAuction(auctionId) {
  return Auctions.getAuction(auctionId).then((auction) => {
    Auctions.remove({ auction_id: auctionId }, function() {
      Auctions.insert(auction)
    });
  }).catch((error) =>
    console.log('error: ', error));
};

export default Auctions;
