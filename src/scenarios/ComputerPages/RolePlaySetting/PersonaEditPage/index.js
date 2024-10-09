import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import DownArrow from "../../../../property/images/down_arrow_triangle.svg";
import UpArrow from "../../../../property/images/up_arrow_triangle.svg";
import talkScriptInputPencil from '../../../../property/icons/talk-script-input-pencil.svg';
import CloseButton from "../../../../property/images/close_icon.svg";
import classes from "./styles.module.css";
import { getAllPersonasByThemeAndScenario, getLessonInfo, getlessonsElearning, updateAllPersonasForScenario } from "../../../../request/backendApi/api";

import PersonaEditPageDialog from "./PersonaEditPageDialog";
import { useHistory, useParams } from "react-router-dom";
import BackButton from "../../../../constituents/IButton/BackButton";
import { addLocationState, getLocationState, setLocationState } from '../../../../utils/util';
import ConfirmDialog from "../ConfirmDialog";
import Snackbar from '@material-ui/core/Snackbar';
import WarningPopup from "../WarningPopup";


const PersonaEditPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const [vPersonas, setPersonas] = useState([]);

  const [vAnimationIndex, setAnimationIndex] = useState(null);

  const [vShowPersonaEditPageDialog, setShowPersonaEditPageDialog] = useState(false);
  const [vEditItem, setEditItem] = useState(null);
  const [vDeleteItem, setDeleteItem] = useState([]);
  const [vSnackbarOpen, setSnackbarOpen] = useState(false);
  const [vSnackbarMessage, setSnackbarMessage] = useState('');
  const [vSnackbarType, setSnackbarType] = useState('');
  const [vIsConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [vChangeFlag, setChangeFlag] = useState(false);
  const [vShowPersonaReflectConfirmOpen, setShowPersonaReflectConfirmOpen] = useState(false);
  const [vShowWarningPopup, setShowWarningPopup] = useState(false);
  const [vWarningMessage, setarningMessage] = useState('');

  // elearning light
  const [vElearningLight, setElearningLight] = useState(null);
  
  const [vChangeStatusItem, setChangeStatusItem] = useState({});
  const [vShowRemoveToArchiveDialog, setShowRemoveToArchiveDialog] = useState(false);

  

  const getElearningLight = async ()=>{
    let res = await getlessonsElearning();
    if(res.status === 200 && Object.keys(res.data).length != 0){
      let data = {};
      for (const key in res.data) {
        data[`${res.data[key][2]}`] = key;
      }
      console.log(data);
      setElearningLight(data);
    }
  }

  useEffect(() => {
    initAllPersona(params?.themeCode, params?.scenarioCode)
    getElearningLight();
  }, [])

  const initAllPersona = (theme, scenario) => {
    getAllPersonasByThemeAndScenario({ theme, scenario }).then(res => {
      if (res.status === 200) {
        setPersonas(res.data);
      }
    }).catch(err => {
      console.log('Error occurred in API: getAllPersonasByThemeAndScenario', err);
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

  const personaAdd = () => {
    setEditItem(null);
    setShowPersonaEditPageDialog(true);
  };

  const btnAction = (type, data) => {
    setShowPersonaEditPageDialog(false);
    setChangeFlag(true);
    let persona = [];
    if (type === 'add') {
      persona = [...vPersonas, data];
    } else if (type === 'update') {
      persona = vPersonas;
      for (let index = 0; index < persona.length; index++) {
        if (persona[index].personaId === data.personaId) {
          persona[index] = data;
        }
      }
    } else if (type === 'updateAdded') {
      persona = vPersonas;
      for (let index = 0; index < persona.length; index++) {
        if (persona[index].tempId && persona[index].tempId === data.tempId) {
          persona[index] = data;
        }
      }
    }
    setPersonas(persona);
  }

  const personaEdit = (item) => {
    setEditItem(item);
    setShowPersonaEditPageDialog(true);
  }

  const changeOrder = async (originalOrder, newOrder) => {
    let persona = vPersonas;
    persona[originalOrder] = persona.splice(newOrder, 1, persona[originalOrder])[0];
    setPersonas([...persona]);
    setChangeFlag(true);
  }

  const personaOrderFnUp = (index) => {
    if (index === 0) {
      return false;
    } else {
      changeOrder(index, index - 1);
    }
  }

  const personaOrderFnDown = async (index) => {
    if (index === vPersonas.length - 1) {
      return false;
    } else {
      changeOrder(index, index + 1);
    }
  }

  const handlePersonaRemove = () => {
    let chooseItem = vChangeStatusItem;
    let activeCount = vPersonas.filter(item => item.status === 'ACTIVE').length;
    if(activeCount === 1 && chooseItem.status === 'ACTIVE'){
      setShowWarningPopup(true);
      setarningMessage('公開中のシナリオ内のストーリーを０件にすることはできません。');
    }else{
      if (chooseItem?.modifyType === 'ADD') {
        let persona = vPersonas;
        setPersonas([...persona.filter(item => !item.tempId || item.tempId !== chooseItem.tempId)]);
      } else {
        chooseItem.modifyType = 'DELETE';
        chooseItem.status = 'INACTIVE';
        setDeleteItem([...vDeleteItem, chooseItem]);
        let persona = vPersonas;
        setPersonas([...persona.filter(item => item.personaId !== chooseItem.personaId)]);
      }
      let elearningLight = vElearningLight;
      let vId = chooseItem?.modifyType === 'ADD'?chooseItem.tempId:chooseItem.personaId;
      delete(elearningLight[vId]);
      setElearningLight(elearningLight);
      setChangeFlag(true);
    }
    setShowRemoveToArchiveDialog(false);
  }

  const getScenarioNameFromLocalState = () => {
    return getLocationState().vOpt2ScenarioName;
  }

  const reflecAction = () => {
    let personas = vPersonas.map(item => item.persona);
    let set_personas = Array.from(new Set(personas));
    if(personas.length !== set_personas.length){
      setShowWarningPopup(true);
      setarningMessage('同名のストーリーを登録することはできません。');
    }else{
      setShowPersonaReflectConfirmOpen(true);
    }
  }

  const confirmPersonaReflectProcess = () => {
    setShowPersonaReflectConfirmOpen(false);
    let data = vPersonas.map(item => {
      if (!item.modifyType) item.modifyType = 'UPDATE';
      return item;
    })
    data.push(...vDeleteItem);
    let delKeyPersona = '';
    for (let index = 0; index < vDeleteItem.length; index++) {
      delKeyPersona += vDeleteItem[index].personaId
    }
    addLocationState({
      "delKeyPersona":delKeyPersona
    }, `admin/create/edit`)
    let param = {
      'theme': params?.themeCode,
      'scenario': params?.scenarioCode
    };
    updateAllPersonasForScenario(param, data).then(res => {
      if (res.status === 200) {
        initAllPersona(params?.themeCode, params?.scenarioCode);
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
      console.log('Error occurred in API: updateAllPersonasForScenario', err);
      initAllPersona(params?.themeCode, params?.scenarioCode);
      setSnackbarType('ERROR')
      setSnackbarMessage('更新に失敗しました');
      setSnackbarOpen(true);
      setChangeFlag(false);
      setDeleteItem([]);
    })
  }

  const getMapKey = (item) => {
    return item.personaId ? item.personaId : item.tempId;
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
            <h5 className="mb-0 mr-2" style={{ color: "grey" }}>
              {vPersonas[0]?.scenarioName ?? getScenarioNameFromLocalState()}&nbsp;{'>'}
            </h5>
            <h4 className="mb-0">
              ストーリー
            </h4>
          </div>
          <div>
            <button
              className={`${classes.persona_reflect_btn}`}
              onClick={reflecAction}
              style={{ marginRight: 10 }}
            >
              反映
            </button>
            <button
              className={`${classes.persona_add_btn}`}
              onClick={personaAdd}
            >
              ストーリー追加
            </button>
          </div>
        </div>
        {vPersonas.map((item, index) => {
          return <Row className={`m-0 font-18 mb-3 ${classes.persona_list} ${vAnimationIndex === index ? classes.card_animation : 0}`} key={getMapKey(item)}>
            <Col className={classes.subtitle_name}>
              {item.persona}
            </Col>
            <Col style={{ textAlign: "right" }}>
              <button
                className="no-btn bg-transparent p-0 mr-2"
                id={`process_card_move_pencil_click_${index}`}
                name={`process_card_move_pencil_click_${index}`}
              >
                <img
                  src={talkScriptInputPencil}
                  alt="pencil"
                  className={`${classes.pencil_img}`}
                  onClick={() =>{
                    if(item.type === 'fastText'){
                      setShowWarningPopup(true);
                      setarningMessage('機械学習型フリーストーリーの編集はできません。');
                      return false;
                    }
                    personaEdit(item);
                  }}
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
                  onClick={() => {
                    personaOrderFnUp(index);
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
                  onClick={() => {
                    personaOrderFnDown(index);
                  }}
                />
              </button>
              <button
                className="no-btn bg-transparent p-0"
                id={`process_card_move_remove_click_${index}`}
                name={`process_card_move_remove_click_${index}`}
                onClick={() => { 
                  if(item.type === 'fastText'){
                    setShowWarningPopup(true);
                    setarningMessage('機械学習型フリーストーリーの削除はできません。');
                    return false;
                  }
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
          </Row>
        })
        }
        {
          vShowPersonaEditPageDialog &&
          <PersonaEditPageDialog
            title={`ストーリー${!vEditItem ? "追加" : "修正"}`}
            open={vShowPersonaEditPageDialog}
            setOpen={setShowPersonaEditPageDialog}
            vElearningLight={vElearningLight}
            setElearningLight={setElearningLight}
            item={vEditItem}
            btnAction={btnAction}
            themeCode={params?.themeCode}
            scenarioCode={params?.scenarioCode}
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
          open={vShowPersonaReflectConfirmOpen}
          setOpen={setShowPersonaReflectConfirmOpen}
          confirmSaveProcess={confirmPersonaReflectProcess}
        />
        <ConfirmDialog
          title="削除したストーリーを復元したり、履歴を参照することはできません。削除を中止する場合には「いいえ」を押下してください。"
          open={vShowRemoveToArchiveDialog}
          setOpen={setShowRemoveToArchiveDialog}
          confirmSaveProcess={handlePersonaRemove}
        />
        <Snackbar anchorOrigin={{ 'vertical': 'top', 'horizontal': 'right' }} open={vSnackbarOpen} onClose={handleSnackbarClose} autoHideDuration={2000}>
          <span className={classes.snackbar} style={{ background: getSnackbarType() }}>{vSnackbarMessage}</span>
        </Snackbar>
        <WarningPopup open={vShowWarningPopup} setOpen={setShowWarningPopup} warningMessage={vWarningMessage} />
      </div>
    </>
  );
};

export default PersonaEditPage;
