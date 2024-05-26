import axios from 'axios';
import Layout from '../../layout';
import { useSession } from 'next-auth/react';
import {
  Configs,
  LETTER_OF_CREDIT_STATUS,
  SALES_CONTRACT_STATUS,
} from '../../app-configs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import getContract from '../../utils/contract';
import { BLOCKCHAIN_SCAN_URL } from '../../app-configs';
import Link from 'next/link';
import AppAlert from '../../components/AppAlert';

export default function LetterOfCreditDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [curLC, setcurLC] = useState();
  const [error, setError] = useState(null);
  const { data, status } = useSession();
  console.log('data: ', data);
  const [loading, setLoading] = useState(false);

  const getLcDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Configs.BASE_API}/letterofcredits/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data?.address}`,
          },
        },
      );
      if (response.data) {
        setLoading(false);
        console.log('res: ', response.data);
        setcurLC(response.data);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (status == 'authenticated' && id != null) getLcDetail();
  }, [status, id]);

  return (
    <Layout>
      {loading ? (
        <div className="bg-slate-50 m-5 h-full flex items-center justify-center rounded-2xl">
          <CircularProgress />
        </div>
      ) : (
        <>
          {error && <AppAlert severity="error" message={error} />}
          <div className="bg-slate-50 m-5 rounded-2xl flex">
            <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
              <Grid item xs={12}>
                <Typography className="font-semibold">L/C Address</Typography>
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
                          <a
                            href={`${BLOCKCHAIN_SCAN_URL}/${curLC?.letterOfCredit?.LcAddress}`}
                            target="_blank"
                            className='text-blue-600'
                          >
                            {curLC?.letterOfCredit?.LcAddress}
                          </a>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Link href={`/contracts/${curLC?.letterOfCredit?.LcAddress}`}>View contract</Link>
              </Grid>
            </Grid>
            <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
              <Grid item xs={12}>
                <Typography className="font-semibold">Start date</Typography>
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
                          {curLC?.letterOfCredit?.startDate}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Typography className="font-semibold">Status</Typography>
                <Typography className="font-semibold text-blue-600">
                  {curLC?.letterOfCredit?.status}
                </Typography>
              </Grid>
            </Grid>
          </div>
          <div className="bg-slate-50 m-5 rounded-2xl flex">
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
                          {curLC?.salesContract?.importerName}
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
                          {curLC?.salesContract?.exporterName}
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
                          {curLC?.salesContract?.issuingBankName}
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
                          {curLC?.salesContract?.advisingBankName}
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
                          {curLC?.salesContract?.price}
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
                          {curLC?.salesContract?.currency}
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
                          {curLC?.salesContract?.paymentMethod}
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
                          {curLC?.salesContract?.deadlineInDate}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </div>
          <div className="bg-slate-50 m-5 rounded-2xl flex">
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
                      {curLC?.salesContract?.commodity?.map((item) => (
                        <TableRow
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
          <div className="bg-slate-50 m-5 rounded-2xl flex">
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
                        curLC?.salesContract?.requiredDocument ?? [],
                      ).map(([item, value]) => (
                        <TableRow
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
                          {curLC?.salesContract?.shipmentInformation?.from}
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
                          {curLC?.salesContract?.shipmentInformation?.to}
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
                            curLC?.salesContract?.shipmentInformation
                              ?.partialShipment
                          }
                          <FormControlLabel
                            key={undefined}
                            control={
                              <Checkbox
                                checked={
                                  curLC?.salesContract?.shipmentInformation
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
                          {
                            curLC?.salesContract?.shipmentInformation
                              ?.transhipment
                          }
                          <FormControlLabel
                            key={undefined}
                            control={
                              <Checkbox
                                checked={
                                  curLC?.salesContract?.shipmentInformation
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
                              curLC?.salesContract?.shipmentInformation
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
                          {curLC?.salesContract?.additionalInfo}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Typography className="font-semibold">Status</Typography>
                <Typography className="font-semibold text-blue-600">
                  {curLC?.salesContract?.status}
                </Typography>
              </Grid>
            </Grid>
          </div>
          <div className="m-5 rounded-2xl justify-center flex">
            {/* importer edit the salescontracts */}
            {data?.address == curLC?.importerAddress &&
              curLC?.status == SALES_CONTRACT_STATUS.CREATED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                  type="submit"
                >
                  Update sales contract
                </Button>
              )}
            {data?.address == curLC?.exporterAddress &&
              curLC?.status == SALES_CONTRACT_STATUS.CREATED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                  onClick={() => approveSalesContract()}
                >
                  Approve sales contract
                </Button>
              )}
            {data?.address == curLC?.issuingBankAddress &&
              curLC?.status == SALES_CONTRACT_STATUS.EXPORTER_APPROVED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                  onClick={creatLC}
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
