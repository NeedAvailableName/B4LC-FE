import {
  Button,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DOCUMENT_STATUS, DOCUMENT_STATUS_CONFIG } from '../../app-configs';
import AppAlert from '../../components/AppAlert';
import AppSelect from '../../components/AppSelect';
import PdfViewer from '../../components/PdfViewer/index';
import Layout from '../../layout';
import { IDocument } from '../../types';
import { api } from '../../utils/api';

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
      const response = await api.get(`/letterofcredits/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
        setLoading(false);
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
      const response = await api.get(`/documents/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
        setLoading(false);
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
      setLoading(true);
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
      const response = await api.patch(
        `/${doc}/${id}/approve`,
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
        getDocumentDetail();
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const rejectDocument = async () => {
    try {
      setLoading(true);
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
      const response = await api.patch(
        `/${doc}/${id}/reject`,
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
        getDocumentDetail();
      }
    } catch (err) {
      setLoading(false);
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

  const documentDetailInfo = [
    {
      name: 'Status',
      info: (
        <Tooltip
          title={DOCUMENT_STATUS_CONFIG[detailDoc?.status]?.hint}
          placement="left"
        >
          <div
            style={{
              backgroundColor:
                DOCUMENT_STATUS_CONFIG[detailDoc?.status]?.bgColor,
              color: DOCUMENT_STATUS_CONFIG[detailDoc?.status]?.color,
              padding: '8px 10px',
              borderRadius: '4px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              width: 'fit-content',
            }}
          >
            {DOCUMENT_STATUS_CONFIG[detailDoc?.status]?.title}
          </div>
        </Tooltip>
      ),
    },
    {
      name: 'Document file',
      info: (
        <Tooltip title="View in cloud" placement="right">
          <a href={detailDoc?.file_path} target="_blank">
            {detailDoc?.file_path?.split('/').pop()}
          </a>
        </Tooltip>
      ),
    },
  ];

  detailDoc &&
    Object.entries(detailDoc).map(([key, value]) => {
      if (key !== 'status' && key !== 'file_path') {
        documentDetailInfo.push({
          name: key,
          info: value,
        });
      }
    });
  return (
    <Layout>
      {loading ? (
        <div className="bg-[#F4F7FF] m-5 h-dvh flex items-center justify-center rounded-2xl">
          <CircularProgress />
        </div>
      ) : (
        <>
          {success && <AppAlert severity="success" message={success} />}
          {error && <AppAlert severity="error" message={error} />}
          <div className="bg-[#F4F7FF] m-5 rounded-2xl flex justify-center">
            <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
              <Grid item xs={12} className="">
                <div className="rounded-[10px] shadow-custom h-dvh bg-gray justify-center items-center content-center bg-white">
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
                      documentDetailInfo.map((item) => (
                        <TableRow
                          key={item.name}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {item.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.info}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </div>
          <div className="m-5 rounded-2xl justify-center flex">
            {(data?.address == curLC?.salesContract?.advisingBankAddress ||
              data?.address == curLC?.salesContract?.issuingBankAddress) &&
              detailDoc?.status !== DOCUMENT_STATUS.APRROVED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5"
                  onClick={approveDocument}
                >
                  Approve Document
                </Button>
              )}
            {(data?.address == curLC?.salesContract?.advisingBankAddress ||
              data?.address == curLC?.salesContract?.issuingBankAddress) &&
              detailDoc?.status !== DOCUMENT_STATUS.REJECTED && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300 m-5"
                  onClick={rejectDocument}
                >
                  Reject Document
                </Button>
              )}
          </div>
        </>
      )}
    </Layout>
  );
}
