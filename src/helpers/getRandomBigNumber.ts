import {BigNumber, ethers} from 'ethers';

export const getRandomBigNumber = () =>
  BigNumber.from(ethers.utils.randomBytes(4));
