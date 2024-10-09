import React, { useRef, useState, useEffect  } from 'react';
import { Container, Row, Col } from "reactstrap";
import up_arrow from '../../../property/images/up_arrow_circle.svg';
import down_arrow from '../../../property/images/down_arrow_circle.svg';

import classes from './styles.module.css';

const CardDropdown = ({id, title, className, detail}) => {
    const [readMore, setReadMore] = useState(false);
    return ( 
        <>
            <Row>
                <Col className={className}>
                    <button id={`view_detail_${id}`} name={`view_detail_${id}`} onClick={() => setReadMore(!readMore)} className={`${classes.detail_btn} btn p-0`}>
                        <span id={`view_detail_text_${id}`} name={`view_detail_text_${id}`} >{title}</span>
                        <img id={`arrow_icon_${id}`} name={`arrow_icon_${id}`} src={`${readMore? up_arrow: down_arrow}`} className="ml-2 img-fluid"/>
                    </button>
                </Col>
            </Row>
            <div id={`read_more_${id}`} name={`read_more_${id}`} className={readMore ? `` : `d-none`} > 
              {
                detail &&
                detail.map((item, index) => (
                    <div id={`list_box_${id}${index+1}`} name={`list_box_${id}${index+1}`} key={index} className={classes.list_box}>
                        <p id={`detail_title_${id}${index+1}`} name={`detail_title_${id}${index+1}`} className="font-16">{item.title}</p>
                        {
                            item.info.split("\n").map((val, pindex )=> <p id={`detail_text_${id}${index+1}${pindex+1}`} name={`detail_text_${id}${index+1}${pindex+1}`} className={`${classes.detail_info}`} key={val}> {val} </p>)
                        }
                    </div>
                ))
               }
            </div>
        </>
    )
}

export {CardDropdown} ;