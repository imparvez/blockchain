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
// const previousBlockHash = '09SDFU987SD8OCNDS89'
// const nonce = 1000
// const currentData = [
//     {
//         amount: 100,
//         sender: 'BOMBAY',
//         recepient: 'NEWYORK'
//     },{
//         amount: 1000,
//         sender: 'BANDRA',
//         recepient: 'THANE'
//     },{
//         amount: 5,
//         sender: 'BANDRA(W)',
//         recepient: 'BANDRA(E)'
//     },
// ];

// console.log(bitcoin.hashBlock(previousBlockHash, currentData, nonce));

/*
* Test Case: 3 Calculating Nonce Value using proof of work
*/
// console.log(bitcoin.proofOfWork(previousBlockHash, currentData));
// console.log(bitcoin.hashBlock(previousBlockHash, currentData, 13009));

/*
* Test Case: 4 Testing the genesis block
*/

/*
* Test Case 5: Check for valid blockchain functionality
*/
const bc1 = {
    "chain": [
      {
        "index": 1,
        "timestamp": 1539088327085,
        "transactions": [
          
        ],
        "nonce": 100,
        "hash": "0",
        "previousBlockHash": "0"
      },
      {
        "index": 2,
        "timestamp": 1539088450326,
        "transactions": [
          
        ],
        "nonce": 18140,
        "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
        "previousBlockHash": "0"
      },
      {
        "index": 3,
        "timestamp": 1539088569608,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "55a4b5d0cbbf11e8974c91f3ce770bcf",
            "transactionId": "9f1f70b0cbbf11e8974c91f3ce770bcf"
          },
          {
            "amount": 1000,
            "sender": "BOMBAY",
            "recipient": "NEW YORK",
            "transactionId": "cea34a00cbbf11e8974c91f3ce770bcf"
          },
          {
            "amount": 20,
            "sender": "BOMBAY",
            "recipient": "NEW YORK",
            "transactionId": "d2d7f300cbbf11e8974c91f3ce770bcf"
          },
          {
            "amount": 30,
            "sender": "BOMBAY",
            "recipient": "NEW YORK",
            "transactionId": "d628f2c0cbbf11e8974c91f3ce770bcf"
          }
        ],
        "nonce": 157992,
        "hash": "0000b278fa25faa31be344b1cfef81962efca991b5e660dcc43ef637f879ba08",
        "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
      },
      {
        "index": 4,
        "timestamp": 1539088622633,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "55a4b5d0cbbf11e8974c91f3ce770bcf",
            "transactionId": "e6333db0cbbf11e8974c91f3ce770bcf"
          },
          {
            "amount": 40,
            "sender": "BOMBAY",
            "recipient": "NEW YORK",
            "transactionId": "f961ac00cbbf11e8974c91f3ce770bcf"
          },
          {
            "amount": 50,
            "sender": "BOMBAY",
            "recipient": "NEW YORK",
            "transactionId": "fbd432a0cbbf11e8974c91f3ce770bcf"
          },
          {
            "amount": 60,
            "sender": "BOMBAY",
            "recipient": "NEW YORK",
            "transactionId": "fe6c90c0cbbf11e8974c91f3ce770bcf"
          },
          {
            "amount": 70,
            "sender": "BOMBAY",
            "recipient": "NEW YORK",
            "transactionId": "00e076f0cbc011e8974c91f3ce770bcf"
          }
        ],
        "nonce": 21211,
        "hash": "0000fce2eb1a99a8bbcceb36243bc5669a84b60893286fd6ceca780c4d3628ad",
        "previousBlockHash": "0000b278fa25faa31be344b1cfef81962efca991b5e660dcc43ef637f879ba08"
      },
      {
        "index": 5,
        "timestamp": 1539088695456,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "55a4b5d0cbbf11e8974c91f3ce770bcf",
            "transactionId": "05ce0fb0cbc011e8974c91f3ce770bcf"
          }
        ],
        "nonce": 149078,
        "hash": "0000ddbf3cd92f3c6ccc61c93da5268b9ffec51489fbd5c58adbdc2e186a46cd",
        "previousBlockHash": "0000fce2eb1a99a8bbcceb36243bc5669a84b60893286fd6ceca780c4d3628ad"
      },
      {
        "index": 6,
        "timestamp": 1539088698267,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "55a4b5d0cbbf11e8974c91f3ce770bcf",
            "transactionId": "31361f30cbc011e8974c91f3ce770bcf"
          }
        ],
        "nonce": 27591,
        "hash": "000073b7a26b3dfb97ea4e9a27f625702f064d4587ee7a4dfbe62512e3d900a7",
        "previousBlockHash": "0000ddbf3cd92f3c6ccc61c93da5268b9ffec51489fbd5c58adbdc2e186a46cd"
      }
    ],
    "pendingTransactions": [
      {
        "amount": 12.5,
        "sender": "00",
        "recipient": "55a4b5d0cbbf11e8974c91f3ce770bcf",
        "transactionId": "32e332f0cbc011e8974c91f3ce770bcf"
      }
    ],
    "currentNodeUrl": "http:\/\/localhost:3001",
    "networkNodes": [
      
    ]
}

console.log('VALID => ' + bitcoin.chainIsValid(bc1.chain)); // try to change the hash value in the above data like delete few words (not many) and run the test
console.log(bitcoin);