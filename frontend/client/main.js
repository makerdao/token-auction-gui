import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Auctions } from '/imports/api/auctions.js';
import { Auctionlets } from '/imports/api/auctionlets.js';
import { Balances } from '/imports/api/balances.js';
import './main.html';
import { dapple, eth, mkr } from '/imports/startup/client/index.js';

Template.balance.viewmodel({
  mkrName() {
    return Meteor.settings.public.MKR.name;
  },
  mkrAddress() {
    return Meteor.settings.public.MKR.address;
  },
  mkrToken() {
    let token = Balances.findOne({"tokenAddress": Meteor.settings.public.MKR.address});
    return token;
  },
  ethName() {
    return Meteor.settings.public.ETH.name;
  },
  ethAddress() {
    return Meteor.settings.public.ETH.address;
  },
  ethToken() {
    let token = Balances.findOne({"tokenAddress": Meteor.settings.public.ETH.address});
    return token;
  },
});

Template.test.viewmodel({
  create(event) {
    getAuctionlet()
  }
});

Template.auction.viewmodel({
  auction() {
    var singleAuction = Auctions.findOne({"auctionId": Meteor.settings.public.auctionId});
    return singleAuction;
  },
  contractaddress() {
    return dapple.objects.auction.address;
  }
});

//TODO Add check whether bid is high enough, has to be minimum of current auctionlet bid
Template.auctionlet.viewmodel({
  auctionlet() {
    var singleAuctionlet = Auctionlets.findOne({});
    //console.log('auctionlet: ', singleAuctionlet)
    /*if(auctionlet != undefined) {
      this.bid(singleAuctionlet.buy_amount + 1)
    }*/
    return Auctionlets.findOne({});
  },
  bid: 0,
  create(event) {
    event.preventDefault();
  
    document.getElementById("spnPlacingBid").style.display = "block";
    //move this elsewhere or it will be called multiple times ?
    dapple.objects.auction.Bid(function (error, result) {
      if(!error) {
        console.log(result);
        document.getElementById("spnPlacingBid").style.display = "none";
        //update the results in the UI, retrieve the auctionlet again
        getAuctionlet();
      }
      else {
        console.log("error: ", error);
      }
    })

    dapple.objects.auction.bid['uint256,uint256'](Meteor.settings.public.auctionletId, this.bid(), {gas: 1500000 }, function (error, result) {
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
  create(event) {
    event.preventDefault();
    document.getElementById("spnSetAllowance").style.display = "block";
    
    eth.Approval(function(error, result) {
      if(!error) {
        console.log('Allowance approved: ', result)
        document.getElementById("spnSetAllowance").style.display = "none";
        document.getElementById("spnAllowanceSet").style.display = "block";
      }
    })

    eth.approve(dapple.objects.auction.address, 1000000, {gas: 500000 });
    mkr.approve(dapple.objects.auction.address, 1000000, {gas: 500000 });
  }
});

Template.newauction.viewmodel({
  sellamount: 0,
  startbid: 0,
  minimumincrease: 0,
  duration: 0,
  create(event) {
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

