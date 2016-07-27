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
    TokenAuction.objects.auction.Bid(function (error, result) {
        document.getElementById("spnPlacingBid").style.display = "none";
        if(!error) {
          Transactions.add('bid', result.transactionHash, { id: idx, status: Status.BID })
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
          Transactions.add('bid', result.transactionHash, { id: idx, status: Status.PENDING })
          Auctionlets.bidOnAuctionlet(Meteor.settings.public.auctionletId, result.args.value.toString(10), auction.sell_amount);
        }
      });
    });

    Transactions.observeRemoved('bid', function (document) {
    switch (document.object.status) {
      case Status.CANCELLED:
      case Status.BID:
        if (document.receipt.logs.length === 0) {
          //Show error in User interface
          console.log('bid went wrong')
        } else {
          //Show bid is succesful
          console.log('bid is succesful')
        }
        break
      case Status.PENDING:
        // Shown an error in the UI?
        console.log('bid is pending')
        
    }
  })
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

Template.test.viewmodel({
  create(event) {
    ETH.balanceOf(Session.get('address'), function(error, result) {
      if(!error) {
        console.log(web3.toBigNumber(result))
        console.log(result.toNumber());
        console.log(result.toString(10))
      }
      else {
        console.log('mkr error: ', error);
      }
    })
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

Template.auctionlet.viewmodel({
  auctionlet() {
    var singleAuctionlet = Auctionlets.findOne({"auctionletId": Meteor.settings.public.auctionletId});
    var singleAuction = Auctions.findOne({"auctionId": Meteor.settings.public.auctionId});
    if(singleAuctionlet != undefined && singleAuction != undefined) {
      var requiredBid = Math.ceil(singleAuctionlet.buy_amount * (100 + singleAuction.min_increase) / 100)
      this.bid(web3.fromWei(requiredBid))
    }
    return singleAuctionlet
  },
  bid: 0,
  create(event) {
    event.preventDefault();
    console.log(this.bid())
    document.getElementById("spnBidInsufficient").style.display = "none";
    document.getElementById("spnBalanceInsufficient").style.display = "none";
    let auctionletBid = web3.toWei(this.bid())
    let auction = Auctions.findOne({"auctionId": Meteor.settings.public.auctionId});
    let auctionlet = Auctionlets.findOne({"auctionletId": Meteor.settings.public.auctionletId});
    
    if(auction != undefined && Balances.isBalanceSufficient(auctionletBid, auction.buying)) {
      if(auctionlet != undefined && auctionletBid >= Math.ceil(auctionlet.buy_amount * (100 + auction.min_increase) / 100)) {
        document.getElementById("spnPlacingBid").style.display = "block";
        Balances.setEthAllowance(auctionletBid);
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

    TokenAuction.objects.auction.NewAuction(function (error, result) {
      if(!error) {
        console.log("AuctionId: ", result.args.id.toNumber());
        console.log("BaseId: ", result.args.base_id.toNumber());
      }
      else {
        console.log("error: ", error);
      }
    });

    let weiSellAmount = web3.toWei(this.sellamount())
    console.log('wei sell amount: ', weiSellAmount)
    let weiStartBid = web3.toWei(this.startbid())
    console.log('wei start bid: ', weiStartBid)
    let weiMinIncrease = web3.toWei(this.minimumincrease())
    console.log('wei minimum increase:', weiMinIncrease)
    Auctions.newAuction(Session.get('address'), Meteor.settings.public.MKR.address, 
    Meteor.settings.public.ETH.address, web3.toWei(this.sellamount()), web3.toWei(this.startbid()), web3.toWei(this.minimumincrease()), 
    this.duration())
  }
});