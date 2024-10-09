import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      '& .MuiDialog-container': {
        position: 'relative',
        left: 'calc(115px / 2)',
      },
      '& .MuiPaper-root': {
        minWidth: '400px',
        borderRadius: '10px !important',
      },
    },
    warningPopup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems:'center',
      padding: '0px 40px 40px',
      '& div': {
        maxWidth: '400px',
        padding: '20px 0px 30px',
        fontSize: '18px',
        fontWeight: 700
      },
      '& button': {
        width: '100%',
        minHeight: '36px',
        background:'var(--cerulean)',
        color: 'var(--white)',
        borderRadius: '5px',
        textAlign: 'center',
        fontWeight: 700,
        border: '2px solid #037599',
        borderRadius: '12px',
        padding: '16px 5px',
      }
    },
  })
);

function WarningPopup ({open, setOpen, warningMessage}){
  const styles = useStyles();
  return(
    <Dialog open={open} className={styles.root}>
      <DialogContent  className={styles.warningPopup}>
        <div>{warningMessage}</div>
        <button onClick={() =>setOpen(false)}>OK</button>
      </DialogContent>
    </Dialog>
  )
}

export default WarningPopup;