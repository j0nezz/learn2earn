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
import {usePrevious} from 'react-use';
import styled from 'styled-components';
import {AnswerQuizRequestType} from '../../../functions/src/answerQuiz';
import {GetMerkleProofCallData} from '../../../functions/src/getMerkleProof';
import {GetQuizAnswerRequest} from '../../../functions/src/getQuizAnswer';
import QuizAnswers from '../../components/QuizAnswers';
import {Button} from '../../components/ui/Button';
import {PageContainer} from '../../components/ui/PageContainer';
import {Bold, Medium} from '../../components/ui/Typography';
import {useQuizDistributor} from '../../contracts/addresses';
import {waitAndEvaluateTx} from '../../helpers/waitAndEvaluateTx';
import Web3Layout from '../../layouts/web3.layout';
import {db, functions} from '../../lib/firebase';
import {Answer, Quiz} from '../../types/firestore-types';

type Props = {
  quiz: Quiz;
};

const answerQuiz = httpsCallable<AnswerQuizRequestType, boolean>(
  functions,
  'answerQuiz'
);

const getQuizAnswer = httpsCallable<
  GetQuizAnswerRequest,
  (Answer & {correct: boolean; claimable: boolean}) | null
>(functions, 'getQuizAnswer');

const getMerkleProof = httpsCallable<GetMerkleProofCallData, string[]>(
  functions,
  'getMerkleProof'
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
  const [correct, setCorrect] = useState(false);
  const [claimable, setClaimable] = useState(false);
  const {account, library} = useWeb3React();
  const distributor = useQuizDistributor();

  const prevAccount = usePrevious(account);

  const selectAnswer = useCallback(
    async (id: number) => {
      try {
        if (!library || !account || alreadyAnswered) return;

        setSelected(id);
        const signature = await (library as Web3Provider)
          .getSigner(account)
          .signMessage(id.toString());

        const toastId = toast.loading('Evaluating Answer');
        const req = await answerQuiz({
          quizId: quiz.quizId,
          signature,
          answer: id
        });
        toast.dismiss(toastId);

        console.log('Answer Data', req.data);
        if (req.data) {
          toast.success('Answer is correct');
        } else {
          toast.error('Answer is wrong');
        }
        setCorrect(Boolean(req.data));
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
      console.log('Fetching answer');
      if (!account) return;
      const answer = await getQuizAnswer({
        quizId: quiz.quizId,
        address: account
      });
      if (answer.data) {
        setAlreadyAnswered(true);
        setConfirmed(answer.data?.answer || null);
        setCorrect(answer?.data?.correct);
        setClaimable(answer?.data?.claimable);
      }

      console.log('Fetched answer', answer);
    } catch (e) {
      console.log(e);
    }
  }, [account, quiz.quizId]);

  const claim = useCallback(
    async e => {
      try {
        e.preventDefault();
        if (!account || !distributor) {
          console.log('No account or distributor');
          return;
        }
        const res2 = await getMerkleProof({
          quizId: quiz.quizId,
          address: account
        });
        const tx = await distributor.claim(quiz.quizId, res2.data);
        const txConfirmation = waitAndEvaluateTx(tx);
        await toast.promise(txConfirmation, {
          loading: 'Waiting for confirmation',
          success: 'Reward successfully claimed',
          error: 'Error claiming reward'
        });
      } catch (e) {
        console.log(e);
      }
    },
    [account, distributor, quiz.quizId]
  );

  useEffect(() => {
    if (prevAccount !== account) {
      fetchAnswer();
    }
  }, [account, fetchAnswer, prevAccount]);

  return (
    <PageContainer>
      <Bold size={'xxxl'} gradient block>
        Earn {quiz.tokenName}
      </Bold>
      {claimable && <Button onClick={claim}>Claim now!</Button>}
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
        correct={correct}
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
