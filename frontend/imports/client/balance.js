import { Template } from 'meteor/templating';
import Tokens from '/imports/api/tokens.js';
import './balance.html';

Template.balance.viewmodel({
  hasETHTokens() {
    const token = Tokens.findOne({ name: 'ETH' });
    if (token !== undefined) {
      return web3.toBigNumber(token.balance).gt(0);
    }
    return false;
  },
});
