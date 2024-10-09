import React, { createRef, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col } from "reactstrap";

import Radio from "../../../constituents/IRadioButtons/RadioButtonType03";

import DownArrow from "../../../property/images/down_arrow_triangle.svg";
import UpArrow from "../../../property/images/up_arrow_triangle.svg";
import CloseButton from "../../../property/images/close_icon.svg";
import PdfIcon from "../../../property/images/icons/pdf_icon.png";
import XlsIcon from "../../../property/images/icons/xls_icon.png";
import SelectedCheckBox from "../../../property/images/check_box_selected.svg";
import OutlineCheckBox from "../../../property/images/check_box_outline_blank.svg";

import BackgroundGrayLabel from "../../../constituents/ILabel/BackgroundGrayLabel";
import GeneralTextbox from "../../../constituents/ITextboxes/GeneralTextbox02";
import GeneralTextarea from "../../../constituents/ITextarea/GeneralTextarea";
import { GeneralDropdown } from "../../../constituents/IDropdowns/GeneralDropdown";
import DeleteKeywordButton from "../../../constituents/IButton/DeleteKeywordButtonLarge";

import classes from "./styles.module.css";
import {
  BrowserRouter as Router,
  useLocation,
  useParams,
  useHistory,
} from "react-router-dom";
import {
  getMaintainSection,
  getProcessToken,
  getPersonActions,
  saveAndUpdateMatainSection,
  saveAndUpdateMatainSectionNew,
  getBase64Name
} from "../../../request/backendApi/api";
import eventShuttle from "../../../eventShuttle";
import polygon from "../../../property/images/icons/polygon.png";
import BackButton from "../../../constituents/IButton/BackButton";
import UploadDiag from "./UploadDiag";
import KeywordTag from "./KeywordTag";
import ConfirmDialog from "./ConfirmDialog";
import { getLocationState, setLocationState } from '../../../utils/util';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import AutoAnswerEditDialog from "./AutoAnswerEditDialog";
import IconButton from "../../../constituents/IButton/IconButton";

