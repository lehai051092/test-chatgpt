import React, {useMemo} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import classes from "./styles.module.css";
import closeRolePlayBtnOrangeArrow from "../../../../property/icons/close-role-play-btn-orange-arrow.svg";
import {browserRedirect} from "../../../../utils/util";


const GPTChatFinishDialog = (props) => {
  
  const {
    open,
    className,
    onConfirm,
    vIsVertical
  } = props;
  
  const arrowElement = useMemo(() => {
    // 1 pc / 2 mobile / 3 pad
    if (browserRedirect() === 1) {
      return <img src={closeRolePlayBtnOrangeArrow} alt={'closeRolePlayBtnOrangeArrow'}/>
    } else if (browserRedirect() === 2) {
      return null
    } else {
      if (vIsVertical) {
        return null
      } else  {
        return <img src={closeRolePlayBtnOrangeArrow} alt={'closeRolePlayBtnOrangeArrow'}/>
      }
    }
  }, [vIsVertical])
  
  return (
    <Dialog
      open={open}
      aria-labelledby="confirm-dialog"
      PaperProps={{className: `${classes.confirm_dialog_width}`}}
    >
      <DialogContent className={`font-weight-bold text-center ${classes.dialog_title_box} ${className}`}>
        <p className="font-weight-bold">
          時間になりましたので終了します。<br/>
          採点画面へ遷移します。
        </p>
      </DialogContent>
      <div className={`${classes.flex_center}`}>
        <button
          style={{border: 'none'}}
          className={`${classes.close_role_play_btn}`}
          onClick={() => onConfirm()}
        >
          <span>採点する</span>
          {
            arrowElement
          }
        </button>
      </div>
    </Dialog>
  );
};
export default GPTChatFinishDialog;
