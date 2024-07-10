import React, { useState } from 'react';
import AppButton from './AppButton';
import AppModal from './AppModal';
import AppRadio from './AppRadio';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

export default function AppSelectModal({
  options = [],
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
  ...props
}) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption((event.target as HTMLInputElement).value);
  };

  const handleConfirm = () => {
    onConfirm(selectedOption);
  };

  return (
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
      submitBtn={
        <AppButton
          isLoading={isLoading}
          additionalStyle={{
            backgroundColor: '#005aab',
            color: '#FFFFFF',
            ...submitBtnStyle,
          }}
          disabled={disableConfirmBtn || !selectedOption}
          title={confirmText}
        />
      }
      onConfirm={handleConfirm}
      cancelBtn={
        <AppButton
          additionalStyle={{
            backgroundColor: '#D92D20',
            color: '#FFFFFF',
            ...cancelBtnStyle,
          }}
          title={cancelText}
        />
      }
    >
      {/* {icon && <div className="icon-class">{icon}</div>} */}
      {title && (
        <div className="font-semibold text-[15px] mb-[2px]">{title}</div>
      )}
      <div className="mb-4">
        {/* {options.map((option, index) => (
          <div
            key={index}
            className={`p-2 cursor-pointer border rounded mb-2 ${selectedOption === option ? 'bg-blue-200' : 'bg-white'}`}
            onClick={() => handleOptionChange(option)}
          >
            {option.title}
          </div>
        ))} */}
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            {options.map((option, index) => (
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={option.title}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
      {children}
    </AppModal>
  );
}
