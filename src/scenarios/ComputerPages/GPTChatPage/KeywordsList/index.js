import FormControlLabel from '@material-ui/core/FormControlLabel';
import './styles.css'

const styles = {
  root: {
    marginLeft: 10,
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
    marginBottom: 0,
    fontSize: '16px',
    paddingLeft: 8
  },
  
};

function KeywordList(props) {
  const {vProcesses, setProcesses} = props;
  
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
      }
    }
    return false;
  }
  const toggleOpenKeywordBold = (item) => {
    for (let i = 0; i < item.keywords.length; i++) {
      if (item.toggle && item.toggle === true) {
        return true;
      }
    }
    return false;
  }
  
  return (
    <div className="video-chat-keyword-main">
      {
        vProcesses && vProcesses.map((item, index) => {
          return (
            <div
              key={`checkbox_div_${index + 1}`}
              id={`checkbox_div_${index + 1}`}
              name={`checkbox_div_${index + 1}`}
              className="video-chat-checkbox-row"
            >
              <div className="d-flex justify-content-between video-chat-process-content">
                <FormControlLabel
                  style={styles.root}
                  label={
                    <span
                      style={styles.label}
                      id={`check_process_${index + 1}`}
                      className={`${isKeywordMatched(item) ? 'video-chat-process-name' : ''} ${toggleOpenKeywordBold(item) ? 'video-chat-process-name' : ''} video-chat-process-text`}
                      name={`check_process_${index + 1}`}>{item.name}
                    </span>
                  }
                  control={
                    <span></span>
                  }
                />
                <span
                  className={`video-chat-toggle-icon ${item.toggle ? 'video-chat-keyword-expand' : 'video-chat-keyword-fold'}`}
                  onClick={() => showToggle(index)}></span>
              </div>
              <span className={`${isKeywordMatched(item) ? 'mark-on-title-check' : 'mark-on-title'}`}></span>
              {
                (item.toggle) && <div className="ml-3">
                  {item.keywords && item.keywords.map((it, index) => {
                    return (item.selected && item.selected.includes(it)) ?
                      <span
                        key={index}
                        className="badge badge-danger selected_badge_keyword_items mt-sm-1"
                      >
                        {it}
                      </span>
                      :
                      <span
                        key={index}
                        className="badge badge-info badge_keyword_items mt-sm-1 mb-sm-1">
                        {it}
                      </span>
                  })}
                </div>
              }
            </div>
          )
        })
      }
    </div>
  )
}

export default KeywordList;