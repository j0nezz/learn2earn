import {ContractAddress} from '../helpers/types/ContractAddress';
import {useContract} from '../hooks/useContract';
import {SupportedChainId} from './chains';
import Erc20ABI from './erc20.json';
import {Erc20} from './types';

export const DISTRIBUTOR_CONTRACT: ContractAddress = {
  [SupportedChainId.ROPSTEN]: '0x418fa747f875ab5bb07c7645c53bc05cd1c4ffea'
};

export function useErc20(token: ContractAddress) {
  return useContract<Erc20>(token, Erc20ABI);
}
