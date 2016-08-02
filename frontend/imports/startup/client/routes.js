import { FlowRouter } from 'meteor/kadira:flow-router';

currentAuctionId = Meteor.settings.public.currentAuctionId;
currentAuctionletId = Meteor.settings.public.auctionletId;

FlowRouter.route('/auction/:_id', {
    action(params, queryParams) {
        let id = parseInt(params._id)
        if(id != undefined && id > 0) {
            currentAuctionId = id;
            currentAuctionletId = id;
        }
        console.log('Dit is auction nr:', params._id)
    }
})

FlowRouter.route('/', {
    action() {
        console.log('Dit is de default auction')
        currentAuctionId = Meteor.settings.public.auctionId
        currentAuctionletId = Meteor.settings.public.auctionletId
    }
})

export { currentAuctionId, currentAuctionletId }