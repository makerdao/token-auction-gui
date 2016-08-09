import { FlowRouter } from 'meteor/kadira:flow-router';

auctionPath = '!/auction/';

function auctionAction(params, queryParams) {
    let hash = FlowRouter.current().context.hash;
    let auctionPart = hash != null && hash != undefined ? hash.slice(auctionPath.length) : 0;
    let auctionId = parseInt(auctionPart) || 0;
    if (auctionId > 0) {
        console.log('Showing auction with id:', auctionId);
        Session.set('currentAuctionletId', auctionId);
        Session.set('currentAuctionId', auctionId);
    }
    else {
        console.log('Setting default auction from settings:', Meteor.settings.public.auctionId);
        Session.set('currentAuctionId', Meteor.settings.public.auctionId);
        Session.set('currentAuctionletId', Meteor.settings.public.auctionletId);
    }
}

FlowRouter.route('/', {
    action: auctionAction
})

// XXX workaround for meteor-build-client and FlowRouter together not picking up the root url path prefix
// as application basePath
FlowRouter.route('/weekly-mkr-auction/', {
    action: auctionAction
})

export { auctionPath }