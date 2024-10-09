import React from 'react';

import './styles.css'

const MandatoryTitle = ({title, className, style}) => {

    return (
        <p className={`cmn-sub-title ${className}`} style={style}> {title}</p>
    )
}

export default MandatoryTitle;