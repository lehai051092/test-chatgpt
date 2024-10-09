/**
 * @description main entrance for requesting outer services
 * @since 2021/07/16
 * @example  prod https://mule-prod.aflac.co.jp/xas/mst/api/v1/slsmn-sts/getAllTraineesForAgentCompany
 *           dev https://mule-dev.aflac.co.jp/dev/xas-1/mst/api/v1/slsmn-sts/getAllTraineesForAgentCompany
 */
import axios from 'axios';
import { encodeJWT, getUUID, encodeBase64 } from '../../utils/encrypt';
import { feign_url } from '../../configuration/config';
import { isDevEnv, isDevFeatureEnv, isDevOrLocalEnv, isProdEnv, isStageEnv } from '../../utils/runtime';
import {    
    AGENT_MST,
    GET_AGENT_COMPANY,
    GET_EMPLOYEE_INFO,
    GET_ALL_TRAINEES_FOR_AGENT_COMPANY 
} from './mockData'

function getAgentInfo(params){
    return new Promise((resolve, reject)=>{
        
        let url = '';
        let real_params = {};
        if(isProdEnv()){
            url = '/proxy/xas/v1/mst/api/v1/agnt-mst'
            if(params){
                real_params = params;
            } else {
                real_params = {
                    agntCde: '2019515',
                    agstCde: '036'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        } else if(isDevOrLocalEnv()){
            url = '/dev/xas-1/mst/api/v1/agnt-mst';
            if(params){
                real_params = params;
            } else {
                real_params = {
                    agntCde: '2019515',
                    agstCde: '036'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        } else if(isStageEnv()){
            url = '/st/proxy/xas/v1/mst/api/v1/agnt-mst';
            if(params){
                real_params = params;
            } else {
                real_params = {
                    agntCde: '2019515',
                    agstCde: '036'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        }
    })
}

function getEmployeeInfo(params){
    return new Promise((resolve, reject)=>{
        
        let url = '';
        let real_params = {};
        if(isProdEnv()){
            url = '/proxy/xas/v1/mst/api/v1/slsmn-sts'
            if(params){
                real_params = params;
            } else {
                real_params = {
                    salsmanCde: '00FTKIA006334'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        } else if(isDevOrLocalEnv()){
            url = '/dev/xas-1/mst/api/v1/slsmn-sts';
            if(params){
                real_params = params;
            } else {
                real_params = {
                    salsmanCde: '00FTKIA006334'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        } else if(isStageEnv()){
            url = '/st/proxy/xas/v1/mst/api/v1/slsmn-sts';
            if(params){
                real_params = params;
            } else {
                real_params = {
                    agntCde: '2019515',
                    agstCde: '036'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        }
    })
}

function getAgentCompany(params){
    return new Promise((resolve, reject)=>{
        
        let url = '';
        let real_params = {};
        if(isProdEnv()){
            url = '/proxy/xas/v1/mst/api/v1/agst-mst/getAgentCompany'
            if(params){
                real_params = params;
            } else {
                real_params = {
                    agntCde: '2019515',
                    agstCde: '036'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        } else if(isDevOrLocalEnv()){
            url = '/dev/xas-1/mst/api/v1/agst-mst/getAgentCompany';
            if(params){
                real_params = params;
            } else {
                real_params = {
                    agntCde: '2019515',
                    agstCde: '036'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        } else if(isStageEnv()){
            url = '/st/proxy/xas/v1/mst/api/v1/agst-mst/getAgentCompany';
            if(params){
                real_params = params;
            } else {
                real_params = {
                    agntCde: '2019515',
                    agstCde: '036'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        }
    })
}

function getAllTraineesForAgentCompany(params){
    return new Promise((resolve, reject)=>{
        
        let url = '';
        let real_params = {};
        if(isProdEnv()){
            url = '/proxy/xas/v1/mst/api/v1/slsmn-sts/getAllTraineesForAgentCompany'
            if(params){
                real_params = params;
            } else {
                console.log('No reasonable query params, calling MasterDB aborted!')
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        }else if(isDevOrLocalEnv()){
            url = '/dev/xas-1/mst/api/v1/slsmn-sts/getAllTraineesForAgentCompany';
            if(params){
                real_params = params;
            } else {
                real_params = {
                    agntCde: '2610441',
                    agstCde: '003'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        } else if(isStageEnv()){
            url = '/st/proxy/xas/v1/mst/api/v1/slsmn-sts/getAllTraineesForAgentCompany';
            if(params){
                real_params = params;
            } else {
                real_params = {
                    agntCde: '2019515',
                    agstCde: '036'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        }
    })
}

function getBranchInfo(params){
    return new Promise((resolve, reject)=>{
        
        let url = '';
        let real_params = {};
        if(isProdEnv()){
            url = '/proxy/xas/v1/mst/api/v1/agst-mst'
            if(params){
                real_params = params;
            } else {
                console.log('No reasonable query params, calling MasterDB aborted!')
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        }else if(isDevOrLocalEnv()){
            url = '/dev/xas-1/mst/api/v1/agst-mst';
            if(params){
                real_params = params;
            } else {
                real_params = {
                    agntCde: '2610441',
                    agstCde: '003'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        } else if(isStageEnv()){
            url = '/st/proxy/xas/v1/mst/api/v1/agst-mst';
            if(params){
                real_params = params;
            } else {
                real_params = {
                    agntCde: '2019515',
                    agstCde: '036'
                };
            }
            callMstDB('GET', url, real_params).then((result)=>{
                resolve(result);
            })
        }
    })
}

function callMstDB(method, subUrl, params){
    return new Promise((resolve, reject)=>{
        if(isDevOrLocalEnv() || isDevFeatureEnv()){
            console.log(`Mock data of MasterDB data represented!`)
            switch(subUrl){
                case '/dev/xas-1/mst/api/v1/agnt-mst':
                    resolve(AGENT_MST);
                    break;
                case '/dev/xas-1/mst/api/v1/slsmn-sts':
                    resolve(GET_EMPLOYEE_INFO);
                    break;
                case '/dev/xas-1/mst/api/v1/agst-mst/getAgentCompany':
                    resolve(GET_AGENT_COMPANY);
                    break;
                case '/dev/xas-1/mst/api/v1/slsmn-sts/getAllTraineesForAgentCompany':
                    resolve(GET_ALL_TRAINEES_FOR_AGENT_COMPANY);
                    break;
            }
        } else {
            let real_url = feign_url;
            let authUrl = subUrl.split('/')[subUrl.split('/').length - 1];
            const service = axios.create({
                baseURL: real_url,
                headers: { 'Content-Type': 'application/json' },
              })
            
            const salt = encodeBase64('202107220302');
            service({
                method: 'GET',
                url: `/api/v1/${authUrl}`,
                params: {
                    salt: salt,
                    method: method,
                    params: params,
                    url: subUrl
                }
            }).then(result=>{
                if(result.data){
                    resolve(result.data)
                } else {
                    reject();
                }
            })
        }
    })
}

export {
    getAgentInfo,
    getAgentCompany,
    getEmployeeInfo,
    getAllTraineesForAgentCompany,
    getBranchInfo
}