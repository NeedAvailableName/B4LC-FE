import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
});
const ocr = axios.create({
  baseURL: process.env.NEXT_PUBLIC_OCR_API,
});
export { api, ocr };
