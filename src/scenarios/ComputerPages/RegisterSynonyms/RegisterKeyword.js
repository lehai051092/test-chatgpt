import { AddAlertRounded, AirlineSeatLegroomReducedTwoTone } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import DeleteKeywordButton from "../../../constituents/IButton/DeleteKeywordButtonLarge/index";
import GeneralButton from "../../../constituents/IButton/GeneralButton/index";
import ConfirmDialog from "../../../constituents/IConfirmDialog";
import GeneralTextbox from "./GeneralTextbox02";
import eventShuttle from "../../../eventShuttle";
import { deleteKeywords, postKeywords } from "../../../request/backendApi/api";
import classes from "./styles.module.css";

const RegisterKeyword = ({ regKeywords, regKeyword, setRegKeywords }) => {
  const { t } = useTranslation();
  const [isEditKeyword, setIsEditKeyword] = useState(false);
  const [isNewKeyword, setIsNewKeyword] = useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isOpenSaveConfirmDialog, setIsOpenSaveConfirmDialog] = useState(false);
  const [newSynonym, setNewSynonym] = useState("");
  const [deletedSynonym, setDeletedSynonym] = useState("");
  const [keyword, setKeyword] = useState("");
  const [synonyms, setSynonyms] = useState([]);


  const onClickSaveSynonym = (e) => {
    setIsOpenSaveConfirmDialog(true);
  }

  const onSaveSynonym = async () => {
    setIsOpenSaveConfirmDialog(false);
    try {
      await postKeywords({
        keyword,
        synonym: newSynonym,
        newKeyword: isNewKeyword,
      });
      onAfterSaveSynonym();
    } catch (error) {
      eventShuttle.dispatch("something_went_wrong");
    }
  };

  const onAfterSaveSynonym = () => {
    const foundIndex = regKeywords.findIndex(
      (regKeyword) => regKeyword.keyword === keyword
    );
    setIsNewKeyword(false);
    setSynonyms([...synonyms, newSynonym]);
    setNewSynonym("");
    setIsEditKeyword(false);
    regKeywords.splice(foundIndex, 1, {
      keyword,
      synonyms: [...synonyms, newSynonym],
    });
    setRegKeywords(regKeywords);
  };

  const onClickDeleteSynonym = (e) => {
    setDeletedSynonym(e.target.id);
    setIsOpenConfirmDialog(true);
  };

  const onDeleteSynonym = async () => {
    try {
      await deleteKeywords({ keyword, synonym: deletedSynonym });
      onAfterDeleteSynonym(deletedSynonym);
    } catch (error) {
      eventShuttle.dispatch("something_went_wrong");
    }
  };


  const onAfterDeleteSynonym = (deletedSynonym) => {
    const updatedSynonyms = synonyms.filter(
      (synonym) => synonym !== deletedSynonym
    );
    const foundIndex = regKeywords.findIndex(
      (regKeyword) => regKeyword.keyword === keyword
    );
    regKeywords.splice(foundIndex, 1, { keyword, synonyms: updatedSynonyms });
    setRegKeywords(regKeywords);
    setSynonyms(updatedSynonyms);
    setDeletedSynonym("");
    setIsOpenConfirmDialog(false);
  };

  const onDeleteKeyword = async () => {
    try {
      synonyms.forEach(async (synonym) => {
        await deleteKeywords({ keyword, synonym });
      });
      onAfterDeleteKeyword();
    } catch (error) {
      eventShuttle.dispatch("something_went_wrong");
    }
  };

  const onAfterDeleteKeyword = () => {
    const updatedRegKeywords = regKeywords.filter(
      (regKeyword) => regKeyword.keyword !== keyword
    );
    setRegKeywords(updatedRegKeywords);
  };

  const synonymsColGrid = () => {
    if (synonyms.length === 0) {
      return isEditKeyword ? "3" : "0";
    } else if (synonyms.length === 1) {
      return isEditKeyword ? "6" : "3";
    }
    return "6";
  };

  useEffect(() => {
    setIsNewKeyword(regKeyword.keyword === "");
    setKeyword(regKeyword.keyword);
    setSynonyms(regKeyword.synonyms);
  }, [regKeyword]);

  return (
      <Row>
        <Col xl="3" lg="4" md="5">
          <GeneralTextbox
            placeholder=""
            disabled={!isNewKeyword}
            text={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className={classes.input_newstyle}
          />
        </Col>
        <Col xl="8" lg="7" md="6">
          <Row>
            <Col xl={synonymsColGrid()}>
              {synonyms.map((synonym, index) => {
                return (
                  <DeleteKeywordButton
                    title={synonym}
                    key={index}
                    className={`mr-3 align-items-center d-inline-block mb-2 font-gray ${classes.height_64} ${classes.row_inputstyle}`}
                    onClickDeleteIcon={(e) => onClickDeleteSynonym(e)}
                  />
                );
              })}
              {isEditKeyword && (
                <GeneralTextbox
                  placeholder=""
                  className={`${classes.synonym_text_box} ${classes.row_newinputstyle}`}
                  value={newSynonym}
                  autoFocus={true}
                  onChange={(e) => setNewSynonym(e.target.value)}
                />
              )}
            </Col>
            <Col xl="6">
              {!isEditKeyword ? (
                <GeneralButton
                  title={t("registerSynonyms.register_synonyms_add_synonyms")}
                  className={`mr-4 w-auto px-4  d-inline-block mb-2 ${classes.export_btn} ${classes.height_64}`}
                  id="register_synonyms_add_synonyms"
                  onClick={() => setIsEditKeyword(true)}
                />
              ) : (
                <>
                  <GeneralButton
                    title={t("registerSynonyms.register_synonyms_save")}
                    className={`ml-4 mr-3 align-items-center  d-inline-block mb-2 ${classes.add_btn} ${classes.height_64}`}
                    id="register_synonyms_save"
                    disabled={keyword === "" || newSynonym === ""}
                    onClick={onClickSaveSynonym}
                  />
                  <GeneralButton
                    title={t("registerSynonyms.register_synonyms_cancel")}
                    className={`mr-4 w-auto px-4  d-inline-block mb-2 ${classes.add_btn} ${classes.cancel_btn} ${classes.height_64}`}
                    id="register_synonyms_cancel"
                    onClick={() => setIsEditKeyword(false)}
                  />
                </>
              )}
            </Col>
          </Row>
        </Col>
        <ConfirmDialog
          open={isOpenConfirmDialog}
          setOpen={setIsOpenConfirmDialog}
          onConfirm={onDeleteSynonym} 
          title={'削除しますか？'}
        />

        <ConfirmDialog
          open={isOpenSaveConfirmDialog}
          setOpen={setIsOpenSaveConfirmDialog}
          onConfirm={onSaveSynonym} 
          title={'保存しますか？'}
        />

        {/* <Col xs="1" className="text-center">
          <button
            className="btn no-btn pt-2"
            onClick={() => setIsOpenConfirmDialog(true)}
          >
            <img src={CloseIcon} className="btn-img" alt="close_icon" />
          </button>
          <ConfirmDialog
            open={isOpenConfirmDialog}
            setOpen={setIsOpenConfirmDialog}
            onReturn={onDeleteKeyword}
          />
        </Col> */}
      </Row>
  );
};

export default RegisterKeyword;
