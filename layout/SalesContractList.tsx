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
import { Configs } from '../app-configs';
import AppAlert from '../components/AppAlert';

export default function SalesContractsList() {
  const { data, status } = useSession();
  console.log('data: ', data?.address);
  const [salesContractsList, setSalesContractsList] = React.useState([]);
  const [error, setError] = React.useState(null);
  const router = useRouter();
  const handleOnClick = (contract) => {
    router.push(`/sales-contracts/${contract.salescontract_id}`);
  };
  const getSalesContractsList = async () => {
    try {
      const response = await axios.get(`${Configs.BASE_API}/salescontracts`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
        console.log('data: ', response.data);
        setSalesContractsList(response.data);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };
  React.useEffect(() => {
    if (status === 'authenticated') {
      getSalesContractsList();
    }
  }, [status]);
  return (
    <>
      {error && <AppAlert severity="error" message={error} />}
      <div className="m-5">
        <TableContainer component={Paper} className="rounded-2xl">
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
                <TableCell>Payment Method</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesContractsList.map((contract) => (
                <TableRow
                  className="cursor-pointer"
                  key={contract.salescontract_id}
                  onClick={() => handleOnClick(contract)}
                >
                  <TableCell>{contract.importer}</TableCell>
                  <TableCell>{contract.exporter}</TableCell>
                  <TableCell>{contract.issuingBank}</TableCell>
                  <TableCell>{contract.advisingBank}</TableCell>
                  <TableCell>
                    <ul>
                      {contract.commodity.map((item, index) => (
                        <li key={index}>{item.description}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{contract.price}</TableCell>
                  <TableCell>{contract.currency}</TableCell>
                  <TableCell>{contract.paymentMethod}</TableCell>
                  <TableCell>{contract.deadlineInDate}</TableCell>
                  <TableCell>{contract.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
