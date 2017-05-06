import { FlowRouter } from 'meteor/kadira:flow-router';

auctionPath = '!/auction/';

function clearSessionVariables() {
  Session.set('newBidMessage', null);
  Session.set('bidProgress', 0);
}

function auctionAction() {
  const hash = FlowRouter.current().context.hash;
  console.log(hash);
  const auctionPart = hash != null && hash !== undefined ? hash.slice(auctionPath.length) : 0;
  const auctionId = parseInt(auctionPart, 10) || 0;
  console.log('Time', (new Date()).getTime());
  clearSessionVariables();
  if (auctionId > 0) {
    console.log('Showing auction with id:', auctionId);
    Session.set('currentAuctionletId', auctionId);
    Session.set('currentAuctionId', auctionId);
  } else {
    console.log('Setting default auction');
    Session.set('currentAuctionId', null);
    Session.set('currentAuctionletId', null);
  }
}

FlowRouter.route('/', {
  action: auctionAction,
});

// XXX workaround for meteor-build-client and FlowRouter together not picking up the root url path prefix
// as application basePath
FlowRouter.route('/weekly-mkr-auction/', {
  action: auctionAction,
});

export { auctionPath as default };
