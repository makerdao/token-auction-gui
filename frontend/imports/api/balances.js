import { Mongo } from 'meteor/mongo';
import { Auctions } from '/imports/api/auctions.js';
import { Auctionlets } from '/imports/api/auctionlets.js';
import { Transactions } from '../lib/_transactions.js';

const Balances = new Mongo.Collection(null);
ERC20.init('morden');
const MKR = ERC20.classes.ERC20.at(Meteor.settings.public.MKR.address);
const ETH = ERC20.classes.ERC20.at(Meteor.settings.public.ETH.address);

Balances.getEthBalance = function() {
    //console.log('default account: ', Session.get('address'))
    ETH.balanceOf(Session.get('address'), function(error, result) {
      if(!error) {
        //console.log('eth balance: ', result)
        balance = result.toString(10);
        Balances.upsert({ tokenAddress: Meteor.settings.public.ETH.address },
                        { tokenAddress: Meteor.settings.public.ETH.address, balance: balance },
                        { upsert: true })
      }
      else {
        console.log('mkr error: ', error);
      }
    })
}

Balances.getMkrBalance = function() {
    MKR.balanceOf(Session.get('address'), function(error, result) {
      if(!error) {
        //console.log('mkr balance: ', result)
        balance = result.toString(10);
        Balances.upsert({ tokenAddress: Meteor.settings.public.MKR.address },
                        { tokenAddress: Meteor.settings.public.MKR.address, balance: balance },
                        { upsert: true })
      }
      else {
        console.log('mkr error: ', error);
      }
    })
}

Balances.isBalanceSufficient = function(bid, tokenAddress) {
    let token = Balances.findOne({tokenAddress: tokenAddress});
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

Balances.setMkrAllowance = function(amount) {
    MKR.approve(TokenAuction.objects.auction.address, amount, {gas: 500000 }, function(error, result) {
      if(error) {
        console.log(error)
        //TODO Set transaction hash in Transactions
      }
    });
}

Balances.setEthAllowance = function(amount) {
    ETH.approve(TokenAuction.objects.auction.address, amount, {gas: 500000 }, function(error, result) {
      if(!error) {
        //TODO Set transaction hash in Transactions
        console.log('approve transaction adding')
        Transactions.add('allowance', result, { value: amount.toString(10) })
      }
    });
}

Balances.watchEthApproval = function() {
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

Balances.watchMkrApproval = function() {
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

Balances.watchAllowanceTransactions = function() {
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

export { Balances, ETH, MKR }