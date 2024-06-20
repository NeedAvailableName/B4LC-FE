import React, { useState } from 'react';
import AppButton from './AppButton';
import AppModal from './AppModal';

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
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
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
            backgroundColor: '#D92D20',
            ...submitBtnStyle,
          }}
          disabled={disableConfirmBtn || !selectedOption}
          title={confirmText}
          onClick={handleConfirm}
        />
      }
      onConfirm={handleConfirm}
      cancelBtn={
        <AppButton
          additionalStyle={{
            backgroundColor: '#F0F2FA',
            color: '#616879',
            border: '1px solid #e9e9e9',
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
        {options.map((option, index) => (
          <div
            key={index}
            className={`p-2 cursor-pointer border rounded mb-2 ${selectedOption === option ? 'bg-blue-200' : 'bg-white'}`}
            onClick={() => handleOptionChange(option)}
          >
            {option}
          </div>
        ))}
      </div>
      {children}
    </AppModal>
  );
}
