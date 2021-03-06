# bob-coin
Implementation of an ERC-20 token using OpenZeppelin Contracts, built using the Truffle framework. 

The Ethereum mainnet depolyed contract can be viewed on Etherscan [here](https://etherscan.io/address/0x2809cfe18f2ff01f03936bdbc65775ba3bc0d357). 

The below documentation is a quick guide on compiling, depolying, and testing the contract using Truffle. The guide borrows from the [OpenZeppelin Docs](https://docs.openzeppelin.com/learn/) which further details using Truffle.

## Setup
After cloning the repo, install the required packages.

```bash
// Change directory into project folder 
cd bob-coin

// Download required packages
npm install
```

Note: The `truffle` and `ganache-cli` libraries are each installed locally for this project, and executed using the `npx` command. This allows for specific versions of these libraries to be tracked/updated/used instead of relying on global installations that may differ between users. 

## Configuration Values
The truffle configuration expects certain configuration values to be stored in a `.env` file inside project folder. These values are required for testnet and mainnet depolyment and testing, and should remain private and untracked with version control.

Configuration values are loaded within the `truffle-config.js` script, which requires the `.env` file to exist. 

Create a default `.env` file with placeholder values using the following command: 

```bash
cp .env.example .env
```

Migration and testing on the local blockchain does not require these configuration values to be defined, and will work with the placeholder values. See the below sections on updating these values when working with public testnets or mainnets. 


## Token Contract
The `BobCoin.sol` Solidity contract (inside the `contracts` directory) defines an ERC-20 complient token. The contract inherits from well established token contracts provided by the `@openzeppelin/contracts` library.

```bash
// BobCoin.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BobCoin is ERC20 {
    constructor() ERC20("BobCoin", "BC") {  
        _mint(msg.sender, 100 * 10 ** decimals());
    }
}
```

See the OpenZeppelin Contracts [ERC-20 docs](https://docs.openzeppelin.com/contracts/4.x/erc20) for more information. Use the OpenZeppelin [Wizard](https://docs.openzeppelin.com/contracts/4.x/wizard) to quickly initialize contracts that implement specific features provided by OpenZeppelin Contracts.

## Compile
Compile Solidity `.sol` files within the `contracts` folder with the following command: 

```bash
npx truffle compile
```

The compilation process will use the compiler version defined within `truffle-config.js`: 

```bash
compilers: {
  solc: {
    version: "0.8.9"
  }
}
```

## Deploy/Interact on Local Blockchain
For testing purposes the contract can be deployed to an instance of a locally running blockchain. The local blockchain software [Ganache](https://www.trufflesuite.com/ganache) can be used from the command line. 

In a separate terminal window run the following command from the project folder: 
```bash
npx ganache-cli
```

The GUI version of Ganache can also be used, but must be configured to use the correct port number (`8545`) defined in the `development` network settings within `truffle-config.js`: 

```bash
development: {
  host: "127.0.0.1",     // Localhost (default: none)
  port: 8545,            // Standard Ethereum port (default: none)
  network_id: "*",       // Any network (default: none)
}
```

With Ganach running, deploy the contract with the following command: 
```bash
npx truffle migrate --network development
```

This command will run the scripts within the `migrations` folder to deploy the contract to the blockchain. 

Interact with the deployed contract using the Truffle console: 

```bash
// Initiate console on the development network
npx truffle console --network development

// Connect to deployed contract
truffle(development)> const token = await BobCoin.deployed();

// Get token name
truffle(development)> await token.name();

// Get token symbol
truffle(development)> await token.symbol();

// Get token total supply
truffle(development)> (await token.totalSupply()).toString();

// Check token balance of accounts 
truffle(development)> const accounts = await web3.eth.getAccounts();
truffle(development)> (await token.balanceOf(accounts[0])).toString()
truffle(development)> (await token.balanceOf(accounts[1])).toString()

// Transfer token between accounts
truffle(development)> await token.transfer(accounts[1], 10, {from: accounts[0]})

// Exit the console
truffle(development)> .exit
```

## Automated Testing
Run automated unit tests defined by scripts within the `test` directory with the following command: 

```bash
npx truffle test --network development
```

Note: The `@openzeppelin/test-helpers` libray can be used to add unit tests specific to event and error handling.


## Migrate and Deploy to a Public Testnet
Deploy the contract to the Ropsten test network for further testing.

The `.env` file needs to be updated with appropriate values in order to connect and sign transactions on this network. 

First, configure a connection to the [Infura](https://infura.io/) public node service by creating a new project on their platform and copying its project ID into the `INFURA_PROJECT_ID` value in `.env`.

Next, create a fresh mnemonic (12 seed words) used to derive a new Ethereum account:

```bash
npx mnemonics
```

Copy the output from this command into the `MNEMONIC` value in `.env`.

Both of these values are used to configure the connection to the Ropsten network, as defined in `truffle-config.js`: 

```bash
ropsten: {
  provider: () => new HDWalletProvider(MNEMONIC, `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`),
  network_id: 3       // Ropsten's id
}
```

Get a list of of accounts created with the mnemonic using the truffle console: 

```bash
npx truffle console --network ropsten
truffle(rinkeby)> accounts
truffle(rinkeby)> .exit
```

Testnet accounts need to be funded with ETH in order to pay for transactions on the network. Use a public [Ropsten faucet](https://faucet.ropsten.be/) to add ETH into the newly created addresses. The first address listed is the one used to deploy the contract by default. 

Once funded, use the account to deploy the contract to the Ropsten network: 

```bash
npx truffle migrate --network ropsten
```

For further details on this setup, aslo see the Truffle guide on [Using Infura](https://www.trufflesuite.com/guides/using-infura-custom-provider). 

The contract can now be ineracted and tested similar to its deployment on the local blockchain, using the `--network ropsten` flag for the `console` and `test` commands detailed above. 

The address of the deployed contract can be viewed on [Ropsten Etherscan](https://ropsten.etherscan.io/). 

The contract's code can be verified on Etherscan to let users view the source code. To do this copy your Etherscan account's API key into the `ETHERSCAN_API_KEY` value of `.env`. This value is accessed and configured within `truffle-config.js`.

Use the following command to verify the contract: 

```bash
npx truffle run verify BobCoin --network ropsten
```

## Deploy to a Mainnet
Deployment to the mainnet requires using an account funded with real ether. Replace the `mnemonic` value in `secrets.json` file with the mnemonic for a mainnet account that is properly funded.

Run the following command to deploy the contract to the mainnet: 

```bash
npx truffle migrate --network mainnet
```

View the contract on Etherscan, and verify its source code using the `truffle run verify BobCoin --network mainnet` command. 



