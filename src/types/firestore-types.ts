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
  tokenName: string;
  reward: string;
  ownerAddress: string;
};

export type QuestionAnswer = {
  id: number;
  label: string;
};