import { Mongo } from 'meteor/mongo';

const Auctions = new Mongo.Collection(null);

Auctions.getAuction = function getAuction(auctionId) {
  const p = new Promise((resolve, reject) => {
    TokenAuction.objects.auction.getAuctionInfo(auctionId, (error, result) => {
      if (!error) {
        const auction = {
          auctionId,
          creator: result[0],
          selling: result[1],
          buying: result[2],
          start_bid: result[3].toString(10),
          min_increase: result[4].toNumber(),
          min_decrease: result[5].toNumber(),
          sell_amount: result[6].toString(10),
          duration: result[7].toNumber(),
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

Auctions.loadAuction = function loadAuction(auctionId) {
  if (typeof (TokenAuction.objects) !== 'undefined') {
    Auctions.getAuction(auctionId).then((auction) => {
      Auctions.remove({});
      Auctions.insert(auction);
    }, (error) => {
      console.log('error: ', error);
    });
  }
};

Auctions.watchNewAuction = function watchNewAuction() {
  /* eslint-disable new-cap */
  TokenAuction.objects.auction.LogNewAuction((error, result) => {
    const auctionId = result.args.id.toNumber();
    console.log('AuctionId: ', auctionId);
  });
  /* eslint-disable new-cap */
};

Auctions.findAuction = function findAuction() {
  return Auctions.findOne({ auctionId: Session.get('currentAuctionId') });
};

export default Auctions;
