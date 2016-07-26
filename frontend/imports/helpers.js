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