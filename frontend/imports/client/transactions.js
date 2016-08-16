import { Template } from 'meteor/templating';
import Transactions from '/imports/lib/_transactions.js';
import './transactions.html';

Template.transactions.viewmodel({
  transactions() {
    return Transactions.find({});
  },
});
