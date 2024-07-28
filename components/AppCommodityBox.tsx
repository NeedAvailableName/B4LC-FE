import { Box, Typography, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import AppTextInput from './AppTextInput';
import { FaRegPlusSquare } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

export default function AppCommodityBox({ ...props }) {
  const [formItems, setFormItems] = useState([{ id: 1 }]);

  const addFormItem = () => {
    setFormItems([...formItems, { id: formItems.length + 1 }]);
  };

  const removeFormItem = (indexToRemove) => {
    setFormItems(formItems.filter((item, index) => index !== indexToRemove));
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = formItems.map((item, idx) =>
      idx === index ? { ...item, [field]: value } : item,
    );
    setFormItems(updatedItems);
    props.onChange(updatedItems);
  };

  return (
    <div className="">
      Commodity Information
      <Box className="rounded-lg p-4 border-4 border-indigo-500/100 bg-white">
        <div
          onClick={addFormItem}
          className="flex pb-2 items-center cursor-pointer"
        >
          <Typography className=" pr-2">Add commodity</Typography>
          <Tooltip title="Add new commodity">
            <FaRegPlusSquare className="size-5.5" />
          </Tooltip>
        </div>
        {formItems.map((item, index) => (
          <>
            <div
              key={index}
              className="pr-4 pl-4 border border-gray-300 rounded flex items-center justify-between bg-gray-100"
            >
              <div className="flex items-center">
                <Typography className=" mr-4">Description:</Typography>
                <div className="flex-1">
                  <AppTextInput
                    placeholder="Enter description"
                    onChange={(event) =>
                      handleInputChange(
                        index,
                        'description',
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>
              <div className="flex items-center">
                <Typography className=" mr-4">Quantity:</Typography>
                <AppTextInput
                  placeholder="Enter quantity"
                  onChange={(event) =>
                    handleInputChange(index, 'quantity', event.target.value)
                  }
                />
              </div>
              {/* <div className="flex items-center">
                <Typography className=" mr-4">Unit:</Typography>
                <AppTextInput
                  placeholder="Enter unit"
                  onChange={(event) =>
                    handleInputChange(index, 'unit', event.target.value)
                  }
                />
              </div> */}
              <div onClick={() => removeFormItem(index)}>
                <MdDeleteForever className="size-8 cursor-pointer" />
              </div>
            </div>
            <div className="pb-2"></div>
          </>
        ))}
      </Box>
    </div>
  );
}
