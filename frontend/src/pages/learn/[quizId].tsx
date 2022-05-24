import {Web3Provider} from '@ethersproject/providers';
import {doc, DocumentReference, getDoc} from '@firebase/firestore';
import {httpsCallable} from '@firebase/functions';
import {useWeb3React} from '@web3-react/core';
import {
  Flex,
  LARGE_DEVICES_BREAK_POINT,
  MEDIUM_DEVICES_BREAK_POINT,
  Spacer
} from 'axelra-styled-bootstrap-grid';
import {ethers} from 'ethers';
import {shuffled} from 'ethers/lib/utils';
import {GetServerSideProps} from 'next';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {toast} from 'react-hot-toast';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import {usePrevious} from 'react-use';
import styled from 'styled-components';
import QuizAnswers from '../../components/QuizAnswers';
import {Button} from '../../components/ui/Button';
import {PageContainer} from '../../components/ui/PageContainer';
import {Bold, Medium, Regular, SemiBold} from '../../components/ui/Typography';
import {VideoWrapper} from '../../components/ui/VideoWrapper';
import {useQuizDistributor} from '../../contracts/addresses';
import {waitAndEvaluateTx} from '../../helpers/waitAndEvaluateTx';
import {useErc20Decimals} from '../../hooks/useErc20Decimals';
import Web3Layout from '../../layouts/web3.layout';
import {db, functions} from '../../lib/firebase';
import {
  AnswerQuizRequestType,
  GetMerkleProofCallData,
  GetQuizAnswerRequest
} from '../../types/firebase-function-types';
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

const Header = styled(Flex)`
  @media only screen and (max-width: ${LARGE_DEVICES_BREAK_POINT}px) {
    flex-direction: column;
  }
`;

const RewardBanner = styled(Flex)`
  @media only screen and (max-width: ${LARGE_DEVICES_BREAK_POINT}px) {
    justify-content: space-between;
  }
  @media only screen and (max-width: ${MEDIUM_DEVICES_BREAK_POINT}px) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

const ButtonSpacer = styled(Spacer)`
  @media only screen and (max-width: ${LARGE_DEVICES_BREAK_POINT}px) {
    display: none;
  }
`;

const Index = ({quiz}: Props) => {
  const [alreadyAnswered, setAlreadyAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);
  const [claimable, setClaimable] = useState(false);
  const {account, library} = useWeb3React();
  const distributor = useQuizDistributor();
  const decimals = useErc20Decimals(quiz.token);

  const reward = useMemo(() => {
    if (!decimals) return '...';
    return ethers.utils.formatUnits(quiz.reward, decimals);
  }, [decimals, quiz.reward]);

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
        const loading = toast.loading('Preparing claim...');
        const res2 = await getMerkleProof({
          quizId: quiz.quizId,
          address: account
        });
        toast.dismiss(loading);
        const tx = await distributor.claim(quiz.quizId, res2.data);
        const txConfirmation = waitAndEvaluateTx(tx);
        await toast.promise(txConfirmation, {
          loading: 'Waiting for confirmation',
          success: 'Reward successfully claimed',
          error: 'Error claiming reward'
        });
      } catch (e) {
        const message = (e as String).toString().match(/"message":"([^"]*)"/);
        if (message && message[1]) toast.error(message[1]);
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
      <Header row>
        <Bold size={'xxxl'} gradient block>
          Earn {quiz.tokenName}
        </Bold>
        <RewardBanner align={'center'} justify={'flex-end'} flex={1} row>
          <Flex row>
            <SemiBold size={'xl'} gradient block>
              Reward:
            </SemiBold>
            <Spacer />
            <Regular size={'xl'} gradient block>
              {reward} {quiz.tokenName}
            </Regular>
          </Flex>
          {claimable && (
            <Flex row>
              <ButtonSpacer x4 />
              <Button onClick={claim}>Claim now!</Button>
            </Flex>
          )}
        </RewardBanner>
      </Header>
      <Spacer x3 />
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
