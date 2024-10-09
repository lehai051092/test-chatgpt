import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Row, Col} from "reactstrap";
import ExportIcon from "../../../property/images/export_icon.svg";
import SearchIcon from "../../../property/images/search_icon.svg";
import BackgroundGrayLabel from "../../../constituents/ILabel/BackgroundGrayLabel/index";
import GeneralTextbox from "./GeneralTextbox02";
import {getKeywords, getAllKeywords} from "../../../request/backendApi/api";
import eventShuttle from "../../../eventShuttle";
import RegisterKeyword from "./RegisterKeyword";
import {useJsonToCsv} from "react-json-csv";
import classes from "./styles.module.css";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "../../../constituents/IRadioButtons";
import CensoredCharactersPage from "../CensoredCharactersPage";
import SttReplaceWordsPage from "../SttReplaceWordsPage";
import TtsReplaceWordsPage from "../TtsReplaceWordsPage";
import LoadingMask from "../../../constituents/ILoadingMask";

const fields = {
  keyword: "\ufeff KeyWords",
  synonyms: "\ufeff synonyms",
};

const RegisterSynonyms = () => {
  const {t} = useTranslation();
  const [searchKeyword, setsearchKeyword] = useState("");
  const [regKeywords, setRegKeywords] = useState([]);
  const [isEditOrSearch, setIsEditOrSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openMaskFlag, setOpenMaskFlag] = React.useState(false);
  const {saveAsCsv} = useJsonToCsv();
  
  const onSearchKeyword = async (e) => {
    setIsLoading(true);
    setsearchKeyword(e.target.value);
    if (e.charCode === 13 || e.target.value) {
      try {
        await getKeywords(encodeURI(e.target.value)).then((res) => {
          setRegKeywords(res.data);
          setIsLoading(false);
        });
      } catch (error) {
        eventShuttle.dispatch("something_went_wrong");
      }
    }
  };
  
  const exportKeywordsAndSynonyms = async () => {
    setOpenMaskFlag(true);
    try {
      const res = await getAllKeywords();
      res.data.forEach((keyword) => {
        const updatedSynonyms = keyword.synonyms.map(
          (synonym) => (synonym = '"' + synonym + '"')
        );
        keyword.synonyms = updatedSynonyms;
        keyword.keyword = '"' + keyword.keyword + '"'
      });
      saveAsCsv({
        data: res.data,
        fields,
        filename: "Keywords and Synonyms",
      });
    } catch {
      eventShuttle.dispatch("something_went_wrong");
    } finally {
      setOpenMaskFlag(false);
    }
  };
  
  // const addNewKeyword = () => {
  //   setsearchKeyword("");
  //   setRegKeywords([{ keyword: "", synonyms: [] }]);
  // };
  
  useEffect(() => {
    setIsEditOrSearch(regKeywords.length > 0 ? true : false);
  }, [regKeywords]);
  
  const [tab, setTab] = useState('synonyms')
  return (
    <>
      <h3 className="mb-4" id="register_synonyms">
        用語登録
      </h3>
      <div>
        <FormControlLabel
          style={{margin: '0'}}
          control={
            <Radio
              value={'synonyms'}
              onChange={() => {
                setTab('synonyms')
              }}
              color="primary"
              checked={
                tab === 'synonyms'
              }
              style={{display: 'none'}}
            />
          }
          label={
            <p
              className={`${classes.radio_label} ${
                tab === 'synonyms' ? classes.radio_active : ''
              }`}
            >類義語登録</p>
          }
        />
        <FormControlLabel
          style={{margin: '0'}}
          control={
            <Radio
              value={'viewing'}
              onChange={() => {
                setTab('viewing')
              }}
              color="primary"
              checked={
                tab === 'viewing'
              }
              style={{display: 'none'}}
            />
          }
          label={
            <p
              className={`${classes.radio_label} ${
                tab === 'viewing' ? classes.radio_active : ''
              }`}
            >検閲文字登録</p>
          }
        />
        <FormControlLabel
            style={{margin: '0'}}
            control={
              <Radio
                  value={'sttReplaceWords'}
                  onChange={() => {
                    setTab('sttReplaceWords')
                  }}
                  color="primary"
                  checked={
                      tab === 'sttReplaceWords'
                  }
                  style={{display: 'none'}}
              />
            }
            label={
              <p
                  className={`${classes.radio_label} ${
                      tab === 'sttReplaceWords' ? classes.radio_active : ''
                  }`}
              >音声認識</p>
            }
        />
          <FormControlLabel
              style={{margin: '0'}}
              control={
                  <Radio
                      value={'ttsReplaceWords'}
                      onChange={() => {
                          setTab('ttsReplaceWords')
                      }}
                      color="primary"
                      checked={
                          tab === 'ttsReplaceWords'
                      }
                      style={{display: 'none'}}
                  />
              }
              label={
                  <p
                      className={`${classes.radio_label} ${
                          tab === 'ttsReplaceWords' ? classes.radio_active : ''
                      }`}
                  >音声合成</p>
              }
          />
      </div>
      <div className={classes.back_div}>
        {
          tab === 'synonyms' ?
            <>
              <Row className="mb-4 smallest-padding-box">
                <Col lg="4" md="5" sm="5" xs="5">
                  <div className={classes.search_box}>
                    <img
                      src={SearchIcon}
                      alt="Search Icon"
                      id="register_synonyms_add_keywords"
                    />
                    <GeneralTextbox
                      text={searchKeyword}
                      onKeyPress={onSearchKeyword}
                      placeholder={t(
                        "registerSynonyms.register_synonyms_search_keywords"
                      )}
                      onChange={onSearchKeyword}
                      id="register_synonyms_search_keywords"
                      className={classes.search_box}
                    />
                  </div>
                </Col>
                <Col lg="8" md="7" sm="7" xs="7">
                  <button
                    className={`mb-2 ${classes.export_btn} ${classes.height_64} ${classes.inner_text_button}`}
                    id="register_synonyms_export"
                    onClick={exportKeywordsAndSynonyms}
                  >
                    <img src={ExportIcon} alt="Export Icon" className={`mr-2`}/>
                    {t("registerSynonyms.register_synonyms_export")}
                  </button>
                </Col>
              </Row>
              {isEditOrSearch && (
                <div className={classes.search_div}>
                  {isEditOrSearch && (
                    <Row className={classes.row_style}>
                      <Col xl="3" lg="4" md="5" sm="5" xs="5">
                        <BackgroundGrayLabel
                          label={t("registerSynonyms.register_synonyms_keywords_label")}
                          className={`mb-2 py-3 ${classes.input_style}`}
                          id="register_synonyms_keywords_label"
                        />
                      </Col>
                      <Col xl="9" lg="8" md="7" sm="7" xs="7">
                        <BackgroundGrayLabel
                          label={t("registerSynonyms.register_synonyms_label")}
                          className={`mb-2 py-3 ${classes.input_style}`}
                          id="register_synonyms_label"
                        />
                      </Col>
                    </Row>
                  )}
                  <div className={classes.divider_style}></div>
                  <div className={classes.row_div}>
                    {regKeywords.length > 0 ? regKeywords.map((regKeyword, index) => (
                        <RegisterKeyword
                          regKeywords={regKeywords}
                          regKeyword={regKeyword}
                          key={index}
                          setRegKeywords={setRegKeywords}
                          className={classes.input_style}
                        />
                      )) :
                      null
                    }
                  </div>
                </div>
              )}
              <p>
                {(searchKeyword != '' && !isLoading) &&
                  '検索したキーワードは見つかりませんでした。'
                }
              </p>
            </>
            : null
        }
        {
          tab === 'viewing' ? <CensoredCharactersPage/> : null
        }
        {
          tab === 'sttReplaceWords' ? <SttReplaceWordsPage/> : null
        }
        {
          tab === 'ttsReplaceWords' ? <TtsReplaceWordsPage/> : null
        }
      </div>
      <LoadingMask val={openMaskFlag}/>
    </>
  );
};

export default RegisterSynonyms;
