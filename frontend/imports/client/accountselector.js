import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import './accountselector.html';

Template.accountSelector.viewmodel({
  contract: () => Session.get('contractAddress'),
});
