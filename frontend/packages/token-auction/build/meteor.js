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
      'TransferUser': {
        'interface': []
      },
      'Callback': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'addr',
                'type': 'address'
              },
              {
                'name': 'eventName',
                'type': 'string'
              },
              {
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ]
      },
      'SMS': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'number',
                'type': 'string'
              },
              {
                'name': 'message',
                'type': 'string'
              }
            ],
            'name': 'send',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ]
      },
      'Script': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'export',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txoff',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txon',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'inputs': [],
            'payable': false,
            'type': 'constructor'
          },
          {
            'payable': false,
            'type': 'fallback'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'number',
                'type': 'uint256'
              }
            ],
            'name': 'exportNumber',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'exportObject',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'flag',
                'type': 'bool'
              }
            ],
            'name': 'setCalls',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'origin',
                'type': 'address'
              }
            ],
            'name': 'setOrigin',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'chaintype',
                'type': 'bytes32'
              }
            ],
            'name': 'assertChain',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'pushEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'popEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'eventName',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'input',
                'type': 'bytes'
              },
              {
                'indexed': false,
                'name': 'result',
                'type': 'uint256'
              }
            ],
            'name': 'shUint',
            'type': 'event'
          }
        ]
      },
      'System': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'input',
                'type': 'string'
              }
            ],
            'name': 'to_uint',
            'outputs': [
              {
                'name': 'output',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          }
        ]
      },
      'Assertive': {
        'interface': []
      },
      'FallbackFailer': {
        'interface': [
          {
            'payable': false,
            'type': 'fallback'
          }
        ]
      },
      'MathUser': {
        'interface': []
      },
      'MutexUser': {
        'interface': []
      },
      'SafeMathUser': {
        'interface': []
      },
      'TimeUser': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          }
        ]
      },
      'AuctionDatabase': {
        'interface': []
      },
      'AuctionDatabaseUser': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionletInfo',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'last_bidder',
                'type': 'address'
              },
              {
                'name': 'last_bid_time',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'unclaimed',
                'type': 'bool'
              },
              {
                'name': 'base',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getLastBid',
            'outputs': [
              {
                'name': 'prev_bid',
                'type': 'uint256'
              },
              {
                'name': 'prev_quantity',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'isReversed',
            'outputs': [
              {
                'name': 'reversed',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getRefundAddress',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'isExpired',
            'outputs': [
              {
                'name': 'expired',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionInfo',
            'outputs': [
              {
                'name': 'creator',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'reversed',
                'type': 'bool'
              },
              {
                'name': 'unsold',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          }
        ]
      },
      'EventfulAuction': {
        'interface': [
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'Bid',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'name': 'Split',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'AuctionReversal',
            'type': 'event'
          }
        ]
      },
      'EventfulManager': {
        'interface': [
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'name': 'NewAuction',
            'type': 'event'
          }
        ]
      },
      'AssertiveAuction': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionletInfo',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'last_bidder',
                'type': 'address'
              },
              {
                'name': 'last_bid_time',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'unclaimed',
                'type': 'bool'
              },
              {
                'name': 'base',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getLastBid',
            'outputs': [
              {
                'name': 'prev_bid',
                'type': 'uint256'
              },
              {
                'name': 'prev_quantity',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'isReversed',
            'outputs': [
              {
                'name': 'reversed',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getRefundAddress',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'isExpired',
            'outputs': [
              {
                'name': 'expired',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionInfo',
            'outputs': [
              {
                'name': 'creator',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'reversed',
                'type': 'bool'
              },
              {
                'name': 'unsold',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          }
        ]
      },
      'AuctionFrontend': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionletInfo',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'last_bidder',
                'type': 'address'
              },
              {
                'name': 'last_bid_time',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'unclaimed',
                'type': 'bool'
              },
              {
                'name': 'base',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getLastBid',
            'outputs': [
              {
                'name': 'prev_bid',
                'type': 'uint256'
              },
              {
                'name': 'prev_quantity',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'claim',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'bid',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'isReversed',
            'outputs': [
              {
                'name': 'reversed',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getRefundAddress',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'isExpired',
            'outputs': [
              {
                'name': 'expired',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionInfo',
            'outputs': [
              {
                'name': 'creator',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'reversed',
                'type': 'bool'
              },
              {
                'name': 'unsold',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'Bid',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'name': 'Split',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'AuctionReversal',
            'type': 'event'
          }
        ]
      },
      'SplittingAuction': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionletInfo',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'last_bidder',
                'type': 'address'
              },
              {
                'name': 'last_bid_time',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'unclaimed',
                'type': 'bool'
              },
              {
                'name': 'base',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getLastBid',
            'outputs': [
              {
                'name': 'prev_bid',
                'type': 'uint256'
              },
              {
                'name': 'prev_quantity',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'isReversed',
            'outputs': [
              {
                'name': 'reversed',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getRefundAddress',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'isExpired',
            'outputs': [
              {
                'name': 'expired',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionInfo',
            'outputs': [
              {
                'name': 'creator',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'reversed',
                'type': 'bool'
              },
              {
                'name': 'unsold',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'Bid',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'name': 'Split',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'AuctionReversal',
            'type': 'event'
          }
        ]
      },
      'SplittingAuctionFrontend': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionletInfo',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'last_bidder',
                'type': 'address'
              },
              {
                'name': 'last_bid_time',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'unclaimed',
                'type': 'bool'
              },
              {
                'name': 'base',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              },
              {
                'name': 'quantity',
                'type': 'uint256'
              }
            ],
            'name': 'bid',
            'outputs': [
              {
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getLastBid',
            'outputs': [
              {
                'name': 'prev_bid',
                'type': 'uint256'
              },
              {
                'name': 'prev_quantity',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'claim',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'isReversed',
            'outputs': [
              {
                'name': 'reversed',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getRefundAddress',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'isExpired',
            'outputs': [
              {
                'name': 'expired',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionInfo',
            'outputs': [
              {
                'name': 'creator',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'reversed',
                'type': 'bool'
              },
              {
                'name': 'unsold',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'Bid',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'name': 'Split',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'AuctionReversal',
            'type': 'event'
          }
        ]
      },
      'TwoWayAuction': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionletInfo',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'last_bidder',
                'type': 'address'
              },
              {
                'name': 'last_bid_time',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'unclaimed',
                'type': 'bool'
              },
              {
                'name': 'base',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getLastBid',
            'outputs': [
              {
                'name': 'prev_bid',
                'type': 'uint256'
              },
              {
                'name': 'prev_quantity',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'isReversed',
            'outputs': [
              {
                'name': 'reversed',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getRefundAddress',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'isExpired',
            'outputs': [
              {
                'name': 'expired',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionInfo',
            'outputs': [
              {
                'name': 'creator',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'reversed',
                'type': 'bool'
              },
              {
                'name': 'unsold',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'Bid',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'name': 'Split',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'AuctionReversal',
            'type': 'event'
          }
        ]
      },
      'DappleLogger': {
        'interface': []
      },
      'AuctionController': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionletInfo',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'last_bidder',
                'type': 'address'
              },
              {
                'name': 'last_bid_time',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'unclaimed',
                'type': 'bool'
              },
              {
                'name': 'base',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getLastBid',
            'outputs': [
              {
                'name': 'prev_bid',
                'type': 'uint256'
              },
              {
                'name': 'prev_quantity',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'isReversed',
            'outputs': [
              {
                'name': 'reversed',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getRefundAddress',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'isExpired',
            'outputs': [
              {
                'name': 'expired',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionInfo',
            'outputs': [
              {
                'name': 'creator',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'reversed',
                'type': 'bool'
              },
              {
                'name': 'unsold',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'name': 'NewAuction',
            'type': 'event'
          }
        ]
      },
      'AuctionManager': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'max_sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newReverseAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionletInfo',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'last_bidder',
                'type': 'address'
              },
              {
                'name': 'last_bid_time',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'unclaimed',
                'type': 'bool'
              },
              {
                'name': 'base',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'collection_limit',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getLastBid',
            'outputs': [
              {
                'name': 'prev_bid',
                'type': 'uint256'
              },
              {
                'name': 'prev_quantity',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'claim',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'collection_limit',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'bid',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'max_sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newReverseAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'isReversed',
            'outputs': [
              {
                'name': 'reversed',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getRefundAddress',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'isExpired',
            'outputs': [
              {
                'name': 'expired',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionInfo',
            'outputs': [
              {
                'name': 'creator',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'reversed',
                'type': 'bool'
              },
              {
                'name': 'unsold',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'Bid',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'name': 'Split',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'AuctionReversal',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'name': 'NewAuction',
            'type': 'event'
          }
        ]
      },
      'AuctionManagerFrontend': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'max_sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newReverseAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionletInfo',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'last_bidder',
                'type': 'address'
              },
              {
                'name': 'last_bid_time',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'unclaimed',
                'type': 'bool'
              },
              {
                'name': 'base',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'collection_limit',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getLastBid',
            'outputs': [
              {
                'name': 'prev_bid',
                'type': 'uint256'
              },
              {
                'name': 'prev_quantity',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'collection_limit',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'max_sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newReverseAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'isReversed',
            'outputs': [
              {
                'name': 'reversed',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getRefundAddress',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'isExpired',
            'outputs': [
              {
                'name': 'expired',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionInfo',
            'outputs': [
              {
                'name': 'creator',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'reversed',
                'type': 'bool'
              },
              {
                'name': 'unsold',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'name': 'NewAuction',
            'type': 'event'
          }
        ]
      },
      'SplittingAuctionManager': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'max_sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newReverseAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionletInfo',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'last_bidder',
                'type': 'address'
              },
              {
                'name': 'last_bid_time',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'unclaimed',
                'type': 'bool'
              },
              {
                'name': 'base',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'collection_limit',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              },
              {
                'name': 'quantity',
                'type': 'uint256'
              }
            ],
            'name': 'bid',
            'outputs': [
              {
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getLastBid',
            'outputs': [
              {
                'name': 'prev_bid',
                'type': 'uint256'
              },
              {
                'name': 'prev_quantity',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'claim',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'collection_limit',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'max_sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newReverseAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'isReversed',
            'outputs': [
              {
                'name': 'reversed',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getRefundAddress',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'isExpired',
            'outputs': [
              {
                'name': 'expired',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionInfo',
            'outputs': [
              {
                'name': 'creator',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'reversed',
                'type': 'bool'
              },
              {
                'name': 'unsold',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'Bid',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'name': 'Split',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'AuctionReversal',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'name': 'NewAuction',
            'type': 'event'
          }
        ]
      },
      'AuctionFrontendType': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'claim',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'bid',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ]
      },
      'AuctionType': {
        'interface': []
      },
      'SplittingAuctionFrontendType': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              },
              {
                'name': 'quantity',
                'type': 'uint256'
              }
            ],
            'name': 'bid',
            'outputs': [
              {
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'claim',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ]
      },
      'MaliciousToken': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'spender',
                'type': 'address'
              },
              {
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'quantity',
                'type': 'uint256'
              }
            ],
            'name': 'setQuantity',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': 'supply',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'attackClaim',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'from',
                'type': 'address'
              },
              {
                'name': 'to',
                'type': 'address'
              },
              {
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'attackSplit',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'attackBid',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'manager',
                'type': 'address'
              }
            ],
            'name': 'setTarget',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'attackDone',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'attackOff',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'to',
                'type': 'address'
              },
              {
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'setBid',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'name': 'setID',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'owner',
                'type': 'address'
              },
              {
                'name': 'spender',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': '_allowance',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'initial_balance',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'from',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': 'to',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'Transfer',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'owner',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': 'spender',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'Approval',
            'type': 'event'
          }
        ]
      },
      'DBTester': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'manager',
                'type': 'address'
              }
            ],
            'name': 'bindManager',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'name': '_target',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'payable': false,
            'type': 'fallback'
          }
        ]
      },
      'AuctionTester': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'name': 'doClaim',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'doBid',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'manager',
                'type': 'address'
              }
            ],
            'name': 'bindManager',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'name': '_target',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              }
            ],
            'name': 'doBid',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'spender',
                'type': 'address'
              },
              {
                'name': 'value',
                'type': 'uint256'
              },
              {
                'name': 'token',
                'type': 'address'
              }
            ],
            'name': 'doApprove',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'payable': false,
            'type': 'fallback'
          }
        ]
      },
      'TestableManager': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'max_sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newReverseAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'time',
                'type': 'uint256'
              }
            ],
            'name': 'addTime',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionletInfo',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'last_bidder',
                'type': 'address'
              },
              {
                'name': 'last_bid_time',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'unclaimed',
                'type': 'bool'
              },
              {
                'name': 'base',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getCollectMax',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'collection_limit',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              },
              {
                'name': 'quantity',
                'type': 'uint256'
              }
            ],
            'name': 'bid',
            'outputs': [
              {
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'getLastBid',
            'outputs': [
              {
                'name': 'prev_bid',
                'type': 'uint256'
              },
              {
                'name': 'prev_quantity',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'claim',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'timestamp',
                'type': 'uint256'
              }
            ],
            'name': 'setTime',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'collection_limit',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getTime',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionlet',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'address'
              },
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'debug_timestamp',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'max_sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'buy_amount',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newReverseAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuction',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              },
              {
                'name': '',
                'type': 'address'
              },
              {
                'name': '',
                'type': 'address'
              },
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'isReversed',
            'outputs': [
              {
                'name': 'reversed',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiary',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getRefundAddress',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'isExpired',
            'outputs': [
              {
                'name': 'expired',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'refund',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newTwoWayAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'getAuctionInfo',
            'outputs': [
              {
                'name': 'creator',
                'type': 'address'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'min_decrease',
                'type': 'uint256'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              },
              {
                'name': 'reversed',
                'type': 'bool'
              },
              {
                'name': 'unsold',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'beneficiaries',
                'type': 'address[]'
              },
              {
                'name': 'payouts',
                'type': 'uint256[]'
              },
              {
                'name': 'selling',
                'type': 'address'
              },
              {
                'name': 'buying',
                'type': 'address'
              },
              {
                'name': 'sell_amount',
                'type': 'uint256'
              },
              {
                'name': 'start_bid',
                'type': 'uint256'
              },
              {
                'name': 'min_increase',
                'type': 'uint256'
              },
              {
                'name': 'duration',
                'type': 'uint256'
              }
            ],
            'name': 'newAuction',
            'outputs': [
              {
                'name': 'auction_id',
                'type': 'uint256'
              },
              {
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auctionlet_id',
                'type': 'uint256'
              }
            ],
            'name': 'Bid',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'new_id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'split_id',
                'type': 'uint256'
              }
            ],
            'name': 'Split',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auction_id',
                'type': 'uint256'
              }
            ],
            'name': 'AuctionReversal',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'base_id',
                'type': 'uint256'
              }
            ],
            'name': 'NewAuction',
            'type': 'event'
          }
        ]
      },
      'DappleEnv': {
        'interface': [
          {
            'inputs': [],
            'payable': false,
            'type': 'constructor'
          }
        ]
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
