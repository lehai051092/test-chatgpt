import React, {useEffect, useRef, useState} from "react";
import {browserRedirect, setLocationState} from "../../../utils/util";
import styles from './styles.module.css';
import {getLessonCategories, getHistoryList} from "../../../request/backendApi/api";
import {Input} from "reactstrap";
import store from "../../../storage";
import ICoreFrame from "../../../constituents/ICoreFrame";
import {getAgentInfo, getBranchInfo} from "../../../request/masterDBApi/feignApi";
import ThemeFilter from '../../../constituents/IThemeFilter';
import LoadingText from "../../../constituents/ILoadingText";
import ErrorIcon from '../../../property/images/msg_error_icon.svg';
import {Link} from "react-router-dom";
import {UPDATE_SIDEBAR_ACTIVE_NAME} from "../../../storage/consts";

/**
 * @function CustomFunctionTable-byGrid
 * @author Jmx
 * @returns
 */
const HistoryListPage = () => {

    // table ref (grid)
    const gridTableRef = useRef(null);
    // core url type[agentHistory] specialAS[permission]
    const getLessonCategoriesUrl = "/lessons/category?type=agentHistory&specialAS=" + store.getState().user_special_as;
    const getHistoryDataUrl = "/history?specialAS=" + store.getState().user_special_as;

    // current_table:table_frame
    const [c_tableHeader1, setCtableHeader1] = useState([]);
    const [c_tableHeader2, setCtableHeader2] = useState([]);
    // current_table:table_data
    const [c_tablePersonaResult, setTablePersonaResult] = useState([]);
    //loading
    const [showLoading, setShowLoading] = useState(false);
    // input
    const [agencyNumber, setAgencyNumber] = useState('');
    const [agencyNumberDisable, setAgencyNumberDisable] = useState(false);

    const [subAgencyNumber, setSubAgencyNumber] = useState('');
    // agency
    const [agency, setAgency] = useState({});
    const [showAgencyError, setShowAgencyError] = useState(false);
    // branch
    const [branch, setBranch] = useState({});
    const [showBranchError, setShowBranchError] = useState(false);
    // select 1/2
    const [selections, setSelections] = useState([]);
    const [c_select1, setSelect1] = useState([]);
    const [c_select1_v, setSelect1V] = useState('');
    const [c_select2, setSelect2] = useState([]);
    const [c_select2_v, setSelect2V] = useState('');

    // searchFlg
    const [searchFlg, setSearchFlg] = useState(false);
    // initFlag :The selection function can only be used after searching!!
    const [initFlag, setInitFlag] = useState(false);

    useEffect(() => {
        if (store.getState().login_task_all?.userRoles[0] == "EVALUATOR") {
            let v = store.getState().login_task_all?.agentCode?.value;
            setAgencyNumberDisable(true);
            setAgencyNumber(v.substring(0, 7));
            searchAgency(v.substring(0, 7));
        }
    }, [])

    const onSelectCallback = async (v1, v2) => {
        setShowLoading(true);
        let {data} = await getLessonCategories(getLessonCategoriesUrl + '&companyCode=' + agencyNumber);
        if (data) {
            createTableHeader(data, v1, v2);
            createTableData(v1, v2);
        }
    }

    const onSearchC = async () => {
        setShowLoading(true);
        let {data} = await getLessonCategories(getLessonCategoriesUrl + '&companyCode=' + agencyNumber);
        if (data) {
            setShowLoading(false);
        }
        createTableHeader(data, '', '');
        createTableData('', '');
        createSelect(data)
    }

    const createTableHeader = async (data, v1, v2) => {
        let tableHeader1 = [];
        let tableHeader2 = [];
        for (let i = 0; i < data.length; i++) {
            let themItem = data[i];
            if (themItem?.scenario?.length > 0) {
                // get tableHeader1
                for (let j = 0; j < themItem.scenario.length; j++) {
                    let scenarioItem = themItem.scenario[j];
                    scenarioItem["themeName"] = themItem["themeName"];
                    scenarioItem["themeCode"] = themItem["themeCode"];
                    if (!v1 || v1 === '' || scenarioItem.themeCode === v1) {
                        if (!v2 || v2 === '' || scenarioItem.scenarioCode === v2) {
                            // row1
                            if (scenarioItem.lessonInfo.length) {
                                tableHeader1.push(scenarioItem);
                            }
                            // get tableHeader2
                            for (let k = 0; k < scenarioItem.lessonInfo.length; k++) {
                                let lessonInfoItem = scenarioItem.lessonInfo[k];
                                // row
                                tableHeader2.push(Object.assign(lessonInfoItem, scenarioItem));
                            }
                        }
                    }
                }
            }
        }
        // processing data to 氏1 2-4,5-8 ...
        let row1GridColumn = [2];
        let row2GridColumn = [2];
        for (let i = 0; i < tableHeader2.length - 1; i++) {
            let current = tableHeader2[i];
            let next = tableHeader2[i + 1];
            if (current["scenario"] != next["scenario"] || (current["theme"] != next["theme"] && current["scenario"] == next["scenario"])) {
                // why 3? css= 1 / i = i +1 / 氏 = 1
                row1GridColumn.push(i + 3);
            }
            row2GridColumn.push(i + 3);
        }
        row1GridColumn.push(tableHeader2.length + 2);
        row2GridColumn.push(tableHeader2.length + 2);
        // put row1GridColumn data into tableHeader1 data 
        for (let i = 0; i < tableHeader1.length; i++) {
            tableHeader1[i]["gridColumn"] = `${row1GridColumn[i]}/${row1GridColumn[i + 1]}`
        }
        // header 2
        for (let i = 0; i < tableHeader2.length; i++) {
            tableHeader2[i]["gridColumn"] = `${row2GridColumn[i]}/${row2GridColumn[i + 1]}`
        }
        if (!initFlag) {
            setSelections(tableHeader1);
            setInitFlag(true);
        }
        setCtableHeader1(tableHeader1);
        setCtableHeader2(tableHeader2);
    }

    const createTableData = async (theme, scenario) => {
        let searchStr = agencyNumber + subAgencyNumber;
        let {data} = await getHistoryList(getHistoryDataUrl, searchStr, theme, scenario);
        setTablePersonaResult(data.personaResult);
        setShowLoading(false);
    }

    const createSelect = (data) => {
        let select1 = [];
        for (let i = 0; i < data.length; i++) {
            let themItem = data[i];
            if (themItem?.scenario?.length > 0) {
                select1.push({'key': themItem.themeCode, 'text': themItem.themeName})
            }
        }
        setSelect1(select1);
        setSelect2([]);
    }

    const searchAgency = async (v) => {
        let agency_res = await getAgentInfo({agntCde: v});
        if (agency_res && agency_res.agntCde) {
            setAgency(agency_res);
            setSearchFlg(true);
        } else {
            setShowAgencyError(true);
        }
    }

    const searchBranch = async (v) => {
        let branch_res = await getBranchInfo({agntCde: agencyNumber, agstCde: v});
        if (branch_res && branch_res.agstCde) {
            setBranch(branch_res);
        } else {
            setShowBranchError(true);
        }
    }

    const shiftText = (status) => {
        if (status) {
            if (status.trim() == "FINISH") {
                return "受講完了";
            }
            if (status.trim() == "PROCESSING") {
                return "受講中";
            }
            if (status.trim() == "NOT_START") {
                return "未受講";
            }
        }
    };

    const setGridColumnWidth = () => {
        if (browserRedirect() === 1) {
            return `repeat(${1 + c_tableHeader2.length}, 1fr)`
        } else if (browserRedirect() === 2) {
            return `95px repeat(${c_tableHeader2.length}, 1fr)`
        } else if (browserRedirect() === 3) {
            if (c_tableHeader1.length === 1) {
                return `repeat(${1 + c_tableHeader2.length}, 1fr)`
            } else {
                return `105px repeat(${c_tableHeader2.length}, 1fr)`
            }
        }
    }

    const gridRowWrapWidth = () => {
        if (browserRedirect() === 1) {
            return c_tableHeader2.length * 240 + 'px';
        } else if (browserRedirect() === 2) {
            if (c_tableHeader2.length < 3) {
                return '300px';
            } else {
                return c_tableHeader2.length * 220 + 'px';
            }
        } else if (browserRedirect() === 3) {
            return c_tableHeader2.length * 200 + 'px';
        }
    }

    //for store sidebar active when navigation
    const storeActiveSidebarName = () => {
        store.dispatch({type: UPDATE_SIDEBAR_ACTIVE_NAME, sidebar_active_name: 'manage'})
    }

    const shiftColor = (status) => {
        if (status == "FINISH") {
            return styles.complete;
        }
        if (status == "PROCESSING") {
            return styles.processing;
        }
        if (status == "NOT_START") {
            return styles.not_start;
        }
    };

    return (
        <ICoreFrame
            component={
                <>
                    {showLoading && <LoadingText text="読み込み中....."/>}
                    <div
                        className={browserRedirect() === 2 ? styles.mobile_view : browserRedirect() === 3 ? styles.tablet_view : styles.pc_view}>
                        <div
                            className={`${browserRedirect() === 3 ? styles.historycheck_title_tablet : styles.historycheck_title}`}>
                            <div>
                                <h3
                                    id="manager_screen"
                                    name="manager_screen"
                                    className={`mb-32 pb-2 text-lg-left text-center`}
                                >
                                    管理者画面
                                </h3>
                            </div>
                        </div>
                        <div
                            className={browserRedirect() === 2 ? styles.historycheck_search_box_mobile : browserRedirect() === 3 ? styles.historycheck_search_box_tablet : null}>
                            <label className={styles.input_title_agency}>代理店コード(7桁)</label>
                            <div className={styles.div_row}>
                                <Input
                                    placeholder={"代理店コードを入力"}
                                    className={browserRedirect() === 1 ? styles.input_agency : styles.input_agency_tablet_mobile}
                                    maxLength={7}
                                    disabled={agencyNumberDisable}
                                    value={agencyNumber}
                                    type="text"
                                    onChange={(v) => {
                                        setShowAgencyError(false);
                                        if (/^[0-9]*$/.test(v.target.value)) {
                                            setAgencyNumber(v.target.value);
                                            if (v.target.value.length === 7) {
                                                searchAgency(v.target.value);
                                            } else {
                                                setAgency({});
                                                setSearchFlg(false);
                                            }
                                        }
                                    }}
                                    onBlur={(v) => {
                                        if (v.target.value.length > 0 && v.target.value.length < 7) {
                                            setShowAgencyError(true);
                                        }
                                    }}
                                />
                                {showAgencyError &&
                                    <img src={ErrorIcon} alt="error icon" className={styles.input_agency_error_icon}/>
                                }
                                <label className={styles.input_agency_tip}>{agency.agntNmeK}</label>
                            </div>
                            {
                                showAgencyError ? <label
                                    className={styles.input_agency_error}>該当の代理店コードはありません</label> : null
                            }
                            <div className={`${styles.div_row} ${styles.div_margin}`}>
                                <label className={styles.input_title_agency}>出先コード(3桁)</label>
                                <label
                                    className={styles.input_branch_subtitle}>出先単位で確認したい場合は出先コードを入力してください</label>
                            </div>
                            <div className={`${styles.div_row}`}>
                                <Input
                                    disabled={agencyNumber.length != 7 || !agency.agntNmeK}
                                    style={agencyNumber.length != 7 ? {cursor: 'not-allowed'} : null}
                                    className={browserRedirect() === 1 ? styles.input_agency : styles.input_agency_tablet_mobile}
                                    placeholder={"出先コードを入力"}
                                    value={subAgencyNumber}
                                    type="text"
                                    maxLength={3}
                                    onChange={(v) => {
                                        setShowBranchError(false);
                                        if (/^[0-9]*$/.test(v.target.value)) {
                                            setSubAgencyNumber(v.target.value);
                                            if (v.target.value.length === 3) {
                                                searchBranch(v.target.value);
                                            } else {
                                                setBranch({});
                                            }
                                        }
                                    }}
                                    onBlur={(v) => {
                                        if (v.target.value.length > 0 && v.target.value.length < 3) {
                                            setShowBranchError(true);
                                        }
                                    }}
                                />
                                {showBranchError &&
                                    <img src={ErrorIcon} alt="error icon" className={styles.input_agency_error_icon}/>
                                }
                                <label className={styles.input_agency_tip}>{branch.agstNmeK}</label>
                            </div>
                            {
                                showBranchError ? <label
                                    className={styles.input_agency_error}>該当の出先コードはありません</label> : null
                            }
                            <button
                                disabled={!searchFlg || showBranchError}
                                className={`${styles.on_search} ${browserRedirect() === 2 ? styles.on_search_mobile : null}`}
                                onClick={() => {
                                    onSearchC();
                                }}>検索
                            </button>
                        </div>
                        {
                            c_tableHeader2.length > 0 ?
                                <div className={styles.display_area}>
                                    <label className={styles.table_title}>ユーザー 一覧</label>
                                    <div className={`${browserRedirect() === 2 ? styles.div_row_mb : styles.div_row}`}>
                                        <div className={styles.div_column}>
                                            <label className={styles.table_select_title}>学習テーマ</label>
                                            <ThemeFilter allSelection={'全学習テーマ'} vSetThemes={c_select1}
                                                         f_getSelectedTheme={(v) => {
                                                             let select2 = [];
                                                             for (let index = 0; index < selections?.length; index++) {
                                                                 if (v === selections[index]?.themeCode) {
                                                                     select2.push({
                                                                         'key': selections[index]?.scenarioCode,
                                                                         'text': selections[index]?.scenarioName
                                                                     })
                                                                 }
                                                             }
                                                             setSelect1V(v);
                                                             setSelect2(select2);
                                                             setSelect2V('');
                                                             onSelectCallback(v, '');
                                                         }}/>
                                        </div>
                                        <div className={styles.div_column}>
                                            <label className={styles.table_select_title}>シナリオ</label>
                                            <ThemeFilter allSelection={'全シナリオ'} vSetThemes={c_select2}
                                                         f_getSelectedTheme={(v) => {
                                                             setSelect2V(v);
                                                             onSelectCallback(c_select1_v, v);
                                                         }}/>
                                        </div>
                                    </div>
                                    <div ref={gridTableRef} id="gridTableRef" className={styles.flex_table}
                                         style={c_tablePersonaResult.length * 50 > 1000 ? {height: `500px`} : null}>
                                        <div className={styles.row_wrap} style={{
                                            gridTemplateColumns: setGridColumnWidth(),
                                            width: gridRowWrapWidth(),
                                            minWidth: `89.5vw`
                                        }}>
                                            <div key={"00"}
                                                 className={`${styles.col_4} ${styles.left0top0} ${styles.row2}`}
                                                 style={{zIndex: 3}}>氏名
                                            </div>
                                            {c_tableHeader1.map((data, idx) => {
                                                return <div key={`c_tableHeader1_${idx}`}
                                                            className={`${styles.col_4} ${styles.top0}`} style={{
                                                    gridColumn: `${data.gridColumn}`,
                                                    zIndex: 2,
                                                    width: '100%'
                                                }}>
                                                    {`${data.scenarioName}(${data.themeName})`}
                                                </div>
                                            })}
                                            {c_tableHeader2.map((data, idx) => {
                                                return <div key={`c_tableHeader1_${idx}`}
                                                            className={`${styles.col_4} ${styles.top1}`}
                                                            style={{gridColumn: `${data.gridColumn}`, zIndex: 2}}
                                                >
                                                    {`${data.persona}`}
                                                </div>
                                            })}
                                            {new Array((c_tableHeader2.length + 1) * c_tablePersonaResult.length).fill(0).map((data, idx) => {
                                                if (idx % (1 + c_tableHeader2.length) === 0) {
                                                    let ele = c_tablePersonaResult[idx / (1 + c_tableHeader2.length)];
                                                    return <div key={idx} className={`${styles.col_4} ${styles.left0}`}>
                                                        <Link
                                                            to={{
                                                                pathname: `/history-check-detail/${ele?.userId}`,
                                                            }}
                                                            className={styles.link_txt}
                                                            onClick={() => {
                                                                storeActiveSidebarName();
                                                                setLocationState({
                                                                    userId: ele?.userId,
                                                                    isFreeStory: true,
                                                                    userName: ele?.userName,
                                                                    selectThemeCode: c_select1_v === '' ? null : c_select1_v,
                                                                    selectScenarioCode: c_select2_v === '' ? null : c_select2_v,
                                                                    agentCode: agencyNumber
                                                                }, `history-check-detail/${ele?.userId}`)
                                                            }}
                                                        >
                                                            {ele?.userName}
                                                        </Link>
                                                    </div>
                                                } else {
                                                    let row = Math.floor((idx / (1 + c_tableHeader2.length)));
                                                    let column = idx % (1 + c_tableHeader2.length) - 1;
                                                    let personaStatus = c_tablePersonaResult[row]?.userResult[column]?.personaStatus;
                                                    return <div
                                                        key={idx}
                                                        className={`
                                                                    ${styles.col_4} 
                                                                    ${shiftColor(personaStatus)}
                                                                `}
                                                    >
                                                        {shiftText(personaStatus)}
                                                    </div>
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                        }
                    </div>
                </>
            }
        />
    );
};

export default HistoryListPage; 