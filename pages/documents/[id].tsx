import axios from 'axios';
import Layout from '../../layout';
import { useSession } from 'next-auth/react';
import {
  Configs,
  DOCUMENT_STATUS,
  LETTER_OF_CREDIT_STATUS,
  SALES_CONTRACT_STATUS,
} from '../../app-configs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
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
import AppAlert from '../../components/AppAlert';
import { IDocument } from '../../types';
import PdfViewer from '../../components/PdfViewer';
import { IcEyePreview } from '../../assets/svgs';
import AppSelect from '../../components/AppSelect';

export default function DocumentDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState(null);
  const [curDocument, setCurDocument] = useState<IDocument>();
  const [detailDoc, setDetailDoc] = useState();
  const [curLC, setCurLC] = useState();
  const [docType, setDocType] = useState<string>();
  const [requiredDocument, setRequiredDocument] = useState<string[]>();
  const { data, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

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
        setCurLC(response.data);
        const trueKeys = Object.keys(
          response.data.salesContract.requiredDocument,
        ).filter((key) => response.data.salesContract.requiredDocument[key]);
        setRequiredDocument(trueKeys);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      setError(err.message);
    }
  };

  const getDocumentDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Configs.BASE_API}/documents/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
        setLoading(false);
        console.log('res: ', response.data);
        setCurDocument(response.data);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      setError(err.message);
    }
  };

  const approveDocument = async () => {
    try {
      let doc = '';
      switch (docType) {
        case 'invoice':
          doc = 'invoices';
          break;
        case 'bill_of_exchange':
          doc = 'billofexchanges';
          break;
        case 'bill_of_lading':
          doc = 'billofladings';
          break;
        case 'certificate_of_origin':
          doc = 'certificateoforigins';
          break;
        case 'insurance':
          doc = 'insurances';
          break;
        case 'package_list':
          doc = 'packagelists';
          break;
        case 'quantity_quality_certificate':
          doc = 'quantityqualitycretificates';
          break;
      }
      const response = await axios.patch(
        `${Configs.BASE_API}/${doc}/${id}/approve`,
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
        getDocumentDetail();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDocTypeChange = (value: string) => {
    setDocType(value);
    switch (value) {
      case 'invoice':
        setDetailDoc(curDocument?.invoice);
        break;
      case 'bill_of_exchange':
        setDetailDoc(curDocument?.billOfExchange);
        break;
      case 'bill_of_lading':
        setDetailDoc(curDocument?.billOfLading);
        break;
      case 'certificate_of_origin':
        setDetailDoc(curDocument?.certificateOfOrigin);
        break;
      case 'insurance':
        setDetailDoc(curDocument?.insurance);
        break;
      case 'package_list':
        setDetailDoc(curDocument?.packageList);
        break;
      case 'quantity_quality_certificate':
        setDetailDoc(curDocument?.quantityQualityCertificate);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (status == 'authenticated' && id != null) {
      getDocumentDetail();
      getLcDetail();
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
          {success && <AppAlert severity="success" message={success} />}
          {error && <AppAlert severity="error" message={error} />}
          <div className="bg-slate-50 m-5 rounded-2xl flex justify-center">
            {/* <form onSubmit={handleSubmit} className="w-full"> */}
            <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
              <Grid item xs={12} className="border-2 border-black">
                <div className="rounded-[10px] shadow-custom h-96 bg-gray justify-center items-center content-center">
                  {detailDoc && (
                    <PdfViewer
                      url={detailDoc?.file_path}
                      defaultScale="PageWidth"
                    />
                  )}
                  {!detailDoc && (
                    <div className="flex justify-center items-center flex-col ">
                      <span>No document file</span>
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
            <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
              <Grid item xs={12}>
                <AppSelect
                  label="Choose document"
                  onChange={handleDocTypeChange}
                  elements={requiredDocument}
                />
              </Grid>
              <Grid item xs={12}>
                <Table
                  sx={{ whiteSpace: 'nowrap' }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableBody>
                    {detailDoc &&
                      Object.entries(detailDoc).map(([key, value]) => (
                        <TableRow
                          key={key}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {key}
                          </TableCell>
                          {typeof value != 'object' && (
                            <TableCell component="th" scope="row">
                              {value}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
            {/* </form> */}
          </div>
          <div className="m-5 rounded-2xl justify-center flex">
            {(data?.address == curLC?.salesContract?.advisingBankAddress ||
              data?.address == curLC?.salesContract?.issuingBankAddress) &&
              detailDoc?.status === DOCUMENT_STATUS.USER_UPLOADED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                  onClick={approveDocument}
                >
                  Approve Document
                </Button>
              )}
          </div>
        </>
      )}
    </Layout>
  );
}
