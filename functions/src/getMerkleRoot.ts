import * as functions from 'firebase-functions';
import {distributorContract} from './contract';
import {getFirestoreData} from './helpers/firestore';
import {merkletreeUtils} from './helpers/merkletree-utils';
import {Answer, Quiz} from './types/firestore-types';

type GetMerkleRootCallData = {
  quizId: number;
  address: string;
};

export const getMerkleRoot = functions.https.onCall(
  async (data: GetMerkleRootCallData, context) => {
    const timestamp = await distributorContract.getMerkleRootTimestamp(
      data.quizId
    );

    const quizzes = await getFirestoreData<Quiz[]>('quiz', [
      {field: 'quizId', operator: '==', to: data.quizId}
    ]);
    const correctAnswers = quizzes.map(q => q.correctAnswer);
    const answers = await getFirestoreData<Answer[]>('answers', [
      {field: 'timestamp', operator: '<=', to: timestamp.toNumber()},
      {field: 'answerId', operator: 'in', to: correctAnswers}
    ]);
    const addresses = answers.map(a => a.address);

    const tree = merkletreeUtils.buildMerkleTree(addresses);
    return merkletreeUtils.getMerkleRoot(tree);
  }
);
