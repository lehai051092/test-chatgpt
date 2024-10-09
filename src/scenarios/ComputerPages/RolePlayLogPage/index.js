import {TablePagination, Typography} from "@material-ui/core";
import * as styles from "./styles.module.css"
import React, {useCallback, useEffect, useMemo, useState} from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import VectorDownIcon from './VectorDown.svg';
import DownloadIcon from '../../../property/icons/DownloadIcon.png';
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {getRolePlayLog, getRolePlayLogDetailExport, getRolePlayLogExport} from "../../../request/backendApi/api";
import moment from "moment/moment";
import encoding from "encoding-japanese";
import logger from "redux-logger";
import TablePaginationActions from "./TablePaginationActions";
import DatePicker from "./DatePicker";
import Radio from "../../../constituents/IRadioButtons";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import WarningPopup from "../RolePlaySetting/WarningPopup";
import LoadingMask from "../../../constituents/ILoadingMask";

const RolePlayLogPage = ({}) => {
  const today = moment();
  const firstDayOfMonth = today.startOf('month');
  const lastDayOfMonth = today.clone().endOf('month');
  const dateFormat = 'YYYY-MM-DD';
  const formattedFirstDay = firstDayOfMonth.format(dateFormat);
  const formattedLastDay = lastDayOfMonth.format(dateFormat);
  const [implementDateFrom, setSelImplementDateFrom] = useState(formattedFirstDay);
  const [implementDateTo, setSelImplementDateTo] = useState(formattedLastDay);
  const [expanded, setExpanded] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [rolePlayLog, setRolePlayLog] = useState([])
  const [rolePlayLogSummary, setRolePlayLogSummary] = useState({})
  const [inputToken, setInputToken] = useState()
  const [outputToken, setOutputToken] = useState()
  const [inputTokenPrice, setInputTokenPrice] = useState()
  const [outputTokenPrice, setOutputTokenPrice] = useState()
  const [sort, setSort] = useState('desc')
  const [sortName, setSortName] = useState('date')
  const masterSortItems = ['date', 'inputToken', 'outputToken', 'sumToken']
  const [checkedExportItems, setCheckedExportItems] = useState([])
  const [isWarningPopup, setIsWarningPopup] = useState(false)
  const [warningPopupMessage, setWarningPopupMessage] = useState('')
  const [dateErrorMessage, setDateErrorMessage] = useState('')
  const [openMaskFlag, setOpenMaskFlag] = React.useState(false)
  const checkedExportItemHandler = useCallback((item) => {
    return !!checkedExportItems.find((v) => v.recordStats.recordId === item.recordStats.recordId)
  }, [checkedExportItems]);
  useEffect(async () => {
    await getRolePlayLogs(implementDateFrom, implementDateTo, page, rowsPerPage, sortName, sort)
  }, [implementDateFrom, implementDateTo, sortName, sort])
  const getRolePlayLogs = useCallback(async (from, to, pg, rowsPg, sortNames, sortOrder) => {
    const fromObj = moment(from)
    const toObj = moment(to)
    const diff = toObj.diff(fromObj, 'months')
    if (diff >= 3)  {
      setDateErrorMessage('検索期間は3ヶ月未満にしてください')
      return
    }
    if (diff < 0)  {
      setDateErrorMessage('実施日(TO)は実施日(FROM)以降の日付けを設定してください')
      return
    }
    const res = await getRolePlayLog(from, to, pg, rowsPg, sortNames, sortOrder)
    setDateErrorMessage('')
    if (res.data && res.data.roleplayLogs) {
      setRolePlayLog(res.data.roleplayLogs)
    }
    if (res.data && res.data.pagination) {
      setTotalSize(res.data.pagination.total)
      setPage(res.data.pagination.page - 1)
      setRowsPerPage(res.data.pagination.pageSize)
    }
    if (res.data && res.data.summary) {
      setRolePlayLogSummary(res.data.summary)
      setInputToken(res.data.summary.promptToken)
      setOutputToken(res.data.summary.completionToken)
      setInputTokenPrice(res.data.summary.promptPrice)
      setOutputTokenPrice(res.data.summary.completionPrice)
    }
  }, [implementDateFrom, implementDateTo, page, rowsPerPage]);
  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    await getRolePlayLogs(implementDateFrom, implementDateTo, newPage, rowsPerPage, sortName, sort)
  };
  
  const handleChangeRowsPerPage = async (v) => {
    setRowsPerPage(v.target.value);
    setPage(0);
    await getRolePlayLogs(implementDateFrom, implementDateTo, 0, v.target.value, sortName, sort)
  };
  
  const exportHandler = useCallback(() => {
    setOpenMaskFlag(true)
    const data = getRolePlayLogExport(implementDateFrom, implementDateTo, inputTokenPrice, outputTokenPrice).then((res) => {
      if (res.data) {
        const link = document.createElement("a");
        var currentDate = new Date();
        currentDate = moment(currentDate).format('YYYYMMDDHHmm');
        var fileName = "GPTログ_" + currentDate + ".csv"
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
      setOpenMaskFlag(false)
    });
  }, [implementDateFrom, implementDateTo, inputTokenPrice, outputTokenPrice]);
  
  
  const exportDetailHandler = useCallback(() => {
    setOpenMaskFlag(true)
    const data = getRolePlayLogDetailExport(checkedExportItems).then((res) => {
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel' })
      );
      var currentDate = new Date();
      currentDate = moment(currentDate).format('YYYYMMDDHHmm');
      let filename = 'GPTログ詳細_' + currentDate + '.xlsx'
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).finally(() => {
      setOpenMaskFlag(false)
    });
  }, [checkedExportItems]);
  
  const [fromPickerOpen, setFromPickerOpen] = useState(false)
  const [toPickerOpen, setToPickerOpen] = useState(false)
  const formatDateToYYMMDD = (date) => {
    return date ? moment(date).format('YYYY-MM-DD') : ''
  }
  
  const totalAmount = useMemo(() => {
    const inputSum = Math.round(inputToken * inputTokenPrice / 1000 * 100) / 100
    const outputSum = Math.round(outputToken * outputTokenPrice / 1000 * 100) / 100
    const sum = inputSum + outputSum
    if (sum > 0) {
      return sum
    } else {
      return ''
    }
  }, [inputToken, inputTokenPrice, outputToken, outputTokenPrice]);
  
  return <div className={styles.root}>
    <Accordion
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
      }}
    >
      <AccordionSummary
        expandIcon={<img alt={'VectorDownIcon'} src={VectorDownIcon}/>}
        aria-controls="panel2a-content"
        id="panel2a-header"
        className={styles.accordionSummary}
      >
        <Typography
          className={styles.heading}>{expanded ? '検索条件を閉じる' : '検索条件を表示する'}</Typography>
      </AccordionSummary>
      <AccordionDetails className={styles.accordionDetails}>
        <div className={styles.accordionDetailsWrapFlex}>
          <div className={`${styles.dateWrap} `}>
            <p className={styles.dateLabel}>実施日(FROM)</p>
            <div className={styles.dateWrapContent}>
              <DatePicker
                type='date'
                style={fromPickerOpen ? styles.dateFieldSel : styles.dateField}
                setDate={(value) => {
                  setPage(0)
                  setSelImplementDateFrom(formatDateToYYMMDD(value));
                }}
                datePickerOpen={fromPickerOpen}
                setDatePickerOpen={setFromPickerOpen}
                defaultValue={implementDateFrom}
                selectDate={true}
              />
            </div>
          </div>
          <div className={styles.dateToWrap}>
            <p className={styles.dateLabel}>実施日(TO)</p>
            <div className={styles.dateWrapContent}>
              <DatePicker
                type='date'
                style={toPickerOpen ? styles.dateFieldSel : styles.dateField}
                setDate={(value) => {
                  setPage(0)
                  setSelImplementDateTo(formatDateToYYMMDD(value));
                }}
                datePickerOpen={toPickerOpen}
                setDatePickerOpen={setToPickerOpen}
                defaultValue={implementDateTo}
                selectDate={true}
              />
            </div>
          </div>
        </div>
        <div className={styles.dateErrorMessage}>
          {dateErrorMessage ? dateErrorMessage : ''}
        </div>
        <div className={styles.accordionDetailsOrders}>
          <p className={styles.dateLabel}>並び順</p>
          <div className={styles.accordionDetailsWrapFlexCheck}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                style={{paddingLeft: "10px"}}
                checked={sortName === "date"}
                value="date"
                control={<Radio/>}
                label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>実施日</span>}
                onClick={() => {
                  setPage(0)
                  setSortName('date')
                }}
              />
              <FormControlLabel
                style={{marginLeft: '5px'}}
                checked={sortName === "inputToken"}
                value="inputToken"
                control={<Radio/>}
                label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>入力</span>}
                onClick={() => {
                  setPage(0)
                  setSortName('inputToken')
                }}
              />
              <FormControlLabel
                style={{marginLeft: '5px'}}
                checked={sortName === "outputToken"}
                value="outputToken"
                control={<Radio/>}
                label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>出力</span>}
                onClick={() => {
                  setPage(0)
                  setSortName('outputToken')
                }}
              />
              <FormControlLabel
                style={{marginLeft: '5px'}}
                checked={sortName === "sumToken"}
                value="sumToken"
                control={<Radio/>}
                label={<span style={{paddingLeft: "10px", fontSize: '14px'}}>合計</span>}
                onClick={() => {
                  setPage(0)
                  setSortName('sumToken')
                }}
              />
            </RadioGroup>
            <p className={styles.verticalLine}/>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
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
            </RadioGroup>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
    <div className={styles.tableContainerWrap}>
      <table className={styles.tableContainerStyle}>
        <thead>
        <tr>
          <th
            colSpan={3}
            className={styles.tableThTop}
          ></th>
          <th
            colSpan={5}
            className={styles.tableThTop}>
            ロープレ
          </th>
          <th
            className={styles.tableThTop}
            colSpan={3}>
            消費トークン
          </th>
        </tr>
        <tr>
          <th
            className={styles.tableTh}>
            No
          </th>
          <th
            className={styles.tableTh}>
            実施日
          </th>
          <th
            className={styles.tableTh}>
            ユーザー名
          </th>
          <th
            className={styles.tableTh}>
            学習テーマ
          </th>
          <th
            className={styles.tableTh}>
            シナリオ
          </th>
          <th
            className={styles.tableTh}>
            ストーリー
          </th>
          <th
            className={styles.tableTh}>
            正答率
          </th>
          <th
            className={styles.tableTh}>
            ステータス
          </th>
          <th
            className={styles.tableTh}>
            入力
          </th>
          <th
            className={styles.tableTh}>
            出力
          </th>
          <th
            className={styles.tableTh}>
            合計
          </th>
        </tr>
        </thead>
      </table>
      <div className={styles.bodyTableWrap}>
        <table className={styles.bodyTable}>
          {rolePlayLog.map((row, index) => (
            <tr key={index} className={styles.tableTr}>
              <td
                className={`${styles.tableTd} ${styles.linkStyle}`}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedExportItemHandler(row)}
                      color={'primary'}
                      onChange={() => {
                        if (checkedExportItemHandler(row)) {
                          setCheckedExportItems(checkedExportItems.filter((item) => row.recordStats.recordId !== item.recordStats.recordId))
                        } else {
                          if (checkedExportItems.length === 10) {
                            setWarningPopupMessage('１０件以上は選択できません。')
                            setIsWarningPopup(true)
                          } else {
                            setCheckedExportItems((val) => [...val, row])
                          }
                        }
                      }}
                    />
                  }
                  label={row.no}
                />
              </td>
              <td className={styles.tableTd}>{row.date}</td>
              <td className={styles.tableTd}>{row.userName}</td>
              <td className={styles.tableTd}>{row.theme}</td>
              <td className={styles.tableTd}>{row.scenario}</td>
              <td className={styles.tableTd}>{row.story}</td>
              <td className={styles.tableTd}>{row.progressRate}</td>
              <td className={styles.tableTd}>{row.status}</td>
              <td className={styles.tableTd}>{row.inputToken?.toLocaleString()}</td>
              <td className={styles.tableTd}>{row.outputToken?.toLocaleString()}</td>
              <td className={styles.tableTd}>{row.totalToken?.toLocaleString()}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
    <table className={styles.tableContainerStyle2}>
      <tbody>
      <tr>
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
    <div className={styles.footer}>
      <div className={styles.footerItemWrap}>
        <div className={`mr-1 ${styles.footerItemButtons}`}>
          <div>
            <button className={`${styles.evaluation_btn} mr-auto`} onClick={exportHandler}>
                    <span>
                    <img src={DownloadIcon} alt="cross_icon" className=""/>
                    </span>
              <span>一覧</span>
            </button>
          </div>
          <div>
            <button
              className={`${styles.evaluation_btn} mr-auto`}
              onClick={exportDetailHandler}
              disabled={checkedExportItems.length === 0}
            >
                    <span>
                    <img src={DownloadIcon} alt="cross_icon" className=""/>
                    </span>
              <span>詳細</span>
            </button>
          </div>
        </div>
        
        <div>
          <div className={styles.footerTop}>
            <div className={styles.footerItem}>
              <span className={styles.chip}>
                入力トークン単価($)
              </span>
              <input
                type="number"
                step="0.001"
                value={inputTokenPrice}
                onChange={(e) => {
                  setInputTokenPrice(e.target.value)
                }}
                className={`cmn-bg-white-box rounded-lg ${styles.inputStyle}`}
                min={0}
              />
            </div>
            <div className={styles.footerItem}>
              <span className={styles.chip}>
                出力トークン単価($)
              </span>
              <input
                type="number"
                step="0.001"
                value={outputTokenPrice}
                onChange={(e) => {
                  setOutputTokenPrice(e.target.value)
                }}
                min={0}
                className={`cmn-bg-white-box rounded-lg ${styles.inputStyle}`}
              />
            </div>
          </div>
          <div className={styles.footerItemBottomWrap}>
            <div className={styles.footerItem}>
              <span className={styles.chip}>合計入力トークン</span>
              <p>{rolePlayLogSummary?.promptToken?.toLocaleString()}</p>
            </div>
            <div className={styles.footerItem}>
              <span className={styles.chip}>合計出力トークン</span>
              <p>{rolePlayLogSummary?.completionToken?.toLocaleString()}</p>
            </div>
            <div className={styles.footerItem}>
              <span className={styles.chip}>推定金額($)</span>
              <p>{totalAmount?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <WarningPopup
      open={isWarningPopup}
      warningMessage={warningPopupMessage}
      setOpen={setIsWarningPopup}
    />
    <LoadingMask val={openMaskFlag}/>
  </div>
}
export default RolePlayLogPage