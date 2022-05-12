import {ethers} from 'ethers';
import * as functions from 'firebase-functions';
import {db} from './config';

export type AnswerQuizRequestType = {
  quizId: string;
  answer: number;
  signature: string;
};

export const answerQuiz = functions.https.onCall(
  async (request: AnswerQuizRequestType, response) => {
    const {quizId, answer, signature} = request;

    // TODO make sure the QuizId doesn't exist

    try {
      const address = ethers.utils.verifyMessage(answer.toString(), signature);

      await db.collection('answers').add({
        quizId,
        address,
        timestamp: Date.now(),
        answer
      });

      return {quizId, address, timestamp: Date.now(), answer};
    } catch (e) {
      functions.logger.log('Error', e);
      throw new functions.https.HttpsError('internal', 'Internal Server Error');
    }
  }
);
