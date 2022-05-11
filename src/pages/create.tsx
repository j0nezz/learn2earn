import {Web3Provider} from '@ethersproject/providers';
import {httpsCallable} from '@firebase/functions';
import {useWeb3React} from '@web3-react/core';
import {Flex} from 'axelra-styled-bootstrap-grid';
import {BigNumber, ethers} from 'ethers';
import React, {ReactElement, useCallback, useMemo, useState} from 'react';
import {toast} from 'react-hot-toast';
import {FillQuizRequestType} from '../../functions/src/fillQuiz';
import {Button} from '../components/ui/Button';
import {PageContainer} from '../components/ui/PageContainer';
import {Bold, Medium} from '../components/ui/Typography';
import {useQuizDistributor} from '../contracts/addresses';
import {waitAndEvaluateTx} from '../helpers/waitAndEvaluateTx';
import Web3Layout from '../layouts/web3.layout';
import {functions} from '../lib/firebase';

type Props = {};

const fillQuizCallable = httpsCallable<FillQuizRequestType>(
  functions,
  'fillQuiz'
);

const Create = (props: Props) => {
  const {account, library} = useWeb3React<Web3Provider>();
  const distributor = useQuizDistributor();

  const [token, setToken] = useState('');
  const [reward, setReward] = useState('');
  const [quizId, setQuizId] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [question, setQuestion] = useState('');

  const createQuiz = useCallback(
    async e => {
      try {
        e.preventDefault();
        if (!account || !distributor) {
          console.log('No account or distributor');
          return;
        }

        const id = BigNumber.from(ethers.utils.randomBytes(32));

        const tx = await distributor.createQuiz(
          id,
          token,
          account,
          BigNumber.from(reward)
        );
        const txConfirmation = waitAndEvaluateTx(tx);
        await toast.promise(txConfirmation, {
          loading: 'Waiting for confirmation',
          success: 'Quiz successfully created',
          error: 'Error creating quiz'
        });

        setQuizId(id.toString());
      } catch (e) {
        toast.error('Something went wrong');
        console.log(e);
      }
    },
    [account, distributor, reward, token]
  );

  const fillQuizData = useCallback(
    async e => {
      e.preventDefault();
      if (!account || !quizId || !library) return;
      try {
        const res = await fillQuizCallable({
          quizId,
          answers: [
            {id: 1, label: 'answer1'},
            {id: 1, label: 'answer1'},
            {id: 1, label: 'answer1'},
            {id: 1, label: 'answer1'}
          ],
          correctAnswer: 1,
          youtubeId: 'asdf',
          question: 'what is the correct answer?',
          ownerAddress: account,

          signature: await library.getSigner(account).signMessage(account)
        });
        console.log('RESULT', res.data);
      } catch (e) {
        console.log(e);
      }
    },
    [account, library, quizId]
  );

  const CreateQuizForm = useMemo(
    () => (
      <form onSubmit={createQuiz}>
        <div>
          <label>Token</label>
          <input
            type={'text'}
            value={token}
            onChange={e => setToken(e.target.value)}
          />
        </div>
        <div>
          <label>Reward</label>
          <input
            type={'number'}
            value={reward}
            onChange={e => setReward(e.target.value)}
          />
        </div>
        <Button type={'submit'}>Create Quiz</Button>
      </form>
    ),
    [createQuiz, reward, token]
  );

  const FillQuizForm = useMemo(
    () => (
      <Flex column>
        <Medium>Fill Data for Quiz ID: {quizId}</Medium>
        <form onSubmit={fillQuizData}>
          <div>
            <label>Youtube Id</label>
            <input
              type={'text'}
              value={youtubeId}
              onChange={e => setYoutubeId(e.target.value)}
            />
          </div>
          <div>
            <label>Question</label>
            <input
              type={'string'}
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
          </div>
          <Button type={'submit'}>Update Quiz Data</Button>
        </form>
      </Flex>
    ),
    [fillQuizData, question, youtubeId]
  );

  return (
    <PageContainer>
      <Bold size={'xxxl'} gradient block>
        Create Quiz
      </Bold>
      {!account && <Medium block>Connect an account to create a Quiz</Medium>}

      {quizId ? FillQuizForm : CreateQuizForm}
    </PageContainer>
  );
};

Create.getLayout = function getLayout(page: ReactElement) {
  return <Web3Layout>{page}</Web3Layout>;
};

export default Create;
