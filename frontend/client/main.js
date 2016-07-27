import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Auctions } from '/imports/api/auctions.js';
import { Auctionlets } from '/imports/api/auctionlets.js';
import { Balances, ETH, MKR } from '/imports/api/balances.js';
import './main.html';
import '/imports/startup/client/index.js';
import '/imports/helpers.js';
import { Transactions } from '/imports/lib/_transactions.js';

Template.body.onCreated(function() {
  console.log('On body created');
  this.autorun(() => {
      Auctionlets.watchBid();
      let ownerAddress = Session.get('address')
      console.log("Address",ownerAddress)
      Balances.watchEthApproval()
      Auctions.watchNewAuction();
    });

    Balances.watchAllowanceTransactions();
    Auctionlets.watchBidTransactions();
})

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

Template.claimbid.viewmodel({
  create(event) {
    getAuctionlet()
  }
});

Template.auction.viewmodel({
  auction() {
    var singleAuction = Auctions.findAuction()
    return singleAuction;
  },
  contractaddress() {
    return TokenAuction.objects.auction.address;
  }
});

Template.auctionlet.viewmodel({
  auctionlet() {
    var singleAuctionlet = Auctionlets.findAuctionlet()
    var singleAuction = Auctions.findAuction()
    if(singleAuctionlet != undefined && singleAuction != undefined) {
      //console.log('buy amount:', web3.toBigNumber(singleAuctionlet.buy_amount).toString(10), ' min_increase:', singleAuction.min_increase)
      var requiredBid = Auctionlets.calculateRequiredBid(singleAuctionlet.buy_amount, singleAuction.min_increase)
      //console.log('required bid in eth', web3.fromWei(requiredBid.toString(10)))
      //console.log('required bid in wei', requiredBid.toString(10))
      this.bid(web3.fromWei(requiredBid))
    }
    return singleAuctionlet
  },
  bid: 0,
  create(event) {
    event.preventDefault();
    console.log(this.bid())
    //TODO Set this via template instead of directly on the DOM
    document.getElementById("spnBidInsufficient").style.display = "none";
    document.getElementById("spnBalanceInsufficient").style.display = "none";
    let auctionletBid = web3.toWei(this.bid())
    let auction = Auctions.findAuction();
    let auctionlet = Auctionlets.findAuctionlet()
    
    if(auction != undefined && Balances.isBalanceSufficient(auctionletBid, auction.buying)) {
      if(auctionlet != undefined && auctionletBid >= Auctionlets.calculateRequiredBid(auctionlet.buy_amount, auction.min_increase)) {
        document.getElementById("spnPlacingBid").style.display = "block";
        Auctionlets.doBid(auctionletBid);
      }
      else {
        document.getElementById("spnBidInsufficient").style.display = "block";
      }
    }
    else {
      document.getElementById("spnBalanceInsufficient").style.display = "block";
    }
  }
});

Template.allowance.viewmodel({
  create(event) {
    event.preventDefault();
    document.getElementById("spnSetAllowance").style.display = "block";
    
    ETH.Approval(function(error, result) {
      if(!error) {
        console.log('Allowance approved for ETH: ', result)
        document.getElementById("spnSetAllowance").style.display = "none";
        document.getElementById("spnAllowanceSet").style.display = "block";
      }
    });

    MKR.Approval(function(error, result) {
      if(!error) {
        console.log('Allowance approved for MKR: ', result)
        document.getElementById("spnSetAllowance").style.display = "none";
        document.getElementById("spnAllowanceSet").style.display = "block";
      }
    });

    Balances.setEthAllowance(10000000000000000000);
    Balances.setMkrAllowance(10000000000000000000);
  }
});

Template.newauction.viewmodel({
  sellamount: 0,
  startbid: 0,
  minimumincrease: 0,
  duration: 0,
  create(event) {
    event.preventDefault();

    Balances.watchMkrApproval();
    Balances.setMkrAllowance(web3.toWei(this.sellamount()));
    //TODO use session for creating auction
    
    //let weiSellAmount = web3.toWei(this.sellamount())
    //console.log('wei sell amount: ', weiSellAmount)
    //let weiStartBid = web3.toWei(this.startbid())
    //console.log('wei start bid: ', weiStartBid)
    //Auctions.newAuction(Session.get('address'), Meteor.settings.public.MKR.address, 
    //Meteor.settings.public.ETH.address, web3.toWei(this.sellamount()), web3.toWei(this.startbid()), this.minimumincrease(), 
    //this.duration())
  }
});

Template.transactions.viewmodel({
  transactions() {
    return Transactions.find({});
  }
});