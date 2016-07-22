import { Mongo } from 'meteor/mongo';

const Balances = new Mongo.Collection(null);
ERC20.init('morden');
const MKR = ERC20.classes.ERC20.at(Meteor.settings.public.MKR.address);
const ETH = ERC20.classes.ERC20.at(Meteor.settings.public.ETH.address);

Balances.getEthBalance = function() {
    //console.log('default account: ', Session.get('address'))
    ETH.balanceOf(Session.get('address'), function(error, result) {
      if(!error) {
        //console.log('eth balance: ', result)
        balance = result.toNumber();
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
        balance = result.toNumber();
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
    if(token != undefined && token.balance >= bid) {
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
      }
    });
}

Balances.setEthAllowance = function(amount) {
    ETH.approve(TokenAuction.objects.auction.address, amount, {gas: 500000 }, function(error, result) {
      if(error) {
        console.log(error)
      }
    });
}

export { Balances, ETH, MKR }