import React from 'react';
import { TableBody, TableRow, TableCell } from '@mui/material';

const NoDataTable = ({ colSpan }) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={colSpan} align="center">
          <span>No data</span>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export default NoDataTable;
