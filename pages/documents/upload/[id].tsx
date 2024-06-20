import axios from 'axios';
import Layout from '../../../layout';
import { useSession } from 'next-auth/react';
import { Configs, DEFAULT_DOCUMENT_FORM_DATA } from '../../../app-configs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AppAlert from '../../../components/AppAlert';
import PdfViewer from '../../../components/PdfViewer';
import AppFileInput from '../../../components/AppFileInput';
import { FormProvider, useForm } from 'react-hook-form';
import AppSelect from '../../../components/AppSelect';
import { IcEyePreview } from '../../../assets/svgs';
import { LoadingButton } from '@mui/lab';
import AppLoading from '../../../components/AppLoading';

export default function UploadDocument() {
  const router = useRouter();
  const { id } = router.query;
  const methods = useForm();

  const [requiredDocument, setRequiredDocument] = useState<string[]>();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { data, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [OCRLoading, setOCRLoading] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const [docType, setDocType] = useState<string>();
  const [OCRformData, setOCRformData] = useState<Object>();
  const [curLC, setCurLC] = useState();
  const [isEdit, setIsEdit] = useState(false);

  const handleEditClick = () => {
    setIsEdit(true);
  };

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
        console.log(response.data);
        setLoading(false);
        setCurLC(response.data);
        const trueKeys = Object.keys(
          response.data.salesContract.requiredDocument,
        ).filter((key) => response.data.salesContract.requiredDocument[key]);
        setRequiredDocument(trueKeys);
      }
    } catch (err) {
      // setLoading(false);
      console.log(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (status == 'authenticated' && id != null) getLcDetail();
  }, [status, id]);

  const uploadToCloud = async (uploadedFiles: File[]) => {
    setFileLoading(true);
    const _documentDataForm = new FormData();
    (Array.from(uploadedFiles) ?? []).forEach((file) => {
      const modifiedFile = new File([file], file.name);
      _documentDataForm.append('file', modifiedFile);
    });
    console.log(_documentDataForm);
    try {
      const response = await axios.post(
        `${Configs.BASE_API}/files/upload`,
        _documentDataForm,
      );
      if (response.data) {
        setFileLoading(false);
        console.log('file path: ', response.data);
        setFilePath(response.data);
        return response.data;
      }
    } catch (err) {
      setFileLoading(false);
      setError(err.message);
    }
  };

  const handleFileChange = async (uploadedFiles: File[]) => {
    setOCRLoading(true);
    const OCRformData = {
      doc_type: docType,
      image_url: await uploadToCloud(uploadedFiles),
    };
    console.log(OCRformData);
    try {
      const response = await axios.post(
        `${Configs.OCR_API}/ocr_document`,
        OCRformData,
      );
      if (response.data) {
        setOCRLoading(false);
        console.log(response.data);
        setOCRformData(response.data.results);
      } else {
        setOCRLoading(false);
      }
    } catch (err) {
      setOCRLoading(false);
      setError(err.message);
    }
  };

  const handleDocTypeChange = async (value: string) => {
    setDocType(value);
    setFilePath(null);
    setOCRformData({});
  };

  const handleSubmit = async (e) => {
    setIsEdit(false);
    e.preventDefault();
    try {
      const formData = {
        file_path: filePath,
        ...OCRformData,
      };
      let doc = '';
      console.log('form data: ', formData);
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
      const response = await axios.post(
        `${Configs.BASE_API}/${doc}/create/${id}`,
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
        router.push('/documents');
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleChange = (key, value) => {
    setOCRformData({
      ...OCRformData,
      [key]: value,
    });
  };

  return (
    <Layout>
      {loading ? (
        <div className="bg-slate-50 m-5 h-dvh flex items-center justify-center rounded-2xl">
          <AppLoading />
        </div>
      ) : (
        <>
          {error && <AppAlert severity="error" message={error} />}
          {success && <AppAlert severity="success" message={success} />}
          <FormProvider {...methods}>
            <div className="bg-slate-50 m-5 rounded-2xl flex justify-center">
              {/* <form onSubmit={handleSubmit} className="w-full"> */}
              <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
                <Grid item xs={12} className="m-3">
                  <AppFileInput
                    name="attachmentFile"
                    placeholder="Choose document file"
                    accept="application/pdf"
                    required={true}
                    afterSelect={(uploadedFiles) =>
                      handleFileChange(uploadedFiles)
                    }
                  ></AppFileInput>
                </Grid>
                <Grid item xs={12} className="">
                  <div className="rounded-[10px] shadow-custom h-dvh bg-gray justify-center items-center content-center">
                    {fileLoading && <AppLoading></AppLoading>}
                    {filePath && (
                      <PdfViewer url={filePath} defaultScale="PageWidth" />
                    )}
                    {!filePath && !fileLoading && (
                      <div className="flex justify-center items-center flex-col">
                        <p className="">
                          <IcEyePreview />
                        </p>
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
                  {OCRLoading ? (
                    <AppLoading />
                  ) : (
                    <Table
                      sx={{ width: '60', whiteSpace: 'nowrap' }}
                      size="small"
                      aria-label="a dense table"
                    >
                      <TableBody>
                        {OCRformData &&
                          Object.entries(OCRformData).map(([key, value]) => (
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {key}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {isEdit ? (
                                  <TextField
                                    className="w-full"
                                    value={value}
                                    onChange={(e) =>
                                      handleChange(key, e.target.value)
                                    }
                                    size="small"
                                  />
                                ) : (
                                  value
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </Grid>
              </Grid>
              {/* </form> */}
            </div>
            <div className="m-5 rounded-2xl justify-center flex">
              {(data?.address == curLC?.salesContract?.exporterAddress ||
                data?.address == curLC?.salesContract?.importerAddress) && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                  onClick={isEdit ? handleSubmit : handleEditClick}
                >
                  {isEdit ? 'Upload' : 'Edit'}
                </Button>
              )}
            </div>
          </FormProvider>
        </>
      )}
    </Layout>
  );
}
