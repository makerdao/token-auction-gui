if (typeof Dapple === 'undefined') {
  Dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

Dapple['token-auction'] = (function builder () {
  var environments = {
      'develop': {},
      'kovan': {
        'auction': {
          'type': 'SplittingAuctionManager',
          'value': '0xD0Abb0e61A905a50b21Bf4c74F39B9e101469365'
        }
      },
      'live': {
        'auction': {
          'type': 'SplittingAuctionManager',
          'value': '0x7f6eccbca710e8b5af7d837c7e2e406844538e10'
        }
      }
    };

  function ContractWrapper (headers, _web3) {
    if (!_web3) {
      throw new Error('Must supply a Web3 connection!');
    }

    this.headers = headers;
    this._class = _web3.eth.contract(headers.interface);
  }

  ContractWrapper.prototype.deploy = function () {
    throw new Error('Module was built without any deploy data.');
  };

  ContractWrapper.prototype.new = function () {
    throw new Error('Module was built without any deploy data.');
  };

  var passthroughs = ['at'];
  for (var i = 0; i < passthroughs.length; i += 1) {
    ContractWrapper.prototype[passthroughs[i]] = (function (passthrough) {
      return function () {
        return this._class[passthrough].apply(this._class, arguments);
      };
    })(passthroughs[i]);
  }

  function constructor (_web3, env) {
    if (!env) {
      env = {
      'objects': {},
      'type': 'internal'
    };
    }
    if(!("objects" in env) && typeof env === "object") {
      env = {objects: env};
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = environments[env];
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'AuctionManager': {
        'interface': [{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"max_sell_amount","type":"uint256"},{"name":"buy_amount","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newReverseAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auctionlet_id","type":"uint256"}],"name":"getAuctionletInfo","outputs":[{"name":"auction_id","type":"uint256"},{"name":"last_bidder","type":"address"},{"name":"last_bid_time","type":"uint256"},{"name":"buy_amount","type":"uint256"},{"name":"sell_amount","type":"uint256"},{"name":"unclaimed","type":"bool"},{"name":"base","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"refund","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"},{"name":"collection_limit","type":"uint256"}],"name":"newTwoWayAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auctionlet_id","type":"uint256"}],"name":"getLastBid","outputs":[{"name":"prev_bid","type":"uint256"},{"name":"prev_quantity","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"auctionlet_id","type":"uint256"}],"name":"claim","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"ttl","type":"uint256"},{"name":"expiration","type":"uint256"}],"name":"newAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"},{"name":"collection_limit","type":"uint256"}],"name":"newTwoWayAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"auctionlet_id","type":"uint256"},{"name":"bid_how_much","type":"uint256"}],"name":"bid","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"refund","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"max_sell_amount","type":"uint256"},{"name":"buy_amount","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newReverseAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auction_id","type":"uint256"}],"name":"isReversed","outputs":[{"name":"reversed","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiaries","type":"address[]"},{"name":"payouts","type":"uint256[]"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newTwoWayAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auction_id","type":"uint256"}],"name":"getRefundAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auctionlet_id","type":"uint256"}],"name":"isExpired","outputs":[{"name":"expired","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiaries","type":"address[]"},{"name":"payouts","type":"uint256[]"},{"name":"refund","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newTwoWayAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auction_id","type":"uint256"}],"name":"getAuctionInfo","outputs":[{"name":"creator","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"sell_amount","type":"uint256"},{"name":"ttl","type":"uint256"},{"name":"reversed","type":"bool"},{"name":"unsold","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiaries","type":"address[]"},{"name":"payouts","type":"uint256[]"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"auctionlet_id","type":"uint256"}],"name":"LogBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"base_id","type":"uint256"},{"indexed":false,"name":"new_id","type":"uint256"},{"indexed":false,"name":"split_id","type":"uint256"}],"name":"LogSplit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"auction_id","type":"uint256"}],"name":"LogAuctionReversal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"uint256"},{"indexed":false,"name":"base_id","type":"uint256"}],"name":"LogNewAuction","type":"event"}]
      },
      'SplittingAuctionManager': {
        'interface': [{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"max_sell_amount","type":"uint256"},{"name":"buy_amount","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newReverseAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auctionlet_id","type":"uint256"}],"name":"getAuctionletInfo","outputs":[{"name":"auction_id","type":"uint256"},{"name":"last_bidder","type":"address"},{"name":"last_bid_time","type":"uint256"},{"name":"buy_amount","type":"uint256"},{"name":"sell_amount","type":"uint256"},{"name":"unclaimed","type":"bool"},{"name":"base","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"refund","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"},{"name":"collection_limit","type":"uint256"}],"name":"newTwoWayAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"auctionlet_id","type":"uint256"},{"name":"bid_how_much","type":"uint256"},{"name":"quantity","type":"uint256"}],"name":"bid","outputs":[{"name":"new_id","type":"uint256"},{"name":"split_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auctionlet_id","type":"uint256"}],"name":"getLastBid","outputs":[{"name":"prev_bid","type":"uint256"},{"name":"prev_quantity","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"auctionlet_id","type":"uint256"}],"name":"claim","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"ttl","type":"uint256"},{"name":"expiration","type":"uint256"}],"name":"newAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"},{"name":"collection_limit","type":"uint256"}],"name":"newTwoWayAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"refund","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"max_sell_amount","type":"uint256"},{"name":"buy_amount","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newReverseAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auction_id","type":"uint256"}],"name":"isReversed","outputs":[{"name":"reversed","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiaries","type":"address[]"},{"name":"payouts","type":"uint256[]"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newTwoWayAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auction_id","type":"uint256"}],"name":"getRefundAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auctionlet_id","type":"uint256"}],"name":"isExpired","outputs":[{"name":"expired","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiaries","type":"address[]"},{"name":"payouts","type":"uint256[]"},{"name":"refund","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newTwoWayAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"auction_id","type":"uint256"}],"name":"getAuctionInfo","outputs":[{"name":"creator","type":"address"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"min_decrease","type":"uint256"},{"name":"sell_amount","type":"uint256"},{"name":"ttl","type":"uint256"},{"name":"reversed","type":"bool"},{"name":"unsold","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiaries","type":"address[]"},{"name":"payouts","type":"uint256[]"},{"name":"selling","type":"address"},{"name":"buying","type":"address"},{"name":"sell_amount","type":"uint256"},{"name":"start_bid","type":"uint256"},{"name":"min_increase","type":"uint256"},{"name":"ttl","type":"uint256"}],"name":"newAuction","outputs":[{"name":"auction_id","type":"uint256"},{"name":"base_id","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"auctionlet_id","type":"uint256"}],"name":"LogBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"base_id","type":"uint256"},{"indexed":false,"name":"new_id","type":"uint256"},{"indexed":false,"name":"split_id","type":"uint256"}],"name":"LogSplit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"auction_id","type":"uint256"}],"name":"LogAuctionReversal","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"id","type":"uint256"},{"indexed":false,"name":"base_id","type":"uint256"}],"name":"LogNewAuction","type":"event"}]
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      if(!(obj['type'].split('[')[0] in this.classes)) continue;
      this.objects[i] = this.classes[obj['type'].split('[')[0]].at(obj.value);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Dapple['token-auction'];
}
