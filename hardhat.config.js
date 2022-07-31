require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  mocha: {
    timeout: 400000, // updated for tests 
  },
  networks: {
    hardhat: {
      accounts: {
        count: 500, // accounts for tests (loops)
      }
    }
  }
};