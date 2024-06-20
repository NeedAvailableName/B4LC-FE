import { gql } from '@apollo/client';

export const GET_CREATE_LC_EVENT = gql`
  query createLetterOfCredits($where: CreateLetterOfCredit_filter) {
    createLetterOfCredits(
      orderBy: blockTimestamp
      orderDirection: desc
      where: $where
      first: 1
    ) {
      TradeFinanceAddress
      importer
      exporter
      issuingBank
      advisingBank
    }
  }
`;

export const GET_CONTRACT_DETAIL = gql`
  query contractDetail(
    $TradeFinanceAddress: Bytes = ""
    $TradeFinanceAddress1: Bytes = ""
  ) {
    lcActors(where: { TradeFinanceAddress: $TradeFinanceAddress }) {
      TradeFinanceAddress
      advisingBank
      exporter
      importer
      issuingBank
      blockTimestamp
    }
    lcInformations(where: { TradeFinanceAddress: $TradeFinanceAddress1 }) {
      TradeFinanceAddress
      activate
      addtionalInfo
      blockTimestamp
      commodity {
        description
        quantity
        unit
      }
      deadline
      documentHash
      paymentMethod
      price
      shipmentInformation {
        from
        latestShipmentDate
        partialShipment
        to
        transhipment
      }
      status
      token
    }
  }
`;

export const GET_CONTRACT_ACTIVITIES = gql`
  query contractActivities($TradeFinanceAddress: Bytes = "") {
    approveLetterOfCredits(
      where: { TradeFinanceAddress: $TradeFinanceAddress }
    ) {
      TradeFinanceAddress
      transactionHash
      blockTimestamp
    }
    rejectLetterOfCredits(
      where: { TradeFinanceAddress: $TradeFinanceAddress }
    ) {
      TradeFinanceAddress
      transactionHash
      blockTimestamp
    }
    documentUploadeds(where: { TradeFinanceAddress: $TradeFinanceAddress }) {
      TradeFinanceAddress
      documentHash
      transactionHash
      blockTimestamp
    }
  }
`;

export const GET_CONTRACT_PAYMENT = gql`
  query contractPayment($TradeFinanceAddress: Bytes = "") {
    fundEscroweds(where: { TradeFinanceAddress: $TradeFinanceAddress }) {
      TradeFinanceAddress
      value
      importer
      issuingBank
      transactionHash
      blockTimestamp
    }
    fundPaids(where: { TradeFinanceAddress: $TradeFinanceAddress }) {
      TradeFinanceAddress
      issuingBank
      exporter
      transactionHash
      blockTimestamp
    }
    fundRefundeds(where: { TradeFinanceAddress: $TradeFinanceAddress }) {
      TradeFinanceAddress
      issuingBank
      importer
      transactionHash
      blockTimestamp
    }
  }
`;
