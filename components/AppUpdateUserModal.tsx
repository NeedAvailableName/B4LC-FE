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
import { useState } from 'react';
import AppModal from './AppModal';
import AppSelect from './AppSelect';

export default function AppUpdateUserModal({
  onConfirm = () => {},
  isLoading = false,
  onOpenChange = () => {},
  submitBtnStyle = {},
  cancelBtnStyle = {},
  addModalContentStyle = {},
  width = 462,
  confirmText,
  hasCloseAfterConfirm = false,
  cancelText,
  triggerBtn,
  closeRef,
  icon,
  title,
  description,
  disableConfirmBtn = false,
  children,
  defaultValue = {},
  ...props
}) {
  const [updatedUser, setUpdatedUser] = useState({
    username: defaultValue.username,
    email: defaultValue.email,
    phoneNumber: defaultValue.phoneNumber,
    address: defaultValue.address,
    role: defaultValue.role,
  });
  const handleChange = (e) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setUpdatedUser({
      ...updatedUser,
      role: value,
    });
  };

  const handleConfirm = () => {
    onConfirm(updatedUser);
  };

  return (
    <>
      <AppModal
        width={width}
        triggerBtn={triggerBtn}
        triggerBtnStyle={props?.triggerBtnStyle}
        onOpenChange={onOpenChange}
        contentStyle={{
          padding: '18px',
          ...addModalContentStyle,
        }}
        closeRef={closeRef}
        btnBoxStyle={{
          marginTop: '14px',
        }}
        hasCloseAfterConfirm={hasCloseAfterConfirm}
        onConfirm={handleConfirm}
      >
        {title && (
          <div className="font-semibold text-[15px] mb-[2px]">{title}</div>
        )}
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
                          defaultValue={defaultValue.username}
                          placeholder={defaultValue?.username}
                          name="username"
                          value={updatedUser.username}
                          onChange={handleChange}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Email
                      </TableCell>
                      <TableCell>
                        <TextField
                          defaultValue={defaultValue?.email}
                          placeholder={defaultValue?.email}
                          name="email"
                          value={updatedUser.email}
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
                          defaultValue={defaultValue?.phoneNumber}
                          placeholder={defaultValue?.phoneNumber}
                          name="phoneNumber"
                          value={updatedUser.phoneNumber}
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
                          defaultValue={defaultValue?.address}
                          placeholder={defaultValue?.address}
                          name="address"
                          value={updatedUser.address}
                          onChange={handleChange}
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
                          defaultValue={defaultValue?.role}
                          onChange={handleRoleChange}
                          name="role"
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
                onClick={handleConfirm}
              >
                Save
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </AppModal>
    </>
  );
}
