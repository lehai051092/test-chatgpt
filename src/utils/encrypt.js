/**
 *  @description this JS is dedicated to generate a JWT format key for authentication
 *  @author SongDai
 *  @since 2021/07/15
 */

import crypto from 'crypto-browserify';

function encodeBase64(params){
    if(params){
        return window.btoa(params);
    }
    return '';
}

function getUUID(){
    let h = crypto.randomBytes(128).toString('hex');
    let uuid = h.substring(0,8)+ '-' + h.substring(8,12) + '-' + h.substring(12,16) + '-' + h.substring(16,20) + '-' + h.substring(20,32);
    return uuid;
}

export {
    encodeBase64,
    getUUID
};