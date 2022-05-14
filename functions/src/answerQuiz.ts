import {ethers} from 'ethers';
import * as functions from 'firebase-functions';
import {db} from './config';

type AnswerQuizRequestType = {
  quizId: string;
  answer: number;
  signature: string;
};

export const answerQuiz = functions.https.onCall(
  async (request: AnswerQuizRequestType, response) => {
    const {quizId, answer, signature} = request;

    try {
      const address = ethers.utils.verifyMessage(answer.toString(), signature);

      await db.collection('answers').add({
        quizId,
        address,
        timestamp: Date.now(),
        answer
      });

      const res1 = await db.collection('solutions').doc(quizId).get();
      if (!res1.exists) {
        functions.logger.log('Quiz Answer does not exist', res1);
        return null;
      }
      const solution = res1.data();

      return solution?.correctAnswer === answer;
    } catch (e) {
      functions.logger.log('Error', e);
      throw new functions.https.HttpsError('internal', 'Internal Server Error');
    }
  }
);
