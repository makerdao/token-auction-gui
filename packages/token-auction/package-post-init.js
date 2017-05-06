Dapple['token-auction'].init = function init(env) {
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
  Dapple['token-auction'].class(web3, Dapple['token-auction'].environments[Dapple.env]);
  // Check if contract exists on new environment
  const contractAddress = Dapple['token-auction'].objects.auction.address;
  web3.eth.getCode(contractAddress, (error, code) => {
    Session.set('contractAddress', contractAddress);
    Session.set('contractExists', !error && typeof code === 'string' && code !== '' && code !== '0x');
  });
};
TokenAuction = Dapple['token-auction'];
