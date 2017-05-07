import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Tokens = new Mongo.Collection(null);

const tokens = {
  kovan: {
    ETH: '0x53eccc9246c1e537d79199d0c7231e425a40f896',
    DAI: '0x383105dc3dab1646119335ae54afdfd9f2af4713', //TODO experiment by reverendus, there is no DAI yet :)
    MKR: '0x4bb514a7f83fbb13c2b41448208e89fabbcfe2fb',
    MKP: '0x408f224724a7680b6172bd37bf482c50e2be5d02', //TODO experiment by reverendus, to be removed later
  },
  live: {
    ETH: '0xecf8f87f810ecf450940c9f60066b4a7a501d6a7',
    DAI: '0x0000000000000000000000000000000000000000',
    MKR: '0xc66ea802717bfb9833400264dd12c2bceaa34a6d',
    MKP: '0x0000000000000000000000000000000000000000', //TODO experiment by reverendus, to be removed later
  },
};


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

export default Tokens;
