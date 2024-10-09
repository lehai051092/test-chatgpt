import React, {useEffect, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import AvatarSelectDialog from '../AvatarSelectDialog';
import ManualEditDialog from '../ManualEditDialog';
import {getOnceAvatar} from '../../../../../utils/util';
import WarningPopup from '../../WarningPopup';
import {getAllSectionByPersonaId} from "../../../../../request/backendApi/api";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      '& .MuiDialog-container': {
        position: 'relative',
        left: 'calc(115px / 2)',
      },
    },
    body: {
      width: 600,
      height: 'auto',
      padding: 20,
    },
    header: {
      paddingLeft: 10,
      color: '#958c8c',
    },
    dividingLine: {
      width: '100%',
      height: 1.5,
      background: 'rgb(216, 216, 216)',
      margin: '5px 0 15px',
    },
    content: {
      padding: '5px 3px 40px 8px',
      display: 'flex',
      flexDirection: 'column',
      '& span': {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
      },
      '& input[type="radio"]': {
        position: 'relative',
      },
      '& input[type="radio"]::before': {
        content: '""',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        border: '1px solid rgb(178, 178, 178)',
        backgroundColor: '#fff',
        display: 'inline-block',
        position: 'absolute',
        left: '-1px',
        top: '-1px',
      },
      '& input[type="radio"]:checked::before': {
        content: '""',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        border: '1px solid rgb(11, 91, 197)',
        backgroundColor: '#fff',
        display: 'inline-block',
        position: 'absolute',
        left: '-1px',
        top: '-1px',
      },
      '& input[type="radio"]::after': {
        content: '""',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: 'rgb(178, 178, 178)',
        display: 'inline-block',
        position: 'absolute',
        left: '3px',
        top: '3px',
      },
      '& input[type="radio"]:checked::after': {
        content: '""',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: 'var(--blue)',
        display: 'inline-block',
        position: 'absolute',
        left: '3px',
        top: '3px',
      },
    },
    otherInfo: {
      width: '100%',
      // marginTop: 20,
      marginBottom: 50,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    avatar: {
      width: '32%',
      flexGrow: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      '& img': {
        width: '110px',
        height: '110px',
        display: 'block',
        position: 'relative',
        margin: '0 auto',
        maxWidth: '160px',
        objectFit: 'cover',
      },
      '& button': {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'rgb(51, 68, 173)',
        cursor: 'pointer',
        marginTop: 5,
        height: 35,
        background: 'rgb(234, 249, 253)',
        border: '1px solid rgb(87, 147, 231)',
        borderRadius: 4,
        padding: '0 25px',
      },
    },
    input: {
      marginLeft: 10,
      flexGrow: 1,
      height: 35,
      width: '100%',
      border: '1px solid rgb(202, 202, 202)',
      borderRadius: 4,
      outline: 'none',
      paddingLeft: 12,
    },
    manualDetails: {
      '& button': {
        height: 35,
        fontSize: 14,
        fontWeight: 'normal',
        color: 'rgb(51, 68, 173)',
        background: 'rgb(234, 249, 253)',
        border: '1px solid rgb(87, 147, 231)',
        borderRadius: 4,
        padding: '0 25px',
        marginLeft: 21,
      },
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '0 8px',
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
    gridTitle: {
      display: 'grid',
      gridTemplateRows: 'repeat(2, 35px)',
      gridTemplateColumns: '33% auto',
      gap: 10,
      justifyItems: 'end',
      alignItems: 'center',
      marginBottom: 10,
      '& div': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifySelf: 'start',
        alignSelf: 'center',
        '& label': {
          marginBottom: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 15,
          paddingLeft: '2px',
        },
      },
      '& span': {
        display: 'flex',
        alignItems: 'center',
        '& span:first-child': {
          width: '30px',
          height: '16px',
          fontSize: '10px',
          backgroundColor: '#eb666e',
          color: '#ffffff',
          marginRight: '5px',
          borderRadius: '3px',
          justifyContent: 'center',
        }
      },
    },
    gridInfo: {
      flexGrow: 1,
      display: 'grid',
      gridTemplateRows: 'repeat(auto-fill, 35px)',
      gridTemplateColumns: '37% auto',
      gap: 10,
      justifyItems: 'end',
      alignItems: 'center',
      '& div': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifySelf: 'start',
        alignSelf: 'center',
        '& label': {
          marginBottom: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 15,
          paddingLeft: '2px',
        },
      },
      '& span': {
        display: 'flex',
        alignItems: 'center',
        '& span:first-child': {
          width: '30px',
          height: '16px',
          fontSize: '10px',
          backgroundColor: '#eb666e',
          color: '#ffffff',
          marginRight: '5px',
          borderRadius: '3px',
          justifyContent: 'center',
        }
      },
    },
    infoTitle: {
      height: '35px',
      backgroundColor: '#D1D1D1',
      padding: '0px 15px',
      borderRadius: '4px',
    },
  })
);

