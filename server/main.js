import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  if (_.isEmpty(Meteor.settings.public)) {
    throw new Meteor.Error(500, 'Settings not available');
  }
});
