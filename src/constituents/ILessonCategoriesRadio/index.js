import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "../IRadioButtons";
import { Container, Row, Col } from "reactstrap";
import classes from "./styles.module.css";
import { getLessonCategories,getAuthorizeUserList } from "../../request/backendApi/api";
import logger from "redux-logger";
import { getSpecialASCode } from '../../request/feignApi/api'
import store from '../../storage'
import { useHistory, useLocation } from "react-router-dom";
import { isDevOrLocalEnv, isStageEnv, isProdEnv } from '../../utils/runtime'
import { UPDATE_SELECTED_SCENARIO_NAME, UPDATE_SELECTED_THEME_NAME } from "../../storage/consts";
import { browserRedirect, getLightArray, getLocationState,operateCodeListOfAgent } from "../../utils/util";

function ILessonCategoriesRadio({ loginTaskAll,f_getSelectedTheme,selected_theme_name,selected_scenario_name,isSelectionPage }) {
  const [vSelectedscenario, setSelectedscenario] = useState(null);
  const [vSelectedCategories, setSelectedCategories] = useState(null);
  const [vCategories, setCategories] = useState([]);
  const [cacheCategories, setCacheCategories] = useState([]);

  const handleChange = (event) => {
    let theme = JSON.parse(event.target.value);
    let default_scenario = theme?.scenario?.[0]?.scenarioCode;
    setSelectedCategories(JSON.parse(event.target.value));
    
    setSelectedscenario(null);
    // added storage when selected 
    store.dispatch({type: UPDATE_SELECTED_THEME_NAME, selected_theme_name: theme.themeCode})
    store.dispatch({type: UPDATE_SELECTED_SCENARIO_NAME, selected_scenario_name: default_scenario})
    f_getSelectedTheme(theme.themeCode, default_scenario);
  };
  
  const scenariohandleChange = (event) => {
    let scenario = JSON.parse(event.target.value);
    setSelectedscenario(JSON.parse(event.target.value));
    store.dispatch({type: UPDATE_SELECTED_SCENARIO_NAME, selected_scenario_name: scenario?.scenarioCode})
    f_getSelectedTheme(vSelectedCategories?.themeCode, scenario?.scenarioCode);
  };

  const f_getLessonCategories = async () => {
    let asCode = 2;
    // debugger
    if(!store.getState().user_special_as){
      // 1410
      console.log('1410');
      let resAgent = await getAuthorizeUserList();
      if (resAgent.data?.agentCode?.value) {
        if (isStageEnv() || isProdEnv()) {
          let result = await getSpecialASCode();
          if (result.data) {
            let codeList = operateCodeListOfAgent(result.data.map(item => item.code));
            if (codeList.find(code => code == resAgent.data?.agentCode?.value.substring(0, 7)) == undefined) {
              asCode = 1;
            } else {
              asCode = 2;
            }
          }
        }
      } else {
        asCode = 2;
      }
    }
    asCode = store.getState().user_special_as??asCode;
    try {
      getLessonCategories("/lessons/category?type=startRolePlay&specialAS="+asCode).then((res) => {
        setCacheCategories(res)
      });
    } catch (error) {
      console.log(
        `Error occured when get API /lessons/category: ${JSON.stringify(error)}`
      );
    }
  };

  /**
   * given the branch code echoed in different 
   * cases is difficult to manage, it is encapsulated
   * @param {*} res 
   * @returns 
   */
  const routerBack = (res)=>{
    if(!res){
      console.log("error","== res is null == ");
      return false;
    }
    let v_index = 0;
    let s_index = 0;
    for (let index = 0; index < res.data.length; index++) {
      const element = res.data[index];
      if(store.getState().selected_theme_name === element.themeCode){
        v_index = index;
        for (let j = 0; j < element.scenario.length; j++) {
          if(store.getState().selected_scenario_name == element.scenario[j].scenarioCode){
            s_index = j;
          }
        }
      }
    }
    setSelectedCategories(res.data[v_index]);
    setSelectedscenario(res.data[v_index]?.scenario[s_index]);

    f_getSelectedTheme(
      selected_theme_name === ''|| !isSelectionPage ?res.data[v_index]?.themeCode:selected_theme_name,
      selected_scenario_name === ''|| !isSelectionPage ?res.data[v_index]?.scenario[s_index].scenarioCode:selected_scenario_name
    ); 
  }

  useEffect(() => {
    f_getLessonCategories();
  }, [store.getState().user_special_as]);

  const defaultThemeSelect = (resData) => {
    let defaultSelect = null
    if(resData.data.length > 0) {
      defaultSelect = resData.data[0];
      setSelectedCategories(defaultSelect);
      setSelectedscenario(defaultSelect?.scenario[0]);
      return;
    }
  }

  const lessonCategoriesInit = async ()=>{
    let res = cacheCategories;
    !isSelectionPage && defaultThemeSelect(res)
    // It needs to be selected when entering the page for the first time
    if(!store.getState().selected_theme_name){
      if(loginTaskAll.managerFlg.value == "0" && loginTaskAll.lcid.value && loginTaskAll.llid.value ){
        let lightArray = await getLightArray(`${loginTaskAll.lcid.value}_${loginTaskAll.llid.value}`);
        if(lightArray?.[0] && lightArray?.[1]){
          store.dispatch({type: UPDATE_SELECTED_THEME_NAME, selected_theme_name: lightArray?.[0]})
          store.dispatch({type: UPDATE_SELECTED_SCENARIO_NAME, selected_scenario_name: lightArray?.[1]})
        }
      }else{
        store.dispatch({type: UPDATE_SELECTED_THEME_NAME, selected_theme_name: res.data[0]?.themeCode})
        store.dispatch({type: UPDATE_SELECTED_SCENARIO_NAME, selected_scenario_name: res.data[0]?.scenario[0].scenarioCode})
      }
    }
    // set [ select tab data ]
    setCategories(res.data);
    // init routerback
    routerBack(res);
  }

  useEffect(()=>{
    checkValue();
  }, [cacheCategories, store.getState().special_AS_code_cache])

  const checkValue = ()=>{
    if(cacheCategories && cacheCategories.data && cacheCategories.data.length > 0){
      lessonCategoriesInit();
    }else{
      setTimeout(() => {
        checkValue();
      }, 500);
    }
  }

  useEffect(()=>{
    if(vSelectedCategories){
      let v = vSelectedCategories?.scenario.filter((val)=> store.getState().selected_scenario_name == val.scenarioCode)
      if(v.length === 0){
        store.dispatch({type: UPDATE_SELECTED_SCENARIO_NAME, selected_scenario_name: vSelectedCategories?.scenario[0].scenarioCode})
      }
    }
  },[vSelectedCategories])

  return (
    <>
      {
        vCategories.length > 0 && <>          
          <Row className={`no-gutters border-bottom pb-2 mb-3 align-items-md-start align-items-start row_box_cancel_flex_sp ${classes.border_bottom_sp}`}>
            <Col xl="1" lg="2" sm="2" xs="4" className="row_box_flex_width_sp"><p  id="curriculum" name="curriculum" className={`mb-2 font-weight-bold ${classes.curriculum_sp}`}>学習テーマ</p></Col>
            <Col xl="11" lg="10" sm="10" xs="8" className="row_box_flex_width_sp">
              <div className={`${classes.radio_container} ${classes.form_control_label_container_sp}`}>
              {vCategories.map(function (val, key) {
                  return (
                    <FormControlLabel
                      className={`${classes.radio_cursor} ${classes.form_control_label_root_sp}`}
                      key={key}
                      style={styles.root}
                      id="long_term_care"
                      name="long_term_care"
                      control={
                        <Radio
                          value={JSON.stringify(val)}
                          id="radio_button"
                          name="radio_button"
                          onChange={handleChange}
                          color="primary"
                          checked={(store.getState().selected_theme_name !=='' && store.getState().selected_theme_name)== val.themeCode}
                          style={{display: 'none'}}
                        />
                      }
                      label={
                        <p
                          id="long_term_insurance_practice"
                          name="long_term_insurance_practice"
                          style={styles.label}
                          className={`${classes.radio_label} ${
                            (store.getState().selected_theme_name !=='' && store.getState().selected_theme_name) == val.themeCode
                              ? classes.radio_active
                              : classes.radio_no_active 
                          } ${classes.form_control_label_sp}`}
                        >
                          {val.themeName}
                        </p>
                      }
                    />
                  );
                })}
              </div>
            </Col>
          </Row>
          <Row className="no-gutters pb-2 align-items-md-start align-items-start row_box_cancel_flex_sp">
            <Col xl="1" lg="2" sm="2" xs="4" className="row_box_flex_width_sp"><p  id="curriculum" name="curriculum" className={`mb-2 font-weight-bold ${classes.curriculum_sp}`}>シナリオ</p></Col>
            <Col xl="11" lg="10" sm="10" xs="8" className="row_box_flex_width_sp">
              <div className={`${classes.radio_container} ${classes.form_control_label_container_sp}`}>
                {vSelectedCategories?.scenario.map(function (val, key) {
                  return (
                    <FormControlLabel
                      className={`${classes.radio_cursor} ${classes.form_control_label_root_sp}`}
                      key={key}
                      style={styles.root}
                      id="long_term_care"
                      name="long_term_care"
                      control={
                        <Radio
                          value={JSON.stringify(val)}
                          id="radio_button"
                          name="radio_button"
                          onChange={scenariohandleChange}
                          color="primary"
                          checked={
                            (store.getState().selected_scenario_name !=='' && store.getState().selected_scenario_name)== val.scenarioCode
                          }
                          style={{display: 'none'}}
                        />
                      }
                      label={
                        <p
                          id="long_term_insurance_practice"
                          name="long_term_insurance_practice"
                          style={styles.label}
                          className={`${classes.radio_label} ${
                            (store.getState().selected_scenario_name !=='' && selected_scenario_name) == val.scenarioCode
                              ? classes.radio_active
                              : classes.radio_no_active 
                          } ${classes.form_control_label_sp} ${classes.long_term_insurance_practice}`}
                        >
                          {val.scenarioName}
                        </p>
                      }
                    />
                  );
                })}
              </div>
            </Col>
          </Row>
        </>
      }
    </>
  );
}

const styles = {
  root: {
    minWidth: "110px",
    marginRight: "0",
    marginBottom: "0",
    padding: "0",
    marginLeft: "0",
  },
  // label: {
  //   marginButtom: "0",
  //   fontSize: "14px",
  //   fontWeight: "normal",
  //   marginRight: "16px",
  //   marginLeft: "8px",
  // },
  label: {
    height: browserRedirect() === 1 ? '30px' : '40px',
    fontSize: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
};

const stateToProps = (state) => {
  return {
    selected_theme_name:state.selected_theme_name,
    selected_scenario_name:state.selected_scenario_name,
  };
};

export default connect(stateToProps, null)(ILessonCategoriesRadio);