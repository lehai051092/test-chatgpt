import {selectTask} from "../../../storage/reduxActions";
import {connect} from "react-redux";
import * as styles from "./styles.module.css"
import React, {useCallback, useEffect, useState} from "react";
import {
    createCensoredCharacter,
    deleteCensoredCharacter,
    exportCensoredCharacter,
    getCensoredCharacter
} from "../../../request/backendApi/api";
import moment from "moment/moment";
import encoding from "encoding-japanese";
import logger from "redux-logger";
import classes from "../StartOfNewRolePlayPage/styles.module.css";
import {useTranslation} from "react-i18next";
import DownloadIcon from "../../../property/icons/DownloadIcon.png";
import DeleteKeywordButton from "../../../constituents/IButton/DeleteKeywordButtonLarge";
import GeneralTextbox from "../RegisterSynonyms/GeneralTextbox02";
import GeneralButton from "../../../constituents/IButton/GeneralButton";
import ConfirmDialog from "../RolePlaySetting/ConfirmDialog";
import LoadingMask from "../../../constituents/ILoadingMask";

const CensoredCharactersPage = ({}) => {
    const {t} = useTranslation();
    const [characters, setCharacters] = useState([])
    const [filteredCharacters, setFilteredCharacters] = useState([])
    const [searchCharacter, setSearchCharacter] = useState('')
    const [isEditCharacter, setIsEditCharacter] = useState(false)
    const [createCharacter, setCreateCharacter] = useState('')
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deleteCharacter, setDeleteCharacter] = useState()
    const [isWarningFieldOpen, setIsWarningFieldOpen] = useState(false)
    const [openMaskFlag, setOpenMaskFlag] = React.useState(false)
    
    
    useEffect(() => {
        if (searchCharacter && searchCharacter != '') {
            const targets = characters.filter((c) => {
                return c?.word?.indexOf(searchCharacter) >= 0
            })
            setFilteredCharacters(targets)
        } else {
            setFilteredCharacters(characters)
        }
    }, [searchCharacter, characters])
    
    useEffect(async () => {
        const res = await getCensoredCharacter()
        setCharacters(res.data)
        setFilteredCharacters(res.data)
    }, [])
    
    const onClickSave = useCallback(() => {
        setIsConfirmDialogOpen(true)
    }, []);
    
    const confirmCreateCharacter = useCallback(async () => {
        try {
            if (createCharacter) {
                const res = await createCensoredCharacter(createCharacter)
                setCharacters((v) => [...v, res.data])
                setIsEditCharacter(false)
                setIsConfirmDialogOpen(false)
                setSearchCharacter('')
            }
        } catch (e) {
            console.log('e', e)
        }
    }, [createCharacter]);
    
    const confirmDeleteCharacter = useCallback(async () => {
        try {
            if (deleteCharacter) {
                await deleteCensoredCharacter(deleteCharacter.id)
                setCharacters((v) => v.filter((c) => c.id != deleteCharacter.id))
                setDeleteCharacter(null)
                setIsDeleteDialogOpen(false)
            }
            
        } catch (e) {
            console.log('e', e)
        }
    }, [deleteCharacter, characters]);
    
    const addOpenCreateField = useCallback(() => {
        setIsEditCharacter(true)
    }, []);
    
    const exportHandler = useCallback(() => {
        setOpenMaskFlag(true);
        const data = exportCensoredCharacter().then((res) => {
            if (res.data) {
                const link = document.createElement("a");
                var currentDate = new Date();
                currentDate = moment(currentDate).format('YYYYMMDDHHmm');
                var fileName = "検閲文字_" + currentDate + ".csv"
                link.download = fileName; // file name
                var unicodeArray = encoding.stringToCode(res.data);
                var sjisData = new Uint8Array(encoding.convert(unicodeArray, {
                    to: 'SJIS',
                    from: 'UNICODE'
                }));
                const blob = new Blob([sjisData], {type: "text/plain; charset=SJIS"});
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
            } else {
                logger.error("Something-went-wrong ! Please check and try again ")
            }
        }).finally(() => {
            setOpenMaskFlag(false);
        });
    }, []);
    
    // 同文字チェック
    const isSameCreateCharacterExist = useCallback(() => {
        return !!characters.find((v) => v.word === createCharacter)
    }, [characters, createCharacter]);
    
    return <div className={styles.root}>
        <div className={styles.containerWrap}>
            <GeneralTextbox
                placeholder="検閲文字を検索する"
                value={searchCharacter}
                autoFocus={true}
                onChange={(e) => setSearchCharacter(e.target.value)}
            />
            <div className={styles.buttonsWrap}>
                <button className={`${styles.evaluation_btn} mr-10`} onClick={addOpenCreateField}>
                    <span>
                    <img src={DownloadIcon} alt="cross_icon" className=""/>
                    </span>
                    <span>検閲文字の追加</span>
                </button>
                <button className={`${styles.evaluation_btn} mr-10`} onClick={exportHandler}>
                    <span>
                    <img src={DownloadIcon} alt="cross_icon" className=""/>
                    </span>
                    <span>エクスポート</span>
                </button>
            </div>
        </div>
        <div className={styles.contentWrap}>
            <div>
                {
                    isEditCharacter ?
                        <>
                            <GeneralTextbox
                                placeholder=""
                                className={`${classes.synonym_text_box} ${classes.row_newinputstyle}`}
                                value={createCharacter}
                                autoFocus={true}
                                onChange={(e) => setCreateCharacter(e.target.value)}
                            />
                            <div className={styles.saveWrap}>
                                <div className={styles.warning}>
                                    {
                                        isSameCreateCharacterExist() ?
                                            <span>検閲文字に登録されています</span>
                                            : null
                                    }
                                </div>
                                <div className={styles.buttonsSaveWrap}>
                                    <GeneralButton
                                        title={t("registerSynonyms.register_synonyms_save")}
                                        className={`${styles.saveButton}`}
                                        disabled={createCharacter === "" || isSameCreateCharacterExist()}
                                        onClick={onClickSave}
                                    />
                                    <GeneralButton
                                        title={t("registerSynonyms.register_synonyms_cancel")}
                                        className={`${styles.cancelButton}`}
                                        onClick={() => {
                                            setIsEditCharacter(false)
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                        : null
                }
            </div>
            {filteredCharacters.map((chara, index) => {
                return (
                    <DeleteKeywordButton
                        title={chara.word ? chara.word : 'empty'}
                        key={index}
                        className={`mr-3 align-items-center d-inline-block mb-2 font-gray ${classes.height_64} ${classes.row_inputstyle}`}
                        onClickDeleteIcon={() => {
                            setDeleteCharacter(chara)
                            setIsDeleteDialogOpen(true)
                        }}
                    />
                );
            })}
        </div>
        <ConfirmDialog
            title="変更を保存しますか？"
            open={isConfirmDialogOpen}
            setOpen={setIsConfirmDialogOpen}
            confirmSaveProcess={confirmCreateCharacter}
        />
        <ConfirmDialog
            title="削除しますか？"
            open={isDeleteDialogOpen}
            setOpen={setIsDeleteDialogOpen}
            confirmSaveProcess={confirmDeleteCharacter}
        />
        <LoadingMask val={openMaskFlag}/>
    </div>
}
export default CensoredCharactersPage