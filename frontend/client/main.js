import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Auctions } from '/imports/api/auctions.js';
import { Auctionlets } from '/imports/api/auctionlets.js';
import { Balances, ETH, MKR } from '/imports/api/balances.js';
import './main.html';
import '/imports/startup/client/index.js'

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

//TODO Add check whether bid is high enough, has to be minimum of current auctionlet bid
Template.auctionlet.viewmodel({
  auctionlet() {
    var singleAuctionlet = Auctionlets.findOne({});
    //TODO Set bid to singleauction.buy_amount + 1
    /*if(auctionlet != undefined) {
      this.bid(singleAuctionlet.buy_amount + 1)
    }*/
    return Auctionlets.findOne({});
  },
  bid: 0,
  create(event) {
    event.preventDefault();
    let auction = Auctions.findOne({"auctionId": Meteor.settings.public.auctionId});
    if(auction != undefined && Balances.isBalanceSufficient(this.bid(), auction.buying)) {
      document.getElementById("spnPlacingBid").style.display = "block";
      //move this elsewhere or it will be called multiple times ?
      TokenAuction.objects.auction.Bid(function (error, result) {
        if(!error) {
          console.log('bid is set');
          document.getElementById("spnPlacingBid").style.display = "none";
          Auctionlets.getAuctionlet();
        }
        else {
          console.log("error: ", error);
        }
      })

      let bidAmount = this.bid()
      ETH.Approval(function(error, result) {
        if(!error) {
          Auctionlets.bidOnAuctionlet(Meteor.settings.public.auctionletId, bidAmount, auction.sell_amount);
        }
      });

      Balances.setEthAllowance(this.bid());
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