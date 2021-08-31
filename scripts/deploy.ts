import { ethers } from "hardhat";

/**
 * To Deploy
 * yarn dev
 * npx hardhat node
 * npx hardhat run scripts/deploy.js --network localhost
 */

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const GretterFactory = await ethers.getContractFactory("Greeter");
  const gretter = await GretterFactory.deploy();

  await gretter.deployed();
  console.log("Greeter deployed to:", gretter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
