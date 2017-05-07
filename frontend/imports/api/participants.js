import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Participants = new Mongo.Collection(null);

const participants = {
  kovan: {
    '0x002ca7f9b416b2304cdd20c26882d1ef5c53f611': 'reverendus',
    '0x0061f1dbaf1e1b2e412a75d3ed6b48c3d7412d35': 'reverendus2',
    '0x0046f01ad360270605e0e5d693484ec3bfe43ba8': 'reverendus3',
    '0x00348e4084567ce2e962b64abe5a54bab256bc26': 'DAI Stablecoin System',
  },
  live: {
    //TBD
  },
};

Participants.getParticipantName = function getParticipantName(address) {
  const network = Session.get('network');
  return participants[network][address];
};

export default Participants;
