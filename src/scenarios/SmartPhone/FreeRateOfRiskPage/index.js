import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useHistory, useParams} from "react-router-dom";
import classes from './styles.module.css'
import {getLessonTask} from '../../../request/backendApi/api'
import {connect} from 'react-redux'
import {selectTask} from '../../../storage/reduxActions/index'
import Folding from './Folding'
import {CURRENT_SECTION_COUNT_DOWN} from '../../../storage/consts'
import store from '../../../storage'
import ICoreFrame from '../../../constituents/ICoreFrame';
import RateOfRiskSubmit from '../../../property/images/rate_of_risk_submit.png'
import {setLocationState} from '../../../utils/util';

const FreeRateOfRiskPage = ({selectTask, select_task}) => {
    const { t } = useTranslation();
    const history = useHistory();
    let lastId = 0;
    const autoId = (prefix = 'rate-of-risk-') => {
        lastId++;
        return `${prefix}${lastId}`;
    }
    let { taskID } = useParams();
    let { lessonId } = useParams();
    const [vMultiScenraios, setMuptiScenarios] = useState([]);
    const [sectionData, setSectionData] = useState({});
    const [themeName, setThemeName] = useState();
    const [scenarioName, setScenarioName] = useState();
    const [persona, setPersona] = useState();

    useEffect(()=>{
        getLessonTask(`lessons/${lessonId}/tasks`).then(res => {           
            const task = res.data[0];
            if(task.persona){
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

    const cacheScenarios = ()=>{
        let tempTask = [];
        // reset the count down in store
        store.dispatch({type: CURRENT_SECTION_COUNT_DOWN, time: ''})
        if(sectionData){
            let tempList = [];
            tempList.push(sectionData);
            selectTask([...tempList]);
        }
    }
    
    const backOnlick=()=>{
        return ''
    }

    return (
        <ICoreFrame
            onBack={()=>{
                history.push({pathname:`/start-new-role-play`});
                setLocationState({ lessonId:lessonId, freeModel:true}, 'start-new-role-play');
            }}
            component={<>
                <div className={`${classes.rateOfRiskPage} ${classes.position_rela}`}>
                    <div className={classes.title_style}>
                        <div>{themeName}&nbsp;&nbsp;{scenarioName}</div>
                        <div className={classes.title_p}>{persona}</div>
                    </div>     
                    <div className={classes.bottom_butt}>
                        <Link className={classes.a_style} to={{ pathname: `/free-story-chat-page/${vMultiScenraios[0]?.taskID}/${lessonId}`}}
                                onClick={()=>{setLocationState({ freeModel:true , senario:vMultiScenraios[0] }, `free-story-chat-page/${vMultiScenraios[0]?.taskID}/${lessonId}`)}}>
                            <div align={'center'}>
                                <img width={380} onClick={cacheScenarios} src={RateOfRiskSubmit}></img>
                            </div>
                        </Link>
                    </div>           
                    <Folding multiTasks={vMultiScenraios}></Folding>
                </div>
            </>}
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

export default connect(stateToProps, dispatchToProps)(FreeRateOfRiskPage)