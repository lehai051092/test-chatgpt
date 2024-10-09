import React, { useState,useEffect } from 'react';
import { Row, Col } from "reactstrap";
import { useTranslation } from 'react-i18next';
import logger from "redux-logger";
import CustomChip from '../../../../constituents/IChip/CustomChip';
import MouthHabitChip from '../../../../constituents/IChip/MouthHabitChip';
import BackgroundGreenLabel from '../../../../constituents/ILabel/BackgroundGreenLabel';
import eventShuttle from '../../../../eventShuttle'
import { getAllVOCData } from '../../../../request/backendApi/api';
import words from './staticData/Words.json';
import  './styles.css'


const VOCSection = (props) => {
    let {VOCUrl,isOverall,vocDataStatic,isStatic,chatID} = props;
    const { t } = useTranslation();
    const [VOCData, setVOCData] = useState([]);
    const [VOCDataAll, setVOCDataAll] = useState([]);
    const [averageSpeed, setAverageSpeed] = useState(0)
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
            return filterResult !== "" ? filterResult.wordsCount.filter(item => item.word === itemName)[0].count:0;
        }
    }

    return(
        <Row>
            <Col md={12} className="mb-2">
                <BackgroundGreenLabel label="発話速度" idName={autoId()}/>
                <div className="voc-body-border-box rounded p-2 text-center d-flex align-items-center justify-content-center" id="speaking_speed" name="speaking_speed">
                    {
                        averageSpeed < 0 ?
                        <div>
                        <h1 className="speaking-speed-font mb-0 align-items-center middle">現在調整中</h1>
                        </div>
                        :averageSpeed < 4.5?
                        <div>
                            <p className="font-weight-bold ng_word_border_bottom">NG</p><p className="font-weight-bold font-14">少しゆっくり話しすぎているようです。もう少しテンポをあげると聞き取りやすくなります。</p>
                        </div>
                        :averageSpeed > 6.5?
                        <div>
                            <p className="font-weight-bold ng_word_border_bottom">NG</p><p className="font-weight-bold font-14">少し早口になっているようです。もう少しゆっくり話すと聞き取りやすくなります。</p>
                        </div>
                        :
                        <div>
                            <p className="font-weight-bold ng_word_border_bottom">OK</p><p className="font-weight-bold font-14">聞き取りやすい速さで話せています。この速さを維持しましょう。</p>
                        </div>
                    }
                </div>
            </Col>
            <Col md={12} className="mb-2">
                <BackgroundGreenLabel label="口グセ" idName={autoId()}/>
                <div className="voc-body-border-box rounded p-2" id="mount_habit" name="mount_habit">
                    <Row>
                        {
                            words.words.map((item,index) => {
                                return(
                                    <Col md={6} lg={6} className="">
                                        <div key={index}>
                                            <MouthHabitChip text={item.name} status="free_story" count={findWordCount("口グセ",item.name)?findWordCount("口グセ",item.name)+"回":0+"回"}  className="mb-1 custom_habitchip_pd p-0"/>
                                        </div>
                                    </Col>
                                
                                )
                            })
                        }
                    </Row>
                </div>
            </Col>
            <Col md={12}>
                <BackgroundGreenLabel label="NGワード" idName={autoId()}/>
                <div className="voc-body-border-box rounded p-2" id="mount_habit" name="mount_habit">
                    <div className="ngWordScroll">
                        {
                            words.ng_words.map((item,index) => {
                                return(
                                    <span key={index}>
                                        <CustomChip text={item.name} status="free_story" className={`free_story_custom_bg_chit mb-2 ${findWordCount("NGワード",item.name)>0?'is_custom_bg':''}`}/>
                                    </span>
                                )
                            })
                        }
                    </div>
                </div>
            </Col>
        </Row>
    )
}
export default VOCSection;