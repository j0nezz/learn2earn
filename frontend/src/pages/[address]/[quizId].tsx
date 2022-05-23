import {doc, DocumentReference, getDoc} from '@firebase/firestore';
import {httpsCallable} from '@firebase/functions';
import {Flex, Spacer} from 'axelra-styled-bootstrap-grid';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import {BigNumber} from 'ethers';
import {GetServerSideProps} from 'next';
import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {toast} from 'react-hot-toast';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import {Button} from '../../components/ui/Button';
import {Icon, IconTypes} from '../../components/ui/Icon';
import {PageContainer} from '../../components/ui/PageContainer';
import {Bold, Light, Medium} from '../../components/ui/Typography';
import {useQuizDistributor} from '../../contracts/addresses';
import {waitAndEvaluateTx} from '../../helpers/waitAndEvaluateTx';
import Web3Layout from '../../layouts/web3.layout';
import {db, functions} from '../../lib/firebase';
import {__ALERTS} from '../../theme/theme';
import {GetMerkleRootCallData} from '../../types/firebase-function-types';
import {Quiz} from '../../types/firestore-types';

type Props = {
  quiz: Quiz;
};

const ICON_SIZE = 30;

const getMerkleRoot = httpsCallable<GetMerkleRootCallData, string>(
  functions,
  'getMerkleRoot'
);

const Index = ({quiz}: Props) => {
  const distributor = useQuizDistributor();
  const [lastMerkleRoot, setLastMerkleRoot] = useState<null | Date>(null);

  const getLastMerkleRoot = useCallback(async () => {
    if (!distributor) return;

    const timestamp = await distributor.getMerkleRootTimestamp(quiz.quizId);

    if (timestamp.eq(0)) return;

    setLastMerkleRoot(new Date(timestamp.toNumber()));
  }, [distributor, quiz.quizId]);

  useEffect(() => {
    getLastMerkleRoot();
  }, [getLastMerkleRoot]);

  const setMerkleRoot = useCallback(async () => {
    if (!distributor) return;

    const newTimestamp = Date.now();

    const loading = toast.loading('Generating merkle root...');
    const res = await getMerkleRoot({
      quizId: quiz.quizId,
      timestamp: newTimestamp
    });
    toast.dismiss(loading);

    const id = BigNumber.from(quiz.quizId);
    if (res.data.length === 2) {
      toast.error(
        'You cannot update the merkle root since there is nobody to be rewarded.'
      );
      return;
    }
    const tx = await distributor.updateMerkleRoot(id, res.data, newTimestamp);
    const txConfirmation = waitAndEvaluateTx(tx);
    await toast.promise(txConfirmation, {
      loading: 'Waiting for confirmation',
      success: 'Merkleroot successfully updated',
      error: 'Error updating merkleroot'
    });
  }, [distributor, quiz.quizId]);

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
      {quiz.answers.map((a, i) => (
        <React.Fragment key={a.id}>
          <Spacer />
          <Flex row>
            {i === 0 ? (
              <Icon
                name={IconTypes.CORRECT}
                color={__ALERTS.SUCCESS}
                size={ICON_SIZE}
              />
            ) : (
              <Icon
                name={IconTypes.WRONG}
                color={__ALERTS.ERROR}
                size={ICON_SIZE}
              />
            )}
            <Spacer />
            <Medium size={'l'} block>
              {a.label}
            </Medium>
          </Flex>
        </React.Fragment>
      ))}
      <Spacer x2 />
      <Medium size={'xl'} block>
        Merkleroot
      </Medium>
      <Light size={'l'} block>
        {lastMerkleRoot
          ? `Last Update on Blockchain: ${formatDistanceToNow(
              lastMerkleRoot
            )} ago`
          : 'No Update on Blockchain found.'}
      </Light>
      <Spacer x2 />
      <Button onClick={setMerkleRoot}>Update Merkleroot</Button>
    </PageContainer>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <Web3Layout>{page}</Web3Layout>;
};

export const getServerSideProps: GetServerSideProps<
  any,
  {address: string; quizId: string},
  any
> = async ({params}) => {
  const quizId = params?.quizId;
  const address = params?.address;

  if (!quizId || !address) {
    return {
      redirect: {
        destination: '/learn',
        permanent: false
      }
    };
  }

  const ref = doc(db, 'quiz', quizId) as DocumentReference<Quiz>;
  const docSnap = await getDoc<Quiz>(ref);
  const data = docSnap.data();

  if (!data || data.ownerAddress !== address) {
    return {
      redirect: {
        destination: '/learn',
        permanent: false
      }
    };
  }

  return {
    props: {
      quiz: data
    }
  };
};

export default Index;
