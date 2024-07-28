import {
  Button,
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
import { parseUnits } from 'ethers';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import {
  BLOCKCHAIN_SCAN_URL,
  CONTRACT_ADDRESS,
  LETTER_OF_CREDIT_STATUS,
  LETTER_OF_CREDIT_STATUS_CONFIG,
  PAYMENT_METHOD,
  SALES_CONTRACT_STATUS_CONFIG,
  UPDATE_LETTER_OF_CREDIT_STATUS_VIA_BANK,
  UPDATE_LETTER_OF_CREDIT_STATUS_VIA_CRYPTO,
} from '../../app-configs';
import AppAlert from '../../components/AppAlert';
import AppRejectModal from '../../components/AppRejectModal';
import AppSelectModal from '../../components/AppSelectModal';
import Layout from '../../layout';
import {
  ICommodity,
  IRequiredDocument,
  IShipmentInformation,
} from '../../types';
import { api } from '../../utils/api';
import { getContract, getTokenContract } from '../../utils/contract';
interface ILC {
  letterOfCredit?: {
    LcAddress: string;
    status: string;
    startDate: string;
    rejectedReason: string;
  };
  salesContract?: {
    importerName: string;
    importerAddress: string;
    exporterName: string;
    exporterAddress: string;
    issuingBankName: string;
    issuingBankAddress: string;
    advisingBankName: string;
    advisingBankAddress: string;
    commodity: ICommodity[];
    price: string;
    currency: string;
    paymentMethod: string;
    requiredDocument: IRequiredDocument;
    shipmentInformation: IShipmentInformation;
    additionalInfo: string;
    deadlineInDate: string;
    token: string;
    status: string;
  };
}
export default function LetterOfCreditDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [curLC, setcurLC] = useState<ILC>();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { data, status } = useSession();
  const [loading, setLoading] = useState(false);
  const closeRef = useRef();

  const escrowFund = async () => {
    try {
      setLoading(true);
      const tokenContract = await getTokenContract(curLC?.salesContract?.token);
      const tx = await tokenContract.approve(
        CONTRACT_ADDRESS,
        parseUnits(curLC?.salesContract.price, 18),
      );
      await tx.wait();
      if (tx) {
        const contract = await getContract();
        const tx = await contract.escrowFund(
          curLC?.letterOfCredit.LcAddress,
          parseUnits(curLC?.salesContract.price, 18),
        );
        await tx.wait();
        if (tx) {
          const response = await api.patch(
            `/letterofcredits/${id}/status`,
            { status: LETTER_OF_CREDIT_STATUS.FUND_ESCROWED },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${data?.address}`,
              },
            },
          );
          if (response) {
            setLoading(false);
            setSuccess(response.data.message);
            getLcDetail();
          }
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      setError(err.message);
    }
  };

  const payFund = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.payFund(curLC?.letterOfCredit.LcAddress);
      await tx.wait();
      if (tx) {
        const response = await api.patch(
          `/letterofcredits/${id}/status`,
          { status: LETTER_OF_CREDIT_STATUS.FUND_PAID },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data?.address}`,
            },
          },
        );
        if (response) {
          setLoading(false);
          setSuccess(response.data.message);
          getLcDetail();
        }
      }
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  const refundFund = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.refundFund(curLC?.letterOfCredit?.LcAddress);
      await tx.wait();
      if (tx) {
        const response = await api.patch(
          `/letterofcredits/${id}/status`,
          { status: LETTER_OF_CREDIT_STATUS.FUND_REVERTED },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data?.address}`,
            },
          },
        );
        if (response) {
          setLoading(false);
          setSuccess(response.data.message);
          getLcDetail();
        }
      }
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  const updateLcStatus = async (status: string) => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.changeLcStatus(
        curLC?.letterOfCredit?.LcAddress,
        status,
      );
      await tx.wait();
      if (tx) {
        const response = await api.patch(
          `/letterofcredits/${id}/status`,
          { status: status },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data?.address}`,
            },
          },
        );
        if (response) {
          setLoading(false);
          setSuccess(response.data.message);
          getLcDetail();
        }
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.log(err);
    }
  };

  const approveLC = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.approveLetterOfCredit(
        curLC?.letterOfCredit?.LcAddress,
      );
      await tx.wait();
      if (tx) {
        const response = await api.patch(
          `/letterofcredits/${id}/approve`,
          {},
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
          getLcDetail();
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.log(err);
    }
  };

  const rejectLC = async (reason) => {
    try {
      setLoading(true);
      const contract = await getContract();
      const tx = await contract.rejectLetterOfCredit(
        curLC?.letterOfCredit?.LcAddress,
      );
      await tx.wait();
      if (tx) {
        const response = await api.patch(
          `/letterofcredits/${id}/reject`,
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
          getLcDetail();
        }
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.log(err);
    }
  };

  const getLcDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/letterofcredits/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
        setLoading(false);
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
                            href={`${BLOCKCHAIN_SCAN_URL}/address/${curLC?.letterOfCredit?.LcAddress}`}
                            target="_blank"
                            className="text-blue-600"
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
                <div style={{ width: 'fit-content' }}>
                  <Link href={`/contracts/${curLC?.letterOfCredit?.LcAddress}`}>
                    <Tooltip
                      title="View L/C stored on blockchain"
                      placement="right"
                    >
                      <Button className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5">
                        View contract
                      </Button>
                    </Tooltip>
                  </Link>
                </div>
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
                <Tooltip
                  title={
                    LETTER_OF_CREDIT_STATUS_CONFIG[
                      curLC?.letterOfCredit?.status
                    ]?.hint
                  }
                  placement="right"
                >
                  <div
                    style={{
                      backgroundColor:
                        LETTER_OF_CREDIT_STATUS_CONFIG[
                          curLC?.letterOfCredit?.status
                        ]?.bgColor,
                      color:
                        LETTER_OF_CREDIT_STATUS_CONFIG[
                          curLC?.letterOfCredit?.status
                        ]?.color,
                      padding: '8px 10px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      width: 'fit-content',
                    }}
                  >
                    {
                      LETTER_OF_CREDIT_STATUS_CONFIG[
                        curLC?.letterOfCredit?.status
                      ]?.title
                    }
                  </div>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {curLC?.salesContract?.commodity?.map((item) => (
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
                        curLC?.salesContract?.requiredDocument ?? [],
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
                <Tooltip
                  title={
                    SALES_CONTRACT_STATUS_CONFIG[curLC?.salesContract?.status]
                      ?.hint
                  }
                  placement="right"
                >
                  <div
                    style={{
                      backgroundColor:
                        SALES_CONTRACT_STATUS_CONFIG[
                          curLC?.salesContract?.status
                        ]?.bgColor,
                      color:
                        SALES_CONTRACT_STATUS_CONFIG[
                          curLC?.salesContract?.status
                        ]?.color,
                      padding: '8px 10px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      width: 'fit-content',
                    }}
                  >
                    {
                      SALES_CONTRACT_STATUS_CONFIG[curLC?.salesContract?.status]
                        ?.title
                    }
                  </div>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
          <div className="m-5 rounded-2xl justify-center flex">
            {data?.address == curLC?.salesContract?.advisingBankAddress &&
              curLC?.letterOfCredit?.status !=
                LETTER_OF_CREDIT_STATUS.ADVISING_BANK_APPROVED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5"
                  onClick={approveLC}
                >
                  Approve
                </Button>
              )}
            {data?.address == curLC?.salesContract?.importerAddress &&
              curLC?.salesContract?.paymentMethod == PAYMENT_METHOD.CRYPTO &&
              curLC?.letterOfCredit?.status !==
                LETTER_OF_CREDIT_STATUS.FUND_ESCROWED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5"
                  onClick={escrowFund}
                >
                  Escrow Fund
                </Button>
              )}
            {data?.address == curLC?.salesContract?.issuingBankAddress &&
              curLC?.salesContract?.paymentMethod == PAYMENT_METHOD.CRYPTO &&
              curLC?.letterOfCredit?.status !==
                LETTER_OF_CREDIT_STATUS.FUND_PAID &&
              curLC?.letterOfCredit?.status ===
                LETTER_OF_CREDIT_STATUS.FUND_ESCROWED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5"
                  onClick={payFund}
                >
                  Pay Fund
                </Button>
              )}
            {data?.address == curLC?.salesContract?.issuingBankAddress &&
              curLC?.salesContract?.paymentMethod == PAYMENT_METHOD.CRYPTO &&
              curLC?.letterOfCredit?.status !==
                LETTER_OF_CREDIT_STATUS.FUND_REVERTED &&
              curLC?.letterOfCredit?.status !==
                LETTER_OF_CREDIT_STATUS.FUND_PAID && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5"
                  onClick={refundFund}
                >
                  Refund Fund
                </Button>
              )}
            {data?.address == curLC?.salesContract?.advisingBankAddress &&
              curLC?.letterOfCredit?.status !=
                LETTER_OF_CREDIT_STATUS.ADVISING_BANK_REJECTED && (
                <AppRejectModal
                  onConfirm={(reason) => rejectLC(reason)}
                  confirmText="Confirm"
                  cancelText="Cancel"
                  triggerBtn={
                    <Button className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5">
                      Reject
                    </Button>
                  }
                  closeRef={closeRef}
                  title="Rejected reason: "
                ></AppRejectModal>
              )}
            {(data?.address == curLC?.salesContract?.advisingBankAddress ||
              data?.address == curLC?.salesContract?.issuingBankAddress) && (
              <AppSelectModal
                width={243}
                options={
                  curLC?.salesContract?.paymentMethod === PAYMENT_METHOD.CRYPTO
                    ? UPDATE_LETTER_OF_CREDIT_STATUS_VIA_CRYPTO
                    : UPDATE_LETTER_OF_CREDIT_STATUS_VIA_BANK
                }
                onConfirm={(status) => updateLcStatus(status)}
                confirmText="Confirm"
                cancelText="Cancel"
                triggerBtn={
                  <Button className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5">
                    Update Status
                  </Button>
                }
                closeRef={closeRef}
                title="Choose one status: "
              ></AppSelectModal>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
