// console.log('package-post-init start')
Dapple.erc20.init = function init(env) {
  switch (env) {
    case 'test':
      Dapple.env = 'kovan';
      break;
    case 'main':
      Dapple.env = 'live';
      break;
    case 'private':
      Dapple.env = 'default';
      break;
    default:
      Dapple.env = env;
      break;
  }
  Dapple.erc20.class(web3, Dapple.erc20.environments[Dapple.env]);
};

ERC20 = Dapple.erc20;
