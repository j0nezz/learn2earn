import * as functions from 'firebase-functions';
import {db} from './config';
import {getFirestoreData} from './helpers/firestore';
import {merkletreeUtils} from './helpers/merkletree-utils';
import {Answer} from './types/firestore-types';

type GetMerkleRootCallData = {
  quizId: string;
  timestamp: number;
};

export const getMerkleRoot = functions.https.onCall(
  async (data: GetMerkleRootCallData, context) => {
    const solutionRes = await db.collection('solutions').doc(data.quizId).get();

    if (!solutionRes.exists) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Quiz has no solution'
      );
    }

    const solutionDoc = solutionRes.data() as {
      correctAnswer: number;
    };

    functions.logger.log('This is the correct solution', solutionDoc);

    const answers = await getFirestoreData<Answer[]>('answers', [
      {field: 'timestamp', operator: '<=', to: data.timestamp},
      {
        field: 'answer',
        operator: '==',
        to: solutionDoc.correctAnswer
      },
      {field: 'quizId', operator: '==', to: data.quizId}
    ]);
    functions.logger.log('These are the correct answers:', answers);

    const addresses = answers.map(a => a.address);

    const tree = merkletreeUtils.buildMerkleTree(addresses);

    functions.logger.log(
      'These is the root:',
      merkletreeUtils.getMerkleRoot(tree)
    );
    return merkletreeUtils.getMerkleRoot(tree);
  }
);
