import {useCallback, useEffect, useState} from 'react';
import {useErc20} from '../contracts/addresses';
import {SupportedChainId} from '../contracts/chains';

export const useErc20Decimals = (ropstenContractAddress: string) => {
  const [decimals, setDecimals] = useState<number | null>(null);
  const contract = useErc20({
    [SupportedChainId.ROPSTEN]: ropstenContractAddress
  });

  const fetchDecimals = useCallback(async () => {
    if (!contract) return;
    const d = await contract.decimals();
    setDecimals(d);
  }, [contract]);

  useEffect(() => {
    fetchDecimals();
  }, [fetchDecimals]);

  return decimals
};
