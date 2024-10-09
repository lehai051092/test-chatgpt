import React, {useState} from 'react';
import {createStyles, makeStyles, MuiThemeProvider, ThemeProvider} from '@material-ui/core/styles';
import MomentUtils from '@date-io/date-fns';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ClearIcon from '@material-ui/icons/Clear';
import DatePickerImg from './images/Datepicker.png';
import {createTheme, FormControl, FormHelperText} from "@material-ui/core";
import {ja} from 'date-fns/locale';

const materialTheme = createTheme({
  palette: {
    primary: {
      main: '#00A5D9'
    }
  },
  overrides: {
    //overrideで既存スタイルを上書き
    MuiOutlinedInput: {
      notchedOutline: {
        border: 'none'
      }
    },
    MuiPickersDay: {
      day: {
        color: 'black' //days in calendar
      },
      daySelected: {
        backgroundColor: '#00A5D9', //calendar circle
        color: 'white'
      },
      current: {
        color: '#00A5D9'
      }
    }
  }
});
const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    dateRoot: {
      width: '100%',
      marginTop: '12px',
      minWidth: '150px'
    },
    timeRoot: {
      width: '100%',
      marginTop: '12px',
      minWidth: '150px'
    },
    dateTimeRoot: {
      width: '230px'
    },
    inputDel: {
      cursor: 'pointer',
      marginRight: '-10px',
      opacity: '0.3',
      '&:hover': {
        opacity: '0.5'
      }
    }
  })
);


const theme = createTheme({
  overrides: {
    MuiOutlinedInput: {
      notchedOutline: {
        border: 0
      }
    }
  }
});

const DatePickerDef = (props) => {
  const classes = useStyles();
  const {datePickerOpen, setDatePickerOpen, selectDate, format, error} = props;
  
  const [selectedDate, handleDateChange] = useState(null);
  
  let defaultValue = props?.defaultValue ? props?.defaultValue : null;
  
  const onClearDate = (e) => {
    if (selectedDate || defaultValue) {
      e.stopPropagation()
      handleDateChange(null);
      props?.setDate(null);
    } else {
      setDatePickerOpen(true);
    }
  };
  return (
    <FormControl error={Boolean(error)} style={{width: '100%'}}>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils} locale={ja}>
          {props.type === 'date' && (
            <div style={{display: 'flex', width: '100%'}}>
              <img src={DatePickerImg} style={{marginTop: '12px', height: '40px'}} alt={''}/>
              <MuiThemeProvider theme={materialTheme}>
                <KeyboardDatePicker
                  disableToolbar
                  format={format ? format : 'yyyy年MM月dd日（E）'}
                  margin="normal"
                  value={selectedDate ? selectedDate : defaultValue}
                  onChange={(newDate) => {
                    handleDateChange(newDate);
                    props?.setDate(newDate);
                  }}
                  inputVariant="outlined"
                  variant="inline"
                  InputProps={{
                    className: props?.style,
                    readOnly: true
                  }}
                  InputAdornmentProps={{position: 'end'}}
                  keyboardIcon={
                    !datePickerOpen ? (
                      (selectedDate || defaultValue) && selectDate ? (
                        <ClearIcon fontSize="small" onClick={(e) => onClearDate(e)}/>
                      ) : (
                        <KeyboardArrowDownIcon style={{opacity: '0.4'}}/>
                      )
                    ) : (
                      <KeyboardArrowUpIcon style={{color: '#00A5D9', opacity: '0.4'}}/>
                    )
                  }
                  className={classes.dateRoot}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                    style: {padding: 'unset'}
                  }}
                  open={datePickerOpen}
                  onClick={() => {
                    setDatePickerOpen(true);
                  }}
                  onClose={() => {
                    setDatePickerOpen(false);
                  }}
                  // invalidDateMessage={'日時形式正しくありません'}
                />
              </MuiThemeProvider>
            </div>
          )}
        </MuiPickersUtilsProvider>
      </ThemeProvider>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default DatePickerDef;
