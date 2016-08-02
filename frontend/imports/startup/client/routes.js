import { FlowRouter } from 'meteor/kadira:flow-router';

//currentAuctionId = Meteor.settings.public.currentAuctionId;
//currentAuctionletId = Meteor.settings.public.auctionletId;

getCurrentAuctionId = function() {
    //console.log('Session auction id', Session.get('currentAuctionId'))
    //let auctionId = parseInt(Session.get('currentAuctionId')) || 0
    //console.log('auction Id in getter', auctionId)
    return parseInt(Session.get('currentAuctionId')) || Meteor.settings.public.auctionId
}

getCurrentAuctionletId = function() {
    //console.log('Session auction id', Session.get('currentAuctionId'))
    //let auctionId = parseInt(Session.get('currentAuctionId')) || 0
    //console.log('auction Id in getter', auctionId)
    return parseInt(Session.get('currentAuctionletId')) || Meteor.settings.public.auctionletId
}

FlowRouter.route(Meteor.settings.public.path, {
    action() {
        let hash = FlowRouter.current().context.hash
        let auctionIdFound = false
        if(hash != undefined) {
            let idParam = hash.split('-')[1]
            let auctionId = parseInt(idParam) || 0
            if(auctionId != undefined && auctionId > 0) {
                Session.set('currentAuctionletId', auctionId)
                Session.set('currentAuctionId', auctionId)
                console.log('Session auction id', Session.get('currentAuctionId'))
                auctionIdFound = true
            }
        }
        if(!auctionIdFound) {
            Session.set('currentAuctionId', Meteor.settings.public.auctionId)
            Session.set('currentAuctionletId', Meteor.settings.public.auctionletId)
        }
    }
})

export { getCurrentAuctionId, getCurrentAuctionletId }