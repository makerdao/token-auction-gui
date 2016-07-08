// console.log('package-post-init start')
Dapple['init'] = function (env) {
  if (env === 'test' || env === 'morden') {
    Dapple.env = 'morden'
    Dapple['erc20'].class(web3, Dapple['erc20'].environments['morden'])
    Dapple['erc20js'] = new Dapple.Maker(web3, 'morden')
  } else if (env === 'live' || env === 'main') {
    Dapple.env = 'live'
    Dapple['erc20'].class(web3, Dapple['erc20'].environments['live'])
    Dapple['erc20js'] = new Dapple.Maker(web3, 'live')
  } else if (env === 'private' || env === 'default') {
    Dapple['erc20'].class(web3, Dapple['erc20'].environments['default'])
  }
}

console.log('DAPPLE', Dapple)
