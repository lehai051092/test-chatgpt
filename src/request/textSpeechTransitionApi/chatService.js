import axios from 'axios'; // import axios
import { server_origin, cognitive_server_url } from '../../configuration/config';
import store from '../../storage';
import { isDevOrLocalEnv, isStageEnv, isProdEnv } from '../../utils/runtime'

const service = axios.create({
  baseURL: server_origin + cognitive_server_url,
  headers: { 'Content-Type': 'application/json' },
})

service.interceptors.request.use(config => {
  if(isDevOrLocalEnv()){
    config.headers['x-aanet-user'] = store.getState().requestHeaderUserId;
    config.headers['x-aanet-group'] = store.getState().requestHeaderGroupId;
  }
  config.headers['Cache-Control'] = 'no-store, no-cache';
  config.headers['Accept'] = 'application/json';
  return config;
})

service.interceptors.response.use(response => {
  return response
}, error => {
  console.log('error ', error)
  return Promise.reject(error);
})

export default service;
