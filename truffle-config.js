require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const {MNEMONIC, INFURA_PROJECT_ID, ETHERSCAN_API_KEY, SNOWTRACE_API_KEY} = process.env;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
    ropsten: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`),
      network_id: 3,       
      gas: 5500000,
    },
    rinkeby:{
      provider: () => new HDWalletProvider(MNEMONIC, `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`),
      network_id: 4,       
      gas: 5500000,
    },
    mainnet: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`),
      network_id: 1,
      gas: 5500000
    },
    fuji: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://api.avax-test.network/ext/bc/C/rpc`),
      network_id: 1,
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.9",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Required for etherscan verification using truffle-plugin-verify package
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: ETHERSCAN_API_KEY,
    snowtrace: SNOWTRACE_API_KEY
  }
};
