import { Mongo } from 'meteor/mongo';
import Tokens from './tokens.js';
import Transactions from './transactions.js';
import prettyError from '../utils/prettyError.js';
import callContractMethod from '../utils/etherscan-connector.js';

const Auctionlets = new Mongo.Collection(null);
const BID_GAS = 1000000;
const CLAIM_GAS = 1000000;

Auctionlets.findAuctionlet = function findAuctionlet() {
  return Auctionlets.findOne({ auctionletId: Session.get('currentAuctionletId') });
};

Auctionlets.checkExpired = function checkExpired(auctionletId) {
  const p = new Promise((resolve, reject) => {
    TokenAuction.objects.auction.isExpired(auctionletId, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
  return p;
};

Auctionlets.getAuctionlet = function getAuctionlet(auctionletId) {
  const p = new Promise((resolve, reject) => {
    TokenAuction.objects.auction.getAuctionletInfo(auctionletId, (error, result) => {
      if (!error) {
        const auctionlet = {
          auctionletId,
          auction_id: result[0].toString(10),
          last_bidder: result[1],
          last_bid_time: new Date(result[2].toNumber() * 1000),
          buy_amount: result[3].toString(10),
          sell_amount: result[4].toString(10),
          unit_price: result[3].div(result[4]).toString(10),
          unclaimed: result[5],
          base: result[6],
          isExpired: false,
        };
        resolve(auctionlet);
      } else {
        reject(error);
      }
    });
  });
  return p;
};

Auctionlets.getOpenAuctionlets = function getOpenAuctions() {
  if (typeof (TokenAuction.objects) !== 'undefined') {
    /* eslint-disable new-cap */
    TokenAuction.objects.auction.NewAuction({ }, { fromBlock: 0 }).get((error, result) => {
      if (!error) {
        const lastEventIndex = result.length - 1;
        // TODO:When splitting auctions is active we will need to get the max auctionlet id using another way
        const lastAuctionletId = result[lastEventIndex].args.id.toNumber();
        const auctionPromises = [];

        for (let i = 1; i <= lastAuctionletId; i++) {
          auctionPromises.push(Auctionlets.getAuctionlet(i));
        }
        Promise.all(auctionPromises).then((resultProm) => {
          const auctionPromises2 = [];
          const notFinishedAutions = [];
          for (let i = 0; i < resultProm.length; i++) {
            // console.log(resultProm[i]);
            if (resultProm[i].auctionletId && resultProm[i].unclaimed) {
              notFinishedAutions.push(resultProm[i]);
              auctionPromises2.push(Auctionlets.checkExpired(resultProm[i].auctionletId));
            }
          }

          Promise.all(auctionPromises2).then((resultProm2) => {
            Auctionlets.remove({});
            for (let i = 0; i < resultProm2.length; i++) {
              // console.log(notFinishedAutions[i]);
              // console.log(resultProm2[i]);
              if (!resultProm2[i]) {
                Auctionlets.insert(notFinishedAutions[i]);
              }
            }
          });
        });
      }
    });
    /* eslint-enable new-cap */
  }
};

Auctionlets.loadAuctionlet = function loadAuctionlet(auctionletId) {
  if (typeof (TokenAuction.objects) !== 'undefined') {
    Auctionlets.getAuctionlet(auctionletId).then((auctionlet) => {
      Auctionlets.remove({});
      Auctionlets.insert(auctionlet);
      Auctionlets.syncExpired();
      if (auctionlet.unclaimed) {
        Auctionlets.loadAuctionletBidHistory(auctionletId);
      } else {
        Auctionlets.loadAuctionletClaimedBid(auctionletId);
      }
    }, (error) => {
      console.log('auctionlet info error: ', error);
    });
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

Auctionlets.loadAuctionletClaimedBid = function loadAuctionletClaimedBid(auctionletId) {
  // Check on local node or Etherscan if there's info
  /* eslint-disable new-cap */
  TokenAuction.objects.auction.Bid({ auctionlet_id: auctionletId }, { fromBlock: 0 }).get((err, res) => {
    const lastIndex = res.length - 1;
    const blockNumber = res[lastIndex].blockNumber;
    Auctionlets.loadAuctionletBidHistoryDetail(auctionletId, blockNumber).then((r) => {
      const update = {
        last_bidder: r.last_bidder,
        last_bid_time: r.last_bid_time,
        buy_amount: r.buy_amount,
        sell_amount: r.sell_amount,
        unit_price: r.unit_price,
      };
      Auctionlets.update({ auctionletId }, { $set: update });
    });
  });
  /* eslint-enable new-cap */
};

Auctionlets.loadAuctionletBidHistory = function loadAuctionletBidHistory(auctionletId) {
  /* eslint-disable new-cap */
  if (typeof (TokenAuction.objects) !== 'undefined') {
    const bidPromises = [];
    TokenAuction.objects.auction.Bid({ auctionlet_id: auctionletId }, { fromBlock: 0 }).get((error, result) => {
      for (let i = 0; i < result.length; i++) {
        bidPromises.push(Auctionlets.loadAuctionletBidHistoryDetail(auctionletId, result[i].blockNumber));
      }
      Promise.all(bidPromises).then((resultProm) => {
        const historySorted = resultProm.sort(Auctionlets.sortByBuyAmountDesc);
        Auctionlets.update({ auctionletId }, { $set: { history: historySorted } });
      });
    });
  }
  /* eslint-enable new-cap */
};

Auctionlets.loadAuctionletBidHistoryDetail = function loadAuctionletBidHistoryDetail(auctionletId, blockNumber) {
  const bidPromise = new Promise((resolve, reject) => {
    TokenAuction.objects.auction.getAuctionletInfo(auctionletId, blockNumber, (error, result) => {
      if (!error) {
        let auctionlet = {};
        if (result[0].toNumber() !== 0) {
          // We could bring the info from the local node
          auctionlet = {
            last_bidder: result[1],
            last_bid_time: new Date(result[2].toNumber() * 1000),
            buy_amount: result[3].toString(10),
            sell_amount: result[4].toString(10),
            unit_price: result[3].div(result[4]).toString(10),
          };
          resolve(auctionlet);
        } else {
          // Bring info from etherscan
          console.log('Could not find history in local node for block ', blockNumber, '. Calling Etherscan...');
          callContractMethod('getAuctionletInfo(uint256)', [auctionletId], blockNumber).then((res) => {
            const buyAmount = web3.toBigNumber(parseInt(res[3].toString(16), 16));
            const sellAmount = web3.toBigNumber(parseInt(res[4].toString(16), 16));
            /* eslint-disable prefer-template */
            auctionlet = {
              last_bidder: '0x' + res[1].replace(/^0+/, ''),
              last_bid_time: new Date(parseInt(res[2].toString(16), 16) * 1000),
              buy_amount: buyAmount.toString(10),
              sell_amount: sellAmount.toString(10),
              unit_price: buyAmount.div(sellAmount).toString(10),
            };
            /* eslint-enable prefer-template */
            resolve(auctionlet);
          });
        }
      } else {
        reject(error);
      }
    });
  });
  return bidPromise;
};

// Check whether an auctionlet is expired and if so update the auctionlet
Auctionlets.syncExpired = function syncExpired() {
  if (typeof (TokenAuction.objects) !== 'undefined') {
    const currentAuctionletId = Session.get('currentAuctionletId');
    if (currentAuctionletId) {
      Auctionlets.checkExpired(currentAuctionletId).then((result) => {
        Auctionlets.update({ auctionletId: currentAuctionletId }, { $set: { isExpired: result } });
      }, (error) => {
        console.log('syncExpired error', error);
      });
    }
  }
};

Auctionlets.calculateRequiredBid = function calculateRequiredBid(buyAmount, minIncrease) {
  const requiredBid = web3.toBigNumber(buyAmount).mul(100 + minIncrease).div(100);
  return requiredBid;
};

Auctionlets.doBid = function doBid(bidAmount) {
  console.log('doBid function called');
  Tokens.setEthAllowance(bidAmount);
};

Auctionlets.bidOnAuctionlet = function bidOnAuctionlet(auctionletId, bidAmount, quantity) {
  TokenAuction.objects.auction.bid['uint256,uint256,uint256'](auctionletId, bidAmount, quantity,
  { gas: BID_GAS }, (error, result) => {
    if (!error) {
      console.log(result);
      Transactions.add('bid', result, { auctionletId, bid: bidAmount.toString(10) });
    } else {
      Session.set('bidProgress', 0);
      Session.set('newBidMessage', { message: `Error placing bid: ${prettyError(error)}`, type: 'danger' });
    }
  });
};

Auctionlets.watchBid = function watchBid() {
  /* eslint-disable new-cap */
  TokenAuction.objects.auction.Bid((error) => {
    if (!error) {
      console.log('Bid is set');
      const currentAuctionletId = Session.get('currentAuctionletId');
      Auctionlets.loadAuctionlet(currentAuctionletId);
    } else {
      Session.set('newBidMessage', { message: `Error placing bid: ${prettyError(error)}`, type: 'danger' });
      Session.set('bidProgress', 0);
      console.log('error: ', error);
    }
  });
  /* eslint-enable new-cap */
};

Auctionlets.watchBidTransactions = function watchBidTransactions() {
  Transactions.observeRemoved('bid', (document) => {
    if (document.receipt.logs.length === 0) {
      Session.set('newBidMessage', { message: 'Error placing bid', type: 'danger' });
    } else {
      console.log('bid', document.object.bid);
      Session.set('bidProgress', 100);
      Session.set('newBidMessage', { message: 'Bid placed succesfully', type: 'success' });
      Meteor.setTimeout(function () {
        Session.set('bidProgress', 0);
      }, 5000);
    }
  });
};

Auctionlets.doClaim = function doClaim(auctionletId) {
  TokenAuction.objects.auction.claim(auctionletId, { gas: CLAIM_GAS }, (error, result) => {
    if (!error) {
      Transactions.add('claim', result, { auctionletId });
      Session.set('claimMessage', { message: 'Claiming your tokens', type: 'info' });
    } else {
      console.log('Claim error: ', error);
      Session.set('claimMessage', { message: `Error claiming tokens: ${prettyError(error)}`, type: 'danger' });
    }
  });
};

Auctionlets.watchClaimTransactions = function watchClaimTransactions() {
  Transactions.observeRemoved('claim', (document) => {
    if (document.receipt.logs.length === 0) {
      console.log('Claim went wrong');
      Session.set('claimMessage', { message: 'Error claiming tokens', type: 'danger' });
    } else {
      console.log('Claim is succesful');
      Session.set('claimMessage', { message: 'Tokens successfully claimed', type: 'success' });
      const currentAuctionletId = Session.get('currentAuctionletId');
      Auctionlets.loadAuctionlet(currentAuctionletId);
    }
  });
};

export default Auctionlets;
