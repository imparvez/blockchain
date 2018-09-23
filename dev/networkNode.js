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

app.listen(port, function(){
    console.log(`Port running on ${port}`)
});