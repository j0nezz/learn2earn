import {Web3Provider} from '@ethersproject/providers';
import {doc, DocumentReference, getDoc} from '@firebase/firestore';
import {httpsCallable} from '@firebase/functions';
import {useWeb3React} from '@web3-react/core';
import {MEDIUM_DEVICES_BREAK_POINT, Spacer} from 'axelra-styled-bootstrap-grid';
import {shuffled} from 'ethers/lib/utils';
import {GetServerSideProps} from 'next';
import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import styled from 'styled-components';
import {AnswerQuizRequestType} from '../../../functions/src/answerQuiz';
import {GetQuizAnswerRequest} from '../../../functions/src/getQuizAnswer';
import QuizAnswers from '../../components/QuizAnswers';
import {PageContainer} from '../../components/ui/PageContainer';
import {Bold, Medium} from '../../components/ui/Typography';
import Web3Layout from '../../layouts/web3.layout';
import {db, functions} from '../../lib/firebase';
import {Answer, Quiz} from '../../types/firestore-types';

type Props = {
  quiz: Quiz;
};

const answerQuiz = httpsCallable<AnswerQuizRequestType>(
  functions,
  'answerQuiz'
);

const getQuizAnswer = httpsCallable<GetQuizAnswerRequest, Answer | null>(
  functions,
  'getQuizAnswer'
);

const VideoWrapper = styled.div`
  @media only screen and (min-width: ${MEDIUM_DEVICES_BREAK_POINT}px) {
    max-width: min(70vw, 1000px);
  }
  margin: auto;
`;

const Index = ({quiz}: Props) => {
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState<number | null>(null);
  const {account, library} = useWeb3React();

  // TODO: Fetch Answer

  const selectAnswer = useCallback(
    async (id: number) => {
      try {
        if (!library || !account || alreadyAnswered) return;

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
    [account, alreadyAnswered, library, quiz.quizId]
  );

  const fetchAnswer = useCallback(async () => {
    try {
      if (!account) return;
      const answer = await getQuizAnswer({
        quizId: quiz.quizId,
        address: account
      });
      if (answer) {
        setAlreadyAnswered(true);
        setConfirmed(answer.data?.answer || null);
      }
    } catch (e) {
      console.log(e);
    }
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
      <VideoWrapper>
        <LiteYouTubeEmbed
          id={quiz.youtubeId}
          title={'Earn ' + quiz.tokenName}
        />
      </VideoWrapper>
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
