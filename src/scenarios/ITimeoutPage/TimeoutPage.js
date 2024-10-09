import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import MainLogo from '../../property/images/logo.png';
import BackgroundBase64 from './BackgroundBase64';
import { isStageEnv, isProdEnv } from '../../utils/runtime';
import { browserRedirect } from '../../utils/util';
import { loginOut } from "../../request/backendApi/api";

const STG_URLS = {
    employeeLink: 'https://si4ata01.aflac.aflac.co.jp/web01/asp/ServletAspMain?contents-id=126',
    associateLink: 'https://st-a-line.aflac.co.jp/web01/asp/ServletAspMain?contents-id=126'
}
const PROD_URLS = {
    employeeLink: 'https://edges.aflac.aflac.co.jp/web01/asp/ServletAspMain?contents-id=126',
    associateLink: 'https://a-line.aflac.co.jp/web01/asp/ServletAspMain?contents-id=126'
}
const AZUREAD_STG_URLS = {
    employeeLink: 'https://st-aflac.platformerfuji.com/apigw/va2/azuread/mvp2/',
    associateLink: 'https://st-a-line.aflac.co.jp/web01/asp/ServletAspMain?contents-id=126'
}
const AZUREAD_PROD_URLS = {
    employeeLink: 'https://aflac.platformerfuji.com/apigw/va2/azuread/mvp2/',
    associateLink: 'https://a-line.aflac.co.jp/web01/asp/ServletAspMain?contents-id=126'
}

const getAflacEmployeeLinkByEnv = () => {
    // adaptation for AzureAD authentication
    if(window.location.pathname.includes('azuread')){
        if(isStageEnv()){
            return AZUREAD_STG_URLS.employeeLink;
        } else if (isProdEnv()){
            return AZUREAD_PROD_URLS.employeeLink;
        } else {
            return '';
        }
    } else {
        if(isStageEnv()){
            return STG_URLS.employeeLink;
        } else if (isProdEnv()){
            return STG_URLS.employeeLink;
        } else {
            return '';
        }
    }
}

const getAssociateLinkByEnv = () => {
    // adaptation for AzureAD authentication
    if(window.location.pathname.includes('azuread')){
        if(isStageEnv()){
            return AZUREAD_STG_URLS.associateLink;
        } else if (isProdEnv()){
            return AZUREAD_PROD_URLS.associateLink;
        } else {
            return '';
        }
    } else {
        if(isStageEnv()){
            return STG_URLS.associateLink;
        } else if (isProdEnv()){
            return STG_URLS.associateLink;
        } else {
            return '';
        }
    }
}

const getDisplayByEnv = (employeeLink, associateLink) => {
    return <div>
        <p className={browserRedirect()!=1?styles.content_font_mobile_p:styles.content_font_p}>
        セッションがタイムアウトしました。
        </p>
        <p className={browserRedirect()!=1?styles.content_font_mobile_p:styles.content_font_p}>
        下記より再度ログインしてください。
        </p>       
        <div>
            <a className={browserRedirect()!=1?styles.content_font_mobile_a:styles.content_font_a}
                href={associateLink}
            >
                アソシエイツ
            </a>
            {/* <div className={styles.re_login_button} onClick={()=>{
                const link = getAssociateLinkByEnv();
                console.log(`Timeout link: ${link}`)
                window.open(link, '_blank');

                document.write("<div>セッションがタイムアウトしました。下記より再度ログインしてください。</div>")
            }}>アソシエイツ</div> */}
        </div>
        <div className={styles.control_button}>
            <a className={browserRedirect()!=1?styles.content_font_mobile_a:styles.content_font_a}
                href={employeeLink}
            >
                アフラック社員
            </a>
            {/* <div className={styles.re_login_button} onClick={()=>{
                const link = getAflacEmployeeLinkByEnv();
                console.log(`Timeout link: ${link}`)
                window.open(link, '_blank');

                document.write("<div>セッションがタイムアウトしました。下記より再度ログインしてください。</div>")
            }}>アフラック社員</div> */}
        </div>
    </div>
}

