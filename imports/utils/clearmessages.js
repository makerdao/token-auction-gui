import { Session } from 'meteor/session';

export default function clearMessages() {
  Session.set('newBidMessage', null);
  Session.set('newAuctionMessage', null);
  Session.set('newTransactionMessage', null);
  Session.set('newAuctionUrl', null);
  Session.set('claimMessage', null);
  Session.set('lastMessages', []);

  console.log('Cleared messages...');
}
