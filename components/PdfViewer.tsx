import { Viewer, Worker } from '@react-pdf-viewer/core';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { memo } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Tooltip } from '@mui/material';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { AiFillCaretDown } from 'react-icons/ai';
import { AiFillCaretUp } from 'react-icons/ai';
import { FaDownload } from 'react-icons/fa';
import AppLoading from './AppLoading';

const pageLayout = {
  transformSize: ({ size }) => ({
    height: size.height + 20,
    width: size.width + 20,
  }),
};

function PdfViewer({
  url,
  isDownloadFileHasName = false,
  fileName = '',
  urlDownLoad = '',
  wrapperStyle = {},
  hasCheckHttpUrl = true,
  hasDownloadBtn = true,
  defaultScale,
}) {
  //   const getFilePluginInstance = getFilePlugin({
  //     fileNameGenerator: (file) => {
  //       console.log('🚀 ~ getFilePluginInstance ~ file:', file);
  //       // `file.name` is the URL of opened file
  //       const customFileName =
  //         fileName ||
  //         file.name
  //           .substring(file.name.lastIndexOf('/') + 1)
  //           ?.split('?')
  //           ?.substring(0, 1);
  //       console.log('🚀 ~ PdfViewer_getFilePluginInstance ~ customFileName:', customFileName);
  //       return customFileName;
  //     },
  //   });
  const zoomPluginInstance = zoomPlugin();

  const { Zoom } = zoomPluginInstance;

  const getFilePluginInstance = getFilePlugin();
  const { DownloadButton } = getFilePluginInstance;
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { CurrentPageLabel, GoToFirstPage, GoToLastPage } =
    pageNavigationPluginInstance;
  const checkUrlIsHttps = () => {
    if (!hasCheckHttpUrl) return url;
    return new RegExp('^(http|https)://').test(url) ? url : null;
  };
  return (
    <div className="" style={wrapperStyle}>
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
        <div
          style={{
            position: 'relative',
            height: '100%',
          }}
        >
          <div className="w-full h-full overflow-hidden">
            <div className="flex items-center justify-between bg-[#e1e4f3] border-b border-b-[rgba(0,0,0,0.1)] p-1 absolute left-0 right-0 top-[-1px] z-[999] opacity-0 wrapper hover:opacity-100">
              <div className="">
                <GoToFirstPage>
                  {(props) => (
                    <Tooltip title="Trang đầu">
                      <AiFillCaretUp
                        onClick={() => props.onClick()}
                        style={{ fontSize: '16px', margin: '0 10px' }}
                      />
                    </Tooltip>
                  )}
                </GoToFirstPage>
                <GoToLastPage>
                  {(props) => (
                    <Tooltip title="Trang cuối">
                      <AiFillCaretDown
                        onClick={() => props.onClick()}
                        style={{ fontSize: '16px' }}
                      />
                    </Tooltip>
                  )}
                </GoToLastPage>
              </div>
              <div className="">
                <CurrentPageLabel>
                  {(props) => (
                    <span
                      style={{
                        fontWeight: '500',
                      }}
                    >
                      {`Trang ${props.currentPage + 1} / ${props.numberOfPages}`}
                    </span>
                  )}
                </CurrentPageLabel>
              </div>
              <Zoom levels={[0.4, 0.8, 1.2, 1.6, 2.4, 3.2]} />
              {hasDownloadBtn ? (
                <div className="">
                  {!isDownloadFileHasName ? (
                    <DownloadButton />
                  ) : (
                    <Tooltip title="Tải xuống">
                      <a
                        className=""
                        // download={fileName}
                        href={urlDownLoad}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <FaDownload />
                      </a>
                    </Tooltip>
                  )}
                </div>
              ) : (
                <Tooltip title="Không thể tải xuống">
                  <a
                    className="flex justify-center items-center p-1.5 rounded hover:bg-[#d3d3d3]"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FaDownload />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>

          {checkUrlIsHttps() && (
            <Viewer
              fileUrl={checkUrlIsHttps()}
              pageLayout={pageLayout}
              defaultScale={defaultScale || 1.2}
              renderLoader={() => <AppLoading />}
              plugins={[
                getFilePluginInstance,
                pageNavigationPluginInstance,
                zoomPluginInstance,
              ]}
            />
          )}
        </div>
      </Worker>
    </div>
  );
}

export default memo(PdfViewer);
