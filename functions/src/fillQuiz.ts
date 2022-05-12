import {BigNumber, ethers} from 'ethers';
import * as functions from 'firebase-functions';
import {db} from './config';
import {distributorContract, provider} from './contract';
import {Erc20__factory} from './contracts/types';
import {QuestionAnswer} from './types/firestore-types';

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
      const {
        token,
        owner: quizOwner,
        reward
      } = await distributorContract.getQuiz(BigNumber.from(quizId));
      functions.logger.log('Connect to token: ', token);

      const tokenContract = Erc20__factory.connect(token, provider);
      const tokenName = await tokenContract.symbol();

      functions.logger.log("Hello from info. Here's an object:", tokenName);

      if (quizOwner !== ownerAddress) {
        throw new functions.https.HttpsError(
          'permission-denied',
          'Not quizowner in contract'
        );
      }

      await db.collection('quiz').doc(quizId).set({
        youtubeId,
        question: question,
        answers,
        ownerAddress,
        token,
        tokenName,
        reward: reward.toString(),
        quizId
      });

      await db.collection('solutions').doc(quizId).set({correctAnswer});

      return {youtubeId, question: question, answers, quizId};
    } catch (e) {
      functions.logger.log('Error', e);
      throw new functions.https.HttpsError('internal', 'Internal Server Error');
    }
  }
);
