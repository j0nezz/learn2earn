import {ethers} from 'ethers';
import {QuizDistributor__factory} from './contracts/types';

const provider = ethers.getDefaultProvider(3);

export const distributorContract = QuizDistributor__factory.connect(
  '0x30195a222233081dca6d0dc4dcc09fb01fabb426',
  provider
);
