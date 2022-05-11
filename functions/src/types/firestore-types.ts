import { QuizAnswer } from "./QuizAnswer"

export type Answer = {
    quizId: number
    address: string
    timestamp: number
    answerId: number
}

export type Quiz = {
    quizId: string;
    youtubeId: string;
    question: string;
    answers: QuizAnswer[];
    correctAnswer: number;
}