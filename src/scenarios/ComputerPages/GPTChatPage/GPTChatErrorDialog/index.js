import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import classes from "./styles.module.css";
import GeneralButton from "../../../../constituents/IButton/FinishButton";


const GPTChatErrorDialog = (props) => {

    const {
        title,
        content,
        open,
        className,
        onConfirm,
    } = props;

    return (
        <Dialog
            open={open}
            aria-labelledby="confirm-dialog"
            PaperProps={{className: `${classes.confirm_dialog_width}`}}
        >
            {
                title && title !== '' &&
                <DialogContent className={`font-weight-bold text-center ${classes.dialog_title_box} ${className}`}>
                    <h6 className="font-weight-bold" dangerouslySetInnerHTML={{__html: title}}/>
                </DialogContent>
            }

            {
                content && content !== '' &&
                <DialogContent className={`font-weight-bold text-center ${classes.dialog_title_box} ${className}`}>
                    <p className="font-weight-bold" dangerouslySetInnerHTML={{__html: content}}/>
                </DialogContent>
            }
            <DialogActions className={`d-block px-4 mx-4`}>
                <GeneralButton
                    id="apply"
                    className={`${classes.yes_btn} border-0 font-14 py-4 mb-3 mt-2 w-100`}
                    title={'会話を最初からやり直す'}
                    onClick={async () => {
                        await onConfirm()
                    }}
                />
            </DialogActions>
        </Dialog>
    );
};
export default GPTChatErrorDialog;
