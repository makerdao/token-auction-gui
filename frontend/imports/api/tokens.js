import { Mongo } from 'meteor/mongo';
import Auctions from '/imports/api/auctions.js';
import Auctionlets from '/imports/api/auctionlets.js';
import Transactions from '/imports/lib/_transactions.js';

const Tokens = new Mongo.Collection(null);
const APPROVE_GAS = 1000000;

const tokens = {
  morden: {
    ETH: '0x52fe88b987c7829e5d5a61c98f67c9c14e6a7a90',
    MKR: '0xffb1c99b389ba527a9194b1606b3565a07da3eef',
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

Tokens.isBalanceSufficient = function isBalanceSufficient(bid, tokenAddress) {
  const token = Tokens.findOne({ address: tokenAddress });
  if (token !== undefined && web3.toBigNumber(token.balance).gte(web3.toBigNumber(bid))) {
    console.log('Success! Balance is', token.balance, 'and bid is', bid.toString(10));
    return true;
  } else if (token !== undefined) {
    console.log('Insufficient! Balance is', token.balance, 'and bid is', bid.toString(10));
    return false;
  }
  console.log('token is not found');
  return false;
};

Tokens.setMkrAllowance = function setMkrAllowance(amount) {
  Tokens.getToken('MKR', (error, token) => {
    console.log('get token error', error);
    if (!error) {
      token.approve(Session.get('contractAddress'), amount, { gas: APPROVE_GAS }, (approveError, result) => {
        if (!approveError) {
          console.log('Mkr approve transaction adding');
          Session.set('newAuctionMessage', { message: 'Setting allowance for new auction', type: 'alert-info' });
          Transactions.add('mkrallowance', result, { value: amount.toString(10) });
        } else {
          Session.set('newAuctionMessage', { message: `Error setting allowance for new auction: ${approveError.toString()}`, type: 'alert-danger' });
        }
      });
    } else {
      Session.set('newAuctionMessage', { message: `Error setting allowance for new auction: ${error.toString()}`, type: 'alert-danger' });
    }
  });
};

Tokens.setEthAllowance = function setEthAllowance(amount) {
  Tokens.getToken('ETH', (error, token) => {
    if (!error) {
      token.approve(Session.get('contractAddress'), amount, { gas: APPROVE_GAS }, (approveError, result) => {
        if (!approveError) {
          console.log('Eth approve transaction adding');
          Session.set('bidMessage', { message: 'Setting allowance for bid (this could take a while)', type: 'alert-info' });
          Transactions.add('ethallowance', result, { value: amount.toString(10) });
        } else {
          console.log('SetEthAllowance error:', approveError);
          Session.set('bidMessage', { message: `Error setting allowance for bid: ${approveError.toString()}`, type: 'alert-danger' });
        }
      });
    } else {
      Session.set('bidMessage', { message: `Error setting allowance for bid: ${error.toString()}`, type: 'alert-danger' });
    }
  });
};

Tokens.watchEthApproval = function watchEthApproval() {
  Tokens.getToken('ETH', (error, token) => {
    if (!error) {
      /* eslint-disable new-cap */
      token.Approval({ owner: Session.get('address'), spender: Session.get('contractAddress') },
      (approvedError) => {
        if (!approvedError) {
          console.log('Approved, placing bid');
        }
      });
      /* eslint-enable new-cap */
    }
  });
};

Tokens.watchMkrApproval = function watchMkrApproval() {
  Tokens.getToken('ETH', (error, token) => {
    if (!error) {
      /* eslint-disable new-cap */
      token.Approval({ owner: Session.get('address'), spender: Session.get('contractAddress') },
      (approvalError) => {
        if (!approvalError) {
          console.log('Approved, creating auction');
        }
      });
      /* eslint-enable new-cap */
    }
  });
};

Tokens.watchEthAllowanceTransactions = function watchEthAllowanceTransactions() {
  Transactions.observeRemoved('ethallowance', (document) => {
    if (document.receipt.logs.length === 0) {
      console.log('Setting ETH allowance went wrong');
      Session.set('bidMessage', { message: 'Error setting allowance for bid', type: 'alert-danger' });
    } else {
      console.log('ETH allowance is set');
      const auction = Auctions.findAuction();
      Session.set('bidMessage', { message: 'Allowance set, placing bid (this could take a while)', type: 'alert-info' });
      Auctionlets.bidOnAuctionlet(Session.get('currentAuctionletId'), document.object.value, auction.sell_amount);
    }
  });
};

Tokens.watchMkrAllowanceTransactions = function watchMkrAllowanceTransactions() {
  Transactions.observeRemoved('mkrallowance', (document) => {
    if (document.receipt.logs.length === 0) {
      console.log('Setting MKR allowance went wrong');
      Session.set('newAuctionMessage', { message: 'Error setting allowance for new auction:', type: 'alert-danger' });
    } else {
      console.log('MKR allowance is set');
      const newAuction = Session.get('newAuction');
      console.log('account:', Session.get('address'), newAuction.sellamount, newAuction.startbid,
      newAuction.min_increase, newAuction.duration);
      Auctions.newAuction(Session.get('address'), Meteor.settings.public.MKR.address,
                          Meteor.settings.public.ETH.address, newAuction.sellamount.toString(10),
                          newAuction.startbid.toString(10), newAuction.min_increase, newAuction.duration.toString(10));
      Session.set('newAuctionMessage', { message: 'Allowance set, creating new auction', type: 'alert-info' });
    }
  });
};

export default Tokens;
