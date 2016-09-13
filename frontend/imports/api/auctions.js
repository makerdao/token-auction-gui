import { Mongo } from 'meteor/mongo';
import Tokens from './tokens.js';
import Transactions from './transactions.js';
import auctionPath from '../startup/routes.js';

const Auctions = new Mongo.Collection(null);
const AUCTION_GAS = 1000000;

Auctions.loadAuction = function loadAuction(currentAuctionId) {
  TokenAuction.objects.auction.getAuctionInfo(currentAuctionId, (error, result) => {
    if (!error) {
      Auctions.remove({});
      const auction = {
        auctionId: currentAuctionId,
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
      Auctions.insert(auction);
    } else {
      console.log('error: ', error);
    }
  });
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
      console.log(error);
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
    } else {
      console.log('error: ', error);
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
      Session.set('newAuctionMessage', { message: 'New Auction successfully created', type: 'success' });
    }
  });
};

Auctions.findAuction = function findAuction() {
  return Auctions.findOne({ auctionId: Session.get('currentAuctionId') });
};

export default Auctions;
