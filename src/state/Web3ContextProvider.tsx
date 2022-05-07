import {Web3Provider} from '@ethersproject/providers';
import {Web3ReactProvider} from '@web3-react/core';
import React from 'react';

function getLibrary(provider: any) {
  return new Web3Provider(provider);
}

const Web3ContextProvider: React.FC = ({children}) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
  );
};

export default Web3ContextProvider;
