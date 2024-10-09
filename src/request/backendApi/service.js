import axios from 'axios'
import {backend_url} from '../../configuration/config'
import store from '../../storage'
import {isDevOrLocalEnv} from '../../utils/runtime'

const service = axios.create({
    baseURL: backend_url,
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
    crossdomain: true,
})

service.interceptors.request.use(config => {
    // console.log('base', base)
    if (isDevOrLocalEnv()) {
        config.headers['x-aanet-user'] = store.getState().requestHeaderUserId;
        config.headers['x-aanet-group'] = store.getState().requestHeaderGroupId;
    }
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Expose-Headers'] = 'Content-Length,Content-Range';
    config.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    config.headers['Cache-Control'] = 'no-store, no-cache';
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Security-Policy'] = 'upgrade-insecure-requests';
    return config;
})

service.interceptors.response.use(response => {
    return response
}, error => {
    let message = error.message;

    // GPT系の500エラーは表示
    if (error.response &&
        error.response.status === 500 &&
        error.response.config &&
        error.response.config.url.indexOf('chat-gpt') > -1) {
        return Promise.reject(error);
    }

    // 組織登録 csvダウンロードエラーは表示
    if ((error.message === 'Network Error' &&
            (error.config.url.indexOf('/department/export') > -1 || error.config.url.indexOf('/department/import/history') > -1)) ||
        (error.response &&
            error.response.status === 500 &&
            error.response.config &&
            (error.response.config.url.indexOf('/department/export') > -1 || error.response.config.url.indexOf('/department/import/history') > -1))
    ) {
        return Promise.reject(error);
    }

    // 401 / cors / network faild / 500
    if (error.response && error.response.status === 401) {
        writePage('このサイトは利用者が限定されており、閲覧することはできません。')
    } else if (error.response && error.response.status === 500) {
        writePage('サーバ内部エラー。')
    } else if (message.toLowerCase().indexOf('cors') >= 0) {
        writePage(message)
    } else if (error.response && error.response.status === 504) {
        writePage("サーバ同士の通信にエラーが発生しているため、ウェブページが表示できません。")
    } else if (error.message === 'Network Error') {
        writePage('ネットワークに問題があります。接続を確認してください。')
    }
    return Promise.reject(error);
})

const writePage = (errorMessage) => {
    document.open();
    document.write(`<p>${errorMessage}</p>`);
    document.close();
}

const serviceForFile = axios.create({
    baseURL: backend_url,
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
    crossdomain: true
})

serviceForFile.interceptors.request.use(config => {
    if (isDevOrLocalEnv()) {
        config.headers['x-aanet-user'] = store.getState().requestHeaderUserId;
        config.headers['x-aanet-group'] = store.getState().requestHeaderGroupId;
    }
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Expose-Headers'] = 'Content-Length,Content-Range';
    config.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
    config.headers['Access-Control-Allow-Headers'] = 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    config.headers['Cache-Control'] = 'no-store, no-cache';
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Security-Policy'] = 'upgrade-insecure-requests';
    return config;
})

export default service;

export {
    serviceForFile
}
