import React, {useEffect} from 'react';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import PropTypes from 'prop-types';
import {Route, Switch, useHistory, useLocation} from 'react-router-dom';
import {isDevOrLocalEnv} from '../../utils/runtime'
import PageNotFound from '../../scenarios/PageNotFound';
import VideoChat from '../../scenarios/SmartPhone/IStageOnePages/VideoChatPage';
import FastTextPage from '../../scenarios/SmartPhone/MobileFastTextPage';
import AIScore from '../../scenarios/ComputerPages/AIScorePage';
import FreeStoryScorePage from '../../scenarios/ComputerPages/FreeStoryScorePage';
import RateOfRisk1 from '../../scenarios/SmartPhone/RateofRiskPage'
import FreeRateOfRisk from '../../scenarios/SmartPhone/FreeRateOfRiskPage'
import FastTextOfRiskPage from '../../scenarios/SmartPhone/FastTextOfRiskPage';
import StartOfNewRolePlay from '../../scenarios/ComputerPages/StartOfNewRolePlayPage';
import LoginPage from '../../scenarios/ILoginPage'
import HistoryCheckDetail from '../../scenarios/ComputerPages/HistoryCheckPage/detail'
import Evaluation from '../../scenarios/ComputerPages/RolePlaySetting/index'
import EvaluationDetail from '../../scenarios/ComputerPages/RolePlaySetting/detail'
import RegisterSynonyms from '../../scenarios/ComputerPages/RegisterSynonyms/index'
import Export from '../../scenarios/ComputerPages/ExportPage/index'
import FreeStoryPage from '../../scenarios/SmartPhone/MobileFreeStoryPage/index'
import HistoryListPage from '../../scenarios/ComputerPages/HistoryListPage/index'
import AfMemberStory from '../../scenarios/ComputerPages/AfMemberStory/index'
import store from '../../storage'
import '../../../src/color.css'
import MobileGPTStoryPage from "../../scenarios/SmartPhone/MobileGPTStoryPage";
import MobileGPTChatPage from "../../scenarios/SmartPhone/MobileGPTChatPage";

const ElevationScroll = (props) => {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });
    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};


const CheckLoginStatus = () => {
    const location = useLocation();
    const mainJsx = <>
          <Switch>
            <Route exact path="/ai-score/:taskID/:lessonId" component={AIScore} />
            <Route exact path="/free-story-score/:taskID/:lessonId" component={FreeStoryScorePage} />
            <Route exact path="/rate-of-risk/:taskID/:lessonId" component={RateOfRisk1} />
            <Route exact path="/free-rate-of-risk/:taskID/:lessonId" component={FreeRateOfRisk} />
            <Route exact path="/gpt-story/:taskID/:lessonId" component={MobileGPTStoryPage}/>
            <Route exact path="/gpt-chat/:taskID/:lessonId" component={MobileGPTChatPage}/>
            <Route exact path="/fast-text-of-risk/:taskID/:lessonId" component={FastTextOfRiskPage} />
            <Route exact path="/video-chat/:taskID/:lessonId" component={VideoChat} />
            <Route exact path="/video-chat/:taskID/:lessonId/multiple-scenarios" component={VideoChat} />
            <Route exact path="/fast-text/:taskID/:lessonId" component={FastTextPage} />
            <Route exact path="/start-new-role-play" component={StartOfNewRolePlay} />
            <Route exact path="/history-list-page" component={HistoryListPage} />
            <Route exact path="/historycheck" component={HistoryListPage} />
            <Route exact path="/history-check-detail" component={HistoryCheckDetail} />
            <Route exact path="/history-check-detail/:userId" component={HistoryCheckDetail} />
            <Route exact path="/admin/associate" component={HistoryCheckDetail} />
            <Route exact path="/admin/associate/:userId" component={HistoryCheckDetail} />
            <Route exact path="/free-story-chat-page/:taskID/:lessonId" component={FreeStoryPage} />
            <Route exact path="/admin/af-member-free-story" component={AfMemberStory} />
            <Route path="*" component={StartOfNewRolePlay} />
          </Switch>
    </>
  
    const adminJsx = <>
          <Switch>
            <Route exact path="/admin/create/" component={Evaluation} />
            <Route exact path="/admin/register-synonyms" component={RegisterSynonyms} />
            <Route exact path="/admin/csv" component={Export} />
            <Route exact path="/admin/create/:tab" component={Evaluation} />
            <Route exact path="/admin/create/evaluation-detail/:sectionId" component={EvaluationDetail} />
            <Route exact path="/admin/associate" component={HistoryCheckDetail} />
            <Route exact path="/admin/associate/:userId" component={HistoryCheckDetail} />
            <Route exact path="/admin/af-member-free-story" component={AfMemberStory} />
            <Route path="*" component={PageNotFound} />
          </Switch>
    </>
  
    // offer a fake login page for debugging and testing in local and DEV env
    if (isDevOrLocalEnv()) {
      if (location.pathname == '/') {
        return <Route exact path="/" component={LoginPage} />
      } else {
        return ShowAdminOrNormalPage(adminJsx, mainJsx);
      }
    } else {
      return ShowAdminOrNormalPage(adminJsx, mainJsx);
    }
  };


const ShowAdminOrNormalPage = (adminJsx, mainJsx)=>{
  const location = useLocation();
  let userAuth = store.getState().login_task_all? store.getState().login_task_all.userRoles : [];

  if(location.pathname.split("/")[1] == 'admin' && userAuth && (userAuth.includes("I3ASEadministrator") || userAuth.includes("I3ASEADMINISTRATOR"))){
    return adminJsx;
  } else {
    return mainJsx;
  }
}

/**
 * mobile 
 * 
 * @param {*} props 
 * @returns 
 */
const MobileRouter = ({ props }) => {

    const history = useHistory();

    useEffect(()=>{
      history.listen(route => {
        document.documentElement.scrollTop= -10;
        console.log(route)
      })
    },[])

    return (
      <CheckLoginStatus/>
    )
}

export default MobileRouter;
