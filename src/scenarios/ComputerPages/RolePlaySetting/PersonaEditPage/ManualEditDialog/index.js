import React, {useEffect, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Col, Row} from "reactstrap";
import {createStyles, makeStyles} from '@material-ui/core/styles';
import DownArrow from "../../../../../property/images/down_arrow_triangle.svg";
import UpArrow from "../../../../../property/images/up_arrow_triangle.svg";
import CloseButton from "../../../../../property/images/close_icon.svg";
import UploadDiag from "../UploadDiag";
import WarningPopup from '../../WarningPopup';
import GeneralTextarea from "../../../../../constituents/ITextarea/GeneralTextarea";
import GeneralTextbox from "../../../../../constituents/ITextboxes/GeneralTextbox02";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'relative',
      '& .MuiDialogTitle-root': {
        padding: '10px 24px'
      },
      '& .MuiPaper-root': {
        width: '80%',
      },
      '& .MuiDialog-container': {
        position: 'relative',
      },
      '& .MuiTypography-body1': {
        fontSize: '14px'
      }
    },
    body: {
      minHeight: '450px'
    },
    head: {
      paddingLeft: 10,
      color: '#958c8c',
      fontSize: '14px',
    },
    header: {
      padding: '0 10px 10px 10px',
      fontSize: '14px',
      color: '#000',
      fontWeight: 'bold'
    },
    dividingLine: {
      width: '100%',
      height: '1.5px',
      background: '#D1D1D1',
      margin: '5px 0 15px',
      fontWeight: 'bold'
    },
    dividingLineTop: {
      width: '100%',
      height: 1.5,
      background: 'rgb(216, 216, 216)',
      margin: '5px 0',
    },
    content: {
      padding: '5px 3px 0 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      '& button': {
        width: '135px',
        minHeight: '36px',
        background: 'var(--alice-blue)',
        display: 'inline-block',
        padding: '8px 16px',
        color: 'var(--blue-card)',
        borderRadius: '5px',
        textAlign: 'center',
        border: '1px solid var(--cerulean)',
        fontWeight: 'bold',
        marginRight: '3px',
      }
    },
    contentFile: {
      padding: '8px 0 0 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      '& button': {
        width: '135px',
        minHeight: '36px',
        background: 'var(--alice-blue)',
        display: 'inline-block',
        padding: '8px 16px',
        color: 'var(--blue-card)',
        borderRadius: '5px',
        textAlign: 'center',
        border: '1px solid var(--cerulean)',
        fontWeight: 'bold',
        marginRight: '3px',
      }
    },
    contentMain: {
      width: '100%',
      // height: '365px',
      overflowY: 'auto',
      padding: '0 3px',
      marginBottom: '20px',
      '& :first-child': {
        marginTop: '0px',
      }
    },
    materialItem: {
      width: '100%',
      height: '60px',
      alignItems: 'center',
      fontWeight: '700',
      boxShadow: '#909090 0px 0px 5px',
      backgroundColor: 'var(--light-grey)',
      borderRadius: '10px',
      border: ' 1px solid #e6e6e6',
      margin: '15px 0px 0px 0px',
    },
    handleBtns: {
      display: 'flex',
      justifyContent: 'space-around',
      paddingLeft: '10px',
      paddingRight: '10px',
      '& button': {
        width: '28px',
        border: 'none',
      }
    },
    
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '16px 8px',
      '& button': {
        width: 92,
        height: 34,
        borderRadius: 4,
      },
      '& button:first-child': {
        color: 'rgb(55, 160, 212)',
        background: 'rgb(211, 238, 247)',
        border: '1px solid rgb(55, 160, 212)',
        marginRight: 20,
      },
      '& button:last-child': {
        color: '#FFF',
        background: 'rgb(55, 160, 212)',
        border: '1px solid rgb(55, 160, 212)',
      },
    },
    infoTitle: {
      height: '35px',
      backgroundColor: '#D1D1D1',
      padding: '0px 15px',
      borderRadius: '4px',
      lineHeight: '35px',
      color: '#000',
      fontSize: '14px',
      fontWeight: 'bold',
      marginTop: '15px'
    },
    contentWrap: {
      margin: '0 0 30px'
    },
    systemPrompt: {
      height: '50vh',
      overflow: 'scroll',
      fontWeight: 'normal'
    },
    message: {
      height: '95px',
      overflow: 'scroll',
      minHeight: '0',
      fontWeight: 'normal'
    },
    keywordBlock: {
      fontWeight: 'bold',
      margin: '10px 0'
    },
    fontNormal: {
      fontWeight: 'normal !important'
    }
  })
);

