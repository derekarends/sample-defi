import { ethers } from "hardhat";
import { ThinkToken } from "../typechain/ThinkToken";

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

  const tokenFactory = await ethers.getContractFactory("ThinkToken");
  const stakingToken = (await tokenFactory.deploy()) as ThinkToken;
  await stakingToken.deployed();
  console.log("ThinkToken deployed to:", stakingToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
