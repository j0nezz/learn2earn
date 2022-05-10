import {ethers} from 'ethers';
import {QuizDistributor__factory} from './contracts/types';

const provider = ethers.getDefaultProvider(3);

export const distributorContract = QuizDistributor__factory.connect(
  '0x418fa747f875ab5bb07c7645c53bc05cd1c4ffea',
  provider
);
