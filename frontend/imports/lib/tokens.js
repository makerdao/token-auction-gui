import { Mongo } from 'meteor/mongo';

ERC20.init('morden');
const MKR = ERC20.classes.ERC20.at(Meteor.settings.public.MKR.address);
const ETH = ERC20.classes.ERC20.at(Meteor.settings.public.ETH.address);

var allTokens = {'MKR': MKR, 'ETH': ETH}

const Tokens = new Meteor.Collection(null)

Session.set('buying', localStorage.getItem('buying') || 'ETH')
Session.set('selling', localStorage.getItem('selling') || 'MKR')

/**
 * Syncs the buying and selling' balances and allowances of selected account,
 * usually called for each new block
 */
Tokens.sync = function () {
  var network = Session.get('network')
  var address = Session.get('address')
  if (address) {
    web3.eth.getBalance(address, function (error, balance) {
      var newETHBalance = balance.toString(10)
      if (!error && !Session.equals('ETHBalance', newETHBalance)) {
        Session.set('ETHBalance', newETHBalance)
      }
    })

    var ALL_TOKENS = allTokens

    if (network !== 'private') {
      var contract_address = TokenAuction.objects.auction.address

      // Sync token balances and allowances asynchronously
      for(token_id in ALL_TOKENS) {
        // XXX EIP20
        let token = ALL_TOKENS[token_id]
        console.log('token_id:', token_id, ' and token:', ALL_TOKENS[token_id])
            token.balanceOf(address, function (error, balance) {
              if (!error) {
                Tokens.upsert(token_id, { $set: { balance: balance.toString(10) } })
              }
            })
            token.allowance(address, contract_address, function (error, allowance) {
              if (!error) {
                Tokens.upsert(token_id, { $set: { allowance: allowance.toString(10) } })
              }
            })
      }
    } else {
      for(token_id in ALL_TOKENS){
        console.log('NETWORK IS PRIVATE')
        Tokens.upsert(ALL_TOKENS[token_id], { $set: { balance: '0', allowance: '0' } })
      }
    }
  }
}

export { Tokens }
