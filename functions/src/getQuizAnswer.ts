import {BigNumber} from 'ethers';
import * as functions from 'firebase-functions';
import {db} from './config';
import {distributorContract} from './contract';

export type GetQuizAnswerRequest = {
  quizId: string;
  address: string;
};

export const getQuizAnswer = functions.https.onCall(
  async (data: GetQuizAnswerRequest, context) => {
    const res = await db
      .collection('answers')
      .where('address', '==', data.address)
      .where('quizId', '==', data.quizId)
      .get();

    const answersRes = res.docs.map(d => d.data());
    functions.logger.log('Answers', answersRes);

    if (answersRes.length !== 1) {
      functions.logger.log('Answers !== 1', answersRes);
      return null;
    }
    const answer = answersRes[0];

    const res1 = await db.collection('solutions').doc(data.quizId).get();
    if (!res1.exists) {
      functions.logger.log('Quiz Answer does not exist', res1);
      return null;
    }
    const solution = res1.data();

    const claimed = (
      await distributorContract.getClaimedQuizzes(data.address)
    ).map(q => q.toString());

    const merkleUpdate = await distributorContract.getMerkleRootTimestamp(
      BigNumber.from(answer.quizId)
    );

    return {
      ...answer,
      correct: solution?.correctAnswer === answer.answer,
      claimable:
        !claimed.includes(answer.quizId) && answer.timestamp <= merkleUpdate
    };
  }
);
