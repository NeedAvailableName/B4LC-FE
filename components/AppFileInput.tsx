import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IcCloseBaseDoc } from '../assets/svgs';
import { IcFileUpload } from '../assets/svgs';
import { isExist } from '../helpers/check';
import { Tooltip } from '@mui/material';

function AppFileInput({
  label,
  name,
  required,
  displayRequied = false,
  disabled = false,
  placeholder = 'Tải file lên...',
  accept = '*',
  multiple = false,
  afterSelect = () => {},
  afterRemove = () => {},
  showUploaded = true,
  triggerBtn,
  styleLabel = { cursor: 'pointer', textDecoration: 'underline' },
  validate = {},
  errorMessageStyle = {},
  listFileUpload,
}) {
  const {
    register,
    // formState: { errors },
    formState,
    setValue,
    getValues,
  } = useFormContext();
  const [filesList, setFilesList] = useState([]);
  const clickIcon = useRef();
  const removeAllFiles = (e) => {
    e.stopPropagation();
    setFilesList([]);
    afterSelect([]);
    setValue(name, []);
    afterRemove();
  };
  useEffect(() => {
    if (!getValues(name)?.length) setFilesList([]);
  }, [getValues(name)]);
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };
  return (
    <div className='flex flex-col cursor-pointer'>
      {label && <label className='text-sm font-semibold justify-start mb-1 text-primary'>{label}</label>}
      {!disabled && (
        <input
          {...register(name, {
            ...(required ? { required: 'Vui lòng tải lên file' } : {}),

            validate: {
              validateCustom: (value, formValues) => {
                if (
                  isExist(value) &&
                  (listFileUpload ?? value).some((item) => encodeURIComponent(item?.name).length > 255)
                ) {
                  return 'Vui lòng rút ngắn tên file văn bản!';
                }
              },
              ...validate,
            },
            //
            onChange: (e) => {
              handleFileChange(e);
              const uploadedFiles = Array.from(e.target.files);
              if (uploadedFiles.length === 0) return;
              afterSelect(uploadedFiles);
              setFilesList(uploadedFiles);
              if (multiple) {
                const listFiles = [...(getValues(name) ?? [])];
                uploadedFiles?.forEach((file) => {
                  if (!listFiles?.map((e) => e.name).includes(file.name)) {
                    listFiles.push(file);
                  }
                });

                setValue(name, listFiles);
              } else setValue(name, uploadedFiles);
            },
          })}
          type="file"
          hidden
          ref={clickIcon}
          accept={accept}
          multiple={multiple}
        />
      )}

      {triggerBtn ? (
        <label style={styleLabel}>
          {triggerBtn}
        </label>
      ) : (
        <div
          className='bg-white flex border-border-dark px-2 pl-4 hover:cursor-pointer hover:shadow-custom'
          style={
            disabled
              ? {
                  backgroundColor: 'hsl(0, 0%, 95%)',
                  cursor: 'not-allowed',
                  boxShadow: 'none',
                }
              : {}
          }>
          {showUploaded && filesList.length > 0 && (
            <Tooltip title="Xóa file tải lên">
              <span className="" onClick={removeAllFiles}>
                <IcCloseBaseDoc color="var(--primary-color)" />
              </span>
            </Tooltip>
          )}
          <label
            style={{
              cursor: disabled ? 'not-allowed' : 'pointer',
              width: `calc( 100% - ${showUploaded && filesList.length > 0 ? '40px' : '26px'} )`,
              overflow: 'hidden',
            }}>
            {(filesList.length === 0 || !showUploaded) && (
              <span className=''>
                <span style={{ color: '#C3C6CC', fontWeight: '400', lineHeight: '40px' }}>
                  {placeholder.slice(0, 25)}
                </span>
              </span>
            )}

            {showUploaded && filesList.length > 0 && (
              <Tooltip
                title={`File văn bản: ${filesList?.reduce(
                  (result, value, index) => `${result}${index > 0 ? ', ' : ''} ${value?.name}`,
                  '',
                )}`}>
                <span
                  style={{
                    width: '100%',
                    lineHeight: '40px',
                  }}>
                  {filesList
                    ?.reduce((result, value, index) => `${result}${index > 0 ? ', ' : ''} ${value?.name}`, '')
                    .slice(0, 22)}
                </span>

                <span
                  style={{
                    color: 'var(--primary-color)',
                    marginLeft: '8px',
                    minWidth: '20px',
                  }}>
                  ({filesList.length} tệp)
                </span>
              </Tooltip>
            )}
          </label>
          <div className="" onClick={() => clickIcon.current.click()}>
            <IcFileUpload width={22} height={41} />
          </div>
        </div>
      )}

      {formState?.errors?.[name] && (
        <div className="" style={errorMessageStyle}>
          {formState?.errors?.[name].message}
        </div>
      )}
    </div>
  );
}

export default AppFileInput;