const StageDisplay = () => {
    return <div>
        <p className={browserRedirect()!=1?styles.content_font_mobile_p:styles.content_font_p}>
        セッションがタイムアウトしました。
        </p>
        <p className={browserRedirect()!=1?styles.content_font_mobile_p:styles.content_font_p}>
        下記より再度ログインしてください。
        </p>
        <div>
            <a className={browserRedirect()!=1?styles.content_font_mobile_a:styles.content_font_a}
                href='https://st-a-line.aflac.co.jp/web01/asp/ServletAspMain?contents-id=126'
            >
                アソシエイツ
            </a>
        </div>
        <div className={styles.control_button}>
            <a className={browserRedirect()!=1?styles.content_font_mobile_a:styles.content_font_a}
                href='https://si4ata01.aflac.aflac.co.jp/web01/asp/ServletAspMain?contents-id=126'
            >
                アフラック社員
            </a>
        </div>
    </div>
}

const ProdDisplay = () => {
    return <div>
        <p className={browserRedirect()!=1?styles.content_font_mobile_p:styles.content_font_p}>
        セッションがタイムアウトしました。
        </p>
        <p className={browserRedirect()!=1?styles.content_font_mobile_p:styles.content_font_p}>
        下記より再度ログインしてください。
        </p>
        <div>
            <a className={browserRedirect()!=1?styles.content_font_mobile_a:styles.content_font_a}
                href='https://a-line.aflac.co.jp/web01/asp/ServletAspMain?contents-id=126'
            >
                アソシエイツ
            </a>
        </div>
        <div className={styles.control_button}>
            <a className={browserRedirect()!=1?styles.content_font_mobile_a:styles.content_font_a}
                href='https://edges.aflac.aflac.co.jp/web01/asp/ServletAspMain?contents-id=126'
            >
                アフラック社員
            </a>
        </div>
    </div>
}

const DevDisplay = () => {
    return <div>
        <p className={browserRedirect()!=1?styles.content_font_mobile_p:styles.content_font_p}>
        セッションがタイムアウトしました。
        </p>
        <p className={browserRedirect()!=1?styles.content_font_mobile_p:styles.content_font_p}>
        下記より再度ログインしてください。
        </p>
    </div>
}

const TimeoutPage = () => {
    const [elementDisplay, setElementDisplay] = useState(null);

    useEffect(() => {
        loginOut(true);

        // adaptation for AzureAD authentication
        if(window.location.pathname.includes('azuread')){
            // clear the cookie for AzureAD auth
            document.cookie = 'va2-mvp2-sess' +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            if(isStageEnv()){
                setElementDisplay(getDisplayByEnv(AZUREAD_STG_URLS.employeeLink, AZUREAD_STG_URLS.associateLink));
            } else if (isProdEnv()){
                setElementDisplay(getDisplayByEnv(AZUREAD_PROD_URLS.employeeLink, AZUREAD_PROD_URLS.associateLink));
            } else {
                setElementDisplay(getDisplayByEnv('', ''));
            }
        } else {
            // clear the cookie for TAM auth
            document.cookie = 'aanet-sess-mvp1' +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            if (isStageEnv()) {
                setElementDisplay(getDisplayByEnv(STG_URLS.employeeLink, STG_URLS.associateLink));
            } else if (isProdEnv()) {
                setElementDisplay(getDisplayByEnv(PROD_URLS.employeeLink, PROD_URLS.associateLink));
            } else {
                setElementDisplay(getDisplayByEnv('', ''));
            }
        }
    }, [])

    return (
        <div>
        <div id={styles.timeout_page} className={`w-100 px-0 ${styles.main_content}`}>
            <div className={styles.timeout_page} >
                <div className={browserRedirect()!=1?styles.center_container_mobile:styles.center_container}>
                    <img src={MainLogo} className={styles.logo} />
                    {elementDisplay}
                </div>
            </div>
        </div>
        <img src={BackgroundBase64} className={styles.backgroundImg} />
        </div>
    )
}


export default TimeoutPage;