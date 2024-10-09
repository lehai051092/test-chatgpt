import React, {useState} from "react";
import {browserRedirect,} from "../../../utils/util";
import styles from './styles.module.css';
import './style.css';
import { sendChatGPT } from "../../../request/backendApi/api";
import {Input} from "reactstrap";
import ICoreFrame from "../../../constituents/ICoreFrame";
import LoadingText from "../../../constituents/ILoadingText";
import 'react-pagination-bar/dist/index.css'

/**
 * @function CustomFunctionTable-byGrid
 * @author Jmx
 * @returns
 */
const ChatGPTAPITester = () => {

    //loading
    const [showLoading, setShowLoading] = useState(false);
    // input
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const onSearchC = () => {
        setShowLoading(true);
        setOnSearchData();
    }

    const setOnSearchData = async _ => {
        const body = {
            text: message,
            prompt: "プロンプト"
        }
        const res = await sendChatGPT(body);
        if (res.data) {
            setResponse(res.data);
            setShowLoading(false);
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
                                ChatGPT API Tester
                            </h3>
                        </div>
                    </div>
                    <div
                        style={{paddingLeft: browserRedirect() === 2 ? '10px' : browserRedirect() === 3 ? '24px' : null}}>
                        <label className={styles.input_title_department}>会話を入れてください。</label>
                        <div className={styles.div_row}>
                            <Input
                                placeholder={"こんにちは!Chat GPT!"}
                                className={browserRedirect() === 1 ? styles.input_department : styles.input_department_mobile_tablet}
                                value={message}
                                type="text"
                                onChange={(v) => {
                                    setMessage(v.target.value);
                                }}                             
                            />
                            <label className={styles.input_department_tip}>{response}</label>                            
                        </div>
                        <button
                            className={`${styles.on_search} ${browserRedirect() === 2 ? styles.on_search_mobile : null}`}
                            onClick={() => {
                                onSearchC();
                            }}>送信
                        </button>
                    </div>
                </div>
            }
        />
    );
};

export default ChatGPTAPITester;