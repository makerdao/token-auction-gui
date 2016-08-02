import { Mongo } from 'meteor/mongo';
import { Auctions } from '/imports/api/auctions.js';
import { Auctionlets } from '/imports/api/auctionlets.js';
import { Transactions } from '../lib/_transactions.js';
import { getCurrentAuctionletId } from '/imports/startup/client/routes.js';

const Tokens = new Mongo.Collection(null);
ERC20.init('morden');
const MKR = ERC20.classes.ERC20.at(Meteor.settings.public.MKR.address);
const ETH = ERC20.classes.ERC20.at(Meteor.settings.public.ETH.address);

var allTokens = {MKR: MKR, ETH: ETH}

Session.set('buying', localStorage.getItem('buying') || 'ETH')
Session.set('selling', localStorage.getItem('selling') || 'MKR')

/**
 * Syncs the buying and selling' balances and allowances of selected account,
 * usually called for each new block
 */
Tokens.sync = function () {
  var network = Session.get('network')
  var address = Session.get('address')
  if (address) {
    web3.eth.getBalance(address, function (error, balance) {
      var newETHBalance = balance.toString(10)
      if (!error && !Session.equals('ETHBalance', newETHBalance)) {
        Session.set('ETHBalance', newETHBalance)
      }
    })

    if (network !== 'private') {
      var contract_address = TokenAuction.objects.auction.address

      // Sync token balances and allowances asynchronously
      for(let token_id in allTokens) {
        // XXX EIP20
        allTokens[token_id].balanceOf(address, function (error, balance) {
          if (!error) {
            Tokens.upsert({ name: token_id, address: allTokens[token_id].address}, { $set: { balance: balance.toString(10) } })
          }
        })
        allTokens[token_id].allowance(address, contract_address, function (error, allowance) {
          if (!error) {
            Tokens.upsert({ name: token_id, address: allTokens[token_id].address}, { $set: { allowance: allowance.toString(10) } })
          }
        })
      }
    } else {
      for(token_id in allTokens){
        console.log('NETWORK IS PRIVATE')
        Tokens.upsert(allTokens[token_id], { $set: { balance: '0', allowance: '0' } })
      }
    }
  }
}

Tokens.isBalanceSufficient = function(bid, tokenAddress) {
    let token = Tokens.findOne({address: tokenAddress});
    if(token != undefined && web3.toBigNumber(token.balance).gte(web3.toBigNumber(bid))) {
      console.log('Success! Balance is', token.balance, 'and bid is', bid)
      return true;
    }
    else if(token != undefined) {
      console.log('Insufficient! Balance is', token.balance, 'and bid is', bid)
      return false;
    }
    else {
      console.log('token is not found')
    }
}

Tokens.setMkrAllowance = function(amount) {
    MKR.approve(TokenAuction.objects.auction.address, amount, {gas: 500000 }, function(error, result) {
      if(!error) {
        console.log('Mkr approve transaction adding')
        Session.set('newAuctionMessage', 'Setting allowance for new auction')   
        Transactions.add('mkrallowance', result, { value: amount.toString(10) })
      }
      else {
        Session.set('newAuctionMessage', 'Error setting allowance for new auction: ' + error.toString())
      }
    });
}

Tokens.setEthAllowance = function(amount) {
    ETH.approve(TokenAuction.objects.auction.address, amount, {gas: 500000 }, function(error, result) {
      if(!error) {
        console.log('Eth approve transaction adding')
        Session.set('bidMessage', 'Setting allowance for bid')
        Transactions.add('ethallowance', result, { value: amount.toString(10) })
      }
      else {
        console.log('SetEthAllowance error:', error)
        Session.set('bidMessage', 'Error setting allowance for bid: ' + error.toString())
      }
    });
}

Tokens.watchEthApproval = function() {
  ETH.Approval({owner:Session.get('address'), spender: TokenAuction.objects.auction.address},function(error, result) {
      if(!error) {
        console.log('Approved, placing bid')
      }
    });
}

Tokens.watchMkrApproval = function() {
  MKR.Approval({owner:Session.get('address'), spender: TokenAuction.objects.auction.address},function(error, result) {
      if(!error) {
        console.log('Approved, creating auction')
      }
    });
}

Tokens.watchEthAllowanceTransactions = function() {
  Transactions.observeRemoved('ethallowance', function (document) {
      if (document.receipt.logs.length === 0) {
        console.log('Setting ETH allowance went wrong')
        Session.set('bidMessage', 'Error setting allowance for bid')
      } else {
        console.log('ETH allowance is set')
        let auction = Auctions.findAuction();
        Session.set('bidMessage', 'Allowance set, placing bid')
        Auctionlets.bidOnAuctionlet(getCurrentAuctionletId(), document.object.value, auction.sell_amount);
      }
  })
}

  Tokens.watchMkrAllowanceTransactions = function() {
    Transactions.observeRemoved('mkrallowance', function (document) {
      if (document.receipt.logs.length === 0) {
        console.log('Setting MKR allowance went wrong')
        Session.set('newAuctionMessage', 'Error setting allowance for new auction: ' + error.toString())
      } else {
        console.log('MKR allowance is set')
        let newAuction = Session.get('newAuction')
        console.log('account:', Session.get('address'), newAuction.sellamount, newAuction.startbid,
        newAuction.min_increase, newAuction.duration)
        Auctions.newAuction(Session.get('address'), Meteor.settings.public.MKR.address, 
                            Meteor.settings.public.ETH.address, newAuction.sellamount.toString(10), newAuction.startbid.toString(10), 
                            newAuction.min_increase, newAuction.duration.toString(10))
        Session.set('newAuctionMessage', 'Allowance set, creating new auction')        
      }
  })

}

export { Tokens, ETH, MKR }