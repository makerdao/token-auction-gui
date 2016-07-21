import { Auctions } from '../../api/auctions.js';
import { Auctionlets } from '../../api/auctionlets.js';
import { Balances } from '../../api/balances.js';
import { Tracker } from 'meteor/tracker';

TokenAuction.init('morden')

Tracker.autorun(function() {
  console.log('lalalala')
  web3.checkAccounts();    
  Auctions.getAuction();
  Auctionlets.getAuctionlet();
  Balances.getEthBalance();
  Balances.getMkrBalance();
})