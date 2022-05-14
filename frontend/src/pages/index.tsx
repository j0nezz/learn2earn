import {NextPage} from 'next';
import Link from 'next/link';
import React from 'react';
import {Background} from '../components/ui/background';
import {Button} from '../components/ui/Button';
import {Title} from '../components/ui/title';

const Home: NextPage = () => {
  return (
    <Background>
      <Title>Learn 2 Earn</Title>
      <Link href={'/learn'} passHref>
        <a>
          <Button>Enter App</Button>
        </a>
      </Link>
    </Background>
  );
};

export default Home;
