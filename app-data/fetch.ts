// @ts-nocheck
import axios from "axios";
import { Configs, REFRESH_TOKEN_KEY, TOKEN_KEY } from "../app-configs";
import { appStorage } from '../services/AppStorage';

export const getOptions = (options: any) => {
  const opts = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const token = appStorage.getItem(TOKEN_KEY);
  if (token) {
    opts.headers.Authorization = 'Bearer ' + token;
  }
  return opts;
};

export const getTokenSource = () => {
  return axios.CancelToken.source();
};

export const GET = (path: any, params: any, options = {}) => {
  const _params = params
    ? Object.keys(params)
        .map((key) => {
          let valueParam = params[key];
          let adjustParam = '';
          if (Array.isArray(valueParam)) {
            // TODO with "all" value;
            adjustParam = valueParam
              .map((paramDetail) => `${key}=${encodeURIComponent(paramDetail != 'all' ? paramDetail : '')}`)
              .join('&');
          } else {
            // TODO with "all" value;
            valueParam = valueParam != 'all' ? valueParam : '';
            adjustParam = `${key}=${encodeURIComponent(valueParam)}`;
          }
          return adjustParam;
        })
        .join('&')
    : '';

  const _url = (options?.isFullPath ? path : Configs?.BASE_API + path) + (_params === '' ? '' : '?' + _params);

  const _options = getOptions(options);
  _options.urlPath = path;

  return axios.get(_url, _options).then((response) => response.data);
};

export const POST = (path: any, params: any, options = {}) => {
  const _url = options.isFullPath ? path : Configs.BASE_API + path;
  const _options = getOptions(options);
  _options.urlPath = path;

  return axios.post(_url, params, _options).then((response) => response.data);
};

export const PUT = (path: any, params: any, options = {}) => {
  const _url = options.isFullPath ? path : Configs.BASE_API + path;
  const _options = getOptions(options);
  _options.urlPath = path;

  return axios.put(_url, params, _options).then((response) => response.data);
};

export const PATCH = (path: any, params: any, options = {}) => {
  const _url = options.isFullPath ? path : Configs.BASE_API + path;
  const _options = getOptions(options);
  _options.urlPath = path;

  return axios.patch(_url, params, _options).then((response) => response.data);
};

export const DELETE = (path: any, params: any, options = {}) => {
  const _url = options.isFullPath ? path : Configs.BASE_API + path;
  const _options = getOptions(options);
  _options.urlPath = path;

  // delete with params;

  if (params) {
    _options.data = params;
  }

  return axios.delete(_url, _options).then((response) => response.data);
};

export const UPLOAD = (path: any, files: any, options: { isFullPath: any; }, onProgress = () => {}) => {
  const _url = options.isFullPath ? path : Configs.BASE_API + path;

  const _form = new FormData();
  _form.append('type', files.type);
  _form.append('files', files);

  const _options = getOptions(options);
  _options.headers['Content-Type'] = 'multipart/form-data';
  _options.onUploadProgress = onProgress;
  _options.urlPath = path;

  return axios.post(_url, _form, _options).then((response) => response.data);
};

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (err) {
    const originalConfig = err.config;
    if (originalConfig?.urlPath !== '/auth/login' && err.response) {
      if (err.response.status === 401 && !originalConfig._retry && appStorage.getItem(REFRESH_TOKEN_KEY)) {
        originalConfig._retry = true;
        try {
          const rs = await axios.post(Configs.BASE_API + '/auth/refresh', {
            refreshToken: appStorage.getItem(REFRESH_TOKEN_KEY),
          });
          if (rs.data?.accessToken) appStorage.setItem(TOKEN_KEY, rs.data?.accessToken);
          if (rs.data?.refresh_token) appStorage.setItem(REFRESH_TOKEN_KEY, rs.data?.refreshToken);

          originalConfig.headers.Authorization = 'Bearer ' + rs.data?.accessToken;
          return await axios(originalConfig);
        } catch (_err) {
          return Promise.reject(_err);
        }
      }
    }
    if (err.response && err.response.data) {
      return Promise.reject(err.response.data);
    }
    return Promise.reject(err);
  },
);
