import React, { useState,useEffect } from 'react';
import { Row, Col } from "reactstrap";
import { useTranslation } from 'react-i18next';
import logger from "redux-logger";
import CustomChip from '../../../../constituents/IChip/CustomChip';
import MouthHabitChip from '../../../../constituents/IChip/MouthHabitChip';
import BackgroundGreenLabel from '../../../../constituents/ILabel/BackgroundGreenLabel'
import eventShuttle from '../../../../eventShuttle'
import { getAllVOCData } from '../../../../request/backendApi/api';
import words from './staticData/Words.json';

import question_icon from '../../../../property/images/question_icon.png'
import cross_icon from '../../../../property/images/cross_icon.png'
import evaluation_icon1 from '../../../../property/images/evaluation_icon1.png'
import evaluation_icon3 from '../../../../property/images/evaluation_icon3.png'
import evaluation_dash_icon from '../../../../property/images/evaluation_dash_icon.svg'
import { browserRedirect } from '../../../../utils/util';
import vector_icon from '../../../../property/images/Vector.png';
import classes from './styles.module.css';

const VOCSection = (props) => {
    let {VOCUrl,isOverall,vocDataStatic,isStatic,chatID,vVOCWrapperShowStatus,setVOCWrapperShowStatus} = props;
    const { t } = useTranslation();
    const [VOCData, setVOCData] = useState([]);
    const [VOCDataAll, setVOCDataAll] = useState([]);
    const [averageSpeed, setAverageSpeed] = useState(0)
    const [ngWordsCount, setNgWordsCount] = useState(0)
    const [habitCount, setHabitCount] = useState(0)

    const [vVOCWrapperShowTextStatus, setVOCWrapperShowTextStatus] = useState([false, false])

    let lastId = 0;
    const autoId = (prefix = 'talklisten-section-two-') => {
        lastId++;
        return `${prefix}${lastId}`;
    }

    useEffect(() => {
        if (isOverall) {
            vocDataStatic && setVOCData(vocDataStatic.vocAll)
            vocDataStatic && setAverageSpeed(vocDataStatic.vocAll.speed)
        }else{
            if (isStatic) {
                // if click the sub section in multiple mode
                setVOCData(vocDataStatic)
                setAverageSpeed(vocDataStatic && vocDataStatic.speed)
            }else{
                // filter the data if chatID changes
                let filterResult = VOCDataAll.filter(item => item.chatId === chatID)[0];
                if (filterResult) {
                    setVOCData(filterResult)
                    setAverageSpeed(filterResult.speed)
                }
            }
        }
        
    }, [vocDataStatic,chatID])

    useEffect(()=>{
        // total list, once is enough
        VOCUrl && getVOCData(VOCUrl);
    }, [VOCUrl])

    useEffect(() => {
        let ngwords = 0;
        let habitwords = 0;
        words.words.map(item =>{
            habitwords += findWordCount("口グセ",item.name);
        })
        words.ng_words.map(item =>{
            ngwords += findWordCount("NGワード",item.name);
        })
        setHabitCount(habitwords?habitwords:0);
        setNgWordsCount(ngwords?ngwords:0);
    }, [VOCData])

    const getVOCData = (url) => {
        let filterChatId = chatID;
        try {
        if(filterChatId){
            getAllVOCData(url).then((res) => {
                if (res.data) {
                    setVOCDataAll(res.data);
                    let filterResult = res.data.filter(item => item.chatId === filterChatId)[0];
                    if (filterResult) {
                        setVOCData(filterResult)
                        setAverageSpeed(filterResult.speed)
                    }
                } else {
                  logger.error(
                    "リスク率履歴リストのエラーです。応答形式が正しくありません。"
                  );
                }
              });
        }
        } catch (error) {
            eventShuttle.dispatch(
                "エラーが発生しました。確認してもう一度お試しください。"
            );
        }
    }

    const findWordCount = (categoryName,itemName) =>{
        let filterResult = VOCData && VOCData.categories ? VOCData.categories.filter(o => o.category === categoryName)[0]:"";
        if(filterResult)
        {
            let result = filterResult !== "" ? filterResult.wordsCount.filter(item => item.word === itemName)[0].count:0;
            // categoryName === "NGワード"?setNgWordsCount(ngWordsCount + result):setHabitCount(habitCount + result);
            return result;
        }
    }

    const closeVOCWrapper = (index) => {
        let cloneData = [...vVOCWrapperShowStatus];
        cloneData[index] = !cloneData[index]
        setVOCWrapperShowStatus(cloneData);
    }

    const closeVOCTextWrapper = (index) => {
        setVOCWrapperShowTextStatus(prevVOCWrapperShowTextStatus => ({
            ...prevVOCWrapperShowTextStatus,
            [index]: !prevVOCWrapperShowTextStatus[index]
        }));
    }

    const getSpeakingSpeedIcon = (averageSpeed) =>{        
        if(averageSpeed === -1){
            return evaluation_dash_icon;
        }
        else if(averageSpeed >= 4.5 && averageSpeed <= 6.5){
            return evaluation_icon1;
        }
        else if(averageSpeed < 4.5 || averageSpeed > 6.5){
            return cross_icon;
        }        
        else{
            return evaluation_icon1;
        }    
    }

    const getNgWordIcon = (ngWordTotal) =>{
        if(ngWordTotal === 0){
            return evaluation_icon1;
        }else if(ngWordTotal === 1 || ngWordTotal === 2){
            return evaluation_icon3;
        }else if(ngWordTotal >= 3){
            return cross_icon;
        }else{
            return evaluation_icon1;
        }
    }
    const getHabitWordIcon = (habitWordTotal) =>{
        if(habitWordTotal <= 10){
            return evaluation_icon1;
        }else if(habitWordTotal >= 11 && habitWordTotal <= 20){
            return evaluation_icon3;
        }else if(habitWordTotal >= 21){
            return cross_icon;
        }else{
            return evaluation_icon1;
        }
    }

    return(
        <>
         {/* <div className="speak-analytic-reuslt hide mb-3">
            <div className="analytic-reuslt-header">
                <p idName={autoId()} className="font-18 mb-0 font-weight-bold">発話速度</p>
                <button className="open-btn"><span className="open-btn-text">詳細の表示</span> <span className="open-btn-icon"></span></button>
            </div>
            <div className="analytic-reuslt-body">
                <h2 className="speaking-speed-font mb-0">現在調整中</h2>
            </div>
        </div> */}

        <div className={`${classes.speak_analytic_reuslt} ${browserRedirect()===3?classes.speak_analytic_reuslt_tablet:null} mb-3`}>
            <div className={classes.analytic_reuslt_header}>
                <p idName={autoId()} className="font-18 mb-0 font-weight-bold">発話速度</p>
                {/* <button className="open-btn"><span className="open-btn-text">詳細の表示</span> <span className="open-btn-icon"></span></button> */}

                <button className={`${classes.open_btn} ${isOverall?"":classes.btn_width} ${ vVOCWrapperShowStatus[0] && classes.show}`} onClick={() => closeVOCWrapper(0)}>
                    {
                        isOverall && <span className={`${classes.open_btn_text} ${ vVOCWrapperShowStatus[0] && classes.show}`}>詳細の表示</span>
                    }
                    <span className={classes.open_btn_icon}></span>
                </button>
            </div>
            <div className={classes.analytic_reuslt_body}>
                <Row className={`mb-3 mx-0 ${classes.analytic_reuslt_body_row}`}>
                    <Col xs={browserRedirect()===3?`6`:`5`} className='d-flex align-items-center px-0 justify-content-end'><h2 className={`mb-0 text-center text-lg-left ${browserRedirect()===3?`font-20`:`font-16`}`}>{averageSpeed < 0 ? '全てテキスト' : averageSpeed + '文字/秒'}</h2></Col>
                    <Col xs={browserRedirect()===3?`6`:`7`} style={browserRedirect()===3?{paddingRight:'0'}:null}>
                        <button className={`${classes.evaluation_btn} ml-auto`} >
                            <span>評価</span>
                            <span>
                                <img src={getSpeakingSpeedIcon(averageSpeed)} alt="cross_icon" className=""/>
                            </span>
                        </button>
                    </Col>
                </Row>
                {
                    vVOCWrapperShowStatus[0] &&
                    <>             
                    <div className={classes.evaluation_point}>
                        <img src={vector_icon} alt='eval_point' className="float-left mr-2 my-1"></img>
                        <p className="font-18 font-weight-bold mb-3">評価のポイント</p>
                        <ul className="font-16 pl-3">
                            <li>発話速度が4.5文字未満・6.6文字以上の時は×評価、4.5文字以上・6.5文字以下の時は○評価になります。</li>                        
                            <li>
                                { 
                                    averageSpeed < 0 ?
                                    "全てテキスト入力されている場合は評価されません。"
                                    :
                                    averageSpeed < 4.5?
                                    "少しゆっくり話しすぎているようです。もう少しテンポをあげると聞き取りやすくなります。"                     
                                    :averageSpeed > 6.5?
                                    "少し早口になっているようです。もう少しゆっくり話すと聞き取りやすくなります。"                                                         
                                    :
                                    "聞き取りやすい速さで話せています。この速さを維持しましょう。 "                         
                                }
                            </li>
                        </ul>
    
                    </div>
                    </>
                }
            </div>
            {
                // vVOCWrapperShowStatus[0] &&
                // <div className={classes.analytic_reuslt_body}>
                //     {/* <h2 className={`${classes.speaking_speed_font} mb-0`}>現在調整中</h2> */}
                //     {
                //         averageSpeed < 0 ?
                //         <div>
                //         <h1 className="speaking-speed-font mb-0 align-items-center middle">現在調整中</h1>
                //         </div>
                //         :averageSpeed < 4.5?
                //         <div>
                //             <p className="font-weight-bold ng_word_border_bottom">NG</p><p className="font-weight-bold font-14">少しゆっくり話しすぎているようです。もう少しテンポをあげると聞き取りやすくなります。</p>
                //         </div>
                //         :averageSpeed > 6.5?
                //         <div>
                //             <p className="font-weight-bold ng_word_border_bottom">NG</p><p className="font-weight-bold font-14">少し早口になっているようです。もう少しゆっくり話すと聞き取りやすくなります。</p>
                //         </div>
                //         :
                //         <div>
                //             <p className="font-weight-bold ng_word_border_bottom">OK</p><p className="font-weight-bold font-14">聞き取りやすい速さで話せています。この速さを維持しましょう。</p>
                //         </div>
                //     }
                // </div>
            }
        </div>

        <div className={`${classes.speak_analytic_reuslt} ${browserRedirect()===3?classes.speak_analytic_reuslt_tablet:null} mb-3`}>
            <div className={classes.analytic_reuslt_header}>
            <p idName={autoId()} className="font-18 mb-0 font-weight-bold">NGワード  
                    <span className='d-inline-block position-relative'>
                    <img onClick={() => closeVOCTextWrapper(0)} src={question_icon} alt="question_icon" className={`ml-3 cursor-pointer ${classes.analytic_reuslt_ques_icon}`}/>
                    {
                        vVOCWrapperShowTextStatus[0] && <span className={`${classes.expand_text_wrapper} ${classes.free_story_expand_text_wrapper} ${browserRedirect()!=1? classes.mobile_expand_text_wrapper:''}`}>募集人苦情やコンプライアンス違反に繋がりそうなワードを発したかどうかがカウントされます。   
                        </span>
                    }
                    </span></p>

                <button className={`${classes.open_btn} ${isOverall?"":classes.btn_width} ${ vVOCWrapperShowStatus[1] && classes.show}`} onClick={() => closeVOCWrapper(1)}>
                    {
                        isOverall &&  <span className={`${classes.open_btn_text} ${ vVOCWrapperShowStatus[1] && classes.show}`}>詳細の表示</span>
                    }
                    <span className={classes.open_btn_icon}></span>
                </button>

            </div>
            <div className={classes.analytic_reuslt_body}>
                <Row className={`mb-3 mx-0 ${classes.analytic_reuslt_body_row}`}>
                    <Col xs={browserRedirect()===3?`6`:`5`} className='d-flex align-items-center px-0  justify-content-end'><h2 className={`${classes.speaking_speed_font} mb-0 text-lg-left `}>{ngWordsCount}回</h2></Col>
                    <Col xs={browserRedirect()===3?`6`:`7`} style={browserRedirect()===3?{paddingRight:'0'}:null}>
                        <button className={`${classes.evaluation_btn} ml-auto`} >
                            <span>評価</span>
                            <span>
                                <img src={getNgWordIcon(ngWordsCount)} alt="cross_icon" className=""/>
                            </span>
                        </button>
                    </Col>
                </Row>
                {
                    vVOCWrapperShowStatus[1] &&
                    <>
                    <Row className="mb-3 mx-0">
                    {
                            words.ng_words.map((item,index) => {
                                return(
                                    <Col xs={6} md={isOverall ?3:6} lg={isOverall ?3:6} className="mb-1">
                                    <div key={index}>
                                        {/* <CustomChip text={item.name} className={`${classes.free_story_custom_bg_chit} mb-1 ${findWordCount("NGワード",item.name)>0?'is_custom_bg':''}`}/> */}
                                        <MouthHabitChip text={item.name} count={findWordCount("NGワード",item.name)?findWordCount("NGワード",item.name)+"回":0+"回"} isbg={ findWordCount("NGワード",item.name)>0 ? true : false}  className={`${classes.custom_habitchip_pd} mb-1 p-0 font-14`}/>
                                    </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                    <div className={classes.evaluation_point}>
                        <img src={vector_icon} alt='eval_point' className="float-left mr-2 my-1"></img>
                        <p className="font-18 font-weight-bold mb-3">評価のポイント</p>
                        <ul className="font-16 pl-3">
                            <li>NGワードが0回の場合は〇評価、1回以上3回未満の場合は△評価、3回以上の場合は✕評価となります。</li>
                            <li>NGワードは既契約の短所を不当に強調して誤解させるおそれのあるワードを選定しております。お客様とのトラブルを未然に防ぐためにもNGワードを使わないよう留意しましょう。</li>
                        </ul>
    
                    </div>
                    </>
                }
            </div>       
        </div>

        <div className={`${classes.speak_analytic_reuslt} ${browserRedirect()===3?classes.speak_analytic_reuslt_tablet:null} mb-3`}>
            <div className={classes.analytic_reuslt_header}>
                <p idName={autoId()} className="font-18 mb-0 font-weight-bold">口ぐせ
                <span className='d-inline-block position-relative'>
                    <img onClick={() => closeVOCTextWrapper(1)} src={question_icon} alt="question_icon" className={`ml-3 cursor-pointer ${classes.analytic_reuslt_ques_icon}`}/>
                    {
                        vVOCWrapperShowTextStatus[1] && <span className={`${classes.expand_text_wrapper} ${isOverall? classes.second_overall_expand_text_wrapper:''}`}>募集人が発した口ぐせの回数がカウントされます。</span>
                    }
                </span>
                </p>                

                <button className={`${classes.open_btn} ${isOverall?"":classes.btn_width} ${ vVOCWrapperShowStatus[2] && classes.show}`} onClick={() => closeVOCWrapper(2)}>
                    {
                        isOverall && <span className={`${classes.open_btn_text} ${ vVOCWrapperShowStatus[2] && classes.show}`}>詳細の表示</span>
                    }
                    <span className={classes.open_btn_icon}></span>
                </button>

            </div>
            <div className={classes.analytic_reuslt_body}>
                <Row className={`mb-3 mx-0 ${classes.analytic_reuslt_body_row}`}>
                    <Col xs={browserRedirect()===3?`6`:`5`} className='d-flex align-items-center px-0  justify-content-end'><h2 className={`${classes.speaking_speed_font} mb-0 text-lg-left`}>{habitCount}回</h2></Col>
                    <Col xs={browserRedirect()===3?`6`:`7`} style={browserRedirect()===3?{paddingRight:'0'}:null}>
                        <button className={`${classes.evaluation_btn} ml-auto`} >
                            <span>評価</span>
                            <span>
                                <img src={getHabitWordIcon(habitCount)} alt="cross_icon" className=""/>
                            </span>
                        </button>
                    </Col>
                </Row>
                {
                    vVOCWrapperShowStatus[2] &&
                    <>
                    <Row className="mb-3 mx-0">
                        { 
                            words.words.map((item,index) => {
                                return(
                                    <Col xs={6} md={isOverall ?3:6} lg={isOverall ?3:6} className="mb-1">
                                        <div key={index}>
                                        <MouthHabitChip text={item.name} count={findWordCount("口グセ",item.name)?findWordCount("口グセ",item.name)+"回":0+"回"} isbg={ findWordCount("口グセ",item.name)>0 ? true : false}  className={`${classes.custom_habitchip_pd} mb-1 p-0 font-14}`}/>
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                    <div className={classes.evaluation_point}>
                        <img src={vector_icon} alt='eval_point' className={`float-left mr-2 my-1`}></img>
                        <p className="font-18 font-weight-bold mb-3">評価のポイント</p>
                        <ul className="font-16 pl-3">
                            <li>口ぐせが10回以下の場合は〇評価、11回以上21回未満の場合は△評価、21回以上の場合は✕評価となります。</li>
                            <li>口ぐせが多いと、お客様が会話に集中できずに提案内容を理解してもらえない可能性がありますので、極力減らしていきましょう。</li>                                                
                        </ul>
                    </div>
                    </>
                }
            </div>       
        </div>

        {/* <div className="speak-analytic-reuslt mb-3">
            <div className="analytic-reuslt-header">
                <p idName={autoId()} className="font-18 mb-0 font-weight-bold">NGワード  <img src={question_icon} alt="question_icon" class="ml-3"/></p>
                <button className="open-btn show"><span className="open-btn-text show">詳細の表示</span> <span className="open-btn-icon"></span></button>
            </div>
            <div className="analytic-reuslt-body">
                <Row className="mb-3">
                    <Col xs="6"><h2 className="speaking-speed-font mb-0 text-center text-lg-left">1回</h2></Col>
                    <Col xs="6"><button className="evaluation-btn ml-auto"><span>評価</span> <span><img src={evaluation_icon1} alt="evaluation_icon1" class=""/></span></button></Col>
                </Row>               
                <Row className="mb-3">
                    { 
                        words.words.map((item,index) => {
                            return(
                                <Col xs={6} md={3} lg={3} className="mb-1">
                                    <div key={index}>
                                        <MouthHabitChip text={item.name} count={findWordCount("口グセ",item.name)?findWordCount("口グセ",item.name)+"回":0+"回"}  className="mb-1 custom_habitchip_pd p-0 font-18"/>
                                    </div>
                                </Col>
                            )
                        })
                    }
                </Row>
                <div class="evaluation-point">
                    <p className="font-18 font-weight-bold mb-3">評価のポイント</p>
                    <ul className="font-16 pl-3">
                        <li>NGワードが０回は〇評価、1回は△評価、2回以上×評価となります</li>
                        <li>NGワードはお客様からの苦情やコンプライアンス違反につながります。発話しないよう気を付けましょう NGワードはお客様からの苦情やコンプライアンス違反につながります。発話しないよう気を付けましょう</li>
                    </ul>

                </div>
            </div>       
        </div> */}
        {/* <Row>
            <Col md={isOverall?4:12}>
                <BackgroundGreenLabel label="発話速度" idName={autoId()}/>
                <div className={`${isOverall?'voc-body-border-box':'voc-body-border-box-single mb-2'} text-center d-flex align-items-center justify-content-center  rounded p-2`} id="speaking_speed" name="speaking_speed">
                    <h1 className="speaking-speed-font mb-0">現在調整中</h1>
                </div>
            </Col>
            <Col md={isOverall?4:12}>
                <BackgroundGreenLabel label="口グセ" idName={autoId()}/>
                <div className={`${isOverall?'voc-body-border-box':'voc-body-border-box-single mb-2'} rounded p-2`} id="mount_habit" name="mount_habit">
                    <Row>
                        {
                            words.words.map((item,index) => {
                                return(
                                    <Col md={6} lg={6} className="">
                                        <div key={index}>
                                            <MouthHabitChip text={item.name} count={findWordCount("口グセ",item.name)?findWordCount("口グセ",item.name)+"回":0+"回"}  className="mb-1 custom_habitchip_pd p-0"/>
                                        </div>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
            </Col>
            <Col md={isOverall?4:12}>
                <BackgroundGreenLabel label="NGワード" idName={autoId()}/>
                <div className={`${isOverall?'voc-body-border-box':'voc-body-border-box-single'} rounded p-2`} id="mount_habit" name="mount_habit">
                    <div className="ngWordScroll">
                        {
                            words.ng_words.map((item,index) => {
                                return(
                                    <span key={index}>
                                        <CustomChip text={item.name} className={`free_story_custom_bg_chit mb-1 ${findWordCount("NGワード",item.name)>0?'is_custom_bg':''}`}/>
                                    </span>
                                )
                            })
                        }
                    </div>
                </div>
            </Col>
        </Row> */}
        </>
    )
}
export default VOCSection;