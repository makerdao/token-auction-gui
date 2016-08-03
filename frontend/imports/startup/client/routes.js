import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/', {
    action(params, queryParams) {
        Session.set('currentAuctionId', Meteor.settings.public.auctionId)
        Session.set('currentAuctionletId', Meteor.settings.public.auctionletId)
    }
})

let auctionPath = '/auction/:auctionId'

function auctionAction(params, queryParams) {
    let auctionId = parseInt(params.auctionId) || 0
    if(auctionId > 0) {
        Session.set('currentAuctionletId', auctionId)
        Session.set('currentAuctionId', auctionId)
    }
}

FlowRouter.route(auctionPath, {
    name: "auctionRoute",
    action: auctionAction
})

// XXX workaround for FlowRouter bug that adds an extra / to the path prefix
FlowRouter.route('/' + auctionPath, {
    action: auctionAction
})


FlowRouter.wait()
Meteor.startup(function() {
    FlowRouter.initialize({hashbang: true})
})