/**
 * Blockchain constructor function will help in creating data structure
 */
function Blockchain(){
	this.chain = []; // It will contain all the blocks
	this.pendingTransactions = []; // It will contain all the records of new transaction before being pushed to `this.chain`
}

/**
 * Creating blockchain data structure.
 * Basically a method that is place on Blockchain which will help us in creating new data structure
 */
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
	// Creating a new block
	const newBlock = { // all the important piece of data will be stored here
		index: this.chain.length + 1, // Number of block
		timestamp: Date.now(), // when this block is created 
		transactions: this.pendingTransactions,
		nonce: nonce, // could be any number. It'll be a proof which indicates that we have created this block in legitimate way(Proof of work)
		hash: hash, // They are unique indentifier(like an DNA)
		previousBlockHash: previousBlockHash // hash of previous block
	}

	// clearing out the new transactions
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
		recipient: recipient
	}

	this.pendingTransactions.push(newTransaction);

	return this.getLastBlock()['index'] + 1;
}

module.exports = Blockchain;