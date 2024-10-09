import React, {useEffect, useState} from "react";
import {Col, Row} from "reactstrap";
import {useTranslation} from 'react-i18next'

import classes from "./styles.module.css";
import PercentageLabelBox from "../../ILabel/PercentageLabelBox";
import store from '../../../storage';
import {
  CURRENT_CHOSED_PERSONA,
  SELECTED_CUSTOMER_DATA,
  UPDATE_SELECTED_SCENARIO_NAME,
  UPDATE_SELECTED_THEME_NAME
} from '../../../storage/consts'
import ResponsiveDialog from '../../IPopupBox/ImageDialog'
import {useHistory,} from "react-router-dom";

import FreeStoryPersonaImg from '../../../property/images/placeholder_freestory.png'
import {getLightArray, setLocationState} from '../../../utils/util'
import getGifImage from "../../../utils/newMapFIle";


function CancerInsuranceCard({id, onEditScenerio, customerData, loginTaskAll}) {
  const {t,i18n} = useTranslation();

  const [disabled, setDisabled] = useState(false);
  const history = useHistory();
  const [hightLight,setHighLight] = useState([]);
  
  const [imgArr, setImgArr] = useState(null)

  const getGif = (avatarkey, emotionKey = null) => {

    if(!avatarkey)
    {
      return FreeStoryPersonaImg;
    }
    
    getGifImage(avatarkey, emotionKey).then(res => {
      setImgArr(res)
    })
    return imgArr;
  }
  
  const chgScenerio = () => {
    if(customerData.personaType == "freeStory"){
      if(customerData?.sections[0]?.sectionId){
        // must assign the value when returning
        store.dispatch({type: UPDATE_SELECTED_THEME_NAME, selected_theme_name: customerData.theme})
        store.dispatch({type: UPDATE_SELECTED_SCENARIO_NAME, selected_scenario_name: customerData.scenario})
        store.dispatch({type: SELECTED_CUSTOMER_DATA, selected_customer_data: customerData})
        setLocationState('',`free-rate-of-risk/${customerData?.sections[0]?.sectionId}/${customerData.id}`);
        history.push({
          pathname: `/free-rate-of-risk/${customerData?.sections[0]?.sectionId}/${customerData.id}`
        });
      } else {
        console.log(`Error when try to get free story sectionId...`)
      }
    } else if(customerData.personaType == "fastText"){
      if(customerData?.sections[0]?.sectionId){
        // must assign the value when returning
        store.dispatch({type: UPDATE_SELECTED_THEME_NAME, selected_theme_name: customerData.theme})
        store.dispatch({type: UPDATE_SELECTED_SCENARIO_NAME, selected_scenario_name: customerData.scenario})
        setLocationState('',`/fast-text-of-risk/${customerData?.sections[0]?.sectionId}/${customerData.id}`);
        history.push({
          pathname: `/fast-text-of-risk/${customerData?.sections[0]?.sectionId}/${customerData.id}`
        });
      } else {
        console.log(`Error when try to get free story sectionId...`)
      }
    } else if (customerData.personaType == "ChatGPT") {
      store.dispatch({type: UPDATE_SELECTED_THEME_NAME, selected_theme_name: customerData.theme})
      store.dispatch({type: UPDATE_SELECTED_SCENARIO_NAME, selected_scenario_name: customerData.scenario})
      store.dispatch({type: SELECTED_CUSTOMER_DATA, selected_customer_data: customerData})
      setLocationState('',`gpt-story/${customerData?.sections[0]?.sectionId}/${customerData.id}`);
      history.push({
        pathname: `/gpt-story/${customerData?.sections[0]?.sectionId}/${customerData.id}`
      });
    } else{
      onEditScenerio(customerData.id, customerData)
    }
      // save current persona to global storage
      store.dispatch({type: CURRENT_CHOSED_PERSONA, persona: customerData})
      // This should be because the search of the iPad is at the head, while the mobile phone is at the bottom. 
      // The height of the automatic expansion and contraction of the iPad head is not accurate
      // step1 and 2 are the same page
      setTimeout(() => {
        document.documentElement.scrollTop = 0;
      }, 100);
  }

  function ParseFloat(clearedSectionCount, sectionCount) {
    if(sectionCount > 0){
      var progressRate = (clearedSectionCount / sectionCount) * 100
      return Number(progressRate.toFixed(0));
    }
    return 0;
  }

  const capitalize = ([first,...rest]) => first.toUpperCase() + rest.join('').toLowerCase();
  
  const changePicture = (customer) => {
    let image = getGif(customer.avatar)
    return image;
  }

  const operateELearning = async ()=>{
    if(loginTaskAll.managerFlg.value == "0" && loginTaskAll.lcid.value && loginTaskAll.llid.value ){
      setHighLight(await getLightArray(`${loginTaskAll.lcid.value}_${loginTaskAll.llid.value}`))
    }
  }

  useEffect(()=>{
    operateELearning();
  },[loginTaskAll])
  
  return (
    <div id={`card_box_${id}`} name={`card_box_${id}`} 
        className={
          `${classes.card_box} 
          ${ hightLight?.[0] == customerData.theme && hightLight?.[1] == customerData.scenario && hightLight?.[2] == customerData.id ?classes.choose_persona:null}`
        }
    >
      <div className={`${classes.story_name}`}>
        <p id={`persona_${id}`} name={`persona_${id}`} className="mb-0 font-16">{customerData.persona}</p>
      </div>
      <div className={`${classes.card_box_content}`}>
      <Row className={`align-items-start `}>    
        <Col xs="7" className={`${classes.image_box}`}>
          {
            customerData.personaType != "freeStory" ?
            <img id={`image_icon_${id}`} name={`image_icon_${id}`} src={changePicture(customerData)} alt="Sample Photo" className={`${classes.person}`} />:
            <img id={`image_icon_${id}`} name={`image_icon_${id}`} src={FreeStoryPersonaImg} alt="Sample Photo" className={`${classes.person}`} />
          }
        </Col>       
        <Col xs="5" className={`${classes.image_box} text-left`}>
          <p id={`customer_data_${id}`} name={`customer_data_${id}`} className="font-16 mb-3 font-weight-bold">{customerData.name}</p>
          {
            //  customerData.personaType != "freeStory" ?
             <>
             <p id={`customer_age_${id}`} name={`customer_age_${id}`} className="">{customerData.ageGender}</p>
             <p className="mb-0" id={`course_${id}`} >{customerData.course}</p>          
            </>
            //  :
            //  null
          }
        </Col>   
      </Row>
      <Row>
        <Col>       
         <PercentageLabelBox id={id} label={t('recruiter.progress_rate')} percentage={ParseFloat(customerData.clearedSectionCount,customerData.sectionCount)} className="my-3 pb-2 border-bottom d-flex justify-content-center align-items-baseline"/>           
         <p id={`decision_button_${id}`} onClick={chgScenerio} className={`mb-2 ${classes.details}`}>決定</p> 
          {
            (customerData.materials.length != 0) ?
            <ResponsiveDialog className={`${classes.decision_button} ${disabled && classes.grey_text}`}  disabled={disabled} id={`customer_${id}`} item={customerData} /> : <div className={classes.con_height_custom}></div>
          }
        </Col>
      </Row>      
      </div>
    </div>
  );
}

export default CancerInsuranceCard;