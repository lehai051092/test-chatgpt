import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { Row, Col } from "reactstrap";
import CircleChart from "../CircleChart";
import CustomChart from "../CustomChart";
import Table from "../Table";
// import VOC from "../TalkListenSection/VOC";
import VOCUpdate from "../TalkListenSectionUpdate/VOC";
import ChatLog from "../ChatLog";
import classes from "./styles.module.css";
import { getAiScoreDetailBySection } from "../../../../request/backendApi/api";
import logger from "redux-logger";
import eventShuttle from "../../../../eventShuttle";
import ISwitch from "../../../../constituents/ISwitch";
import LoadingText from "../../../../constituents/ILoadingText";
import { browserRedirect } from '../../../../utils/util';
// import {isDevOrLocalEnv} from "../../../../utils/runtime";

const ScoringDetail = (props) => {
  const {
    userId,
    sectionId,
    scoreData,
    isClickable,
    passState,
    isExpand,
    indexKey,
    f_chgScore,
    overallScoring,
    expanded,
    f_catchLoading,
    extraClass,
  } = props;
  const { t } = useTranslation();
  const location = useLocation();
  const [vPrecisionPercent, setPrecisionPercent] = useState(null);
  const [vBestUserPrecision, setBestUserPrecision] = useState(0);
  const [vAiScore, setAiScore] = useState([]);
  const [vSelectScore, setSelectScore] = useState({});
  const [vShowStoryImg, setShowStoryImg] = useState(false);
  const [vMessages, setMessages] = useState([]);
  const [vSelectKeyword, setSelectKeyword] = useState(null);
  const [VOCUrl, setVOCUrl] = useState("");
  const [vocData, setVocData] = useState([]);
  const [allVocData, setAllVocData] = useState([]);
  const [vGetAllMessages, setGetAllMessages] = useState([]);
  const [isStatic, setIsStatic] = useState(true);
  const [currentChatID, setCurrentChatID] = useState();
  const [vVOCWrapperShowStatus, setVOCWrapperShowStatus] = useState([false, false, false])
  const [vIsAllVOCOpen, setIsAllVOCOpen] = useState(false)

    //avata image name
    const [vAvatarName, setAvatarName] = useState('');

  useEffect(() => {
    let checker = arr => arr.every(v => v === true);
    checker(vVOCWrapperShowStatus)?setIsAllVOCOpen(true):setIsAllVOCOpen(false);
  }, [vVOCWrapperShowStatus])

  function scoreClickHandle(item) {
    setSelectScore(item);
    let chatID = item.recordId;
    f_chgScore({ index: indexKey, value: item });

    //for voc section
    setIsStatic(true);
    let filterResult =
      allVocData.length > 0 &&
      allVocData.filter((vocItem) => vocItem.chatId === chatID)[0];
    setVocData(filterResult);
    setCurrentChatID(chatID);
    //end voc section
    for (const [key, value] of Object.entries(vGetAllMessages)) {
      if (value.id == chatID) {
        setMessages(value.messages);
      }
    }
    if (item.score) {
      setShowStoryImg(false);
      setPrecisionPercent(parseInt((item.score.precision * 100).toFixed(0)));
    }
  }
  const clickKeyword = (keyword) => {
    setSelectKeyword(keyword);
  };

  const getDetailScore = async (item, loadingLenght) => {
    try {
      let sectionId = item.sectionId;
      let chatId = item.recordsId;
      isClickable &&
        getAiScoreDetailBySection(sectionId, userId).then((res) => {
          if (res.data) {
            let resData = res.data;
            console.log('resss data',resData);
            resData.recordStats.length > 0 && setAvatarName(resData.recordStats[0].section.persona.avatar)
            setPrecisionPercent(
              parseInt((resData.recentUserPrecision * 100).toFixed(0))
            );
            setBestUserPrecision(
              parseInt((resData.bestUserPrecision * 100).toFixed(0))
            );
            setAiScore(resData.recordStats);
            setGetAllMessages(resData.chats);
            setAllVocData(resData.voc);
            let filterResult = resData.voc.filter(
              (vocItem) => vocItem.chatId === chatId
            )[0];
            setVocData(filterResult);

            let filterGetSelected = resData.recordStats.filter(
              (i) => i.recordId === item.recordsId
            )[0];
            setSelectScore(filterGetSelected);
            let chatID = filterGetSelected.recordId;
            for (const [key, value] of Object.entries(resData.chats)) {
              if (value.id == chatID) {
                setMessages(value.messages);
              }
            }
            setPrecisionPercent(
              parseInt((filterGetSelected.score.precision * 100).toFixed(0))
            );
            f_catchLoading(false, loadingLenght);

            // return res.data;
          } else {
            logger.error(
              "パーセントデータエラーです。応答形式が正しくありません。"
            );
          }
        });
    } catch (error) {
      eventShuttle.dispatch(
        "エラーが発生しました。確認してもう一度お試しください。"
      );
    }
  };

  useEffect(() => {
    //get select scroe value
    if (vAiScore.length >= 1) {
      if (passState.item != undefined) {
        // let latestRecord = vAiScore.filter(item => item.recordId == passState.item.recordId);
        // if(latestRecord.length != 0)
        // {
        //     latestRecord = latestRecord[0];
        // }else{
        //     latestRecord = vAiScore[vAiScore.length - 1];
        // }
        // console.log(latestRecord, 'latestRecord')
        // setSelectScore(latestRecord);
        // let chatID = latestRecord.recordId;
        // for (const [key, value] of Object.entries(vGetAllMessages)) {
        //     if (value.id == chatID) {
        //         setMessages(value.messages);
        //     }
        // }
        // if(latestRecord.score)
        // {
        //     setPrecisionPercent(parseInt((latestRecord.score.precision * 100).toFixed(0)));
        // }
      } else {
        // let latestRecord = vAiScore[vAiScore.length - 1];
        // setSelectScore(vAiScore[vAiScore.length - 1]);
        // let chatID = latestRecord.recordId;
        // for (const [key, value] of Object.entries(vGetAllMessages)) {
        //     if (value.id == chatID) {
        //         setMessages(value.messages);
        //     }
        // }
      }
    }
    //   if (state.isShowStory != undefined) {
    //     setShowStoryImg(state.isShowStory);
    //   }
    //   if (vAiScore.length >= 1) {
    //     selectTask(vAiScore[0].section);
    //   }
  }, [vAiScore, vGetAllMessages]);

  useEffect(() => {
    if (overallScoring) {
      let filter = expanded.filter((item) => item.isExpended);
      filter.map(
        (item, i) =>
          item.isExpended &&
          item.index === indexKey &&
          getDetailScore(scoreData, filter.length)
      );
    } else {
      if (isExpand.isExpended && isExpand.index == indexKey) {
        getDetailScore(scoreData, 1);
      }
    }
  }, [sectionId, scoreData, isExpand, indexKey, overallScoring]);

  const handleVOCChange = (event) =>{
    setIsAllVOCOpen(event.target.checked)
    let checkedItem = [];
    for (let index = 0; index < vVOCWrapperShowStatus.length; index++) {
      checkedItem.push(event.target.checked)
    }
    checkedItem.length > 0 && setVOCWrapperShowStatus(checkedItem);
  }

  return (
    <div className={`${browserRedirect()!=1 ? browserRedirect()===3? classes.tablet_view : classes.mobile_view : classes.pc_view}`}>
      <Row className={`mb-2 ${classes.flex_nowrap} ${classes.p_top}`}>
        <Col lg={browserRedirect()===3?`5`:`6`} className={`mb-2 mb-xl-4 d-flex ${classes.charts_col_1}`}>
          <div
            className={`d-flex align-items-center ${classes.circle_wrapper} ${browserRedirect()!=1 ? classes.mobile_circular_view : classes.pc_circular_view}`}
          >
            <div
              className={classes.inner_circle_wrapper}
              id="circle_chart_container"
              name="circle_chart_container"
            >
              <CircleChart
                precisionPercent={vPrecisionPercent}
                bestUserPrecision={vBestUserPrecision}
                extraClass={classes.scoring_detail}
              ></CircleChart>
            </div>
          </div>
        </Col>
        <Col lg="6" className="mb-2 mb-xl-4 d-flex">
          <div
            className={`cmn-bg-box-inr ${classes.line_chart_container}`}
            id="line_chart_container"
            name="line_chart_container"
          >
            <p
              className={`font-16 font-weight-bold text-center m-0 ${classes.line_chart_title}`}
              id="line_chart_header"
              name="line_chart_header"
            >
              {t("aiscore.chartbar.header")}
            </p>
            <CustomChart
              f_scoreClickHandle={scoreClickHandle}
              aiScore={vAiScore}
              is_flag={true}
              scrollAble={true}
              scoreData={scoreData}
              chatID={`multiple_singal_chart_wrapper_${indexKey}_all`}
            ></CustomChart>
          </div>
        </Col>
      </Row>
      <div className={classes.record_detail_wrapper}>
        <p
          className={`font-20 font-weight-bold mb-3 mb-xl-3 ${extraClass} ${classes.scoring_chat_title}`}
          id="table_header"
          name="table_header"
        >
          {t("aiscore.score_by_process")}
        </p>
        <Table
          selectScore={vSelectScore}
          messages={vMessages}
          clickKeyword={clickKeyword}
        ></Table>
      </div>
      <Row className={`my-4 ${browserRedirect()===3&&'pt-2'}`}>
        <Col md={browserRedirect()===3?6:4}>                  
         
          <div>
          <Row className={`${classes.title_border_botton} mx-0 mb-2`} >
                <Col className={`pl-0 ${classes.title_wrapper}`}>
                    <p className={`font-weight-bold m-0 ${browserRedirect()===3?'font-20':'font-16'}`} id="table_header" name="table_header">話し方_分析結果</p>
                </Col>
            </Row>
              <Row>
                  <Col className="mx-1 my-0">
                    <ISwitch onChange={handleVOCChange} checkState={vIsAllVOCOpen} text="全てを表示する"/>
                  </Col>
              </Row>
            <VOCUpdate
              VOCUrl={VOCUrl}
              chatID={currentChatID}
              isOverall={false}
              isStatic={isStatic}
              vocDataStatic={vocData}
              vVOCWrapperShowStatus={vVOCWrapperShowStatus}
              setVOCWrapperShowStatus={setVOCWrapperShowStatus}
            />
          </div>                          
        </Col>
        <Col className={`${classes.scoring_chat_wrapper}`}>
          <Row>
            <Col id="chat_container" name="chat_container">
              <p
                className={`font-20 font-weight-bold mb-3 ${extraClass} ${classes.scoring_chat_title}`}
                id="chat_wrapper"
                name="chat_wrapper"
              >
                {t("aiscore.utterance")}
              </p>
              <ChatLog
                messages={vMessages}
                id="chat_list"
                selectKeyword={vSelectKeyword}
                MsgSelectScore={vSelectScore}
                vAvatarName={vAvatarName}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ScoringDetail;
