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
import AppCheckBox from '../components/AppCheckBox';
import AppButton from '../components/AppButton';
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
import { useRouter } from 'next/router';
import AppAlert from '../components/AppAlert';
import { ISalesContract } from '../types';

export default function UpdateSalesContract() {
  const { data, status } = useSession();
  const [loading, setLoading] = useState<Boolean>(false);
  const [customerList, setCustomerList] = useState<string[]>([]);
  const [bankList, setBankList] = useState<string[]>([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState();
  const router = useRouter();
  const { id } = router.query;

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

  const defaultFormData = async () => {
    try {
      const response = await axios.get(
        `${Configs.BASE_API}/salescontracts/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data?.address}`,
          },
        },
      );
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (status == 'authenticated' && id != null) {
      getAllCustomer();
      getAllBank();
      defaultFormData();
    }
  }, [status, id]);

  const [importer, setImporter] = useState('');
  const [exporter, setExporter] = useState('');
  const [issuingBank, setIssuingBank] = useState('');
  const [advisingBank, setAdvisingBank] = useState('');

  const handleImporterChange = (value) => {
    setImporter(value);
    setFormData((prevState) => ({
      // Update formData state
      ...prevState,
      importer: value,
    }));
  };
  const handleExporterChange = (value) => {
    setExporter(value);
    setFormData((prevState) => ({
      // Update formData state
      ...prevState,
      exporter: value,
    }));
  };
  const handleIssuingBankChange = (value) => {
    setIssuingBank(value);
    setFormData((prevState) => ({
      // Update formData state
      ...prevState,
      issuingBank: value,
    }));
  };
  const handleAdvisingBankChange = (value) => {
    setAdvisingBank(value);
    setFormData((prevState) => ({
      // Update formData state
      ...prevState,
      advisingBank: value,
    }));
  };

  const handleCommodityChange = (item) => {
    console.log('items: ', item);
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

  const handleCurrencyChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      currency: value,
    }));
  };

  const handlePaymentMethodChange = (value) => {
    setFormData((prevState) => ({
      // Update formData state
      ...prevState,
      paymentMethod: value,
    }));
  };
  const handleDeadlineChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      deadline: value,
    }));
  };
  const handleShipmentInforChange = (field: string, value) => {
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
      console.log('form data: ', formData);
      const token = tokenAddress.find(
        (token) => token.name === formData?.currency,
      );
      token
        ? formData?.token === token.address
        : formData?.token === '0x0000000000000000000000000000000000000000';
      const response = await axios.patch(
        `${Configs.BASE_API}/salescontracts/${id}`,
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
        window.location.href = '/sales-contracts';
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
          <CircularProgress />
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
                    className="bg-white max-w-sm"
                    placeholder={formData?.price}
                  />
                </div>
                <div>
                  <Typography>Currency</Typography>
                  {formData?.paymentMethod === 'Via Bank' && (
                    <AppSelect
                      elements={viaBankPaymentMethod}
                      onChange={handleCurrencyChange}
                    />
                  )}
                  {formData?.paymentMethod === 'Crypto' && (
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
                          checked={formData?.requiredDocument[item?.name]}
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
                      placeholder={formData?.shipmentInformation?.from}
                      onChange={(e) =>
                        handleShipmentInforChange('from', e.target.value)
                      }
                    />
                  </div>
                  <div className="m-2">
                    <AppTextInput
                      placeholder={formData?.shipmentInformation?.to}
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
                            checked={formData?.shipmentInformation[item.name]}
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
                    onChange={(value) =>
                      handleShipmentInforChange('latestShipmentDate', value)
                    }
                  />
                </Container>
              </Container>
              <Container className="pt-5">
                <Typography className="">Additional Information</Typography>
                <div className="justify-center w-3/4">
                  <AppTextInput
                    rows={3}
                    onChange={handleAdditionalInfoChange}
                    placeholder={formData?.additionalInfo}
                  />
                </div>
              </Container>
              <div className="m-5 rounded-2xl justify-center flex">
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                  type="submit"
                >
                  Update Sales Contract
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </Layout>
  );
}
