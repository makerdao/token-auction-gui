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
    dapple.objects.auction.getTime(function (error, result) {
      if(!error) {
          console.log(result);
      }
      else {
          console.log(error);
      }
    });
    dapple.objects.auction.newAuction(account, selling, buying, 100, 10, 1,
    100000, {gas: 500000 }, function (error, result) {
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
