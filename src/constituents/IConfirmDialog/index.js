import React,{useEffect} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import GeneralButton from "../../constituents/IButton/GeneralButton";
import BackButton from "../../constituents/IButton/BackButton";
// import cancel from '../../property/images/close_circle.svg';
import cancel from "../../property/images/close_icon1.svg";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.css";
let onConfirmDisable = false;

const ConfirmDialog = (props) => {

  const {
    title,
    open,
    setOpen,
    onCancel,
    className,
    onRollBack,
    showSecOption,
    onReturn,
    onConfirm,
    firtTitle = 'はい',
    secondTitle = '採点せずに終了',
    thirdTitle = 'いいえ',
    isShowCloseHeader=true
  } = props;
  const { t } = useTranslation();
  useEffect(()=>{
    setTimeout(() => {
      onConfirmDisable = false;
    }, 200);
  },[open])

  return (
    <Dialog
      open={open}
      aria-labelledby="confirm-dialog"
      PaperProps={{ className: `${classes.confirm_dialog_width}` }}
    >
      {
        isShowCloseHeader && <DialogTitle id="confirm-dialog" className="p-0 text-right">
        <img
          src={cancel}
          alt="Cancel"
          className={`${classes.cancel}`}
          onClick={() => {
            setOpen(false);
            if (typeof onCancel === "function") {
              onCancel();
            }
          }}
        />
      </DialogTitle>
      }
      {
        title && title != '' && <DialogContent className={`font-weight-bold text-center ${classes.dialog_title_box} ${className}`}>
        <h6 className="font-weight-bold" dangerouslySetInnerHTML={{ __html: title }} />
      </DialogContent>
      }
      <DialogActions className={`d-block px-4 mx-4`}>
        <GeneralButton
          id="apply"
          className={`${classes.yes_btn} border-0 font-14 py-4 mb-3 mt-2 w-100`}
          title={firtTitle}
          onClick={() => {
            if(!onConfirmDisable){
              onConfirmDisable = true;
              onConfirm();
            }
          }}
        />
        {
          showSecOption ==='true' && <button
          id="rollback"
          className={`${classes.no_btn} border-0 mb-3 font-14 py-4 w-100 m-0`}
          title={secondTitle}
          onClick={()=>{ onRollBack()}}
        >{secondTitle}</button>
        }
        <button
          id="cancel"
          className={`${classes.no_btn} border-0 no_btn font-14 py-4 w-100 m-0`}
          title={thirdTitle}
          onClick={() => {
            setOpen(false);
            if (typeof onCancel === 'function') {
              onCancel();
            }
          }}
        >{thirdTitle}</button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
