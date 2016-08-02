import { FlowRouter } from 'meteor/kadira:flow-router';

AUCTIONID = Meteor.settings.public.auctionId;
AUCTIONLETID = Meteor.settings.public.auctionletId;

FlowRouter.route('/auction/:_id', {
    action(params, queryParams) {
        let id = parseInt(params._id)
        if(id != undefined && id > 0) {
            AUCTIONID = id;
            AUCTIONLETID = id;
        }
        console.log('Dit is auction nr:', params._id)
    }
})

FlowRouter.route('/', {
    action() {
        console.log('Dit is de default auction')
        AUCTIONID = Meteor.settings.public.auctionId
        AUCTIONLETID = Meteor.settings.public.auctionletId
    }
})

export { AUCTIONID, AUCTIONLETID }