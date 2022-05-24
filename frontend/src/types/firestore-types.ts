export type Answer = {
  quizId: number;
  address: string;
  timestamp: number;
  answer: number;
};

export type Quiz = {
  quizId: string;
  youtubeId: string;
  question: string;
  answers: QuestionAnswer[];
  tokenName: string;
  token: string;
  reward: string;
  ownerAddress: string;
};

export type QuestionAnswer = {
  id: number;
  label: string;
};
