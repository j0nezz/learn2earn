import {ContractAddress} from '../helpers/types/ContractAddress';
import {useContract} from '../hooks/useContract';
import {SupportedChainId} from './chains';
import Erc20ABI from './erc20.json';
import {Erc20} from './types';

export const DISTRIBUTOR_CONTRACT: ContractAddress = {
  [SupportedChainId.ROPSTEN]: '0xB7ca508c83defd59eEc051003Ba1A97dDFF36b66'
};

export function useErc20(token: ContractAddress) {
  return useContract<Erc20>(token, Erc20ABI);
}
