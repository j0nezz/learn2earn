import * as functions from 'firebase-functions';
import {getFirestoreData} from './helpers/firestore';
import {merkletreeUtils} from './helpers/merkletree-utils';
import {Answer} from './types/firestore-types';

export type GetMerkleRootCallData = {
  quizId: string;
  timestamp: number;
};

export const getMerkleRoot = functions.https.onCall(
  async (data: GetMerkleRootCallData, context) => {
    const correctAnswers = await getFirestoreData<{correctAnswer: number}[]>(
      'solutions',
      []
    );

    functions.logger.log('These are the correct answers:', correctAnswers);

    const answers = await getFirestoreData<Answer[]>('answers', [
      {field: 'timestamp', operator: '<=', to: data.timestamp},
      {
        field: 'answerId',
        operator: 'in',
        to: correctAnswers.map(a => a.correctAnswer)
      },
      {field: 'quizId', operator: '==', to: data.quizId}
    ]);


    const addresses = answers.map(a => a.address);

    const tree = merkletreeUtils.buildMerkleTree(addresses);

    functions.logger.log('These is the root:', merkletreeUtils.getMerkleRoot(tree));
    return merkletreeUtils.getMerkleRoot(tree);
  }
);
