Package.describe({
  name: 'erc20:dapple',
  version: '0.0.1',
  summary: 'Dapple related code for erc20',
  git: '',
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.2.1')

  api.use('ethereum:web3', 'client')

  api.addFiles(['package-pre-init.js'], 'client')
  api.addFiles(['build/meteor.js'], 'client')
  api.addFiles(['package-post-init.js'], 'client')

  api.export('web3', 'client')
  api.export('Dapple', 'client')
})
