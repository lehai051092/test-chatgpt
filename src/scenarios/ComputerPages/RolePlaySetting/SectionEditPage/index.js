import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import DownArrow from "../../../../property/images/down_arrow_triangle.svg";
import UpArrow from "../../../../property/images/up_arrow_triangle.svg";
import talkScriptInputPencil from '../../../../property/icons/talk-script-input-pencil.svg';
import CloseButton from "../../../../property/images/close_icon.svg";
import classes from "./styles.module.css";
import { updateTasksByPersonaId, getAllSectionByPersonaId,getlessonsInfo } from "../../../../request/backendApi/api";

import { useHistory, useParams } from "react-router-dom";
import BackButton from "../../../../constituents/IButton/BackButton";
import { addLocationState, getLocationState, setLocationState } from '../../../../utils/util';
import ConfirmDialog from "../ConfirmDialog";
import ScenarioAddOrEditDialog from './SectionEditPageDialog';
import Snackbar from '@material-ui/core/Snackbar';
import WarningPopup from "../WarningPopup";

const SectionEditPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const [vAllSection, setAllSection] = useState([]);

  const [vAnimationIndex, setAnimationIndex] = useState(null);

  const [vShowSectionEditPageDialog, setShowSectionEditPageDialog] = useState(false);
  const [vEditItem, setEditItem] = useState(null);
  const [vDeleteItem, setDeleteItem] = useState([]);
  const [vSnackbarOpen, setSnackbarOpen] = useState(false);
  const [vSnackbarMessage, setSnackbarMessage] = useState('');
  const [vSnackbarType, setSnackbarType] = useState('');
  const [vIsConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [vChangeFlag, setChangeFlag] = useState(false);
  const [vShowSectionReflectConfirmOpen, setShowSectionReflectConfirmOpen] = useState(false);
  const [vShowWarningPopup, setShowWarningPopup] = useState(false);
  const [vWarningMessage, setarningMessage] = useState('');

    
  const [vChangeStatusItem, setChangeStatusItem] = useState({});
  const [vShowRemoveToArchiveDialog, setShowRemoveToArchiveDialog] = useState(false);

  useEffect(() => {
    initAllSection(params?.personaId);
  }, [])

  const initAllSection = (id) => {
    getAllSectionByPersonaId(id).then(res => {
      if (res.status === 200) {
        setAllSection(res.data);
      }
    }).catch(err => {
      console.log('Error occurred in API: getAllSectionByPersonaId', err);
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

  const sectionAdd = () => {
    setEditItem(null);
    setShowSectionEditPageDialog(true);
  };

  const btnAction = (type, data) => {
    setShowSectionEditPageDialog(false);
    setChangeFlag(true);
    let section = [];
    if (type === 'add') {
      section = [...vAllSection, data];
    } else if (type === 'update') {
      section = vAllSection;
      for (let index = 0; index < section.length; index++) {
        if (section[index].id === data.id) {
          section[index] = data;
        }
      }
    } else if (type === 'updateAdded') {
      section = vAllSection;
      for (let index = 0; index < section.length; index++) {
        if (section[index].tempId && section[index].tempId === data.tempId) {
          section[index] = data;
        }
      }
    }
    setAllSection(section);
  }

  const sectionEdit = (item) => {
    setEditItem(item);
    setShowSectionEditPageDialog(true);
  }

  const changeOrder = async (originalOrder, newOrder) => {
    let section = vAllSection;
    section[originalOrder] = section.splice(newOrder, 1, section[originalOrder])[0];
    setAllSection([...section]);
    setChangeFlag(true);
  }

  const sectionOrderFnUp = (index) => {
    if (index === 0) {
      return false;
    } else {
      changeOrder(index, index - 1);
    }
  }

  const sectionOrderFnDown = async (index) => {
    if (index === vAllSection.length - 1) {
      return false;
    } else {
      changeOrder(index, index + 1);
    }
  }

  const handleSectionRemove = () => {
    let chooseItem = vChangeStatusItem;
    let activeCount = vAllSection.filter(item => item.status === 'ACTIVE').length;
    if(activeCount === 1 && chooseItem.status === 'ACTIVE' && chooseItem.scenarioStatus === 'ACTIVE'){
      setShowWarningPopup(true);
      setarningMessage('公開中のシナリオ内のセクションを０件にすることはできません。');
    }else{
      if (chooseItem.modifyType && chooseItem.modifyType === 'ADD') {
        let section = vAllSection;
        setAllSection([...section.filter(item => !item.tempId || item.tempId !== chooseItem.tempId)]);
      } else {
        chooseItem.modifyType = 'DELETE';
        chooseItem.status = 'INACTIVE';
        setDeleteItem([...vDeleteItem, chooseItem]);
        let section = vAllSection;
        setAllSection([...section.filter(item => item.id !== chooseItem.id)]);
      }
      setChangeFlag(true);
    }   
    setShowRemoveToArchiveDialog(false);
  }

  const getPersonaInfoFromLocalState = () => {
    return getLocationState().selectedOption.personaInfo;
  }

  const reflecAction = async () => {
    let sections = vAllSection.map(item => item.name);
    let set_sections = Array.from(new Set(sections));
    if(sections.length !== set_sections.length){
      setShowWarningPopup(true);
      setarningMessage('同名のセクションを登録することはできません。');
      return;
    }
    let res = await getlessonsInfo(params.personaId);
    if(res.status != 200){
      return;
    }
    if(res?.data?.personaType === "freeStory" && vAllSection.length>1){
      setShowSectionReflectConfirmOpen(false);
      setShowWarningPopup(true);
      setarningMessage('ストーリータイプがフリーストーリーの場合、セクションは１つしか設定できません。');
      return;
    }
    setShowSectionReflectConfirmOpen(true);
  }

  const confirmSectionReflectProcess = async () => {
    console.log(vAllSection,params);
    setShowSectionReflectConfirmOpen(false);
    let data = vAllSection.map(item => {
      if (!item.modifyType) item.modifyType = 'UPDATE';
      return item;
    })
    data.push(...vDeleteItem);
    console.log(123123, 'sectionReflection', data);
    updateTasksByPersonaId(params?.personaId, data).then(res => {
      if (res.status === 200) {
        initAllSection(params?.personaId);
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
      console.log('Error occurred in API: updateTasksByPersonaId', err);
      initAllSection(params?.personaId);
      setSnackbarType('ERROR')
      setSnackbarMessage('更新に失敗しました');
      setSnackbarOpen(true);
      setChangeFlag(false);
      setDeleteItem([]);
    })
  }

  const getMapKey = (item) => {
    return item.id ? item.id : item.tempId;
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
              {getPersonaInfoFromLocalState()}&nbsp;{'>'}
            </h5>
            <h4 className="mb-0">
              セクション
            </h4>
          </div>
          <div>
            <button
              className={`${classes.section_reflect_btn}`}
              onClick={reflecAction}
              style={{ marginRight: 10 }}
            >
              反映
            </button>
            <button
              className={`${classes.section_add_btn}`}
              onClick={sectionAdd}
            >
              セクション追加
            </button>
          </div>
        </div>
        {vAllSection.map((item, index) => {
          return <Row className={`m-0 font-18 mb-3 ${classes.section_list} ${vAnimationIndex === index ? classes.card_animation : 0}`} key={getMapKey(item)}>
            <Col className={classes.subtitle_name}>
              {item.name}
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
                  onClick={() => sectionEdit(item)}
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
                    sectionOrderFnUp(index);
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
                    sectionOrderFnDown(index);
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
          vShowSectionEditPageDialog &&
          <ScenarioAddOrEditDialog
            title={`セクション${!vEditItem ? "追加" : "修正"}`}
            open={vShowSectionEditPageDialog}
            setOpen={setShowSectionEditPageDialog}
            item={vEditItem}
            btnAction={btnAction}
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
          open={vShowSectionReflectConfirmOpen}
          setOpen={setShowSectionReflectConfirmOpen}
          confirmSaveProcess={confirmSectionReflectProcess}
        />
        <ConfirmDialog
          title="削除したセクションを復元したり、履歴を参照することはできません。削除を中止する場合には「いいえ」を押下してください。"
          open={vShowRemoveToArchiveDialog}
          setOpen={setShowRemoveToArchiveDialog}
          confirmSaveProcess={handleSectionRemove}
        />

        <Snackbar anchorOrigin={{ 'vertical': 'top', 'horizontal': 'right' }} open={vSnackbarOpen} onClose={handleSnackbarClose} autoHideDuration={2000}>
          <span className={classes.snackbar} style={{ background: getSnackbarType() }}>{vSnackbarMessage}</span>
        </Snackbar>
        <WarningPopup open={vShowWarningPopup} setOpen={setShowWarningPopup} warningMessage={vWarningMessage} />
      </div>
    </>
  );
};

export default SectionEditPage;
