import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import './styles.css'

function Model( {title, data, alt, classes} ) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
        <>
            <img src={data} alt={alt} onClick={handleShow} className={classes} />  
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className={`cmn-model`}
                >
                <Modal.Header closeButton className="px-3 pt-3">
                    <Modal.Title className="text-center"><h3 className="mb-0 font-weight-normal">{title}</h3></Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center px-3 pb-3 pt-0">
                    <img src={data} alt={alt} className='img-fluid' />  
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Model

