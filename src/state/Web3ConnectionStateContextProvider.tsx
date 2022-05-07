import React, {createContext, useContext, useState} from 'react';

type ContextType = {
  tried: boolean;
  setTried: (b: boolean) => void;
};

const contextInitialValue: ContextType = {
  tried: false,
  setTried: () => null
};

const Web3ConnectionStateContext =
  createContext<ContextType>(contextInitialValue);

export const Web3ConnectionStateContextProvider: React.FC = ({children}) => {
  const [tried, setTried] = useState(false);

  return (
    <Web3ConnectionStateContext.Provider
      value={{
        tried,
        setTried
      }}
    >
      {children}
    </Web3ConnectionStateContext.Provider>
  );
};

export function useWeb3ConnectionState(): ContextType {
  return useContext(Web3ConnectionStateContext);
}
