import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col } from "reactstrap";
import classes from "./styles.module.css";
import {
  getLessonList,
} from "../../../../request/backendApi/api";
import { connect } from "react-redux";
import logger from "redux-logger";
import { lessonAll } from "../../../../storage/reduxActions/index";
import ErrorMsgApi from "../../../../constituents/IErrorMessage/ErrorMsgApi";
import { useHistory, useLocation } from "react-router-dom";
import store from "../../../../storage";
import ILessonCategoriesRadio from '../../../../constituents/ILessonCategoriesRadio/index'
import { browserRedirect, setLocationState } from "../../../../utils/util";
import CancerInsuranceCard from "../../../../constituents/ICard/CancerInsurance/index";
import { SELECTED_CUSTOMER_DATA } from "../../../../storage/consts";

let waitCounter = 0;

const PersonaSelectionPage = ({
  onEditScenerio,
  lessonAll,
  login_task_all,
  isSelectionPage
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const [rdoPractice, setPractice] = useState();
  const [rdoValue, setRdoValue] = useState();
  const [vResponseError, setResponseError] = useState(false);
  const [vErrorMessage, setErrorMessage] = useState();
  const [vThemeCode, setThemeCode] = useState(null);
  const [vScenarioCode, setScenarioCode] = useState(null);
  const [vThemeFilterLessons, setThemeFilterLessons] = useState([]);
  const location = useLocation();
  const [vRecruiterApiData, setApiData] = useState([]);
  const [vRecruiterName, setRecruiterName] = useState();

  const handleRadioChange = (event) => {
    setRdoValue(event.target.value);
  };
  const getSelectedTheme = (themeCode, scenarioCode) => {
    setThemeCode(themeCode);
    setScenarioCode(scenarioCode);
  };

  useEffect(() => {
    let filterVal = vRecruiterApiData.filter(item => item.theme == vThemeCode && item.scenario == vScenarioCode)
    setThemeFilterLessons(filterVal);
  }, [vRecruiterApiData, vThemeCode, vScenarioCode])

  useEffect(() => {
    const setData = async () => {
      try {
        const data = getLessonList("/lessons").then((res) => {
          if (res.data) {
            setApiData(res.data);
            lessonAll(res.data);
          } else {
            logger.error("Error occured when get API /lessons");
          }
        });
      } catch (error) {
        setResponseError(true);
        setErrorMessage(
          "エラーが発生しました。確認してもう一度お試しください。"
        );
        console.log(
          `Error occured when get API /lessons: ${JSON.stringify(error)}`
        );
      }
    };
    setData();
  }, []);

  useEffect(() => {
    let arrayFind = [];
    if (vRecruiterApiData) {
      arrayFind = JSON.parse(JSON.stringify(vRecruiterApiData));
    }

    if (arrayFind.length > 0) {
      setRecruiterName(arrayFind[0].userName);
    }

    let userRoles = login_task_all.userRoles ? login_task_all.userRoles : [];
    if (!(userRoles.includes("I3ASEADMINISTRATOR") && login_task_all?.managerFlg.value == "1")) {
      waitMstUserInfo(arrayFind);
    }
  }, [vRecruiterApiData, login_task_all]);

  // pad
  useEffect(()=>{
    if(browserRedirect() === 3){
      let list = document.getElementsByClassName("personaSelectionPage_Col_div");
      for (const iterator of list) {
        iterator.style.width='50%'
      }
      let header_1 = document.getElementsByClassName("personaSelectionPage_Col_header_1")?.[0];
      header_1.style.marginTop = '15px'
    }
    window.scrollTo(0,1)
  },[vThemeFilterLessons])

  function waitMstUserInfo(arrayFind) {
    waitCounter += 1;
    const mstUesrInfo = store.getState().cacheMstUserInfo;
    if (mstUesrInfo.salsmanSeiKj) {
      setRecruiterName(mstUesrInfo.salsmanSeiKj + mstUesrInfo.salsmanMeiKj);
    } else {
      if (waitCounter < 5) {
        setTimeout(() => {
          waitMstUserInfo(arrayFind);
        }, 1000);
      }
    }
  }

  const onClickOnEditScenerio = (customerId, customerData) => {
    store.dispatch({type: SELECTED_CUSTOMER_DATA, selected_customer_data: customerData})
    setLocationState({
      lessonId: customerData?.id,
      selectPersona: customerData
    }, 'start-new-role-play')
    onEditScenerio(customerId, customerData, vThemeCode, vScenarioCode)
  }

  return (
    <>
      {vResponseError == true && (
        <ErrorMsgApi message={vErrorMessage && vErrorMessage} />
      )}
      <div className={`${classes.persona_selection_cmn_bg_box_sp}`}>
        <div className={`cmn-bg-box-inr pb-2 ${classes.persona_selection_cmn_bg_box_inr_sp}`}>
          <div className={'personaSelectionPage_Col_header_1'}>
            <div className={`mb-3 border-bottom ${classes.border_bottom_sp}`}>
              <Row className={`row_box_cancel_flex_sp`}>
                <Col xl="1" lg="2" sm="2" xs="4" className="pr-0 row_box_flex_width_sp"><h6
                id="recruiter_selection"
                name="recruiter_selection"
                className={`mb-3 font-14 ${classes.recruiter_selection_sp}`}
              >
                {t("recruiter.recruiter_slection")}
              </h6></Col>
                <Col xl="11" lg="10" sm="10" xs="8" className={`${classes.lable_recuriter_name} row_box_flex_width_sp ${classes.lable_recuriter_style_sp} `}> {vRecruiterName}</Col>
              </Row>
            </div>
          </div>
          <div className="mb-2 category-section">
            <ILessonCategoriesRadio loginTaskAll={login_task_all} f_getSelectedTheme={getSelectedTheme} vThemeCode={vThemeCode} vScenarioCode={vScenarioCode} isSelectionPage={isSelectionPage}/>
          </div>
          <Row  className={`smallest-padding-box01 ${classes.card_box_min_height}`}>
            {vThemeFilterLessons
              ? vThemeFilterLessons.map((item, index) => (
                    <Col
                      key={index}
                      id={`cancer_card_${index + 1}`}
                      name={`cancer_card_${index + 1}`}
                      xl="4"
                      lg="6"
                      className="mb-3 personaSelectionPage_Col_div"
                    >
                      <CancerInsuranceCard
                        id={index + 1}
                        onEditScenerio={onClickOnEditScenerio}
                        customerData={item}
                        loginTaskAll={login_task_all}
                      />
                    </Col>
                ))
              : ''}
          </Row>
        </div>
      </div>
    </>
  );
};

const styles = {
  root: {
    minWidth: "110px",
    marginRight: "0",
    marginBottom: "8px",
    padding: "0",
    marginLeft: "0",
  },
  label: {
    marginButtom: "0",
    fontSize: "16px",
    fontWeight: "normal",
    marginRight: "16px",
    marginLeft: "8px",
  },
};

const stateToProps = (state) => {
  return {
    lesson_all: state.lesson_all,
    login_task_all: state.login_task_all,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    lessonAll: (lesson_all) => {
      dispatch(lessonAll(lesson_all));
    },
  };
};

export default connect(stateToProps, dispatchToProps)(PersonaSelectionPage);
