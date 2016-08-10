import Tokens from '/imports/api/tokens.js';
import Auctions from '/imports/api/auctions.js';

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

Template.registerHelper('ETHToken', () => {
  const token = Tokens.findOne({ name: Meteor.settings.public.ETH.name });
  return token;
});

Template.registerHelper('MKRToken', () => {
  const token = Tokens.findOne({ name: Meteor.settings.public.MKR.name });
  return token;
});

Template.registerHelper('auctionNotFound', () => {
  const auction = Auctions.findAuction();
  return auction === undefined || auction.creator === '0x0000000000000000000000000000000000000000'
  || auction.creator === '0x';
});

Template.registerHelper('etherscanHref', () => {
  const network = Session.get('network');
  /* eslint-disable prefer-template */
  return 'https://' + (network === 'morden' ? 'testnet.' : '') + 'etherscan.io/address/';
  /* eslint-enable prefer-template */
});
