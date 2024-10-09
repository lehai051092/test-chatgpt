import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import styles from './styles.module.css';
import Siriwave from 'react-siriwave';


/**
 * IWaveformMobile
 * @returns dom
 */
const IWaveformMobile = ({isVertical,isTablet}) => {
    let chartsStyle = {position:'absolute', left:0, top:isTablet?'5px':'4px', zIndex:5};
    let lineStyle = {position:'absolute', top:!isTablet?isVertical?'36px':'18px':'29px', left:!isTablet?isVertical?'8px':'4px':'5px', border:'1px solid #D9D9D9', width: !isTablet?isVertical?'58px':'30px':'51px'}

    return (
        <div className={`${styles.wave_form} ${!isTablet ? isVertical ? styles.wave_form_vertical : styles.wave_form_landscape : styles.wave_form_vertical_tablet}`}>
            <div style={chartsStyle}>
                <Siriwave height={!isTablet?isVertical?74:38:61} width={!isTablet?isVertical?74:38:61} amplitude={0} color={'#fff'}/>
            </div>
            <div style={lineStyle}></div>
        </div>
    )
}

export default IWaveformMobile;