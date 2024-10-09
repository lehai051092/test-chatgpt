import { isDevEnv, isDevFeatureEnv, isStageEnv, isProdEnv } from "../utils/runtime";

let base_url = '/apigw/va2roleplay/va2/';
let backend_url = '';
let server_origin = '';
let feign_url = '';
let cognitive_server_url = '';

const PATH = process.env.REACT_APP_CURRENT_BASE_URL;

if(PATH){
    backend_url = PATH;
}else{
    if(isProdEnv()){
        // full path
        // backend_url = "https://aflac.platformerfuji.com/apigw/va2roleplay/va2/backend/robot-trainer";
        // server_origin = "https://aflac.platformerfuji.com";

        // adaptation for azuread authentication
        if(window.location.pathname.includes('azuread')){
            base_url = '/apigw/va2/azuread/mvp2/';
        }
        backend_url = `${window.location.origin}${base_url}backend/robot-trainer`;
        feign_url = `${window.location.origin}${base_url}auth`;
        cognitive_server_url = `${base_url}proxy`;
        server_origin = window.location.origin;
    }else if(isStageEnv()){
        // full path
        // backend_url = "https://st-aflac.platformerfuji.com/apigw/va2roleplay/va2/backend/robot-trainer";
        // server_origin = "https://st-aflac.platformerfuji.com";

        // adaptation for azuread authentication
        if(window.location.pathname.includes('azuread')){
            base_url = '/apigw/va2/azuread/mvp2/';
        }
        backend_url = `${window.location.origin}${base_url}backend/robot-trainer`;
        feign_url = `${window.location.origin}${base_url}auth`;
        cognitive_server_url = `${base_url}proxy`;
        server_origin = window.location.origin;
    } else if(isDevEnv()){
        // full path, different from stage or prod
        // backend_url = "https://phase2-va2-mvp2-dev.japaneast.cloudapp.azure.com/backend/robot-trainer";
        // server_origin = "https://phase2-va2-mvp2-dev.japaneast.cloudapp.azure.com";

        backend_url = `${window.location.origin}/backend/robot-trainer`;
        feign_url = `${window.location.origin}${base_url}auth`;
        cognitive_server_url = `/proxy`;
        server_origin = window.location.origin;
    }else if(isDevFeatureEnv()){
        // backend_url = "https://phase2-va2-mvp2-dev.japaneast.cloudapp.azure.com/backend/robot-trainer";
        // server_origin = "https://phase2-va2-mvp2-dev.japaneast.cloudapp.azure.com";

        backend_url = `${window.location.origin}/backend/robot-trainer`;
        feign_url = `${window.location.origin}${base_url}auth`;
        cognitive_server_url = `/proxy`;
        server_origin = window.location.origin;
    } else {
        // dev
        server_origin = "https://phase2-va2-mvp2-dev.japaneast.cloudapp.azure.com"; 
        // proxy
        // server_origin = "http://localhost:3001";
        // auth
        // server_origin = "http://localhost:3002";
        backend_url = "https://phase2-va2-mvp2-dev.japaneast.cloudapp.azure.com/backend/robot-trainer";
        // backend_url = "http://10.10.216.143:9090"
        feign_url = `http://phase2-va2-mvp2-dev.japaneast.cloudapp.azure.com/auth`;
        cognitive_server_url = `/proxy`;
    }
}

export default backend_url;

export { 
    base_url,
    backend_url, 
    server_origin, 
    feign_url, 
    cognitive_server_url
};
