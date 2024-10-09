import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
export default function AddScenarioDialog({
  flg,
  id,
  setFlg
}) {

  

  return (
      <Dialog
        open={flg}
        onClose={setFlg}
        aria-labelledby="responsive-dialog"
        // className={`img-popup ${classes.root} `}
        id={`${id}_dialog_close`}
      >
        <DialogContent id={`${id}_dialog_content`} className={`popup_content`}>
          <span>1</span>
        </DialogContent>
      </Dialog>
  );
}
