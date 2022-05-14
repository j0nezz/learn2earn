import * as functions from 'firebase-functions';
import {db} from './config';
import {distributorContract} from './contract';
import {getFirestoreData} from './helpers/firestore';
import {merkletreeUtils} from './helpers/merkletree-utils';
import {Answer} from './types/firestore-types';

type GetMerkleProofCallData = {
  quizId: string;
  address: string;
};

export const getMerkleProof = functions.https.onCall(
  async (data: GetMerkleProofCallData, context) => {
    const timestamp = await distributorContract.getMerkleRootTimestamp(
      data.quizId
    );

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
      {field: 'timestamp', operator: '<=', to: timestamp.toNumber()},
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
    return merkletreeUtils.getMerkleProofForLeaf(data.address, tree);
  }
);
