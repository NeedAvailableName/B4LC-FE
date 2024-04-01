import { Box, Typography, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import AppTextInput from './AppTextInput';
import { FaRegPlusSquare } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

export default function AppCommodityBox() {
  const [formItems, setFormItems] = useState([{ id: 1 }]);
  const [nextItemId, setNextItemId] = useState(2);

  const addFormItem = () => {
    setFormItems([...formItems, { id: nextItemId }]);
    setNextItemId(nextItemId + 1);
  };

  const removeFormItem = (idToRemove: number) => {
    setFormItems(formItems.filter((item) => item.id !== idToRemove));
  };

  return (
    <div className="font-serif">
      Commodity Information
      <Box className="rounded-lg p-4 border-4 border-indigo-500/100 bg-white">
        <div
          onClick={addFormItem}
          className="flex pb-2 items-center cursor-pointer"
        >
          <Typography className="font-serif pr-2">Add commodity</Typography>
          <Tooltip title="Add new commodity">
            <FaRegPlusSquare className="size-5.5" />
          </Tooltip>
        </div>
        {formItems.map((item) => (
          <>
            <div
              key={item.id}
              className="pr-4 pl-4 border border-gray-300 rounded flex items-center justify-between bg-gray-100"
            >
              <div className="flex items-center">
                <Typography className="font-serif mr-4">Description:</Typography>
                <div className="flex-1">
                  <AppTextInput value="Enter commodity description" />
                </div>
              </div>
              <div className="flex items-center">
                <Typography className="font-serif mr-4">Quantity:</Typography>
                <AppTextInput value="Enter commodity quantity" />
              </div>
              <div className="flex items-center">
                <Typography className="font-serif mr-4">Unit:</Typography>
                <AppTextInput value="Enter commodity unit" />
              </div>
              <div onClick={() => removeFormItem(item.id)}>
                <MdDeleteForever className="size-8 cursor-pointer" />
              </div>
            </div>
            <div className='pb-2'></div>
          </>
        ))}
      </Box>
    </div>
  );
};

