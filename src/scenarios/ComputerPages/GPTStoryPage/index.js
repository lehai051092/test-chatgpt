import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Col, Row} from 'reactstrap';
import {Link, useHistory, useLocation, useParams} from "react-router-dom";
import classes from './styles.module.css'
import {getLessonTask} from '../../../request/backendApi/api'
import {connect} from 'react-redux'
import {selectTask} from '../../../storage/reduxActions/index'
import Folding from './Folding'
import BackButton from "../../../constituents/IButton/BackButton"
import {CURRENT_SECTION_COUNT_DOWN} from '../../../storage/consts'
import store from '../../../storage'
import RolePlay from '../RateOfRiskPage/img/rolePlay.png'
import RolePlayPC from './img/rolePlay_pc.png'
import ICoreFrame from '../../../constituents/ICoreFrame';
import {browserRedirect, getLocationState, setLocationState} from '../../../utils/util';


const GPTStoryPage = ({selectTask, select_task}) => {
  const {t} = useTranslation();
  const state = getLocationState();
  const location = useLocation();
  let lastId = 0;
  const autoId = (prefix = 'gpt-story-') => {
    lastId++;
    return `${prefix}${lastId}`;
  }
  let {taskID} = useParams();
  let {lessonId} = useParams();
  const [vMultiScenraios, setMuptiScenarios] = useState([]);
  const [sectionData, setSectionData] = useState({});
  const [themeName, setThemeName] = useState();
  const [scenarioName, setScenarioName] = useState();
  const [persona, setPersona] = useState();
  const history = useHistory();

  useEffect(() => {
    getLessonTask(`lessons/${lessonId}/tasks`).then(res => {
      const task = res.data[0];
      if (task.persona) {
        setThemeName(task.persona.themeName);
        setScenarioName(task.persona.scenarioName);
        setPersona(task.persona.persona);
      }
      setSectionData(task);
      let temp = [];
      temp.push({
        context: task?.context,
        name: task?.name,
        taskID: task?.id,
        lessonId: task?.persona?.id
      });
      setMuptiScenarios([...temp]);
    });
  }, []);

  const cacheScenarios = () => {
    let tempTask = [];
    // reset the count down in store
    store.dispatch({type: CURRENT_SECTION_COUNT_DOWN, time: ''})
    if (sectionData) {
      let tempList = [];
      tempList.push(sectionData);
      selectTask([...tempList]);
    }
  }

  const backOnlick = () => {
    return ''
  }

  return (
      <ICoreFrame
          onBack={() => {
            history.push({pathname: `/start-new-role-play`});
            setLocationState({lessonId: lessonId, freeModel: true}, 'start-new-role-play')
          }}
          component={
            <div className={`${classes.rateOfRiskPage} ${classes.position_rela}`}>
              <Row
                  className={browserRedirect() === 3 ? classes.rateOfRiskPageTitle_tablet : classes.rateOfRiskPageTitle}>
                <Col lg="7" className={browserRedirect() === 3 ? classes.first_rwo_tablet : classes.first_row}>
                  {
                    browserRedirect() === 1 ?
                        <>
                          <Link
                              to={{pathname: `/start-new-role-play`}}
                              onClick={() => {
                                setLocationState({lessonId: lessonId, freeModel: true}, 'start-new-role-play');
                              }}
                          >
                            <BackButton idName="rate_of_risk_back_button" title={t('scenario.return')}
                                        className={`mr-3 ${classes.btn_adjust} ${classes.back_btn}`} id={autoId()}
                                        onClick={backOnlick}/>
                          </Link>
                          <div className={classes.title_style}>
                            <p>{themeName} {scenarioName}</p>
                            <p className={classes.title2_style}>{persona}</p>
                          </div>
                        </>
                        : <div className={classes.title_style_tablet}>
                          <p>{themeName} {scenarioName}</p>
                          <p className={classes.title2_style_tablet}>{persona}</p>
                        </div>
                  }

                </Col>
                <Col className="text-right" lg="5" style={browserRedirect() === 3 ? {paddingRight: 0} : null}>
                  <Link
                      to={{pathname: `/gpt-chat/${vMultiScenraios[0]?.taskID}/${lessonId}`}}
                      onClick={() => {
                        setLocationState({
                          freeModel: true,
                          senario: vMultiScenraios[0]
                        }, `gpt-chat/${vMultiScenraios[0]?.taskID}/${lessonId}`)
                      }}
                  >
                    {browserRedirect() === 1 ?
                        <img src={RolePlayPC} width={350} className={classes.bottom_btn_submit_pc}
                             onClick={cacheScenarios}></img>
                        :
                        <img src={RolePlay} width={350} className={classes.bottom_btn_submit_tablet}
                             onClick={cacheScenarios}></img>
                    }
                  </Link>
                </Col>
              </Row>
              <Folding multiTasks={vMultiScenraios}></Folding>
            </div>
          }

      />
  )
}

const stateToProps = state => {
  return {
    select_task: state.select_task,
  }
}

const dispatchToProps = dispatch => {
  return {
    selectTask: (select_task) => {
      dispatch(selectTask(select_task));
    }
  }
}

export default connect(stateToProps, dispatchToProps)(GPTStoryPage)