import React, {useState, useEffect} from "react";
import GeneralButton from "../../../constituents/IButton/GeneralButton/index";
import logger from 'redux-logger';
import {getCSVExportEmployee, getCSVExportForAllEmployee} from "../../../request/backendApi/api";
import classes from './styles.module.css'
import moment from 'moment';
import encoding from "encoding-japanese";
import Radio from "../../../constituents/IRadioButtons";
import store from "../../../storage";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RolePlayLogPage from "../RolePlayLogPage";
import LoadingMask from "../../../constituents/ILoadingMask";

function ExportPage() {
  const [tab, setTab] = useState('useLog')
  const [openMaskFlag, setOpenMaskFlag] = React.useState(false)
  //employeeCSVExport
  const employeeCSVExport = () => {
    setOpenMaskFlag(true)
    const data = getCSVExportEmployee().then((res) => {
      if (res.data) {
        const link = document.createElement("a");
        var currentDate = new Date();
        currentDate = moment(currentDate).format('YYYYMMDDHHmm');
        var fileName = "employees_" + currentDate + ".csv"
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
  }
  
  //allEmployeeCSVExport
  const allEmployeeCSVExport = () => {
    setOpenMaskFlag(true)
    const data = getCSVExportForAllEmployee().then((res) => {
      if (res.data) {
        const link = document.createElement("a");
        var currentDate = new Date();
        currentDate = moment(currentDate).format('YYYYMMDDHHmm');
        var fileName = "associates_" + currentDate + ".csv"
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
  }
  
  return (
    <>
      <h3 className="mb-xl-3" id="export" name="export">ログ出力</h3>
      <div>
        <FormControlLabel
          style={{margin: '0'}}
          control={
            <Radio
              value={'useLog'}
              onChange={() => {
                setTab('useLog')
              }}
              color="primary"
              checked={
                tab === 'useLog'
              }
              style={{display: 'none'}}
            />
          }
          label={
            <p
              className={`${classes.radio_label} ${
                tab === 'useLog' ? classes.radio_active : ''
              }`}
            >利用ログ</p>
          }
        />
        <FormControlLabel
          style={{margin: '0'}}
          control={
            <Radio
              value={'gptLog'}
              onChange={() => {
                setTab('gptLog')
              }}
              color="primary"
              checked={
                tab === 'gptLog'
              }
              style={{display: 'none'}}
            />
          }
          label={
            <p
              className={`${classes.radio_label} ${
                tab === 'gptLog' ? classes.radio_active : ''
              }`}
            >GPTログ</p>
          }
        />
      </div>
      <div className={`${classes.big_box} ${classes.export_file_area}`}>
        {
          tab === 'useLog' ?
            <div className={`${classes.small_box} `}>
              <GeneralButton
                title="AF 社員"
                className={`mr-4 w-auto px-4 mb-2 ${classes.export_button} ${classes.height_64}`}
                id="export_button"
                onClick={employeeCSVExport}
              />
              <GeneralButton
                title="アソシエイツ"
                className={`mr-4 w-auto px-4 mb-2 ${classes.export_button} ${classes.height_64}`}
                id="all_export_button"
                onClick={allEmployeeCSVExport}
              />
            </div>
            : <RolePlayLogPage/>
        }
      </div>
      <LoadingMask val={openMaskFlag}/>
    </>
  )
}

export default ExportPage
