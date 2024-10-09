/**
 * This file offers common judgement for application runtime
 */
const runtime = process.env.REACT_APP_CURRENT_ENV;

function isDevEnv(){
    return 'dev' == runtime;
}

function isDevFeatureEnv(){
    return 'dev2' == runtime;
}

function isStageEnv(){
    return 'stage' == runtime;
}

function isProdEnv(){
    return 'prod' == runtime;
}

function isDevOrLocalEnv(){
    return !runtime || 'dev' == runtime || 'dev2' == runtime;
}

export {
    isDevEnv,
    isDevFeatureEnv,
    isStageEnv,
    isProdEnv,
    isDevOrLocalEnv
}

/**
 * constraints by runtime
 */

function getManualUrl(){
    if('dev' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-dev-container/募集人育成AI利用マニュアル_アソシエイツ版_220719_Ver.2.79.pdf";
    }else if('stage' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-stage-container/募集人育成AI利用マニュアル_アソシエイツ版_220719_Ver.2.79.pdf";
    }else if('prod' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-prod-container/募集人育成AI利用マニュアル_アソシエイツ版_220719_Ver.2.79.pdf";
    } else {
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-dev-container/募集人育成AI利用マニュアル_アソシエイツ版_220719_Ver.2.79.pdf";
    }
}

function getManualUrl2(){
    if('dev' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-dev-container/端末・ブラウザの音声入力をオンにする方法_V1.1.pdf";
    }else if('stage' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-stage-container/端末・ブラウザの音声入力をオンにする方法_V1.1.pdf";
    }else if('prod' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-prod-container/端末・ブラウザの音声入力をオンにする方法_V1.1.pdf";
    } else {
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-dev-container/端末・ブラウザの音声入力をオンにする方法_V1.1.pdf";
    }
}

function getManualUrl3(){
    if('dev' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-dev-container/（iPhone用）AANET証明書導入マニュアル_AI版_0719.pdf";
    }else if('stage' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-stage-container/（iPhone用）AANET証明書導入マニュアル_AI版_0719.pdf";
    }else if('prod' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-prod-container/（iPhone用）AANET証明書導入マニュアル_AI版_0719.pdf";
    } else {
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-dev-container/（iPhone用）AANET証明書導入マニュアル_AI版_0719.pdf";
    }
}

function getManualUrl4(){
    if('dev' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-dev-container/（iPad用）AANET証明書導入マニュアル_AI版_0719.pdf";
    }else if('stage' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-stage-container/（iPad用）AANET証明書導入マニュアル_AI版_0719.pdf";
    }else if('prod' == runtime){
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-prod-container/（iPad用）AANET証明書導入マニュアル_AI版_0719.pdf";
    } else {
        return "https://mvp2account.blob.core.windows.net/phase2-mvp2-dev-container/（iPad用）AANET証明書導入マニュアル_AI版_0719.pdf";
    }
}

function getRedirectMVP1Url(){
    let url = '';
    let isAzureAD = window.location.pathname.includes('azuread');
    switch(runtime){
      case 'dev':
        url = "https://va2-roleplay.japaneast.cloudapp.azure.com/";
        break;
      case 'stage':
        url = "https://st-aflac.platformerfuji.com/apigw/va2roleplay/";
        if(isAzureAD){
            url = "https://si4ata01.aflac.aflac.co.jp/web01/asp/ServletAspMain?contents-id=122";
        }
        break;
      case 'prod':
        url = "https://aflac.platformerfuji.com/apigw/va2roleplay/";
        if(isAzureAD){
            url = "https://edges.aflac.aflac.co.jp/web01/asp/ServletAspMain?contents-id=122";
        }
        break;
      default:
        url = window.location.origin;
        break;
    }
    return url;
}

export {
    getManualUrl,
    getManualUrl2,
    getManualUrl3,
    getManualUrl4,
    getRedirectMVP1Url,
    runtime
}