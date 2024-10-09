import FileImport from './FileImportClass'
import { isDevEnv, isDevFeatureEnv, isStageEnv, isProdEnv } from "../utils/runtime";
import { getLocationRefreshCount } from './util';

class NewGifMapClass {

    avatarkey = null; // persona avatar key eg: 20_F, 20S_F, under folder path dir name
    emotionKey = null; // persona emotial key eg: excellent, talk, last 
    cacheName = null; // cache name
    rImg = null; // return value
    fileArr = [] // imported each file array
    host = isDevEnv()?window.location.origin:window.location.href.replace(window.location.hash,''); // current host
    staticPath = null; // static img file path
    url = null; // local url
    cacheUrl = null // cache url remove encrypt name behind file name

    constructor(avatarkey, emotionKey) {
        this.avatarkey = avatarkey;
        this.emotionKey = emotionKey;
        this.fileImport = new FileImport();
        this.requiredParameter();
        this.importFile();
    }

    setCacheURL() {
        if(isDevEnv()){
            if (!this.url) return false;

            // url split
            let split = (this.url).split('/')

            // filename split and remove encrypt name
            let fileName = (split[split.length - 1]).split('.')
            fileName.splice(fileName.length - 2, 1)
            fileName = fileName.join('.')
    
            split.splice(split.length - 1, 1)
            split = split.join('/')
    
            this.cacheUrl = `${split}/${fileName}`
        }else{
            // pro / stg / azureStg
            if (!this.url) return false;
            // url split
            // 1 = hascode
            let split = this.url.split('/')
            let fileName = (split[split.length - 1]).split('.')
            fileName.splice(fileName.length - 2, 1)
            split.splice(split.length - 1, 1)
            this.cacheUrl = `${split}/${fileName}`.replace('//','/');
        }
        
    }

    requiredParameter() {
        // required parameter
        if (!this.avatarkey) return false;
    }

    importFile() {
        let f_name = `f_${this.avatarkey}`
        if(this.avatarkey)
        {
            //get key from FileImport class eg: this.fileImport.f_20S_F()
            let file = this.fileImport[f_name]();
            this.fileArr = file
        }
        return false;
    }

    async searchFile() {
        // int file key
        let key = this.emotionKey ? `${this.avatarkey}_${this.emotionKey}`: this.avatarkey;

        //set return image file
        this.staticPath = this.fileArr[key]
        this.url = `${this.host}${this.fileArr[key]}`.replace(`/1.`,'/.')
        this.cacheName = key;

        this.setCacheURL()

        // get in cachae value
        let getCacheData = await this.searchInCache()

        if (getCacheData) {
            return getCacheData;
        } else {
            // if not, store
            return await this.changeURLToBase64();
        }
    }

    async searchInCache() {
        // get in cache
        let cachedData = await this.cacheGet()

        if (cachedData) {
            return cachedData;
        }

        return false;
    }

    async cacheGet() {
        const cacheStorage = await caches.open(this.cacheName);
        const cachedResponse = await cacheStorage.match(this.cacheUrl);
        if (!cachedResponse || !cachedResponse.ok) {
            return false;
        }

        return await cachedResponse.json();
    }

    cachePut(base64) {
        if ('caches' in window) {
            let data = new Response(JSON.stringify(base64));
            // Opening given cache and putting our data into it
            caches.open(this.cacheName).then((cache) => {
                return cache.put(this.cacheUrl, data);
            });
        }

    }

    async changeURLToBase64() {
        const data = await fetch(this.url);
        const blob = await data.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                this.cachePut(base64data)
                resolve(base64data);
                return base64data;
            }
        });
    }

    async getFile() {

        return await this.searchFile();
    }

}

async function getGifImage(avatarkey, emotionKey) {
    return await new NewGifMapClass(avatarkey, emotionKey).getFile()
}

export default getGifImage