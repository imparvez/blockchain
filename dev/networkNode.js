var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var app = express();
var request = require('request');
var rp = require('request-promise');
var port = process.argv[2];
var Blockchain = require('./blockchain')

var bitcoin = new Blockchain();
var nodeAddress = uuid().split('-').join('');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Hitting this API will give us the entire blockchain data
app.get('/blockchain', function(req, res){
    res.send(bitcoin);
});

// To initiate any transaction
app.post('/transaction', function(req, res){
    // console.log(req.body);
    // res.send(`The amount of transaction is ${req.body.amount}`);
    const bitcoinIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({ note: `Transaction will be added in block ${bitcoinIndex}`})
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

    bitcoin.createNewTransaction(12.5, "00", nodeAddress);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note: "New block mined successfully",
        block: newBlock
    })

});

app.post('/register-and-broadcast-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl;
	if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

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
    console.log(newNodeUrl);
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    console.log('node Not Already Present: ' + nodeNotAlreadyPresent);
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    console.log('not Current Node: ' + notCurrentNode);
	if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
	res.json({ note: `${newNodeUrl} registered successfully` });
});


// register multiple nodes all at once
app.post('/register-bulk-nodes', function(req, res){
    const allNetworkNodes = req.body.allNetworkNodes;
    console.log('allNetworkNodes' + allNetworkNodes);
	allNetworkNodes.forEach(networkNodeUrl => {
        console.log('networkNodeUrl' + networkNodeUrl);
		const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
        console.log('bitcoin network nodes: ', bitcoin.networkNodes);
	});

	res.json({ note: 'Bulk registration successful.' });
});

app.listen(port, function(){
    console.log(`Port running on ${port}`)
});