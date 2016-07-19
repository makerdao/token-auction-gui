//import { web3 } from 'meteor/ethereum:web3';
import { Auctions } from '../../api/auctions.js';
import { Auctionlets } from '../../api/auctionlets.js';
import { Balances } from '../../api/balances.js';

const dapple = new tokenauction.class(web3, 'morden');
web3.eth.defaultAccount = web3.eth.accounts[0];
erc20.class(web3);
const mkr = erc20.classes.ERC20.at(Meteor.settings.public.MKR.address);
const eth = erc20.classes.ERC20.at(Meteor.settings.public.ETH.address);

Meteor.startup(function() {
    getAuction();
    getAuctionlet();
    getEthBalance();
    getMkrBalance();
})

getAuction = function() {
    dapple.objects.auction.getAuctionInfo(Meteor.settings.public.auctionId, {gas: 500000 },function (error, result) {
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

getAuctionlet = function() {
    dapple.objects.auction.getAuctionletInfo(Meteor.settings.public.auctionletId, {gas: 500000 }, function (error, result) {
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

getEthBalance = function() {
    eth.balanceOf(web3.eth.accounts[0], function(error, result) {
      if(!error) {
        console.log('eth balance: ', result)
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

getMkrBalance = function() {
    mkr.balanceOf(web3.eth.accounts[0], function(error, result) {
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

export {
    dapple,
    eth,
    mkr
}