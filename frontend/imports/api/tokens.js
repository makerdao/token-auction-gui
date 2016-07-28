import { Mongo } from 'meteor/mongo';
import { Auctions } from '/imports/api/auctions.js';
import { Auctionlets } from '/imports/api/auctionlets.js';
import { Transactions } from '../lib/_transactions.js';

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
        console.log('token_id:', token_id, ' and token:', allTokens[token_id])
            allTokens[token_id].balanceOf(address, function (error, balance) {
              if (!error) {
                Tokens.upsert(token_id, { $set: { balance: balance.toString(10) } })
              }
            })
            allTokens[token_id].allowance(address, contract_address, function (error, allowance) {
              if (!error) {
                Tokens.upsert(token_id, { $set: { allowance: allowance.toString(10) } })
              }
            })
      }
    } else {
      for(token_id in ALL_TOKENS){
        console.log('NETWORK IS PRIVATE')
        Tokens.upsert(ALL_TOKENS[token_id], { $set: { balance: '0', allowance: '0' } })
      }
    }
  }
}

Tokens.isBalanceSufficient = function(bid, tokenAddress) {
    let token = Tokens.findOne({tokenAddress: tokenAddress});
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
      if(error) {
        console.log(error)
        //TODO Set transaction hash in Transactions
      }
    });
}

Tokens.setEthAllowance = function(amount) {
    ETH.approve(TokenAuction.objects.auction.address, amount, {gas: 500000 }, function(error, result) {
      if(!error) {
        console.log('approve transaction adding')
        Transactions.add('allowance', result, { value: amount.toString(10) })
      }
    });
}

Tokens.watchEthApproval = function() {
  ETH.Approval({owner:Session.get('address'), spender: TokenAuction.objects.auction.address},function(error, result) {
      if(!error) {
        console.log('Approved, placing bid')
        //let auction = Auctions.findOne({});
        //TODO Remove bidding on auctionlet
        //Transactions.add('allowance', result.transactionHash, { id: idx, status: Status.PENDING })
        //Auctionlets.bidOnAuctionlet(Meteor.settings.public.auctionletId, result.args.value.toString(10), auction.sell_amount);
      }
    });
}

Tokens.watchMkrApproval = function() {
  MKR.Approval({owner:Session.get('address'), spender: TokenAuction.objects.auction.address},function(error, result) {
      if(!error) {
        console.log('Approved, creating auction')
        let weiSellAmount = web3.toWei(this.sellamount())
        console.log('wei sell amount: ', weiSellAmount)
        let weiStartBid = web3.toWei(this.startbid())
        console.log('wei start bid: ', weiStartBid)
      }
    });
}

Tokens.watchAllowanceTransactions = function() {
  Transactions.observeRemoved('allowance', function (document) {
      if (document.receipt.logs.length === 0) {
        //Show error in User interface
        console.log('bid went wrong')
      } else {
        //Show bid is succesful
        console.log('bid is succesful')
        let auction = Auctions.findAuction();
        console.log(document)
        console.log('Document value', document.object.value)
        Auctionlets.bidOnAuctionlet(Meteor.settings.public.auctionletId, document.object.value, auction.sell_amount);
      }
  })

}

export { Tokens, ETH, MKR }