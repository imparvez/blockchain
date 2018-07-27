const Blockchain = require('./blockchain');

console.log(Blockchain);

const bitcoin = new Blockchain();

bitcoin.createNewBlock(1234, 'previousblockhash', 'currentHash');

bitcoin.createNewTransaction(100, 'senderAddress', 'recipientAddress');

bitcoin.createNewBlock(5678, 'newPreviousHash', 'newCurrentHash');

console.log(bitcoin.chain[1]);