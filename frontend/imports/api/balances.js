import { Mongo } from 'meteor/mongo';

const Balances = new Mongo.Collection(null);
ERC20.init('morden');
const MKR = ERC20.classes.ERC20.at(Meteor.settings.public.MKR.address);
const ETH = ERC20.classes.ERC20.at(Meteor.settings.public.ETH.address);

Balances.getEthBalance = function() {
    console.log('default account: ', Session.get('address'))
    ETH.balanceOf(Session.get('address'), function(error, result) {
      if(!error) {
        console.log('eth balance: ', result)
        console.log(Session.get('address'))
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
        console.log('mkr balance: ', result)
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
      return true;
    }
    else {
      return false;
    }
}

export { Balances, ETH, MKR }