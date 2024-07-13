import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AppAlert from '../../../../components/AppAlert';
import AppSelect from '../../../../components/AppSelect';
import Layout from '../../../../layout';
import { api } from '../../../../utils/api';
export default function CreateUser() {
  const { data } = useSession();
  const router = useRouter();
  const [user, setUser] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: '',
    role: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSave = async () => {
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
        router.push(`/admin`);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setUser({
      ...user,
      role: value,
    });
  };

  return (
    <Layout>
      {success && <AppAlert severity="success" message={success} />}
      {error && <AppAlert severity="error" message={error} />}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item>
          <Card className="bg-[#F4F7FF]">
            <CardContent>
              <TableContainer component={Paper}>
                <Table
                  sx={{ whiteSpace: 'nowrap' }}
                  size="medium"
                  aria-label="a dense table"
                >
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Username
                      </TableCell>
                      <TableCell>
                        <TextField
                          placeholder="Username"
                          name="username"
                          value={user.username}
                          onChange={handleChange}
                          required={true}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Email
                      </TableCell>
                      <TableCell>
                        <TextField
                          placeholder="Email"
                          name="email"
                          value={user.email}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Phone number
                      </TableCell>
                      <TableCell>
                        <TextField
                          placeholder="Phone number"
                          name="phoneNumber"
                          value={user.phoneNumber}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Address
                      </TableCell>
                      <TableCell>
                        <TextField
                          placeholder="Wallet account address"
                          name="address"
                          value={user.address}
                          onChange={handleChange}
                          required={true}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Role
                      </TableCell>
                      <TableCell>
                        <AppSelect
                          label="Role"
                          onChange={handleRoleChange}
                          elements={['user', 'bank', 'admin']}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions className="justify-center">
              <Button
                className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                onClick={handleSave}
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
