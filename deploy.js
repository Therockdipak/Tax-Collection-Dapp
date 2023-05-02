async function main() {
  const instance = await ethers.getContractFactory("TaxCollection");
  const contract = await instance.deploy();

  await contract.deployed();
  console.log("contract address is : ", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
