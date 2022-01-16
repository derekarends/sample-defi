import { ethers } from 'hardhat';
import chai from 'chai';
import { solidity } from 'ethereum-waffle';
import { ThinkToken } from '../typechain/ThinkToken';
import { BigNumber } from 'ethers';
import itShouldThrow from './Utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

chai.use(solidity);

const { expect } = chai;
const ContractName = 'ThinkToken';
const totalSupply = BigNumber.from(10).pow(18).mul(1000);

describe(`${ContractName}`, () => {
  let stakingToken: ThinkToken;
  let user: SignerWithAddress;
  let owner: SignerWithAddress;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    user = signers[1];

    const tokenFactory = await ethers.getContractFactory(`${ContractName}`, signers[0]);
    stakingToken = (await tokenFactory.deploy()) as ThinkToken;
    await stakingToken.deployed();
    expect(stakingToken.address).to.properAddress;
  });

  describe('createStake', async () => {
    itShouldThrow(
      'requires a StakingToken balance equal or above the stake.',
      'revert',
      async () => {
        await stakingToken.connect(user).createStake(1);
      }
    );

    it('creates a stake.', async () => {
      await stakingToken.transfer(user.address, 3);
      await stakingToken.connect(user).createStake(1);

      expect(await stakingToken.balanceOf(user.address)).to.eq(2);
      expect(await stakingToken.stakeOf(user.address)).to.eq(1);
      expect(await stakingToken.totalSupply()).to.eq(totalSupply.sub(1));
      expect(await stakingToken.totalStakes()).to.eq(1);
    });

    it('adds a stakeholder.', async () => {
      await stakingToken.transfer(user.address, 3);
      await stakingToken.connect(user).createStake(1);

      expect((await stakingToken.isStakeholder(user.address))[0]).to.be.true;
    });
  });

  describe('removeStake', async () => {
    itShouldThrow('requires a stake equal or above the amount to remove.', 'revert', async () => {
      await stakingToken.connect(user).removeStake(1);
    });

    it('removes a stake.', async () => {
      await stakingToken.transfer(user.address, 3);
      await stakingToken.connect(user).createStake(3);
      await stakingToken.connect(user).removeStake(1);

      expect(await stakingToken.balanceOf(user.address)).to.eq(1);
      expect(await stakingToken.stakeOf(user.address)).to.eq(2);
      expect(await stakingToken.totalSupply()).to.eq(totalSupply.sub(2));
      expect(await stakingToken.totalStakes()).to.eq(2);
    });

    it('removes a stakeholder.', async () => {
      await stakingToken.transfer(user.address, 3);
      await stakingToken.connect(user).createStake(3);
      await stakingToken.connect(user).removeStake(3);

      expect((await stakingToken.isStakeholder(user.address))[0]).to.be.false;
    });
  });

  describe('rewards', async () => {
    itShouldThrow('can only be distributed by the contract owner.', 'revert', async () => {
      await stakingToken.connect(user).distributeRewards();
    });

    it('are distributed.', async () => {
      await stakingToken.transfer(user.address, 100);
      await stakingToken.connect(user).createStake(100);
      await stakingToken.distributeRewards();

      expect(await stakingToken.rewardOf(user.address)).to.eq(1);
      expect(await stakingToken.totalRewards()).to.eq(1);
    });

    it('can be withdrawn.', async () => {
      await stakingToken.transfer(user.address, 100);
      await stakingToken.connect(user).createStake(100);
      await stakingToken.distributeRewards();
      await stakingToken.connect(user).withdrawReward();

      const existingStakes = 100;
      const mintedAndWithdrawn = 1;

      expect(await stakingToken.balanceOf(user.address)).to.eq(1);
      expect(await stakingToken.stakeOf(user.address)).to.eq(100);
      expect(await stakingToken.rewardOf(user.address)).to.eq(0);
      expect(await stakingToken.totalSupply()).to.eq(
        totalSupply.sub(existingStakes).add(mintedAndWithdrawn)
      );
      expect(await stakingToken.totalStakes()).to.eq(100);
      expect(await stakingToken.totalRewards()).to.eq(0);
    });
  });
});
