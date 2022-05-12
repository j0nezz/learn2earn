import * as functions from 'firebase-functions';
import {db} from './config';

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
    const correctAnswers = res.docs.map(d => d.data());
    functions.logger.log('Answers', correctAnswers);

    if (correctAnswers.length !== 1) {
      return null;
    }

    return correctAnswers[0];
  }
);
