import React, {useEffect, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import WarningPopup from '../WarningPopup';
import {addFuriganaWord, updateFuriganaWord} from "../../../../request/backendApi/api";
import store from "../../../../storage";
import logger from "redux-logger";

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

function TtsReplaceWordEditDialog(props) {
  const {open, setOpen, title, item, handleRefresh} = props;
  const styles = useStyles();

  const [original, setOriginal] = useState('');
  const [replaced, setReplaced] = useState('');

  const [isShowWarningPopup, setShowWarningPopup] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  let cur_login_user_info = store.getState().cacheMstUserInfo;
  let cur_login_user_header = store.getState().login_task_all;
  let mstDBUserName = cur_login_user_header?.userId.value ? cur_login_user_header.userId.value : '';
  if (cur_login_user_info.salsmanSeiKj) {
    mstDBUserName = cur_login_user_info.salsmanSeiKj + cur_login_user_info.salsmanMeiKj;
  }
  
  const handleClose = () => {
    setOpen(false);
  }

  const handleOK = async () => {
    if (original === '' || replaced === '') {
      setWarningMessage('必須入力項目に未入力があります。');
      setShowWarningPopup(true);
      return
    }

    if (item && item.id) {
      // update
      const data = {
        originalWord: original,
        replaceWord: replaced,
        userName: mstDBUserName ?? "",
      }
      updateFuriganaWord(item.id, data).then((res) => {
        if (res.data) {
          if (res.data.errorCode && res.data.errorMessage) {
            setWarningMessage(res.data.errorMessage);
            setShowWarningPopup(true);
            return;
          }
        } else {
          logger.error("Something-went-wrong ! Please check and try again ")
        }
        setOpen(false);
        handleRefresh();
      }).catch((error) => {
        console.log(error);
        setOpen(false);
      });
    } else {
      // add
      const data = {
        originalWord: original,
        replaceWord: replaced,
        userName: mstDBUserName ?? "",
      }
      addFuriganaWord(data).then((res) => {
        if (res.data) {
          if (res.data.errorCode && res.data.errorMessage) {
            setWarningMessage(res.data.errorMessage);
            setShowWarningPopup(true);
            return;
          }
        } else {
          logger.error("Something-went-wrong ! Please check and try again ")
        }
        setOpen(false);
        handleRefresh();
      }).catch((error) => {
        console.log(error);
        setOpen(false);
      });
    }
  }

  useEffect(() => {
    if (item) {
      setOriginal(item?.original);
      setReplaced(item?.replaced);
    }
  }, [item]);
  
  return (
    <Dialog onClose={handleClose} open={open} className={styles.root}>
      <div className={styles.body}>
        <div className={styles.header}>{title}</div>
        <div className={styles.dividingLine}></div>
        <div className={styles.content}>
          <div className={styles.gridTitle}>
            <span>
              <span>必須</span>
              <span className={styles.infoTitle}>フレーズ</span>
            </span>
            <input
                type='text'
                defaultValue={original}
                value={original}
                className={styles.input}
                onChange={(e) => {
                  setOriginal(e.target.value)
                }} maxLength={200}
            />
            <span>
              <span>必須</span>
              <span className={styles.infoTitle}>読み仮名</span>
            </span>
            <input
                type='text'
                defaultValue={replaced}
                value={replaced}
                className={styles.input}
                onChange={(e) => {
                  setReplaced(e.target.value)
                }} maxLength={200}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <button onClick={handleClose}>キャンセル</button>
          <button onClick={handleOK}>確定</button>
        </div>
      </div>
      <WarningPopup open={isShowWarningPopup} setOpen={setShowWarningPopup} warningMessage={warningMessage}/>
    </Dialog>
  )
}

export default TtsReplaceWordEditDialog;