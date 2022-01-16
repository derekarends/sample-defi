// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ThinkToken is a token used for staking things
 * @author Thinkovator, Inc
 */
contract ThinkToken is ERC20, Ownable {
  /**
   * @notice Require to know who are all the stakeholders.
   */
  address[] internal stakeholders;

  /**
   * @notice The stakes for each stakeholder.
   */
  mapping(address => uint256) internal stakes;

  /**
   * @notice The accumulated rewards for each stakeholder.
   */
  mapping(address => uint256) internal rewards;
  
  /**
   * Constructor
   */
  constructor() ERC20("ThinkToken", "THINK"){
    _mint(msg.sender, 1_000_000_000_000_000_000_000);
  }

  /**
   * @notice A method for a stakeholder to create a stake.
   * @param _stake The size of the stake to be created.
   */
  function createStake(uint256 _stake) external
  {
      _burn(msg.sender, _stake);
      if(stakes[msg.sender] == 0) {
        addStakeholder(msg.sender);
      }
      stakes[msg.sender] = stakes[msg.sender] + _stake;
  }

  /**
   * @notice A method for a stakeholder to remove a stake.
   * @param _stake The size of the stake to be removed.
   */
  function removeStake(uint256 _stake) external
  {
      stakes[msg.sender] = stakes[msg.sender] - _stake;
      if(stakes[msg.sender] == 0) {
        removeStakeholder(msg.sender);
      }
      _mint(msg.sender, _stake);
  }

  /**
   * @notice A method to retrieve the stake for a stakeholder.
   * @param _stakeholder The stakeholder to retrieve the stake for.
   * @return uint256 The amount of wei staked.
   */
  function stakeOf(address _stakeholder)
    external 
    view 
    returns(uint256)
  {
      return stakes[_stakeholder];
  }

  /**
   * @notice A method to the aggregated stakes from all stakeholders.
   * @return uint256 The aggregated stakes from all stakeholders.
   */
  function totalStakes()
    external
    view
    returns(uint256)
  {
      uint256 _totalStakes = 0;
      for (uint256 s = 0; s < stakeholders.length; s++){
          _totalStakes = _totalStakes + stakes[stakeholders[s]];
      }
      return _totalStakes;
  }

  // ---------- STAKEHOLDERS ----------

  /**
   * @notice A method to check if an address is a stakeholder.
   * @param _address The address to verify.
   * @return bool, uint256 Whether the address is a stakeholder, 
   * and if so its position in the stakeholders array.
   */
  function isStakeholder(address _address)
    public
    view
    returns(bool, uint256)
  {
      for (uint256 s = 0; s < stakeholders.length; s++){
          if (_address == stakeholders[s]) {
            return (true, s);
          }
      }
      return (false, 0);
  }

  /**
   * @notice A method to add a stakeholder.
   * @param _stakeholder The stakeholder to add.
   */
  function addStakeholder(address _stakeholder) public
  {
      (bool _isStakeholder, ) = isStakeholder(_stakeholder);
      if (!_isStakeholder) {
        stakeholders.push(_stakeholder);
      }
  }

  /**
   * @notice A method to remove a stakeholder.
   * @param _stakeholder The stakeholder to remove.
   */
  function removeStakeholder(address _stakeholder) public
  {
      (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);
      if (_isStakeholder) {
          stakeholders[s] = stakeholders[stakeholders.length - 1];
          stakeholders.pop();
      } 
  }

  // ---------- REWARDS ----------
  
  /**
   * @notice A method to allow a stakeholder to check his rewards.
   * @param _stakeholder The stakeholder to check rewards for.
   */
  function rewardOf(address _stakeholder) 
    external
    view
    returns(uint256)
  {
      return rewards[_stakeholder];
  }

  /**
   * @notice A method to the aggregated rewards from all stakeholders.
   * @return uint256 The aggregated rewards from all stakeholders.
   */
  function totalRewards()
    external
    view
    returns(uint256)
  {
      uint256 _totalRewards = 0;
      for (uint256 s = 0; s < stakeholders.length; s++) {
          _totalRewards = _totalRewards + rewards[stakeholders[s]];
      }
      return _totalRewards;
  }

  /** 
   * @notice A simple method that calculates the rewards for each stakeholder.
   * @param _stakeholder The stakeholder to calculate rewards for.
   */
  function calculateReward(address _stakeholder)
    public
    view
    returns(uint256)
  {
      return stakes[_stakeholder] / 100;
  }

  /**
   * @notice A method to distribute rewards to all stakeholders.
   */
  function distributeRewards() 
    external
    onlyOwner
  {
      for (uint256 s = 0; s < stakeholders.length; s++) {
          address stakeholder = stakeholders[s];
          uint256 reward = calculateReward(stakeholder);
          rewards[stakeholder] = rewards[stakeholder] + reward;
      }
  }

  /**
   * @notice A method to allow a stakeholder to withdraw his rewards.
   */
  function withdrawReward() external
  {
      uint256 reward = rewards[msg.sender];
      rewards[msg.sender] = 0;
      _mint(msg.sender, reward);
  }
}