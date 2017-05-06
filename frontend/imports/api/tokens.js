import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Auctions from './auctions.js';
import Auctionlets from './auctionlets.js';
import prettyError from '../utils/prettyError.js';

const Tokens = new Mongo.Collection(null);

const tokens = {
  kovan: {
    ETH: '0x53eccc9246c1e537d79199d0c7231e425a40f896',
    MKR: '0x4bb514a7f83fbb13c2b41448208e89fabbcfe2fb',
  },
  live: {
    ETH: '0xecf8f87f810ecf450940c9f60066b4a7a501d6a7',
    MKR: '0xc66ea802717bfb9833400264dd12c2bceaa34a6d',
  },
};

Session.set('buying', localStorage.getItem('buying') || 'ETH');
Session.set('selling', localStorage.getItem('selling') || 'MKR');

Tokens.initialize = function initialize(network) {
  ERC20.init(network);
};

Tokens.getTokenAddress = function getTokenAddress(network, symbol) {
  return tokens[network][symbol];
};

Tokens.getToken = function getToken(symbol, callback) {
  const network = Session.get('network');
  if (!(network in tokens)) {
    console.log('unknown environment: ', network);
    callback('Unknown environment', null);
    return;
  }
  if (!(symbol in tokens[network])) {
    console.log('unknown token');
    callback(`Unknown token "${symbol}"`, null);
    return;
  }

  const address = Tokens.getTokenAddress(network, symbol);
  try {
    ERC20.classes.ERC20.at(address, (error, token) => {
      if (!error) {
        callback(false, token);
      } else {
        callback(error, token);
      }
    });
  } catch (e) {
    callback(e, null);
  }
};

/**
 * Syncs the buying and selling' balances and allowances of selected account,
 * usually called for each new block
 */
Tokens.sync = function sync() {
  const network = Session.get('network');
  const address = Session.get('address');
  if (address && network) {
    web3.eth.getBalance(address, (error, balance) => {
      const newETHBalance = balance.toString(10);
      if (!error && !Session.equals('ETHBalance', newETHBalance)) {
        Session.set('ETHBalance', newETHBalance);
      }
    });

    const allTokens = _.uniq([Session.get('buying'), Session.get('selling')]);

    if (network !== 'private') {
      // Sync token balances and allowances asynchronously
      // for(let token_id in allTokens) {
      allTokens.forEach((tokenId) => {
        // XXX EIP20
        Tokens.getToken(tokenId, (error, token) => {
          if (!error) {
            token.balanceOf(address, (balanceError, balance) => {
              if (!balanceError) {
                Tokens.upsert({ name: tokenId, address: token.address },
                { $set: { balance: balance.toString(10) } });
              }
            });
            token.allowance(address, Session.get('contractAddress'), (allowanceError, allowance) => {
              if (!allowanceError) {
                Tokens.upsert({ name: tokenId, address: token.address },
                { $set: { allowance: allowance.toString(10) } });
              }
            });
          }
        });
      });
    } else {
      allTokens.forEach((tokenId) => {
        console.log('NETWORK IS PRIVATE');
        Tokens.upsert(allTokens[tokenId], { $set: { balance: '0', allowance: '0' } });
      });
    }
  }
};

export default Tokens;
