import { Template } from 'meteor/templating';
import Participants from '/imports/api/participants.js';
import './address.html';

Template.address.helpers({
  owner: function owner() {
    const address = Template.instance().data.address;
    if (typeof address !== 'undefined') {
      console.log("ADDRESS:" + address);
      console.log("NAME:" + Participants.getParticipantName(address));
      return Participants.getParticipantName(address);
    }
    else {
      return null;
    }
  },
});
