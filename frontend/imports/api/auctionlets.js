import { Mongo } from 'meteor/mongo';

const Auctionlets = new Mongo.Collection(null);

Auctionlets.findAuctionlet = function findAuctionlet() {
  return Auctionlets.findOne({ auctionletId: Session.get('currentAuctionletId') });
};

Auctionlets.getAuctionletInfo = function getAuctionletInfo(auctionletId) {
  return new Promise((resolve, reject) => {
    TokenAuction.objects.auction.getAuctionletInfo(auctionletId, (error, result) => {
      // we assume that if result[0] (auctionId) is 0 then the auctionlet is not valid anymore
      // this is a way to detect that the getAuctionInfo(...) contract call actually failed
      if (!error & (result[0] != 0)) {
        const auctionlet = {
          auctionletId: auctionletId,
          auctionId: result[0].toString(10),
          last_bidder: result[1],
          last_bid_time: new Date(result[2].toNumber() * 1000),
          buy_amount: result[3].toString(10),
          sell_amount: result[4].toString(10),
          unit_price: result[3].div(result[4]).toString(10),
          unclaimed: result[5],
          base: result[6]
        };
        resolve(auctionlet);
      } else {
        reject(error);
      }
    });
  });
};

Auctionlets.isExpired = function checkExpired(auctionletId) {
  return new Promise((resolve, reject) => {
    TokenAuction.objects.auction.isExpired(auctionletId, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

Auctionlets.initialize = function initialize() {
  // clear existing auctionlets collection
  Auctionlets.remove({ });

  // discover existing auctionlets from past auction creation events
  // (every time a new auction is created, one base auctionlet gets created as well)
  TokenAuction.objects.auction.LogNewAuction({ }, { fromBlock: 0 }).get((error, events) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    Promise.all(events
      .map((event) => event.args['base_id'].toNumber())
      .map((auctionletId) => Auctionlets.syncAuctionlet(auctionletId)));
  });

  // discover even more existing auctionlets from past split events
  TokenAuction.objects.auction.LogSplit({ }, { fromBlock: 0 }).get((error, events) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    Promise.all(events
      .map((event) => event.args['split_id'].toNumber())
      .map((auctionletId) => Auctionlets.syncAuctionlet(auctionletId)));
  });

  // watch future auction creation events
  // (one auctionlet gets created on each such occasion)
  TokenAuction.objects.auction.LogNewAuction((error, event) => {
    const auctionletId = event.args['base_id'].toNumber();
    Auctionlets.syncAuctionlet(auctionletId);
  });

  // watch future auctionlet splits, if one happens we have to sync both auctionlets
  // (the old one has changed, the new one has been just created and we should include it)
  TokenAuction.objects.auction.LogSplit((error, event) => {
    const oldAuctionletId = event.args['base_id'].toNumber();
    const newAuctionletId = event.args['split_id'].toNumber();
    Auctionlets.syncAuctionlet(oldAuctionletId);
    Auctionlets.syncAuctionlet(newAuctionletId);
  });

  // watch future bids and sync the auctionlet when one happends
  TokenAuction.objects.auction.LogBid((error) => {
    const auctionletId = event.args['auctionlet_id'].toNumber();
    Auctionlets.syncAuctionlet(auctionletId);
  });

  //TODO how to detect claims??
  //TODO how to detect expirations??
};

Auctionlets.syncAuctionlet = function syncAuctionlet(auctionletId) {
  return Promise.all([Auctionlets.getAuctionletInfo(auctionletId), Auctionlets.isExpired(auctionletId)]).then(values => {
    const auctionlet = values[0];
    auctionlet.expired = values[1];

    Auctionlets.remove({ auctionletId: auctionletId },
      () => Auctionlets.insert(auctionlet));
  }).catch(() =>
    Auctionlets.remove({ auctionletId: auctionletId })
  );
};

Auctionlets.sortByBuyAmountDesc = function sortByBuyAmountDesc(a, b) {
  let result = 0;
  if (a.buy_amount > b.buy_amount) {
    result = -1;
  } else if (a.buy_amount < b.buy_amount) {
    result = 1;
  } else {
    result = 0;
  }
  return result;
};

export default Auctionlets;
