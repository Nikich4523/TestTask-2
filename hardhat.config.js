require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require('dotenv').config();

const createVoting = require("./tasks/createVoting");
const vote = require("./tasks/vote")
const getVotingInfo = require("./tasks/getVotingInfo");
const closeVoting = require("./tasks/closeVoting");
const withdraw = require("./tasks/withdraw");

// KEYS
const ALCHEMY_API_KEY = process.env.ALCHEMY;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY;

// TASKS
createVoting();
vote();
getVotingInfo();
closeVoting();
withdraw();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.3",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`]
    }
  }
};
