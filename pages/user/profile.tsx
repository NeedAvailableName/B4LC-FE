import {
    Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import Layout from '../../layout';
import axios from 'axios';
import { Configs } from '../../app-configs';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { IUser } from '../../types';
import AppButton from '../../components/AppButton';
import { red } from '@mui/material/colors';

export default function UserProfile() {
  const { data, status } = useSession();
  const [user, setUser] = useState<IUser>();
  const [error, setError] = useState();
  const getUserProfile = async () => {
    try {
      const response = await axios.get(`${Configs.BASE_API}/user`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.address}`,
        },
      });
      if (response.data) {
        setUser(response.data);
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };
  useEffect(() => {
    getUserProfile();
  }, []);
  return (
    <Layout>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {user?.address?.slice(2, 4)}
                </Avatar>
              }
              title={user?.username}
            />
            <CardContent>
              <TableContainer component={Paper}>
                <Table
                  sx={{ whiteSpace: 'nowrap' }}
                  size="medium"
                  aria-label="a dense table"
                >
                  <TableBody>
                    <TableRow
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Email
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {user?.email}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Address
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {user?.address}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Phone number
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {user?.phoneNumber}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Role
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {user?.role}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions className="justify-center">
              <AppButton title="Update" />
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
