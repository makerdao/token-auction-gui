import { Mongo } from 'meteor/mongo';
import callContractMethod from '../utils/etherscan-connector.js';
import Auctions from './auctions.js';

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

Auctionlets.discoverExistingAuctionlets = function discoverExistingAuctionlets() {
  // the first auctionlet gets created when a new auction is created
  TokenAuction.objects.auction.LogNewAuction({ }, { fromBlock: 0 }).get((error, events) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    Promise.all(events
      .map((event) => event.args['base_id'].toNumber())
      .map((auctionletId) => Auctionlets.syncAuctionlet(auctionletId)));
  });

  // more auctionlets get created on a split bid
  TokenAuction.objects.auction.LogSplit({ }, { fromBlock: 0 }).get((error, events) => {
    if (error) {
      console.log('error: ', error);
      return;
    }

    Promise.all(events
      .map((event) => event.args['split_id'].toNumber())
      .map((auctionletId) => Auctionlets.syncAuctionlet(auctionletId)));
  });
};

Auctionlets.getOpenAuctionlets = function getOpenAuctions() {
  if (typeof (TokenAuction.objects) !== 'undefined') {
    /* eslint-disable new-cap */
    TokenAuction.objects.auction.LogNewAuction({ }, { fromBlock: 0 }).get((error, result) => {
      if (!error) {
        const lastEventIndex = result.length - 1;
        // TODO: When splitting auctions is active we will need to get the max auctionlet id using another way
        const lastAuctionletId = result[lastEventIndex].args.id.toNumber();
        const auctionPromises = [];

        for (let i = 1; i <= lastAuctionletId; i++) {
          auctionPromises.push(Auctionlets.getAuctionletInfo(i));
        }
        Promise.all(auctionPromises).then((resultProm) => {
          const auctionPromises2 = [];
          const notFinishedAutions = [];
          for (let i = 0; i < resultProm.length; i++) {
            // console.log(resultProm[i]);
            if (resultProm[i].auctionletId && resultProm[i].unclaimed) {
              notFinishedAutions.push(resultProm[i]);
              auctionPromises2.push(Auctionlets.isExpired(resultProm[i].auctionletId));
            }
          }

          Promise.all(auctionPromises2).then((resultProm2) => {
            Auctionlets.remove({});
            for (let i = 0; i < resultProm2.length; i++) {
              // console.log(notFinishedAutions[i]);
              // console.log(resultProm2[i]);
              if (!resultProm2[i]) {
                notFinishedAutions[i].bids = 'undefined';
                notFinishedAutions[i].ttl = 'undefined';
                Auctionlets.insert(notFinishedAutions[i]);

                // Update Bids# asynchronously
                TokenAuction.objects.auction.LogBid({ auctionlet_id: notFinishedAutions[i].auctionletId },
                { fromBlock: 0 }).get((errorBids, resultBids) => {
                  if (!errorBids) {
                    Auctionlets.update({ auctionletId: notFinishedAutions[i].auctionletId },
                    { $set: { bids: resultBids.length } });
                  }
                });

                // Update Time Left asynchronously.
                // TODO: When splitting auctions is active we should only call the auction once per group of auctionlets
                Auctions.getAuction(notFinishedAutions[i].auction_id).then((resultAuction) => {
                  Auctionlets.update({ auctionletId: notFinishedAutions[i].auctionletId },
                  { $set: { ttl: resultAuction.ttl } });
                });
              }
            }
          });
        });
      }
    });
    /* eslint-enable new-cap */
  }
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

Auctionlets.watchBid = function watchBid() {
  TokenAuction.objects.auction.LogNewAuction((error, event) => {
    const auctionletId = event.args['base_id'].toNumber();
    Auctions.syncAuction(auctionletId);
  });

  TokenAuction.objects.auction.LogSplit((error, event) => {
    const auctionletId = event.args['split_id'].toNumber();
    Auctions.syncAuction(auctionletId);
  });

  TokenAuction.objects.auction.LogBid((error) => {
    const auctionletId = event.args['auctionlet_id'].toNumber();
    Auctions.syncAuction(auctionletId);
  });

  //TODO how to detect claims??
  //TODO how to detect expirations??
};

export default Auctionlets;
