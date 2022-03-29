async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const VotingContractFactory = await ethers.getContractFactory("VotingContract");
    const VotingContract = await VotingContractFactory.deploy();
  
    console.log("Contract address:", VotingContract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });