import {httpsCallable} from '@firebase/functions';
import {useWeb3React} from '@web3-react/core';
import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';
import {GetMerkleRootCallData} from '../../functions/src/getMerkleProof';
import {Button} from '../components/ui/Button';
import {PageContainer} from '../components/ui/PageContainer';
import {Bold, Medium} from '../components/ui/Typography';
import {useQuizDistributor} from '../contracts/addresses';
import {QuizDistributor} from '../contracts/types';
import {waitAndEvaluateTx} from '../helpers/waitAndEvaluateTx';
import Web3Layout from '../layouts/web3.layout';
import {functions} from '../lib/firebase';

type Props = {
  quizId: number;
};

const getMerkleProof = httpsCallable<GetMerkleRootCallData, string[]>(
  functions,
  'getMerkleProof'
);

const Claim = (props: Props) => {
  const {account, library} = useWeb3React();
  const distributor = useQuizDistributor();

  const [quiz, setQuiz] = useState<QuizDistributor.QuizStructOutput | null>();

  const claim = useCallback(
    async e => {
      try {
        e.preventDefault();
        if (!account || !distributor) {
          console.log('No account or distributor');
          return;
        }
        const res2 = await getMerkleProof({
          quizId: props.quizId,
          address: account
        });
        const tx = await distributor.claim(props.quizId, res2.data);
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
    [account, distributor, props.quizId]
  );

  const fetchReward = useCallback(async () => {
    try {
      if (!account || !distributor) {
        console.log('No account or distributor');
        return;
      }
      const quiz = await distributor.getQuiz(props.quizId);
      setQuiz(quiz);
    } catch (e) {
      console.log(e);
    }
  }, [account, distributor, props.quizId]);

  useEffect(() => {
    fetchReward();
  });

  return (
    <PageContainer>
      <Bold size={'xxxl'} gradient block>
        Claim
      </Bold>
      {account ? (
        <Medium>Hello {account}</Medium>
      ) : (
        <Medium>Use the connect Button in the Header</Medium>
      )}
      <Medium>Quizreward is {quiz?.reward}</Medium>
      <Button onClick={claim}>Claim quiz reward</Button>
    </PageContainer>
  );
};

Claim.getLayout = function getLayout(page: ReactElement) {
  return <Web3Layout>{page}</Web3Layout>;
};

export default Claim;
