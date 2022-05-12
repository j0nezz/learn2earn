import {Web3Provider} from '@ethersproject/providers';
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  where
} from '@firebase/firestore';
import {httpsCallable} from '@firebase/functions';
import {useWeb3React} from '@web3-react/core';
import {Spacer} from 'axelra-styled-bootstrap-grid';
import {GetServerSideProps} from 'next';
import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import {AnswerQuizRequestType} from '../../../functions/src/answerQuiz';
import QuizAnswers from '../../components/QuizAnswers';
import {PageContainer} from '../../components/ui/PageContainer';
import {Bold, Medium} from '../../components/ui/Typography';
import Web3Layout from '../../layouts/web3.layout';
import {db, functions} from '../../lib/firebase';
import {Answer, Quiz} from '../../types/firestore-types';
import {shuffled} from "ethers/lib/utils";

type Props = {
  quiz: Quiz;
};

const answerQuiz = httpsCallable<AnswerQuizRequestType>(
  functions,
  'answerQuiz'
);

const Index = ({quiz}: Props) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState<number | null>(null);
  const {account, library} = useWeb3React();

  // TODO: Fetch Answer

  const selectAnswer = useCallback(
    async (id: number) => {
      try {
        if (!library || !account) return;

        setSelected(id);
        const signature = await (library as Web3Provider)
          .getSigner(account)
          .signMessage(id.toString());

        const req = answerQuiz({quizId: quiz.quizId, signature, answer: id});

        await toast.promise(req, {
          loading: 'Waiting for confirmation',
          success: 'Answer successfully stored',
          error: 'Error answering quiz'
        });

        setConfirmed(id);
      } catch (e) {
        toast.error('Something went wrong');
        console.log(e);
      }
    },
    [account, library, quiz.quizId]
  );

  const fetchAnswer = useCallback(async () => {
    try {
      const q = query(
        collection(db, 'answers'),
        where('address', '==', account),
        where('quizId', '==', quiz.quizId)
      );
      // @ts-ignore
      const d = await getDocs<Answer>(q);
      console.log(
        'answers',
        d.docs.map(d => d.data())
      );
    } catch (e) {}
  }, [account, quiz.quizId]);

  useEffect(() => {
    if (account) {
      fetchAnswer();
    }
  }, [account, fetchAnswer]);

  return (
    <PageContainer>
      <Bold size={'xxxl'} gradient block>
        Earn {quiz.tokenName}
      </Bold>
      <LiteYouTubeEmbed id={quiz.youtubeId} title={'Earn ' + quiz.tokenName} />
      <Spacer x2 />

      <Medium size={'xl'} block>
        {quiz.question}
      </Medium>
      <Spacer x2 />
      <QuizAnswers
        answers={quiz.answers}
        selected={selected}
        confirmed={confirmed}
        onSelect={selectAnswer}
      />
    </PageContainer>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Web3Layout>{page}</Web3Layout>;
};

export const getServerSideProps: GetServerSideProps<
  any,
  {quizId: string},
  any
> = async ({params}) => {
  const quizId = params?.quizId;

  if (!quizId) {
    return {
      redirect: {
        destination: '/learn',
        permanent: false
      }
    };
  }

  const ref = doc(db, 'quiz', quizId) as DocumentReference<Quiz>;
  const docSnap = await getDoc<Quiz>(ref);

  // TODO get Answer of user

  const data = docSnap.data();
  if (!quizId || !data) {
    return {
      redirect: {
        destination: '/learn',
        permanent: false
      }
    };
  }

  return {
    props: {
      quiz: {...data, answers: shuffled(data.answers)} as Quiz
    }
  };
};

export default Index;
