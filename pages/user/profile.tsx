import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  IconButton,
  Button,
  Typography,
} from '@mui/material';
import Layout from '../../layout';
import axios from 'axios';
import { Configs } from '../../app-configs';
import { useSession } from 'next-auth/react';
import { red } from '@mui/material/colors';
import AppButton from '../../components/AppButton';
import AppAlert from '../../components/AppAlert';

export default function UserProfile() {
  const { data } = useSession();
  const [user, setUser] = useState();
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    username: '',
    email: '',
    phoneNumber: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
        setUpdatedUser({
          username: response.data.username,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
        });
      }
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${Configs.BASE_API}/user/change/profile`,
        {
          username: updatedUser.username,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
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
        getUserProfile();
      }
      setEditMode(false);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
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
            {!user?.username && (
              <Typography className="text-red-500 justify-center flex">
                * Please update personal information before using the
                application
              </Typography>
            )}
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
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Username
                      </TableCell>
                      <TableCell>
                        {editMode ? (
                          <TextField
                            defaultValue={user?.username}
                            placeholder={user?.username}
                            name="username"
                            value={updatedUser.username}
                            onChange={handleChange}
                          />
                        ) : (
                          user?.username
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Email
                      </TableCell>
                      <TableCell>
                        {editMode ? (
                          <TextField
                            defaultValue={user?.email}
                            placeholder={user?.email}
                            name="email"
                            value={updatedUser.email}
                            onChange={handleChange}
                          />
                        ) : (
                          user?.email
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Phone number
                      </TableCell>
                      <TableCell>
                        {editMode ? (
                          <TextField
                            defaultValue={user?.phoneNumber}
                            placeholder={user?.phoneNumber}
                            name="phoneNumber"
                            value={updatedUser.phoneNumber}
                            onChange={handleChange}
                          />
                        ) : (
                          user?.phoneNumber
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Address
                      </TableCell>
                      <TableCell>{user?.address}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Role
                      </TableCell>
                      <TableCell>{user?.role}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions className="justify-center">
              {editMode ? (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                  onClick={handleSave}
                >
                  Save
                </Button>
              ) : (
                <Button
                  className="bg-sky-400 text-white font-semibold hover:bg-indigo-300"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
