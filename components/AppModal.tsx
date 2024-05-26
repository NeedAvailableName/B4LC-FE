import * as Dialog from '@radix-ui/react-dialog';
import { useRef } from 'react';
import styles from './AppModal.module.sass';
import { IcCloseWithNoBg } from '../assets/svgs/index';

function AppModal({
  closeRef,
  closeIcon = <IcCloseWithNoBg />,
  onOpenChange,
  hasCloseAfterConfirm = true,
  onConfirm = () => {},
  onCancel = () => {},
  isOpen,
  triggerBtn,
  is100,
  triggerBtnStyle,
  contentStyle,
  btnBoxStyle,
  btnJustifyContent,
  width,
  height,
  children,
  cancelBtn,
  submitBtn,
}) {
  const close = closeRef ?? useRef();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onConfirm(e);
      hasCloseAfterConfirm &&
        setTimeout(() => {
          close.current.click();
        }, 100);
    }
  };

  const handleConfirm = (e) => {
    onConfirm(e);
    hasCloseAfterConfirm &&
      setTimeout(() => {
        close.current.click();
      }, 100);
  };
  const handleCancel = (e) => {
    onCancel(e);
    setTimeout(() => {
      close.current.click();
    }, 100);
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Trigger asChild>
        <div style={{ width: is100 ? '100%' : '', height: triggerBtnStyle }} className=''>
          {triggerBtn}
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className=''/>
        <Dialog.Content
          style={{ width: width, height: height, ...contentStyle}}
          className=''>
          {children}
          <div
            onKeyDown={handleKeyDown}
            style={
              cancelBtn || submitBtn
                ? {
                    display: 'flex',
                    justifyContent: btnJustifyContent ? btnJustifyContent : 'flex-end',
                    gap: '16px',
                    ...btnBoxStyle,
                  }
                : {}
            }>
            {cancelBtn && <div onClick={handleCancel}>{cancelBtn}</div>}
            {submitBtn && <div onClick={handleConfirm}>{submitBtn}</div>}
          </div>
          {closeIcon && (
            <Dialog.Close asChild>
              <div aria-label="Close" className='' ref={close}>
                {closeIcon}
              </div>
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default AppModal;
