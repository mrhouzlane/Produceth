const { ethers } = require("chai");
const { expect } = require("chai");
const hre = require("hardhat");
const {
  experimentalAddHardhatNetworkMessageTraceHook,
} = require("hardhat/config");

describe("FundMe", function () {
  let FundMe, fundMeContract, owner, addr1, addr2, addr3, addrs;
  beforeEach(async function () {
    FundMe = await hre.ethers.getContractFactory("FundMe");
    [owner, addr1, addr2, addr3, ...addrs] = await hre.ethers.getSigners();
    fundMeContract = await FundMe.deploy();
  });

})