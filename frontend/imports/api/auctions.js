import { Mongo } from 'meteor/mongo';

const Auctions = new Mongo.Collection(null);

Auctions.TYPE_FORWARD = 'forward';
Auctions.TYPE_REVERSE = 'reverse';
Auctions.TYPE_TWO_WAY = 'two_way';

Auctions.findAuctions = function findAuctions() {
  return Auctions.find({ }, {sort: {auction_id: -1}});
};

Auctions.findAuction = function findAuction(auctionId) {
  return Auctions.findOne({ auction_id: auctionId });
};

Auctions.helpers({
  type() {
    if ((this.min_increase > 0) && (this.min_decrease > 0)) return Auctions.TYPE_TWO_WAY;
    else if (this.min_increase > 0) return Auctions.TYPE_FORWARD;
    else return Auctions.TYPE_REVERSE;
  },
  isForward: function isForward() {
    return this.type() === Auctions.TYPE_FORWARD;
  },
  isReverse: function isForward() {
    return this.type() === Auctions.TYPE_REVERSE;
  },
  isTwoWay: function isForward() {
    return this.type() === Auctions.TYPE_TWO_WAY;
  }
});

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
          unit_price_forward: result[6].div(result[3]).toString(10),
          unit_price_reverse: result[3].div(result[6]).toString(10),
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
    Auctions.upsert({ auction_id: auctionId }, { $set: auction });
  }).catch((error) =>
    console.log('error: ', error));
};

export default Auctions;
