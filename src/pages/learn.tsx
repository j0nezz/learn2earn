import {Web3Provider} from '@ethersproject/providers';
import {httpsCallable} from '@firebase/functions';
import {useWeb3React} from '@web3-react/core';
import React, {ReactElement, useCallback} from 'react';
import {FillQuizRequestType} from '../../functions/src/fillQuiz';
import {Button} from '../components/ui/Button';
import {PageContainer} from '../components/ui/PageContainer';
import {Bold, Medium} from '../components/ui/Typography';
import Web3Layout from '../layouts/web3.layout';
import {functions} from '../lib/firebase';

type Props = {};

const helloWorld = httpsCallable<FillQuizRequestType>(functions, 'fillQuiz');
const getMerkleRoot = httpsCallable(functions, 'getMerkleRoot');
const getMerkleProof = httpsCallable(functions, 'getMerkleProof');

const Learn = (props: Props) => {
  const {account, library} = useWeb3React();
  const getData = useCallback(async () => {
    if (!account) return;
    try {
      const res = await helloWorld({
        quizId: 'id2',
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

        signature: await (library as Web3Provider)
          .getSigner(account)
          .signMessage(account)
      });
      console.log('RESULT', res.data);
      const res1 = await getMerkleRoot({quizId: 2});
      console.log('RESULT1', res1.data);
      const res2 = await getMerkleProof({
        quizId: 2,
        address: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'
      });
      console.log('RESULT2', res2.data);
    } catch (e) {
      console.log(e);
    }
  }, [account, library]);

  return (
    <PageContainer>
      <Bold size={'xxxl'} gradient block>
        Learn
      </Bold>
      {account ? (
        <Medium>Hello {account}</Medium>
      ) : (
        <Medium>Use the connect Button in the Header</Medium>
      )}
      <Button onClick={getData}>Get Data from Firebase</Button>
    </PageContainer>
  );
};

Learn.getLayout = function getLayout(page: ReactElement) {
  return <Web3Layout>{page}</Web3Layout>;
};

export default Learn;
