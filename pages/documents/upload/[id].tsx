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
  Typography,
} from '@mui/material';
import AppAlert from '../../../components/AppAlert';
import PdfViewer from '../../../components/PdfViewer';
import AppFileInput from '../../../components/AppFileInput';
import { FormProvider, useForm } from 'react-hook-form';
import AppSelect from '../../../components/AppSelect';
import { IcEyePreview } from '../../../assets/svgs';

export default function UploadDocument() {
  const router = useRouter();
  const { id } = router.query;
  const methods = useForm();

  const [requiredDocument, setRequiredDocument] = useState<string[]>();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { data, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [filePath, setFilePath] = useState(null);
  const [docType, setDocType] = useState();
  const [OCRformData, setOCRformData] = useState();
  const [curLC, setCurLC] = useState();

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
        console.log(response.data)
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

  useEffect(() => {
    if (status == 'authenticated' && id != null) getLcDetail();
  }, [status, id]);

  const waitFor = (conditionFunction) => {
    const poll = resolve => {
      if(conditionFunction()) resolve();
      else setTimeout(() => poll(resolve), 100);
    }
  
    return new Promise(poll);
  };

  const uploadToCloud = async (uploadedFiles) => {
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
        console.log('file path: ', response.data);
        setFilePath(response.data);
        return response.data;
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const handleFileChange = async (uploadedFiles) => {
    // await uploadToCloud(uploadedFiles);
    // waitFor(() => filePath != null);
    
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
        console.log(response.data);
        setOCRformData(response.data.results);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDocTypeChange = async (value) => {
    setDocType(value);
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const formData = {
            file_path: filePath,
            ...OCRformData
          }
          console.log('form data: ', formData);
          const response = await axios.post(
            `${Configs.BASE_API}/invoices/create/${id}`,
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
            router.push('/documents')
          }
        } catch (error) {
          setError(error.message);
          console.error(error);
        }
  };

  return (
    <Layout>
      {loading ? (
        <div className="bg-slate-50 m-5 h-full flex items-center justify-center rounded-2xl">
          <CircularProgress />
        </div>
      ) : (
        <>
          {error && <AppAlert severity="error" message={error} />}
          {success && <AppAlert severity="success" message={success} />}
          <FormProvider {...methods}>
            <div className="bg-slate-50 m-5 rounded-2xl flex justify-center">
              {/* <form onSubmit={handleSubmit} className="w-full"> */}
              <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
                <Grid item xs={12}>
                  <AppFileInput
                    name="attachmentFile"
                    placeholder="File văn bản"
                    accept="application/pdf"
                    afterSelect={(uploadedFiles) =>
                      handleFileChange(uploadedFiles)
                    }
                  ></AppFileInput>
                </Grid>
                <Grid item xs={12}>
                  <div className="mt-2.5 rounded-[10px] shadow-custom h-full bg-white mb-3.5 justify-center items-center">
                    {filePath && (
                      <PdfViewer url={filePath} defaultScale="PageWidth" />
                    )}
                    {!filePath && (
                      <div className="flex justify-center items-center flex-col">
                        <p className="">
                          <IcEyePreview />
                        </p>
                        <span>Document file</span>
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
                    sx={{ width: '60', whiteSpace: 'nowrap' }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      {OCRformData &&
                        Object.entries(OCRformData).map(([key, value]) => (
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {key}
                            </TableCell>
                            {typeof value != 'object' && <TableCell component="th" scope="row">
                              {value}
                            </TableCell>}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Grid>
              </Grid>
              {/* </form> */}
            </div>
            <div className="m-5 rounded-2xl justify-center flex">
              {(data?.address == curLC?.salesContract?.exporterAddress ||
                data?.address == curLC?.salesContract?.importerAddress) && (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                  onClick={(e) => handleSubmit(e)}
                >
                  Upload
                </Button>
              )}
            </div>
          </FormProvider>
        </>
      )}
    </Layout>
  );
}
