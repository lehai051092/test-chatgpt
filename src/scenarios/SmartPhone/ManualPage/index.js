import React, { createRef, useState, useEffect, useRef } from "react";
import classes from "./styles.module.css";
import manualImg from '../../../property/images/scenarios/manual.png';
import { getProcessToken, getLessonCategories } from "../../../request/backendApi/api";
import store from '../../../storage';
import logger from "redux-logger";
import LoadingMask from '../../../constituents/ILoadingMask';
import { getManualUrl , getManualUrl2,getManualUrl3,getManualUrl4} from "../../../utils/runtime";
import ICoreFrame from "../../../constituents/ICoreFrame";
import { getScoreTable, getFile, getBase64Name } from '../../../request/backendApi/api'
import { browserRedirect, onDownload } from "../../../utils/util";
const ManualPage = () => {
  const [vProcessToken, setProcessToken] = useState();
  const [cacheCategories, setCacheCategories] = useState([]);
  const [vSelectedscenario, setSelectedscenario] = useState(null);
  const [vSelectedCategories, setSelectedCategories] = useState(null);
  const [vCategories, setCategories] = useState([]);
  const [vPdfiles, setPdfiles] = useState([]);
  const [vIsLoadingMask, setIsLoadingMask] = useState(false);
  const pdfurl = {
    path: '',
    name: ''
  };



  const downloadFile = (val,name) => {
    setIsLoadingMask(true);
    onDownload(val.path + "?" + vProcessToken,name,()=>{
      setIsLoadingMask(false);
    });
  }

function dataURLtoBlob(data) {
    var bstr = atob(data)
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: 'pdf' });
}

  const GetProcessToken = async () => {
    const response = await getProcessToken();
    setProcessToken(response.data);
  };
  const f_getLessonCategories = () => {
    try {
      getLessonCategories("/lessons/category?type=manualPage&specialAS="+store.getState().user_special_as).then((res) => {
        if (res.data) {
          setCacheCategories(res)
        } else {
          logger.error("Error occured when get API /lessons");
        }
      });
    } catch (error) {
      console.log(
        `Error occured when get API /lessons/category: ${JSON.stringify(error)}`
      );
    }
  };

  const f_getPdfiles = () => {
    try {
      getLessonCategories("/lessons/manual").then((res) => {
        if (res.data) {
          setPdfiles(res.data.personaList)
        } else {
          logger.error("Error occured when get API /lessons");
        }
      });
    } catch (error) {
      console.log(
        `Error occured when get API /lessons/category:`, error
      );
    }
  };

  useEffect(() => {
    f_getLessonCategories();
    f_getPdfiles();
  }, []);

  const handleChange = (event) => {
    let theme = JSON.parse(event.target.value);
    setSelectedCategories(JSON.parse(event.target.value));
    setSelectedscenario(theme?.scenario[0]);
    // setSelectedscenario(null);
  };
  const scenariohandleChange = (event) => {
    setSelectedscenario(JSON.parse(event.target.value));
  };

  useEffect(() => {
    if (cacheCategories && cacheCategories.data && cacheCategories.data.length > 0) {
      let res = cacheCategories;
      setCategories(res.data);
      setSelectedCategories(res.data[0]);
      setSelectedscenario(res.data[0]?.scenario[0]);
    }
  }, [cacheCategories, store.getState().special_AS_code_cache]);

  useEffect(() => {
    GetProcessToken()
  }, []);

  const viewPdf = () => {
    pdfurl.path = getManualUrl();
    pdfurl.name = "募集人育成AI利用マニュアル_アソシエイツ版_220719_Ver.2.79.pdf";
    return pdfurl;
  };

  const viewPdf2 = () => {
    pdfurl.path = getManualUrl2();
    pdfurl.name = "端末・ブラウザの音声入力をオンにする方法_V1.1.pdf";
    return pdfurl;
  };

  const viewPdf3 = () => {
    pdfurl.path = getManualUrl3();
    pdfurl.name = "（iPhone用）AANET証明書導入マニュアル_AI版_0719.pdf";
    return pdfurl;
  };

  const viewPdf4 = () => {
    pdfurl.path = getManualUrl4();
    pdfurl.name = "（iPad用）AANET証明書導入マニュアル_AI版_0719.pdf";
    return pdfurl;
  };


  const getPdfs = (data) => {
    try {
      let urls = JSON.parse(data);
      if (urls != null && urls.personaTheme == vSelectedCategories.themeCode && urls.personaScenario == vSelectedscenario.scenarioCode && urls.manualList.length > 0) {
        return (<div className={classes.pdffs}>
          <span>{urls.personaInfo}</span>
          <div className={urls.manualList.length == 1 ? classes.bottom_div_1 : urls.manualList.length == 2 ? classes.bottom_div_2 : classes.bottom_div_3}>
            {
              urls.manualList.map(function (val, key) {
                return <span><img src={manualImg} />

                  <a href="javascript:void(0);" onClick={()=>downloadFile(val,val.name)}>{val.name}</a>
                </span>
              })
            }
          </div>
        </div>
        );
      }
    } catch (e) {
      console.log("Error message", e)
    }
  };

  return (
    <ICoreFrame
      component={<>
        <div className={browserRedirect() === 3 ? classes.tablet_view_text : null}>
          <div className={classes.text_left}>募集資材</div>
          <div className={classes.text_right}>ロープレで使用する資料やマニュアルをダウンロードできます。</div>
        </div>
        <div className={`pb-3 ${browserRedirect() === 3 ? classes.tablet_view : classes.box_size}`}>
          <div className={`${classes.bg_color}`}>
            <div className={`${classes.story_name}`}>
              <div className={`${classes.font_set}`}>マニュアル</div>
            </div>
            <div className={browserRedirect() === 2 ? classes.mar_top_mb : classes.mar_top}>
              <div className={classes.text2_set}>募集人育成AIの操作マニュアルの閲覧・ダウンロードができます。</div>
              <div>
                <div className={classes.link_div}>
                  <div>
                    <img src={manualImg} />
                    <span>
                      <a href="javascript:void(0);" onClick={() => downloadFile(viewPdf(),'募集人育成AI利用マニュアル_アソシエイツ版_220719_Ver.2.79.pdf')}>募集人育成AI利用マニュアル_アソシエイツ版_220719_Ver.2.79.pdf</a>
                    </span>
                  </div>
                </div>
                <div className={classes.link_div}>
                <div>
                  <img src={manualImg} />
                  <span>
                    <a href="javascript:void(0);" onClick={() => downloadFile(viewPdf2(),'端末・ブラウザの音声入力をオンにする方法_V1.1.pdf')}>端末・ブラウザの音声入力をオンにする方法_V1.1.pdf</a>
                  </span>
                </div>
              </div>
              <div className={classes.link_div}>
                <div>
                  <img src={manualImg} />
                  <span>
                    <a href="javascript:void(0);" onClick={() => downloadFile(viewPdf3(),'（iPhone用）AANET証明書導入マニュアル_AI版_0719.pdf')}>（iPhone用）AANET証明書導入マニュアル_AI版_0719.pdf</a>
                  </span>
                </div>
              </div>
              <div className={classes.link_div}>
                <div>
                  <img src={manualImg} />
                  <span>
                    <a href="javascript:void(0);" onClick={() => downloadFile(viewPdf4(),'（iPad用）AANET証明書導入マニュアル_AI版_0719.pdf')}>（iPad用）AANET証明書導入マニュアル_AI版_0719.pdf</a>
                  </span>
                </div>
              </div>
              </div>
            </div>
          </div>
          <div div className={`${classes.skuriputo}`}>
            <div className={`${classes.story_name}`}>
              <div className={classes.font_set}>募集資材・スクリプト</div>
            </div>
            <div className={classes.mar_top}>
              <div className={classes.text3_set}>ロープレ中に使用する募集資材・スクリプトの閲覧・ダウンロードができます。表示したい資料の学習テーマ・シナリオを選んでください。</div>
              <div className={classes.study_div}>
                <div className={classes.study_font}>学習テーマ</div>
                <span>
                  {
                    vCategories.map((val, key) => {
                      return (
                        <button className={vSelectedCategories.themeCode == val.themeCode ? classes.selected_button : classes.but_mar} onClick={handleChange} id={key} value={JSON.stringify(val)}>{val.themeName}</button>
                      );
                    })
                  }
                </span>
              </div>
              <hr className={classes.hr_set}></hr>
              <div className={classes.sinali_div}>
                <div className={classes.study_font}>シナリオ</div>
                <span>
                  {
                    vSelectedCategories?.scenario.map((val, key) => {
                      return (
                        <button className={vSelectedscenario.scenarioCode == val.scenarioCode ? classes.selected_button : classes.but_mar} key={key} onClick={scenariohandleChange} value={JSON.stringify(val)}>{val.scenarioName}</button>
                      );
                    })}
                </span>
              </div>
              <div className={classes.link_pdf}>
                {
                  vPdfiles.map((val, key) => {
                    return getPdfs(JSON.stringify(val))
                  })
                }
              </div>
            </div>
          </div>
          <LoadingMask val={vIsLoadingMask} />
        </div>
      </>}
    />
  );
};



export default ManualPage;
