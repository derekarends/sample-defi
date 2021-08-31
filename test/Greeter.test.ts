
import { ethers } from 'hardhat';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { Greeter } from '../typechain/Greeter';
import { BigNumber } from 'ethers';

chai.use(solidity);

const { expect } = chai;
const contractName = 'Greeter';

describe(`${contractName}`, () => {
  it("Should return the new greeting once it's changed", async () => {
    const signers = await ethers.getSigners();
    const greeterFactory = await ethers.getContractFactory(`${contractName}`, signers[0]);
    const greeter = (await greeterFactory.deploy("Hello, world!")) as Greeter;
    
    await greeter.deployed();
    expect(greeter.address).to.properAddress;
    expect(await greeter.greet()).to.equal("Hello, world!");

    await greeter.setGreeting("Hola, mundo!");
    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
