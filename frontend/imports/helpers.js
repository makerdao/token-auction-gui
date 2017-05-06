import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import Tokens from '/imports/api/tokens.js';
import Auctions from '/imports/api/auctions.js';
import { moment } from 'meteor/momentjs:moment';

Template.registerHelper('isConnected', () => Session.get('isConnected'));

Template.registerHelper('syncing', () => Session.get('syncing'));

Template.registerHelper('outOfSync', () => Session.get('outOfSync'));

Template.registerHelper('fromWei', (s) => web3.fromWei(s));

Template.registerHelper('toWei', (s) => web3.toWei(s));

Template.registerHelper('formatBalance', (wei) => {
  const format = '0,0.00[000]';
  return numeral(wei).format(format);
});

Template.registerHelper('json', (a) => {
  try {
    return JSON.stringify(a);
  } catch (e) {
    return a;
  }
});

Template.registerHelper('currentAuctionId', () => Session.get('currentAuctionId'));

Template.registerHelper('currentAuctionletId', () => Session.get('currentAuctionletId'));

Template.registerHelper('auctionNotFound', () => {
  const auction = Auctions.findAuction();
  return auction === undefined || auction.creator === '0x0000000000000000000000000000000000000000'
  || auction.creator === '0x';
});

Template.registerHelper('etherscanHref', () => {
  const network = Session.get('network');
  /* eslint-disable prefer-template */
  return 'https://' + (network === 'kovan' ? 'kovan.' : '') + 'etherscan.io/address/';
  /* eslint-enable prefer-template */
});

Template.registerHelper('contractExists', () => {
  const network = Session.get('network');
  const isConnected = Session.get('isConnected');
  const exists = Session.get('contractExists');
  return network !== false && isConnected === true && exists === true;
});

Template.registerHelper('shortAddress', (address) => {
  const short = address.substring(0, 10);
  return short;
});

Template.registerHelper('countdown', (timeRemaining) => {
  if (typeof timeRemaining !== 'undefined') {
    const time = moment.duration(timeRemaining);
    const returnVar = `${time.days()}d ${time.hours()}h ${time.minutes()}m ${time.seconds()}s`;
    return returnVar;
  }
  return false;
});

Template.registerHelper('equals', (a, b) => a === b);

Template.registerHelper('or', (a, b) => a || b);

