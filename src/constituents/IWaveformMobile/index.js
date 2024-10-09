import React, { useState, useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import styles from './styles.module.css';
import Siriwave from 'react-siriwave';


/**
 * IWaveformMobile
 * @returns dom
 */
const IWaveformMobile = ({value,isVertical,isTablet}) => {
    let chartsStyle = {position:'absolute', left:0, top:isTablet?'5px':'4px', zIndex:5};

    useEffect(()=>{

    },[value])

    return (
        <div className={`${styles.wave_form} ${!isTablet ? isVertical?styles.wave_form_vertical:styles.wave_form_landscape : styles.wave_form_vertical_tablet}`}>
            <div style={chartsStyle}>
                <Siriwave height={!isTablet?isVertical?74:38:61} width={!isTablet?isVertical?74:38:61} amplitude={value*3} color={'#AED1CF'}/>
            </div>
        </div>
    )
}

export default IWaveformMobile;