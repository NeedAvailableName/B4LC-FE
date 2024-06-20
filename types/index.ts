export interface ICommodity {
  description: string;
  quantity: string;
  unit: number;
}
export interface IShipmentInformation {
  from: string;
  to: string;
  partialShipment: boolean;
  transhipment: boolean;
  latestShipmentDate: string;
}
export interface IRequiredDocument {
  invoice: boolean;
  bill_of_exchange: boolean;
  bill_of_lading: boolean;
  quantity_quanlity_certificate: boolean;
  certificate_of_origin: boolean;
  insurance: boolean;
  package_list: boolean;
}
export interface ISalesContract {
  importerName: string;
  importerAddress: string;
  exporterName: string;
  exporterAddress: string;
  issuingBankName: string;
  issuingBankAddress: string;
  advisingBankName: string;
  advisingBankAddress: string;
  price: string;
  currency: string;
  paymentMethod: string;
  deadline: string;
  commodity: ICommodity[];
  shipmentInformation: IShipmentInformation;
  requiredDocument: IRequiredDocument;
  additionalInfo: string;
  status: string;
  token: string;
}
export interface ILetterOfCredit {}
export interface IUser {
  username?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  role?: string;
}
export interface IDocument {
  invoice: {
    status: string;
    file_path: string;
    table: Array<Object>;
    from_name: string;
    from_address: string;
    from_phone: string;
    from_fax: string;
    title: string;
    no: string;
    date: string;
    consignee: string;
    notify_party_name: string;
    notify_address_name: string;
    notify_party_phone: string;
    notify_party_fax: string;
    lc_no: string;
    transport: string;
    transport_no: string;
    bill_no: string;
    cont_seal_no: string;
    from: string;
    to: string;
  };
  billOfExchange: {};
  billOfLading: {};
  quantityQualityCertificate: {};
  certificateOfOrigin: {};
  insurance: {};
  packageList: {};
}
