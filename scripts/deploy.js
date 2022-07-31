
const hre = require("hardhat");

async function main() {
  
  [owner, addr1, addr2, addr3, ...addrs] = await hre.ethers.getSigners();
  // Produceth contract
  const Produce = await hre.ethers.getContractFactory("Prod");
  const produce = await Produce.deploy(addr1.address);

  //FundMe contract 
  const FundMe = await hre.ethers.getContractFactory("FundMe");
  const fundMe = await FundMe.deploy(258);

  await produce.deployed();
  await fundMe.deployed();

  console.log("Produceth deployed to:", produce.address);
  console.log("FundMe deployed to:", fundMe.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});