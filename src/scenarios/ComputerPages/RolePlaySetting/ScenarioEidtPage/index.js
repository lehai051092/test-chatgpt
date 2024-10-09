import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import DownArrow from "../../../../property/images/down_arrow_triangle.svg";
import UpArrow from "../../../../property/images/up_arrow_triangle.svg";
import talkScriptInputPencil from '../../../../property/icons/talk-script-input-pencil.svg';
import CloseButton from "../../../../property/images/close_icon.svg";
import classes from "./styles.module.css";
import { updateScenariosByTheme, getAllScenariosByTheme, getScenarioChangeToActive } from "../../../../request/backendApi/api";

import ScenarioAddOrEditDialog from "./ScenarioEidtPageDialog";
import { useHistory,useParams } from "react-router-dom";
import BackButton from "../../../../constituents/IButton/BackButton";
import { addLocationState, getLocationState, setLocationState } from '../../../../utils/util';
import ConfirmDialog from "../ConfirmDialog";
import Snackbar from '@material-ui/core/Snackbar';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from "../../../../constituents/IRadioButtons";   
import WarningPopup from "../WarningPopup";


const ScenarioEidtPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  
  const [vOpt1Theme,setOpt1Theme] = useState(null);
  const [vOptions2,setOptions2] = useState([]);
  const [vAnimationIndex,setAnimationIndex] = useState(null);
  const [vDeleteItem, setDeleteItem] = useState([]);

  
  const [vShowScenarioAddOrEditDialog, setShowScenarioAddOrEditDialog] = useState(false);
  const [vEditItem, setEditItem] = useState(null);
  const [vSnackbarOpen, setSnackbarOpen] = useState(false);
  const [vSnackbarMessage, setSnackbarMessage] = useState('');
  const [vSnackbarType, setSnackbarType] = useState('');
  const [vIsConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [vChangeFlag, setChangeFlag] = useState(false);
  const [vShowScenarioReflectConfirmOpen, setShowScenarioReflectConfirmOpen] = useState(false);
  const [vShowWarningPopup, setShowWarningPopup] = useState(false);
  const [vWarningMessage, setarningMessage] = useState('');
  const [vShowChangeStatusToActiveDialog, setShowChangeStatusToActiveDialog] = useState(false);
  const [vShowChangeStatusToArchiveDialog, setShowChangeStatusToArchiveDialog] = useState(false);
  
  const [vChangeStatusItem, setChangeStatusItem] = useState({});
  const [vShowRemoveToArchiveDialog, setShowRemoveToArchiveDialog] = useState(false);

  
  
  useEffect(()=>{
    let state = getLocationState();
    // setOptions2(state?.vOptions2);
    setOpt1Theme(state?.vOpt1Theme);
    initAllScenario(params?.themeIndex)
  },[])

  const initAllScenario = (themeName) => {
    getAllScenariosByTheme({ theme: themeName }).then(res => {
      if (res.status === 200) {
        setOptions2(res.data)
      }
    }).catch(err => {
      console.log('Error occurred in API: getAllScenariosByTheme', err);
    })
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  }

  const goBack = () => {
    if (vChangeFlag) {
      setIsConfirmDialogOpen(true);
    } else {
      history.push(`/admin/create/edit`);
    }
  };

  const scenarioAdd = () => {
    setEditItem(null);
    setShowScenarioAddOrEditDialog(true);
  };

  const btnAction = (type, data) => {
    let options2 = [];
    setShowScenarioAddOrEditDialog(false);
    setChangeFlag(true);
    if (type === 'add') {
      // initial = 1 when scenario.length === 0 
      if(vOptions2 && vOptions2.length === 0){
        data["initial"] = 1;
      }else{
        data["initial"] = 0;
      }
      options2 = [...vOptions2, data];
    } else if (type === 'update') {
      options2 = vOptions2;
      for (let index = 0; index < options2.length; index++) {
        if (options2[index].scenarioCode === data.scenarioCode) {
          options2[index] = data;
        }
      }
    } else if (type === 'updateAdded') {
      options2 = vOptions2;
      for (let index = 0; index < options2.length; index++) {
        if (options2[index].tempId && options2[index].tempId === data.tempId) {
          options2[index] = data;
        }
      }
    }
    console.log(options2);
    setOptions2(options2)
  }

  const scenarioEdit = (item) => {
    setEditItem(item);
    setShowScenarioAddOrEditDialog(true);
  }

  
  const changeOrder = async (originalOrder,newOrder)=>{
    let options2 = vOptions2;
    options2[originalOrder] = options2.splice(newOrder, 1, options2[originalOrder])[0];
    setOptions2([...options2]);
    setChangeFlag(true);
  }

  const lessonsScenarioOrderFnUp = (index)=>{
    if(index === 0){
      return false;
    }else{
      changeOrder(index,index-1);
    }
  }

  const lessonsScenarioOrderFnDown = async (index)=>{
    if(index === vOptions2.length-1){
      return false;
    }else{
      changeOrder(index,index+1);
    }
  }

  const handleScenarioRemove = () => {
    let chooseItem = vChangeStatusItem;
    let activeCount = vOptions2.filter(item => item.status === 'ACTIVE').length;
    if(activeCount === 1 && chooseItem.status === 'ACTIVE'){
      setShowWarningPopup(true);
      setarningMessage('削除できません。学習テーマ内に公開中のシナリオが１件以上必要です。');
    }else{
      if (chooseItem.modifyType && chooseItem.modifyType === 'ADD') {
        let options2 = vOptions2;
        setOptions2([...options2.filter(item => !item.tempId || item.tempId !== chooseItem.tempId)]);
      } else {
        chooseItem.modifyType = 'DELETE';
        chooseItem.status = 'INACTIVE';
        setDeleteItem([...vDeleteItem, chooseItem]);
        let options2 = vOptions2;
        setOptions2([...options2.filter(item => item.scenarioCode !== chooseItem.scenarioCode)]);
      }
      setChangeFlag(true);
    }
    setShowRemoveToArchiveDialog(false);
  }

  const reflecAction = () => {
    let scenarioNames = vOptions2.map(item => item.scenarioName);
    let set_scenarioNames = Array.from(new Set(scenarioNames));
    if(scenarioNames.length !== set_scenarioNames.length){
      setShowWarningPopup(true);
      setarningMessage('同名のシナリオを登録することはできません。');
    }else{
      setShowScenarioReflectConfirmOpen(true);
    }
  }

  const confirmScenarioReflectProcess = () => {
    setShowScenarioReflectConfirmOpen(false);
    let data = vOptions2.map(item => {
      if (!item.modifyType) item.modifyType = 'UPDATE';
      return item;
    })
    data.push(...vDeleteItem);
    let delKeyScenario = '';
    for (let index = 0; index < vDeleteItem.length; index++) {
      delKeyScenario += vDeleteItem[index].scenarioCode
    }
    addLocationState({
      "delKeyScenario":delKeyScenario
    }, `admin/create/edit`)
    console.log(123123, 'scenarioReflection', data);
    updateScenariosByTheme(data).then(res => {
      if (res.status === 200) {
        initAllScenario(params?.themeIndex);
        if (res.data.status === '200') {
          setShowWarningPopup(true);
          setarningMessage('更新しました。');
        } else {
          setSnackbarType('ERROR')
          setSnackbarMessage('更新に失敗しました');
          setSnackbarOpen(true);
        }
        setChangeFlag(false);
        setDeleteItem([]);
      }
    }).catch(err => {
      console.log('Error occurred in API: updateScenariosByTheme', err);
      initAllScenario(params?.themeIndex);
      setSnackbarType('ERROR')
      setSnackbarMessage('更新に失敗しました');
      setSnackbarOpen(true);
      setChangeFlag(false);
      setDeleteItem([]);
    })
  }

  const getMapKey = (item) => {
    return item.scenarioCode ? item.scenarioCode : item.tempId;
  }

  const getSnackbarType = () => {
    switch (vSnackbarType) {
      case 'SUCCESS':
        return 'rgb(76, 175, 80)';
      case 'WARNING':
        return 'rgb(255, 152, 0)';
      case 'ERROR':
        return 'rgb(244, 67, 54)';
      case '':
        return 'rgb(76, 175, 80)';
      default:
        return 'rgb(76, 175, 80)';
    }
  }

  const openChangeStatusDialog = async (item, changeStatus) => {
    if(item.status !== changeStatus){
      console.log('openChangeStatusDialog');
      let changeFlg = false;

      if(changeStatus === 'ARCHIVED'){
        let activeCount = vOptions2.filter(item => item.status === 'ACTIVE').length;
        if(activeCount === 1){
          setShowWarningPopup(true);
          setarningMessage('非公開にできません。学習テーマ内に公開中のシナリオが１件以上必要です。');
        }else{
          changeFlg = true;
        }
      } else if(changeStatus === 'ACTIVE'){
        let res = await getScenarioChangeToActive(item.themeCode,item.scenarioCode);
        if (res.status === 200) {
          if(res.data){
            changeFlg = true;
          }else{
            setShowWarningPopup(true);
            setarningMessage('公開することはできません。シナリオ内のストーリー、セクションはそれぞれ１件以上必要です。');
          }
        }
      }

      if(changeFlg){
        let changeItem = Object.assign({}, item, {changeStatus});
        setChangeStatusItem(changeItem);
        if(changeStatus === 'ACTIVE'){
          setShowChangeStatusToActiveDialog(true);
        }else if(changeStatus === 'ARCHIVED'){
          setShowChangeStatusToArchiveDialog(true);
        }
      }
    }
  }

  const changeRadioStatus = ()=>{
    console.log('changeRadioStatus',vChangeStatusItem);
    let options2 = Object.assign([],vOptions2);
    for (let index = 0; index < options2.length; index++) {
      let checkId = '';
      if(options2[index]?.modifyType && options2[index]?.modifyType === 'ADD'){
        checkId = options2[index].tempId;
      }else{
        checkId = options2[index].scenarioCode;
      }
      if(checkId === vChangeStatusItem.scenarioCode || checkId === vChangeStatusItem.tempId ){
        if(options2[index].status != vChangeStatusItem.changeStatus){
          setChangeFlag(true);
        }
        options2[index].status = vChangeStatusItem.changeStatus;
      }
    }
    setOptions2(options2);

    if(vChangeStatusItem.changeStatus === 'ACTIVE'){
      setShowChangeStatusToActiveDialog(false);
    }else if(vChangeStatusItem.changeStatus === 'ARCHIVED'){
      setShowChangeStatusToArchiveDialog(false);
    }
  }
  
  return (
    <>
      <div className="cmn-bg-box p-3">
        <div className="d-flex justify-content-between mb-4">
          <div className="align-items-center d-flex">
              <BackButton
                title={t("scenario.return")}
                className="mr-3"
                onClick={goBack}
              />
            <h5 className="mb-0 mr-2" style={{color: "grey"}}>
              {vOpt1Theme?.themeName}&nbsp;{'>'} 
            </h5>
            <h4 className="mb-0">
              シナリオ
            </h4>
          </div>
          <div>
            <button
              className={`${classes.scenario_reflect_btn}`}
              onClick={reflecAction}
              style={{ marginRight: 10 }}
            >
              反映
            </button> 
            <button
              className={`${classes.scenario_add_btn}`}
              onClick={scenarioAdd}
            >
              シナリオ追加
            </button> 
          </div>
        </div>
        {/* {JSON.stringify(vOptions2)} */}
        {vOptions2.map((item,index)=>{
          return <Row className={`m-0 font-18 mb-3 ${classes.scenario_list} ${vAnimationIndex === index?classes.card_animation:0}`} key={getMapKey(item)}>
                  <div className={classes.subtitle_name}>
                    {item.scenarioName}
                  </div>
                  <Col style={{textAlign: "right"}}>
                    <button
                      className="no-btn bg-transparent p-0 mr-2"
                      id={`process_card_move_pencil_click_${index}`}
                      name={`process_card_move_pencil_click_${index}`}
                    >
                      <img
                        src={talkScriptInputPencil}
                        alt="pencil"
                        className={`${classes.pencil_img}`}
                        onClick={() => scenarioEdit(item) }
                      />
                    </button>
                    <button
                      className="no-btn bg-transparent p-0"
                      id={`process_card_move_up_click_${index}`}
                      name={`process_card_move_up_click_${index}`}
                    >
                      <img
                        src={UpArrow}
                        alt="Up Arrow"
                        onClick={()=>{
                          lessonsScenarioOrderFnUp(index);
                        }}
                      />
                    </button>
                    <button
                      className="no-btn bg-transparent p-0 mx-3"
                      id={`process_card_move_down_click_${index}`}
                      name={`process_card_move_down_click_${index}`}
                    >
                      <img
                        src={DownArrow}
                        alt="Down Arrow"
                        onClick={()=>{
                          lessonsScenarioOrderFnDown(index);
                        }}
                      />
                    </button>
                    <button
                      className="no-btn bg-transparent p-0"
                      id={`process_card_move_remove_click_${index}`}
                      name={`process_card_move_remove_click_${index}`}
                      onClick={() => {
                        setChangeStatusItem(item);
                        setShowRemoveToArchiveDialog(true);
                      }}
                    >
                      <img
                        src={CloseButton}
                        alt="Remove Button"
                      />
                    </button>
                    
                  </Col>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    style={{marginTop:10}}
                  >
                    <FormControlLabel 
                      style={{padding:"10px"}}
                      checked={item.status === "ACTIVE"} 
                      value="ACTIVE" 
                      control={<Radio/>} 
                      label={<span style={{paddingLeft:"5px"}} >公開</span>} 
                      onClick={()=>openChangeStatusDialog(item,"ACTIVE")}
                    />
                    <FormControlLabel 
                      checked={item.status === "ARCHIVED"} 
                      value="ARCHIVED" 
                      control={<Radio/>} 
                      label={<span style={{paddingLeft:"5px"}} >非公開</span>} 
                      onClick={()=>openChangeStatusDialog(item,"ARCHIVED")}
                    />
                  </RadioGroup>
                </Row>
          })
        }
        {
          vShowScenarioAddOrEditDialog && 
          <ScenarioAddOrEditDialog
            title={`シナリオ${!vEditItem ? "追加" : "修正"}`}
            open={vShowScenarioAddOrEditDialog}
            setOpen={setShowScenarioAddOrEditDialog}
            item={vEditItem}
            btnAction={btnAction}
            theme={vOpt1Theme}
          />
        }
        {
          vIsConfirmDialogOpen &&
          <ConfirmDialog
            open={vIsConfirmDialogOpen}
            setOpen={setIsConfirmDialogOpen}
            confirmSaveProcess={() => { history.push(`/admin/create/edit`); }}
            title='編集内容が保存されていません。よろしいですか？'
          />
        }
        <ConfirmDialog
          title="変更を保存しますか？"
          open={vShowScenarioReflectConfirmOpen}
          setOpen={setShowScenarioReflectConfirmOpen}
          confirmSaveProcess={confirmScenarioReflectProcess}
        />
        <Snackbar anchorOrigin={{ 'vertical': 'top', 'horizontal': 'right' }} open={vSnackbarOpen} onClose={handleSnackbarClose} autoHideDuration={2000}>
          <span className={classes.snackbar} style={{ background: getSnackbarType() }}>{vSnackbarMessage}</span>
        </Snackbar>
        <WarningPopup open={vShowWarningPopup} setOpen={setShowWarningPopup} warningMessage={vWarningMessage} />
        <ConfirmDialog
          title="公開することで、このシナリオはロープレ実施可能となります。よろしいですか？"
          open={vShowChangeStatusToActiveDialog}
          setOpen={setShowChangeStatusToActiveDialog}
          confirmSaveProcess={changeRadioStatus}
        />
        <ConfirmDialog
          title="非公開にすることで、このシナリオはロープレ実施できなくなります。よろしいですか？"
          open={vShowChangeStatusToArchiveDialog}
          setOpen={setShowChangeStatusToArchiveDialog}
          confirmSaveProcess={changeRadioStatus}
        />
        <ConfirmDialog
          title="削除したシナリオを復元したり、履歴を参照することはできません。削除を中止する場合には「いいえ」を押下してください。"
          open={vShowRemoveToArchiveDialog}
          setOpen={setShowRemoveToArchiveDialog}
          confirmSaveProcess={handleScenarioRemove}
        />
      </div> 
    </>
  );
};

export default ScenarioEidtPage;
