import React, {  useEffect, useState, useRef, createRef } from "react";
import { useTranslation } from "react-i18next";
import { browserRedirect } from "../../../../utils/util";
import classes from "./styles.module.css";

const CustomChart = ({ aiScore, f_scoreClickHandle, isMultiple, is_flag, state, scrollAble = false, scoreData = null, chatID }) => {
  const { t } = useTranslation();
  const [vChartData, setvChartData] = useState([]);
  const [vIsAlignLeft, setvIsAlignLeft] = useState('');

  const percentage = (item) => {
    if (isMultiple) {
      return (item.precision * 100).toFixed(0);
    } else {
      if (item.score) {
        return (item.score.precision * 100).toFixed(0);
      }
    }
    return 0;
  };

  const dateFormat = (item) => {
    let date = new Date(item);
    return `${date.getMonth() + 1}${t(
      "general.date.month"
    )}${date.getDate()}${t("general.date.day")}`;
  };

  const handleDisplayDirection = ()=>{
    if(aiScore.length > 0)
    {
      if(document.getElementById(chatID)){
        if(document.getElementById(chatID).scrollWidth > document.getElementById(chatID).clientWidth){
          // return ''
        } else {
          setvIsAlignLeft(classes.style_align_to_right)
        }
      }
    }
  }

  useEffect(() => {
    let chartArray = [];
    let sorting = [];
    if (!isMultiple) {
      sorting = aiScore.sort((a, b) => a.recordId - b.recordId);
    } else {
      sorting = aiScore;
    }
    sorting.map((item, index) => {
      chartArray.push({
        id: index,
        month: dateFormat(item.start),
        percentage: percentage(item),
        item: item,
        recordId: item.recordId
      });
    });
    let chartReverse = chartArray.reverse();
    setvChartData(chartReverse);

  }, [aiScore]);
  const average_score = 70;

  const clickBar = (item) => {
    f_scoreClickHandle(item);
  };

  
  useEffect(() => {
    if((state != undefined) || scrollAble ||scoreData != null )
    {
      let scrollItem = vChartData.findIndex(el => el.recordId == state?.item?.recordId)
      if(scrollAble && scoreData != null)
      {
        scrollItem = vChartData.findIndex(el => el.recordId == scoreData.recordsId)
      }
      if(scrollItem > -1)
      {
        let leftOffset = document.getElementById(chatID).clientWidth*2
        document.getElementById(chatID).scrollLeft += -99999999;
        if(scrollAble && scoreData != null)
        {
          document.getElementById(chatID).scrollLeft += document.getElementById(chatID+'_'+scrollItem).getBoundingClientRect().left - 1025;
        }else{
          if(window.screen.width < 480)
          {
            document.getElementById(chatID).scrollLeft += document.getElementById(chatID+'_'+scrollItem).getBoundingClientRect().left - 200;
          }else if(window.screen.width == 1024 || window.screen.width < 1024)
          {
            document.getElementById(chatID).scrollLeft += document.getElementById(chatID+'_'+scrollItem).getBoundingClientRect().left - 900;
          }else{
            document.getElementById(chatID).scrollLeft += document.getElementById(chatID+'_'+scrollItem).getBoundingClientRect().left - leftOffset - 135;
          }
        }
      }
    }
    handleDisplayDirection()
  }, [vChartData])
  
  return (
    <>
      <div className={`${classes.chart_out_per_label2} ${browserRedirect()!=1?browserRedirect()===3?classes.tablet_view:classes.mobile_view:''}`} style={browserRedirect()===3?{top:'10px'}:null}>
        <div className={classes.chart_out_per_label}>
          <ul>
            <li>
              <p>100%</p>
            </li>
            <li>
              <p className={classes.bar_70}>70%</p>
            </li>
            {/* <li>0</li> */}
          </ul>
          <p>0</p>
        </div>
      </div>
      <div className={classes.chart_main_box_out_free_story} id={chatID}>
        <div id={chatID} className={`${classes.chart_main_box} ${vIsAlignLeft}`} >
          <div className={`${classes.chart_main_box_inr}`} >
            {vChartData.map((i, index) => (
              <div
                className={`${classes.chart_box}`}
                key={index}
                onClick={() => clickBar(i.item)}
                id={`${chatID}_${index}`}
              >
                <div
                  style={{ height: i.percentage + "%" }}
                  className={`${
                    i.percentage >= 70 && i.percentage <= 84
                      ? classes.score_rate_medium
                      : i.percentage >= 85 && i.percentage <= 100
                      ? classes.score_rate_more
                      : classes.score_rate_less
                  } ${i.item.commitId && is_flag == true && classes.flag_icon}`}
                >
                  {i.percentage}%
                </div>
                <p className={`${classes.month_label} ${browserRedirect()===3&&'font-14'}`}>{i.month}</p>
              </div>
            ))}
            <span
              className={classes.score_update_label}
              style={{ bottom: average_score + "%" }}
            ></span>
            {/* <span className={classes.score_update_label} style={{bottom: average_score + "%"}}> 合格基準（{average_score}％） </span> */}
            <div className={classes.chart_per_label}>
              <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CustomChart;
