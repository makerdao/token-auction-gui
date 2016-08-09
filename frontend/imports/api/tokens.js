import { Mongo } from 'meteor/mongo';
import { Auctions } from '/imports/api/auctions.js';
import { Auctionlets } from '/imports/api/auctionlets.js';
import { Transactions } from '../lib/_transactions.js';

const Tokens = new Mongo.Collection(null);
const APPROVE_GAS = 1000000

const tokens = {
  'morden': {
    'ETH': '0x52fe88b987c7829e5d5a61c98f67c9c14e6a7a90',
    'MKR': '0xffb1c99b389ba527a9194b1606b3565a07da3eef'
  },
  'live': {
    'ETH': '0xecf8f87f810ecf450940c9f60066b4a7a501d6a7',
    'MKR': '0xc66ea802717bfb9833400264dd12c2bceaa34a6d'
  }
};

Session.set('buying', localStorage.getItem('buying') || 'ETH');
Session.set('selling', localStorage.getItem('selling') || 'MKR');

Tokens.initialize = function (network) {
  ERC20.init(network);
}

Tokens.getTokenAddress = function (network, symbol) {
  return tokens[network][symbol]
}

Tokens.getToken = function (symbol, callback) {
  let network = Session.get('network');
  if (!(network in tokens)) {
    console.log('unknown environment: ', network);
    callback('Unknown environment', null);
    return
  }
  if (!(symbol in tokens[network])) {
    console.log('unknown token');
    callback('Unknown token "' + symbol + '"', null);
    return
  }

  var address = Tokens.getTokenAddress(network, symbol);
  try {
    ERC20.classes.ERC20.at(address, function (error, token) {
      if (!error) {
        callback(false, token);
      } else {
        callback(error, token);
      }
    })
  } catch (e) {
    callback(e, null);
  }
}

/**
 * Syncs the buying and selling' balances and allowances of selected account,
 * usually called for each new block
 */
Tokens.sync = function () {
  var network = Session.get('network');
  var address = Session.get('address');
  if (address && network) {
    web3.eth.getBalance(address, function (error, balance) {
      var newETHBalance = balance.toString(10);
      if (!error && !Session.equals('ETHBalance', newETHBalance)) {
        Session.set('ETHBalance', newETHBalance);
      }
    })

    var allTokens = _.uniq([ Session.get('buying'), Session.get('selling') ]);

    if (network !== 'private') {
      var contract_address = TokenAuction.objects.auction.address;

      // Sync token balances and allowances asynchronously
      for(let token_id in allTokens) {
        // XXX EIP20
        Tokens.getToken(allTokens[token_id], function (error, token) {
          if (!error) {
            token.balanceOf(address, function (error, balance) {
              if (!error) {
                Tokens.upsert({ name: allTokens[token_id], address: token.address}, { $set: { balance: balance.toString(10) } });
              }
            })
            token.allowance(address, contract_address, function (error, allowance) {
              if (!error) {
                Tokens.upsert({ name: allTokens[token_id], address: token.address }, { $set: { allowance: allowance.toString(10) } });
              }
            })
          }
        })
      }
    } else {
      for(token_id in allTokens){
        console.log('NETWORK IS PRIVATE');
        Tokens.upsert(allTokens[token_id], { $set: { balance: '0', allowance: '0' } });
      }
    }
  }
}

Tokens.isBalanceSufficient = function (bid, tokenAddress) {
    let token = Tokens.findOne({address: tokenAddress});
    if (token != undefined && web3.toBigNumber(token.balance).gte(web3.toBigNumber(bid))) {
      console.log('Success! Balance is', token.balance, 'and bid is', bid);
      return true;
    }
    else if (token != undefined) {
      console.log('Insufficient! Balance is', token.balance, 'and bid is', bid);
      return false;
    }
    else {
      console.log('token is not found');
    }
}

Tokens.setMkrAllowance = function (amount) {
  Tokens.getToken('MKR', function (error, token) {
    if (!error) {
      token.approve(TokenAuction.objects.auction.address, amount, {gas: APPROVE_GAS }, function (error, result) {
        if (!error) {
          console.log('Mkr approve transaction adding');
          Session.set('newAuctionMessage', 'Setting allowance for new auction');
          Transactions.add('mkrallowance', result, { value: amount.toString(10) });
        }
        else {
          Session.set('newAuctionMessage', 'Error setting allowance for new auction: ' + error.toString());
        }
      })
    }
  })
}

Tokens.setEthAllowance = function (amount) {
  Tokens.getToken('ETH', function (error, token) {
    if (!error) {
      token.approve(TokenAuction.objects.auction.address, amount, {gas: APPROVE_GAS }, function (error, result) {
        if (!error) {
          console.log('Eth approve transaction adding');
          Session.set('bidMessage', 'Setting allowance for bid');
          Transactions.add('ethallowance', result, { value: amount.toString(10) });
        }
        else {
          console.log('SetEthAllowance error:', error);
          Session.set('bidMessage', 'Error setting allowance for bid: ' + error.toString());
        }
      })
    }
  })
}

Tokens.watchEthApproval = function () {
  Tokens.getToken('ETH', function (error, token) {
    if (!error) {
      token.Approval({ owner:Session.get('address'), spender: TokenAuction.objects.auction.address },function (error, result) {
        if (!error) {
          console.log('Approved, placing bid');
        }
      })
    }
  })
}

Tokens.watchMkrApproval = function () {
  Tokens.getToken('ETH', function (error, token) {
    if (!error) {
      token.Approval({ owner:Session.get('address'), spender: TokenAuction.objects.auction.address },function (error, result) {
        if (!error) {
          console.log('Approved, creating auction');
        }
      })
    }
  })
}

Tokens.watchEthAllowanceTransactions = function () {
  Transactions.observeRemoved('ethallowance', function (document) {
      if (document.receipt.logs.length === 0) {
        console.log('Setting ETH allowance went wrong');
        Session.set('bidMessage', 'Error setting allowance for bid');
      } else {
        console.log('ETH allowance is set');
        let auction = Auctions.findAuction();
        Session.set('bidMessage', 'Allowance set, placing bid');
        Auctionlets.bidOnAuctionlet(Session.get('currentAuctionletId'), document.object.value, auction.sell_amount);
      }
  })
}

  Tokens.watchMkrAllowanceTransactions = function () {
    Transactions.observeRemoved('mkrallowance', function (document) {
      if (document.receipt.logs.length === 0) {
        console.log('Setting MKR allowance went wrong');
        Session.set('newAuctionMessage', 'Error setting allowance for new auction: ' + error.toString());
      } else {
        console.log('MKR allowance is set');
        let newAuction = Session.get('newAuction');
        console.log('account:', Session.get('address'), newAuction.sellamount, newAuction.startbid,
        newAuction.min_increase, newAuction.duration);
        Auctions.newAuction(Session.get('address'), Meteor.settings.public.MKR.address,
                            Meteor.settings.public.ETH.address, newAuction.sellamount.toString(10), newAuction.startbid.toString(10),
                            newAuction.min_increase, newAuction.duration.toString(10));
        Session.set('newAuctionMessage', 'Allowance set, creating new auction');
      }
  })

}

export { Tokens }