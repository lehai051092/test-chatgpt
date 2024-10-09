import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { lessonsScenarioAdd, lessonsScenarioUpdate } from '../../../../../request/backendApi/api';
import WarningPopup from "../../WarningPopup";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      '& .MuiDialog-container': {
        position: 'relative',
        left: 'calc(115px / 2)',
      },
    },
    body: {
      width: 500,
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
      padding: '0 8px',
      display: 'flex',
      flexDirection: 'column',
      '& span': {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
      },
    },
    input: {
      marginTop: 10,
      height: 35,
      border: '1px solid rgb(202, 202, 202)',
      borderRadius: 4,
      outline: 'none',
      paddingLeft: 12,
    },
    errorMsg: {
      marginTop: 5,
      marginBottom: 140,
      height: 15,
      color: 'red',
      fontSize: 12,
      fontWeight: 'normal',
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
    snackbar: {
      width: 'auto',
      height: 40,
      background: 'rgb(255, 152, 0)',
      borderRadius: 4,
      color: 'white',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleFlex:{
      display:'flex',
      '& span:first-child': {
        height: '35px',
        lineHeight: '35px',
        backgroundColor: '#D1D1D1',
        padding: '0 15px',
        borderRadius: '4px',
      }
    },
    mandatorySpan:{
      width: '30px',
      height: '16px',
      marginTop:'10px',
      fontSize: '10px!important',
      backgroundColor: '#eb666e',
      color:'#ffffff !important',
      marginLeft: '3px',
      borderRadius: '3px',
      textAlign:'center'
    },
  })
);

function ScenarioEidtPageDialog(props) {

  const { open, setOpen, title, item, theme, btnAction } = props;
  const styles = useStyles();
  const [vTitle, setTitle] = useState('');
  const [vSnackbarOpen, setSnackbarOpen] = useState(false);
  const [vWarningMessage, setWarningMessage] = useState('');
  const [vShowWarningPopup, setShowWarningPopup] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setTitle('');
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

  const handleOK = () => {
    // check
    if (vTitle === '') {
      setWarningMessage('必須入力項目に未入力があります。');
      setShowWarningPopup(true);
      return;
    }
    // update
    if (item) {
      if (item.modifyType && item.modifyType === 'ADD') {
        let data = Object.assign({},item);
        data.scenarioName = vTitle;
        data.modifyType = 'ADD';
        btnAction('updateAdded', data);
      } else {
        let data = Object.assign({},item);
        // let data = item;
        data.scenarioName = vTitle;
        data.modifyType = 'UPDATE';
        btnAction('update', data);
      }
    } else {
      // add
      let data = {
        'scenarioCode': '',
        'scenarioName': vTitle,
        'status': 'ARCHIVED',
        'themeCode': theme?.themeCode,
        'themeOrder': theme?.themeOrder,
        'themeName': theme?.themeName,
        'modifyType': 'ADD',
        'tempId': Date.now(),
      }
      btnAction('add', data);
    }
  }

  useEffect(() => {
    if (item) {
      setTitle(item?.scenarioName);
    }
  }, [item])

  return (
    <Dialog onClose={handleClose} open={open} className={styles.root}>
      <div className={styles.body}>
        <div className={styles.header}>{title}</div>
        <div className={styles.dividingLine}></div>
        <div className={styles.content}>
        <div className={styles.titleFlex}>
          <span>タイトル</span>
          <span className={styles.mandatorySpan}>必須</span>
        </div>
          <input type='text' defaultValue={vTitle} value={vTitle} className={styles.input} onChange={(e) => { setTitle(e.target.value) }} maxLength={200} />
          {/* タイトルを空白にすることはできません */}
          <div className={styles.errorMsg}></div>
        </div>
        <div className={styles.footer}>
          <button onClick={handleClose}>キャンセル</button>
          <button onClick={handleOK}>確定</button>
        </div>
      </div>
      <Snackbar anchorOrigin={{ 'vertical': 'top', 'horizontal': 'right' }} open={vSnackbarOpen} onClose={handleSnackbarClose} autoHideDuration={2000}>
        <span className={styles.snackbar}>{vWarningMessage}</span>
      </Snackbar>
      <WarningPopup open={vShowWarningPopup} setOpen={setShowWarningPopup} warningMessage={vWarningMessage} />

    </Dialog>
  )
}

export default ScenarioEidtPageDialog;