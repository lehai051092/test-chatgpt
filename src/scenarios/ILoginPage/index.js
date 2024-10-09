import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import MainLogo from '../../property/images/logo.png';
import { GeneralDropdown } from '../../constituents/IDropdowns/GeneralDropdown';
import GeneralTextbox from '../../constituents/ITextboxes/GeneralTextbox';
import GeneralButton from '../../constituents/IButton/GeneralButton';
import ErrorMessage from '../../constituents/IErrorMessage';
import valid_con from '../../property/images/valid_icon.svg';
import styles from './styles.module.css';
import error_icon from '../../property/images/error_icon.png';
import store from '../../storage'
import { UPDATE_REQUEST_HEADER_GROUP_ID, UPDATE_REQUEST_HEADER_USER_ID, UPDATE_SELECTED_SCENARIO_NAME, UPDATE_SELECTED_THEME_NAME, UPDATE_SIDEBAR_ACTIVE_NAME, SELECTED_CUSTOMER_DATA } from '../../storage/consts'
import CheckBox from '@material-ui/core/Checkbox';

const LoginPage = ({ username, setSelectedUserName, agent_company, setSelectedAgentCompany, setSelectedEmployeeId, role, setSelectedRole, setSelectedUserId, recent_path, access_token, accessToken }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [user_id, setUserId] = useState();
    const [usernameRequire, setUserNameRequire] = useState(false);
    const [password, setPassword] = useState('I3ASEadministrator,I194161');
    const [message, setMessage] = useState('');
    const [selectSource, setSelectSource] = useState([
        {
            actionName: '3Q_公開設定なしの社内ユーザー_AA',
            actionCode: 'I3ASEadministrator,I194161'
        },
        {
            actionName: '3Q_公開設定ありの社内ユーザー_BB',
            actionCode: 'I3ASEadministrator,I103000'
        },
        {
            actionName: '3Q_公開設定ありの社内ユーザー_CC',
            actionCode: 'I3ASEadministrator,I103409'
        },
        {
            actionName: '3Q_公開設定なしの社外ユーザー_XX',
            actionCode: 'G11400753003,G2manag,G5ASEmanager,G607FTSHD000895'
        },
        {
            actionName: '3Q_公開設定ありの社外ユーザー_YY',
            actionCode: 'G12000002002,G2sales'
        },
        {
            actionName: '3Q_公開設定ありの社外ユーザー_ZZ',
            actionCode: 'G11905054001,G2sales,G5ASEmanager'
        },
        {
            actionName: 'GENERAL_USER',
            actionCode: 'G11234567001,G6P0000008'
        },
        {
            actionName: 'EVALUATOR',
            actionCode: 'G11234567001,G6P0000009,G5ASEmanager'
        },
        {
            actionName: 'ADMINISTRATOR',
            actionCode: 'I132603,I3NETB'
        },
        {
            actionName: 'I3ASEADMINISTRATOR',
            actionCode: 'I3ASEadministrator'
        },
        {
            actionName: 'SPECIAL_TRAINEE',
            actionCode: 'G19011910001,G6P1201221'
        },
        {
            actionName: 'SPECIAL_TRAINER',
            actionCode: 'G19011910001,G6P1201221,G5ASEmanager'
        },
        {
            actionName: 'G6_REMOVED_GENERAL_USER',
            actionCode: 'G19011910001,G29011910001'
        },
        {
            actionName: 'G6_REMOVED_EVALUATOR',
            actionCode: 'G19011910001,G5ASEmanager'
        },
    ])
    const [useDropDown, setUseDropDown] = useState(true);

    const onUserNameChange = (event) => {
        setUserId(event.target.value);
    }

    const onDropDownChange = (value) => {
        setPassword(value);
    }

    const onTextBoxChange = (value) => {
        setPassword(value?.target?.value)
    }

    const login = () => {
        console.log('login',user_id,password)
        store.dispatch({type: UPDATE_REQUEST_HEADER_USER_ID, userId: user_id})
        store.dispatch({type: UPDATE_REQUEST_HEADER_GROUP_ID, groupId: password})
        store.dispatch({type: UPDATE_SIDEBAR_ACTIVE_NAME, active_sidebar_name: ''})
        store.dispatch({type: UPDATE_SELECTED_THEME_NAME, selected_theme_name: ''})
        store.dispatch({type:  UPDATE_SELECTED_SCENARIO_NAME, selected_scenario_name: ''})
        store.dispatch({type:  SELECTED_CUSTOMER_DATA, selected_customer_data: []})
        history.push("/start-new-role-play")
    }

    const handleChange = ()=>{
        setUseDropDown(!useDropDown)

    }

    useEffect(()=>{
        sessionStorage.clear();
    },[])

    return (
        <div id={styles.login_page} className={`w-100 px-0 ${styles.main_content}`}>
            <div className={styles.login_page} >
                <div className={styles.center_container}>
                    <img src={MainLogo} className={styles.logo} />
                    <h1 className={`font-18 ${styles.title}`}>{t('login_page.title')}</h1>
                    <div className={styles.form_container}>
                        <h5 className={`font-16 ${styles.textbox_label}`}>{t('login_page.username.title')}</h5>
                        <GeneralTextbox
                            placeholder={t('login_page.username.placeholder')}
                            autoFocus={true}
                            className={`font-18 RobotoRegular username-box ${styles.text_box} ${(user_id != undefined && user_id.length > 0) ? styles.show_user : ''}  ${usernameRequire ? styles.border_danger : ''}`}
                            onChange={onUserNameChange}
                            id="userId"
                            icon={usernameRequire ? error_icon : valid_con}
                            // onKeyPress={handleKeyDown}
                        />
                        {usernameRequire && message === '' && <ErrorMessage message={t('login_page.username.require')} />}

                        <h5 className={`font-16 ${styles.textbox_label}`}>
                            {t('login_page.password.title')}
                            <CheckBox
                                checked={useDropDown}
                                onChange={handleChange}>
                            </CheckBox>
                        </h5>
                        {
                            useDropDown && <GeneralDropdown
                            items={selectSource}
                            onSelect={onDropDownChange}
                            className={`mb-3 font-weight-bold`}
                            selectedData={selectSource[0].actionCode}
                            dropdown_id="theme_dropdown"
                            >
                            </GeneralDropdown>
                        }
                        {
                            !useDropDown && <GeneralTextbox
                            inputtype={'text'}
                            placeholder={t('login_page.password.placeholder')}
                            onChange={onTextBoxChange}
                            id="password"
                            />
                        }
                        <GeneralButton
                            title={t('login_page.login button title')}
                            className={`font-16 text-white font-weight-bold ${styles.btn_login}`}
                            onClick={login}
                            id="login" />
                        <div>Current x-aanet-group is {password}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const stateToProps = state => {
    return {
        user_id: state.vAgent.user_id,
        username: state.vAgent.username,
        employee_id: state.vAgent.employee_id,
        role: state.vAgent.role,
        agent_company: state.vAgent.agent_company,
        recent_path: state.vAgent.recent_path,
        access_token: state.vAgent.access_token
    }
}

export default LoginPage;