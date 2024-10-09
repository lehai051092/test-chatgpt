import React, { createRef, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from 'reactstrap';
import { BrowserRouter as Router, Link, useParams, useLocation ,useHistory} from "react-router-dom";
import classes from './styles.module.css'
import { getRateOfRiskScoreBar, getProcessToken, getTaskInfo } from '../../../request/backendApi/api'
import { connect } from 'react-redux'
import { selectTask } from '../../../storage/reduxActions/index'
import Folding from './Folding'
import BackButton from "../../../constituents/IButton/BackButton"
import { CURRENT_SECTION_COUNT_DOWN } from '../../../storage/consts'
import store from '../../../storage'
import ShowBut from './ShowBut'
import ButImg from '../../../property/images/yuan.png'
import RateOfRiskSubmit from '../../../property/images/rate_of_risk_submit.png'
import ICoreFrame from '../../../constituents/ICoreFrame';
import { getLocationState, setLocationState } from '../../../utils/util';
const RateOfRiskPage = ({ selectTask, select_task }) => {
    const { t } = useTranslation();
    const location = useLocation();
    let lastId = 0;
    const autoId = (prefix = 'rate-of-risk-') => {
        lastId++;
        return `${prefix}${lastId}`;
    }
    let { taskID } = useParams();
    let { lessonId } = useParams();
    const [vProcessToken, setProcessToken] = useState();
    const [vMultiScenraios, setMuptiScenarios] = useState([]);
    const [vAllSecShowFlag, setAllSecShowFlag] = useState();
    const GetProcessToken = async () => {
        const response = await getProcessToken();
        setProcessToken(response.data);
    };
    const [themeName, setThemeName] = useState();
    const [scenarioName, setScenarioName] = useState();
    const [persona, setPersona] = useState();
    const [vPassState, setPassState] = useState();
    const history = useHistory();

    useEffect(() => {
        const state = getLocationState();
        if (state && location.pathname.includes('multiple-scenarios')) {
            setThemeName(state[0].persona.themeName);
            setScenarioName(state[0].persona.scenarioName);
            setPersona(state[0].persona.persona);
            setPassState(state[0].persona)
            // if multiple scenarios
            let tempScenarios = [];
            if (state instanceof Array) {
                // if from former page
                state.forEach(perTask => {
                    tempScenarios.push({
                        context: perTask.context,
                        name: perTask.name,
                        taskID: perTask.id,
                        lessonId: perTask?.persona?.id
                    })
                })
                setMuptiScenarios(tempScenarios);
                setAllSecShowFlag('');
            } else {
                // return from video chat page
                store.getState().select_task.forEach(perTask => {
                    tempScenarios.push({
                        context: perTask.context,
                        name: perTask.name,
                        taskID: perTask.id,
                        lessonId: perTask?.persona?.id
                    })
                });
                setMuptiScenarios(tempScenarios);
                setAllSecShowFlag('');
            }
        } else if (state && state.task) {
            // if single scenario
            getTaskInfo(taskID ?? '').then(res => {
                if (res.status === 200) {
                    const { context, name, persona } = res.data;
                    setThemeName(persona.themeName);
                    setScenarioName(persona.scenarioName);
                    setPersona(persona.persona);
                    setPassState(persona)
                    let temp = [];
                    temp.push({ context, name, taskID, lessonId });
                    setMuptiScenarios([...temp]);
                    setAllSecShowFlag('');
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }, []);

    const cacheScenarios = () => {
        const state = getLocationState();
        let tempTask = [];
        // reset the count down in store
        store.dispatch({ type: CURRENT_SECTION_COUNT_DOWN, time: '' })
        if (state.task) {
            // single scenario
            tempTask.push(state.task);
            selectTask([...tempTask]);
        } else if (state && location.pathname.includes('multiple-scenarios')) {
            // multiple scenarios
            if (state instanceof Array && state.length > 0) {
                // if not return from video chat page
                tempTask = tempTask.concat(state);
                selectTask([...tempTask]);
            }
        }
        setLocationState({
            select_task:state,
            pname:'multiple-scenarios'
        },`video-chat/${vMultiScenraios[0]?.taskID}/${lessonId}/${location.pathname.includes('multiple-scenarios') ? 'multiple-scenarios' : ''}`);
    }
    const handleChange = (event) => {
        let flag = 1;
        if (!event.target.checked) {
            flag = 2;
        }
        setAllSecShowFlag(flag);
    };
    return (
        <ICoreFrame
            onBack={()=>{
                history.push({pathname:`/start-new-role-play`});
                setLocationState({lessonId, selectPersona : vPassState}, 'start-new-role-play')
            }}
            component={<div className={`${classes.rateOfRiskPage} ${ classes.position_rela}`}>
                <div className={classes.title_style}>
                    <div>{themeName}&nbsp;&nbsp;{scenarioName}</div>
                    <div className={classes.title_p}>{persona}</div>
                </div>
                <div className={classes.bottom_butt}>
                    <Link 
                        className={classes.a_style} 
                        to={{ pathname: `/video-chat/${vMultiScenraios[0]?.taskID}/${lessonId}/${location.pathname.includes('multiple-scenarios') ? 'multiple-scenarios' : ''}` }}
                    >
                            {/* <button className={classes.bottom_btn_submit} id="video_chat_page_link" name="video_chat_page_link" onClick={cacheScenarios}>
                                <span>
                                    <a>{t('rateOfRisk.proceed_to_the_next')}</a>
                                </span>
                            </button> */}
                            <img onClick={cacheScenarios} width={380} src={RateOfRiskSubmit}></img>
                    </Link>
                </div>
                {vMultiScenraios && vMultiScenraios.length > 1 ?
                    <Row style={{ height: '50px' }} className={classes.all_style}>
                        <Col lg='12' className={`text-right`}>
                            <ShowBut onChange={handleChange} />
                        </Col>
                    </Row>
                    : ""
                }
                <Folding multiTasks={vMultiScenraios} vAllSecShowFlag={vAllSecShowFlag}></Folding>
                {/* <div className={classes.bottom_butt}>
                    <Link className={classes.a_style} to={{ pathname: `/video-chat/${vMultiScenraios[0]?.taskID}/${lessonId}/${location.pathname.includes('multiple-scenarios') ? 'multiple-scenarios' : ''}`, state: `${location.pathname.includes('multiple-scenarios') ? 'multiple-scenarios' : ''}` }}><button className={classes.bottom_btn_submit} id="video_chat_page_link" name="video_chat_page_link" onClick={cacheScenarios}><span><a>{t('rateOfRisk.proceed_to_the_next')}</a><img src={ButImg}></img></span></button></Link>
                </div> */}
            </div>}
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

export default connect(stateToProps, dispatchToProps)(RateOfRiskPage)