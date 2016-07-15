// console.log('package-post-init start')
Dapple['init'] = function (env) {
  if (env === 'test' || env === 'morden') {
    Dapple.env = 'morden'
    Dapple['token-auction'].class(web3, Dapple['token-auction'].environments['morden'])
    Dapple['tokenauctionjs'] = new Dapple.Maker(web3, 'morden')
  } else if (env === 'live' || env === 'main') {
    Dapple.env = 'live'
    Dapple['token-auction'].class(web3, Dapple['token-auction'].environments['live'])
    Dapple['tokenauctionjs'] = new Dapple.Maker(web3, 'live')
  } else if (env === 'private' || env === 'default') {
    Dapple['token-auction'].class(web3, Dapple['token-auction'].environments['default'])
  }
  if (env !== false) {
    // Check if contract exists on new environment
    var code = web3.eth.getCode(Dapple['token-auction'].objects.otc.address, function (error, code) {
      Session.set('contractExists', !error && typeof code === 'string' && code !== '' && code !== '0x')
    })
  } 
}
tokenauction = Dapple['token-auction']