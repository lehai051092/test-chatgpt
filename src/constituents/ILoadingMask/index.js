import React from 'react';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import {createUseStyles} from 'react-jss'

const LoadingMask = ({val, text}) => {

    const useStyles = createUseStyles({
        mask: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            color:'white',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24,
            p: 4,
        },
        center: {
            display: 'flex',
            justifyContent: 'center'
        },
        text: {
            fontSize: '15px',
            marginTop: '15px',
            fontWeight: 'bold'
        }
    })
    const classes = useStyles()  // 使用样式

    return (
        <Modal
            open={val}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <div className={classes.mask}>
            <div className={classes.center}>
                <CircularProgress color="inherit"/>
            </div>
            {
                text ?
                    <div className={classes.text}>
                        {text}
                    </div>
                    : null
            }

        </div>
      </Modal>
    )
}

export default LoadingMask;