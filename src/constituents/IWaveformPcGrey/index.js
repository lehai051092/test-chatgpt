import React, { useState, useRef, useLayoutEffect } from 'react';
import * as echarts from 'echarts';
import styles from './styles.module.css';
import Siriwave from 'react-siriwave';


/**
 * IWaveformPc
 * @returns dom
 */
const IWaveformPc = ({value}) => {
    
    const chartsStyle = {position:'absolute',left:6,top:0,zIndex:5};


    const [refresh, setRefresh] = useState(true);

    const [width,setWidth] = useState(window.innerWidth*0.07 - 12);

    const changeDataList = ()=>{
        // console.log('== changeDataList ==',window.innerWidth*0.07);
        setRefresh(false);
        setWidth(window.innerWidth*0.07 - 12);
        setRefresh(true);
    }

    useLayoutEffect(()=>{
        // 监听
        window.addEventListener("resize", changeDataList);
        //初始化加载
        changeDataList()
        // 销毁
        return () => window.removeEventListener("resize", changeDataList);
    },[refresh])


    return (
        <div className={styles.wave_form}>
            {
                refresh?
                <div style={chartsStyle}>
                    <Siriwave height={50} width={width} amplitude={0} color={'#D9D9D9'}/>
                </div>
                :
                null
            }
        </div>
    )
}

export default IWaveformPc;