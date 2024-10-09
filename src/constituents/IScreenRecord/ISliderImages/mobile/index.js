import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css'
import '../style.css'
import pointerLeft from '../../../../property/images/free_story/pointer_left.png'
import pointerRight from '../../../../property/images/free_story/pointer_right.png'

import unclickLeft from '../../../../property/images/free_story/unclick_left.png'
import unclickRight from '../../../../property/images/free_story/unclick_right.png'
import tabletLeft from '../../../../property/images/free_story/tablet_left.png'
import tabletRight from '../../../../property/images/free_story/tablet_right.png'

import pointerLeftMobile from '../../../../property/images/free_story/free_story_left.png'
import pointerRightMobile from '../../../../property/images/free_story/free_story_right.png'
import pointerLeftMobileModal from '../../../../property/images/free_story/pdf_modal_left.png'
import pointerRightMobileModal from '../../../../property/images/free_story/pdf_modal_right.png'

import pdfGrayLeft from '../../../../property/images/free_story/pdf_gray_left.png'
import pdfGrayRight from '../../../../property/images/free_story/pdf_gray_right.png'

import { getProcessDetail, getProcessToken } from "../../../../request/backendApi/api";
import CircularProgress from '@material-ui/core/CircularProgress';
import { useParams, useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
import { browserRedirect } from '../../../../utils/util';
import Modal from '@material-ui/core/Modal';

/**
 * mini swiper
 * @author Jmx
 * @returns dom
 */
const SliderImages = () => {
    // page number
    const [pageNumber, setPageNumber] = useState(1);

    const [numPages, setNumPages] = useState(null);

    const [pdfPath, setPdfPath] = useState("");

    const [pdfModalFlg, setPdfModalFlg] = useState(false);

    const sliderCore = useRef();

    const sliderImg = useRef();


    const [rect, setRect] = useState([]);

    const location  = useLocation();

    function onDocumentLoadSuccess({ numPages }) {
        resize();
        setNumPages(numPages);
    }

    useEffect(() => {
        getImageArray(location.pathname.split('/')[2], location.pathname.split('/')[3])
    }, [location.pathname])


    useEffect(() => {
        resize();
        if(browserRedirect() === 3){
            let slider_array_tablet = document.getElementsByClassName("slider_array_tablet")?.[0];
            slider_array_tablet.style.marginTop = '20px'
            slider_array_tablet.style.height = '84%'
        }
    }, [])

    const resize = () => {
        if(sliderCore.current){
            if (browserRedirect()==3) {
                let sliderImgDom =  sliderImg.current;

                if (window.orientation === 90 || window.orientation === -90) {
                    sliderImgDom.style.height = '45vh'
                }else{
                    sliderImgDom.style.height = '57vh'
                }
                setRect([sliderCore.current.clientWidth * 0.9, sliderCore.current.height * 0.9]);
                if (document.getElementById("task_list_title_sub")) {
                    document.getElementById("task_list_title_sub").style.fontSize = "21px";
                }
            } else if (window.screen.height <= 450 && window.screen.width<=900) {
                setRect([sliderCore.current.clientWidth * 0.75, sliderCore.current.height * 0.75]);
                if (document.getElementById("task_list_title_sub")) {
                    document.getElementById("task_list_title_sub").style.fontSize = "16px";
                }
            } else if (window.screen.height <= 900 && window.screen.width<=450) {
                setRect([sliderCore.current.clientWidth * 0.95, sliderCore.current.height]);
                if (document.getElementById("task_list_title_sub")) {
                    document.getElementById("task_list_title_sub").style.fontSize = "16px";
                }
            } else if (window.screen.height <= 768 && window.screen.width<=1100) {
                setRect([sliderCore.current.clientWidth * 0.88, sliderCore.current.height*0.88]);
                if (document.getElementById("task_list_title_sub")) {
                    document.getElementById("task_list_title_sub").style.fontSize = "16px";
                }
            } else if (window.screen.height <= 900 && window.screen.width<=1200 ) {
                setRect([sliderCore.current.clientWidth * 0.7, sliderCore.current.height * 0.7]);
                if (document.getElementById("task_list_title_sub")) {
                    document.getElementById("task_list_title_sub").style.fontSize = "21px";
                }
            } else if (window.screen.height <= 900) {
                setRect([sliderCore.current.clientWidth * 0.9, sliderCore.current.height * 0.9]);
                if (document.getElementById("task_list_title_sub")) {
                    document.getElementById("task_list_title_sub").style.fontSize = "21px";
                }
            } else if (window.screen.height <= 1200 && window.screen.width<= 2000) {
                setRect([sliderCore.current.clientWidth * 0.81, sliderCore.current.height * 0.81]);
                if (document.getElementById("task_list_title_sub")) {
                    document.getElementById("task_list_title_sub").style.fontSize = "21px";
                }
            } else {
                setRect([sliderCore.current.clientWidth * 0.85, sliderCore.current.height * 0.85]);
                if (document.getElementById("task_list_title_sub")) {
                    document.getElementById("task_list_title_sub").style.fontSize = "21px";
                }
            }
        }else{
            setTimeout(() => {
                resize();
            }, 100);
        }
        
    }

    // since html2canvas can't directly request the picture of the URL -_-
    // it needs to be converted to Base64 ！！
    const urlToBase64 = (url) => {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.onload = function () {
                let canvas = document.createElement('canvas');
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                // insert the picture into the canvas and start painting
                canvas.getContext('2d').drawImage(image, 0, 0);
                // result
                let result = canvas.toDataURL('image/png')
                resolve(result);
            };
            // CORS handle https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
            image.setAttribute("crossOrigin", 'Anonymous');
            image.src = url;
            // error handling of picture loading failure
            image.onerror = () => {
                reject(new Error('urlToBase64 error'));
            };
        })
    }

    const getToken = async () => {
        const response = await getProcessToken();
        return response.data;
    }

    const getImageArray = async (taskID, lessonId) => {
        let token = await getToken();
        const response = await getProcessDetail(lessonId, taskID);
        if (response["status"] === 200) {
            if (response?.["data"]?.["materials"]) {
                console.log(response);
                let materials = response?.["data"]?.["materials"];
                if (materials && materials.length > 0) {
                    xhrequest(materials[materials.length - 1]["processFullPath"] + "?" + token, (res) => {
                        setPdfPath(res.response);
                        setNumPages(0);
                        setPageNumber(1);
                    })
                }
            }
        }
    }

    const xhrequest = (url, callback) => {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            callback(this);
        };
        xhr.send();
    }

    // previous
    const onPrevious = () => {
        let v_pageNumber = pageNumber;
        v_pageNumber--;
        if (pageNumber > 1) {
            setPageNumber(v_pageNumber);
        }
    }

    // next
    const onNext = () => {
        let v_pageNumber = pageNumber;
        v_pageNumber++
        if (pageNumber < numPages) {
            setPageNumber(v_pageNumber);
        }
    }


    return (
        <div className={styles.slider_image} ref={sliderImg}>
            {
                !numPages ?
                    <>
                        <div className={styles.element_to_record_mask}>
                            <div className={styles.element_to_record_loading}>
                                <CircularProgress color="inherit" />
                            </div>
                        </div>
                    </> : null
            }
            <div className={styles.slider_core}>
                <div className={styles.pdf_controller}>
                    <div className={styles.pointer} onClick={onPrevious}>
                        {
                            browserRedirect() === 2 ?
                                <>
                                {
                                    pageNumber === 1?
                                    <img src={pdfGrayLeft} className={styles.pointer_button_mobile_l} />
                                    :
                                    <img src={pointerLeftMobile} className={styles.pointer_button_mobile_l} />
                                }
                                </>
                                :
                                browserRedirect() === 1 ?
                                <img src={pointerLeft} className={styles.pointer_button_r} />
                                :
                                browserRedirect() === 3 ?
                                <>
                                {
                                    pageNumber === 1?
                                    <img src={unclickLeft} className={styles.pointer_button_r} />
                                    :
                                    <img src={tabletLeft} className={styles.pointer_button_r} />
                                }
                                </>
                                :
                                null
                        }
                    </div>
                </div>
                <div
                    className={`${styles.slider_array_bottom_plate} slider_array_tablet` }
                    ref={sliderCore}
                    onClick={() => {
                        setPdfModalFlg(true);
                    }}
                >
                    {
                        rect.length > 0 ?
                            <Document
                                noData={" "}
                                loading={" "}
                                file={pdfPath}
                                options={{
                                    cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
                                    cMapPacked: true,
                                    disableWorker: true
                                }}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                <Page
                                    loading={" "}
                                    width={rect[0]}
                                    height={rect[1]}
                                    pageNumber={pageNumber}
                                    renderTextLayer={false}
                                />
                            </Document>
                            :
                            null
                    }
                </div>
                <div className={styles.pdf_controller}>
                    <div className={styles.pointer} onClick={onNext}>
                        {
                            browserRedirect() === 2 ?
                                <>
                                {
                                    pageNumber === numPages?
                                    <img src={pdfGrayRight} className={styles.pointer_button_mobile_r} />
                                    :
                                    <img src={pointerRightMobile} className={styles.pointer_button_mobile_r} />
                                }
                                </>
                                :
                            browserRedirect() === 1 ?
                                <img src={pointerRight} className={styles.pointer_button_r} />
                                :
                            browserRedirect() === 3 ?
                                <>
                                {
                                    pageNumber === numPages?
                                    <img src={unclickRight} className={styles.pointer_button_r} />
                                    :
                                    <img src={tabletRight} className={styles.pointer_button_r} />
                                }
                                </>
                                :
                                null
                        }
                    </div>
                </div>

                {
                    numPages ?
                        <div
                            className={styles.slider_control}
                            // style={document.body.offsetHeight / document.body.offsetWidth > 1 || browserRedirect() === 3? { left: '50%', transform: 'translate(-50%, 0%)' } : document.body.offsetHeight < 450 ? { right: 0 } : { right: "3%" }}
                        >
                            <span className={styles.page_number}>{pageNumber > 9 ? pageNumber : "0" + pageNumber}/{numPages ? numPages > 9 ? numPages : "0" + numPages : null}</span>
                        </div> : null
                }

            </div>
            <Modal
                onClose={() => {
                    setPdfModalFlg(false);
                }}
                open={pdfModalFlg}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={styles.pdf_modal}>
                    <img src={pointerLeftMobileModal} onClick={onPrevious} className={styles.modal_previous} />
                    <div  style={{width: browserRedirect() != 3 ?
                                    document.body.clientWidth * 0.6 < 280 ? 280 : document.body.clientWidth * 0.55
                                    :document.body.clientWidth * 0.85}}>
                        <Document
                            noData={" "}
                            loading={" "}
                            file={pdfPath}
                            options={{
                                cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
                                cMapPacked: true,
                                disableWorker: true
                            }}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page
                                loading={" "}
                                width={
                                    browserRedirect() != 3 ?
                                    document.body.clientWidth * 0.6 < 280 ? 280 : document.body.clientWidth * 0.55
                                    :document.body.clientWidth * 0.85
                                }
                                pageNumber={pageNumber}
                                renderTextLayer={false}
                            />
                        </Document>
                    </div>
                    <img src={pointerRightMobileModal} onClick={onNext} className={styles.modal_next} />
                </div>
            </Modal>
        </div>
    )
}

export default SliderImages;