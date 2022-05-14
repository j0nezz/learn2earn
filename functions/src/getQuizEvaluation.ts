import {BigNumber} from 'ethers';
import * as functions from 'firebase-functions';
import {db} from './config';
import {distributorContract} from './contract';

export type GetQuizEvaluationRequest = {
  address: string;
};

export type QuizEvaluation = {
  quizId: string;
  correct: boolean;
  claimed: boolean;
  claimable: boolean;
};

export type QuizEvaluationResponse = {[id: string]: QuizEvaluation};

export const getQuizEvaluation = functions.https.onCall(
  async (data: GetQuizEvaluationRequest, context) => {
    const res = await db
      .collection('answers')
      .where('address', '==', data.address)
      .get();

    const answers = res.docs.map(d => d.data());
    functions.logger.log('Answers', answers);

    const claimedIds = (
      await distributorContract.getClaimedQuizzes(data.address)
    ).map(q => q.toString());

    const evaluatedAnswers: QuizEvaluationResponse = {};

    for (const answer of answers) {
      const res1 = await db.collection('solutions').doc(answer.quizId).get();
      if (!res1.exists) {
        functions.logger.log('Quiz Answer does not exist', res1);
        continue;
      }
      const merkleUpdate = await distributorContract.getMerkleRootTimestamp(
        BigNumber.from(answer.quizId)
      );

      const solution = res1.data();
      const correct = answer.answer === solution?.correctAnswer;
      const claimed = claimedIds.includes(answer.quizId);
      evaluatedAnswers[answer.quizId] = {
        quizId: answer.quizId,
        correct,
        claimed,
        claimable: !claimed && merkleUpdate >= answer.timestamp
      };
    }

    return evaluatedAnswers;
  }
);
