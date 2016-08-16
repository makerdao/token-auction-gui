import { Template } from 'meteor/templating';
import Tokens from '/imports/api/tokens.js';
import './tokens.html';

Template.tokens.viewmodel({
  tokens() {
    return Tokens.find({});
  },
});
