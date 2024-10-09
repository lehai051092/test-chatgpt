import React, {useCallback, useEffect, useState} from "react";
import classes from "./styles.module.css";
import {deleteFuriganaWord, getFuriganaWords} from "../../../request/backendApi/api";
import LoadingMask from '../../../constituents/ILoadingMask';
import WarningPopup from "../RolePlaySetting/WarningPopup";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import VectorDownIcon from "./VectorDown.svg";
import {TablePagination, Typography} from "@material-ui/core";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "../../../constituents/IRadioButtons";
import TablePaginationActions from "../RolePlayLogPage/TablePaginationActions";
import CloseButton from "../../../property/images/close_icon.svg";
import talkScriptInputPencil from "../../../property/icons/talk-script-input-pencil.svg";
import ConfirmDialog from "./ConfirmDialog";
import TtsReplaceWordEditDialog from "./TtsReplaceWordEditDialog";
import Checkbox from "@material-ui/core/Checkbox";
import store from "../../../storage";

const TtsReplaceWordsPage = () => {
    const [isShowWarningPopup, setShowWarningPopup] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [isShowTtsReplaceWordEditDialog, setShowTtsReplaceWordEditDialog] = useState(false);
    const [editPageDialogMode, setEditPageDialogMode] = useState("");
    const [isShowRemoveToArchiveDialog, setIsShowRemoveToArchiveDialog] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [original, setOriginal] = useState("");
    const [replaced, setReplaced] = useState("");
    const [sort, setSort] = useState('asc');
    const [sortName, setSortName] = useState('id');
    const [deleted, setDeleted] = useState(false);
    const [totalSize, setTotalSize] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [replaceWords, setReplaceWords] = useState([]);
    const [openMaskFlag, setOpenMaskFlag] = React.useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    let cur_login_user_info = store.getState().cacheMstUserInfo;
    let cur_login_user_header = store.getState().login_task_all;
    let mstDBUserName = cur_login_user_header?.userId.value ? cur_login_user_header.userId.value : '';
    if (cur_login_user_info.salsmanSeiKj) {
        mstDBUserName = cur_login_user_info.salsmanSeiKj + cur_login_user_info.salsmanMeiKj;
    }

    useEffect(async () => {
        await getFuriganaWordList(original, replaced, page, rowsPerPage, sortName, sort, deleted)
    }, [sortName, sort, deleted]);
    const getFuriganaWordList = useCallback(async (original, replaced, pg, rowsPg, sortNames, sortOrder, deleted) => {
        const res = await getFuriganaWords(original, replaced, pg, rowsPg, sortNames, sortOrder, deleted)
        if (res.data && res.data.furiganaWords) {
            setReplaceWords(res.data.furiganaWords)
        }
        if (res.data && res.data.pagination) {
            setTotalSize(res.data.pagination.total)
            setPage(res.data.pagination.page - 1)
            setRowsPerPage(res.data.pagination.pageSize)
        }
    }, [original, replaced, page, rowsPerPage, deleted]);
    const handleChangePage = async (event, newPage) => {
        setPage(newPage);
        await getFuriganaWordList(original, replaced, newPage, rowsPerPage, sortName, sort, deleted)
    };
    const handleChangeRowsPerPage = async (v) => {
        setRowsPerPage(v.target.value);
        setPage(0);
        await getFuriganaWordList(original, replaced, 0, v.target.value, sortName, sort, deleted)
    };
    const handleRefresh = async () => {
        await getFuriganaWordList(original, replaced, page, rowsPerPage, sortName, sort, deleted);
    }
    const handleRemove = () => {
        const data = {
            userName: mstDBUserName
        }
        deleteFuriganaWord(deleteItem.id, data).then((res) => {
            if (res.data.errorCode && res.data.errorMessage) {
                setWarningMessage(res.data.errorMessage);
                setShowWarningPopup(true);
            }
        }).catch((error) => {
            console.log(error);
        }).finally(async () => {
            await getFuriganaWordList(original, replaced, page, rowsPerPage, sortName, sort, deleted);
        });
        setDeleteItem(null);
        setIsShowRemoveToArchiveDialog(false);
    }

    return (
        <div className={classes.root}>
            <div className={classes.containerWrap}>
                <Accordion
                    expanded={expanded}
                    onChange={() => {
                        setExpanded(!expanded);
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <img alt={'VectorDownIcon'} src={VectorDownIcon}/>
                        }
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                        className={classes.accordionSummary}
                    >
                        <Typography className={classes.heading}>
                            {expanded ? '検索条件を閉じる' : '検索条件を表示する'}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails}>
                        <div className={classes.accordionDetailsWrapFlex}>
                            <div className={classes.dateWrap}>
                                <p className={classes.dateLabel}>フレーズ</p>
                                <div className={classes.dateWrapContent}>
                                    <input
                                        type='text'
                                        defaultValue={original}
                                        value={original}
                                        className={classes.input}
                                        onChange={async (e) => {
                                            setOriginal(e.target.value)
                                            setPage(0)
                                            await getFuriganaWordList(e.target.value, replaced, 0, rowsPerPage, sortName, sort, deleted)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={classes.dateToWrap}>
                                <p className={classes.dateLabel}>読み仮名</p>
                                <div className={classes.dateWrapContent}>
                                    <input
                                        type='text'
                                        defaultValue={replaced}
                                        value={replaced}
                                        className={classes.input}
                                        onChange={async (e) => {
                                            setReplaced(e.target.value)
                                            setPage(0)
                                            await getFuriganaWordList(original, e.target.value, 0, rowsPerPage, sortName, sort, deleted)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={classes.accordionDetailsOrders}>
                            <p className={classes.dateLabel}>並び順</p>
                            <div className={classes.accordionDetailsWrapFlexCheck}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                >
                                    <FormControlLabel
                                        style={{paddingLeft: "10px"}}
                                        checked={sortName === "id"}
                                        value="id"
                                        control={<Radio/>}
                                        label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>ID</span>}
                                        onClick={() => {
                                            setPage(0)
                                            setSortName('id')
                                        }}
                                    />
                                    <FormControlLabel
                                        style={{marginLeft: '5px'}}
                                        checked={sortName === "original"}
                                        value="original"
                                        control={<Radio/>}
                                        label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>フレーズ</span>}
                                        onClick={() => {
                                            setPage(0)
                                            setSortName('original')
                                        }}
                                    />
                                    <FormControlLabel
                                        style={{marginLeft: '5px'}}
                                        checked={sortName === "replaced"}
                                        value="replaced"
                                        control={<Radio/>}
                                        label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>読み仮名</span>}
                                        onClick={() => {
                                            setPage(0)
                                            setSortName('replaced')
                                        }}
                                    />
                                    <FormControlLabel
                                        style={{marginLeft: '5px'}}
                                        checked={sortName === "lastUpdatedBy"}
                                        value="lastUpdatedBy"
                                        control={<Radio/>}
                                        label={<span
                                            style={{paddingLeft: "10px", fontSize: '14px'}}>最終更新日時</span>}
                                        onClick={() => {
                                            setPage(0)
                                            setSortName('lastUpdatedBy')
                                        }}
                                    />
                                </RadioGroup>
                                <p className={classes.verticalLine}/>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                >
                                    <FormControlLabel
                                        style={{marginLeft: '5px'}}
                                        checked={sort === "asc"}
                                        value="asc"
                                        control={<Radio/>}
                                        label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>昇順</span>}
                                        onClick={() => {
                                            setPage(0)
                                            setSort('asc')
                                        }}
                                    />
                                    <FormControlLabel
                                        style={{paddingLeft: "10px"}}
                                        checked={sort === "desc"}
                                        value="desc"
                                        control={<Radio/>}
                                        label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>降順</span>}
                                        onClick={() => {
                                            setPage(0)
                                            setSort('desc')
                                        }}
                                    />
                                </RadioGroup>
                                <p className={classes.verticalLine}/>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={deleted}
                                            color={'primary'}
                                            onChange={(v) => {
                                                setDeleted(v.target.checked)
                                            }}
                                        />
                                    }
                                    label={'削除済みも表示する'}
                                />
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <div className={classes.tableContainerWrap}>
                    <div className={classes.headerTableWrap}>
                        <table className={classes.tableContainerStyle}>
                            <thead>
                            <tr>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth7}`}>
                                    ID
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth20}`}>
                                    フレーズ
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth20}`}>
                                    読み仮名
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth15}`}>
                                    最終更新者
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth15}`}>
                                    最終更新日時
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth10}`}>
                                </th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                    <div className={classes.bodyTableWrap}>
                        <table className={classes.bodyTable}>
                            {replaceWords.map((row, index) => (
                                <tr key={index} className={classes.tableTr}>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth7}`}>{row.id}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth20}`}>{row.original}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth20}`}>{row.replaced}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth15}`}>{row.updatedBy}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth15}`}>{row.updatedAt}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth10}`}>
                                        {row.isDeleted ? null : (
                                            <>
                                                <button
                                                    className="no-btn bg-transparent p-0 mr-3"
                                                    id={`process_card_move_pencil_click_${index}`}
                                                    name={`process_card_move_pencil_click_${index}`}
                                                >
                                                    <img
                                                        src={talkScriptInputPencil}
                                                        alt="pencil"
                                                        className={`${classes.pencil_img}`}
                                                        onClick={() => {
                                                            setEditItem(row);
                                                            setEditPageDialogMode("edit");
                                                            setShowTtsReplaceWordEditDialog(true);
                                                        }}
                                                    />
                                                </button>
                                                <button
                                                    className="no-btn bg-transparent p-0 mr-2"
                                                    id={`process_card_move_remove_click_${index}`}
                                                    name={`process_card_move_remove_click_${index}`}
                                                    onClick={() => {
                                                        setDeleteItem(row);
                                                        setIsShowRemoveToArchiveDialog(true);
                                                    }}
                                                >
                                                    <img
                                                        src={CloseButton}
                                                        className={`${classes.close_img}`}
                                                        alt="Remove Button"
                                                    />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
                <table className={classes.tableContainerStyle2}>
                    <tbody>
                    <tr>
                        <td className={`mt-2 ${classes.footerItemButtons}`}>
                            <div>
                                <button
                                    className={`${classes.add_btn} mr-auto`}
                                    onClick={() => {
                                        setEditItem(null);
                                        setEditPageDialogMode("add");
                                        setShowTtsReplaceWordEditDialog(true);
                                    }}
                                >追加</button>
                            </div>
                        </td>
                        <TablePagination
                            style={{borderBottom: 'none'}}
                            count={totalSize}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </tr>
                    </tbody>
                </table>
                <LoadingMask val={openMaskFlag}/>
                <WarningPopup
                    open={isShowWarningPopup}
                    setOpen={setShowWarningPopup}
                    warningMessage={warningMessage}
                />
                {
                    isShowTtsReplaceWordEditDialog &&
                    <TtsReplaceWordEditDialog
                        title={editPageDialogMode === "add" ? "音声合成フレーズ追加" : "音声合成フレーズ編集"}
                        open={isShowTtsReplaceWordEditDialog}
                        setOpen={setShowTtsReplaceWordEditDialog}
                        vElearningLight={null}
                        setElearningLight={null}
                        item={editItem}
                        btnAction={null}
                        handleRefresh={handleRefresh}
                    />
                }
                <ConfirmDialog
                    title={(<p>削除したフレーズを復元することはできません。<br/>削除を中止する場合には「いいえ」を押下してください。</p>)}
                    open={isShowRemoveToArchiveDialog}
                    setOpen={setIsShowRemoveToArchiveDialog}
                    confirmSaveProcess={handleRemove}
                />
            </div>
        </div>
    );
};

export default TtsReplaceWordsPage;
