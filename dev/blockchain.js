const sha256 = require('sha256')
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v1');
/**
 * Blockchain constructor function will help in creating data structure
 */
function Blockchain(){
	this.chain = []; // It will contain all the blocks
	this.pendingTransactions = []; // It will contain all the records of new transactions before being pushed to `this.chain` a.k.a in to the block
	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];
	// Creating the Genesis Block -> The first block in the block chain
	this.createNewBlock(100, '0', '0');
}

/**
 * Creating blockchain data structure.
 * Basically a method that is place on Blockchain which will help us in creating new data structure
 */
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
	// Creating a new block
	const newBlock = { // all the important piece of data will be stored here
		index: this.chain.length + 1, // Number of block(1,2,3...)
		timestamp: Date.now(), // when this block is created 
		transactions: this.pendingTransactions,
		nonce: nonce, // could be any number. It'll be a proof which indicates that we have created this block in legitimate way(Proof of work)
		hash: hash, // They are unique indentifier(like an DNA)
		previousBlockHash: previousBlockHash // hash of previous block
	}

	// clearing out the pending transactions array so that new transaction can take place
	// to build up new block in the chain
	this.pendingTransactions = [];

	// pushing all the changes to `this.chain`
	this.chain.push(newBlock);

	return newBlock;
}

/**
 * Get Last Block Detail
 */
Blockchain.prototype.getLastBlock = function(){
	return this.chain[this.chain.length - 1];
}

/**
 * Creating new transaction
 */
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient){
	const newTransaction = {
		amount: amount,
		sender: sender,
		recipient: recipient,
		transactionId: uuid().split('-').join(''),
	}

	return newTransaction;

	// This commented method will be refactor into another code.
	// this.pendingTransactions.push(newTransaction);
	// return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
}

/*
* Creating hash block function that will take a block as an input and return a hash value string
*/
Blockchain.prototype.hashBlock = function(previousBlockHash, currentData, nonce){
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentData);
	const hash = sha256(dataAsString);
	return hash;
}

/*
* Proof of work
*/
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentData){
	/*
	* => repeatedly hashBlock function, until it finds the correct hash => '0000GIUC8SD7V98ADYV98' => starting with 0000
	* => uses previousBlockHash for the hash, also currentData
	* => continously changes nonce to get the correct value of hash
	* => returns the nonce value that creates the correct hash
	*/

	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentData, nonce);

	while(hash.substring(0,4) !== '0000'){
		nonce++;
		hash= this.hashBlock(previousBlockHash, currentData, nonce)
		// console.log(hash)
	}

	return nonce; // will return the number of iteration to generate the correct hash
};

// This method will return if the blockchain is valid or not
Blockchain.prototype.chainIsValid = function(blockchain){
	let validChain = true;

	for(var i = 1; i < blockchain.length; i++){
		var currentBlock = blockchain[i];
		var prevBlock = blockchain[i - 1];

		if(currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false; // indicating chain is not valid
	}

	return validChain
};

module.exports = Blockchain;