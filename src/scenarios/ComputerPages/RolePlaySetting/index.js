import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import { Link, useHistory, useParams, } from "react-router-dom";
import BackgroundBlueLabel from "../../../constituents/ILabel/BackgroundBlueLabel";
import classes from "./styles.module.css";
import { getRadioList, maintainCSVExport, sessionCSVExport } from "../../../request/backendApi/api";
import { connect } from "react-redux";
import logger from "redux-logger";
import { evaluationTaskAll } from "../../../storage/reduxActions/index";
import LearningThemeFilter from "./LearingThemeFilter";
import moment from 'moment';
import LoadingMask from '../../../constituents/ILoadingMask';
import { getLocationState, setLocationState } from '../../../utils/util';
import CSVUploadDiag from "./CSVUploadDiag";
import ExcelJS from "exceljs";
import encoding from "encoding-japanese";
import WarningPopup from "./WarningPopup";

const EvaluationPage = ({evaluationTaskAll}) => {
  const {t} = useTranslation();
  const {tab} = useParams();
  let history = useHistory();
  const [vSectionList, setSectionList] = useState([]);
  const [vChildPersonaId, setChildPersonaId] = useState();
  const [vVisibleTab, setVisibleTab] = useState();
  const [vThemeName, setThemeName] = useState();
  const [vScenarioName, setScenarioName] = useState();
  const [vSelectedOption, setSelectedOption] = useState(null);
  const [vShowUploadDiag, setShowUploadDiag] = useState(false);
  const [sectionData, setSectionData] = useState([]);
  const [vShowWarningPopup, setShowWarningPopup] = useState(false);
  const [vWarningMessage, setarningMessage] = useState('');
  
  // mask control *<boolean>
  const [openMaskFlag, setOpenMaskFlag] = React.useState(false);
  
  useEffect(() => {
    getRadioList().then((res) => {
      if (res.data) {
        setSectionData(res.data)
      } else {
        logger.error("Something-went-wrong ! Please check and try again ");
      }
    });
  }, []);
  
  useEffect(() => {
    if (sectionData?.length > 0) {
      let dates;
      dates = sectionData.filter(item => item.personaId === vChildPersonaId)
      setSectionList(dates);
      evaluationTaskAll(sectionData);
    }
  }, [sectionData, tab, vChildPersonaId]);
  
  const onTabSelect = (id, personaInfo) => {
    setVisibleTab({id, personaInfo});
  };
  const csvExport = () => {
    setOpenMaskFlag(true);
    const data = sessionCSVExport().then((res) => {
      if (res.data) {
        const link = document.createElement("a");
        var currentDate = new Date();
        currentDate = moment(currentDate).format('YYYYMMDD');
        var fileName = "roleplay_scenario_" + currentDate + ".csv"
        link.download = fileName; // file name
        var unicodeArray = encoding.stringToCode(res.data);
        var sjisData = new Uint8Array(encoding.convert(unicodeArray, {
          to: 'SJIS',
          from: 'UNICODE'
        }));
        const blob = new Blob([sjisData], {type: "text/plain; charset=SJIS"});
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        logger.error("Something-went-wrong ! Please check and try again ")
      }
      setOpenMaskFlag(false);
    }).catch((error) => {
      console.log(error);
      setOpenMaskFlag(false);
    })
  }
  
  function getChildrenData(personaId, vOptions1, scenarioName, personaInfo) {
    // setSectionShowFlg(true);
    setSelectedOption({
      personaId: personaId,
      vOptions1: vOptions1,
      scenarioName: scenarioName,
      personaInfo: personaInfo
    })
    setChildPersonaId(personaId);
    setThemeName(vOptions1);
    setScenarioName(scenarioName);
  }
  
  const exportCSV = async (e) => {
    e.preventDefault();
    setOpenMaskFlag(true);
    try {
      let res = await maintainCSVExport()
      let data = res.data;
      let dataSplit = data.split(/\r?\n/);

      if (dataSplit.length > 0) {
        let columnsData = [];
        //header in index 0
        let headers = dataSplit[0].split(',');
        headers.map((val, key) => {
          columnsData.push({header: val, key: `header_${key}`})
        })
        // data
        let formatData = [];
        dataSplit.shift()
        dataSplit.map((item) => {
          let itemSplit = item.split(',');
          let object = {}
          if (itemSplit.length > 0) {
            itemSplit.map((val, key) => {
              object[`header_${key}`] = val
            })
            formatData.push(object)
          }
        })

        const dateFormat = "YYYY-MM-DD"
        var currentDate = new Date();
        let currentDateFormat = moment(currentDate).format(dateFormat);
        const workbook = new ExcelJS.Workbook();
        workbook.addWorksheet("sheet1");
        const worksheet = workbook.getWorksheet("sheet1");

        worksheet.columns = columnsData;
        worksheet.addRows(formatData);
        let format = "csv"
        let charcode = "SJIS"

        const uint8Array =
            format === "xlsx"
                ? await workbook.xlsx.writeBuffer()
                : charcode === "UTF8"
                    ? await workbook.csv.writeBuffer()
                    : new Uint8Array(
                        encoding.convert(await workbook.csv.writeBuffer(), {
                          from: "UTF8",
                          to: "SJIS"
                        })
                    );
        const blob = new Blob([uint8Array], {
          type: "application/octet-binary"
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `maintain-csv-${currentDateFormat}.` + format;
        a.click();
        a.remove();
      }
    } catch (e) {
      console.log(e)
    } finally {
      setOpenMaskFlag(false);
    }
  }
  
  const handleSectionEdit = () => {
    if (vSectionList && vSectionList.length > 0 && vSectionList[0].personaType === "fastText") {
      setShowWarningPopup(true);
      setarningMessage('機械学習型フリーストーリーの編集はできません。');
      return;
    }
    if (vThemeName && vScenarioName && vChildPersonaId) {
      setLocationState({
        selectedOption: Object.assign({}, vSelectedOption, vSectionList[0]),
      }, `admin/SectionEditPage/${vSelectedOption?.personaId}`)
      history.push(`/admin/SectionEditPage/${vSelectedOption?.personaId}`);
    }
  }
  
  return (
    <>
      <h3 className="mb-32" id="role_play_implmenting">
        {t("evaluation.role_playing_creation")}
      </h3>
      <div className={`cmn-bg-box pb-3`}>
        <div className={classes.white_bg}>
          <LearningThemeFilter
            getChildrenData={getChildrenData}
            vChildPersonaId={vChildPersonaId}
            passState={getLocationState()}
          />
        </div>
        <div className={`${classes.white_bg} ${classes.white_bg2}`}>
          <div className={classes.editButton}>
            <button onClick={handleSectionEdit} style={vThemeName && vScenarioName && vChildPersonaId ? {} : {
              cursor: 'not-allowed',
              background: '#D1D1D1'
            }}>編集
            </button>
          </div>
          {vSectionList.map(
            (item, index) =>
              (
                <Row
                  key={index}
                  id={`smallest_padding_box_${index + 1}`}
                  name={`smallest_padding_box_${index + 1}`}
                  className="smallest-padding-box"
                >
                  {item.sections.map((section, sectionIndex) => (
                    <Col
                      id={`section_card_box_${index + 1}${sectionIndex + 1}`}
                      name={`section_card_box_${index + 1}${sectionIndex + 1}`}
                      key={sectionIndex}
                      lg="4"
                      className="mb-3"
                    >
                      <Link
                        id={`evaluation_detail_link_${index + 1}${sectionIndex + 1
                        }`}
                        name={`evaluation_detail_link_${index + 1}${sectionIndex + 1
                        }`}
                        to={{
                          pathname: `/admin/create/evaluation-detail/${section.sectionId}`
                        }}
                        onClick={() => {
                          setLocationState({
                            personaInfo: item.personaInfo,
                            sectionName: section.sectionName,
                            themeName: vThemeName,
                            scenarioName: vScenarioName,
                            seletedOption: vSelectedOption,
                            personaType: item.personaType
                          }, `admin/create/evaluation-detail/${section.sectionId}`)
                        }}
                      >
                        <BackgroundBlueLabel
                          idName={`section_name_${index + 1}${sectionIndex + 1
                          }`}
                          label={section.sectionName}
                          className={classes.bg_blue_box}
                        />
                      </Link>
                    </Col>
                  ))}
                </Row>
              )
          )}
        </div>
      </div>
      <div className={classes.text_div}>
        <a href="javascript:void(0);" className={classes.text_ty} onClick={csvExport}>登録情報のダウンロード</a>
        
        <a href="javascript:void(0);" className={classes.text_ty}
           onClick={() => setShowUploadDiag(true)}>登録情報のインポート</a>
        <a className={classes.text_ty} onClick={e => exportCSV(e)}>登録情報のインポート 履歴ダウンロード</a>
      </div>
      <LoadingMask val={openMaskFlag}/>
      <CSVUploadDiag
        title="変更を保存しますか？"
        open={vShowUploadDiag}
        setOpen={setShowUploadDiag}
      />
      <WarningPopup open={vShowWarningPopup} setOpen={setShowWarningPopup} warningMessage={vWarningMessage}/>
    </>
  );
};

const stateToProps = (state) => {
  return {
    evaluation_task_all: state.evaluation_task_all,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    evaluationTaskAll: (evaluation_task_all) => {
      dispatch(evaluationTaskAll(evaluation_task_all));
    },
  };
};

export default connect(stateToProps, dispatchToProps)(EvaluationPage);
