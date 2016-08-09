// console.log('package-post-init start')
Dapple.erc20.init = function init(env) {
  if (env === 'test' || env === 'morden') {
    Dapple.env = 'morden';
  } else if (env === 'live' || env === 'main') {
    Dapple.env = 'live';
  } else if (env === 'private' || env === 'default') {
    Dapple.env = 'default';
  }
  Dapple.erc20.class(web3, Dapple.erc20.environments[Dapple.env]);
};

ERC20 = Dapple.erc20;
