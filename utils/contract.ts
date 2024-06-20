import ContractAbi from '../constants/TradeFinanceFactory.json';
import TokenAbi from '../constants/ERC20.json';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../app-configs/index';

export async function getContract() {
  let signer;
  let provider;
  if (window.ethereum == null) {
    provider = ethers.getDefaultProvider();
  } else {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
  }
  let contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi, signer);
  return contract;
}

export async function getTokenContract(token: string) {
  let signer;
  let provider;
  if (window.ethereum == null) {
    provider = ethers.getDefaultProvider();
  } else {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
  }
  let contract = new ethers.Contract(token, TokenAbi, signer);
  return contract;
}
