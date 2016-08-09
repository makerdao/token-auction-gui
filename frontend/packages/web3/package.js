Package.describe({
  name: 'web3:dapple',
  version: '0.0.1',
  summary: 'Web 3 initalisation',
  git: '',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.2.1');

  api.use('ethereum:web3', 'client');

  api.addFiles(['package-pre-init.js'], 'client');

  api.export('web3', 'client');
});
