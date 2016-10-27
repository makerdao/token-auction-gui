import { Template } from 'meteor/templating';
import auctionPath from '../startup/routes.js';
import './share.html';

Template.share.viewmodel({
  shareUrl() {
    const url = `${Meteor.absoluteUrl()}#${auctionPath}${Session.get('currentAuctionId')}`;
    return url;
  },
  copy() {
    const el = document.querySelector('#shareTextbox');
    el.select();
    document.execCommand('copy');
  },
});
