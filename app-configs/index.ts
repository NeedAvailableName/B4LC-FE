export const Configs = {
  BASE_URL: 'http://localhost:3000',
  BASE_API: 'http://localhost:8000',
  OCR_API: 'https://ocr-template.onrender.com',
};
export const TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const viaBankPaymentMethod = ['USD', 'EUR'];
export const cryptoPaymentMethod = ['USDC', 'LINK', 'NEAR', 'MATIC', 'FTMT'];
export enum UserRole {
  CUSTOMER = 'user',
  BANK = 'bank',
}
export const tokenAddress = [
  {
    name: 'USDC',
    address: '0x0000000000000000000000000000000000000000',
  },
  {
    name: 'LINK',
    address: '0x0000000000000000000000000000000000000000',
  },
  {
    name: 'NEAR',
    address: '0x0000000000000000000000000000000000000000',
  },
  {
    name: 'MATIC',
    address: '0x0000000000000000000000000000000000000000',
  },
  {
    name: 'FTMT',
    address: '0x83667ce18d343D26A664Fca2f9Cc95cf934A70Bf',
  },
];
export const documentRequired = [
  {
    label: 'Invoice',
    name: 'invoice',
  },
  {
    label: 'Bill of Exchange',
    name: 'bill_of_exchange',
  },
  {
    label: 'Bill of Lading',
    name: 'bill_of_lading',
  },
  {
    label: 'Quality/Quantity Certificate',
    name: 'quantity_quality_certificate',
  },
  {
    label: 'Certificate of Origin',
    name: 'certificate_of_origin',
  },
  {
    label: 'Insurance',
    name: 'insurance',
  },
  {
    label: 'Package List',
    name: 'package_list',
  },
];
export const CONTRACT_ADDRESS = '0xf2aF67510B5a7E58800babef50c40B3115b6Ea9A';
export const SUB_GRAPH_URL =
  'https://api.studio.thegraph.com/query/34554/b4lc-testv2/v0.1.1';

export enum PAYMENT_METHOD {
  VIA_BANK = 'Via bank',
  CRYPTO = 'Crypto',
}
export const SALES_CONTRACT_STATUS = {
  CREATED: 'created',
  EXPORTER_APPROVED: 'exporter_approved',
  EXPORTER_REJECTED: 'exporter_rejected',
  UPDATED: 'updated',
  BANK_APPROVED: 'bank_approved',
  ENDED: 'ended',
};

export const SALES_CONTRACT_STATUS_CONFIG = {
  [SALES_CONTRACT_STATUS.CREATED]: {
    title: 'Created',
    bgColor: '#BEEFFF',
    color: '#2194FF',
    hint: 'Wait for approvement',
  },
  [SALES_CONTRACT_STATUS.EXPORTER_APPROVED]: {
    title: 'Approved',
    bgColor: '#E6CCFF',
    color: '003994',
    hint: 'Exporter approved',
  },
  [SALES_CONTRACT_STATUS.EXPORTER_REJECTED]: {
    title: 'Rejected',
    bgColor: '#23262F',
    color: '#FCFCFD',
    hint: 'Exporter rejected',
  },
  [SALES_CONTRACT_STATUS.UPDATED]: {
    title: 'Updated',
    bgColor: '#0052CC',
    color: '#FFFFFF',
    hint: 'Importer update agreement',
  },
  [SALES_CONTRACT_STATUS.BANK_APPROVED]: {
    title: 'Bank approved',
    bgColor: '#DDECFF',
    color: '#00C7E6',
    hint: 'L/C created',
  },
  [SALES_CONTRACT_STATUS.ENDED]: {
    title: 'Ended',
    bgColor: '#58BD7D',
    color: '#FCFCFD',
    hint: 'L/C ended',
  },
};
export const LETTER_OF_CREDIT_STATUS = {
  CREATED: 'created',
  ADVISING_BANK_REJECTED: 'advising_bank_rejected',
  ADVISING_BANK_APPROVED: 'advising_bank_approved',
  DOCUMENT_UPLOADED: 'document_uploaded',
  DOCUMENT_APPROVED: 'document_approved',
  DOCUMENT_REJECTED: 'document_rejected',
  DELIVERY_SENT: 'delivery_sent',
  DELIVERY_RECEIVED: 'delivery_received',
  FUND_ESCROWED: 'fund_escrowed',
  FUND_REVERTED: 'fund_reverted',
  FUND_PAID: 'fund_paid',
  ENDED: 'ended',
};

