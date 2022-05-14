import {QuestionAnswer} from '../../../functions/src/types/firestore-types';

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

export type GetMerkleRootCallData = {
  quizId: string;
  timestamp: number;
};

export type GetMerkleProofCallData = {
  quizId: string;
  address: string;
};

export type FillQuizRequestType = {
  quizId: string;
  youtubeId: string;
  question: string;
  answers: QuestionAnswer[];
  correctAnswer: number;
  ownerAddress: string;
  signature: string;
};

export type AnswerQuizRequestType = {
  quizId: string;
  answer: number;
  signature: string;
};

export type GetQuizAnswerRequest = {
  quizId: string;
  address: string;
};
