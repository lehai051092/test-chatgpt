import { Route, Switch, useLocation } from 'react-router-dom';
import { isDevOrLocalEnv } from '../../utils/runtime'
import PageNotFound from '../../scenarios/PageNotFound';
import Sidebar from '../../constituents/ISidebar';
import AIScore from '../../scenarios/ComputerPages/AIScorePage';
import FreeStoryScorePage from '../../scenarios/ComputerPages/FreeStoryScorePage';
import RateOfRisk1 from '../../scenarios/ComputerPages/RateOfRiskPage';
import FreeRateOfRisk from '../../scenarios/ComputerPages/FreeRateOfRiskPage';
import FastTextOfRiskPage from '../../scenarios/ComputerPages/FastTextOfRiskPage';
import VideoChat from '../../scenarios/ComputerPages/VideoChatPage';
import FastTextPage from '../../scenarios/ComputerPages/FastTextPage';
import StartOfNewRolePlay from '../../scenarios/ComputerPages/StartOfNewRolePlayPage';
import LoginPage from '../../scenarios/ILoginPage'
import HistoryCheck from '../../scenarios/ComputerPages/HistoryCheckPage'
import HistoryCheckDetail from '../../scenarios/ComputerPages/HistoryCheckPage/detail'
import Evaluation from '../../scenarios/ComputerPages/RolePlaySetting/index'
import ScenarioEidtPage from '../../scenarios/ComputerPages/RolePlaySetting/ScenarioEidtPage'
import PersonaEditPage from '../../scenarios/ComputerPages/RolePlaySetting/PersonaEditPage'
import EvaluationDetail from '../../scenarios/ComputerPages/RolePlaySetting/detail'
import RegisterSynonyms from '../../scenarios/ComputerPages/RegisterSynonyms/index'
import Export from '../../scenarios/ComputerPages/ExportPage/index'
import FreeStoryPage from '../../scenarios/ComputerPages/FreeStoryPage/index'
import HistoryListPage from '../../scenarios/ComputerPages/HistoryListPage/index'
import AfMemberStory from '../../scenarios/ComputerPages/AfMemberStory/index'
import ChatGPTAPITester from '../../scenarios/ComputerPages/ChatGPTAPITester/index'
import store from '../../storage'
import SectionEditPage from '../../scenarios/ComputerPages/RolePlaySetting/SectionEditPage';
import TalkScriptWindowPage from "../../scenarios/ComputerPages/TalkScriptWindowPage";
import GPTStoryPage from "../../scenarios/ComputerPages/GPTStoryPage";
import GPTChatPage from "../../scenarios/ComputerPages/GPTChatPage";
import LearningCategoryEditPage from "../../scenarios/ComputerPages/RolePlaySetting/LearningCategoryEditPage";
import DepartmentsPage from "../../scenarios/ComputerPages/DepartmentsPage";


