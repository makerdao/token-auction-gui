import { Mongo } from 'meteor/mongo';
import Tokens from './tokens.js';
import Transactions from './transactions.js';
import prettyError from '../utils/prettyError.js';

const Auctionlets = new Mongo.Collection(null);
const BID_GAS = 1000000;
const CLAIM_GAS = 1000000;

Auctionlets.findAuctionlet = function findAuctionlet() {
  return Auctionlets.findOne({ auctionletId: Session.get('currentAuctionletId') });
};

Auctionlets.loadAuctionlet = function loadAuctionlet(currentAuctionletId) {
  if (typeof (TokenAuction.objects) !== 'undefined') {
    TokenAuction.objects.auction.getAuctionletInfo(currentAuctionletId, (error, result) => {
      if (!error) {
        Auctionlets.remove({});
        const auctionlet = {
          auctionletId: currentAuctionletId,
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
        Auctionlets.insert(auctionlet);
        Auctionlets.syncExpired();
        Auctionlets.loadAuctionletBidHistory(currentAuctionletId);
      } else {
        console.log('auctionlet info error: ', error);
      }
    });
  }
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
        Auctionlets.update({ auctionletId }, { $set: { history: resultProm } });
      });
    });
  }
  /* eslint-enable new-cap */
};

Auctionlets.loadAuctionletBidHistoryDetail = function loadAuctionletBidHistoryDetail(auctionletId, blockNumber) {
  const bidPromise = new Promise((resolve, reject) => {
    TokenAuction.objects.auction.getAuctionletInfo(auctionletId, blockNumber, (error, result) => {
      if (!error) {
        const auctionlet = {
          last_bidder: result[1],
          last_bid_time: new Date(result[2].toNumber() * 1000),
          buy_amount: result[3].toString(10),
          unit_price: result[3].div(result[4]).toString(10),
        };
        resolve(auctionlet);
      } else {
        reject(error);
      }
    });
  });
  return bidPromise;
};

// Check whether an auctionlet is expired and if so update the auctionlet
Auctionlets.syncExpired = function syncExpired() {
  const currentAuctionletId = Session.get('currentAuctionletId');
  TokenAuction.objects.auction.isExpired(currentAuctionletId, (error, result) => {
    if (!error) {
      if (result) {
        Auctionlets.update({ auctionletId: currentAuctionletId }, { $set: { isExpired: result } });
      }
    } else {
      console.log('syncExpired error', error);
    }
  });
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
      console.log('error: ', error);
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
