import { Session } from 'meteor/session';

export default function clearMessages() {
  //TODO may be needed if we introduce notifications again
  Session.set('lastMessages', []);

  console.log('Cleared messages...');
}
