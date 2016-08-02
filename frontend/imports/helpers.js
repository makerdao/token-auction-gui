import { Tokens } from './api/tokens.js';
import { Auctions } from '/imports/api/auctions.js';

Template.registerHelper('fromWei', function(s) {
    return web3.fromWei(s);
})

Template.registerHelper('toWei', function(s) {
    return web3.toWei(s)
})

Template.registerHelper('formatBalance', function(wei) {
    format = '0,0.00[000]'

    return numeral(wei).format(format);
})

Template.registerHelper('json', function(a) {
    try {
        return JSON.stringify(a)
    } catch(e) {
        return a
    }
})

Template.registerHelper('ETHToken', () => {
    let token = Tokens.findOne({"name": Meteor.settings.public.ETH.name});
    return token;
})

Template.registerHelper('MKRToken', () => {
    let token = Tokens.findOne({"name": Meteor.settings.public.MKR.name});
    return token;
})

Template.registerHelper('auctionNotFound', () => {
    let auction = Auctions.findAuction()
    return auction == undefined || auction.creator === "0x0000000000000000000000000000000000000000"
})