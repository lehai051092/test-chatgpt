import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import scenario_img from "../../../property/scenario_images/scenario_img.png";
import "./styles.css";
import axios from "axios";
import {
  getProcessToken,
  getBase64Name,
} from "../../../request/backendApi/api";
import { onDownload } from "../../../utils/util";

const useStyles = makeStyles({});

export default function ResponsiveDialog({
  className,
  id,
  disabled = false,
  item,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [vImages, setImages] = useState([]);
  const [vPDF, setPDF] = useState([]);
  const [vProcessToken, setProcessToken] = useState();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const classes = useStyles();
  const handleClickOpen = () => {
    !disabled && setOpen(true);
    imgAndPdfSplit();
  };

  const GetProcessToken = async () => {
    const response = await getProcessToken();
    setProcessToken(response.data);
  };

  useEffect(() => {
    GetProcessToken();
  }, []);

  const imgAndPdfSplit = () => {
    let img = item.materials.filter((item) => item.type != "PDF");
    setImages(img);
    let pdf = item.materials.filter((item) => item.type == "PDF");
    setPDF(pdf);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function p_dataURLtoBlob(data) {
    var bstr = atob(data);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: "pdf" });
  }
  const p_openNewWindow = (item) => {
    getBase64Name(item.name).then((response) => {
      const blob = p_dataURLtoBlob(response?.data);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = item.name;
      link.href = url;
      link.setAttribute("download", decodeURIComponent(filename));
      document.body.appendChild(link);
      link.click();
      window.open(`${item.path}?${vProcessToken}`, "_blank");
    });
  };

  const downloadPdf = (item) => {
    onDownload(`${item.path}?${vProcessToken}`,item.name,()=>{
      window.open(`${item.path}?${vProcessToken}`, "_blank");
    })
  };

  return (
    <div className={(classes.root, className)}>
      <a
        variant="outlined"
        className="parason_pf_btn"
        color="primary"
        onClick={handleClickOpen}
        id={`${id}_link`}
      >
        {'>'}設定を表示する
      </a>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog"
        className={`img-popup ${classes.root} `}
        id={`${id}_dialog_close`}
      >
        <DialogContent id={`${id}_dialog_content`} className={`popup_content`}>
          {vImages.map((val, key) => {
            return (
              <img
                key={key}
                id={`${id}_dialog_image`}
                src={`${val.path}?${vProcessToken}`}
                className="img-fluid"
              />
            );
          })}
          <button
            onClick={(e) => downloadPdf(vPDF ? vPDF[0] : null)}
            id={`${id}_download`}
          >
            ダウンロードする
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
