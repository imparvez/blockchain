### What is a Block?
A block is a data structure that saves data and some attributes.
Blocks can be linked together to form a chain of the blocks.
This is called a blockchain.
Any kind of data is stored inside a block.

### What is Blockchain?
It is a decentralized distributed database of immutable records.
Blockchain consists of lists of records. Records are stored in blocks. Block linked with other blocks forming a chain called as BlockChain.
The principle on which blockchain is based on is that it enables the information to be distributed among the users without being copied.

The blockchain is of three types:
1. Private.
2. Public.
3. Consortium.

Two records that blockchain database holds are block and transactional records.
The blockchain is different from traditional database in the following terms:
1. Only insert operation in blockchain rather than CRUD operation in the traditional database.
2. Full replication of all the block on every peer in the network rather than a master-slave hierarchy in the traditional database.
3. Majority of peers agree on the outcome of the transactions rather than distributed transactions in the traditional database.
4. Anybody can validate a transaction across the network instead of integrity constraints.

Encryption in blockchain is useful because it simply adds more to the security and authenticity of blocks and helps to keep them secure.

### What is Consensus Algorithm?

For the blockchains to make decisions, they need to come to a consensus using "consensus mechanisms".
It is a dynamic way of reaching agreement in a group. (Way of saying `this is legit`)
While voting just settles for a majority rule without any thought for the feelings and well-being of the minority, a consensus, on the other hand, makes sure that an agreement is reached which could benefit the entire group as a whole.
For a group of people scattered around the world, consensus creates a more equal and fair society.

### What is Proof Of Work?

It is the original consensus algorithm in a BlockChain network a.k.a it is a type of consensus method.
This algorithm is used to confirm transactions and produce new blocks to the chain.
With the help of PoW, miners compete against each other to complete transactions on the network and get rewarded.
In a network, users send each other's digital token(that means a transaction is taking place).
A decentralized ledger gathers all the transactions into blocks.
But to convert it into blocks, a care should be taken to confirm the transactions and arrange blocks.
This care or responsibility is on Special Nodes called miners, and a process is called mining.

### How Proof of Work works?

Let's try to solve the Byzantine Generals problem.
So if the army in east wants to send "Attack Monday" to the army on the west, they will follow certain steps.
Firstly they will append `nonce` to the original text. The nonce can be a random hexadecimal value.
Then they will hash the text appended with a nonce and see the result. 
Suppose, hypothetically speaking, the armies have decided to only share the messages which on hashing, gives the results which starts with 5 zeroes.
If the hash condition is satisfied, they will send the messengers with the hash of the message.
If not, they will keep on changing the value of nonce randomly until they get the desired result.
This whole process is extremely tedious and time-consuming and takes a lot of computation power.
If the messenger does get caught by the city and the message is tampered with, according to hash function properties, the hash itself will get drastically changed. If the generals on the right side, see that the hashed message is not starting with the required amount of 0s then they can simply call off the attack.

### Why use PoW consensus algorithm?
Anti DOS attack defense.
PoW needs a lot of efforts to be executed.
Efficient attacks require a lot of computational power and a lot of time to calculations.
Attack will be very costly.
Low impact of stake on mining possibilities.
It doesn’t matter how much money you have in your wallet.
What matter is how much computational power you have to solve the puzzles and form new blocks.
Thus the holders of huge amounts of money are not in charge of making decisions for the entire network.

### What are minings?

It is a peer to peer process of adding data into blockchain’s public ledger in order to verify and secure contract.
Groups of transactions are gathered in blocks and then added into blockchain.
The hash of each block contains the hash of the previous block, which increases security and prevents any block violation.
If a miner manages to solve the puzzle, the new block is formed. The transactions are placed in this block and considered confirmed.

### What is Hash?
A hash function takes an input and produces an output of specific size.
The process of applying a hash function to some data is called hashing.
The output of a hash function is called hash.
The cryptographic hash function is one-way, which means from an output it is impossible to detect the input.
Given a hash, it is infeasible to learn about or the find the input data that was provided to the hash functions. The technical term for this is preimage resistance.

### What is Genesis Block?

They are also known as Block Zero or Block 0.
It is an ancestor that every blockchain network's block can track its origin back to.
It is literally the first block in the blockchain.

### What is Nonce?

The nonce is a 32-bit arbitrary random number that is typically used once. In Bitcoin's mining process, the goal is to find a hash below a target number which is calculated based on the difficulty. Proof of work in Bitcoin's mining takes an input consists of Merkle Root, timestamp, previous block hash and a few other things plus a nonce which is a completely random number. If the output results in a hash are smaller than the target hash you win the block and the consensus is reached. You need to brute force all possible nonce in order to luckily find a hash smaller than the target hash. It could literally be any number between 0 and 2^31
