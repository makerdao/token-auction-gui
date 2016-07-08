import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//var web3 = new Web3();

Template.auction.viewmodel({
  auction: function () {
    dapple.objects.auction.isReversed(1, function (error, result) {
      if(!error) {
          console.log(result);
      }
      else {
          console.log(error);
      }
    });
  }
});

Template.createauction.viewmodel({
  sellamount: '0',
  startbid: '0',
  minimumincrease: '0',
  duration: '0',
  create: function(event) {
    event.preventDefault();

    web3.eth.defaultAccount = web3.eth.accounts[0];
    var account = web3.eth.accounts[0];
    var selling = '0x52fe88b987c7829e5d5a61c98f67c9c14e6a7a90';
    var buying = '0xffb1c99b389ba527a9194b1606b3565a07da3eef';
    
    var dapple = new Dapple['token-auction'].class(web3, 'morden');    
    
    Dapple.erc20.class(web3);
    var eth = Dapple.erc20.classes.ERC20.at(selling);
    eth.approve(dapple.objects.auction.address, 10000);
    var mkr = Dapple.erc20.classes.ERC20.at(buying);
    mkr.approve(dapple.objects.auction.address, 10000);

    dapple.objects.auction.NewAuction(function (error, result) {
      if(!error) {
        console.log(result);
        console.log("AuctionId: ", result.args.id.toNumber());
        console.log("BaseId: ", result.args.base_id.toNumber());
      }
      else {
        console.log("error: ", error);
      }
    })

    dapple.objects.auction.newAuction(account, selling, buying, 100, 10, 1,
    100000, {gas: 4700000 }, function (error, result) {
      if(!error) {
          var auction_id = result.auction_id;
          var base_id = result.base_id;
          console.log("Auction created with auction_id: ", auction_id, "and base_id: ", base_id);
      }
      else {
          console.log(error);
      }
    });
  }
});

Template.allowance.viewmodel({
  create: function(event) {
    event.preventDefault();
    var dapple = new Dapple['token-auction'].class(web3, 'morden');    
    web3.eth.defaultAccount = web3.eth.accounts[0];
    
    dapple.objects.auction.Bid(function (error, result) {
      if(!error) {
        console.log(result);
      }
      else {
        console.log("error: ", error);
      }
    })
    Dapple.erc20.class(web3);
    var selling = '0x52fe88b987c7829e5d5a61c98f67c9c14e6a7a90';
    var buying = '0xffb1c99b389ba527a9194b1606b3565a07da3eef';
    var eth = Dapple.erc20.classes.ERC20.at(selling);
    eth.approve(dapple.objects.auction.address, 10000);
    var mkr = Dapple.erc20.classes.ERC20.at(buying);
    mkr.approve(dapple.objects.auction.address, 10000);
    dapple.objects.auction.newBid(2, web3.eth.accounts[0], 15, {gas: 500000 }, function (error, result) {
      if(!error) {
        console.log(result);
      }
      else {
        console.log("error: ", error);
      }
    })
  }
});
