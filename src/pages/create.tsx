import {Web3Provider} from '@ethersproject/providers';
import {httpsCallable} from '@firebase/functions';
import {useWeb3React} from '@web3-react/core';
import {Flex} from 'axelra-styled-bootstrap-grid';
import {BigNumber, ethers} from 'ethers';
import Router from 'next/router';
import React, {ReactElement, useCallback, useMemo, useState} from 'react';
import {toast} from 'react-hot-toast';
import {FillQuizRequestType} from '../../functions/src/fillQuiz';
import {Button} from '../components/ui/Button';
import {Input} from '../components/ui/Input';
import {PageContainer} from '../components/ui/PageContainer';
import {Bold, Medium} from '../components/ui/Typography';
import {useQuizDistributor} from '../contracts/addresses';
import {getRandomBigNumber} from '../helpers/getRandomBigNumber';
import {waitAndEvaluateTx} from '../helpers/waitAndEvaluateTx';
import Web3Layout from '../layouts/web3.layout';
import {functions} from '../lib/firebase';
import {QuestionAnswer} from '../types/firestore-types';

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
  const [correctAnswer, setCorrectAnswer] = useState<QuestionAnswer>({
    id: getRandomBigNumber().toNumber(),
    label: ''
  });
  const [wrongAnswers, setWrongAnswers] = useState<QuestionAnswer[]>([]);

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
      if (!account || !quizId || !library || !question) return;
      try {
        const res = await fillQuizCallable({
          quizId,
          answers: [correctAnswer, ...wrongAnswers],
          correctAnswer: correctAnswer.id,
          youtubeId,
          question,
          ownerAddress: account,

          signature: await library.getSigner(account).signMessage(account)
        });
        console.log('RESULT', res.data);

        await Router.push(`/${account}/${quizId}`);
      } catch (e) {
        console.log(e);
      }
    },
    [account, correctAnswer, library, question, quizId, wrongAnswers, youtubeId]
  );

  const CreateQuizForm = useMemo(
    () => (
      <form onSubmit={createQuiz}>
        <Input
          value={token}
          placeholder={'Token'}
          name={'Token'}
          onTextChange={setToken}
        />
        <Input
          value={reward}
          placeholder={'Reward'}
          name={'Reward'}
          onTextChange={setReward}
          type={'number'}
        />
        <Button type={'submit'}>Create Quiz</Button>
      </form>
    ),
    [createQuiz, reward, token]
  );

  const addMoreAnswers = useCallback(() => {
    setWrongAnswers(prev => [
      ...prev,
      {id: getRandomBigNumber().toNumber(), label: ''}
    ]);
  }, []);

  const updateAnswerAtIndex = useCallback((idx: number, text: string) => {
    setWrongAnswers(prev => [
      ...prev.map((a, index) => (idx === index ? {id: a.id, label: text} : a))
    ]);
  }, []);

  const FillQuizForm = useMemo(
    () => (
      <Flex column>
        <Medium>Fill Data for Quiz ID: {quizId}</Medium>
        <form onSubmit={fillQuizData}>
          <Input
            value={youtubeId}
            placeholder={'Youtube Id'}
            name={'Youtube Id'}
            onTextChange={setYoutubeId}
            type={'text'}
          />
          <Input
            value={question}
            placeholder={'Question'}
            name={'Question'}
            onTextChange={setQuestion}
            type={'text'}
          />
          <Input
            value={correctAnswer.label}
            placeholder={'Correct Answer'}
            name={'Correct Answer'}
            onTextChange={text =>
              setCorrectAnswer(prev => ({id: prev.id, label: text}))
            }
            type={'text'}
          />
          <div onClick={addMoreAnswers}>Add more answers</div>
          {wrongAnswers.map((a, i) => (
            <Input
              key={String(i)}
              value={wrongAnswers[i].label}
              placeholder={'Wrong Answer ' + String(i + 1)}
              name={'Wrong Answer ' + String(i + 1)}
              onTextChange={text => updateAnswerAtIndex(i, text)}
              type={'text'}
            />
          ))}
          <Button type={'submit'}>Update Quiz Data</Button>
        </form>
      </Flex>
    ),
    [
      addMoreAnswers,
      correctAnswer.label,
      fillQuizData,
      question,
      quizId,
      updateAnswerAtIndex,
      wrongAnswers,
      youtubeId
    ]
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
