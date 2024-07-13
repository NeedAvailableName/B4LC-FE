import { Box, Button, TablePagination, styled } from '@mui/material';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { useRef, useState } from 'react';
import AppAlert from '../components/AppAlert';
import AppTablePagination from '../components/AppTablePagination';
import AppUpdateUserModal from '../components/AppUpdateUserModal';
import NoDataTable from '../components/NoDataTable';
import { api } from '../utils/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function UserList() {
  const { data, status } = useSession();
  const [customerList, setCustomerList] = React.useState([]);
  const [bankList, setBankList] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [value, setValue] = React.useState(0);

  const [success, setSuccess] = useState(null);
  const closeRef = useRef();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
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

  const getUserList = async () => {
    try {
      const response = await api.get(`/user/all`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
        setCustomerList(response.data.customers);
        setBankList(response.data.banks);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  const handleSave = async (user) => {
    try {
      const response = await api.put(
        `/user/change/account`,
        {
          user,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data?.address}`,
          },
        },
      );
      if (response) {
        setSuccess(response.data.message);
        getUserList();
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  React.useEffect(() => {
    if (status === 'authenticated') {
      getUserList();
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
      {success && <AppAlert severity="success" message={success} />}
      {error && <AppAlert severity="error" message={error} />}
      <div className="m-5">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              centered
            >
              <Tab label="Customer" {...a11yProps(0)} />
              <Tab label="Bank" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <TableContainer component={Paper} className="rounded-2xl">
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Username</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Phone number</StyledTableCell>
                    <StyledTableCell>Role</StyledTableCell>
                    <StyledTableCell>Wallet address</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                {customerList && customerList.length > 0 ? (
                  <TableBody>
                    {(rowsPerPage > 0
                      ? customerList.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                      : customerList
                    ).map((user) => (
                      <StyledTableRow key={user._id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.address}</TableCell>
                        <TableCell>
                          <AppUpdateUserModal
                            defaultValue={user}
                            onConfirm={(user) => handleSave(user)}
                            triggerBtn={
                              <Button className="bg-sky-400 text-white font-semibold hover:bg-indigo-300">
                                Update
                              </Button>
                            }
                            closeRef={closeRef}
                            title="Update user account"
                          ></AppUpdateUserModal>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: 'All', value: -1 },
                      ]}
                      colSpan={6}
                      count={customerList.length}
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
                  <NoDataTable colSpan={6} />
                )}
              </Table>
            </TableContainer>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <TableContainer component={Paper} className="rounded-2xl">
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Username</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Phone number</StyledTableCell>
                    <StyledTableCell>Role</StyledTableCell>
                    <StyledTableCell>Wallet address</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                </TableHead>
                {bankList && bankList.length > 0 ? (
                  <TableBody>
                    {(rowsPerPage > 0
                      ? bankList.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage,
                        )
                      : bankList
                    ).map((user) => (
                      <StyledTableRow key={user._id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.address}</TableCell>
                        <TableCell>
                          <AppUpdateUserModal
                            defaultValue={user}
                            onConfirm={(user) => handleSave(user)}
                            triggerBtn={
                              <Button className="bg-sky-400 text-white font-semibold hover:bg-indigo-300">
                                Update
                              </Button>
                            }
                            closeRef={closeRef}
                            title="Update user account"
                          ></AppUpdateUserModal>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: 'All', value: -1 },
                      ]}
                      colSpan={10}
                      count={bankList.length}
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
          </CustomTabPanel>
        </Box>
      </div>
    </>
  );
}
