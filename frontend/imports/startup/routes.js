import { FlowRouter } from 'meteor/kadira:flow-router';

let weeklyPath = '/weekly-mkr-auction/'
auctionPath = '!/auction/'

FlowRouter.notFound = {
    action: function() {
        console.log('not found route called')
        Session.set('currentAuctionId', Meteor.settings.public.auctionId)
        Session.set('currentAuctionletId', Meteor.settings.public.auctionletId)
    }
}

function auctionAction(params, queryParams) {
    let hash = FlowRouter.current().context.hash
    let auctionPart = hash != null && hash != undefined ? hash.slice(auctionPath.length) : 0
    let auctionId = parseInt(auctionPart) || 0
    console.log('Showing auction with id:', auctionId)
    if(auctionId > 0) {
        Session.set('currentAuctionletId', auctionId)
        Session.set('currentAuctionId', auctionId)
    }
    else {
        Session.set('currentAuctionId', Meteor.settings.public.auctionId)
        Session.set('currentAuctionletId', Meteor.settings.public.auctionletId)
    }
}

FlowRouter.route(weeklyPath, {
    name: "auctionRoute",
    action: auctionAction
})


FlowRouter.wait()
Meteor.startup(function() {
    FlowRouter.initialize()
})

export { auctionPath }