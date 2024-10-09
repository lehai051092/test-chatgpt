import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import { Container, Row, Col } from 'reactstrap';
import GeneralButton from "../../../IButton/GeneralButton"
import SlideCard from '../../../ILesson/SlideCard/SlideCard'
import SamplePhotoFull from '../../../../property/images/chatlog/sample_profile_full.png'

const PersonalInfoPopUp = () => {
    const [show, setShow] = useState(false);  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <GeneralButton title="Persona information" onClick={handleShow} className="font-16 p-3"/>     
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
                    <Modal.Title className="text-center"><h3 className="mb-0 font-weight-normal">Persona information</h3></Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-3 pt-0 pb-3 pb-sm-0 ">
                    <Row>
                        <Col lg="8" className="mx-auto">
                            <Row>
                                <Col sm="4" className="text-center pb-sm-0 pb-3">
                                    <div className="mb-3">
                                        <h4>Jiro Suzuki</h4>
                                        <span>57 Years Old / Male</span>
                                    </div>
                                    <img src={SamplePhotoFull} alt="SamplePhotoFull"/>
                                </Col>
                                <Col sm="8" className="pb-0 pb-sm-3">
                                    <SlideCard show="true"/>  
                                    <SlideCard/>  
                                    <SlideCard/>  
                                    <SlideCard/>           
                                </Col>
                            </Row>
                        </Col>
                    </Row>                
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PersonalInfoPopUp;