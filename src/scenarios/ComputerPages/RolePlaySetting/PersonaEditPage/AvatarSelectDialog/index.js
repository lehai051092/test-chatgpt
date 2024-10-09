import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { getAllAvatarLink } from '../../../../../utils/util';
import styles from './styles.module.css'

const useStyles = makeStyles(() =>
  createStyles({
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
    root: {
      '& .MuiDialog-container': {
        position: 'relative',
        left: 'calc(115px / 2)',
      },
    },
    body: {
      width: 500,
      height: 'auto',
      padding: '15px 20px 20px',
    },
    header: {
      paddingLeft: 5,
      color: '#958c8c',
    },
    dividingLine: {
      width: '100%',
      height: 1.5,
      background: 'rgb(216, 216, 216)',
      margin: '10px 0 15px',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '0 8px',
      marginTop:'10px',
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
  })
);

function AvatarSelectDialog(props) {

  const { open, setOpen, setAvatar, onShowAvatar } = props;
  const classes = useStyles();

  const [vSnackbarOpen, setSnackbarOpen] = useState(false);
  const [vWarningMessage, setWarningMessage] = useState('');
  const [vAvatarList, setAvatarList] = useState([]);
  const [vSelectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    init();
  }, [])

  const init = () => {
    setAvatarList(getAllAvatarLink());
    setSelectedAvatar(onShowAvatar);
  }

  const handleOK = () => {
    setAvatar(vSelectedAvatar);
    setOpen(false);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  }

  return (
    <Dialog onClose={handleClose} open={open} className={classes.root}>
      <div className={classes.body}>
        <div className={classes.header}>アバター選択</div>
        <div className={classes.dividingLine}></div>
        <div className={styles.avatar_grid}>
          {vAvatarList.map((item,index)=>{
            return <div key={"avatar_"+index} className={`${styles.avatar_item} ${vSelectedAvatar === item.key?styles.avatar_item_selected:styles.avatar_item_not_selected}`} 
                        onClick={()=>{
                          console.log(item);
                          setSelectedAvatar(item.key)
                        }}
                    >
                      <img src={item.value.default}/>
                    </div>
          })}
        </div>
        <div className={classes.footer}>
          <button onClick={handleClose}>キャンセル</button>
          <button onClick={handleOK}>選択</button>
        </div>
      </div>
      <Snackbar anchorOrigin={{ 'vertical': 'top', 'horizontal': 'right' }} open={vSnackbarOpen} onClose={handleSnackbarClose} autoHideDuration={2000}>
        <span className={classes.snackbar}>{vWarningMessage}</span>
      </Snackbar>
    </Dialog>
  )
}

export default AvatarSelectDialog;