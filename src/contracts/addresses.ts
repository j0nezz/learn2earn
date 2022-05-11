import {ContractAddress} from '../helpers/types/ContractAddress';
import {useContract} from '../hooks/useContract';
import {SupportedChainId} from './chains';
import Erc20ABI from './erc20.json';
import DistributorABI from './quiz-distributor.json';
import {Erc20, QuizDistributor} from './types';

export const DISTRIBUTOR_CONTRACT: ContractAddress = {
  [SupportedChainId.ROPSTEN]: '0x30195a222233081dca6d0dc4dcc09fb01fabb426'
};

export function useErc20(token: ContractAddress) {
  return useContract<Erc20>(token, Erc20ABI);
}

export function useQuizDistributor() {
  return useContract<QuizDistributor>(DISTRIBUTOR_CONTRACT, DistributorABI);
}
