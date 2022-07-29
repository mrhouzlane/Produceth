const { ethers } = require("chai");
const { expect } = require("chai");
const hre = require("hardhat");
const {
  experimentalAddHardhatNetworkMessageTraceHook,
} = require("hardhat/config");

describe("Doodles", function () {
  let Doodles, doodlesContract, owner, addr1, addr2, addr3, addrs;
  beforeEach(async function () {
    Doodles = await hre.ethers.getContractFactory("Doodles");
    [owner, addr1, addr2, addr3, ...addrs] = await hre.ethers.getSigners();
    doodlesContract = await Doodles.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await doodlesContract.owner()).to.equal(owner.address);
    });
  });

  describe("setIsAllowListActive", function () {
    it("should be reverted if the caller is not the owner", async function () {
      await expect(
        doodlesContract.connect(addr1).setIsAllowListActive(true)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("setIsAllowListActive should be set to true by the owner", async function () {
      const _isAllowListActive = true;
      await doodlesContract
        .connect(owner)
        .setIsAllowListActive(_isAllowListActive);
      expect(
        doodlesContract.connect(owner).setIsAllowListActive(_isAllowListActive),
        _isAllowListActive
      );
    });
  });

  describe("setAllowList", function () {
    it("should set _allowList by owner", async function () {
      //we set the the allowList to be active
      await doodlesContract.connect(owner).setIsAllowListActive(true);
      //we check that ether value is correct amount
      const overrides = { value: hre.ethers.utils.parseEther("0.123") }; // ether in this case MUST be a string
      //we set AllowList to a certain number of Tokens to be minted

      //assertion : mint without setAllowList
      await expect(
        doodlesContract.connect(addr1).mintAllowList(1, overrides)
      ).to.be.revertedWith("Exceeded max available to purchase");

      await doodlesContract.connect(owner).setAllowList([addr1.address], 1);

      // check the mint
      await doodlesContract.connect(addr1).mintAllowList(1, overrides);

      //assert
      expect(await doodlesContract.ownerOf(0)).to.equal(addr1.address);
      await expect(doodlesContract.ownerOf(1)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });
  });

  describe("numAvailableToMint", function () {
    it("should return number Available of Tokens to Mint", async function () {
      await doodlesContract.connect(owner).setIsAllowListActive(true);
      await doodlesContract
        .connect(owner)
        .setAllowList([addr1.address, addr2.address], 10);

      expect(
        await doodlesContract.numAvailableToMint(addr1.address)
      ).to.be.equal(10);
      expect(
        await doodlesContract.numAvailableToMint(addr2.address)
      ).to.be.equal(10);
    });
  });

  describe("mintAllowList", function () {
    it("should safeMint with the right tokenURI", async function () {
      const baseurl = "ipfs://test.url/";
      const overrides = { value: hre.ethers.utils.parseEther("0.123") };

      doodlesContract.connect(owner).setBaseURI(baseurl);
      await doodlesContract.connect(owner).setIsAllowListActive(true);
      await doodlesContract.connect(owner).setAllowList([addr1.address], 1);

      await doodlesContract.connect(addr1).mintAllowList(1, overrides);

      expect(await doodlesContract.tokenURI(0)).to.be.equal(baseurl + "0");
      expect(await doodlesContract.ownerOf(0)).to.be.equal(addr1.address);
    });

    it("Should be reverted because the caller exceeds max token", async function () {
      await doodlesContract.connect(owner).setIsAllowListActive(true);
      const overrides = { value: hre.ethers.utils.parseEther("24.6") };

      // 50 addresses, 200 token minted for each = 10 000 tokens minted total
      for (let i = 0; i < 50; i++) {
        await doodlesContract
          .connect(owner)
          .setAllowList([addrs[i].address], 200);
        await doodlesContract.connect(addrs[i]).mintAllowList(200, overrides);
      }

      await doodlesContract
        .connect(owner)
        .setAllowList([addrs[50].address], 200);
      await expect(
        doodlesContract.connect(addrs[50]).mintAllowList(1, overrides)
      ).to.be.revertedWith("Purchase would exceed max tokens");

      // Testing for the MAX_SUPPLY if it works
      await doodlesContract
        .connect(owner)
        .setAllowList([addrs[49].address], 200);
      expect(await doodlesContract.ownerOf(9999)).to.be.equal(
        addrs[49].address
      );
    });
  });

  describe("setBaseURI", function () {
    it("should set the BaseURI by the owner", async function () {
      const baseurl = "ipfs://test.url/";
      await expect(
        doodlesContract.connect(addr1).setBaseURI(baseurl)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    // Since _baseURIextended is private we need to look at it inside setSaleState
    it("should set the BaseURI by the owner 1", async function () {
      const baseurl = "ipfs://test.url/";
      const overrides = { value: hre.ethers.utils.parseEther("0.123") };

      doodlesContract.connect(owner).setBaseURI(baseurl);
      await doodlesContract.connect(owner).setSaleState(true);
      await doodlesContract.connect(addr1).mint(1, overrides);

      expect(await doodlesContract.tokenURI(0)).to.be.equal(baseurl + "0");
      expect(await doodlesContract.ownerOf(0)).to.be.equal(addr1.address);
    });
  });

  describe("setProvenance", function () {
    it("should setProvenance by the owner", async function () {
      await expect(
        doodlesContract.connect(addr1).setProvenance("from Paris")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should set the Provenance", async function () {
      expectedValue = "From Paris";

      await doodlesContract.connect(owner).setProvenance("From Paris");
      expect(await doodlesContract.PROVENANCE()).to.equal(expectedValue);
    });
  });

  describe("reserve", function () {
    it("should mint the reserve by the Owner", async function () {
      await expect(
        doodlesContract.connect(addr1).reserve(200)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should mint the reserve by Owner", async function () {
      const baseurl = "ipfs://test.url/";
      await doodlesContract.connect(owner).reserve(10);
      await doodlesContract.connect(owner).setBaseURI(baseurl);

      for (let i = 0; i < 10; i++) {
        expect(await doodlesContract.tokenURI(i)).to.equal(baseurl + i);
      }
    });
  });

  describe("setSaleState", function () {
    it("should setSaleState by the Owner", async function () {
      await expect(
        doodlesContract.connect(addr1).setSaleState(true)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should setSaleState by the Owner", async function () {
      const newState = true;

      await doodlesContract.connect(owner).setSaleState(newState);
      expect(await doodlesContract.saleIsActive()).to.be.equal(newState);
    });
  });

  describe("mint", function () {
    it("should revert if saleIsActive is false", async function () {
      await doodlesContract.connect(owner).setSaleState(false);
      const overrides = { value: hre.ethers.utils.parseEther("0.123") };

      await expect(
        doodlesContract.connect(addr1).mint(1, overrides)
      ).to.be.revertedWith("Sale must be active to mint tokens");
    });

    it("should be reverted because the caller do not have enough fund", async function () {
      await doodlesContract.connect(owner).setSaleState(true);
      const overrides = { value: hre.ethers.utils.parseEther("0.122") };

      await expect(
        doodlesContract.connect(addr1).mint(1, overrides)
      ).to.be.revertedWith("Ether value sent is not correct");
    });

    it("should mint token", async function () {
      await doodlesContract.connect(owner).setSaleState(true);
      const overrides = { value: hre.ethers.utils.parseEther("0.123") };

      const baseurl = "ipfs://test.url/";
      await doodlesContract.connect(owner).setBaseURI(baseurl);

      await doodlesContract.connect(addr1).mint(1, overrides);

      expect(await doodlesContract.tokenURI(0)).to.equal(baseurl + "0");
      expect(await doodlesContract.ownerOf(0)).to.be.equal(addr1.address);
    });
  });

  describe("withdraw", function () {
    it("should revert if other address than Owner", async function () {
      await expect(
        doodlesContract.connect(addr1).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should withdraw with the owner", async function () {
      await doodlesContract.connect(owner).withdraw();
    });

    it("should check the Balance before withraw / After", async function () {
      await doodlesContract.connect(owner).setSaleState(true);
      const overrides = { value: hre.ethers.utils.parseEther("0.5") };
      await doodlesContract.connect(addr1).mint(1, overrides);

      const balanceBeforeWithdraw = hre.ethers.utils.formatEther(
        await doodlesContract.provider.getBalance(owner.address)
      );

      await doodlesContract.connect(owner).withdraw();
      const balanceAftereWithdraw = hre.ethers.utils.formatEther(
        await doodlesContract.provider.getBalance(owner.address)
      );

      expect(parseInt(balanceBeforeWithdraw) < parseInt(balanceAftereWithdraw))
        .to.be.true;
    });
  });

  // Done
});
