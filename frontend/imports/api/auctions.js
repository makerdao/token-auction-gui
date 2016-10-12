import { Mongo } from 'meteor/mongo';
import Tokens from './tokens.js';
import Transactions from './transactions.js';
import auctionPath from '../startup/routes.js';
import prettyError from '../utils/prettyError.js';

const Auctions = new Mongo.Collection(null);
const AUCTION_GAS = 1000000;

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
      Auctions.upsert({ auctionId }, auction, { upsert: true });
    }, (error) => {
      console.log('error: ', error);
    });
  }
};

Auctions.createAuction = function createAuction(sellAmount) {
  Tokens.setMkrAllowance(sellAmount);
};

Auctions.newAuction = function newAuction(account, selling, buying, sellAmount, startBid, minIncrease, duration) {
  TokenAuction.objects.auction.newAuction(account, selling, buying, sellAmount, startBid,
  minIncrease, duration, { gas: AUCTION_GAS }, (error, result) => {
    if (!error) {
      console.log('New auction transaction started');
      Transactions.add('auction', result, { selling, sellAmount });
    } else {
      Session.set('newAuctionMessage', {
        message: `Error creating new auction: ${prettyError(error)}`,
        type: 'danger' });
      Session.set('newAuctionProgress', 0);
    }
  });
};

Auctions.watchNewAuction = function watchNewAuction() {
  /* eslint-disable new-cap */
  TokenAuction.objects.auction.NewAuction((error, result) => {
    if (!error) {
      const auctionId = result.args.id.toNumber();
      console.log('AuctionId: ', auctionId);
      /* eslint-disable prefer-template */
      const auctionUrl = Meteor.absoluteUrl() + '#' + auctionPath + auctionId;
      /* eslint-disable prefer-template */
      Session.set('newAuctionUrl', auctionUrl);
      Session.set('auctionletsListLoaded', false); // Tracker run should execute and load again the list
    } else {
      Session.set('newAuctionMessage', {
        message: `Error creating new auction: ${prettyError(error)}`,
        type: 'danger' });
      Session.set('newAuctionProgress', 0);
    }
  });
  /* eslint-disable new-cap */
};

Auctions.watchNewAuctionTransactions = function watchNewAuctionTransactions() {
  Transactions.observeRemoved('auction', (document) => {
    if (document.receipt.logs.length === 0) {
      console.log('Creating auction went wrong');
      Session.set('newAuctionMessage', { message: 'Error creating new auction', type: 'danger' });
    } else {
      console.log('Creating auction is succesful');
      Session.set('newAuctionMessage', { message: 'New Auction successfully created.', type: 'success' });
      Session.set('newAuctionProgress', 100);
      Meteor.setTimeout(() => {
        Session.set('newAuctionProgress', 0);
      }, 5000);
    }
  });
};

Auctions.findAuction = function findAuction() {
  return Auctions.findOne({ auctionId: Session.get('currentAuctionId') });
};

export default Auctions;
