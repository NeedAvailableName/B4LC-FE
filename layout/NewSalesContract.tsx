import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import AppSelect from '../components/AppSelect';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AppRadio from '../components/AppRadio';
import AppSelectDate from '../components/AppSelectDate';
import AppCheckBox from '../components/AppCheckBox';
import AppButton from '../components/AppButton';
import {
  useFieldArray,
  useForm,
  Controller,
  SubmitHandler,
  FormProvider,
} from 'react-hook-form';
import AppCommodityBox from '../components/AppCommodityBox';
import AppTextInput from '../components/AppTextInput';
import dayjs from 'dayjs';
import { cleanObject } from '../helpers/check';
import Checkbox from '@mui/material/Checkbox';

export default function NewSalesContract() {
  const { handleSubmit, control } = useForm();
  const documentRequired = [
    {
      label: 'Invoice',
      name: 'documentRequired.invoice',
    },
    {
      label: 'Bill of Exchange',
      name: 'documentRequired.bill_of_exchange',
    },
    {
      label: 'Bill of Lading',
      name: 'documentRequired.bill_of_lading',
    },
    {
      label: 'Quality/Quantity Certificate',
      name: 'documentRequired.quantity_quality_certificate',
    },
    {
      label: 'Certificate of Origin',
      name: 'documentRequired.certificate_of_origin',
    },
    {
      label: 'Insurance',
      name: 'documentRequired.insurance',
    },
    {
      label: 'Package List',
      name: 'documentRequired.package_list',
    },
  ];
  const { data, status } = useSession();
  const [loading, setLoading] = useState<Boolean>(true);
  const [customerList, setCustomerList] = useState<string[]>([]);
  const [bankList, setBankList] = useState<string[]>([]);
  const [deadline, setDeadline] = useState();

  const getAllCustomer = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/user/customers', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data) {
        setCustomerList(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllBank = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/user/banks', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data) {
        setBankList(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCustomer();
    getAllBank();
  }, []);

  const methods = useForm();
  const commodityArray = useFieldArray({
    control: methods.control,
    name: 'commodity',
  });

  return (
    <div className="bg-gray-100">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit((data) => console.log('data: ', data))}>
          <Container className="columns-2 gap-10">
            <Box className="pt-5">
              <Typography className="font-serif ">Importer</Typography>
              <Controller
                control={control}
                name="importer"
                render={({ field }) => (
                  <AppSelect
                    label="Choose Importer"
                    elements={customerList}
                    field={field}
                  />
                )}
              />
            </Box>
            <Box className="pt-5">
              <Typography className="font-serif">Exporter</Typography>
              <AppSelect label="Choose Exporter" elements={customerList} />
            </Box>
            <Box className="pt-5">
              <Typography className="font-serif">Issuing Bank</Typography>
              <AppSelect label="Choose Issuing Bank" elements={bankList} />
            </Box>
            <Box className="pt-5">
              <Typography className="font-serif">Advising Bank</Typography>
              <AppSelect label="Choose Advising Bank" elements={bankList} />
            </Box>
          </Container>
          <Divider className="pt-5"></Divider>
          <Container className="">
            <Box className="pt-5">
              <Controller
                name="commodity"
                control={control}
                render={({ field }) => <AppCommodityBox />}
              />
            </Box>
            <Container className="columns-2 pt-5">
              <Typography className="font-serif">Payment Method</Typography>
              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <AppRadio elements={['Via Bank', 'Crypto']} />
                )}
              />
              <Typography className="font-serif">Deadline</Typography>
              {/* <AppSelectDate></AppSelectDate> */}
              <Controller
                control={control}
                name="deadline"
                render={({ field }) => <AppSelectDate field={field} />}
              />
            </Container>
          </Container>
          <Divider className=""></Divider>
          <Container className="font-serif pt-5">Document Required</Container>
          <Container className="columns-3">
            <FormGroup>
              {documentRequired.map((item) => (
                <Controller
                  name={item.name}
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label={item.label}
                      value={item.name}
                    />
                  )}
                />
              ))}
            </FormGroup>
          </Container>
          <Divider className="pt-5"></Divider>
          <Container className="pt-5">
            <Typography className="font-serif">Shipment Information</Typography>
            <Container className="columns-2">
              <div className="flex flex-col">
                {/* Add flex-col class */}
                <div>
                  <Typography className="font-serif">From:</Typography>
                  {/* <Controller
                    name="shipmentInfomation."
                    control={control}
                    render={({ field }) => <AppTextInput />}
                  /> */}
                </div>
                <div>
                  <Typography className="font-serif">To:</Typography>
                  {/* <AppTextInput /> */}
                </div>
              </div>
              <Typography className="font-serif">Partial shipment</Typography>
              <AppRadio elements={['Permitted', 'Prohibited']} />
              <Typography className="font-serif">Transhipment</Typography>
              <AppRadio elements={['Permitted', 'Prohibited']} />
            </Container>
          </Container>

          <Divider className="pt-5"></Divider>
          <Container className="pt-5">
            <Typography className="font-serif">
              Additional Information
            </Typography>
            
          </Container>
          <Container className="flex justify-center items-center">
            <AppButton title="Submit" />
            <input type="submit"></input>
          </Container>
        </form>
      </FormProvider>
    </div>
  );
}
