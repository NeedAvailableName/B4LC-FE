import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { useRouter } from 'next/router';
import { Configs, LETTER_OF_CREDIT_STATUS } from '../app-configs';
import AppAlert from '../components/AppAlert';
import { GrDocumentUpload } from 'react-icons/gr';
import { FaEye } from 'react-icons/fa';

export default function LcDocumentList() {
  const { data, status } = useSession();
  console.log('status: ', status);
  const [LcList, setLcList] = React.useState([]);
  const [error, setError] = React.useState(null);
  const router = useRouter();
  const handleUploadOnClick = (LC) => {
    router.push(`/documents/upload/${LC._id}`);
  };
  const handleViewOnClick = (LC) => {
    router.push(`documents/${LC._id}`);
  }
  const getLcList = async () => {
    try {
      const response = await axios.get(`${Configs.BASE_API}/letterofcredits`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
        console.log('data: ', response.data);
        setLcList(response.data);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
      // alert(err.message);
    }
  };
  React.useEffect(() => {
    if (status === 'authenticated') {
      getLcList();
    }
  }, [status]);
  return (
    <>
      {error && <AppAlert severity="error" message={error} />}
        <div className="m-5">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Importer</TableCell>
                  <TableCell>Exporter</TableCell>
                  <TableCell>Issuing Bank</TableCell>
                  <TableCell>Advising Bank</TableCell>
                  <TableCell>Commodity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {LcList.map((LC) => (
                  <TableRow
                    key={LC.LCID}
                  >
                    <TableCell>{LC.importerName}</TableCell>
                    <TableCell>{LC.exporterName}</TableCell>
                    <TableCell>{LC.issuingBankName}</TableCell>
                    <TableCell>{LC.advisingBankName}</TableCell>
                    <TableCell>
                      <ul>
                        {LC.commodity.map((item, index) => (
                          <li key={index}>{item.description}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>{LC.price}</TableCell>
                    <TableCell>{LC.currency}</TableCell>
                    <TableCell>{LC.startDate}</TableCell>
                    <TableCell>{LC.status}</TableCell>
                    <TableCell className='cursor-pointer' onClick={() => handleViewOnClick(LC)}>
                      <FaEye />
                    </TableCell>
                    {(LC.status != LETTER_OF_CREDIT_STATUS.DOCUMENT_APPROVED || LC.status != LETTER_OF_CREDIT_STATUS.DOCUMENT_UPLOADED || LC.status != LETTER_OF_CREDIT_STATUS.ENDED) && (
                      <TableCell className='cursor-pointer' onClick={() => handleUploadOnClick(LC)}>
                        <GrDocumentUpload />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
    </>
  );
}