const VideoChatPage = () => {
  const { t } = useTranslation();
  let { sectionId } = useParams();
  const history = useHistory();
  const [vProcessList, setProcessList] = useState([]);
  const [vProcessListLoading, setProcessListLoading] = useState(true);
  const [vProcessToken, setProcessToken] = useState();
  const [vScriptLines, setScriptLines] = useState([]);
  const [vSelectedValue, setSelectedValue] = useState();
  const [vPersonaActions, setPersonaActions] = useState([]);
  const [vSelectProcessScriptIndex, setSelectProcessScriptIndex] = useState();
  const [vProcessSort, setProcessSort] = useState([]);
  const [vShowAutoAnswerEditDialog, setShowAutoAnswerEditDialog] = useState(false);
  const [vShowUploadDiag, setShowUploadDiag] = useState(false);
  const [vShowConfirmOpen, setShowConfirmOpen] = useState(false);
  const [vSelectProcessIndex, setSelectProcessIndex] = useState(false);
  const [selected, setSelected] = useState();
  const [vHandleCardMove, setHandleCardMove] = useState(1);
  const [vIsEdit, setIsEdit] = useState(true);
  const state = getLocationState();
  const [vPersonaType, setVPersonaType] = useState(state ? state.personaType:'');
  const [vAutoAnswerSettings, setAutoAnswerSettings] = useState(null);

  let lastId = 0;
  const autoId = (prefix = "evaluation-detail-") => {
    lastId++;
    return `${prefix}${lastId}`;
  };

  const dealChange = (event) => {
    setSelectedValue(event.target.value);
    if (vProcessList[event.target.value]) {
      //get script lines obj in process list
      setSelectProcessScriptIndex(event.target.value);
      setScriptLines(vProcessList[event.target.value].scriptLineList);
    }
  };

  const GetProcessToken = async () => {
    const response = await getProcessToken();
    setProcessToken(response.data);
  };

  const MaintainSections = async () => {
    const response = await getMaintainSection(sectionId);
    const list = response.data.processList.map((item) => {
      let newItem = {...item};
      if (item.autoSetting) {
        newItem["isPersonasReturnQuestions"] = item.autoSetting.on;
        newItem["gptAutoAnswerId"] = item.autoSetting.id;
        newItem["keywordRate"] = item.autoSetting.keywordRate;
        newItem["scriptResponse"] = item.autoSetting.response;
        newItem["scriptPersonaAction"] = item.autoSetting.personaAction;
      } else {
        newItem["isPersonasReturnQuestions"] = false;
      }
      if (item.scriptLineList) {
        newItem["scriptLineList"] = item.scriptLineList.map((item1) => {
          let newItem1 = {...item1};
          if (item1.autoSetting) {
            if (vPersonaType === 'ChatGPT') {
              newItem1["isPersonasReturnQuestions"] = item1.autoSetting.on;
              newItem1["gptAutoAnswerId"] = item1.autoSetting.id;
              newItem1["scriptLineKeywordRate"] = item1.autoSetting.keywordRate;
              newItem1["scriptLineResponse"] = item1.autoSetting.response;
              newItem1["scriptLinePersonaAction"] = item1.autoSetting.personaAction;
            }
          } else {
            if (vPersonaType === 'ChatGPT') {
              newItem1["isPersonasReturnQuestions"] = false;
              newItem1["gptAutoAnswerId"] = null;
              newItem1["scriptLineKeywordRate"] = "";
              newItem1["scriptLineResponse"] = "";
              newItem1["scriptLinePersonaAction"] = "";
            }
          }
          return newItem1;
        });
      }
      return newItem;
    });
    setProcessList(list);
    if (vPersonaType === 'ChatGPT') {
      setAutoAnswerSettings(response.data.autoSetting);
    } else {
      setAutoAnswerSettings(null);
    }
    setProcessListLoading(false);
  };

  // Ozma
  const MaintainPersonAction = async () => {
    const response = await getPersonActions();
    setPersonaActions(response.data);
  };

  useEffect(() => {
    MaintainSections();
    GetProcessToken();
    MaintainPersonAction();
  }, [sectionId]);

  const ondealScenerio = (value, index) => {
    let items = [...vProcessList];
    let item = { ...items[vSelectProcessScriptIndex] };
    item.scriptLineList[index].scriptLinePersonaAction = value;
    items[vSelectProcessScriptIndex] = item;
    setProcessList(items);
  };

  const ondealScriptScenerio = (value, index) => {
    let items = [...vProcessList];
    let item = { ...items[index] };
    item.scriptPersonaAction = value;
    items[index] = item;
    setProcessList(items);
  };

  const FdelMaterial = async (index, index2) => {
    //del image from visual
    let process = [...vProcessList];
    process[index].processReference.splice(index2, 1);
    setProcessList(process);
  };

  const goBack = () => {
    const state = getLocationState();
    if(state.tab)
    {
      history.push(`/admin/create/${state.tab}`);
    }else{
      // history.replace(`/admin/create/tab1`);
      history.push({ pathname: `/admin/create/edit`});
      setLocationState({seletedOption: state.seletedOption}, `admin/create/tab1`);
    }
  };

  const addNewProcess = (e) => {
    //add new process card
    e.preventDefault();
    const initState = {
      processName: "",
      processPoint: "",
      processTool: "",
      processReference: [],
      scriptLineList: [],
      isPersonasReturnQuestions: false,
    };
    setProcessList((prev) => [...prev, initState]);
  };
  const removeProcessCard = (index) => {
    //remove process card
    if (index == vSelectProcessScriptIndex) {
      setSelectProcessScriptIndex(undefined);
      setSelectedValue(undefined);
    }
    let process = [...vProcessList];
    process.splice(index, 1);
    setProcessList(process);
  };

  const addNewScriptLine = (e) => {
    //add new script card
    e.preventDefault();
    const initState = {
      scriptLinePrompt: "",
      scriptLinePersonaAction: "",
      scriptLineResponse: "",
      keywords: [],
      isPersonasReturnQuestions: false,
    };
    if (vSelectProcessScriptIndex) {
      //check selected process
      let items = [...vProcessList];
      let item = { ...items[vSelectProcessScriptIndex] };
      item.scriptLineList.push(initState);
      items[vSelectProcessScriptIndex] = item;
      setProcessList(items);
    }
  };
  const removeScriptCard = (index) => {
    //remove script card
    let items = [...vProcessList];
    let item = { ...items[vSelectProcessScriptIndex] };
    item.scriptLineList.splice(index, 1);
    items[vSelectProcessScriptIndex] = item;
    setProcessList(items);
  };

  const cardSorting = (arr, old_index, new_index) => {
    //array sorting function
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    arr.map((item, index) => {
      item.processDisplayNumber = index;
    });
    return arr; // for testing
  };
  const scriptLineCardSorting = (arr, old_index, new_index) => {
    //array sorting function
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    arr.map((item, index) => {
      item.scriptLineDisplayNumber = index;
    });
    return arr; // for testing
  };

  const moveProcess = (type, index) => {
    //card sorting
    let newIndex =
      type == "down"
        ? index + 1 == vProcessList.length
          ? index
          : index + 1
        : index != 0
        ? index - 1
        : index;
    let sort = cardSorting(vProcessList, index, newIndex);
    setHandleCardMove((prev) => prev + 1);
  };

  const moveScript = (type, index) => {
    //card sorting
    let newIndex =
      type == "down"
        ? index + 1 == vProcessList[vSelectProcessScriptIndex].scriptLineList.length
          ? index
          : index + 1
        : index != 0
        ? index - 1
        : index;
    if (vSelectProcessScriptIndex) {
      let sort = scriptLineCardSorting(
        vProcessList[vSelectProcessScriptIndex].scriptLineList,
        index,
        newIndex
      );
      setHandleCardMove((prev) => prev + 1);
    }
  };

  const saveProcess = () => {
    setShowConfirmOpen(true);
  };

  const confirmSaveProcess = (type) => {
    if (type == "apply") {
      let formatChange = [];
      vProcessList.map((v, k) => {
        let item = {
          chatProcessName: v.processName,
          chatProcessPoint: v.processPoint,
          chatProcessSalesTool: v.processTool,
          gptAutoAnswer: null,
        };
        let processRefArray = [];
        if (v.processReference.length) {
          v.processReference.map((v1, k1) => {
            processRefArray.push({
              referenceName: v1.referenceName,
              referencePath: v1.referencePath,
            });
          });
        }
        item["chatProcessReferences"] = processRefArray;
        if (vPersonaType === 'ChatGPT') {
          if (v.isPersonasReturnQuestions === true ||
              (v.keywordRate && v.keywordRate !== '') ||
              (v.scriptResponse && v.scriptResponse !== '') ||
              (v.scriptPersonaAction && v.scriptPersonaAction !== '' && v.scriptPersonaAction !== 'NA')) {
            item["gptAutoAnswer"] = {
              id: v.gptAutoAnswerId ?? null,
              on: v.isPersonasReturnQuestions ?? false,
              externalId: v.processId ?? null,
              keywordRate: (v.keywordRate && v.keywordRate !== '') ? v.keywordRate : 0,
              response: v.scriptResponse ?? '',
              personaAction: v.scriptPersonaAction ?? '',
            };
          }
        }
        let scriptLinesArray = [];
        if (v.scriptLineList.length) {
          v.scriptLineList.map((v2, k2) => {
            let scriptLine = {
              scriptPrompt: v2.scriptLinePrompt,
              scriptResponse: v2.scriptLineResponse,
              scriptPersonaAction: v2.scriptLinePersonaAction ? v2.scriptLinePersonaAction : 'NA',
              gptAutoAnswer: null,
            };
            let keywordArray = [];
            if (v2.keywords.length) {
              v2.keywords.map((v3, k3) => {
                if(v3.keyWord != '')
                {
                  keywordArray.push(v3.keyWord);
                }
              });
            }
            scriptLine["keyWords"] = keywordArray;
            if (vPersonaType === 'ChatGPT') {
              if (v2.isPersonasReturnQuestions === true ||
                  (v2.scriptLineKeywordRate && v2.scriptLineKeywordRate !== '') ||
                  (v2.scriptLineResponse && v2.scriptLineResponse !== '') ||
                  (v2.scriptLinePersonaAction && v2.scriptLinePersonaAction !== '' && v2.scriptLinePersonaAction !== 'NA')) {
                scriptLine["gptAutoAnswer"] = {
                  id: v2.gptAutoAnswerId ?? null,
                  on: v2.isPersonasReturnQuestions ?? false,
                  externalId: v2.scriptLineId ?? null,
                  keywordRate: (v2.scriptLineKeywordRate && v2.scriptLineKeywordRate !== '') ? v2.scriptLineKeywordRate : 0,
                  response: v2.scriptLineResponse ?? '',
                  personaAction: v2.scriptLinePersonaAction ?? '',
                }
              } else {
                scriptLine["gptAutoAnswer"] = null;
              }
            }
            scriptLinesArray.push(scriptLine);
          });
        }
        item["scriptLines"] = scriptLinesArray;
        formatChange.push(item);
      });
      if(vPersonaType === 'fastText'){
        saveAndUpdateMatainNew(formatChange);
      }else{
        if (vPersonaType === 'ChatGPT') {
          let autoAnswer = null;
          let personaAction = vAutoAnswerSettings?.personaAction ?? ""
          if (personaAction === 'NA') {
            personaAction = '';
          }
          if (vAutoAnswerSettings && (
              vAutoAnswerSettings.on === true ||
              (vAutoAnswerSettings.keywordRate && vAutoAnswerSettings.keywordRate !== '') ||
              (vAutoAnswerSettings.response && vAutoAnswerSettings.response !== '') ||
              (personaAction !== '')
          )) {
            let personaAction2 = vAutoAnswerSettings?.personaAction2 ?? ""
            if (personaAction2 === 'NA') {
              personaAction2 = '';
            }
            autoAnswer = {
              id: vAutoAnswerSettings.id ?? null,
              on: vAutoAnswerSettings.on ?? false,
              externalId: sectionId ?? null,
              keywordRate: (vAutoAnswerSettings.keywordRate && vAutoAnswerSettings.keywordRate !== '') ? vAutoAnswerSettings.keywordRate : 0,
              response: vAutoAnswerSettings.response ?? "",
              personaAction: personaAction,
              prompt: vAutoAnswerSettings.prompt ?? "",
              lessThan: vAutoAnswerSettings.lessThan ?? false,
              keywordRate2: (vAutoAnswerSettings.keywordRate2 && vAutoAnswerSettings.keywordRate2 !== '') ? vAutoAnswerSettings.keywordRate2 : 0,
              response2: vAutoAnswerSettings.response2 ?? "",
              personaAction2: personaAction2,
            };
          }
          saveAndUpdateMatain(formatChange, autoAnswer);
        } else {
          saveAndUpdateMatain(formatChange, null);
        }
      }
    } else {
      setShowConfirmOpen(false);
    }
  };
  const saveAndUpdateMatain = async (formatChange, autoAnswer) => {
    const response = await saveAndUpdateMatainSection(formatChange, autoAnswer, sectionId);
    if (response.data.code == 200) {
      setShowConfirmOpen(false);
      MaintainSections();
      GetProcessToken();
      MaintainPersonAction();
      setIsEdit(true);
    }
  };
  const saveAndUpdateMatainNew = async (formatChange) => {
    const response = await saveAndUpdateMatainSectionNew(formatChange, sectionId);
    if (response.data.code == 200) {
      setShowConfirmOpen(false);
      MaintainSections();
      GetProcessToken();
      MaintainPersonAction();
      setIsEdit(true);
    }
  };

  const addNewKeyword = (index) => {
    //add new keyword
    let items = [...vProcessList];
    let item = { ...items[vSelectProcessScriptIndex] };
    item.scriptLineList[index].keywords.push({ keyWord: "" });
    items[vSelectProcessScriptIndex] = item;
    setProcessList(items);
  };
  const removeKeyword = (index, index1) => {
    //remove keyword
    let items = [...vProcessList];
    let item = { ...items[vSelectProcessScriptIndex] };
    item.scriptLineList[index].keywords.splice(index1, 1);
    items[vSelectProcessScriptIndex] = item;
    setProcessList(items);
  };

  const ProcessinputHandler = (e) => {
    //process input handler
    let items = [...vProcessList];
    items[e.target.dataset.index][e.target.name] = e.target.value;
    setScriptLines(items);
  };

  const ScriptInputHandler = (e) => {
    let items = [...vProcessList];
    items[vSelectProcessScriptIndex].scriptLineList[e.target.dataset.index][
      e.target.name
    ] = e.target.value;
    setScriptLines(items);
  };

  const ProcessCheckBoxHandler = (e) => {
    let items = [...vProcessList];
    items[e.target.dataset.index][e.target.name] = e.target.checked;
    setScriptLines(items);
  };

  const ScriptCheckBoxHandler = (e) => {
    let items = [...vProcessList];
    items[vSelectProcessScriptIndex].scriptLineList[e.target.dataset.index][
        e.target.name
        ] = e.target.checked;
    setScriptLines(items);
  };

  const scriptKeywordHandler = (e) => {
    let items = [...vProcessList];
    let keywordIndex =
      items[vSelectProcessScriptIndex].scriptLineList[e.target.dataset.index1]
        .keywords[e.target.dataset.index2];
    keywordIndex.keyWord = e.target.value;
    setScriptLines(items);
  };

  const setConfirmOpen = (e) => {
    //open upload file diag
    e.preventDefault();
    setSelectProcessIndex(e.target.dataset.index);
    setShowUploadDiag(true);
  };

  const uploadImageImportProcess = (value, index) => {
    //push process array
    let items = [...vProcessList];
    let item = { ...items[index] };
    item.processReference.push(value);
    items[index] = item;
    setProcessList(items);
  };

  const editProcess = () => {
    console.log('work')
    setIsEdit(false)
  }

  const unEditProcess = () => {
    setIsEdit(true)
    MaintainSections();
    GetProcessToken();
    MaintainPersonAction();
    setSelectProcessScriptIndex(undefined);
    setSelectedValue(undefined);
  }

  const checkMaterialType = (item) => {
    let type = item.referenceName.split('.').pop()
    if(type == 'pdf')
    {
      return PdfIcon
    }else if( type == 'xlsx' || type == 'xls'){
      return XlsIcon
    }else{
      return `${item.referencePath}?${vProcessToken}`
    }
  }

  const sortKeyword = (data) => {
    return data.sort((a, b) => a.id - b.id);
  }

  function p_dataURLtoBlob(data) {
      var bstr = atob(data)
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: 'pdf' });
  }

  const p_openNewWindow = (src, material) => {
      getBase64Name(material.referencePathName).then(res => {
          const blob = p_dataURLtoBlob(res?.data);
          const href = URL.createObjectURL(blob);

          var newWindow = window.open(src, '_blank', 'location=yes,scrollbars=yes,status=yes');
          newWindow.document.write("<html><head><title>" + material.referenceName + "</title></head><body>"
              + '<a href="' + href + '" download="' + material.referenceName + '" style="text-decoration:none;font-size:8px">'
              + '<h1>' + material.referenceName + '<button style="cursor:pointer;border: none;background-color: orange;color: white;border-radius: 5px;margin-left: 10px;">ダウンロードはこちら</button></h1></a>'
              + '<iframe src="' + src + '#toolbar=0" height="100%" width="100%" frameborder="0"></iframe></body></html>');
      })
  }

  return (
    <>
      <Row className="m-0">
      <h3 className="mb-32 mr-3" id={autoId()}>
          {getLocationState().themeName}
        </h3>
        <h3 className="mb-32 mr-3" id={autoId()}>
          {getLocationState().scenarioName}
        </h3>
        <h3 className="mb-32 mr-3" id={autoId()}>
          {getLocationState().personaInfo}
        </h3>
        <h3 className="mb-32" id={autoId()}>
          {getLocationState().sectionName}
        </h3>


      </Row>
      <div className="cmn-bg-box pb-3">
        <Row className="justify-content-between mb-3">
          <Col>
            {
              vIsEdit && 
              <BackButton
                title={t("scenario.return")}
                className="mr-3"
                onClick={goBack}
                idName="back_evaluation_page"
              />
            }
          </Col>
          {
            vIsEdit ?
            <BackButton
                title={t("scenario.edit")}
                className={`${classes.btn_blue_color} mr-3`}
                onClick={editProcess}
                idName="edit_role_play"
            /> :
            <>
            <Col className="text-right">
              {
                (vPersonaType === 'ChatGPT' ? (
                    <>
                      <IconButton
                          title={t("scenario.auto_answer")}
                          className={`${classes.btn_blue_color}`}
                          onClick={() => {
                            setShowAutoAnswerEditDialog(true);
                          }}
                          idName="show_auto_answer_edit_dialog"
                          icon={(vAutoAnswerSettings && vAutoAnswerSettings.on) ?
                                  (<img src={SelectedCheckBox} alt="Selected CheckBox"/>) :
                                  (<img src={OutlineCheckBox} alt="Selected CheckBox"/>)
                          }
                      />
                      <span className={classes.vr}></span>
                    </>
                ) : null)
              }
              <BackButton
                title={t("scenario.return")}
                className="mr-3"
                onClick={unEditProcess}
                idName="un_edit_role_play"
              />
              <BackButton
                title={t("scenario.reflect")}
                className={`${classes.btn_blue_color} mr-3`}
                onClick={saveProcess}
                idName="save_and_update_role_play"
              />
            </Col>
            </>
          }
        </Row>
        <AutoAnswerEditDialog
            open={vShowAutoAnswerEditDialog}
            setOpen={setShowAutoAnswerEditDialog}
            title={"自動回答設定"}
            item={vAutoAnswerSettings}
            personaActions={vPersonaActions}
            confirmSaveProcess={(value) => {setAutoAnswerSettings(value)}}
        />
        <UploadDiag
          title="変更を保存しますか？"
          open={vShowUploadDiag}
          setOpen={setShowUploadDiag}
          vSelectProcessIndex={vSelectProcessIndex}
          f_uploadImageImportProcess={uploadImageImportProcess}
        />
        <ConfirmDialog
          title="変更を保存しますか？"
          open={vShowConfirmOpen}
          setOpen={setShowConfirmOpen}
          confirmSaveProcess={confirmSaveProcess}
        />
        <Row>
        </Row>
        <Row style={{position:"relative"}}>
          <div className={(vIsEdit) && classes.overlay}></div>
          <Col lg="6">
            <p className="font-16 font-weight-bold mb-3">
              {t("role_play_creation.process.process")}
            </p>
          </Col>
          <Col lg="6">
            <p className="font-16 font-weight-bold mb-3 mt-4 mt-lg-0">
              {t("role_play_creation.message")}
            </p>
          </Col>
          <Col lg="6" id="process_list_container" name="process_list_container">
            {!vProcessListLoading
              ? vProcessList.map((item, index) => {
                  return (
                    <div
                      className={`${(vSelectedValue == index) && classes.select_card} cmn-bg-box-inr mb-3 position-relative`}
                      id={`process_card_${index}`}
                      name={`process_card_${index}`}
                    >
                      <div className="d-flex justify-content-between mb-32">
                        <Radio
                          checked={vSelectedValue == index}
                          onChange={dealChange}
                          value={index}
                          name="radio-button-demo"
                          inputProps={{ "aria-label": "A" }}
                        />
                        <div className="btn-gp">
                          <button
                            className="no-btn bg-transparent p-0"
                            id={`process_card_move_up_click_${index}`}
                            name={`process_card_move_up_click_${index}`}
                          >
                            <img
                              src={UpArrow}
                              alt="Up Arrow"
                              onClick={() => moveProcess("up", index)}
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
                              onClick={() => moveProcess("down", index)}
                            />
                          </button>
                          <button
                            className="no-btn bg-transparent p-0"
                            id={`process_card_move_remove_click_${index}`}
                            name={`process_card_move_remove_click_${index}`}
                          >
                            <img
                              src={CloseButton}
                              alt="Remove Button"
                              onClick={() => removeProcessCard(index)}
                            />
                          </button>
                        </div>
                      </div>
                      {vSelectedValue == index ? (
                        <img
                          src={polygon}
                          className={classes.polygon}
                          alt="polygon img"
                        />
                      ) : (
                        ""
                      )}

                      <BackgroundGrayLabel
                        label={t("role_play_creation.process.process_name")}
                        className="mb-3"
                        id={`process_name_title_${index}`}
                        name={`process_name_title_${index}`}
                      />

                      <GeneralTextbox
                        text={item.processName}
                        onChange={ProcessinputHandler}
                        id={`process_name_input_${index}`}
                        name="processName"
                        dataIndex={index}
                        className="mb-4"
                      />

                      <BackgroundGrayLabel
                        label={t("role_play_creation.process.point")}
                        className="mb-3"
                        id={`process_point_title_${index}`}
                        name={`process_point_title_${index}`}
                      />
                      <GeneralTextarea
                        onChange={ProcessinputHandler}
                        name="processPoint"
                        dataIndex={index}
                        Message={item.processPoint}
                        id={`process_point_input_${index}`}
                        className="mb-4"
                      />

                      <BackgroundGrayLabel
                        label={t("role_play_creation.process.material_tool")}
                        className="mb-3"
                        id={`process_material_tool_title_${index}`}
                        name={`process_material_tool_title_${index}`}
                      />
                      <GeneralTextarea
                        onChange={ProcessinputHandler}
                        name="processTool"
                        dataIndex={index}
                        Message={item.processTool}
                        id={`process_tool_input_${index}`}
                        className={vPersonaType === 'ChatGPT' ? "mb-2" : "mb-4"}
                      />
                      <Row
                        id={`process_materails_${index}`}
                        name={`process_materails_${index}`}
                      >
                        {item.processReference.map((item2, index2) => {
                          return (
                            <Col
                              lg="3"
                              key={index2}
                              id={`process_materail_${index2}`}
                              name={`process_materail_${index2}`}
                            >
                              <div className={classes.pdf_container}>
                                {vProcessToken ? (
                                  <span onClick={() => p_openNewWindow(`${item2.referencePath}?${vProcessToken}`, item2)} className={classes.cursor_pointer}>
                                      <img
                                      src={checkMaterialType(item2)}
                                      alt="File Icon"
                                      id={`process_materail_img_${index2}`}
                                      name={`process_materail_img_${index2}`}
                                      className={classes.w_100}
                                    />
                                    </span>
                                ) : (
                                  ""
                                )}
                                <p
                                  className={`cmn-link font-weight-bold ${classes.c_pointer}`}
                                  onClick={() => FdelMaterial(index, index2)}
                                  id={`process_materail_img_del_click_${index2}`}
                                  name={`process_materail_img_del_click_${index2}`}
                                >
                                  {t("role_play_creation.delete")}
                                </p>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                      {
                        vPersonaType === 'ChatGPT' ? (
                          <>
                            <div className={"d-block mb-4"}>
                              <a
                                  href="/"
                                  className="font-16 cmn-link font-weight-bold"
                                  onClick={setConfirmOpen}
                                  data-index={index}
                                  id={`process_materail_img_add_${index}`}
                                  name={`process_materail_img_add_${index}`}
                              >
                                {t("role_play_creation.add_file")}
                              </a>
                            </div>
                            <BackgroundGrayLabel
                                label={t("role_play_creation.script.persona")}
                                className="mb-3"
                            />
                            <div
                                className={`mb-3 font-weight-bold d-flex justify-content-between align-items-center`}>
                              <FormControlLabel
                                  control={
                                    <Checkbox
                                        checked={item.isPersonasReturnQuestions}
                                        color={'primary'}
                                        onChange={ProcessCheckBoxHandler}
                                        name={'isPersonasReturnQuestions'}
                                        inputProps={{'data-index': `${index}`}}
                                    />
                                  }
                                  label={t("role_play_creation.script.personas_return_questions")}
                                  className={"mb-0"}
                              />
                              <div className={"d-flex align-items-center"}>
                                <span className={"mr-2"}>キーワード率</span>
                                <GeneralTextbox
                                    className={classes.inputNumber}
                                    text={item.keywordRate}
                                    onChange={(e) => {
                                      if (/^[0-9]*$/.test(e.target.value)) {
                                        if (e.target.value > 100) {
                                          e.target.value = 100;
                                        }
                                        ProcessinputHandler(e);
                                      }
                                    }}
                                    id={`keyword_rate_input_${index}`}
                                    name="keywordRate"
                                    dataIndex={index}
                                    maxlength={3}
                                />
                                <span className={"ml-2"}>％以上</span>
                              </div>
                            </div>
                            <GeneralDropdown
                                items={vPersonaActions}
                                onSelect={(e) => {ondealScriptScenerio(e, index)}}
                                className={`mb-3 font-weight-bold`}
                                selectedData={item.scriptPersonaAction}
                                dropdown_id="script_persona_action_dropdown"
                                dataIndex={index}
                                idName={`script_persona_action_select_${index}`}
                            />
                            <GeneralTextarea
                                onChange={ProcessinputHandler}
                                name="scriptResponse"
                                dataIndex={index}
                                Message={item.scriptResponse}
                                id={`script_response_input_${index}`}
                                className="mb-4"
                            />
                          </>) : (
                            <a
                                href="/"
                                className="font-16 cmn-link font-weight-bold"
                                onClick={setConfirmOpen}
                                data-index={index}
                                id={`process_materail_img_add_${index}`}
                                name={`process_materail_img_add_${index}`}
                            >
                              {t("role_play_creation.add_file")}
                            </a>
                        )
                      }
                    </div>
                  );
                })
                : "Loading....."}
            <div className="cmn-bg-box-inr text-center p-32">
              <a
                  href="javascript:void(0);"
                  className="font-16 cmn-link font-weight-bold"
                  onClick={addNewProcess}
                  id={`add_new_process`}
                  name={`add_new_process`}
              >
              {t("role_play_creation.process.add_process")}
              </a>
            </div>
          </Col>
          <Col lg="6">
            {vSelectProcessScriptIndex
                ? vProcessList[vSelectProcessScriptIndex].scriptLineList.map(
                    (item, index) => {
                      return (
                          <div
                              className={`cmn-bg-box-inr mb-3 ${classes.select_card}`}
                              key={index}
                              id={`script_card_${index}`}
                              name={`script_card_${index}`}
                          >
                            <div className="d-flex justify-content-end mb-32">
                              <div className="btn-gp">
                                <button
                                    className="no-btn bg-transparent p-0"
                                    onClick={() => moveScript("up", index)}
                                    id={`script_card_move_up_${index}`}
                                    name={`script_card_move_up_${index}`}
                                >
                                  <img src={UpArrow} alt="Up Arrow"/>
                                </button>
                                <button
                                    className="no-btn bg-transparent p-0 mx-3"
                                    onClick={() => moveScript("down", index)}
                                    id={`script_card_move_down_${index}`}
                                    name={`script_card_move_down_${index}`}
                                >
                                  <img src={DownArrow} alt="Down Arrow"/>
                                </button>
                                <button
                                    className="no-btn bg-transparent p-0"
                                    id={`script_card_move_remove_${index}`}
                              name={`script_card_move_remove_${index}`}
                              onClick={() => removeScriptCard(index)}
                            >
                              <img src={CloseButton} alt="Close Button" />
                            </button>
                          </div>
                        </div>
                        <BackgroundGrayLabel
                          label={t("role_play_creation.script.recruiter")}
                          className="mb-3"
                          id={`script_recruiter_title_${index}`}
                          name={`script_recruiter_title_${index}`}
                        />
                        <GeneralTextarea
                          onChange={ScriptInputHandler}
                          name="scriptLinePrompt"
                          dataIndex={index}
                          Message={item.scriptLinePrompt}
                          id={`script_line_prompt_input_${index}`}
                          className="mb-4"
                        />

                        <BackgroundGrayLabel
                          label={t("role_play_creation.script.keyword")}
                          className="mb-3"
                          id={`script_keyword_title_${index}`}
                          name={`script_keyword_title_${index}`}
                        />
                        <div className="d-flex flex-wrap mb-3 align-items-center" 
                          id={`script_keywords_${index}`}
                          name={`script_keywords_${index}`}>

                          {sortKeyword(item.keywords).map((item2, index2) => {
                            return (
                              <KeywordTag
                                key={index2}
                                title={item2.keyWord}
                                className="mr-1"
                                onClick={() => removeKeyword(index, index2)}
                                onChange={scriptKeywordHandler}
                                dataIndex1={index}
                                dataIndex2={index2}
                                removeKeyword={removeKeyword}
                                id={`script_keyword_${index2}`}
                              />
                            );
                          })}
                          <p
                            className={`${classes.c_pointer} cmn-link font-weight-bold ml-3`}
                            onClick={() => addNewKeyword(index)}
                            id={`script_keyword_add_click_${index}`}
                            name={`script_keyword_add_click_${index}`}
                          >
                            {t("role_play_creation.script.add_to")}
                          </p>
                        </div>

                        <BackgroundGrayLabel
                          label={t("role_play_creation.script.persona")}
                          className="mb-3"
                        />
                        {
                          vPersonaType === 'ChatGPT' ? (
                              <div
                                  className={`mb-3 font-weight-bold d-flex justify-content-between align-items-end`}>
                                <div className={"d-flex flex-column"}>
                                  <FormControlLabel
                                      control={
                                        <Checkbox
                                            checked={item.isPersonasReturnQuestions}
                                            color={'primary'}
                                            onChange={ScriptCheckBoxHandler}
                                            name={'isPersonasReturnQuestions'}
                                            inputProps={{'data-index': `${index}`}}
                                        />
                                      }
                                      label={t("role_play_creation.script.personas_return_questions")}
                                      className={"mb-0"}
                                  />
                                </div>
                                <div className={"d-flex align-items-center"}>
                                  <span className={"mr-2"}>キーワード率</span>
                                  <GeneralTextbox
                                      className={classes.inputNumber}
                                      text={item.scriptLineKeywordRate}
                                      onChange={(e) => {
                                        if (/^[0-9]*$/.test(e.target.value)) {
                                          if (e.target.value > 100) {
                                            e.target.value = 100;
                                          }
                                          ScriptInputHandler(e);
                                        }
                                      }}
                                      id={`keyword_rate_input_${index}`}
                                      name="scriptLineKeywordRate"
                                      dataIndex={index}
                                      maxlength={3}
                                  />
                                  <span className={"ml-2"}>％以上</span>
                                </div>
                              </div>
                          ) : null
                        }
                            <GeneralDropdown
                                items={vPersonaActions}
                                onSelect={ondealScenerio}
                                className={`mb-3 font-weight-bold`}
                                selectedData={item.scriptLinePersonaAction}
                                dropdown_id="theme_dropdown"
                                dataIndex={index}
                                idName={`persona_action_select_${index}`}
                            />
                            <GeneralTextarea
                                onChange={ScriptInputHandler}
                                name="scriptLineResponse"
                                dataIndex={index}
                                Message={item.scriptLineResponse}
                                id={`script_line_response_input_${index}`}
                                className="mb-4"
                            />
                          </div>
                      );
                    }
                )
                : ""}
            <div className="cmn-bg-box-inr text-center p-32">
              <a
                  href="/"
                  className="font-16 cmn-link font-weight-bold"
                  onClick={addNewScriptLine}
              >
                {t("role_play_creation.script.add_message")}
              </a>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default VideoChatPage;
