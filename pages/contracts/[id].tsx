import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ethers } from 'ethers';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  BLOCKCHAIN_SCAN_URL,
  IPFS_URL,
  LETTER_OF_CREDIT_STATUS_CONFIG,
} from '../../app-configs';
import ApolloClient from '../../clients/apollo';
import AppAlert from '../../components/AppAlert';
import Layout from '../../layout';
import {
  GET_CONTRACT_ACTIVITIES,
  GET_CONTRACT_DETAIL,
  GET_CONTRACT_PAYMENT,
  GET_LC_STATUS_CHANGED,
} from '../../queries';

export default function ContractDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [curLC, setcurLC] = useState();
  const [LcStatus, setLcStatus] = useState('');
  const [LcActivities, setLcActivities] = useState();
  const [LcPayment, setLcPayment] = useState();
  const [error, setError] = useState(null);
  const { data, status } = useSession();
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    ApolloClient.query({
      query: GET_CONTRACT_DETAIL,
      variables: {
        TradeFinanceAddress: id,
        TradeFinanceAddress1: id,
      },
      fetchPolicy: 'network-only',
    })
      .then(({ data }) => {
        setcurLC(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchLcActivities = () => {
    setLoading(true);
    ApolloClient.query({
      query: GET_CONTRACT_ACTIVITIES,
      variables: {
        TradeFinanceAddress: id,
      },
      fetchPolicy: 'network-only',
    })
      .then(({ data }) => {
        setLcActivities(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchLcPayment = () => {
    setLoading(true);
    ApolloClient.query({
      query: GET_CONTRACT_PAYMENT,
      variables: {
        TradeFinanceAddress: id,
      },
      fetchPolicy: 'network-only',
    })
      .then(({ data }) => {
        setLcPayment(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (status == 'authenticated' && id != null) {
      fetchData();
      fetchLcActivities();
      fetchLcPayment();
    }
  }, [status, id]);

  return (
    <Layout>
      {loading ? (
        <div className="bg-slate-50 m-5 h-dvh flex items-center justify-center rounded-2xl">
          <CircularProgress />
        </div>
      ) : (
        <>
          {error && <AppAlert severity="error" message={error} />}
          {curLC?.lcActors?.map((item) => (
            <div className="bg-slate-50 m-5 rounded-2xl flex" key={item}>
              <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
                <Grid item xs={12}>
                  <Typography className="font-semibold">
                    Stakeholders
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
                            {item?.importer}
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
                            {item?.exporter}
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
                            {item?.issuingBank}
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
                            {item?.advisingBank}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </div>
          ))}
          {curLC?.lcInformations?.map((item) => (
            <>
              <div className="bg-slate-50 m-5 rounded-2xl flex">
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  className="m-3"
                >
                  <Grid item xs={12}>
                    <Typography className="font-semibold">
                      Contract detail
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
                              Contract address
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {item?.TradeFinanceAddress}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Contract status
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <Tooltip
                                title={
                                  LETTER_OF_CREDIT_STATUS_CONFIG[item?.status]
                                    ?.hint
                                }
                                placement="right"
                              >
                                <div
                                  style={{
                                    backgroundColor:
                                      LETTER_OF_CREDIT_STATUS_CONFIG[
                                        item?.status
                                      ]?.bgColor,
                                    color:
                                      LETTER_OF_CREDIT_STATUS_CONFIG[
                                        item?.status
                                      ]?.color,
                                    padding: '8px 10px',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    width: 'fit-content',
                                  }}
                                >
                                  {
                                    LETTER_OF_CREDIT_STATUS_CONFIG[item?.status]
                                      ?.title
                                  }
                                </div>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Additional Information
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {item?.addtionalInfo}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Created At
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Date(
                                parseInt(item?.blockTimestamp) * 1000,
                              ).toDateString()}
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
                                parseInt(item?.deadline),
                              ).toDateString()}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Document hash
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {item?.documentHash}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Payment Method
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {item?.paymentMethod}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Price
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {item?.price}
                            </TableCell>
                          </TableRow>
                          {item?.token && (
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                Token
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {item?.token}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </div>
              <div className="bg-slate-50 m-5 rounded-2xl flex">
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  className="m-3"
                >
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
                            <TableCell sx={{ width: '60%' }}>
                              Description
                            </TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Unit</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {item?.commodity?.map((value) => (
                            <TableRow
                              key={value}
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {value?.description}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {value?.quantity}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {value?.unit}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </div>
              <div className="bg-slate-50 m-5 rounded-2xl flex">
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  className="m-3"
                >
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
                              {item?.shipmentInformation?.from}
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
                              {item?.shipmentInformation?.to}
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
                              {item?.shipmentInformation?.partialShipment}
                              <FormControlLabel
                                key={undefined}
                                control={
                                  <Checkbox
                                    checked={
                                      item?.shipmentInformation
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
                              {item?.shipmentInformation?.transhipment}
                              <FormControlLabel
                                key={undefined}
                                control={
                                  <Checkbox
                                    checked={
                                      item?.shipmentInformation?.transhipment ??
                                      false
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
                                  item?.shipmentInformation?.latestShipmentDate,
                                ),
                              ).toDateString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </div>
            </>
          ))}
          {LcActivities?.approveLetterOfCredits?.map((item) => (
            <>
              <div className="bg-slate-50 m-5 rounded-2xl flex">
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  className="m-3"
                >
                  <Grid item xs={12}>
                    <Typography className="font-semibold">
                      L/C approvement
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
                              Transaction Hash
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <Tooltip title="View in Fantomscan">
                                <Link
                                  href={`${BLOCKCHAIN_SCAN_URL}/tx/${item?.transactionHash}`}
                                  target="_blank"
                                >
                                  {item?.transactionHash}
                                </Link>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Timestamp
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Date(
                                parseInt(item?.blockTimestamp) * 1000,
                              ).toDateString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </div>
            </>
          ))}
          {LcActivities?.rejectLetterOfCredits?.map((item) => (
            <>
              <div className="bg-slate-50 m-5 rounded-2xl flex">
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  className="m-3"
                >
                  <Grid item xs={12}>
                    <Typography className="font-semibold">
                      L/C rejection
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
                              Transaction Hash
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <Tooltip title="View in Fantomscan">
                                <Link
                                  href={`${BLOCKCHAIN_SCAN_URL}/tx/${item?.transactionHash}`}
                                  target="_blank"
                                >
                                  {item?.transactionHash}
                                </Link>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Timestamp
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Date(
                                parseInt(item?.blockTimestamp) * 1000,
                              ).toDateString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </div>
            </>
          ))}
          {LcActivities?.documentUploadeds?.map((item) => (
            <>
              <div className="bg-slate-50 m-5 rounded-2xl flex">
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  className="m-3"
                >
                  <Grid item xs={12}>
                    <Typography className="font-semibold">
                      L/C document uploaded
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
                              Transaction Hash
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <Tooltip title="View in Fantomscan">
                                <Link
                                  href={`${BLOCKCHAIN_SCAN_URL}/tx/${item?.transactionHash}`}
                                  target="_blank"
                                >
                                  {item?.transactionHash}
                                </Link>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Timestamp
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Date(
                                parseInt(item?.blockTimestamp) * 1000,
                              ).toDateString()}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Document hash
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <Tooltip title="View in IPFS">
                                <Link
                                  href={`${IPFS_URL}/${item?.documentHash}`}
                                  target="_blank"
                                >
                                  {item?.documentHash}
                                </Link>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </div>
            </>
          ))}
          {LcPayment?.fundEscroweds?.map((item) => (
            <>
              <div className="bg-slate-50 m-5 rounded-2xl flex">
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  className="m-3"
                >
                  <Grid item xs={12}>
                    <Typography className="font-semibold">
                      L/C Fund Escrowed
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
                              Transaction Hash
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <Tooltip title="View in Fantomscan">
                                <Link
                                  href={`${BLOCKCHAIN_SCAN_URL}/tx/${item?.transactionHash}`}
                                  target="_blank"
                                >
                                  {item?.transactionHash}
                                </Link>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Timestamp
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Date(
                                parseInt(item?.blockTimestamp) * 1000,
                              ).toDateString()}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              From
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {item?.importer}
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
                              {item?.issuingBank}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Value
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {ethers.formatEther(item?.value).toString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </div>
            </>
          ))}
          {LcPayment?.fundPaids?.map((item) => (
            <>
              <div className="bg-slate-50 m-5 rounded-2xl flex">
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  className="m-3"
                >
                  <Grid item xs={12}>
                    <Typography className="font-semibold">
                      L/C Fund Paid
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
                              Transaction Hash
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <Tooltip title="View in Fantomscan">
                                <Link
                                  href={`${BLOCKCHAIN_SCAN_URL}/tx/${item?.transactionHash}`}
                                  target="_blank"
                                >
                                  {item?.transactionHash}
                                </Link>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Timestamp
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Date(
                                parseInt(item?.blockTimestamp) * 1000,
                              ).toDateString()}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              From
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {item?.issuingBank}
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
                              {item?.exporter}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </div>
            </>
          ))}
          {LcPayment?.fundRefundeds?.map((item) => (
            <>
              <div className="bg-slate-50 m-5 rounded-2xl flex">
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  className="m-3"
                >
                  <Grid item xs={12}>
                    <Typography className="font-semibold">
                      L/C Escrow
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
                              Transaction Hash
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <Tooltip title="View in Fantomscan">
                                <Link
                                  href={`${BLOCKCHAIN_SCAN_URL}/tx/${item?.transactionHash}`}
                                  target="_blank"
                                >
                                  {item?.transactionHash}
                                </Link>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Timestamp
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Date(
                                parseInt(item?.blockTimestamp) * 1000,
                              ).toDateString()}
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              From
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {item?.issuingBank}
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
                              {item?.importer}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </div>
            </>
          ))}
          {LcActivities?.lcStatusChangeds?.map((item) => (
            <>
              <div className="bg-slate-50 m-5 rounded-2xl flex">
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={1}
                  className="m-3"
                >
                  <Grid item xs={12}>
                    <Typography className="font-semibold">
                      L/C status update
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
                              Transaction Hash
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <Tooltip title="View in Fantomscan">
                                <Link
                                  href={`${BLOCKCHAIN_SCAN_URL}/tx/${item?.transactionHash}`}
                                  target="_blank"
                                >
                                  {item?.transactionHash}
                                </Link>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              L/C status update
                            </TableCell>
                            <TableCell>
                              <Tooltip
                                title={
                                  LETTER_OF_CREDIT_STATUS_CONFIG[item?.status]
                                    ?.hint
                                }
                                placement="right"
                              >
                                <div
                                  style={{
                                    backgroundColor:
                                      LETTER_OF_CREDIT_STATUS_CONFIG[
                                        item?.status
                                      ]?.bgColor,
                                    color:
                                      LETTER_OF_CREDIT_STATUS_CONFIG[
                                        item?.status
                                      ]?.color,
                                    padding: '8px 10px',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    width: 'fit-content',
                                  }}
                                >
                                  {
                                    LETTER_OF_CREDIT_STATUS_CONFIG[item?.status]
                                      ?.title
                                  }
                                </div>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              Timestamp
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {new Date(
                                parseInt(item?.blockTimestamp) * 1000,
                              ).toDateString()}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </div>
            </>
          ))}
        </>
      )}
    </Layout>
  );
}
