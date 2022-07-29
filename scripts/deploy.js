
const hre = require("hardhat");

async function main() {
  
  [owner, addr1, addr2, addr3, ...addrs] = await hre.ethers.getSigners();
  const Produceth = await hre.ethers.getContractFactory("Produceth");
  const produceth = await Produceth.deploy(owner.address);

  await produceth.deployed();

  console.log("Produceth deployed to:", produceth.address);
}

