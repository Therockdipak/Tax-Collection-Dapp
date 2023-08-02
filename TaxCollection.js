const { expect } = require("chai");

describe("TaxCollection", () => {
  let TaxCollection;
  let taxCollection;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    const TaxCollectionContract = await ethers.getContractFactory(
      "TaxCollection"
    );
    taxCollection = await TaxCollectionContract.deploy(100);
    await taxCollection.deployed();
  });

  it("should set correct initial tax amount", async () => {
    expect(await taxCollection.taxAmount()).to.equal(100);
  });

  it("should allow taxPayers to pay taxex and update their balances", async () => {
    await taxCollection.connect(addr1).payTax({ value: 150 });
    await taxCollection.connect(addr2).payTax({ value: 130 });

    expect(await taxCollection.getBalance(addr1.address)).to.equal(150);
    expect(await taxCollection.getBalance(addr2.address)).to.equal(130);
  });

  it("should revert if taxpayers do not pay enough taxes", async () => {
    await expect(
      taxCollection.connect(addr1).payTax({ value: 99 })
    ).to.be.revertedWith("please enter valid amount");
  });

  it("should transfer the tax amount to the tax collector", async () => {
    const initialBalance = await ethers.provider.getBalance(owner.address);
    const amountToPay = 150;

    await taxCollection.connect(addr1).payTax({ value: amountToPay });

    const finalBalance = await ethers.provider.getBalance(owner.address);

    expect(finalBalance.sub(initialBalance)).to.equal(amountToPay);
  });
});
