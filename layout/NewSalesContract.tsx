import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from '@mui/material';
import AppSelect from '../components/AppSelect';
import AppRadio from '../components/AppRadio';
import AppSelectDate from '../components/AppSelectDate';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import AppCommodityBox from '../components/AppCommodityBox';
import AppTextInput from '../components/AppTextInput';
import {
  documentRequired,
  viaBankPaymentMethod,
  cryptoPaymentMethod,
  Configs,
  tokenAddress,
} from '../app-configs';
import CircularProgress from '@mui/material/CircularProgress';
import Layout from '.';
import { useFormControl, FormControl } from '@mui/material';
import AppAlert from '../components/AppAlert';
import { useRouter } from 'next/router';
import AppLoading from '../components/AppLoading';

export default function NewSalesContract() {
  const { data, status } = useSession();
  const router = useRouter();
  const formControl = useFormControl();
  const [loading, setLoading] = useState<Boolean>(false);
  const [customerList, setCustomerList] = useState<string[]>([]);
  const [bankList, setBankList] = useState<string[]>([]);
  const [deadline, setDeadline] = useState();

  const getAllCustomer = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(`${Configs.BASE_API}/user/customers`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data) {
        setCustomerList(response.data);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  const getAllBank = async () => {
    try {
      // setLoading(true);
      const response = await axios.get(`${Configs.BASE_API}/user/banks`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data) {
        setBankList(response.data);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCustomer();
    getAllBank();
  }, []);

  const [formData, setFormData] = useState({
    importer: '',
    exporter: '',
    issuingBank: '',
    advisingBank: '',
    commodity: [
      {
        description: '',
        quantity: '',
        unit: '',
      },
    ],
    price: '',
    currency: '',
    paymentMethod: '',
    requiredDocument: {
      bill_of_exchange: false,
      invoice: false,
      bill_of_lading: false,
      insurance: false,
      quantity_quality_certificate: false,
      certificate_of_origin: false,
      package_list: false,
    },
    additionalInfo: '',
    shipmentInformation: {
      from: '',
      to: '',
      partialShipment: false,
      transhipment: false,
      latestShipmentDate: '',
    },
    deadline: '',
    token: '',
  });

  const [importer, setImporter] = useState('');
  const [exporter, setExporter] = useState('');
  const [issuingBank, setIssuingBank] = useState('');
  const [advisingBank, setAdvisingBank] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleImporterChange = (value: string) => {
    setImporter(value);
    setFormData((prevState) => ({
      ...prevState,
      importer: value,
    }));
  };
  const handleExporterChange = (value: string) => {
    setExporter(value);
    setFormData((prevState) => ({
      ...prevState,
      exporter: value,
    }));
  };
  const handleIssuingBankChange = (value: string) => {
    setIssuingBank(value);
    setFormData((prevState) => ({
      ...prevState,
      issuingBank: value,
    }));
  };
  const handleAdvisingBankChange = (value: string) => {
    setAdvisingBank(value);
    setFormData((prevState) => ({
      ...prevState,
      advisingBank: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        name === 'importer' ? value : type === 'checkbox' ? checked : value,
    }));
  };

  const handleCommodityChange = (item) => {
    const commodity = item.map(({ id, ...rest }) => rest);
    setFormData((prevState) => ({
      ...prevState,
      commodity: commodity,
    }));
  };

  const handleDocumentChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      requiredDocument: {
        ...prevState.requiredDocument,
        [name]: checked,
      },
    }));
  };

  const handleAdditionalInfoChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      additionalInfo: e.target.value,
    }));
  };

  const handlePriceChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      price: e.target.value,
    }));
  };

  const handleCurrencyChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      currency: value,
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      paymentMethod: value,
    }));
  };
  const handleDeadlineChange = (value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      deadline: value,
    }));
  };
  const handleShipmentInforChange = (field: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      shipmentInformation: {
        ...prevState.shipmentInformation,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = tokenAddress.find(
        (token) => token.name === formData.currency,
      );
      token
        ? (formData.token = token.address)
        : (formData.token = '0x0000000000000000000000000000000000000000');
      const response = await axios.post(
        `${Configs.BASE_API}/salescontracts/create`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data?.address}`,
          },
        },
      );
      console.log(response.data);
      if (response.data) {
        setSuccess(response.data.message);
        router.push(`/sales-contracts/${response.data.salescontract_id}`);
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="bg-slate-50 m-5 h-dvh flex items-center justify-center rounded-2xl">
          <AppLoading wrapperStyle={{ width: '30px' }} />
        </div>
      ) : (
        <>
          {error && <AppAlert severity="error" message={error} />}
          {success && <AppAlert severity="success" message={success} />}
          <div className="bg-slate-50 m-5 rounded-2xl flex justify-center">
            <form onSubmit={handleSubmit}>
              <Container className="columns-2 gap-10">
                {/* Importer */}
                <Box className="pt-5">
                  <Typography className="">Importer</Typography>
                  <AppSelect
                    label="Choose Importer"
                    onChange={handleImporterChange}
                    name="importer"
                    elements={customerList}
                  />
                </Box>
                <Box className="pt-5">
                  <Typography className="">Exporter</Typography>
                  <AppSelect
                    label="Choose Exporter"
                    onChange={handleExporterChange}
                    name="exporter"
                    elements={customerList}
                  />
                </Box>
                <Box className="pt-5">
                  <Typography className="">Issuing Bank</Typography>
                  <AppSelect
                    label="Choose Issuing Bank"
                    onChange={handleIssuingBankChange}
                    name="issuingBank"
                    elements={bankList}
                  />
                </Box>
                <Box className="pt-5">
                  <Typography className="">Advising Bank</Typography>
                  <AppSelect
                    label="Choose Advising Bank"
                    onChange={handleAdvisingBankChange}
                    name="advisingBank"
                    elements={bankList}
                  />
                </Box>
              </Container>
              <Container className="">
                <Box className="pt-5">
                  <AppCommodityBox onChange={handleCommodityChange} />
                </Box>
              </Container>
              <Container className="pt-5 columns-3 grid grid-cols-4 gap-4">
                <div>
                  <Typography className="">Payment Method</Typography>
                  <AppRadio
                    elements={['Via Bank', 'Crypto']}
                    onChange={handlePaymentMethodChange}
                  />
                </div>
                <div>
                  <Typography className="">Commodity value</Typography>
                  <AppTextInput
                    onChange={handlePriceChange}
                    label="Commodity value"
                    className="bg-white max-w-sm"
                  />
                </div>
                <div>
                  <Typography>Currency</Typography>
                  {formData.paymentMethod === 'Via Bank' && (
                    <AppSelect
                      elements={viaBankPaymentMethod}
                      onChange={handleCurrencyChange}
                    />
                  )}
                  {formData.paymentMethod === 'Crypto' && (
                    <AppSelect
                      elements={cryptoPaymentMethod}
                      onChange={handleCurrencyChange}
                    />
                  )}
                </div>
                <div>
                  <Typography className="">Deadline</Typography>
                  <AppSelectDate
                    onChange={handleDeadlineChange}
                  ></AppSelectDate>
                </div>
              </Container>
              <Divider className="pt-5" />
              <Container className="pt-5">Document Required</Container>
              <Container className="columns-3">
                <FormGroup>
                  {documentRequired.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={formData.requiredDocument[item.name]}
                          onChange={handleDocumentChange}
                          name={item.name}
                        />
                      }
                      label={item.label}
                    />
                  ))}
                </FormGroup>
              </Container>
              <Divider className="pt-5" />
              <Container className="pt-5">
                <Typography className="">Shipment Information</Typography>
                <Container className="columns-2">
                  <div className="m-2">
                    <AppTextInput
                      placeholder="From"
                      onChange={(e) =>
                        handleShipmentInforChange('from', e.target.value)
                      }
                    />
                  </div>
                  <div className="m-2">
                    <AppTextInput
                      placeholder="To"
                      onChange={(e) =>
                        handleShipmentInforChange('to', e.target.value)
                      }
                    />
                  </div>
                  <FormGroup>
                    {[
                      { name: 'transhipment', label: 'Transhipment' },
                      { name: 'partialShipment', label: 'Partial Shipment' },
                    ].map((item, index) => (
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            checked={formData.shipmentInformation[item.name]}
                            onChange={(e) =>
                              handleShipmentInforChange(
                                item.name,
                                e.target.checked,
                              )
                            }
                            name={item.name}
                          />
                        }
                        label={item.label}
                      />
                    ))}
                  </FormGroup>
                  <Typography className="">Latest shipment date</Typography>
                  <AppSelectDate
                    onChange={(value: string) =>
                      handleShipmentInforChange('latestShipmentDate', value)
                    }
                  />
                </Container>
              </Container>
              <Container className="pt-5">
                <Typography className="">Additional Information</Typography>
                <div className="justify-center w-full">
                  <AppTextInput
                    rows={3}
                    onChange={handleAdditionalInfoChange}
                  />
                </div>
              </Container>
              <div className="m-5 rounded-2xl justify-center flex">
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                  type="submit"
                >
                  Create Sales Contract
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </Layout>
  );
}
