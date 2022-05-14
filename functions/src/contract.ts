import {ethers} from 'ethers';
import {QuizDistributor__factory} from './contracts/types';
const functions = require('firebase-functions');

export const provider = new ethers.providers.InfuraProvider(3, {
  projectId: functions.config().infura.id,
  projectSecret: functions.config().infura.key
});

export const distributorContract = QuizDistributor__factory.connect(
  '0x30195a222233081dca6d0dc4dcc09fb01fabb426',
  provider
);
