import React, { useRef, useState, useEffect  } from 'react';
import up_arrow from '../../../property/images/up_arrow.png';
import down_arrow from '../../../property/images/down_arrow.png';

import classes from './styles.module.css';

const GeneralDropdown = ({items, placeholder, onSelect, className, selectedData, dataIndex, idName}) => {
    const list = useRef();
    
    const [height, setHeight] = useState();
    const [open, setOpen] = useState(false);
    selectedData = (selectedData) ?   selectedData :  '' ;
    const [selectedText, setSelectedText] = useState();

    const onOpen = () => {
        setOpen(true);
        list.current.focus();
    }

    const close = () => {
        setOpen(false);
    }

    useEffect(() => {
        const getSelectObject = items.find(function(e){
            return e.actionCode == selectedData;
        });
        if(getSelectObject)
        {
            setSelectedText(getSelectObject.actionName)
        }
    }, [selectedData])

    const itemClick = (e) => {
        setSelectedText(e.target.textContent);
        setOpen(false);
        onSelect(e.target.dataset.value, dataIndex);
    }

    return ( 
        <div className={`${classes.select_box} ${className}`} id={`${idName}_wrapper`} name={`${idName}_wrapper`}>
                <div onClick={onOpen} className={'d-flex justify-content-between align-items-center'}>
                    <span id={`${idName}_select_data`} name={`${idName}_select_data`}>{selectedText === '' ? placeholder : selectedText}</span>
                    <img src={`${open? up_arrow: down_arrow} ` } className={`${classes.arrows} `} />
                </div>
                <div
                    tabIndex="0" 
                    ref={list}
                    onBlur={close}
                    id={`${idName}_list_select_box`} name={`${idName}_list_select_box`}
                >
                <ul className={`${open ? classes.showbox : classes.hidebox} `} id={`${idName}_list_data`} name={`${idName}_list_data`}>                                         
                        {
                            items && items.map((item, index) => (
                                <li key={index} data-value={item.actionCode} id={item.id} onClick={itemClick}>
                                    {item.actionName}
                                </li>
                            ))
                        }
                    </ul>
                </div>
        </div>
    )
}

export {GeneralDropdown} ;