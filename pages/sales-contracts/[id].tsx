import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import {
  SALES_CONTRACT_STATUS,
  SALES_CONTRACT_STATUS_CONFIG,
} from '../../app-configs';
import ApolloClient from '../../clients/apollo';
import AppAlert from '../../components/AppAlert';
import AppRejectModal from '../../components/AppRejectModal';
import Layout from '../../layout';
import { GET_CREATE_LC_EVENT } from '../../queries';
import { ISalesContract } from '../../types';
import { api } from '../../utils/api';
import { getContract } from '../../utils/contract';

export default function SalesContractDetail() {
  const [curSalesContract, setCurSalesContract] = useState<ISalesContract>();
  const { data, status } = useSession();
  const userAddress = data?.address;
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const closeRef = useRef();

  const createLcContract = async () => {
    try {
      const contract = await getContract();
      const newLC = {
        importer: curSalesContract?.importerAddress ?? '',
        exporter: curSalesContract?.exporterAddress ?? '',
        issuingBank: curSalesContract?.issuingBankAddress ?? '',
        advisingBank: curSalesContract?.advisingBankAddress ?? '',
        commodity: curSalesContract?.commodity ?? [
          {
            description: '',
            quantity: '',
            unit: 0,
          },
        ],
        price: curSalesContract?.price ?? '',
        currency: curSalesContract?.currency ?? '',
        paymentMethod: curSalesContract?.paymentMethod ?? '',
        additionalInfo: curSalesContract?.additionalInfo ?? '',
        deadline: parseInt(curSalesContract?.deadline) ?? 0,
        shipmentInformation: curSalesContract?.shipmentInformation ?? {
          from: '',
          to: '',
          partialShipment: false,
          transhipment: false,
          latestShipmentDate: 0,
        },
        token:
          curSalesContract?.token ??
          '0x0000000000000000000000000000000000000000',
      };
      const tx = await contract.createLetterOfCredit(newLC);
      return await tx.wait();
    } catch (e) {
      setError(e.message);
      console.log('e: ', e.message);
    }
  };
  const createLC = async () => {
    try {
      setLoading(true);
      const tx = await createLcContract();
      if (tx) {
        let address = '';
        ApolloClient.query({
          query: GET_CREATE_LC_EVENT,
          variables: {
            where: {
              importer: curSalesContract?.importerAddress ?? '',
              exporter: curSalesContract?.exporterAddress ?? '',
              issuingBank: curSalesContract?.issuingBankAddress ?? '',
              advisingBank: curSalesContract?.advisingBankAddress ?? '',
            },
          },
          fetchPolicy: 'network-only',
        })
          .then(async ({ data }) => {
            address = data?.createLetterOfCredits[0]?.TradeFinanceAddress;
            if (address) {
              const response = await api.post(
                `/letterofcredits/create`,
                { salesContractID: id, address: address },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userAddress}`,
                  },
                },
              );
              if (response.data) {
                setLoading(false);
                setSuccess(response.data.message);
                router.push('/letter-of-credits');
              }
            }
          })
          .catch((err) => {
            setLoading(false);
            setError(err.message);
            console.log(err);
          });
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.log('e', e);
      setError(e.message);
    }
  };
  const approveSalesContract = async () => {
    try {
      const response = await api.patch(
        `/salescontracts/${id}/approve`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data?.address}`,
          },
        },
      );
      if (response.data) {
        setSuccess(response.data.message);
        getSalesContractDetail();
      }
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  };

  const rejectSalesContract = async (reason) => {
    try {
      setLoading(true);
      const response = await api.patch(
        `/salescontracts/${id}/reject`,
        { reason: reason },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data?.address}`,
          },
        },
      );
      if (response.data) {
        setLoading(false);
        setSuccess(response.data.message);
        getSalesContractDetail();
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
      setError(e.message);
    }
  };

  const getSalesContractDetail = async () => {
    try {
      const response = await api.get(`/salescontracts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
        setCurSalesContract(response.data);
      }
    } catch (err) {
      console.log(err);
      setError(e.message);
    }
  };

  const deleteSalesContract = async () => {
    try {
      const response = await api.delete(`/salescontracts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
        setSuccess(response.data.message);
        router.push(`/sales-contracts`);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (status == 'authenticated' && id != null) getSalesContractDetail();
  }, [status, id]);

  return (
    <Layout>
      {loading ? (
        <div className="bg-[#F4F7FF] m-5 h-dvh flex items-center justify-center rounded-2xl">
          <CircularProgress />
        </div>
      ) : (
        <>
          {error && <AppAlert severity="error" message={error} />}
          {success && <AppAlert severity="success" message={success} />}
          <div className="bg-[#F4F7FF] m-5 rounded-2xl flex">
            <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
              <Grid item xs={12}>
                <Typography className="font-semibold">
                  Sales contract actors
                </Typography>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ width: '60', whiteSpace: 'nowrap' }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Importer
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {curSalesContract?.importerName}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Exporter
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {curSalesContract?.exporterName}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Issuing Bank
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {curSalesContract?.issuingBankName}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Advising Bank
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {curSalesContract?.advisingBankName}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
              <Grid item xs={12}>
                <Typography className="font-semibold">
                  Commodity related information
                </Typography>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ width: '60', whiteSpace: 'nowrap' }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Price
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {curSalesContract?.price}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Currency
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {curSalesContract?.currency}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Payment method
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {curSalesContract?.paymentMethod}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Deadline
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {new Date(
                            parseInt(curSalesContract?.deadline),
                          ).toDateString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </div>
          <div className="bg-[#F4F7FF] m-5 rounded-2xl flex">
            <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
              <Grid item xs={12}>
                <Typography className="font-semibold">
                  Commodity information
                </Typography>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ width: '60', whiteSpace: 'nowrap' }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '60%' }}>Description</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Unit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {curSalesContract?.commodity?.map((item) => (
                        <TableRow
                          key={item.description}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {item?.description}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item?.quantity}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item?.unit}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </div>
          <div className="bg-[#F4F7FF] m-5 rounded-2xl flex">
            <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
              <Grid item xs={12}>
                <Typography className="font-semibold">
                  Required document
                </Typography>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ width: '60', whiteSpace: 'nowrap' }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      {Object.entries(
                        curSalesContract?.requiredDocument ?? [],
                      ).map(([item, value]) => (
                        <TableRow
                          key={item}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <FormControlLabel
                              key={item}
                              control={<Checkbox checked={value} name={item} />}
                              label={item}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
              <Grid item xs={12}>
                <Typography className="font-semibold">
                  Shipment information
                </Typography>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ width: '60', whiteSpace: 'nowrap' }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          From
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {curSalesContract?.shipmentInformation?.from}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          To
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {curSalesContract?.shipmentInformation?.to}
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Partial shipment
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {
                            curSalesContract?.shipmentInformation
                              ?.partialShipment
                          }
                          <FormControlLabel
                            key={undefined}
                            control={
                              <Checkbox
                                checked={
                                  curSalesContract?.shipmentInformation
                                    ?.partialShipment ?? false
                                }
                              />
                            }
                            label={undefined}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Transhipment
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {curSalesContract?.shipmentInformation?.transhipment}
                          <FormControlLabel
                            key={undefined}
                            control={
                              <Checkbox
                                checked={
                                  curSalesContract?.shipmentInformation
                                    ?.transhipment ?? false
                                }
                              />
                            }
                            label={undefined}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          Lastest shipment date
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {new Date(
                            parseInt(
                              curSalesContract?.shipmentInformation
                                ?.latestShipmentDate,
                            ),
                          ).toDateString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Typography className="font-semibold">
                  Additional Information
                </Typography>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ width: '60', whiteSpace: 'nowrap' }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {curSalesContract?.additionalInfo}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Typography className="font-semibold">Status</Typography>
                <Tooltip
                  title={
                    SALES_CONTRACT_STATUS_CONFIG[curSalesContract?.status]?.hint
                  }
                  placement="right"
                >
                  <div
                    style={{
                      backgroundColor:
                        SALES_CONTRACT_STATUS_CONFIG[curSalesContract?.status]
                          ?.bgColor,
                      color:
                        SALES_CONTRACT_STATUS_CONFIG[curSalesContract?.status]
                          ?.color,
                      padding: '8px 10px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      width: 'fit-content',
                    }}
                  >
                    {
                      SALES_CONTRACT_STATUS_CONFIG[curSalesContract?.status]
                        ?.title
                    }
                  </div>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
          <div className="m-5 rounded-2xl justify-center flex">
            {/* importer edit the salescontracts */}
            {data?.address == curSalesContract?.importerAddress &&
              curSalesContract?.status !=
                SALES_CONTRACT_STATUS.BANK_APPROVED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5"
                  onClick={() => router.push(`/sales-contracts/update/${id}`)}
                >
                  Update sales contract
                </Button>
              )}
            {data?.address == curSalesContract?.importerAddress &&
              curSalesContract?.status !=
                SALES_CONTRACT_STATUS.BANK_APPROVED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5"
                  onClick={() => deleteSalesContract()}
                >
                  Delete sales contract
                </Button>
              )}
            {data?.address == curSalesContract?.exporterAddress &&
              curSalesContract?.status !=
                SALES_CONTRACT_STATUS.EXPORTER_APPROVED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5"
                  onClick={() => approveSalesContract()}
                >
                  Approve sales contract
                </Button>
              )}
            {data?.address == curSalesContract?.exporterAddress &&
              (curSalesContract?.status == SALES_CONTRACT_STATUS.CREATED ||
                curSalesContract?.status == SALES_CONTRACT_STATUS.UPDATED) && (
                <AppRejectModal
                  onConfirm={(reason) => rejectSalesContract(reason)}
                  confirmText="Confirm"
                  cancelText="Cancel"
                  triggerBtn={
                    <Button className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5">
                      Reject sales contract
                    </Button>
                  }
                  closeRef={closeRef}
                  title="Rejected reason"
                ></AppRejectModal>
              )}
            {data?.address == curSalesContract?.issuingBankAddress &&
              curSalesContract?.status ==
                SALES_CONTRACT_STATUS.EXPORTER_APPROVED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                  onClick={createLC}
                >
                  Create Letter Of Credit
                </Button>
              )}
          </div>
        </>
      )}
    </Layout>
  );
}
