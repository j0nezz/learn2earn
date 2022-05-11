import {Web3Provider} from '@ethersproject/providers';
import {doc, DocumentReference, getDoc} from '@firebase/firestore';
import {useWeb3React} from '@web3-react/core';
import {Spacer} from 'axelra-styled-bootstrap-grid';
import {GetServerSideProps} from 'next';
import React, {ReactElement, useCallback, useState} from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import QuizAnswers from '../../components/QuizAnswers';
import {PageContainer} from '../../components/ui/PageContainer';
import {Bold, Medium} from '../../components/ui/Typography';
import Web3Layout from '../../layouts/web3.layout';
import {db} from '../../lib/firebase';
import {Quiz} from '../../types/firestore-types';

type Props = {
  quiz: Quiz;
};

const Index = ({quiz}: Props) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState<number | null>(null);
  const {account, library} = useWeb3React();

  const selectAnswer = useCallback(
    async (id: number) => {
      if (!library || !account) return;

      setSelected(id);
      const sign = await (library as Web3Provider)
        .getSigner(account)
        .signMessage(id.toString());

      console.log(sign);

      // TODO: callBackend({answer: id, quizId, signature})

      setConfirmed(id);
    },
    [account, library]
  );

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
  return {
    props: {
      quiz: data
    }
  };
};

export default Index;
