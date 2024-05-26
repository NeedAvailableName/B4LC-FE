import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { useSession, getSession } from 'next-auth/react';
import axios from 'axios';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ApolloClient from '../clients/apollo';
import { Alert } from '@mui/material';
import AppAlert from '../components/AppAlert';

export default function LcList() {
  const { data, status } = useSession();
  console.log('status: ', status);
  const [LcList, setLcList] = React.useState([]);
  const [error, setError] = React.useState(null);
  const router = useRouter();
  const handleOnClick = (LC) => {
    router.push(`/letter-of-credits/${LC._id}`);
  };
  const getLcList = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/letterofcredits',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data?.address}`,
          },
        },
      );
      if (response.data) {
        console.log('data: ', response.data);
        setLcList(response.data);
      }
    } catch (err) {
      console.log(err);
      setError(err);
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
      {error && <AppAlert severity="error" message={error.message} />}
      <div className="m-10">
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
              </TableRow>
            </TableHead>
            <TableBody>
              {LcList.map((LC) => (
                <TableRow
                  className="cursor-pointer"
                  key={LC.LCID}
                  onClick={() => handleOnClick(LC)}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
