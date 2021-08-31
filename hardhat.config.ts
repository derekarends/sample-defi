import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    // mumbai: {
    //   url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
    //   accounts: [account]
    // },
    // mainnet: {
    //   url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
    //   accounts: [account]
    // }
  },
  solidity: "0.8.4",
};

export default config;