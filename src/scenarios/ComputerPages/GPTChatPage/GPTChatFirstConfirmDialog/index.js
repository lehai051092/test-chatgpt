import React, {useMemo} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import classes from "./styles.module.css";
import store from "../../../../storage";
import {IS_ROLE_PLAY_ONGOING} from "../../../../storage/consts";
import {useHistory, useParams} from "react-router-dom";
import {browserRedirect} from "../../../../utils/util";


const GPTChatFirstConfirmDialog = (props) => {
  const {
    open,
    className,
    onConfirm,
    isVertical
  } = props;
  const history = useHistory();
  let {taskID} = useParams();
  let {lessonId} = useParams();
  
  
  const isLandscapeSP = useMemo(() => {
    return browserRedirect() === 2 && !isVertical
  }, [isVertical])
  
  return (
    <Dialog
      open={open}
      aria-labelledby="confirm-dialog"
      PaperProps={{className: `${classes.confirm_dialog_width}`}}
      className={`${isLandscapeSP ? classes.is_landscape_sp : ''}`}
    >
      <DialogContent className={`font-weight-bold ${classes.dialog_title_box} ${className}`}>
        <div className="font-weight-bold">
          <div
              className={`${classes.flex}`}
          >
            <div>
              ⚫︎
            </div>
            <p>
              募集人育成AIについて、ロープレ以外の目的で使用しないでください。
              <br/>
              また、募集人育成AIとのロープレの内容について、アフラック以外の第三者の目に触れることのないようにしてください。
            </p>
          </div>
          <div
              className={`${classes.flex}`}
          >
            <div>
              ⚫︎
            </div>
            <p>
              本ロープレでは生成AIを利用してロープレを実施しています。
              <br/>
              以下の点をご理解いただき、実施ください。
              <p>
                * 出力情報の正誤判断は最終的に利用者本人にゆだねられること
                <br/>
                * 生成AIが誤った情報を出力することがあること
                <br/>
                * 出力情報の利用に対する責任は利用者本人が持つこと
                <br/>
                * ファクトチェックをしっかりすること
              </p>
            </p>
          </div>
        </div>
      
      </DialogContent>
      <div className={`${classes.flex_center}`}>
        <div className={`${classes.buttons_wrap}`}>
          <div>
            <button
              className={`${classes.btn}`}
              onClick={() => {
                onConfirm()
              }}
            >
              <span>理解しました</span>
            </button>
          </div>
          <div>
            <button
              className={`${classes.return_btn}`}
              onClick={() => {
                store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false})
                history.push({
                  pathname: `/gpt-story/${taskID}/${lessonId}`
                })
              }}
            >
              <span>戻る</span>
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
export default GPTChatFirstConfirmDialog;
