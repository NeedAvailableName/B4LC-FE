import * as Dialog from '@radix-ui/react-dialog';
import classNames from 'classnames/bind';
import { useRef } from 'react';
import { ENABLED_THEMES } from '../../app-configs/theme.enable';
import styles from './AppModal.module.sass';

const cx = classNames.bind(styles);
function AppModal({
  closeRef,
  closeIcon,
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
  const internalCloseRef = useRef();
  const close = closeRef ?? internalCloseRef;

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
      close?.current?.click();
    }, 100);
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <Dialog.Trigger asChild>
        <div
          style={{ width: is100 ? '100%' : '', height: triggerBtnStyle }}
          className={cx('trigger-btn')}
        >
          {triggerBtn}
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={cx('DialogOverlay')} />
        <Dialog.Content
          style={{
            width: width,
            height: height,
            ...contentStyle,
            ...ENABLED_THEMES.styles,
          }}
          className={cx('DialogContent')}
        >
          {children}
          <div
            onKeyDown={handleKeyDown}
            style={
              cancelBtn || submitBtn
                ? {
                    display: 'flex',
                    justifyContent: btnJustifyContent
                      ? btnJustifyContent
                      : 'flex-end',
                    gap: '16px',
                    ...btnBoxStyle,
                  }
                : {}
            }
          >
            {cancelBtn && <div onClick={handleCancel}>{cancelBtn}</div>}
            {submitBtn && <div onClick={handleConfirm}>{submitBtn}</div>}
          </div>
          {closeIcon && (
            <Dialog.Close asChild>
              <div aria-label="Close" className={cx('closeBtn')} ref={close}>
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
