import React,{useEffect} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import GeneralButton from "../../constituents/IButton/GeneralButton";
import cancel from "./cancel.png";
import edge from "./edge.png";
import chrome from "./chrome.png";
import subTitle from "./sub_title.png";
import subTitleInterpret from "./sub_title_interpret.png";

import { useTranslation } from "react-i18next";
import classes from "./styles.module.css";
let onConfirmDisable = false;

const IConfirmDialogRecord = (props) => {

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
    thirdTitle = 'いいえ'
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
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
      PaperProps={{ className: `${classes.confirm_dialog_width}` }}
    >
      <img
          src={cancel}
          alt="Cancel"
          className={`${classes.cancel}`}
          onClick={() => {
            setOpen(false);
          }}
        />
      <DialogContent className={`font-weight-bold text-center ${classes.dialog_title_box} ${className}`}>
        <h6 className="font-weight-bold" dangerouslySetInnerHTML={{ __html: title }} />
        <div style={{marginTop:19}}>
          <button
            id="apply"
            className={classes.yes_button}
            onClick={() => {
              if(!onConfirmDisable){
                onConfirmDisable = true;
                onConfirm();
              }
            }}
          >{firtTitle}</button>
          <GeneralButton
            id="cancel"
            className={classes.no_btn}
            title={thirdTitle}
            onClick={() => {
              setOpen(false);
              if (typeof onCancel === 'function') {
                onCancel();
              }
            }}
          />
        </div>
        <img src={subTitle} style={{height:50,marginTop:41}}/>
        <img src={subTitleInterpret} style={{height:29,marginTop:16}}/>
        <div className={classes.chrome_or_edge}>
        <div >
          <span className={classes.chrome_or_edge_font}>Chromeブラウザの場合</span>
          <img src={chrome} style={{height:224,marginRight:40,marginLeft:30}}/>
        </div>
        <div>
          <span className={classes.chrome_or_edge_font}>Edgeブラウザの場合</span>
          <img src={edge} style={{height:224}}/>
        </div>
        </div>
        <span className={classes.sub_detail}>「画面全体」を選択し(※推奨) 「共有」を押してロープレを開始してください。</span>

      </DialogContent>
      
    </Dialog>
  );
};
export default IConfirmDialogRecord;
