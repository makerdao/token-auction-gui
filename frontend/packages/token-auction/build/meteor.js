if (typeof Dapple === 'undefined') {
  Dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

Dapple['token-auction'] = (function builder () {
  var environments = {
      'default': 'morden',
      'morden': {
        'objects': {
          'auction': {
            'class': 'SplittingAuctionManager',
            'address': '0xabf6d2c952ed07e3eec0a9587f72ad47af67c68d'
          }
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
      env = 'morden';
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
      'Assertive': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'what',
                'type': 'bool'
              }
            ],
            'name': 'assert',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'array',
                'type': 'uint256[]'
              }
            ],
            'name': 'assertIncreasing',
            'outputs': [],
            'type': 'function'
          }
        ]
      },
      'AssertiveAuction': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'what',
                'type': 'bool'
              }
            ],
            'name': 'assert',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
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
                'name': 'bidder',
                'type': 'address'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'newBid',
            'outputs': [],
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
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'array',
                'type': 'uint256[]'
              }
            ],
            'name': 'assertIncreasing',
            'outputs': [],
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
            'constant': false,
            'inputs': [
              {
                'name': 'auctionlet_id',
                'type': 'uint256'
              },
              {
                'name': 'bidder',
                'type': 'address'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'newBid',
            'outputs': [],
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
            'type': 'function'
          }
        ]
      },
      'AuctionFrontend': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'what',
                'type': 'bool'
              }
            ],
            'name': 'assert',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
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
                'name': 'bidder',
                'type': 'address'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'newBid',
            'outputs': [],
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
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'array',
                'type': 'uint256[]'
              }
            ],
            'name': 'assertIncreasing',
            'outputs': [],
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
            'type': 'function'
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
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'what',
                'type': 'bool'
              }
            ],
            'name': 'assert',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
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
                'name': 'bidder',
                'type': 'address'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'newBid',
            'outputs': [],
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
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'array',
                'type': 'uint256[]'
              }
            ],
            'name': 'assertIncreasing',
            'outputs': [],
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
            'type': 'function'
          }
        ]
      },
      'AuctionType': {
        'interface': []
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
      'FallbackFailer': {
        'interface': []
      },
      'MathUser': {
        'interface': []
      },
      'SplittingAuction': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'what',
                'type': 'bool'
              }
            ],
            'name': 'assert',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
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
                'name': 'bidder',
                'type': 'address'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'newBid',
            'outputs': [],
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
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'array',
                'type': 'uint256[]'
              }
            ],
            'name': 'assertIncreasing',
            'outputs': [],
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
            'constant': false,
            'inputs': [
              {
                'name': 'what',
                'type': 'bool'
              }
            ],
            'name': 'assert',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
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
                'name': 'bidder',
                'type': 'address'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'newBid',
            'outputs': [],
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
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'array',
                'type': 'uint256[]'
              }
            ],
            'name': 'assertIncreasing',
            'outputs': [],
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
            'type': 'function'
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
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'what',
                'type': 'bool'
              }
            ],
            'name': 'assert',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
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
                'name': 'bidder',
                'type': 'address'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'newBid',
            'outputs': [],
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
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'array',
                'type': 'uint256[]'
              }
            ],
            'name': 'assertIncreasing',
            'outputs': [],
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
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'what',
                'type': 'bool'
              }
            ],
            'name': 'assert',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
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
                'name': 'bidder',
                'type': 'address'
              },
              {
                'name': 'bid_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'newBid',
            'outputs': [],
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
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'array',
                'type': 'uint256[]'
              }
            ],
            'name': 'assertIncreasing',
            'outputs': [],
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
            'type': 'function'
          }
        ]
      },
      'TransferUser': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'what',
                'type': 'bool'
              }
            ],
            'name': 'assert',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'array',
                'type': 'uint256[]'
              }
            ],
            'name': 'assertIncreasing',
            'outputs': [],
            'type': 'function'
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
      this.objects[i] = this.classes[obj['class']].at(obj.address);
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