function ScenarioEditPageDialog(props) {
  
  const {open, setOpen, title, item, btnAction, themeCode, scenarioCode, vElearningLight, setElearningLight} = props;
  const styles = useStyles();
  
  const [vTitle, setTitle] = useState('');
  const [vName, setName] = useState('');
  const [vAge, setAge] = useState('0');
  const [vGender, setGender] = useState('OTHER');
  const [vFamily, setFamily] = useState('');
  const [vCurriculumId, setCurriculumId] = useState('');
  const [vCourseId, setCourseId] = useState('');
  const [vPensonaType, setPensonaType] = useState('');
  const [vAvatar, setAvatar] = useState('0S_F');
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
    autoInsertHistory: false,
    autoInsertRecruiterMessage: '',
    autoInsertCustomerMessage: '',
  })
  
  
  const [vShowWarningPopup, setShowWarningPopup] = useState(false);
  const [vWarningMessage, setWarningMessage] = useState('');
  const [vAvatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [vManualDialogOpen, setManualDialogOpen] = useState(false);
  
  const eLearningFlg = item ? !item.editable : false;
  
  const handleClose = () => {
    setOpen(false);
  }
  
  const judgeFreeStory = async (id) => {
    if (!id) {
      return false;
    }
    let v = await getAllSectionByPersonaId(id);
    return v?.data?.length >= 2;
  }
  
  /* limit input emoji ⬇ */
  // const handleInputChange = (e) => {
  //   let iconRule = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
  //   if(iconRule.test(e.target.value)){
  //     setTitle(e.target.value.replace(iconRule, ''));
  //   }else{
  //     setTitle(e.target.value);
  //   }
  // }
  
  const handleOK = async () => {
    let dateId = Date.now();
    // check
    console.log(vPensonaType);
    if (vTitle === '' || vPensonaType === '' || vName === '') {
      setWarningMessage('必須入力項目に未入力があります。');
      setShowWarningPopup(true);
      return
    }
    if (themeCode === 'proposal' && vPensonaType === "rolePlay") {
      setWarningMessage('学習テーマ"AS提案編"にはフリーストーリーしか設定できません。');
      setShowWarningPopup(true);
      return
    }
    if (vAvatar === '0S_F' && vPensonaType === "rolePlay") {
      setWarningMessage('ストーリータイプがロープレの場合は、アバター画像を選択してください。');
      setShowWarningPopup(true);
      return
    }
    if (vPensonaType === "freeStory" && await judgeFreeStory(item?.personaId)) {
      setWarningMessage('ストーリータイプがフリーストーリーの場合、セクションは１つしか設定できません。');
      setShowWarningPopup(true);
      return
    }
    if (vAvatar !== '0S_F' && vPensonaType === "freeStory") {
      setWarningMessage('ストーリータイプがフリーストーリーの場合は、アバター画像の設定はできません。');
      setShowWarningPopup(true);
      return
    }
    
    let vLight = Object.assign(new Map(), vElearningLight);
    console.log(vLight);
    
    if (vCurriculumId && vCourseId) {
      let vPersonaId;
      if (item) {
        // upd
        vPersonaId = item.personaId;
        if (item?.modifyType === "ADD") {
          vPersonaId = item.tempId;
        }
        delete (vLight[vPersonaId]);
      } else {
        // add
        vPersonaId = dateId;
      }
      for (const key in vLight) {
        if (vLight[key] === `${vCurriculumId}_${vCourseId}`) {
          setWarningMessage('入力されたカリキュラムIDとコースIDは既に別のストーリーに登録されています。');
          setShowWarningPopup(true);
          return;
        }
      }
      vLight[vPersonaId] = `${vCurriculumId}_${vCourseId}`
      setElearningLight(vLight);
    } else if (vCurriculumId || vCourseId) {
      setWarningMessage('カリキュラムIDとコースIDは両方入力する必要があります。');
      setShowWarningPopup(true);
      return;
    }
    if (vPensonaType === 'ChatGPT') {
      
      if (!vGptSetting.startRecruiterMessage) {
        setWarningMessage('ロープレ開始文言【募集人】を入力してください');
        setShowWarningPopup(true);
        return;
      }
      
      if (!vGptSetting.startCustomerMessage) {
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
      
      if (!vGptSetting.systemText) {
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
      
    }
    
    // data form
    let dataForm = {
      "persona": vTitle,
      "name": vName,
      "age": vAge === '' ? null : vAge,
      "gender": vGender === '' ? 'MALE' : vGender,
      "course": vFamily,
      "avatar": vAvatar,
      "curriculumId": vCurriculumId, // ?
      "courseId": vCourseId, // ?
      "theme": themeCode,
      "scenario": scenarioCode,
      "type": vPensonaType, // ?
      "materials": vMaterials,
      "gptSetting": vPensonaType === 'ChatGPT' ? {
        systemText: vGptSetting.systemText ? vGptSetting.systemText : '',
        temperature: vGptSetting.temperature,
        maxTokens: vGptSetting.maxTokens,
        roleplayTime: vGptSetting.roleplayTime,
        maxMessagesTokens: vGptSetting.maxMessagesTokens,
        emotion: vGptSetting.emotion,
        keywordDensity: vGptSetting?.keywordDensity,
        keywordDensityText: vGptSetting?.keywordDensity ? vGptSetting?.keywordDensityText : '',
        keywordParseText: vGptSetting?.keywordDensity ? vGptSetting?.keywordParseText : '',
        startRecruiterMessage: vGptSetting.startRecruiterMessage ? vGptSetting.startRecruiterMessage : '',
        startCustomerMessage: vGptSetting.startCustomerMessage ? vGptSetting.startCustomerMessage : '',
        autoInsertHistory: vGptSetting?.autoInsertHistory,
        autoInsertRecruiterMessage: vGptSetting?.autoInsertRecruiterMessage ? vGptSetting?.autoInsertRecruiterMessage : '',
        autoInsertCustomerMessage: vGptSetting?.autoInsertCustomerMessage ? vGptSetting?.autoInsertCustomerMessage : '',
      } : null
    }
    // update
    if (item) {
      let data = Object.assign({}, item, dataForm);
      if (item.modifyType && item.modifyType === 'ADD') {
        data.modifyType = 'ADD';
        btnAction('updateAdded', data);
      } else {
        data.modifyType = 'UPDATE';
        btnAction('update', data);
      }
    } else {
      // add
      let data = dataForm;
      data["personaId"] = 0;
      data.status = 'ARCHIVED';
      data.modifyType = 'ADD';
      data.tempId = dateId;
      // The default elearning id of new data can be changed
      data.editable = true;
      btnAction('add', data);
    }
  }
  
  const handleAvatarChange = () => {
    console.log('handleAvatarChange');
    setAvatarDialogOpen(true);
  }
  
  const handleInfoChange = (label, value) => {
    switch (label) {
      case 'name':
        setName(value);
        break;
      case 'age':
        if (value.trim() === '') {
          setAge('');
        } else if (Number(value) <= 0) {
          setAge('0');
        } else if (Number(value) >= 100) {
          setAge('100');
        } else {
          setAge(Number(value).toString().replace(/\D/g, ''));
        }
        break;
      case 'gender':
        setGender(value);
        break;
      case 'family':
        setFamily(value);
        break;
      case 'curriculumId':
        if (value.trim() === '') {
          setCurriculumId('');
        } else {
          setCurriculumId(value.replace(/\D/g, ''));
        }
        break;
      case 'courseId':
        if (value.trim() === '') {
          setCourseId('');
        } else {
          setCourseId(value.replace(/\D/g, ''));
        }
        break;
      case 'pensonaType':
        setPensonaType(value);
        break;
      default:
        return;
    }
  }
  
  const handleManualClick = () => {
    console.log('handleManualClick');
    setManualDialogOpen(true);
  }
  
  const manualBtnAction = (materials) => {
    console.log(materials);
    setMaterials(materials);
  }
  
  const gptAction = (gpt) => {
    setGptSetting(gpt);
  }
  
  useEffect(() => {
    if (item) {
      setTitle(item?.persona);
      setName(item?.name);
      setAge(item?.age);
      setGender(item?.gender);
      setFamily(item?.course);
      setCurriculumId(item?.curriculumId);
      setCourseId(item?.courseId);
      setPensonaType(item?.type);
      setAvatar(item?.avatar);
      setMaterials(item?.materials);
      if (item?.gptSetting) {
        setGptSetting(item?.gptSetting)
      }
    }
  }, [item])
  
  return (
    <Dialog onClose={handleClose} open={open} className={styles.root}>
      <div className={styles.body}>
        <div className={styles.header}>{title}</div>
        <div className={styles.dividingLine}></div>
        <div className={styles.content}>
          <div className={styles.gridTitle}>
            <span>
              <span>必須</span>
              <span className={styles.infoTitle}>タイトル</span>
            </span>
            <input type='text' defaultValue={vTitle} value={vTitle} className={styles.input}
                   onChange={(e) => {
                     setTitle(e.target.value)
                   }} maxLength={200}/>
            <span>
              <span>必須</span>
              <span className={styles.infoTitle}>ストーリータイプ</span>
            </span>
            <div>
              <label>
                <input type='radio' name='gender' value={'rolePlay'}
                       defaultChecked={vPensonaType === 'rolePlay'} onChange={(e) => {
                  handleInfoChange('pensonaType', e.target.value)
                }}/>
                <span style={{marginLeft: 5, fontWeight: 'normal'}}>ロープレ</span>
              </label>
              <label>
                <input type='radio' name='gender' value={'freeStory'}
                       defaultChecked={vPensonaType === 'freeStory'} onChange={(e) => {
                  handleInfoChange('pensonaType', e.target.value)
                }}/>
                <span style={{
                  marginLeft: 5,
                  marginRight: 0,
                  fontWeight: 'normal'
                }}>フリーストーリー</span>
              </label>
              <label>
                <input type='radio' name='gender' value={'ChatGPT'}
                       defaultChecked={vPensonaType === 'ChatGPT'} onChange={(e) => {
                  handleInfoChange('pensonaType', e.target.value)
                }}/>
                <span style={{marginLeft: 5, marginRight: 0, fontWeight: 'normal'}}>ChatGPT</span>
              </label>
            </div>
          </div>
          <div className={styles.otherInfo}>
            <div className={styles.avatar}>
              <img src={getOnceAvatar(vAvatar)} alt={'avatar'}/>
              <button onClick={handleAvatarChange}>アバター変更</button>
            </div>
            <div className={styles.gridInfo}>
              <span>
                <span>必須</span>
                <span className={styles.infoTitle}>名前</span>
              </span>
              <input type='text' className={styles.input} defaultValue={vName} onChange={(e) => {
                handleInfoChange('name', e.target.value)
              }} maxLength={200}/>
              <span className={styles.infoTitle}>年齢</span>
              <input type='text' className={styles.input} value={vAge} onChange={(e) => {
                handleInfoChange('age', e.target.value)
              }}/>
              <span className={styles.infoTitle}>性別</span>
              <div>
                <label>
                  <input type='radio' name='pensonaType' value={'MALE'}
                         defaultChecked={vGender === 'MALE'} onChange={(e) => {
                    handleInfoChange('gender', e.target.value)
                  }}/>
                  <span style={{marginLeft: 5, fontWeight: 'normal'}}>男性</span>
                </label>
                <label>
                  <input type='radio' name='pensonaType' value={'FEMALE'}
                         defaultChecked={vGender === 'FEMALE'} onChange={(e) => {
                    handleInfoChange('gender', e.target.value)
                  }}/>
                  <span style={{marginLeft: 5, marginRight: 0, fontWeight: 'normal'}}>女性</span>
                </label>
                <label>
                  <input type='radio' name='pensonaType' value={'OTHER'}
                         defaultChecked={vGender === 'OTHER'} onChange={(e) => {
                    handleInfoChange('gender', e.target.value)
                  }}/>
                  <span style={{marginLeft: 5, marginRight: 0, fontWeight: 'normal'}}>未選択</span>
                </label>
              </div>
              <span className={styles.infoTitle}>属性</span>
              <input type='text' className={styles.input} defaultValue={vFamily} onChange={(e) => {
                handleInfoChange('family', e.target.value)
              }} maxLength={200}/>
              
              <span className={styles.infoTitle}>カリキュラムID</span>
              <input
                type='text'
                style={eLearningFlg ? {cursor: "not-allowed"} : {}}
                disabled={eLearningFlg}
                className={styles.input}
                value={vCurriculumId}
                maxLength={4}
                onChange={(e) => {
                  handleInfoChange('curriculumId', e.target.value)
                }}
              />
              <span className={styles.infoTitle}>コースID</span>
              <input
                type='text'
                style={eLearningFlg ? {cursor: "not-allowed"} : {}}
                disabled={eLearningFlg}
                className={styles.input}
                value={vCourseId}
                maxLength={2}
                onChange={(e) => {
                  handleInfoChange('courseId', e.target.value)
                }}
              />
            </div>
          </div>
          <div className={styles.manualDetails}>
            <button onClick={handleManualClick}>ペルソナ詳細</button>
          </div>
        </div>
        <div className={styles.footer}>
          <button onClick={handleClose}>キャンセル</button>
          <button onClick={handleOK}>確定</button>
        </div>
      </div>
      {
        vAvatarDialogOpen ?
          <AvatarSelectDialog open={vAvatarDialogOpen} setOpen={setAvatarDialogOpen} setAvatar={setAvatar}
                              onShowAvatar={vAvatar}/>
          :
          null
      }
      <ManualEditDialog
        open={vManualDialogOpen}
        setOpen={setManualDialogOpen}
        pensonaType={vPensonaType}
        title={'ペルソナ詳細'}
        item={item}
        materials={vMaterials}
        gptSetting={vGptSetting}
        manualBtnAction={manualBtnAction}
        gptAction={gptAction}
      />
      <WarningPopup open={vShowWarningPopup} setOpen={setShowWarningPopup} warningMessage={vWarningMessage}/>
    </Dialog>
  )
}

export default ScenarioEditPageDialog;