import { FlowRouter } from 'meteor/kadira:flow-router';

currentAuctionId = Meteor.settings.public.currentAuctionId;
currentAuctionletId = Meteor.settings.public.auctionletId;
const AUCTIONPATH = 'auction/'

FlowRouter.route(Meteor.settings.public.path + AUCTIONPATH + ':_id', {
    action(params, queryParams) {
        let id = parseInt(params._id)
        if(id != undefined && id > 0) {
            currentAuctionId = id;
            currentAuctionletId = id;
        }
        console.log('Dit is auction nr:', params._id)
    }
})

FlowRouter.route(Meteor.settings.public.path, {
    action() {
        console.log('Dit is de default auction')
        currentAuctionId = Meteor.settings.public.auctionId
        currentAuctionletId = Meteor.settings.public.auctionletId
    }
})

export { currentAuctionId, currentAuctionletId, AUCTIONPATH }