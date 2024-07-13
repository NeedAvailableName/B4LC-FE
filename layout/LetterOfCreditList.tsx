import { TablePagination, Tooltip, Typography, styled } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { LETTER_OF_CREDIT_STATUS_CONFIG } from '../app-configs';
import AppAlert from '../components/AppAlert';
import AppTablePagination from '../components/AppTablePagination';
import NoDataTable from '../components/NoDataTable';
import { api } from '../utils/api';

export default function LcList() {
  const { data, status } = useSession();
  const [LcList, setLcList] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

  const router = useRouter();
  const handleOnClick = (LC) => {
    router.push(`/letter-of-credits/${LC._id}`);
  };
  const getLcList = async () => {
    try {
      const response = await api.get(`/letterofcredits`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
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
      {error && <AppAlert severity="error" message={error.message} />}
      <div className="m-5">
        <div className="m-3 justify-center">
          <Typography className="flex justify-center text-2xl font-semibold text-primary">
            LETTER OF CREDITS LIST
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
                <StyledTableCell>Start Date</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableRow>
            </TableHead>
            {LcList && LcList.length > 0 ? (
              <TableBody>
                {(rowsPerPage > 0
                  ? LcList.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : LcList
                ).map((LC) => (
                  <StyledTableRow
                    className="cursor-pointer"
                    key={LC.LCID}
                    onClick={() => handleOnClick(LC)}
                  >
                    <StyledTableCell>{LC.importerName}</StyledTableCell>
                    <StyledTableCell>{LC.exporterName}</StyledTableCell>
                    <StyledTableCell>{LC.issuingBankName}</StyledTableCell>
                    <StyledTableCell>{LC.advisingBankName}</StyledTableCell>
                    <StyledTableCell>
                      <ul>
                        {LC.commodity.map((item, index) => (
                          <li key={index}>{item.description}</li>
                        ))}
                      </ul>
                    </StyledTableCell>
                    <StyledTableCell>{LC.price}</StyledTableCell>
                    <StyledTableCell>{LC.currency}</StyledTableCell>
                    <StyledTableCell>{LC.startDate}</StyledTableCell>
                    <StyledTableCell>
                      <Tooltip
                        title={LETTER_OF_CREDIT_STATUS_CONFIG[LC.status]?.hint}
                        placement="left"
                      >
                        <div
                          style={{
                            backgroundColor:
                              LETTER_OF_CREDIT_STATUS_CONFIG[LC.status]
                                ?.bgColor,
                            color:
                              LETTER_OF_CREDIT_STATUS_CONFIG[LC.status]?.color,
                            padding: '8px 10px',
                            borderRadius: '4px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            width: 'fit-content',
                          }}
                        >
                          {LETTER_OF_CREDIT_STATUS_CONFIG[LC.status]?.title}
                        </div>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={9}
                  count={LcList.length}
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
              <NoDataTable colSpan={9} />
            )}
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
