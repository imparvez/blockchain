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

// This method will return if this blockchain is valid or not
Blockchain.prototype.chainIsValid = function(blockchain){
	let validChain = true;

	for(var i = 1; i < blockchain.length; i++){
		console.log('blockchain => ' + blockchain);
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] } , currentBlock['nonce'])
		// Step 2: Checking if the current blockchain has the same data while re-hashing and starting with `0000`
		if(blockHash.substring(0,4) !== '0000' ) validChain = false;
		
		// Step 1: Checking if the current blockchain and previous blockchain shared the same hash and previousHash value respectively
		if(currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false; // indicating chain is not valid

		console.log('-----------------------------------');
		console.log('currentBlockHash => ', currentBlock['hash']);
		console.log('previousBlockHash => ', prevBlock['hash']);
		console.log('-----------------------------------');
	}

	// Validating Legitimate Genesis Block
	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100; // this.createNewBlock(100, '0', '0');
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if(!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false

	return validChain
};

/*
What is consensus algorithm?
It is a way for all of the nodes inside the network to agree upon what the correct data is inside of the blockchain.
Our consensus algorithm will check for the length of the chain in the chosen node with all the others chain in the network node.
Longest chain contain final number of blocks, and those block are mined block which is the result of proof of work.
The whole network contributed to longest chain.
Consensus algorithm uses longest chain rule.
Bitcoin uses the same algorithm.
*/

/*
This function will iterate through our blockchain and pull out the block chain which matches the provided hash code.
*/
Blockchain.prototype.getBlock = function(blockHash){
	let correctBlock = null;
	// cycle through every block in the chain
	this.chain.forEach(block => {
		if(block.hash === blockHash) correctBlock = block
	});

	return correctBlock;
}

/*
This function will iterate through our blockchain and pull out the block chain which matches the provided transactionId.
*/
Blockchain.prototype.getTransaction = function(transactionId){
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.transactionId === transactionId){
				correctTransaction = transaction;
				correctBlock = block;
			}
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	}
}

/*
* This function will iterate through our blockchain and pull out the block chain which matches the provided address.
*/
Blockchain.prototype.getAddressData = function(address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.sender === address || transaction.recipient === address) {
				addressTransactions.push(transaction);
			};
		});
	});

	let balance = 0;
	addressTransactions.forEach(transaction => {
		if (transaction.recipient === address) balance += transaction.amount;
		else if (transaction.sender === address) balance -= transaction.amount;
	});

	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
	};
};

module.exports = Blockchain;