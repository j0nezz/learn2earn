import {ethers} from 'ethers';
import * as functions from 'firebase-functions';
import {db} from './config';
import {distributorContract} from './contract';
import {QuestionAnswer} from './types/QuestionAnswer';

export type FillQuizRequestType = {
  quizId: string;
  youtubeId: string;
  question: string;
  answers: QuestionAnswer[];
  correctAnswer: number;
  ownerAddress: string;
  signature: string;
};

export const fillQuiz = functions.https.onCall(
  async (request: FillQuizRequestType, response) => {
    const {
      quizId,
      youtubeId,
      question,
      answers,
      correctAnswer,
      ownerAddress,
      signature
    } = request;

    // TODO make sure the QuizId doesn't exist

    try {
      const derivedAddr = ethers.utils.verifyMessage(ownerAddress, signature);

      if (derivedAddr !== ownerAddress) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Only owner of the quiz can add data'
        );
      }
    } catch (e) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Signature invalid'
      );
    }

    try {
      const {token, owner: quizOwner} = await distributorContract.getQuiz(
        quizId
      );

      if (quizOwner !== ownerAddress) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Not quizowner in contract'
        );
      }

      await db
        .collection('quiz')
        .doc(quizId)
        .set({youtubeId, question: question, answers, ownerAddress, token});

      await db.collection('answers').doc(quizId).set({correctAnswer});

      return {youtubeId, question: question, answers, quizId};
    } catch (e) {
      throw new functions.https.HttpsError('internal', 'Internal Server Error');
    }
  }
);
