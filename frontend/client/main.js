import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Auctions } from '/imports/api/auctions.js';
import { Auctionlets } from '/imports/api/auctionlets.js';
import './main.html';
import '/imports/startup/client/index.js';

var dapple = new tokenauction.class(web3, 'morden');
web3.eth.defaultAccount = web3.eth.accounts[0];

Template.auction.viewmodel({
  auction: function () {
    var singleAuction = Auctions.findOne({"auctionId": Meteor.settings.public.auctionId});
    return singleAuction;
  }
});

//TODO Add check whether bid is high enough, has to be minimum of current auctionlet bid
Template.auctionlet.viewmodel({
  auctionlet: function() {
    var singleAuctionlet = Auctionlets.findOne({"auctionletId": Meteor.settings.public.auctionletId});
    console.log('auctionlet: ', singleAuctionlet)
    this.bid(singleAuctionlet.buy_amount + 1)
    return singleAuctionlet;
  },
  bid: 0,
  create: function(event) {
    event.preventDefault();
  
    document.getElementById("spnPlacingBid").style.display = "block";
    //move this elsewhere or it will be called multiple times ?
    dapple.objects.auction.Bid(function (error, result) {
      if(!error) {
        console.log(result);
        document.getElementById("spnPlacingBid").style.display = "none";
        //update the results in the UI, retrieve the auctionlet again
        dapple.objects.auction.getAuctionletInfo(Meteor.settings.public.auctionletId, {gas: 500000 }, function (error, result) {
          if(!error) {
            console.log(result);
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
            console.log("error: ", error);
          }
        })
      }
      else {
        console.log("error: ", error);
      }
    })

    dapple.objects.auction.newBid(Meteor.settings.public.auctionletId, web3.eth.accounts[0], this.bid(), {gas: 1500000 }, function (error, result) {
      if(!error) {
        console.log(result);
        
      }
      else {
        console.log("error: ", error);
      }
    })
}
});

Template.allowance.viewmodel({
  create: function(event) {
    event.preventDefault();
    document.getElementById("spnSetAllowance").style.display = "block";
    erc20.class(web3);
    var eth = erc20.classes.ERC20.at(Meteor.settings.public.ETH.address);
    
    eth.Approval(function(error, result) {
      if(!error) {
        console.log(result)
        document.getElementById("spnSetAllowance").style.display = "none";
        document.getElementById("spnAllowanceSet").style.display = "block";
      }
    })

    eth.approve(dapple.objects.auction.address, 1000000, {gas: 500000 });
    var mkr = erc20.classes.ERC20.at(Meteor.settings.public.MKR.address);
    mkr.approve(dapple.objects.auction.address, 1000000, {gas: 500000 });
    
  }
});

Template.placebid.viewmodel({
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
    });

    dapple.objects.auction.newAuction(web3.eth.accounts[0], Meteor.settings.public.MKR.address, 
    Meteor.settings.public.ETH.address, this.sellamount(), this.startbid(), this.minimumincrease(), this.duration(), 
    {gas: 4700000 }, function (error, result) {
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

