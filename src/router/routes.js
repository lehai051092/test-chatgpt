
import React from 'react';
import { HashRouter as Router} from 'react-router-dom';
import MobileRouter from './mobile/MobileRouter';
import PcRouter from './pc/PcRouter';
import TabletRouter from './tablet/TabletRouter';
import { LastLocationProvider } from 'react-router-last-location';
import { browserRedirect } from '../utils/util';





const Routes = (props) => {

  return (
    <React.Fragment>
      <Router>
        {/* <HeaderBar/> */}
        <LastLocationProvider>
          {
            browserRedirect() === 1 ?  <PcRouter /> : 
            browserRedirect() === 2 ? <MobileRouter props={props}/> : 
            <TabletRouter/>
          }
        </LastLocationProvider>
      </Router>
    </React.Fragment>
  )
};

export default Routes;