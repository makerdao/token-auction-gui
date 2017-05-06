import { Template } from 'meteor/templating';
import Auctions from '/imports/api/auctions.js';
import Tokens from '/imports/api/tokens.js';
import './newauction.html';

Template.newauction.viewmodel({
  sellamount: 0,
  startbid: 0,
  minimumincrease: 0,
  duration: 0,
  newAuctionMessage() {
    return Session.get('newAuctionMessage') !== null ?
    Session.get('newAuctionMessage').message : Session.get('newAuctionMessage');
  },
  newAuctionMessageType() {
    return Session.get('newAuctionMessage') !== null ? Session.get('newAuctionMessage').type : 'info';
  },
  newAuctionUrl() {
    return Session.get('newAuctionUrl');
  },
  newAuctionProgress() {
    return Session.get('newAuctionProgress');
  },
  newAuctionDisabled() {
    return (Session.get('newAuctionProgress') > 0 ? 'disabled' : '');
  },
  create(event) {
    event.preventDefault();
    Session.set('newAuctionMessage', null);
    Session.set('newAuctionUrl', null);

    const weiSellAmount = web3.toWei(this.sellamount());
    const weiStartBid = web3.toWei(this.startbid());
    const network = Session.get('network');
    const address = Tokens.getTokenAddress(network, 'MKR');
    if (Tokens.isBalanceSufficient(weiSellAmount, address)) {
      if (weiSellAmount > 0) {
        console.log('balance sufficient');
        const newAuction = {
          sellamount: weiSellAmount,
          startbid: weiStartBid,
          min_increase: this.minimumincrease(),
          duration: this.duration(),
        };
        Session.set('newAuction', newAuction);
        Auctions.createAuction(web3.toWei(this.sellamount()));
      } else {
        Session.set('newAuctionMessage', { message: 'Error creating new auction, MKR sell amount insufficient',
        type: 'danger' });
      }
    } else {
      console.log('balance insufficient');
      Session.set('newAuctionMessage', { message: 'Error creating new auction, MKR balance insufficient',
      type: 'danger' });
    }
  },
  all(event) {
    event.preventDefault();
    const balance = web3.fromWei(Tokens.findOne({ name: 'MKR' }).balance);
    this.sellamount(balance);
  },
});
