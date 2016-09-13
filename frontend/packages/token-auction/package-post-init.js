Dapple['token-auction'].init = function init(env) {
  if (env === 'test' || env === 'morden') {
    Dapple.env = 'morden';
  } else if (env === 'live' || env === 'main') {
    Dapple.env = 'live';
  } else if (env === 'private' || env === 'default') {
    Dapple.env = 'default';
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
