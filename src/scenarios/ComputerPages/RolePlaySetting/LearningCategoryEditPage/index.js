import React, { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { useTranslation } from "react-i18next";
import DownArrow from "../../../../property/images/down_arrow_triangle.svg";
import UpArrow from "../../../../property/images/up_arrow_triangle.svg";
import talkScriptInputPencil from '../../../../property/icons/talk-script-input-pencil.svg';
import CloseButton from "../../../../property/images/close_icon.svg";
import classes from "./styles.module.css";
import { getLessonCategories, updateThemes } from "../../../../request/backendApi/api";
import LearningCategoryEditPageDialog from "./LearningCategoryEditPageDialog";
import { useHistory } from "react-router-dom";
import BackButton from "../../../../constituents/IButton/BackButton";
import ConfirmDialog from "../ConfirmDialog";
import Snackbar from '@material-ui/core/Snackbar';
import WarningPopup from "../WarningPopup";
import store from "../../../../storage";
import { UPDATE_SELECTED_SCENARIO_NAME, UPDATE_SELECTED_THEME_NAME } from "../../../../storage/consts";


const LearningCategoryEditPage = () => {
  const {t} = useTranslation();
  const history = useHistory();
  const [vOpt1Theme, setOpt1Theme] = useState(null);
  const [vOptions2, setOptions2] = useState([]);
  const [vAnimationIndex, setAnimationIndex] = useState(null);
  const [vDeleteItem, setDeleteItem] = useState([]);
  const [vShowLessonCategoryAddOrEditDialog, setShowLessonCategoryAddOrEditDialog] = useState(false);
  const [vEditItem, setEditItem] = useState(null);
  const [vSnackbarOpen, setSnackbarOpen] = useState(false);
  const [vSnackbarMessage, setSnackbarMessage] = useState('');
  const [vSnackbarType, setSnackbarType] = useState('');
  const [vIsConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [vChangeFlag, setChangeFlag] = useState(false);
  const [vShowScenarioReflectConfirmOpen, setShowScenarioReflectConfirmOpen] = useState(false);
  const [vShowWarningPopup, setShowWarningPopup] = useState(false);
  const [vWarningMessage, setWarningMessage] = useState('');
  const [vChangeStatusItem, setChangeStatusItem] = useState({});
  const [vShowRemoveToArchiveDialog, setShowRemoveToArchiveDialog] = useState(false);
  
  
  useEffect(() => {
    initAllCategory()
  }, [])
  
  const initAllCategory = (themeName) => {
    getLessonCategories("/lessons/category?type=adminPage&specialAS=" + store.getState().user_special_as).then((res) => {
      console.log('res', res)
      if (res.status === 200) {
        setOptions2(res.data)
      }
    }).catch(err => {
      console.log('Error occurred in API: getLessonCategories', err);
    })
  }
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  }
  
  const goBack = () => {
    if (vChangeFlag) {
      setIsConfirmDialogOpen(true);
    } else {
      history.push(`/admin/create/`);
    }
  };
  
  const scenarioAdd = () => {
    setEditItem(null);
    setShowLessonCategoryAddOrEditDialog(true);
  };
  
  const btnAction = (type, data) => {
    let options2 = [];
    setShowLessonCategoryAddOrEditDialog(false);
    setChangeFlag(true);
    if (type === 'add') {
      // initial = 1 when scenario.length === 0
      if (vOptions2 && vOptions2.length === 0) {
        data["initial"] = 1;
      } else {
        data["initial"] = 0;
      }
      options2 = [...vOptions2, data];
    } else if (type === 'update') {
      console.log('data', data)
      options2 = vOptions2;
      for (let index = 0; index < options2.length; index++) {
        if (options2[index].themeOrder === data.themeOrder) {
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
  
  const lessonCategoryEdit = (item) => {
    setEditItem(item);
    setShowLessonCategoryAddOrEditDialog(true);
  }
  
  const changeOrder = async (originalOrder, newOrder) => {
    let options2 = vOptions2;
    options2[originalOrder] = options2.splice(newOrder, 1, options2[originalOrder])[0];
    setOptions2([...options2]);
    setChangeFlag(true);
  }
  
  const orderUp = async (index) => {
    if (index === 0) {
      return false;
    } else {
      await changeOrder(index, index - 1);
    }
  }
  
  const orderDown = async (index) => {
    if (index === vOptions2.length - 1) {
      return false;
    } else {
      await changeOrder(index, index + 1);
    }
  }
  
  const handleLessonCategoryRemove = () => {
    let chooseItem = vChangeStatusItem;
    if (chooseItem.modifyType && chooseItem.modifyType === 'ADD') {
      let options2 = vOptions2;
      setOptions2([...options2.filter(item => !item.tempId || item.tempId !== chooseItem.tempId)]);
    } else {
      chooseItem.modifyType = 'DELETE';
      chooseItem.status = 'INACTIVE';
      setDeleteItem([...vDeleteItem, chooseItem]);
      let options2 = vOptions2;
      setOptions2([...options2.filter(item => item.themeName !== chooseItem.themeName)]);
    }
    setChangeFlag(true);
    setShowRemoveToArchiveDialog(false);
  }
  
  const reflectAction = () => {
    let themeNames = vOptions2.map(item => item.themeName);
    let set_themeNames = Array.from(new Set(themeNames));
    if (themeNames.length !== set_themeNames.length) {
      setShowWarningPopup(true);
      setWarningMessage('同名の学習テーマを登録することはできません。');
    } else {
      setShowScenarioReflectConfirmOpen(true);
    }
  }
  
  const confirmScenarioReflectProcess = () => {
    let data = vOptions2.map(item => {
      if (!item.modifyType) item.modifyType = 'UPDATE';
      return item;
    })
    data.push(...vDeleteItem);
    console.log('data ', data)
    updateThemes(data).then(res => {
      if (res.status === 200) {
        let loopBreak = false
        for (let index = 0; index < data.length; index++) {
          for (let index2 = 0; index2 < data[index].scenario?.length; index2++) {
            if (data[index]?.scenario[index2]?.status === 'ACTIVE') {
              loopBreak = true
              store.dispatch({type: UPDATE_SELECTED_THEME_NAME, selected_theme_name: res.data[0]?.themeCode})
              store.dispatch({
                type: UPDATE_SELECTED_SCENARIO_NAME,
                selected_scenario_name: res.data[0]?.scenario[0].scenarioCode
              })
              break;
            }
          }
          if (loopBreak) break
        }
        initAllCategory();
        if (res.data.status === '200') {
          setShowWarningPopup(true);
          setWarningMessage('更新しました。');
        } else {
          setSnackbarType('ERROR')
          setSnackbarMessage('更新に失敗しました');
          setSnackbarOpen(true);
        }
        setChangeFlag(false);
        setDeleteItem([]);
      }
      setShowScenarioReflectConfirmOpen(false)
    }).catch(err => {
      console.log('Error occurred in API: updateScenariosByTheme', err);
      initAllCategory();
      setSnackbarType('ERROR')
      setSnackbarMessage('更新に失敗しました');
      setSnackbarOpen(true);
      setChangeFlag(false);
      setShowScenarioReflectConfirmOpen(false)
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
              学習テーマ
            </h5>
          </div>
          <div>
            <button
              className={`${classes.scenario_reflect_btn}`}
              onClick={reflectAction}
              style={{marginRight: 10}}
            >
              反映
            </button>
            <button
              className={`${classes.scenario_add_btn}`}
              onClick={scenarioAdd}
            >
              学習テーマ追加
            </button>
          </div>
        </div>
        {vOptions2.map((item, index) => {
          return <Row
            className={`m-0 font-18 mb-3 ${classes.scenario_list} ${vAnimationIndex === index ? classes.card_animation : 0}`}
            key={getMapKey(item)}>
            <div className={classes.subtitle_name}>
              {item.themeName}
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
                  onClick={() => lessonCategoryEdit(item)}
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
                  onClick={async () => {
                    await orderUp(index);
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
                  onClick={async () => {
                    await orderDown(index);
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
          </Row>
        })
        }
        {
          vShowLessonCategoryAddOrEditDialog &&
          <LearningCategoryEditPageDialog
            title={`学習テーマ${!vEditItem ? "追加" : "修正"}`}
            open={vShowLessonCategoryAddOrEditDialog}
            setOpen={setShowLessonCategoryAddOrEditDialog}
            item={vEditItem}
            btnAction={btnAction}
            theme={vOpt1Theme}
            themes={vOptions2}
          />
        }
        {
          vIsConfirmDialogOpen &&
          <ConfirmDialog
            open={vIsConfirmDialogOpen}
            setOpen={setIsConfirmDialogOpen}
            confirmSaveProcess={() => {
              history.push(`/admin/create/edit`);
            }}
            title='編集内容が保存されていません。よろしいですか？'
          />
        }
        <ConfirmDialog
          title="変更を保存しますか？"
          open={vShowScenarioReflectConfirmOpen}
          setOpen={setShowScenarioReflectConfirmOpen}
          confirmSaveProcess={confirmScenarioReflectProcess}
        />
        <Snackbar anchorOrigin={{'vertical': 'top', 'horizontal': 'right'}} open={vSnackbarOpen}
                  onClose={handleSnackbarClose} autoHideDuration={2000}>
          <span className={classes.snackbar} style={{background: getSnackbarType()}}>{vSnackbarMessage}</span>
        </Snackbar>
        <WarningPopup open={vShowWarningPopup} setOpen={setShowWarningPopup} warningMessage={vWarningMessage}/>
        <ConfirmDialog
          title="削除した学習テーマを復元したり、履歴を参照することはできません。削除を中止する場合には「いいえ」を押下してください。"
          open={vShowRemoveToArchiveDialog}
          setOpen={setShowRemoveToArchiveDialog}
          confirmSaveProcess={handleLessonCategoryRemove}
        />
      </div>
    </>
  );
};

export default LearningCategoryEditPage;
