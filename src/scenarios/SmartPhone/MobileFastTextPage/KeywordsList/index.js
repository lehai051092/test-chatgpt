import FormControlLabel from '@material-ui/core/FormControlLabel';
import classes from './styles.module.css';
import { useCallback, useState } from 'react';

const styles = {
  root: {
    marginLeft: 0,
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'start',
  },
  container: {
    width: '100%',
    padding: 10,
    display: 'flex',
    alignItems: 'stretch',
  },
  label: {
    marginButtom: 0,
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '26px',
    color: '#333333',
  },

};


function KeywordList(props) {
  const { vProcesses, setProcesses, currentIndex, setCurrentIndex } = props;
  // const [currentIndex, setCurrentIndex] = useState(0)

  const currentData = useCallback(() => {
    if (vProcesses) {
      return vProcesses[currentIndex]
    }
  }, [currentIndex, vProcesses])

  const clickHandler = (type) => {
    if (type === 'prev') {
      setCurrentIndex((currentIndex <= 0) ? 0 : (currentIndex - 1))
    } else {
      setCurrentIndex((currentIndex >= (vProcesses.length - 1)) ? (vProcesses.length - 1) : (currentIndex + 1))
    }

  }

  const showToggle = (index) => {
    if (vProcesses) {
      let processTemp = JSON.parse(JSON.stringify(vProcesses));
      processTemp[index].toggle = !processTemp[index].toggle;

      setProcesses([...processTemp]);
    }
  }

  const isKeywordMatched = (item) => {
    for (let i = 0; i < item.keywords.length; i++) {
      if (item.selected && item.selected.includes(item.keywords[i])) {
        return true;
        break;
      }
    }
    return false;
  }

  return (
    <>
    {
            currentData() &&
      <div className={classes.keywords_list_content_sp}>
        <div className={`${currentIndex === 0 ? classes.keywords_list_button_gray : ''} ${classes.keywords_list_button_l_sp}`} onClick={() => clickHandler('prev')}></div>
        <div className={classes.keywords_list_content_box_sp}>
          
            <div id={`checkbox_div_${currentIndex + 1}`} name={`checkbox_div_${currentIndex + 1}`} className={classes.video_chat_checkbox_row} key={currentIndex}>
              <div className="d-flex justify-content-between video-chat-process-content">
                <FormControlLabel style={styles.root} label={<span style={styles.label} id={`check_process_${currentIndex + 1}`} className={`${isKeywordMatched(currentData()) ? 'video-chat-process-name' : ''} ${classes.video_chat_process_text}`} name={`check_process_${currentIndex + 1}`}>{currentData().name}</span>} control={
                  <span></span>
                } />

                <span className={`${classes.video_chat_toggle_icon} ${currentData().toggle ? classes.video_chat_keyword_expand : classes.video_chat_keyword_fold}`} onClick={() => showToggle(currentIndex)}></span>
              </div>
              <span className={`${isKeywordMatched(currentData()) ? 'mark-on-title-check' : 'mark-on-title'}`}></span>
              {

                (currentData().toggle) && <div className="ml-2">
                  {currentData().keywords && currentData().keywords.map((it, index) => {
                    return (currentData().selected && currentData().selected.includes(it)) ?
                      <span key={index} className={`badge badge-danger mt-sm-1 ${classes.selected_badge_keyword_items_sp}`}>
                        {it}
                      </span>
                      :
                      <span key={index} className={`badge badge-info mt-sm-1 mb-sm-1 ${classes.badge_keyword_items_sp}`}>
                        {it}
                      </span>
                  })}
                </div>
              }
            </div>
          
        </div>
        <div id="next" className={`${(currentIndex === vProcesses.length - 1) ? classes.keywords_list_button_gray : ''} ${classes.keywords_list_button_r_sp}`} onClick={clickHandler}></div>
      </div>
      }
    </>
  )
}

export default KeywordList;