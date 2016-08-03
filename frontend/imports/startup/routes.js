import { Router } from 'meteor/iron:router';

let auctionPath = '/auction/'

Router.route('/', function(){
    console.log(Meteor.absoluteUrl())
    let hash = this.params.hash
    let auctionPart = hash != null && hash != undefined ? this.params.hash.slice(9) : 0
    let auctionId = parseInt(auctionPart) || 0
    if(auctionId > 0) {
        Session.set('currentAuctionletId', auctionId)
        Session.set('currentAuctionId', auctionId)
    }
    else {
        Session.set('currentAuctionId', Meteor.settings.public.auctionId)
        Session.set('currentAuctionletId', Meteor.settings.public.auctionletId)
    }
    console.log('Displaying auction nr:', Session.get('currentAuctionId'))    
})

Router.route('/weekly-mkr-auction/', function(){
    console.log(Meteor.absoluteUrl())
    let hash = this.params.hash
    let auctionPart = hash != null && hash != undefined ? this.params.hash.slice(9) : 0
    let auctionId = parseInt(auctionPart) || 0
    if(auctionId > 0) {
        Session.set('currentAuctionletId', auctionId)
        Session.set('currentAuctionId', auctionId)
    }
    else {
        Session.set('currentAuctionId', Meteor.settings.public.auctionId)
        Session.set('currentAuctionletId', Meteor.settings.public.auctionletId)
    }
    console.log('Displaying auction nr:', Session.get('currentAuctionId'))   
})

Meteor.startup(function() {
    Iron.Location.configure({useHashPaths: true});
})