export const LETTER_OF_CREDIT_STATUS_CONFIG = {
  [LETTER_OF_CREDIT_STATUS.CREATED]: {
    title: 'Created',
    bgColor: '#BEEFFF',
    color: '#2194FF',
    hint: 'Wait for approvement',
  },
  [LETTER_OF_CREDIT_STATUS.ADVISING_BANK_APPROVED]: {
    title: 'Approved',
    bgColor: '#E6CCFF',
    color: '#003994',
    hint: 'Advising bank approved',
  },
  [LETTER_OF_CREDIT_STATUS.ADVISING_BANK_REJECTED]: {
    title: 'Rejected',
    bgColor: '#23262F',
    color: '#FCFCFD',
    hint: 'Advising bank rejected',
  },
  [LETTER_OF_CREDIT_STATUS.DOCUMENT_UPLOADED]: {
    title: 'Doc uploaded',
    bgColor: '#0052CC',
    color: '#FFFFFF',
    hint: 'Document uploaded to blockchain',
  },
  [LETTER_OF_CREDIT_STATUS.DOCUMENT_APPROVED]: {
    title: 'Doc approved',
    bgColor: '#DDECFF',
    color: '#00C7E6',
    hint: 'Advising bank approved doc',
  },
  [LETTER_OF_CREDIT_STATUS.DOCUMENT_REJECTED]: {
    title: 'Doc rejected',
    bgColor: '#C8F8FF',
    color: '#0072FF',
    hint: 'Advising bank rejected doc',
  },
  [LETTER_OF_CREDIT_STATUS.DELIVERY_SENT]: {
    title: 'Delivery sent',
    bgColor: '#E6CCFF',
    color: '#6554C0',
    hint: 'Commodity exported',
  },
  [LETTER_OF_CREDIT_STATUS.DELIVERY_RECEIVED]: {
    title: 'Delivery received',
    bgColor: '#CFFFE0',
    color: '#00875A',
    hint: 'Commodity imported',
  },
  [LETTER_OF_CREDIT_STATUS.FUND_ESCROWED]: {
    title: 'Fund escrowed',
    bgColor: '#677feb',
    color: '#eb9367',
    hint: 'Importer escrowed',
  },
  [LETTER_OF_CREDIT_STATUS.FUND_PAID]: {
    title: 'Fund paid',
    bgColor: '#cd9dcf',
    color: '#8c83c7',
    hint: 'Exporter received the escrow',
  },
  [LETTER_OF_CREDIT_STATUS.FUND_REVERTED]: {
    title: 'Fund reverted',
    bgColor: '#23262F',
    color: '#FCFCFD',
    hint: 'Refunded to importer',
  },
  [LETTER_OF_CREDIT_STATUS.ENDED]: {
    title: 'Ended',
    bgColor: '#58BD7D',
    color: '#FCFCFD',
    hint: 'L/C ended',
  },
};

export const UPDATE_LETTER_OF_CREDIT_STATUS: string[] = [
  'delivery_sent',
  'delivery_received',
  'fund_escrowed',
  'fund_reverted',
  'fund_paid',
];

export const DOCUMENT_STATUS = {
  USER_UPLOADED: 'user_uploaded',
  APRROVED: 'approved',
  REJECTED: 'rejected',
  BLOCKCHAIN_UPLOADED: 'blockchain_uploaded',
};

export const DOCUMENT_STATUS_CONFIG = {
  [DOCUMENT_STATUS.USER_UPLOADED]: {
    title: 'Uploaded',
    bgColor: '#BEEFFF',
    color: '#2194FF',
    hint: 'Wait for approvement',
  },
  [DOCUMENT_STATUS.APRROVED]: {
    title: 'Approved',
    bgColor: '#E6CCFF',
    color: '#003994',
    hint: 'Bank approved',
  },
  [DOCUMENT_STATUS.REJECTED]: {
    title: 'Rejected',
    bgColor: '#23262F',
    color: '#FCFCFD',
    hint: 'Bank rejected',
  },
  [DOCUMENT_STATUS.BLOCKCHAIN_UPLOADED]: {
    title: 'Blockchain uploaded',
    bgColor: '#0052CC',
    color: '#FFFFFF',
    hint: 'Document uploaded to blockchain',
  },
};
export const BLOCKCHAIN_SCAN_URL = 'https://testnet.ftmscan.com';
export const IPFS_URL =
  'https://emerald-jittery-wallaby-389.mypinata.cloud/ipfs';
export const DEFAULT_DOCUMENT_FORM_DATA = [
  {
    label: 'Invoice',
    name: 'invoice',
    defaultFormData: {
      file_path: '',
      table: [],
      from_name: '',
      from_address: '',
      from_phone: '',
      from_fax: '',
      title: '',
      no: '',
      date: '',
      consignee: '',
      notify_party_address: '',
      notify_party_phone: '',
      notify_party_fax: '',
      lc_no: '',
      transport: '',
    },
  },
  {
    label: 'Bill of Exchange',
    name: 'bill_of_exchange',
  },
  {
    label: 'Bill of Lading',
    name: 'bill_of_lading',
  },
  {
    label: 'Quality/Quantity Certificate',
    name: 'quantity_quality_certificate',
  },
  {
    label: 'Certificate of Origin',
    name: 'certificate_of_origin',
  },
  {
    label: 'Insurance',
    name: 'insurance',
  },
  {
    label: 'Package List',
    name: 'package_list',
  },
];
