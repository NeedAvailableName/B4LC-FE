export const Configs = {
  BASE_URL: 'http://localhost:3000',
  PROD_URL: '',
  BASE_API: 'http://localhost:8000',
  PROD_API: 'https://backend-bubm.onrender.com',
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
export enum SALES_CONTRACT_STATUS {
  CREATED = 'created',
  EXPORTER_APPROVED = 'exporter_approved',
  BANK_APPROVED = 'bank_approved',
  ENDED = 'ended',
}
export enum LETTER_OF_CREDIT_STATUS {
  CREATED = 'created',
  ADVISING_BANK_REJECTED = 'advising_bank_rejected',
  ADVISING_BANK_APPROVED = 'advising_bank_approved',
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_APPROVED = 'document_approved',
  DOCUMENT_REJECTED = 'document_rejected',
  DELIVERY_SENT = 'delivery_sent',
  DELIVERY_RECEIVED = 'delivery_received',
  FUND_ESCROWED = 'fund_escrowed',
  FUND_REVERTED = 'fund_reverted',
  FUND_PAID = 'fund_paid',
  ENDED = 'ended',
}

export const UPDATE_LETTER_OF_CREDIT_STATUS: string[] = [
  'delivery_sent',
  'delivery_received',
  'fund_escrowed',
  'fund_reverted',
  'fund_paid',
];

export enum DOCUMENT_STATUS {
  USER_UPLOADED = 'user_uploaded',
  APRROVED = 'approved',
  REJECTED = 'rejected',
  BLOCKCHAIN_UPLOADED = 'blockchain_uploaded',
}

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
