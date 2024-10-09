import React, {useEffect, useRef, useState} from "react";
import {browserRedirect, setLocationState} from "../../../utils/util";
import styles from './styles.module.css';
import './style.css';
import {getLessonCategories, getDeptCodeDepartment, getDeptCodeHistory} from "../../../request/backendApi/api";
import {Input} from "reactstrap";
import store from "../../../storage";
import ICoreFrame from "../../../constituents/ICoreFrame";
import ThemeFilter from '../../../constituents/IThemeFilter';
import LoadingText from "../../../constituents/ILoadingText";
import ErrorIcon from '../../../property/images/msg_error_icon.svg';
import {Link} from "react-router-dom";
import {UPDATE_SIDEBAR_ACTIVE_NAME} from "../../../storage/consts";
import {Pagination} from "react-pagination-bar"
import 'react-pagination-bar/dist/index.css'

/**
 * @function CustomFunctionTable-byGrid
 * @author Jmx
 * @returns
 */
const AfMemberStory = () => {

    // table ref (grid)
    const gridTableRef = useRef(null);
    // core url type[agentHistory] specialAS[permission]
    const getLessonCategoriesUrl = "/lessons/category?type=employeeHistory&specialAS=" + store.getState().user_special_as;
    // current_table:table_frame
    const [c_tableHeader1, setCtableHeader1] = useState([]);
    const [c_tableHeader2, setCtableHeader2] = useState([]);
    // current_table:table_data
    const [c_tablePersonaResult, setTablePersonaResult] = useState([]);
    //loading
    const [showLoading, setShowLoading] = useState(false);
    // input
    const [departmentNumber, setDepartmentNumber] = useState('');
    // department
    const [department, setDepartement] = useState({});
    const [showDepartmentError, setShowDepartmentError] = useState(false);

    // select 1/2
    const [selections, setSelections] = useState([]);
    const [c_select1, setSelect1] = useState([]);
    const [c_select1_v, setSelect1V] = useState('');
    const [c_select2, setSelect2] = useState([]);
    const [c_select2_v, setSelect2V] = useState('');

    // searchFlg
    const [searchFlg, setSearchFlg] = useState(true);
    const [searchingDeptCode, setSearchingDeptCode] = useState('');
    // initFlag :The selection function can only be used after searching!!
    const [initFlag, setInitFlag] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalDataNumber, setTotalDataNumber] = useState(0);
    const [isSearchFlag, setisSearchFlag] = useState(false);

    useEffect(() => {
        pageNumberChange();
    }, [currentPage])

    useEffect(() => {
        if (searchingDeptCode) {
            let pageNumber = 1;
            setOnSearchData(pageNumber);
        }
    }, [searchingDeptCode])

    const pageNumberChange = async () => {
        setShowLoading(true);
        let res = await createTableData(currentPage, c_select1_v, c_select2_v);
        if (res) {
            setShowLoading(false);
        }
    }

    const searchDepartment = async (deptCode) => {
        let {data} = await getDeptCodeDepartment(deptCode);
        if (data.errorCode == "400") {
            setShowDepartmentError(true);
        } else {
            setDepartement(data);
            setSearchFlg(true);
        }

    }

    const onSelectCallback = async (v1, v2) => {
        setShowLoading(true);
        let {data} = await getLessonCategories(getLessonCategoriesUrl + '&departmentCode=' + departmentNumber);
        createTableHeader(data, v1, v2);
        let bool = await createTableData(currentPage, v1, v2);
        if (bool) {
            setShowLoading(false);
        }
    }

    const onSearchC = (pageNumber) => {
        setShowLoading(true);
        setisSearchFlag(false);
        if (departmentNumber) {
            setSearchingDeptCode(departmentNumber);
            // Keep the effect consistent
            setTimeout(() => {
                setShowLoading(false);
            }, 1000);
        } else {
            setSearchingDeptCode('');
            setOnSearchData(pageNumber);
        }
    }

    const setOnSearchData = async (pageNumber) => {
        let {data} = await getLessonCategories(getLessonCategoriesUrl + '&departmentCode=' + departmentNumber);
        createTableHeader(data, '', '');
        createSelect(data);
        let res = await createTableData(pageNumber, '', '');
        if (data && res) {
            setShowLoading(false);
            setisSearchFlag(true);
        }
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
                    if (v1 === '' || scenarioItem.themeCode === v1) {
                        if (v2 === '' || scenarioItem.scenarioCode === v2) {
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
        // processing data to 部门1 氏2 3-5,6-9 ...
        let row1GridColumn = [3];
        let row2GridColumn = [3];
        for (let i = 0; i < tableHeader2.length - 1; i++) {
            let current = tableHeader2[i];
            let next = tableHeader2[i + 1];
            if (current["scenario"] != next["scenario"] || (current["theme"] != next["theme"] && current["scenario"] == next["scenario"])) {
                // why 3? css= 1 / i = i +1 / 氏 = 1
                row1GridColumn.push(i + 4);
            }
            row2GridColumn.push(i + 4);
        }
        row1GridColumn.push(tableHeader2.length + 3);
        row2GridColumn.push(tableHeader2.length + 3);
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

    const createTableData = async (pageNumber, theme, scenario) => {
        let res;
        if (departmentNumber.length === 0 || (departmentNumber.length !== 0 && showDepartmentError) || departmentNumber.length !== 0 && !showDepartmentError && !searchingDeptCode) {
            res = await getDeptCodeHistory(`/free/history?pageSize=100&page=${pageNumber}&theme=${theme}&scenario=${scenario}`);
        }
        if (departmentNumber.length !== 0 && !showDepartmentError && searchingDeptCode) {
            res = await getDeptCodeHistory(`/free/history?pageSize=100&page=${pageNumber}&deptCode=${departmentNumber}&theme=${theme}&scenario=${scenario}`);
        }
        let {data} = res;
        if (data) {
            setTotalDataNumber(data.pagination.totalData);
            setTablePersonaResult(data.personaResult);
        }
        return true;
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

    const shiftText = (status) => {
        if (status) {
            if (status.trim() == "FINISHED") {
                return "受講完了";
            }
            if (status.trim() == "PROCESSING") {
                return "受講中";
            }
            if (status.trim() == "NOT_START") {
                return "未実施";
            }
        }
    };

    //for store sidebar active when navigation
    const storeActiveSidebarName = () => {
        store.dispatch({type: UPDATE_SIDEBAR_ACTIVE_NAME, sidebar_active_name: 'manage'})
    }

    const shiftColor = (status) => {
        if (status == "FINISHED") {
            return styles.complete;
        }
        if (status == "PROCESSING") {
            return styles.processing;
        }
        if (status == "NOT_START") {
            return styles.not_start;
        }
    };

    const setGridColumnWidth = () => {
        if (browserRedirect() === 1) {
            return `180px 180px repeat(${c_tableHeader2.length}, 1fr)`;
        } else if (browserRedirect() === 2) {
            return `81px 81px repeat(${c_tableHeader2.length}, 1fr)`;
        } else if (browserRedirect() === 3) {
            return `100px 100px repeat(${c_tableHeader2.length}, 1fr)`;
        }
    }

    return (
        <ICoreFrame
            component={
                <div
                    className={browserRedirect() === 2 ? styles.mobile_view : browserRedirect() === 3 ? styles.tablet_view : styles.pc_view}>
                    {showLoading && <LoadingText text="読み込み中....."/>}
                    <div
                        className={`${browserRedirect() === 3 ? styles.afmember_title_tablet : styles.afmember_title}`}>
                        <div>
                            <h3
                                id="manager_screen"
                                name="manager_screen"
                                className={`mb-32 pb-2 text-lg-left text-center`}
                            >
                                社員の履歴
                            </h3>
                        </div>
                    </div>
                    <div
                        style={{paddingLeft: browserRedirect() === 2 ? '10px' : browserRedirect() === 3 ? '24px' : null}}>
                        <label className={styles.input_title_department}>部門コード</label>
                        <div className={styles.div_row}>
                            <Input
                                placeholder={"部門コードを入力"}
                                className={browserRedirect() === 1 ? styles.input_department : styles.input_department_mobile_tablet}
                                maxLength={5}
                                value={departmentNumber}
                                type="text"
                                onChange={(v) => {
                                    setShowDepartmentError(false);
                                    if (/^[0-9]*$/.test(v.target.value)) {
                                        setDepartmentNumber(v.target.value);
                                        if (v.target.value.length === 5) {
                                            searchDepartment(v.target.value);
                                        } else {
                                            setDepartement({});
                                            if (v.target.value.length === 0) {
                                                setSearchFlg(true);
                                            } else {
                                                setSearchFlg(false);
                                            }
                                        }
                                    }
                                }}
                                onBlur={(v) => {
                                    if (v.target.value.length > 0 && v.target.value.length < 5) {
                                        setShowDepartmentError(true);
                                    }
                                }}
                            />
                            {showDepartmentError &&
                                <img src={ErrorIcon} alt="error icon" className={styles.input_department_error_icon}/>
                            }
                            <label
                                className={styles.input_department_tip}>{department.departmentName} {department.sectionName}</label>
                        </div>
                        {
                            showDepartmentError ? <label
                                className={styles.input_department_error}>該当の部門コードはありません</label> : null
                        }
                        <button
                            disabled={!searchFlg}
                            className={`${styles.on_search} ${browserRedirect() === 2 ? styles.on_search_mobile : null}`}
                            onClick={() => {
                                onSearchC(1);
                                setCurrentPage(1);
                            }}>検索
                        </button>
                    </div>
                    {
                        c_tableHeader2.length > 0 ?
                            <div className={styles.display_area}>
                                <label className={styles.table_title}>ユーザー 一覧</label>
                                <div className={browserRedirect() === 2 ? styles.div_row_mobile_view : styles.div_row}>
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
                                        width: `${browserRedirect() === 1 ? c_tableHeader2.length * 250 : browserRedirect() === 2 ? (c_tableHeader2.length < 3 ? 380 : c_tableHeader2.length * 220) : c_tableHeader2.length * 210}px`,
                                        minWidth: `89.5vw`
                                    }}>
                                        <div key={"00"} className={`${styles.col_4} ${styles.left0top0} ${styles.row2}`}
                                             style={{zIndex: 3, padding: '7px'}}>部門名 (略語)
                                        </div>
                                        <div key={"01"}
                                             className={`${styles.col_4} ${browserRedirect() === 1 ? styles.left180top0 : browserRedirect() === 3 ? styles.left100top0 : styles.left81top0} ${styles.row2}`}
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
                                            return <div key={`c_tableHeader2_${idx}`}
                                                        className={`${styles.col_4} ${styles.top1}`}
                                                        style={{gridColumn: `${data.gridColumn}`, zIndex: 2}}
                                            >
                                                {`${data.persona}`}
                                            </div>
                                        })}
                                        {new Array((c_tableHeader2.length + 1) * c_tablePersonaResult.length).fill(0).map((data, idx) => {
                                            if (idx % (1 + c_tableHeader2.length) === 0) {
                                                let ele = c_tablePersonaResult[idx / (1 + c_tableHeader2.length)];
                                                return <React.Fragment key={idx}>
                                                    <div key={`${idx}_deptNameAbbr`}
                                                         className={`${styles.col_4} ${styles.left0top0} ${styles.long_text}`}>{ele?.deptNameAbbr}</div>
                                                    <div key={`${idx}_userName`}
                                                         className={`${styles.col_4} ${styles.long_text} ${browserRedirect() === 1 ? styles.left180top0 : browserRedirect() === 3 ? styles.left100top0 : styles.left81top0} `}>
                                                        <Link
                                                            to={{
                                                                pathname: `/history-check-detail/${ele?.userId}`,
                                                            }}
                                                            className={styles.link_txt}
                                                            onClick={() => {
                                                                storeActiveSidebarName();
                                                                setLocationState({
                                                                    userId: ele?.userId,
                                                                    userName: ele?.userName,
                                                                    selectThemeCode: c_select1_v === '' ? null : c_select1_v,
                                                                    selectScenarioCode: c_select2_v === '' ? null : c_select2_v,
                                                                }, `history-check-detail/${ele?.userId}`)
                                                            }}
                                                        >
                                                            {ele?.userName}
                                                        </Link>
                                                    </div>
                                                </React.Fragment>
                                            } else {
                                                let row = Math.floor((idx / (1 + c_tableHeader2.length)));
                                                let column = idx % (1 + c_tableHeader2.length) - 1;
                                                let personaStatus = c_tablePersonaResult[row]?.personaResult[column]?.personaStatus;
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
                                <div className={styles.pagination_component}>
                                    {
                                        isSearchFlag ?
                                            browserRedirect() === 2 ?
                                                <Pagination
                                                    initialPage={currentPage}
                                                    startLabel={"最初"}
                                                    endLabel={"最後"}
                                                    prevLabel={"前へ"}
                                                    nextLabel={"次へ"}
                                                    itemsPerPage={100}
                                                    totalItems={totalDataNumber}
                                                    pageNeighbours={0}
                                                    onPageСhange={(pageNumber) => {
                                                        setCurrentPage(pageNumber);

                                                    }}
                                                /> :
                                                <Pagination
                                                    initialPage={currentPage}
                                                    startLabel={"最初のページ"}
                                                    endLabel={"最後のページ"}
                                                    prevLabel={"前へ"}
                                                    nextLabel={"次へ"}
                                                    itemsPerPage={100}
                                                    totalItems={totalDataNumber}
                                                    pageNeighbours={2}
                                                    onPageСhange={(pageNumber) => {
                                                        setCurrentPage(pageNumber);

                                                    }}
                                                />
                                            :
                                            null
                                    }
                                </div>
                            </div>
                            :
                            null
                    }
                </div>
            }
        />
    );
};

export default AfMemberStory;