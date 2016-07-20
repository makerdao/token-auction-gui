import { Auctions } from '../../api/auctions.js';
import { Auctionlets } from '../../api/auctionlets.js';
import { Balances } from '../../api/balances.js';
import { Tracker } from 'meteor/tracker';

TokenAuction.init('morden')
ERC20.init('morden');
const mkr = ERC20.classes.ERC20.at(Meteor.settings.public.MKR.address);
const eth = ERC20.classes.ERC20.at(Meteor.settings.public.ETH.address);


Tracker.autorun(function() {
  console.log('lalalala')
  web3.checkAccounts();  
  getAuction();
  getAuctionlet();
  getEthBalance();
  getMkrBalance();
})

function getAuction() {
    TokenAuction.objects.auction.getAuctionInfo(Meteor.settings.public.auctionId, function (error, result) {
      if(!error) {
        Auctions.remove({});
        var auction = {
          auctionId: Meteor.settings.public.auctionId,
          creator: result[0],
          selling: result[1],
          buying: result[2],
          start_bid: result[3].toNumber(),
          min_increase: result[4].toNumber(),
          min_decrease: result[5].toNumber(),
          sell_amount: result[6].toNumber(),
          duration: result[7].toNumber(),
          reversed: result[8],
          unsold: result[9]
        };
        Auctions.insert(auction);
      }
      else {
        console.log("error: ", error);
      }
    });
}

function getAuctionlet() {
    TokenAuction.objects.auction.getAuctionletInfo(Meteor.settings.public.auctionletId, function (error, result) {
      if(!error) {
        Auctionlets.remove({});
        var auctionlet = {
          auctionletId: Meteor.settings.public.auctionletId,
          auction_id: result[0].toNumber(),
          last_bidder: result[1],
          last_bid_time: new Date(result[2].toNumber()*1000),
          buy_amount: result[3].toNumber(),
          sell_amount: result[4].toNumber(),
          unclaimed: result[5],
          base: result[6]
        };
        Auctionlets.insert(auctionlet);
      }
      else {
        console.log("auctionlet info error: ", error);
      }
    })
}

function getEthBalance() {
    console.log('default account: ', Session.get('address'))
    eth.balanceOf(Session.get('address'), function(error, result) {
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

function getMkrBalance() {
    mkr.balanceOf(Session.get('address'), function(error, result) {
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

isBalanceSufficient = function(bid, tokenAddress) {
    let token = Balances.findOne({tokenAddress: tokenAddress});
    if(token != undefined && token.balance >= bid) {
      return true;
    }
    else {
      return false;
    }
}

export {
    TokenAuction,
    eth,
    mkr
}