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
import { IDOcument } from '../../types';
import PdfViewer from '../../components/PdfViewer';
import { IcEyePreview } from '../../assets/svgs';
import AppSelect from '../../components/AppSelect';

export default function DocumentDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState(null);
  const [curDocument, setCurDocument] = useState<IDOcument>();
  const { data, status } = useSession();
  console.log('data: ', data);
  const [loading, setLoading] = useState(false);

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

  // const approveDocument = async () => {
  //   try {
  //     const response = await axios.patch()
  //   }
  // }

  useEffect(() => {
    if (status == 'authenticated' && id != null) getDocumentDetail();
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
          <div className="bg-slate-50 m-5 rounded-2xl flex justify-center">
            {/* <form onSubmit={handleSubmit} className="w-full"> */}
            <Grid container rowSpacing={1} columnSpacing={1} className="m-3">
              <Grid item xs={12}>
                <div className="mt-2.5 rounded-[10px] shadow-custom h-80 bg-white mb-3.5 justify-center items-center">
                  {curDocument && (
                    <PdfViewer url={curDocument?.invoice?.file_path} defaultScale="PageWidth" />
                  )}
                  {!curDocument && (
                    <div className="flex justify-center items-center flex-col ">
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
                  // onChange={handleDocTypeChange}
                  // elements={requiredDocument}
                />
              </Grid>
              <Grid item xs={12}>
                <Table
                  sx={{ width: '60', whiteSpace: 'nowrap' }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableBody>
                    {curDocument &&
                      Object.entries(curDocument?.invoice ? curDocument.invoice : []).map(([key, value]) => (
                        <TableRow
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
        </>
      )}
    </Layout>
  );
}
