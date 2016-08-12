Package.describe({
  name: 'token-auction:dapple',
  version: '0.0.1',
  summary: 'Dapple related code for Token auction',
  git: '',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.2.1');
  api.use('ecmascript', 'client');
  api.use('web3:dapple', 'client');
  api.use('session', 'client');

  api.addFiles(['build/meteor.js'], 'client');
  api.addFiles(['package-post-init.js'], 'client');

  api.export('TokenAuction', 'client');
});