const CheckLoginStatus = () => {
  const location = useLocation();
  const isTalkScriptWindow = location.pathname.indexOf('talk-script-window') > 0
  const mainJsx = <>
    {isTalkScriptWindow ? null :
        <Sidebar/>
    }
    <div
      id="main-content"
      className='content-large'
    >
      {/* <LanguageBar/> */}
      <div
          className={`main-content-inr ${isTalkScriptWindow ? 'chat-window' :null}`}
      >
        <Switch>
          <Route exact path="/ai-score/:taskID/:lessonId" component={AIScore}/>
          <Route exact path="/free-story-score/:taskID/:lessonId" component={FreeStoryScorePage}/>
          <Route exact path="/rate-of-risk/:taskID/:lessonId" component={RateOfRisk1}/>
          <Route exact path="/gpt-story/:taskID/:lessonId" component={GPTStoryPage}/>
          <Route exact path="/gpt-chat/:taskID/:lessonId" component={GPTChatPage}/>
          <Route exact path="/free-rate-of-risk/:taskID/:lessonId" component={FreeRateOfRisk}/>
          <Route exact path="/fast-text-of-risk/:taskID/:lessonId" component={FastTextOfRiskPage}/>
          <Route exact path="/video-chat/:taskID/:lessonId" component={VideoChat}/>
          <Route exact path="/talk-script-window/:taskID/:lessonId/:chatId" component={TalkScriptWindowPage}/>
          <Route exact path="/fast-text/:taskID/:lessonId" component={FastTextPage}/>
          <Route exact path="/video-chat/:taskID/:lessonId/multiple-scenarios" component={VideoChat}/>
          <Route exact path="/start-new-role-play" component={StartOfNewRolePlay}/>
          <Route exact path="/historycheck" component={HistoryListPage}/>
          <Route exact path="/history-check-detail" component={HistoryCheckDetail}/>
          <Route exact path="/history-check-detail/:userId" component={HistoryCheckDetail}/>
          <Route exact path="/admin/associate" component={HistoryCheckDetail}/>
          <Route exact path="/admin/associate/:userId" component={HistoryCheckDetail}/>
          <Route exact path="/free-story-chat-page/:taskID/:lessonId" component={FreeStoryPage}/>
          <Route exact path="/history-list-page" component={HistoryListPage}/>
          <Route exact path="/admin/af-member-free-story" component={AfMemberStory}/>
          <Route exact path="/11" component={HistoryCheck}/>
          <Route path="*" component={StartOfNewRolePlay}/>
        </Switch>
      </div>
    </div>
  </>

  const adminJsx = <>
    {/* <AdminSidebar/> */}
    <Sidebar/>
    <div id="main-content" className='content-large'>
      {/* <LanguageBar/> */}
      <div className="main-content-inr">
        <Switch>
          <Route exact path="/admin/create/" component={Evaluation}/>
          <Route exact path="/admin/LearningCategoryEditPage/" component={LearningCategoryEditPage}/>
          <Route exact path="/admin/ScenarioEidtPage/:themeIndex" component={ScenarioEidtPage}/>
          <Route exact path="/admin/StoryEditPage/:themeCode/:scenarioCode" component={PersonaEditPage}/>
          <Route exact path="/admin/SectionEditPage/:personaId" component={SectionEditPage}/>
          <Route exact path="/admin/register-synonyms" component={RegisterSynonyms}/>
          <Route exact path="/admin/csv" component={Export}/>
          <Route exact path="/admin/departments/" component={DepartmentsPage}/>
          <Route exact path="/admin/create/:tab" component={Evaluation}/>
          <Route exact path="/admin/create/evaluation-detail/:sectionId" component={EvaluationDetail}/>
          <Route exact path="/admin/associate" component={HistoryCheckDetail}/>
          <Route exact path="/admin/associate/:userId" component={HistoryCheckDetail}/>
          <Route exact path="/admin/af-member-free-story" component={AfMemberStory}/>
          <Route exact path="/admin/chat-gpt-api-tester" component={ChatGPTAPITester}/>
          <Route path="*" component={PageNotFound}/>
        </Switch>
      </div>
    </div>
  </>

  // offer a fake login page for debugging and testing in local and DEV env
  if (isDevOrLocalEnv()) {
    if (location.pathname == '/') {
      return <Route exact path="/" component={LoginPage}/>
    } else {
      return ShowAdminOrNormalPage(adminJsx, mainJsx);
    }
  } else {
    return ShowAdminOrNormalPage(adminJsx, mainJsx);
  }
};


const ShowAdminOrNormalPage = (adminJsx, mainJsx) => {
  const location = useLocation();
  let userAuth = store.getState().login_task_all ? store.getState().login_task_all.userRoles : [];

  if (location.pathname.split("/")[1] == 'admin' && userAuth && (userAuth.includes("I3ASEadministrator") || userAuth.includes("I3ASEADMINISTRATOR"))) {
    return adminJsx;
  } else {
    return mainJsx;
  }
}


export default CheckLoginStatus;