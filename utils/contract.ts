import ContractAbi from '../constants/TradeFinanceFactory.json';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../app-configs/index';

export default async function getContract() {
  let signer;
  let provider;
  if (window.ethereum == null) {
    provider = ethers.getDefaultProvider();
  } else {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
  }
  let contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ContractAbi.abi,
    signer,
  );
  return contract;
}