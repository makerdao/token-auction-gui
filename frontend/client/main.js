import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import './main.html';

var dapple = new Dapple['token-auction'].class(web3, 'morden');
web3.eth.defaultAccount = web3.eth.accounts[0];
var Auctions = new Mongo.Collection(null);
var AuctionLet = new Mongo.Collection(null);

Template.auction.viewmodel({
  auction: function () {
    dapple.objects.auction.getAuction(Meteor.settings.public.auctionId, {gas: 500000 },function (error, result) {
      if(!error) {
        var auction = {
          auctionId: Meteor.settings.public.auctionId,
          creator: result.args.creator,
          selling: result.args.selling,
          buying: result.args.buying,
          start_bid: result.args.start_bid,
          min_increase: result.args.min_increase,
          min_decrease: result.args.min_decrease,
          sell_amount: result.args.sell_amount,
          duration: result.args.duration,
          reversed: result.args.reversed,
          unsold: result.args.unsold
        }
        Auctions.insert(auction);
      }
      else {
        console.log("error: ", error);
      }
    });
  }
});

Template.auctionlet.viewmodel({
  auctionlet: function() {
    dapple.objects.auction.getAuctionletInfo(Meteor.settings.public.auctionletId, {gas: 500000 }, function (error, result) {
      if(!error) {
        var auctionlet = {
          auctionletId: Meteor.settings.public.auctionletId,
          auction_id: result.args.auction_id,
          last_bidder: result.args.last_bidder,
          last_bid_time: result.args.last_bid_time,
          buy_amount: result.args.buy_amount,
          sell_amount: result.args.sell_amount,
          unclaimed: result.args.unclaimed,
          base: result.args.base
        }
        AuctionLet.insert(auctionlet);
      }
      else {
        console.log("error: ", error);
      }
    })
    return AunctionLet.findOne({"auctionlet_id": Meteor.settings.public.auctionletId});
  }
});

Template.allowance.viewmodel({
  create: function(event) {
    event.preventDefault();
    
    dapple.objects.auction.Bid(function (error, result) {
      if(!error) {
        console.log(result);
      }
      else {
        console.log("error: ", error);
      }
    })
    Dapple.erc20.class(web3);
    var eth = Dapple.erc20.classes.ERC20.at(Meteor.settings.public.ETH.address);
    eth.approve(dapple.objects.auction.address, 10000);
    var mkr = Dapple.erc20.classes.ERC20.at(Meteor.settings.public.MKR.address);
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

Template.newauction.viewmodel({
  sellamount: 0,
  startbid: 0,
  minimumincrease: 0,
  duration: 0,
  create: function(event) {
    event.preventDefault();

    dapple.objects.auction.NewAuction(function (error, result) {
      if(!error) {
        console.log("AuctionId: ", result.args.id.toNumber());
        console.log("BaseId: ", result.args.base_id.toNumber());
      }
      else {
        console.log("error: ", error);
      }
    })

    dapple.objects.auction.newAuction(web3.eth.accounts[0], selling, buying, sellamount, startbid,
    minimumincrease, duration, {gas: 4700000 }, function (error, result) {
      if(!error) {
          console.log('New auction transaction started')
      }
      else {
          console.log(error);
      }
    });
  }
});

Template.getauctions.viewmodel({
  auctions: function () {
    return Auctions.find({});
  },
  click: function(event) {
    event.preventDefault();
    Auctions.remove({})
    //Get the auction info and auctionlets information
    dapple.objects.auction.NewAuction({}, { fromBlock: Meteor.settings.public.auctionFromBlock }, function (error, trade) {
      if (!error) {
        if(!Auctions.findOne({id: trade.args.id.toNumber()})) {
          Auctions.insert({id: trade.args.id.toNumber(), base_id: trade.args.base_id.toNumber()})
        }        
      }
    })
  }
})

