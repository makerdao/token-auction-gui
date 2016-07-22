import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Auctions } from '/imports/api/auctions.js';
import { Auctionlets } from '/imports/api/auctionlets.js';
import { Balances, ETH, MKR } from '/imports/api/balances.js';
import './main.html';
import '/imports/startup/client/index.js'

Template.body.onCreated(function() {
   console.log('On body created');
   
   TokenAuction.objects.auction.Bid(function (error, result) {
      document.getElementById("spnPlacingBid").style.display = "none";
      if(!error) {
        console.log('bid is set');
        Auctionlets.getAuctionlet();
      }
      else {
        console.log("error: ", error);
      }
    });

    let ownerAddress = Session.get('address')
    console.log("Address",ownerAddress)

    ETH.Approval({owner:Session.get('address'), spender: TokenAuction.objects.auction.address},function(error, result) {
      if(!error) {
        console.log('Approved, placing bid')
        let auction = Auctions.findOne({});
        Auctionlets.bidOnAuctionlet(Meteor.settings.public.auctionletId, result.args.value.toNumber(), auction.sell_amount);
      }
    });
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
    var singleAuction = Auctions.findOne({"auctionId": Meteor.settings.public.auctionId});
    return singleAuction;
  },
  contractaddress() {
    return TokenAuction.objects.auction.address;
  }
});

Template.auctionlet.viewmodel({
  auctionlet() {
    var singleAuctionlet = Auctionlets.findOne({"auctionletId": Meteor.settings.public.auctionletId});
    var singleAuction = Auctions.findOne({"auctionId": Meteor.settings.public.auctionId});
    if(singleAuctionlet != undefined && singleAuction != undefined) {
      var requiredBid = Math.ceil(singleAuctionlet.buy_amount * (100 + singleAuction.min_increase) / 100)
      this.bid(requiredBid)
    }
    return singleAuctionlet
  },
  bid: 0,
  create(event) {
    event.preventDefault();
    document.getElementById("spnBidInsufficient").style.display = "none";
    document.getElementById("spnBalanceInsufficient").style.display = "none";
    
    let auction = Auctions.findOne({"auctionId": Meteor.settings.public.auctionId});
    let auctionlet = Auctionlets.findOne({"auctionletId": Meteor.settings.public.auctionletId});
    
    if(auction != undefined && Balances.isBalanceSufficient(this.bid(), auction.buying)) {
      if(auctionlet != undefined && this.bid() >= Math.ceil(auctionlet.buy_amount * (100 + auction.min_increase) / 100)) {
        document.getElementById("spnPlacingBid").style.display = "block";
        let bidAmount = this.bid()
        Balances.setEthAllowance(this.bid());
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

    Balances.setEthAllowance(1000000);
    Balances.setMkrAllowance(1000000);
  }
});

Template.newauction.viewmodel({
  sellamount: 0,
  startbid: 0,
  minimumincrease: 0,
  duration: 0,
  create(event) {
    event.preventDefault();

    TokenAuction.objects.auction.NewAuction(function (error, result) {
      if(!error) {
        console.log("AuctionId: ", result.args.id.toNumber());
        console.log("BaseId: ", result.args.base_id.toNumber());
      }
      else {
        console.log("error: ", error);
      }
    });

    Auctions.newAuction(Session.get('address'), Meteor.settings.public.MKR.address, 
    Meteor.settings.public.ETH.address, this.sellamount(), this.startbid(), this.minimumincrease(), 
    this.duration())
  }
});