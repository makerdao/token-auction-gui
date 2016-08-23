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
    return Session.get('newAuctionMessage');
  },
  newAuctionUrl() {
    return Session.get('newAuctionUrl');
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
        type: 'alert-danger' });
      }
    } else {
      console.log('balance insufficient');
      Session.set('newAuctionMessage', { message: 'Error creating new auction, MKR balance insufficient',
      type: 'alert-danger' });
    }
  },
});
