import { useState } from 'react';
import AppButton from './AppButton';
import AppModal from './AppModal';

export default function AppRejectModal({
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
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConfirm = () => {
    onConfirm(inputValue);
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
          disabled={disableConfirmBtn}
          title={confirmText}
        ></AppButton>
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
        ></AppButton>
      }
    >
      {/* {icon && <div className={cx('ic__trash')}>{icon}</div>} */}
      {title && (
        <div className="font-semibold text-[15px] mb-[2px]">{title}</div>
      )}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter rejection reason..."
        className="input-class mb-4 p-2 w-full border rounded"
      />
      {children}
      {/* {description && (
          <div className={cx('remove__description')}>
            <RelevantUsersDetail relevantUsers={description}></RelevantUsersDetail>
          </div>
        )} */}
    </AppModal>
  );
}
