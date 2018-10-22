const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const app = express();
const request = require('request');
const rp = require('request-promise');
const port = process.argv[2];
const Blockchain = require('./blockchain')

const bitcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Hitting this API will give us the entire blockchain data
app.get('/blockchain', function(req, res){
    res.send(bitcoin);
});

// To initiate any transaction
app.post('/transaction', function(req, res) {
	const newTransaction = req.body;
	const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
	res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

// An API Endpoint which will now do the /transaction api's operation + broadcast the transaction in the network
// broadcast transaction
app.post('/transaction/broadcast', function(req, res) {
	const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	bitcoin.addTransactionToPendingTransactions(newTransaction);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		res.json({ note: 'Transaction created and broadcast successfully.' });
	});
});

// It will mine or create a new block for us
app.get('/mine', function(req, res){
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentData, nonce);

    // bitcoin.createNewTransaction(12.5, "00", nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		const requestOptions = {
			uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
                amount: 12.5,
                sender: "00",
                recipient: nodeAddress
            },
			json: true
        };
        
        return rp(requestOptions);
    })
    .then(data => {
        res.json({
            note: "New block mined & broadcast successfully",
            block: newBlock
        })
    })

});

// receive new block
app.post('/receive-new-block', function(req, res) {
	const newBlock = req.body.newBlock; // Get new block to be added
    const lastBlock = bitcoin.getLastBlock(); // Get the last block
    
    // Validation
	const correctHash = lastBlock.hash === newBlock.previousBlockHash; // Check if last block previous hash value equals to new block hash value
	const correctIndex = lastBlock['index'] + 1 === newBlock['index']; // Check if last block index + 1 equals to new block index

	if (correctHash && correctIndex) {
		bitcoin.chain.push(newBlock);
		bitcoin.pendingTransactions = [];
		res.json({
			note: 'New block received and accepted.',
			newBlock: newBlock
		});
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock
		});
	}
});

app.post('/register-and-broadcast-node', function(req, res){
    // Fetch the new node url
    const newNodeUrl = req.body.newNodeUrl;

    // Check if the new node url already exists
	if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

    // Node's Array
    const regNodesPromises = [];
    
    // Each node in an array will get to perform /register-node operation which will add the new url in its own network node list
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

    // Taking all the register node and perform /register-bulk-nodes operation that will add all the registered network in new node's network node list
	Promise.all(regNodesPromises)
	.then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl + '/register-bulk-nodes',
			method: 'POST',
			body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
			json: true
		};

		return rp(bulkRegisterOptions);
	})
	.then(data => {
		res.json({ note: 'New node registered with network successfully.' });
    })
    .catch((err) => {
        console.log('ERROR => ' + err)
    });
});

/*
	How to run /register-and-broadcast-node
	http://localhost:3001/register-and-broadcast-node => POST

	{
		"newNodeUrl": "http://localhost:3002"
	} // SUBMIT

	{
		"newNodeUrl": "http://localhost:3003"
	} // SUBMIT

	{
		"newNodeUrl": "http://localhost:3004"
	} // SUBMIT

	{
		"newNodeUrl": "http://localhost:3005"
	} // SUBMIT

	http://localhost:3001/blockchain
	All the nodes will be registered.
*/

// Register a node with the network
/*
* Any node hitting this end point, will register the new requested node with the node that recieves this request.
*/
app.post('/register-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
	res.json({ note: `${newNodeUrl} registered successfully` });
});


// register multiple nodes all at once
app.post('/register-bulk-nodes', function(req, res){
    const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
	});

	res.json({ note: 'Bulk registration successful.' });
});

app.get('/consensus', function(req, res) {
	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(blockchains => {
		const currentChainLength = bitcoin.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null;

		blockchains.forEach(blockchain => {
			if (blockchain.chain.length > maxChainLength) {
				maxChainLength = blockchain.chain.length;
				newLongestChain = blockchain.chain;
				newPendingTransactions = blockchain.pendingTransactions;
			};
		});


		if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
			res.json({
				note: 'Current chain has not been replaced.',
				chain: bitcoin.chain
			});
		}
		else {
			bitcoin.chain = newLongestChain;
			bitcoin.pendingTransactions = newPendingTransactions;
			res.json({
				note: 'This chain has been replaced.',
				chain: bitcoin.chain
			});
		}
	});
});

/*
> Run all the node in the network
> On any node, make some block using /mine. So for example, http://localhost:3001/mine (3 times)
> Now hit http://localhost:3001/blockchain, you will see all the latest block in the chain.
> Take any block's hashValue and hit the newly updated url http://localhost:3001/block/0000e5419ad3a242c755aebb149883ac6e647f17732d8370b09274023588a726
> You will be presented with a json of that respective block
*/
app.get('/block/:blockHash', function(req, res){ // localhost:3001/block/hashValue012564657
	const blockHash = req.params.blockHash; // hashValue012564657
	const correctBlock = bitcoin.getBlock(blockHash);
	res.json({
		block: correctBlock
	});
});


/*
> Run all the node in the network
> Use postman to make transaction on http://localhost:3001/transaction/broadcast/
{
	"amount": 4897,
	"sender": "RUS",
	"recipient": "YEN"
}
> Make two request, run /mine on localhost:3001
> Make some more transaction and run /mine on localhost:3001
> Make some more transaction and run /mine on localhost:3001
> Then  copy any of the transactionId and hit the url http:localhost:3001/transaction/<copiedTransactionId>
> You will see the result.
*/
app.get('/transaction/:transactionId', function(req, res){
	const transactionId = req.params.transactionId;
	const transactionData = bitcoin.getTransaction(transactionId);
	res.json({
		transaction: transactionData.transaction,
		block: transactionData.block
	})
});

// get address by address
app.get('/address/:address', function(req, res) {
	const address = req.params.address;
	const addressData = bitcoin.getAddressData(address);
	res.json({
		addressData: addressData
	});
});

// Creating an end point to server html page. HOME
app.get('/block-explorer', function(req, res){
	res.sendFile('./block-explorer/index.html', { root: __dirname});
})


app.listen(port, function(){
    console.log(`Port running on ${port}`)
});