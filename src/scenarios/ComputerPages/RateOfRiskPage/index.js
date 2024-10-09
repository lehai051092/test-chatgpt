import React, { createRef, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'reactstrap';
import { BrowserRouter as Router, Link, useParams, useLocation, useHistory } from "react-router-dom";
import classes from './styles.module.css'
import { getProcessToken, getTaskInfo } from '../../../request/backendApi/api'
import { connect } from 'react-redux'
import { selectTask } from '../../../storage/reduxActions/index'
import Folding from './Folding'
import BackButton from "../../../constituents/IButton/BackButton"
import { CURRENT_SECTION_COUNT_DOWN, SELECTED_CUSTOMER_DATA } from '../../../storage/consts'
import store from '../../../storage'
import ShowBut from './ShowBut'
import RolePlay from './img/rolePlay.png'
import RolePlayPC from './img/rolePlay_pc.png'
import { browserRedirect, getLocationState, setLocationState } from '../../../utils/util';
import ICoreFrame from '../../../constituents/ICoreFrame';

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
            if (state.length > 0) {
                setThemeName(state[0].persona.themeName);
                setScenarioName(state[0].persona.scenarioName);
                setPersona(state[0].persona.persona);
                setPassState(state[0].persona)
            }
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
        } else if (state && state?.task) {
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
        let tempTask = [];
        // reset the count down in store
        store.dispatch({ type: CURRENT_SECTION_COUNT_DOWN, time: '' })
        const state = getLocationState();
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
            onBack={() => {
                history.push({ pathname: `/start-new-role-play` });
                setLocationState({ lessonId, selectPersona: vPassState }, 'start-new-role-play')
            }}
            component={
                <>
                    <div className={`${classes.rateOfRiskPage} ${classes.position_rela}`}>
                        <Row className={browserRedirect() === 1 ? classes.rateOfRiskPageTitle : `${classes.rateOfRiskPageTitle} ${classes.rateOfRiskPageTitle_tablet}`}>
                            <Col lg="7" className={classes.first_row}>
                                {
                                    browserRedirect() === 1 ?
                                        <>
                                            <Link
                                            to={{ pathname: `/start-new-role-play` }}
                                            onClick={() => { setLocationState({ lessonId, selectPersona: vPassState }, 'start-new-role-play') }}
                                            >
                                                <BackButton idName="rate_of_risk_back_button" title={t('scenario.return')} className={`mr-3 ${classes.btn_adjust} ${classes.back_btn}`} id={autoId()} />
                                            </Link>
                                            <div className={classes.title_style}>
                                                <span>{themeName} {scenarioName}</span>
                                                <span className={classes.title2_style}>{persona}</span>
                                            </div>
                                        </>
                                        : <div className={classes.title_style_tablet}>
                                            <span>{themeName}&nbsp;&nbsp;{scenarioName}</span>
                                            <span className={classes.title2_style_tablet}>{persona}</span>
                                        </div>
                                }
                            </Col>
                            <Col className="text-right" lg="5">
                                <Link
                                to={{ pathname: `/video-chat/${vMultiScenraios[0]?.taskID}/${lessonId}/${location.pathname.includes('multiple-scenarios') ? 'multiple-scenarios' : ''}` }}
                                >
                                    {browserRedirect() === 1 ?
                                        <img width={350} className={classes.bottom_btn_submit_pc} src={RolePlayPC} onClick={cacheScenarios} />
                                        :
                                        <img width={350} className={classes.bottom_btn_submit_tablet} src={RolePlay} onClick={cacheScenarios} />
                                    }
                                </Link>
                            </Col>
                        </Row>
                        {vMultiScenraios && vMultiScenraios.length > 1 ?
                            <Row style={{ height: '50px' }}>
                                <Col lg='12' className={`text-right responsive_size ${classes.showBut_style}`}>
                                    <ShowBut onChange={handleChange} />
                                </Col>
                            </Row>
                            : ""
                        }
                        <Folding multiTasks={vMultiScenraios} vAllSecShowFlag={vAllSecShowFlag}></Folding>
                    </div>
                </>
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

export default connect(stateToProps, dispatchToProps)(RateOfRiskPage)