import {QuestionAnswer} from './QuestionAnswer';

export type Answer = {
  quizId: number;
  address: string;
  timestamp: number;
  answerId: number;
};

export type Quiz = {
  quizId: string;
  youtubeId: string;
  question: string;
  answers: QuestionAnswer[];
  correctAnswer: number;
};
