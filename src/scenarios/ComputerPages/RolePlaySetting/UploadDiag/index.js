import React, { useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PdfIcon from "../../../../property/images/icons/pdf_icon.png";
import UploadIcon from "../../../../property/images/icons/upload.png";
import GeneralButton from "../../../../constituents/IButton/GeneralButton";
import BackButton from "../../../../constituents/IButton/BackButton";
import cancel from "../../../../property/images/close_circle.svg";
import { useTranslation } from "react-i18next";
import "./styles.css";
import { uploadMaterail } from "../../../../request/backendApi/api";
import eventShuttle from "../../../../eventShuttle";
import error_icon from "../../../../property/icons/error_icon.png";

const UploadDiag = (props) => {
  const {
    title,
    open,
    setOpen,
    onCancel,
    className,
    alert = false,
    onReturn,
    f_uploadImageImportProcess,
    vSelectProcessIndex,
  } = props;
  const { t } = useTranslation();
  const fileInputRef = useRef();
  const [vImageObject, setImageObject] = useState({});
  const [vFileName, setFileName] = useState();
  const [vCheckFileExist, setCheckFileExist] = useState(false);
  const [vFileNotExist, setFileNotExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vUploadError, setUploadError] = useState(false);

  const fileInputTrigger = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleInputFile = (e) => {
    setUploadError(false);
    //update image
    var file = e.target.files[0];
    if (file) {
      setCheckFileExist(true);
      setFileNotExist(false);
    }
    var reader = new FileReader();
    setFileName(file.name);
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      let base64 = reader.result.split(",")[1];
      setImageObject({ data: base64, filename: file.name });
    };
    e.target.value = null;
  };

  const uploadFile = () => {
    if (vCheckFileExist) {
      setLoading(true);
      setUploadError(false);
      if (vImageObject != null) {
        const update = async () => {
          try {
            const response = await uploadMaterail(vImageObject)
              .then((res) => {
                f_uploadImageImportProcess(res.data, vSelectProcessIndex);
                setTimeout(() => {
                  setImageObject(null);
                  setLoading(false);
                  setOpen(false);
                  ///////////////
                  setFileName(null);
                  setFileNotExist(false);
                  setCheckFileExist(false);
                }, 2000);
              })
              .catch((err) => {
                setLoading(false);
                setUploadError(true);
              });
          } catch {
            setLoading(false);
            setUploadError(true);
            eventShuttle.dispatch(
              "エラーが発生しました。確認してもう一度お試しください。"
            );
          }
        };
        update();
      } else {
        setOpen(false);
      }
    } else {
      setFileNotExist(true);
    }
  };

  const dialogClose = (event = null, reason = null) => {
    // backdropClick
    if (loading && reason == "backdropClick") return false;
    setUploadError(false);
    setOpen(false);
    setImageObject(null);
    setTimeout(() => {
      setFileName(null);
      setCheckFileExist(false);
      setFileNotExist(false);
    }, 1000);
  };

  return (
    <Dialog
      onClose={(event, reason) => {
        dialogClose(event, reason);
      }}
      open={open}
      aria-labelledby="confirm-dialog"
      PaperProps={{ className: "confirm_pdf_dialog_width" }}
    >
      <DialogTitle id="confirm-dialog" className="p-0 text-right">
        {loading ? (
          <img src={cancel} alt="Cancel" className="cancel cursor-not-allow" />
        ) : (
          <img
            src={cancel}
            alt="Cancel"
            className="cancel"
            onClick={() => {
              dialogClose();
              if (typeof onCancel === "function") {
                dialogClose();
              }
            }}
          />
        )}
      </DialogTitle>
      <DialogContent
        className={`font-weight-bold text-center dialog_title_box px-5 ${className}`}
      >
        <h6>{t("role_play_creation.upload_dia.header")}</h6>
        <div className="pdf-message-box-sec">
          {vUploadError ? (
            <>
              <img src={error_icon} className="error_icon" alt="Pdf Icon" />
              {vFileNotExist == true && (
                <p className="d-block mt-4 mb-4 pt-2 font-red">
                  アップロードに失敗しました。再度ファイルを選択してください
                </p>
              )}
              <p className="d-block mt-4 mb-4 pt-2 text-danger">
                アップロードに失敗しました。再度ファイルを選択してください
              </p>
              <p className="d-block mt-4 mb-4 pt-2 text-danger">
                {vFileName
                  ? vFileName
                  : "アップロードするファイルを選択してください"}
              </p>
              <input
                accept="application/pdf,image/*, .xls, .xlsx"
                ref={fileInputRef}
                onChange={handleInputFile}
                type="file"
                hidden
              />

              <GeneralButton
                id="cancel"
                className="no_btn font-14 w-auto px-4"
                title="ファイル選択"
                disabled={loading}
                onClick={fileInputTrigger}
              />
            </>
          ) : (
            <>
              <img src={UploadIcon} alt="Pdf Icon" />
              {vFileNotExist == true && (
                <p className="d-block mt-4 mb-4 pt-2 font-red">
                  ファイルを選択してください。
                </p>
              )}
              <p className="d-block mt-4 mb-4 pt-2">
                {vFileName
                  ? vFileName
                  : "アップロードするファイルを選択してください"}
              </p>
              <input
                accept="application/pdf,image/*, .xls, .xlsx"
                ref={fileInputRef}
                onChange={handleInputFile}
                type="file"
                hidden
              />

              <GeneralButton
                id="cancel"
                className="no_btn font-14 w-auto px-4"
                title="ファイル選択"
                disabled={loading}
                onClick={fileInputTrigger}
              />
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions className="d-block text-right px-5">
        <BackButton
          id="apply"
          className="yes_btn font-14 mr-2 w-auto"
          title={t("role_play_creation.upload_dia.cancel")}
          onClick={() => {
            dialogClose();
          }}
          disabled={loading}
        />
        <GeneralButton
          id="cancel"
          className={`no_btn font-14 w-auto px-4 ${loading && "spinner"}`}
          title={!vUploadError ? "アップロード" : "リトライ"}
          disabled={loading}
          onClick={() => {
            uploadFile();
          }}
        />
      </DialogActions>
    </Dialog>
  );
};
export default UploadDiag;
