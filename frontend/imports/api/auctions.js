import { Mongo } from 'meteor/mongo';

const Auctions = new Mongo.Collection(null);

Auctions.getAuction = function getAuction(auctionId) {
  const p = new Promise((resolve, reject) => {
    TokenAuction.objects.auction.getAuctionInfo(auctionId, (error, result) => {
      if (!error) {
        const auction = {
          auctionId: auctionId,
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
  return p;
};

//TODO refactor it so it returns a promise
Auctions.syncAuction = function syncAuction(auctionId) {
  Auctions.getAuction(auctionId).then((auction) => {
    Auctions.remove({ auctionId: auctionId }, function() {
      Auctions.insert(auction)
    });
  }, (error) => {
    console.log('error: ', error);
  });
};

Auctions.discoverExistingAuctions = function discoverExistingAuctions() {
  TokenAuction.objects.auction.LogNewAuction({ }, { fromBlock: 0 }).get((error, events) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    Promise.all(events
      .map((event) => event.args['id'].toNumber())
      .map((auctionId) => Auctions.syncAuction(auctionId)));
  });
};

Auctions.loadAuction = function loadAuction(auctionId) {
  Auctions.syncAuction(auctionId);
};

Auctions.watchNewAuctions = function watchNewAuctions() {
  TokenAuction.objects.auction.LogNewAuction((error, result) => {
    const auctionId = result.args['id'].toNumber();
    Auctions.syncAuction(auctionId);
  });
};

Auctions.findAuction = function findAuction() {
  return Auctions.findOne({ auctionId: Session.get('currentAuctionId') });
};

export default Auctions;
