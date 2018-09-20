var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var app = express();
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
});

app.post('/register-node', function(req, res){

});

app.post('/register-bulk-nodes', function(req, res){

});

app.listen(port, function(){
    console.log(`Port running on ${port}`)
});