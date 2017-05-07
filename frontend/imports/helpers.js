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

Template.registerHelper('tokenSymbol', (address) => {
  const symbol = Tokens.getTokenSymbol(address);
  return (symbol != null) ? symbol : '???';
});

Template.registerHelper('etherscanAddressHref', (address) => {
  const network = Session.get('network');
  return 'https://' + (network === 'kovan' ? 'kovan.' : '') + 'etherscan.io/address/' + address;
});

Template.registerHelper('etherscanTokenHref', (address) => {
  const network = Session.get('network');
  return 'https://' + (network === 'kovan' ? 'kovan.' : '') + 'etherscan.io/token/' + address;
});

Template.registerHelper('contractExists', () => {
  const network = Session.get('network');
  const isConnected = Session.get('isConnected');
  const exists = Session.get('contractExists');
  return network !== false && isConnected === true && exists === true;
});

Template.registerHelper('shortAddress', (address) => {
  const short = address.substring(0, 10);
  return short + '…';
});

Template.registerHelper('formatDateTime', function(date) {
  return moment(date).format('DD-MMM-YYYY HH:mm:ss');
});

Template.registerHelper('formatTimeRemaining', (timeRemaining) => {
  function pad(n) {
    return (n < 10) ? ("0" + n) : n;
  }

  if (typeof timeRemaining !== 'undefined') {
    const time = moment.duration(timeRemaining);
    const dayPart = (time.days() > 1) ? `${time.days()} days` : ((time.days() == 1) ? `${time.days()} day` : '');
    const timePart = `${time.hours()}:${pad(time.minutes())}:${pad(time.seconds())}`;
    return (dayPart + ' ' + timePart).trim();
  }
  return false;
});

Template.registerHelper('equals', (a, b) => a === b);

Template.registerHelper('or', (a, b) => a || b);

