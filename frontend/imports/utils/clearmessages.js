import { Session } from 'meteor/session';

export default function clearMessages() {
  Session.set('newBidMessage', null);
  Session.set('newTransactionMessage', null);
  Session.set('claimMessage', null);
  Session.set('lastMessages', []);

  console.log('Cleared messages...');
}
