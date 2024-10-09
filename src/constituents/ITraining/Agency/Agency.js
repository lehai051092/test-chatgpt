import React from "react";
import Card from "react-bootstrap/Card";


import MandatoryTitle from '../../../constituents/IMandatoryTitle'
import classes from "./styles.module.css";
import {useTranslation} from 'react-i18next'

function Agency({disable, className}) {
  const {t} = useTranslation();
  return (
    <>
      <div className={disable ? `${classes.card} ${classes.disable} ${className}` : `${classes.card} ${className}`}>
        {/* <button className={`mb-3 ${classes.grid_1}`}>Agency</button> */}
        <div>
          <MandatoryTitle title="Agency" className="mb-3"/>
        </div>
        <div className="d-flex justify-content-between flex-wrap"> 
          <label className={`mb-0 ${classes.grid_3}`}>007</label>
          <div className={`${classes.grid_4}`}>
              <select className="select-box-border-non">
                <option selected>{t('training.training_select_box_text')}</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
          </div>            
        </div>
      </div>
    </>
  );
}

export default Agency;
