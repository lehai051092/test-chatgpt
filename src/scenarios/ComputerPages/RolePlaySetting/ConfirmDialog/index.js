import React, {useEffect} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import YesButton from '../../Buttons/YesButton';
import GeneralButton from "../../../../constituents/IButton/GeneralButton";
import BackButton from "../../../../constituents/IButton/BackButton";
import cancel from "../../../../property/images/close_circle.svg";
import { useTranslation } from "react-i18next";
import "./styles.css";
const ConfirmDialog = (props) => {
  const {
    title,
    open,
    setOpen,
    onCancel,
    className,
    alert = false,
    onReturn,
    confirmSaveProcess,
  } = props;
  const { t } = useTranslation();
  const [disabled, setDisabled] = React.useState(false);
  useEffect(() => {
    //console.log(disabled)
  }, [disabled]);
  useEffect(() => {
    //console.log(disabled)
    if (open) {
      setDisabled(false);
    }
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
      PaperProps={{ className: "confirm_dialog_width" }}
    >
      <DialogTitle id="confirm-dialog" className="p-0 text-right">
        <img
          src={cancel}
          alt="Cancel"
          className="cancel"
          onClick={() => {
            setOpen(false);
            if (typeof onCancel === "function") {
              onCancel();
            }
          }}
        />
      </DialogTitle>
      <DialogContent
        className={`font-weight-bold text-center dialog_title_box ${className}`}
      >
      <h6>{title ? title : t('role_play_creation.confirm_dia.header')}</h6>
      </DialogContent>
      <DialogActions className="d-block px-4">
        <GeneralButton
          id="apply"
          className="yes_btn font-14 py-3 mb-3 mt-2 w-100"
          title={t('role_play_creation.yes')}
          onClick={() => {
            setDisabled(true);
            confirmSaveProcess("apply");
          }}
          disabled={disabled}
        />
        <BackButton
          id="cancel"
          className="no_btn font-14 py-3 w-100 m-0"
          title={t('role_play_creation.no')}
          onClick={() => {setOpen(false)}}
        />
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
