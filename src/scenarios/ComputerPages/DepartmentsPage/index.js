import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import classes from "./styles.module.css";
import {
    deleteDepartment,
    departmentCSVExport,
    departmentImportHistoryCSVExport,
    getDepartment,
} from "../../../request/backendApi/api";
import logger from "redux-logger";
import moment from 'moment';
import LoadingMask from '../../../constituents/ILoadingMask';
import ExcelJS from "exceljs";
import encoding from "encoding-japanese";
import CSVUploadDiag from "./CSVUploadDiag";
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
import Checkbox from "@material-ui/core/Checkbox";
import {ReactComponent as DownloadIcon} from "../../../property/icons/download_fill.svg";
import {ReactComponent as UploadIcon} from "../../../property/icons/upload_fill.svg";
import CloseButton from "../../../property/images/close_icon.svg";
import talkScriptInputPencil from "../../../property/icons/talk-script-input-pencil.svg";
import ConfirmDialog from "./ConfirmDialog";
import DepartmentEditDialog from "./DepartmentEditDialog";
import store from "../../../storage";

const DepartmentsPage = () => {
    const {t} = useTranslation();
    const [isShowUploadDiag, setShowUploadDiag] = useState(false);
    const [isShowWarningPopup, setShowWarningPopup] = useState(false);
    const [isShowDepartmentEditPageDialog, setShowDepartmentEditPageDialog] = useState(false);
    const [editPageDialogMode, setEditPageDialogMode] = useState("");
    const [isShowRemoveToArchiveDialog, setIsShowRemoveToArchiveDialog] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [warningMessage, setWarningMessage] = useState(null);
    const [code, setCode] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [sectionName, setSectionName] = useState("");
    const [nameAbbr, setNameAbbr] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [sort, setSort] = useState('asc');
    const [sortName, setSortName] = useState('created');
    const [deleted, setDeleted] = useState(false);
    const [totalSize, setTotalSize] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [departmentsList, setDepartmentsList] = useState([]);
    const [openMaskFlag, setOpenMaskFlag] = React.useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    let cur_login_user_info = store.getState().cacheMstUserInfo;
    let cur_login_user_header = store.getState().login_task_all;
    let mstDBUserName = cur_login_user_header?.userId.value ? cur_login_user_header.userId.value : '';
    if (cur_login_user_info.salsmanSeiKj) {
        mstDBUserName = cur_login_user_info.salsmanSeiKj + cur_login_user_info.salsmanMeiKj;
    }
    const getDepartmentsList = useCallback(async (code, departmentName, sectionName, nameAbbr, nameEn, pg, rowsPg, sortNames, sortOrder, deleted) => {
        const res = await getDepartment(code, departmentName, sectionName, nameAbbr, nameEn, pg, rowsPg, sortNames, sortOrder, deleted)
        if (res.data && res.data.departments) {
            setDepartmentsList(res.data.departments)
        }
        if (res.data && res.data.pagination) {
            setTotalSize(res.data.pagination.total)
            setPage(res.data.pagination.page - 1)
            setRowsPerPage(res.data.pagination.pageSize)
        }
    }, [code, departmentName, sectionName, nameAbbr, nameEn, deleted, page, rowsPerPage]);
    useEffect(async () => {
        await getDepartmentsList(code, departmentName, sectionName, nameAbbr, nameEn, page, rowsPerPage, sortName, sort, deleted)
    }, [deleted, sortName, sort]);
    const handleChangePage = async (event, newPage) => {
        setPage(newPage);
        await getDepartmentsList(code, departmentName, sectionName, nameAbbr, nameEn, newPage, rowsPerPage, sortName, sort, deleted)
    };
    const handleChangeRowsPerPage = async (v) => {
        setRowsPerPage(v.target.value);
        setPage(0);
        await getDepartmentsList(code, departmentName, sectionName, nameAbbr, nameEn, 0, v.target.value, sortName, sort, deleted)
    };
    const handleRefresh = async () => {
        await getDepartmentsList(code, departmentName, sectionName, nameAbbr, nameEn, page, rowsPerPage, sortName, sort, deleted)
    }
    const csvExport = () => {
        setOpenMaskFlag(true);
        const data = departmentCSVExport().then((res) => {
            if (res.data) {
                const link = document.createElement("a");
                var currentDate = new Date();
                currentDate = moment(currentDate).format('YYYYMMDDHHmmss');
                var fileName = "部門コード表_" + currentDate + ".csv"
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
        }).catch((error) => {
            console.log(error);
            if (error.message === 'Network Error') {
                setWarningMessage(<p>ネットワークに問題があります。<br/>接続を確認してください。</p>);
                setShowWarningPopup(true);
            } else if (error.response && error.response.status === 500) {
                setWarningMessage(<p>サーバ内部エラーが発生しています。</p>);
                setShowWarningPopup(true);
            }
        }).finally(() => {
            setOpenMaskFlag(false);
        });
    }
    const exportCSV = () => {
        setOpenMaskFlag(true);
        const data = departmentImportHistoryCSVExport().then((res) => {
            if (res.data) {
                const link = document.createElement("a");
                var currentDate = new Date();
                currentDate = moment(currentDate).format('YYYYMMDDHHmmss');
                var fileName = "部門コード表インポート履歴_" + currentDate + ".csv";
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
        }).catch((error) => {
            console.log(error);
            if (error.message === 'Network Error') {
                setWarningMessage(<p>ネットワークに問題があります。<br/>接続を確認してください。</p>);
                setShowWarningPopup(true);
            } else if (error.response && error.response.status === 500) {
                setWarningMessage(<p>サーバ内部エラーが発生しています。</p>);
                setShowWarningPopup(true);
            }
        }).finally(() => {
            setOpenMaskFlag(false);
        });
    }
    const handleRemove = async () => {
        const data = {
            userName: mstDBUserName
        }
        deleteDepartment(deleteItem.id, data).catch((error) => {
            console.log(error);
        }).finally(async () => {
            await getDepartmentsList(code, departmentName, sectionName, nameAbbr, nameEn, page, rowsPerPage, sortName, sort, deleted);
        });
        setDeleteItem(null);
        setIsShowRemoveToArchiveDialog(false);
    }

    return (
        <>
            <h3 className="mb-32" id="departments_registration">
                {t("departments.departments_registration")}
            </h3>
            <div className="cmn-bg-box pb-3">
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
                                <p className={classes.dateLabel}>部</p>
                                <div className={classes.dateWrapContent}>
                                    <input
                                        type='text'
                                        defaultValue={departmentName}
                                        value={departmentName}
                                        className={classes.input}
                                        onChange={async (e) => {
                                            setDepartmentName(e.target.value)
                                            setPage(0)
                                            await getDepartmentsList(code, e.target.value, sectionName, nameAbbr, nameEn, 0, rowsPerPage, sortName, sort, deleted);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={classes.dateToWrap}>
                                <p className={classes.dateLabel}>課</p>
                                <div className={classes.dateWrapContent}>
                                    <input
                                        type='text'
                                        defaultValue={sectionName}
                                        value={sectionName}
                                        className={classes.input}
                                        onChange={async (e) => {
                                            setSectionName(e.target.value)
                                            setPage(0)
                                            await getDepartmentsList(code, departmentName, e.target.value, nameAbbr, nameEn, 0, rowsPerPage, sortName, sort, deleted);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={classes.dateToWrap}>
                                <p className={classes.dateLabel}>略語</p>
                                <div className={classes.dateWrapContent}>
                                    <input
                                        type='text'
                                        defaultValue={nameAbbr}
                                        value={nameAbbr}
                                        className={classes.input}
                                        onChange={async (e) => {
                                            setNameAbbr(e.target.value)
                                            setPage(0)
                                            await getDepartmentsList(code, departmentName, sectionName, e.target.value, nameEn, 0, rowsPerPage, sortName, sort, deleted);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={classes.dateToWrap}>
                                <p className={classes.dateLabel}>コード</p>
                                <div className={classes.dateWrapContent}>
                                    <input
                                        type='text'
                                        defaultValue={code}
                                        value={code}
                                        className={classes.input}
                                        onChange={async (e) => {
                                            if (/^[0-9]*$/.test(e.target.value)) {
                                                setCode(e.target.value);
                                                setPage(0)
                                                await getDepartmentsList(e.target.value, departmentName, sectionName, nameAbbr, nameEn, 0, rowsPerPage, sortName, sort, deleted);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={classes.dateToWrap}>
                                <p className={classes.dateLabel}>英文名</p>
                                <div className={classes.dateWrapContent}>
                                    <input
                                        type='text'
                                        defaultValue={nameEn}
                                        value={nameEn}
                                        className={classes.input}
                                        onChange={async (e) => {
                                            setNameEn(e.target.value)
                                            setPage(0)
                                            await getDepartmentsList(code, departmentName, sectionName, nameAbbr, e.target.value, 0, rowsPerPage, sortName, sort, deleted);
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
                                        checked={sortName === "created"}
                                        value="created"
                                        control={<Radio/>}
                                        label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>ID</span>}
                                        onClick={() => {
                                            setPage(0)
                                            setSortName('created')
                                        }}
                                    />
                                    <FormControlLabel
                                        style={{marginLeft: '5px'}}
                                        checked={sortName === "departmentName"}
                                        value="departmentName"
                                        control={<Radio/>}
                                        label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>部</span>}
                                        onClick={() => {
                                            setPage(0)
                                            setSortName('departmentName')
                                        }}
                                    />
                                    <FormControlLabel
                                        style={{marginLeft: '5px'}}
                                        checked={sortName === "sectionName"}
                                        value="sectionName"
                                        control={<Radio/>}
                                        label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>課</span>}
                                        onClick={() => {
                                            setPage(0)
                                            setSortName('sectionName')
                                        }}
                                    />
                                    <FormControlLabel
                                        style={{marginLeft: '5px'}}
                                        checked={sortName === "code"}
                                        value="code"
                                        control={<Radio/>}
                                        label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>コード</span>}
                                        onClick={() => {
                                            setPage(0)
                                            setSortName('code')
                                        }}
                                    />
                                    <FormControlLabel
                                        style={{marginLeft: '5px'}}
                                        checked={sortName === "lastUpdatedBy"}
                                        value="lastUpdatedBy"
                                        control={<Radio/>}
                                        label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>最終更新日時</span>}
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
                                    className={`${classes.tableTh} ${classes.tableWidth4}`}>
                                    ID
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth14}`}>
                                    部
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth18}`}>
                                    課
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth6}`}>
                                    略語
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth7}`}>
                                    コード
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth22}`}>
                                    英文名
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth12}`}>
                                    最終更新者
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth12}`}>
                                    最終更新日時
                                </th>
                                <th
                                    className={`${classes.tableTh} ${classes.tableWidth5}`}>
                                </th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                    <div className={classes.bodyTableWrap}>
                    <table className={classes.bodyTable}>
                            {departmentsList.map((row, index) => (
                                <tr key={index} className={classes.tableTr}>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth4}`}>{row.id}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth14}`}>{row.departmentName}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth18}`}>{row.sectionName}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth6}`}>{row.nameAbbr}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth7}`}>{row.code}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth22}`}>{row.nameEn}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth12}`}>{row.updatedBy}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth12}`}>{row.updatedAt}</td>
                                    <td className={`${classes.tableTd} ${row.isDeleted ? classes.tableTdDelete : ""} ${classes.tableWidth5} ${classes.tableWhiteSpace}`}>
                                        {row.isDeleted ? null : (
                                            <>
                                                <button
                                                    className={`no-btn bg-transparent p-0 ${classes.tableTdButton}`}
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
                                                            setShowDepartmentEditPageDialog(true);
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
                                        setShowDepartmentEditPageDialog(true);
                                    }}
                                >追加</button>
                            </div>
                            <div>
                                <button
                                    className={`${classes.evaluation_btn} mr-auto`}
                                    onClick={csvExport}
                                >
                                    <span>
                                        <DownloadIcon/>
                                    </span>
                                    <span>CSVダウンロード</span>
                                </button>
                            </div>
                            <div>
                                <button
                                    className={`${classes.evaluation_btn} mr-auto`}
                                    onClick={e => setShowUploadDiag(true)}
                                >
                                    <span>
                                        <UploadIcon/>
                                    </span>
                                    <span>CSVインポート</span>
                                </button>
                            </div>
                            <div>
                                <button
                                    className={`${classes.evaluation_btn} mr-auto`}
                                    onClick={exportCSV}
                                >
                                    <span>
                                        <DownloadIcon/>
                                    </span>
                                    <span>履歴ダウンロード</span>
                                </button>
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
            </div>
            <LoadingMask val={openMaskFlag}/>
            <CSVUploadDiag
                open={isShowUploadDiag}
                setOpen={setShowUploadDiag}
                handleRefresh={handleRefresh}
            />
            <WarningPopup
                open={isShowWarningPopup}
                setOpen={setShowWarningPopup}
                warningMessage={warningMessage}
            />
            {
                isShowDepartmentEditPageDialog &&
                <DepartmentEditDialog
                    title={editPageDialogMode === "add" ? "組織情報追加" : "組織情報編集"}
                    open={isShowDepartmentEditPageDialog}
                    setOpen={setShowDepartmentEditPageDialog}
                    item={editItem}
                    handleRefresh={handleRefresh}
                />
            }
            <ConfirmDialog
                title={(<p>削除した組織コードを復元することはできません。<br/>削除を中止する場合には「いいえ」を押下してください。</p>)}
                open={isShowRemoveToArchiveDialog}
                setOpen={setIsShowRemoveToArchiveDialog}
                confirmSaveProcess={handleRemove}
            />
        </>
    );
};

export default DepartmentsPage;
