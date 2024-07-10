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
import { FaEye } from 'react-icons/fa';
import { GrDocumentUpload } from 'react-icons/gr';
import {
  Configs,
  LETTER_OF_CREDIT_STATUS,
  LETTER_OF_CREDIT_STATUS_CONFIG,
  UserRole,
} from '../app-configs';
import AppAlert from '../components/AppAlert';
import AppTablePagination from '../components/AppTablePagination';
import NoDataTable from '../components/NoDataTable';

export default function LcDocumentList() {
  const { data, status } = useSession();
  const [LcList, setLcList] = React.useState([]);
  const [error, setError] = React.useState(null);
  const router = useRouter();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - LcList.length) : 0;

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

  const handleUploadOnClick = (LC) => {
    router.push(`/documents/upload/${LC._id}`);
  };
  const handleViewOnClick = (LC) => {
    router.push(`documents/${LC._id}`);
  };
  const getLcList = async () => {
    try {
      const response = await axios.get(`${Configs.BASE_API}/letterofcredits`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
        setLcList(response.data);
      }
    } catch (err) {
      setError(err.message);
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
      {error && <AppAlert severity="error" message={error} />}
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
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
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
                  <StyledTableRow key={LC.LCID}>
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
                    <TableCell>
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
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => handleViewOnClick(LC)}
                    >
                      <Tooltip title="View detail">
                        <FaEye />
                      </Tooltip>
                    </TableCell>
                    {(data?.user.role != UserRole.BANK ||
                      LC.status != LETTER_OF_CREDIT_STATUS.DOCUMENT_APPROVED ||
                      LC.status != LETTER_OF_CREDIT_STATUS.DOCUMENT_UPLOADED ||
                      LC.status != LETTER_OF_CREDIT_STATUS.ENDED) && (
                      <TableCell
                        className="cursor-pointer"
                        onClick={() => handleUploadOnClick(LC)}
                      >
                        <Tooltip title="Upload document">
                          <GrDocumentUpload />
                        </Tooltip>
                      </TableCell>
                    )}
                  </StyledTableRow>
                ))}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={11}
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
              <NoDataTable colSpan={11} />
            )}
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
