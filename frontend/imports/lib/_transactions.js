import { Mongo } from 'meteor/mongo';

const Transactions = new Mongo.Collection(null);

Transactions.add = function add(type, transactionHash, object) {
  console.log('tx', type, transactionHash, object);
  //Session.set('newTransactionMessage', { message: 'Transaction ' + transactionHash, type: 'info' });
  Transactions.insert({ type, tx: transactionHash, object });
};

Transactions.findType = function findType(type) {
  return Transactions.find({ type }).map((value) => value.object);
};

Transactions.observeRemoved = function observeRemoved(type, callback) {
  return Transactions.find({ type }).observe({ removed: callback });
};

Transactions.sync = function sync() {
  const open = Transactions.find().fetch();
  Session.set('openTransactions', Transactions.find().count());
  // console.log('transactions sync called and open.length = ', open.length)
  // Sync all open transactions non-blocking and asynchronously
  const syncTransaction = function syncTransaction(index) {
    if (index >= 0 && index < open.length) {
      const document = open[index];
      Session.set('newTransactionMessage', { message: 'Syncing ' + document.txt, type: 'info' });
      web3.eth.getTransactionReceipt(document.tx, (error, result) => {
        if (!error && result != null) {
          if (result.logs.length > 0) {
            //Session.set('newTransactionMessage', { message: 'tx_success' + document.tx, type: 'success' });
            console.log('tx_success', document.tx, result.gasUsed);
          } else {
            //Session.set('newTransactionMessage', { message: 'tx_oog' + document.tx, type: 'danger' });
            console.error('tx_oog', document.tx, result.gasUsed);
          }
          Transactions.update({ tx: document.tx }, { $set: { receipt: result } }, () => {
            Transactions.remove({ tx: document.tx });
          });
        } else {
          console.log('transaction receipt', error, result);
        }
        // Sync next transaction
        syncTransaction(index + 1);
      });
    } else {
      // console.log('Index', index, ' and open.length', open.length)
    }
  };
  syncTransaction(0);
};

export default Transactions;
