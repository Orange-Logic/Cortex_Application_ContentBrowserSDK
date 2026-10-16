import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const ORIGIN = window.location.origin.includes('localhost:')
  ? 'https://local.orangelogic.com'
  : window.location.origin;

const instance = axios.create({
  baseURL: ORIGIN,
  headers: {
    Accept: 'application/json, */*',
  },
  timeout: 15000,
});
instance.interceptors.response.use(
  (r) => r,
  (err) => {
    return Promise.reject(err);
  },
);
const http = setupCache(instance);


export default http;
