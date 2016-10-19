import { Template } from 'meteor/templating';
import './share.html';

Template.share.viewmodel({
  shareUrl() {
    const url = window.location.href;
    return url;
  },
  copy() {
    const el = document.querySelector('#shareTextbox');
    el.select();
    document.execCommand('copy');
  },
});
