import React, {useState, useEffect} from 'react';
import { isIE } from 'react-device-detect';

import IESupportedPage from './scenarios/IIESupportedPage/index.js';
import Routes from './router/routes.js';
import SnackBar from './constituents/ISnackbar';
import IdleTimer from 'react-idle-timer';
import store from './storage'
import { WEBSITE_TIME_OUT } from './storage/consts/index.js';
import TimeoutPage from './scenarios/ITimeoutPage/TimeoutPage.js';


class App extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      timeout: 1000 * 60 * 30,
      timeoutFlag:false
    }

    this.idleTimer = null
    this.onIdle = this._onIdle.bind(this)
    
    window["ReleaseLog"] = {
      version: '20211224-release',
      descrption: '1.feature: add one new learning theme 新商品対応編; 2.feature: update UI style with new design ',
      packageJsonVersion: '1.3.0'
    }

    window.onbeforeunload = function(event) {
      if ('caches' in window) {
        caches.keys().then(function(keys){
          keys.forEach(function(request, index, array) {
              caches.delete(request);
          });
        });
      }
    }

  }

  _onAction = (e) => {
    store.dispatch({type: WEBSITE_TIME_OUT, status: false})
  }
  _onActive = (e) => {
    store.dispatch({type: WEBSITE_TIME_OUT, status: false})
  }

  _onIdle(event) {
    const isTimedOut = store.getState().website_time_out;
    if(!isTimedOut) {
      this.setState({
        timeoutFlag:true
      },()=>{
        store.dispatch({type: WEBSITE_TIME_OUT, status: true})
      })
    }else{
      this.idleTimer.reset();
    }
  }

  render(){
    return(
      <>
      {
        this.state.timeoutFlag?
        <TimeoutPage/>
        :
        isIE?
        <IESupportedPage />
        :
        <>
        <SnackBar />
        <IdleTimer
              ref={ref => { this.idleTimer = ref }}
              element={document}
              onIdle={this.onIdle}
              debounce={500}
              onAction={this._onAction}
              onActive={this._onActive}
              timeout={this.state.timeout} />
        <Routes props={this.props}/>
        </>
      }
    </>
    )
  }
}

export default App;