function ManualEditDialog({open, setOpen, title, materials, manualBtnAction, gptSetting, gptAction, pensonaType}) {
  const styles = useStyles();
  const [vMaterials, setMaterials] = useState([]);
  const [vGptSetting, setGptSetting] = useState({
    systemText: '',
    maxTokens: 800,
    temperature: 0,
    roleplayTime: 10,
    maxMessagesTokens: 16000,
    emotion: false,
    keywordDensity: false,
    keywordDensityText: '',
    keywordParseText: '',
    startRecruiterMessage: '',
    startCustomerMessage: '',
  })
  //upload file
  const [vShowUploadDiag, setShowUploadDiag] = useState(false);
  const [vShowWarningPopup, setShowWarningPopup] = useState(false);
  const [vWarningMessage, setWarningMessage] = useState('');
  
  useEffect(() => {
    setMaterials(materials);
    setGptSetting({
      systemText: gptSetting?.systemText ?? '',
      temperature: gptSetting?.temperature,
      maxTokens: gptSetting?.maxTokens,
      roleplayTime: gptSetting?.roleplayTime,
      maxMessagesTokens: gptSetting?.maxMessagesTokens,
      emotion: gptSetting?.emotion,
      keywordDensity: gptSetting?.keywordDensity,
      keywordDensityText: gptSetting?.keywordDensityText ?? '',
      keywordParseText: gptSetting?.keywordParseText ?? '',
      startRecruiterMessage: gptSetting?.startRecruiterMessage ?? '',
      startCustomerMessage: gptSetting?.startCustomerMessage ?? '',
      autoInsertHistory:gptSetting?.autoInsertHistory,
      autoInsertRecruiterMessage:gptSetting?.autoInsertRecruiterMessage,
      autoInsertCustomerMessage:gptSetting?.autoInsertCustomerMessage,
    })
  }, [materials, gptSetting])
  
  
  const addMaterial = () => {
    setShowUploadDiag(true);
  }
  
  const uploadMaterial = (data) => {
    let {referenceName, referencePathName} = data;
    let materials_temp = vMaterials?.map(item => ({...item}));
    let materialItem = Object.assign({}, {
      name: referenceName,
      path: referencePathName,
      type: referenceName.substring(referenceName.length - 3) === 'pdf' ? 'PDF' : 'IMG',
      displayNumber: materials_temp.length + 1
    });
    materials_temp.push(materialItem);
    setMaterials(materials_temp);
  }
  
  const materialOrderFnUp = (index) => {
    if (index === 0) {
      return false;
    } else {
      changeOrder(index, index - 1);
    }
  }
  
  const materialOrderFnDown = (index) => {
    if (index === vMaterials.length - 1) {
      return false;
    } else {
      changeOrder(index, index + 1);
    }
  }
  
  
  const changeOrder = (originalOrder, newOrder) => {
    console.log('changeOrderView');
    let materials_temp = vMaterials.map(el => ({...el}));
    materials_temp[originalOrder].displayNumber = vMaterials[newOrder].displayNumber;
    materials_temp[newOrder].displayNumber = vMaterials[originalOrder].displayNumber;
    materials_temp.sort((a, b) => a.displayNumber - b.displayNumber);
    setMaterials(materials_temp);
  }
  
  const handleMaterialRemove = (index) => {
    
    let materials_temp = vMaterials.map(item => ({...item}));
    materials_temp.splice(index, 1);
    materials_temp.forEach((item, index) => {
      item.displayNumber = index + 1;
    })
    setMaterials(materials_temp);
  }
  
  const handleClose = () => {
    setMaterials(materials);
    setOpen(false);
  }
  
  // click '確定' btn save material change ⬇
  const handleOk = () => {
    if (pensonaType === 'ChatGPT') {
      if (vGptSetting.startRecruiterMessage === '') {
        setWarningMessage('ロープレ開始文言【募集人】を入力してください');
        setShowWarningPopup(true);
        return;
      }
      
      if (vGptSetting.startCustomerMessage === '') {
        setWarningMessage('ロープレ開始文言【お客様】を入力してください');
        setShowWarningPopup(true);
        return;
      }
      
      if (vGptSetting.autoInsertHistory) {
        if (!vGptSetting.autoInsertRecruiterMessage) {
          setWarningMessage('ロープレ自動挿入履歴　募集人文言を入力してください');
          setShowWarningPopup(true);
          return;
        }
        
        if (!vGptSetting.autoInsertCustomerMessage) {
          setWarningMessage('ロープレ自動挿入履歴　お客様文言を入力してください');
          setShowWarningPopup(true);
          return;
        }
      }
      
      if (vGptSetting.systemText === '') {
        setWarningMessage('システムプロンプトを入力してください');
        setShowWarningPopup(true);
        return;
      }
      
      if (vGptSetting.temperature < 0) {
        setWarningMessage('温度は0以上の数字を入力してください');
        setShowWarningPopup(true);
        return;
      }
      
      if (vGptSetting.roleplayTime <= 0) {
        setWarningMessage('ロープレ時間は0以上の数字を入力してください');
        setShowWarningPopup(true);
        return;
      }
      
      if (vGptSetting.maxMessagesTokens <= 0) {
        setWarningMessage('最大送信トークン数を入力してください');
        setShowWarningPopup(true);
        return;
      }
      
      if (vGptSetting.maxTokens <= 0) {
        setWarningMessage('最大応答トークン数を入力してください');
        setShowWarningPopup(true);
        return;
      }
      if (vGptSetting.keywordDensity) {
        if (!vGptSetting.keywordDensityText) {
          setWarningMessage('キーワード率パラメータ　キーワードを入力してください');
          setShowWarningPopup(true);
          return;
        }
        
        if (!vGptSetting.keywordParseText) {
          setWarningMessage('キーワード率パラメータ　パラメータ変換テキストを入力してください');
          setShowWarningPopup(true);
          return;
        }
      }
     
      gptAction(vGptSetting)
    }
    
    if (vMaterials.length) {
      let flgPdf = vMaterials.some(item => item.type === 'PDF');
      let flgImg = vMaterials.some(item => item.type === 'IMG');
      if (flgPdf && flgImg) {
        manualBtnAction(vMaterials);
        setOpen(false);
      } else {
        setWarningMessage('資材を登録する場合、ダウンロード用のPDFファイルと画面表示用のイメージファイルの両方が必要です。');
        setShowWarningPopup(true);
      }
    } else {
      manualBtnAction(vMaterials);
      setOpen(false);
    }
  }
  
  const systemTextHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      systemText: e.target.value
    }))
  };
  
  const chatHistoryLengthHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      temperature: e.target.value !== '' && e.target.value >= 0 ? e.target.value : 0
    }))
  };
  
  const rolePlayTimeHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      roleplayTime: e.target.value !== '' && e.target.value >= 0 ? e.target.value : 0
    }))
  };
  
  const maxTokenHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      maxTokens: e.target.value !== '' && e.target.value >= 0 ? parseInt(e.target.value) : 0
    }))
  };
  
  const maxMessagesTokenHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      maxMessagesTokens: e.target.value !== '' && e.target.value >= 0 ? parseInt(e.target.value) : 0
    }))
  };
  
  const emotionHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      emotion: e.target.checked
    }))
  };
  
  const keywordDensityHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      keywordDensity: e.target.checked
    }))
  };
  
  const keywordDensityTextHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      keywordDensityText: e.target.value
    }))
  };
  
  const startRecruiterMessageTextHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      startRecruiterMessage: e.target.value
    }))
  };
  
  const startCustomerMessageTextHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      startCustomerMessage: e.target.value
    }))
  };
  
  const keywordParseTextHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      keywordParseText: e.target.value
    }))
  };
  const autoInsertHistoryHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      autoInsertHistory: e.target.checked
    }))
  };
  
  const autoInsertRecruiterMessageHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      autoInsertRecruiterMessage: e.target.value
    }))
  };
  const autoInsertCustomerMessageHandler = (e) => {
    setGptSetting(val => ({
      ...val,
      autoInsertCustomerMessage: e.target.value
    }))
  };
  
  
  return (
    <>
      <Dialog onClose={handleClose} open={open} className={styles.root} scroll={'paper'}>
        <DialogTitle>
          <div className={styles.head}>{title}</div>
          <div className={styles.dividingLineTop}></div>
        </DialogTitle>
        <DialogContent>
          <div className={styles.body}>
            <div className={styles.content}>
              <div className={styles.contentMain}>
                {
                  pensonaType === 'ChatGPT' ?
                    <div
                      className={styles.contentWrap}
                    >
                      <div className={styles.header}>GPT設定</div>
                      <div className={styles.dividingLine}></div>
                      <div className={`${styles.infoTitle}`}>
                        ロープレ開始文言【募集人】
                      </div>
                      <GeneralTextarea
                        onChange={startRecruiterMessageTextHandler}
                        name="gptSetting"
                        dataIndex={0}
                        Message={vGptSetting.startRecruiterMessage}
                        className={`mt-3 ${styles.message}`}
                        placeholder={'【例】本日はお時間をいただきまして、ありがとうございます。' +
                          '\n高額医療費精度についてご説明させて頂きます。'}
                      />
                      <div className={`${styles.infoTitle}`}>
                        ロープレ開始文言【お客様】
                      </div>
                      <GeneralTextarea
                        onChange={startCustomerMessageTextHandler}
                        name="gptSetting"
                        dataIndex={0}
                        Message={vGptSetting.startCustomerMessage}
                        className={`mt-3 ${styles.message}`}
                        placeholder={'【例】 はい、こちらこそありがとうございます。' +
                          '\nよろしくお願いします。'}
                      />
                      <div className={`${styles.infoTitle}`}>
                        ロープレ自動挿入履歴
                      </div>
                      
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={vGptSetting.autoInsertHistory}
                            color={'primary'}
                            onChange={(v) => {
                              autoInsertHistoryHandler(v)
                            }}
                          />
                        }
                        label={'使用する'}
                      />
                      
                      {
                        vGptSetting.autoInsertHistory ?
                          <div>
                            <div className={styles.keywordBlock}>
                              募集人文言
                            </div>
                            <GeneralTextarea
                              onChange={autoInsertRecruiterMessageHandler}
                              dataIndex={0}
                              Message={vGptSetting.autoInsertRecruiterMessage}
                              className={`${styles.message}`}
                              placeholder={`【例】あなたはお客様役です。`}
                            />
                            <div className={styles.keywordBlock}>
                              お客様文言
                            </div>
                            <GeneralTextarea
                              onChange={autoInsertCustomerMessageHandler}
                              dataIndex={0}
                              Message={vGptSetting.autoInsertCustomerMessage}
                              className={`${styles.message}`}
                              placeholder={`【例】はい。私はお客様役として回答します。`}
                            />
                          </div>
                          : null
                      }
                      
                      <div className={`${styles.infoTitle}`}>
                        システムプロンプト
                      </div>
                      <GeneralTextarea
                        onChange={systemTextHandler}
                        name="gptSetting"
                        dataIndex={0}
                        Message={vGptSetting.systemText}
                        id={`gpt_setting_input`}
                        className={`mt-3 ${styles.systemPrompt}`}
                      />
                      <div className={`${styles.infoTitle}`}>
                        温度
                      </div>
                      <GeneralTextbox
                        className={`mt-3 ${styles.fontNormal}`}
                        step={0.01}
                        placeholder={'1'}
                        onChange={chatHistoryLengthHandler}
                        id="gpt_setting_message_count_input"
                        name="gpt_setting_message_count_input"
                        text={vGptSetting.temperature}
                        inputtype="number"
                      />
                      <div className={`${styles.infoTitle}`}>
                        ロープレ時間
                      </div>
                      <GeneralTextbox
                        className={`mt-3 ${styles.fontNormal}`}
                        placeholder={'16000'}
                        onChange={rolePlayTimeHandler}
                        id="gpt_setting_max_token_count_input"
                        name="gpt_setting_max_token_count_input"
                        pattern="^[1-9]\d*$"
                        text={vGptSetting.roleplayTime}
                        inputtype="number"
                      />
                      <div className={`${styles.infoTitle}`}>
                        最大送信トークン数
                      </div>
                      <GeneralTextbox
                        className={`mt-3 ${styles.fontNormal}`}
                        placeholder={'16000'}
                        onChange={maxMessagesTokenHandler}
                        id="gpt_setting_max_token_count_input"
                        name="gpt_setting_max_token_count_input"
                        pattern="^[1-9]\d*$"
                        text={vGptSetting.maxMessagesTokens}
                        inputtype="number"
                      />
                      <div className={`${styles.infoTitle}`}>
                        最大応答トークン数(最大送信トークン数の半分以下の値を設定してください)
                      </div>
                      <GeneralTextbox
                        className={`mt-3 ${styles.fontNormal}`}
                        placeholder={'10'}
                        onChange={maxTokenHandler}
                        id="gpt_setting_max_token_count_input"
                        name="gpt_setting_max_token_count_input"
                        pattern="^[1-9]\d*$"
                        text={vGptSetting.maxTokens}
                        inputtype="number"
                      />
                      <div className={`${styles.infoTitle}`}>
                        感情パラメータ
                      </div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={vGptSetting.emotion}
                            color={'primary'}
                            onChange={(v) => {
                              emotionHandler(v)
                            }}
                          />
                        }
                        label={'使用する'}
                      />
                      <div className={`${styles.infoTitle}`}>
                        キーワード率パラメータ
                      </div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={vGptSetting.keywordDensity}
                            color={'primary'}
                            onChange={(v) => {
                              keywordDensityHandler(v)
                            }}
                          />
                        }
                        label={'使用する'}
                      />
                      {
                        vGptSetting.keywordDensity ?
                          <div>
                            <div className={styles.keywordBlock}>
                              キーワード
                            </div>
                            <GeneralTextbox
                              className={styles.fontNormal}
                              placeholder="【例】納得度"
                              text={vGptSetting.keywordDensityText}
                              autoFocus={false}
                              onChange={(v) => {
                                keywordDensityTextHandler(v)
                              }}
                            />
                            <div className={styles.keywordBlock}>
                              パラメータ変換テキスト
                            </div>
                            <GeneralTextarea
                              onChange={keywordParseTextHandler}
                              dataIndex={0}
                              Message={vGptSetting.keywordParseText}
                              className={`${styles.message}`}
                              placeholder={`【例】 あなたの{キーワード}は{キーワード率}%とします。`}
                            />
                          </div>
                          : null
                      }
                    </div>
                    : null
                }
                
                <div className={styles.header}>ストーリー設定</div>
                <div className={styles.dividingLine}></div>
                <div className={`${styles.infoTitle}`}>
                  ファイル
                </div>
                <div className={styles.contentFile}>
                  <button onClick={addMaterial}>
                    ファイル追加
                  </button>
                </div>
                
                {
                  vMaterials?.map((item, index) => {
                    return <Row className={styles.materialItem} key={item.path}>
                      <Col lg="9">{item.name}</Col>
                      <Col lg="3" className={styles.handleBtns}>
                        <button
                          className="no-btn bg-transparent p-0"
                          id={`material_card_move_up_click_${index}`}
                          name={`material_card_move_up_click_${index}`}
                        >
                          <img
                            src={UpArrow}
                            alt="Up Arrow"
                            onClick={() => {
                              materialOrderFnUp(index);
                            }}
                          />
                        </button>
                        <button
                          className="no-btn bg-transparent p-0 mx-3"
                          id={`material_card_move_down_click_${index}`}
                          name={`material_card_move_down_click_${index}`}
                        >
                          <img
                            src={DownArrow}
                            alt="Down Arrow"
                            onClick={() => {
                              materialOrderFnDown(index);
                            }}
                          />
                        </button>
                        <button
                          className="no-btn bg-transparent p-0"
                          id={`material_card_move_remove_click_${index}`}
                          name={`material_card_move_remove_click_${index}`}
                          onClick={() => {
                            handleMaterialRemove(index)
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
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className={styles.footer}>
            <button onClick={handleClose}>キャンセル</button>
            <button onClick={handleOk}>確定</button>
          </div>
        </DialogActions>
      </Dialog>
      <UploadDiag
        open={vShowUploadDiag}
        setOpen={setShowUploadDiag}
        f_uploadMaterial={uploadMaterial}
        material={vMaterials}
      />
      <WarningPopup open={vShowWarningPopup} setOpen={setShowWarningPopup} warningMessage={vWarningMessage}/>
    </>
  )
}

export default ManualEditDialog;