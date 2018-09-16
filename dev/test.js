const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

/*
* Test Case: 1
*/

// bitcoin.createNewBlock(1234, 'previousblockhash', 'currentHash');

// bitcoin.createNewTransaction(100, 'senderAddress', 'recipientAddress');

// bitcoin.createNewBlock(5678, 'newPreviousHash', 'newCurrentHash');

// bitcoin.createNewTransaction(50, 'MUMBAI', 'NEWYORK');
// bitcoin.createNewTransaction(300, 'NEWYORK', 'DHAKA');
// bitcoin.createNewTransaction(2000, 'DHAKA', 'SRILANKA');

// bitcoin.createNewBlock(9619442263, '09AHIGHT', 'E0945687');

// console.log(bitcoin);
/*
* Test Case: 2
*/
const previousBlockHash = '09SDFU987SD8OCNDS89'
const nonce = 1000
const currentData = [
    {
        amount: 100,
        sender: 'BOMBAY',
        recepient: 'NEWYORK'
    },{
        amount: 1000,
        sender: 'BANDRA',
        recepient: 'THANE'
    },{
        amount: 5,
        sender: 'BANDRA(W)',
        recepient: 'BANDRA(E)'
    },
];

// console.log(bitcoin.hashBlock(previousBlockHash, currentData, nonce));

/*
* Test Case: 3 Calculating Nonce Value using proof of work
*/
// console.log(bitcoin.proofOfWork(previousBlockHash, currentData));
// console.log(bitcoin.hashBlock(previousBlockHash, currentData, 13009));

/*
* Test Case: 4 Testing the genesis block
*/
console.log(bitcoin);