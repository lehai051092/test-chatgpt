import React, { useEffect, useState } from "react";
import classes from './styles.module.css';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "../../../../constituents/IRadioButtons";
import { getLessonCategories, getPersonaList } from "../../../../request/backendApi/api";
import store from "../../../../storage";
import AddScenarioDialog from "../AddScenarioDialog";
import { addLocationState, getLocationState, setLocationState } from "../../../../utils/util";
import { useHistory } from "react-router-dom";

const styles = {
  root: {
    minWidth: "110px", marginRight: "0", marginBottom: "8px", padding: "0", marginLeft: "0",
  }, label: {
    marginButtom: "0", fontSize: "14px", fontWeight: "normal", marginRight: "16px", marginLeft: "8px",
  },
};

const LearningThemeFilter = (props) => {
  
  const history = useHistory();
  const [addScenarioDialogFlg, setAddScenarioDialogFlg] = useState(false);
  const [vThemes, setTheme] = useState([]);
  const [vOption2Status, setOption2Status] = useState([true])
  const [vDataList, setDataList] = useState([]);
  const [vOptions2, setOptions2] = useState([]);
  const [vOptThemeCode, setOpt1ThemeCode] = useState();
  const [vOpt2ScenarioCode, setOpt2ScenarioCode] = useState(null);
  const [vOpt2ScenarioName, setOpt2ScenarioName] = useState();
  const {getChildrenData} = props;
  const {vChildPersonaId} = props;
  const {passState} = props;
  
  const option1Change = (event) => {
    setOption2Status(false);
    setOpt1ThemeCode(vDataList[event.target.value].themeCode);
    setOptions2(vDataList[event.target.value].scenario);
    setOpt2ScenarioCode(null);
    setOpt2ScenarioName(null);
    addLocationState({
      personaId: null,
    }, 'admin/create/edit')
    getChildrenData(null, null, null, null);
    setTheme([]);
  };
  
  const option2Change = async (event) => {
    setOpt2ScenarioCode(vOptions2[event.target.value].scenarioCode);
    setOpt2ScenarioName(vOptions2[event.target.value].scenarioName);
    let res = await getPersonaList(vOptThemeCode, vOptions2[event.target.value].scenarioCode);
    if (res.status === 200) {
      setTheme(res.data);
    }
    getChildrenData(null, null, null, null);
    addLocationState({
      personaId: null,
    }, 'admin/create/edit')
  };
  
  
  useEffect(() => {
    getLessonCategories("/lessons/category?type=adminPage&specialAS=" + store.getState().user_special_as).then((res) => {
      if (res.data) {
        let resData = res.data;
        setDataList(resData);
        let state = getLocationState();
        if (state) {
          // situation ：deleted the selected （ scenario ）
          if (state.delKeyScenario != state.opt2ScenarioCode) {
            setOpt2ScenarioCode(state.opt2ScenarioCode);
            setOpt2ScenarioName(state.scenarioName);
            // situation ：deleted the selected （ Persona ）
            if (state.delKeyPersona != state.personaId) {
              let personaInfo = state?.theme?.filter(item => item.personaId === state.personaId)?.[0]?.persona;
              if (personaInfo) {
                getChildrenData(state.personaId, state.themeName, state.scenarioName, personaInfo);
              } else {
                // be deleted
                getChildrenData(null, null, null, null);
              }
            } else {
              getChildrenData(null, null, null, null);
            }
            // echo the latest third level data
            if (state.opt2ScenarioCode) {
              getPersonaList(state.opt1ThemeCode, state.opt2ScenarioCode).then((res) => {
                if (res.status === 200) {
                  setTheme(res.data);
                }
              })
            }
          } else {
            let scenarios = resData?.filter(item => item.themeCode == state.opt1ThemeCode)[0]?.scenario;
            setOpt2ScenarioCode(scenarios[0]?.scenarioCode);
            setOpt2ScenarioName(scenarios[0]?.scenarioName);
            getPersonaList(state.opt1ThemeCode, scenarios[0]?.scenarioCode).then((res) => {
              if (res.status === 200) {
                setTheme(res.data);
              }
            })
          }
          setOption2Status(false);
          setOpt1ThemeCode(state.opt1ThemeCode);
          // Ensure the display of learningthemefilter is the same as the original one
          setOptions2(getThemeOnceByThemeCode(resData, state.opt1ThemeCode).scenario);
          
        }
      }
    });
  }, []);
  
  const saveRollBackData = (personaId) => {
    addLocationState({
      themeName: getThemeOnceByThemeCode(vDataList, vOptThemeCode).themeName,
      scenarioName: getScenarioOnceByScenarioCode(vOptions2, vOpt2ScenarioCode)?.scenarioName,
      opt1ThemeCode: vOptThemeCode,
      vOptions2: vOptions2,
      opt2ScenarioCode: vOpt2ScenarioCode,
      theme: vThemes,
    }, 'admin/create/edit')
    // not selected ストーリー
    if (personaId) {
      addLocationState({
        personaId: personaId,
      }, 'admin/create/edit')
    }
  }
  
  const getThemeOnceByThemeCode = (vDataList, vOptThemeCode) => {
    const themeOnce = vDataList.filter((item) => {
      if (item.themeCode === vOptThemeCode) {
        return item;
      }
    });
    return themeOnce[0];
  }
  
  const getScenarioOnceByScenarioCode = (vOptions2, opt2ScenarioCode) => {
    const scenarioOnce = vOptions2.filter((item) => {
      if (item.scenarioCode === opt2ScenarioCode) {
        return item;
      }
    });
    return scenarioOnce[0];
  }
  
  return (
    <>
      <div>
        <div className={`${classes.flex_row}`}>
          <span className="font-16 font-weight-bold">学習テーマ</span>
          <span> : </span>
          <span>
                  <select
                    defaultValue={"-1"}
                    className={`${vOptThemeCode ? classes.custom_select_box_1 : classes.custom_select_box} ${vOption2Status ? classes.option1Deful : ''}`}
                    onChange={option1Change}
                    // onClick={()=>{setTheeNameSelect(!themeNameSelect)}}
                  >
                    <option
                      disabled
                      value="-1"
                      style={{display: 'none'}}
                    > 
                      学習テーマを選択してください
                    </option>
                    {vDataList && vDataList.map((option, index) => {
                      return <option
                        style={{color: "#333333"}}
                        key={index} value={index}
                        selected={vOptThemeCode == option.themeCode}>
                        {option.themeName}
                      </option>
                    })}
                  </select>
            </span>
          <span
            className={classes.update_once_name}
            style={{backgroundColor: '#00A5D9', color: '#ffffff'}}
            onClick={() => {
              history.push({
                pathname: `/admin/LearningCategoryEditPage/`
              });
            }}
          >
            編集
          </span>
        </div>
        <div className={`${classes.flex_row}  ${vOption2Status ? classes.dis_font_color : ''}`}>
          <span className="font-16 font-weight-bold">シナリオ</span>
          <span> : </span>
          <span>
            <select
              className={`${vOpt2ScenarioCode ? classes.custom_select_box_1 : classes.custom_select_box} ${!vOpt2ScenarioCode ? classes.option1Deful : ''}`}
              disabled={vOption2Status}
              defaultValue={"-1"}
              onChange={option2Change}
            >
            <option
              disabled
              value="-1"
              style={{display: 'none'}}
              selected={!vOpt2ScenarioCode}
            >
              シナリオを選択してください
            </option>
              {vOptions2?.map((options, index) => {
                return <option
                  style={{color: "#333333"}}
                  key={index}
                  value={index}
                  selected={vOpt2ScenarioCode == options.scenarioCode}>
                  {options.scenarioName}
                </option>
              })}
            </select>
          </span>
          <span
            className={classes.update_once_name}
            style={!vOption2Status ? {backgroundColor: '#00A5D9', color: '#ffffff'} : {
              backgroundColor: '#D1D1D1', color: '#ffffff', cursor: 'not-allowed'
            }}
            onClick={() => {
              if (!vOption2Status) {
                setLocationState({
                  vOpt1Theme: getThemeOnceByThemeCode(vDataList, vOptThemeCode), vOptions2: vOptions2
                }, `admin/ScenarioEidtPage/${vOptThemeCode}`);
                saveRollBackData(null);
                history.push({
                  pathname: `/admin/ScenarioEidtPage/${vOptThemeCode}`
                });
              }
            }}
          >
            編集
          </span>
        </div>
        <div className={`${classes.flex_row}  ${!vOpt2ScenarioCode ? classes.dis_font_color : ''}`}>
          <span className="font-16 font-weight-bold">ストーリー</span>
          <span> : </span>
          <span>
                {vThemes && vThemes.map(function (val, key) {
                  return (<FormControlLabel
                    className={`${classes.radio_cursor}`}
                    key={key}
                    style={styles.root}
                    id="long_term_care"
                    name="long_term_care"
                    control={<Radio
                      value={JSON.stringify(val.personaId)}
                      id="radio_button"
                      name="radio_button"
                      onChange={() => {
                        getChildrenData(val.personaId, getThemeOnceByThemeCode(vDataList, vOptThemeCode).themeName, getScenarioOnceByScenarioCode(vOptions2, vOpt2ScenarioCode).scenarioName, val.persona)
                        saveRollBackData(val.personaId);
                      }}
                      color="primary"
                      checked={(vChildPersonaId ? vChildPersonaId : passState?.seletedOption?.personaId) == val.personaId}
                    />}
                    label={<span
                      id="long_term_insurance_practice"
                      name="long_term_insurance_practice"
                      style={styles.label}
                      className={(vChildPersonaId ? vChildPersonaId : passState?.seletedOption?.personaId) == val.personaId ? classes.selectedColor : ''}
                    >
                          {val.persona}
                        </span>}
                  />);
                })}
                </span>
          <span
            className={`${classes.update_once_name} ${!vOpt2ScenarioCode ? classes.dis_font_color : ''}`}
            style={!vOpt2ScenarioCode ? {
              backgroundColor: '#D1D1D1', color: '#ffffff', cursor: 'not-allowed'
            } : {backgroundColor: '#00A5D9', color: '#ffffff'}}
            onClick={() => {
              if (vOpt2ScenarioCode) {
                setLocationState({
                  vThemes, vOpt2ScenarioName
                }, `admin/StoryEditPage/${vOptThemeCode}/${vOpt2ScenarioCode}`);
                saveRollBackData(null);
                history.push({
                  pathname: `/admin/StoryEditPage/${vOptThemeCode}/${vOpt2ScenarioCode}`
                });
              }
            }}>
                    編集
                </span>
        </div>
      </div>
      <AddScenarioDialog
        id='1'
        flg={addScenarioDialogFlg}
        setFlg={() => setAddScenarioDialogFlg(false)}
      />
    </>);
};

export default LearningThemeFilter;
