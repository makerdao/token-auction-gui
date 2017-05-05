import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';

function leftPad32(value) {
  return Array(65 - web3.toHex(value).split('x')[1].length).join('0') + web3.toHex(value).split('x')[1];
}

function etherscanUrl() {
  const network = Session.get('network');
  /* eslint-disable prefer-template */
  return 'https://' + (network === 'kovan' ? 'kovan.' : '') + 'etherscan.io/';
  /* eslint-enable prefer-template */
}

function splitByNCharactersLong(n, str) {
  const chunks = [];

  for (let i = 0, charsLength = str.length; i < charsLength; i += n) {
    chunks.push(str.substring(i, i + n));
  }

  return chunks;
}

export default function callContractMethod(method, params, bN) {
  let blockNumber = 'latest';
  if (typeof bN !== 'undefined') {
    blockNumber = bN;
  }
  let data = '';
  for (let i = 0; i < params.length; i++) {
    data += leftPad32(params[i]);
  }

  const networkSettings = Meteor.settings.public[Session.get('network')];

  const promise = new Promise((resolve, reject) => {
    /* eslint-disable prefer-template */
    $.ajax({
      url: etherscanUrl() + 'api?module=proxy&action=eth_call&to=' + Session.get('contractAddress') +
      '&data=' + web3.sha3(method).substr(0, 10) + data + '&tag=' + blockNumber +
      '&apikey=' + networkSettings.etherscanApiToken,
      success: (result) => { resolve(splitByNCharactersLong(64, result.result.split('x')[1])); },
      error: (error) => { reject(error); },
      dataType: 'json',
    });
    /* eslint-enable prefer-template */
  });
  return promise;
}
