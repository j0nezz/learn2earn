import * as functions from 'firebase-functions';
import {distributorContract} from './contract';
import {getFirestoreData} from './helpers/firestore';
import {merkletreeUtils} from './helpers/merkletree-utils';
import {Answer} from './types/firestore-types';

export type GetMerkleProofCallData = {
  quizId: string;
  address: string;
};

export const getMerkleProof = functions.https.onCall(
  async (data: GetMerkleProofCallData, context) => {
    const timestamp = await distributorContract.getMerkleRootTimestamp(
      data.quizId
    );

    const correctAnswers = await getFirestoreData<{correctAnswer: number}[]>(
      'solutions',
      []
    );

    functions.logger.log('These are the correct answers:', correctAnswers);

    const answers = await getFirestoreData<Answer[]>('answers', [
      {field: 'timestamp', operator: '<=', to: timestamp.toNumber()},
      {field: 'answerId', operator: 'in', to: correctAnswers},
      {field: 'quizId', operator: '==', to: data.quizId}
    ]);
    const addresses = answers.map(a => a.address);

    const tree = merkletreeUtils.buildMerkleTree(addresses);
    return merkletreeUtils.getMerkleProofForLeaf(data.address, tree);
  }
);
