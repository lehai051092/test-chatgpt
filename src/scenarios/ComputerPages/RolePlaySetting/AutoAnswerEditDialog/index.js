import React, {useEffect, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {GeneralDropdown} from "../../../../constituents/IDropdowns/GeneralDropdown";
import GeneralTextarea from "../../../../constituents/ITextarea/GeneralTextarea";
import './styles.css';
import WarningPopup from "../WarningPopup";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      '& .MuiDialog-container': {
        position: 'relative',
        left: 'calc(115px / 2)',
      },
      '& .MuiDialog-paperScrollPaper': {
        overflowX: 'hidden',
      }
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
    subHeader: {
      paddingLeft: 25,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'end',
    },
    dividingLine: {
      width: '100%',
      height: 1.5,
      background: 'rgb(216, 216, 216)',
      margin: '5px 0 15px',
    },
    subDividingLine: {
      width: 'calc(100% - 20px)',
      height: 1.5,
      background: 'rgb(216, 216, 216)',
      margin: '5px 0 15px 20px',
    },
    select: {
      '& div:first-child': {
        minHeight: '39px',
        padding: '8px',
        fontWeight: 400,
      },
      '& div:nth-child(2) ul': {
        zIndex: 9999,
        borderRadius: '4px',
        marginTop: '10px',
        fontWeight: 400,
      },
      borderRadius: '4px',
    },
    textarea: {
      padding: '12px',
    },
    promptTextarea: {
      padding: '12px',
      minHeight: '40px',
      height: '60px',
    },
    content: {
      padding: '5px 3px 40px 8px',
      display: 'flex',
      flexDirection: 'column',
      '& span.title': {
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
      //marginLeft: 10,
      flexGrow: 1,
      height: 35,
      width: '100%',
      border: '1px solid #808080',
      borderRadius: 4,
      outline: 'none',
      paddingLeft: 10,
      paddingRight: 12,
      textAlign: 'right',
      maxWidth: '50px',
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
      gridTemplateColumns: '25% auto',
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
          /*width: '30px',
          height: '16px',
          fontSize: '10px',
          backgroundColor: '#eb666e',
          color: '#ffffff',
          marginRight: '5px',
          borderRadius: '3px',
          justifyContent: 'center',*/
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

function AutoAnswerEditDialog(props) {
  const {open, setOpen, title, item, personaActions, confirmSaveProcess} = props;
  const styles = useStyles();

  const [isPersonasReturnQuestions, setIsPersonasReturnQuestions] = useState(false);
  const [keywordRate, setKeywordRate] = useState('');
  const [personaAction, setPersonaAction] = useState('');
  const [response, setResponse] = useState('');
  const [keywordRate2, setKeywordRate2] = useState('');
  const [personaAction2, setPersonaAction2] = useState('');
  const [response2, setResponse2] = useState('');
  const [prompt, setPrompt] = useState('');
  const [toggleOpen, setToggleOpen] = useState(false);
  const [isShowWarningPopup, setShowWarningPopup] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  
  const handleClose = () => {
    setOpen(false);
    if (item) {
      setIsPersonasReturnQuestions(item?.on);
      setKeywordRate(item?.keywordRate);
      setPersonaAction(item?.personaAction);
      setPrompt(item?.prompt);
      setResponse(item?.response);
      setToggleOpen(item?.lessThan);
      setKeywordRate2(item?.keywordRate2 ?? '');
      setPersonaAction2(item?.personaAction2 ?? '');
      setResponse2(item?.response2 ?? '');
    }
  }

  const handleOK = async () => {
    // 募集人文言がなしで未満の設定がある場合
    if (isPersonasReturnQuestions && toggleOpen && prompt === '') {
      setWarningMessage('募集人文言を入力してください');
      setShowWarningPopup(true);
      return;
    }

    // 募集人文言がなしで以上の設定がない場合
    if (isPersonasReturnQuestions && prompt === '' && response === '' && keywordRate === '' && (personaAction === '' || personaAction === 'NA')) {
      setWarningMessage('キーワード率 以上の設定を入力してください');
      setShowWarningPopup(true);
      return;
    }

    if (isPersonasReturnQuestions && prompt !== '' && (response === '' && keywordRate === '' && (personaAction === '' || personaAction === 'NA'))) {
      setWarningMessage('キーワード率 以上の設定を入力してください');
      setShowWarningPopup(true);
      return;
    }

    if (isPersonasReturnQuestions && prompt !== '' && (toggleOpen && response2 === '' && keywordRate2 === '' && (personaAction2 === '' || personaAction2 === 'NA'))) {
        setWarningMessage('キーワード率 未満の設定を入力してください');
        setShowWarningPopup(true);
        return;
    }

    const data = {
      on: isPersonasReturnQuestions,
      keywordRate: keywordRate,
      personaAction: personaAction,
      prompt: prompt,
      response: response,
      lessThan: toggleOpen,
      keywordRate2: keywordRate2,
      personaAction2: personaAction2,
      response2: response2,
    }
    confirmSaveProcess(data);
    setOpen(false);
  }

  const handleToggle = () => {
    if (toggleOpen) {
      setKeywordRate2('');
      setPersonaAction2('');
      setResponse2('');
    }
    setToggleOpen(!toggleOpen);
  }

  useEffect(() => {
    if (item) {
      setIsPersonasReturnQuestions(item?.on);
      setKeywordRate(item?.keywordRate);
      setPersonaAction(item?.personaAction);
      setPrompt(item?.prompt);
      setResponse(item?.response);
      setToggleOpen(item?.lessThan);
      setKeywordRate2(item?.keywordRate2 ?? '');
      setPersonaAction2(item?.personaAction2 ?? '');
      setResponse2(item?.response2 ?? '');
    }
  }, [item]);
  
  return (
      <>
        <Dialog onClose={handleClose} open={open} className={styles.root}>
          <div className={styles.body}>
            <div className={styles.header}>{title}</div>
            <div className={styles.dividingLine}></div>
            <div className={styles.content}>
              <div className={styles.gridTitle}>
                <span className={`${styles.infoTitle} title`}>自動回答</span>
                <div>
                  <FormControlLabel
                      control={
                        <Checkbox
                            checked={isPersonasReturnQuestions}
                            color={'primary'}
                            onChange={(e) => {
                              setIsPersonasReturnQuestions(e.target.checked);
                            }}
                            name={'isPersonasReturnQuestions'}
                        />
                      }
                      label={"自動回答"}
                      className={"mb-0"}
                  />
                </div>
                <span className={`${styles.infoTitle} title`}>募集人</span>
                <GeneralTextarea
                    onChange={(e) => {
                      setPrompt(e.target.value);
                    }}
                    name="prompt"
                    Message={prompt}
                    id={`prompt_input`}
                    className={styles.promptTextarea}
                />
              </div>
            </div>

            <div className={styles.subHeader}>
              <span>キーワード率 以上の設定</span>
            </div>
            <div className={styles.subDividingLine}></div>
            <div className={styles.content}>
              <div className={styles.gridTitle}>
                <span className={`${styles.infoTitle} title`}>キーワード率</span>
                <div className={"d-flex align-items-center w-100"}>
                  <input
                      type='text'
                      defaultValue={keywordRate}
                      value={keywordRate}
                      className={styles.input}
                      onChange={(e) => {
                        if (/^[0-9]*$/.test(e.target.value)) {
                          if (e.target.value > 100) {
                            setKeywordRate(100);
                          } else {
                            setKeywordRate(e.target.value);
                          }
                        }
                      }}
                      maxLength={3}/>
                  <span className={"ml-2 text-nowrap"}>％以上</span>
                </div>
                <span className={`${styles.infoTitle} title`}>動き</span>
                <GeneralDropdown
                    items={personaActions}
                    onSelect={(e) => {
                      setPersonaAction(e);
                    }}
                    className={`font-weight-bold w-100 ${styles.select}`}
                    selectedData={personaAction}
                    dropdown_id="persona_action_dropdown"
                    idName={`persona_action_select`}
                />
                <span className={`${styles.infoTitle} title`}>回答文言</span>
                <GeneralTextarea
                    onChange={(e) => {
                      setResponse(e.target.value);
                    }}
                    name="response"
                    Message={response}
                    id={`response_input`}
                    className={styles.textarea}
                />
              </div>
            </div>

            <div className={styles.subHeader}>
              <span>キーワード率 未満の設定</span>
              <span
                  className={`toggleIcon ${toggleOpen ? 'toggleIconExpand' : 'toggleIconFold'}`}
                  onClick={handleToggle}>
              </span>
            </div>
            <div className={styles.subDividingLine}></div>
            {toggleOpen && (
                <div className={styles.content}>
                  <div className={styles.gridTitle}>
                    <span className={`${styles.infoTitle} title`}>キーワード率</span>
                    <div className={"d-flex align-items-center w-100"}>
                      <input
                          type='text'
                          defaultValue={keywordRate2}
                          value={keywordRate2}
                          className={styles.input}
                          onChange={(e) => {
                            if (/^[0-9]*$/.test(e.target.value)) {
                              if (e.target.value > 100) {
                                setKeywordRate2(100);
                              } else {
                                setKeywordRate2(e.target.value);
                              }
                            }
                          }}
                          maxLength={3}/>
                      <span className={"ml-2 text-nowrap"}>％未満</span>
                    </div>
                    <span className={`${styles.infoTitle} title`}>動き</span>
                    <GeneralDropdown
                        items={personaActions}
                        onSelect={(e) => {
                          setPersonaAction2(e);
                        }}
                        className={`font-weight-bold w-100 ${styles.select}`}
                        selectedData={personaAction2}
                        dropdown_id="persona_action_dropdown"
                        idName={`persona_action_select`}
                    />
                    <span className={`${styles.infoTitle} title`}>回答文言</span>
                    <GeneralTextarea
                        onChange={(e) => {
                          setResponse2(e.target.value);
                        }}
                        name="response"
                        Message={response2}
                        id={`response_input`}
                        className={styles.textarea}
                    />
                  </div>
                </div>
            )}
            <div className={styles.footer}>
              <button onClick={handleClose}>キャンセル</button>
              <button onClick={handleOK}>確定</button>
            </div>
          </div>
        </Dialog>
        <WarningPopup open={isShowWarningPopup} setOpen={setShowWarningPopup} warningMessage={warningMessage}/>
      </>
  )
}

export default AutoAnswerEditDialog;