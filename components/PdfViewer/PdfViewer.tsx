import { CircularProgress, Tooltip } from '@mui/material';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import classNames from 'classnames/bind';
import { memo } from 'react';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { FaDownload } from 'react-icons/fa';
import AppLoading from '../AppLoading';
import styles from './PdfViewer.module.sass';
const cx = classNames.bind(styles);

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
    <div className={cx('pdf-viewer')} style={wrapperStyle}>
      <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
        <div
          style={{
            position: 'relative',
            height: '100%',
          }}
        >
          <div className={cx('pdf-tool__wrapper')}>
            <div className={cx('pdf-tool')}>
              <div className={cx('left')}>
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
              <div className={cx('center')}>
                <CurrentPageLabel>
                  {(props) => (
                    <span
                      style={{
                        fontWeight: '500',
                      }}
                    >
                      {`Page ${props.currentPage + 1} / ${props.numberOfPages}`}
                    </span>
                  )}
                </CurrentPageLabel>
              </div>
              <Zoom levels={[0.4, 0.8, 1.2, 1.6, 2.4, 3.2]} />
              {hasDownloadBtn ? (
                <div className={cx('right')}>
                  {!isDownloadFileHasName ? (
                    <DownloadButton />
                  ) : (
                    <Tooltip title="Download">
                      <a
                        className={cx('pdf-icon-download')}
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
                <Tooltip title="Cannot download">
                  <a
                    className={cx('pdf-icon-download')}
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
              renderLoader={() => <CircularProgress />}
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
