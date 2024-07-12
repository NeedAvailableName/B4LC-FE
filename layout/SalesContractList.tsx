import { TablePagination, Tooltip, Typography, styled } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { Configs, SALES_CONTRACT_STATUS_CONFIG } from '../app-configs';
import AppAlert from '../components/AppAlert';
import AppTablePagination from '../components/AppTablePagination';
import NoDataTable from '../components/NoDataTable';
import api from '../utils/api';

export default function SalesContractsList() {
  const { data, status } = useSession();
  const [salesContractsList, setSalesContractsList] = React.useState([]);
  const [error, setError] = React.useState(null);
  const router = useRouter();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - salesContractsList.length)
      : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOnClick = (contract) => {
    router.push(`/sales-contracts/${contract.salescontract_id}`);
  };
  // const getSalesContractsList = async () => {
  //   try {
  //     const response = await axios.get(`${Configs.BASE_API}/salescontracts`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${data?.address}`,
  //       },
  //     });
  //     if (response.data) {
  //       setSalesContractsList(response.data);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     setError(err.message);
  //   }
  // };

  const getSalesContractsList = async () => {
    try {
      const response = await api.get('/salescontracts', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.info.dark,
      color: theme.palette.common.white,
      fontWeight: 600,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <>
      {error && <AppAlert severity="error" message={error} />}
      <div className="m-5">
        <div className="m-3 justify-center">
          <Typography className="flex justify-center text-2xl font-semibold text-primary">
            SALES CONTRACTS LIST
          </Typography>
        </div>
        <TableContainer component={Paper} className="rounded-2xl">
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Importer</StyledTableCell>
                <StyledTableCell>Exporter</StyledTableCell>
                <StyledTableCell>Issuing Bank</StyledTableCell>
                <StyledTableCell>Advising Bank</StyledTableCell>
                <StyledTableCell>Commodity</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Currency</StyledTableCell>
                <StyledTableCell>Payment Method</StyledTableCell>
                <StyledTableCell>Deadline</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableRow>
            </TableHead>
            {salesContractsList && salesContractsList.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? salesContractsList.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : salesContractsList
                ).map((contract) => (
                  <StyledTableRow
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
                    <TableCell>
                      <Tooltip
                        title={
                          SALES_CONTRACT_STATUS_CONFIG[contract.status]?.hint
                        }
                        placement="left"
                      >
                        <div
                          style={{
                            backgroundColor:
                              SALES_CONTRACT_STATUS_CONFIG[contract.status]
                                ?.bgColor,
                            color:
                              SALES_CONTRACT_STATUS_CONFIG[contract.status]
                                ?.color,
                            padding: '8px 10px',
                            borderRadius: '4px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            width: 'fit-content',
                          }}
                        >
                          {SALES_CONTRACT_STATUS_CONFIG[contract.status]?.title}
                        </div>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={10}
                  count={salesContractsList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={AppTablePagination}
                />
              </TableBody>
            ) : (
              <NoDataTable colSpan={10} />
            )}
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
