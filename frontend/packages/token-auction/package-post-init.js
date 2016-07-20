Dapple['token-auction'].init = function (env) {
  if (env === 'test' || env === 'morden') {
    Dapple.env = 'morden'
  } else if (env === 'live' || env === 'main') {
    Dapple.env = 'live'
  } else if (env === 'private' || env === 'default') {
    Dapple.env = 'default'
  }
  Dapple['token-auction'].class(web3, Dapple['token-auction'].environments[Dapple.env])  
  // Check if contract exists on new environment
  var code = web3.eth.getCode(Dapple['token-auction'].objects.auction.address, function (error, code) {
    Session.set('contractExists', !error && typeof code === 'string' && code !== '' && code !== '0x')
  })
}
TokenAuction = Dapple['token-auction']