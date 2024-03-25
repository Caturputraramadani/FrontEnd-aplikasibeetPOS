import React from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import axios from 'axios'
import IconWhatsapp from '../../../../images/icons8-whatsapp-384.png'
import IconEmail from '../../../../images/icons8-email-64 (1).png'

import { useFormik } from "formik";
import * as Yup from "yup";
import './style.css'

const ModalSendOTP = ({loading, showOTPModal, closeButton, handleMethodSentOTP, centered}) => {
  return (
    <div>
      <Modal show={showOTPModal} centered={centered}>
        <Modal.Header>
          <Modal.Title>Sent OTP to :</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Row>
              <Col>
                <div className="d-flex wrapper-method-sent-otp whatsapp" onClick={() => handleMethodSentOTP("whatsapp")}>
                  <div className="wrapper-icon">
                    <img src={IconWhatsapp} alt="Icon Whatsapp" />
                  </div>
                  <div>
                    Whatsapp
                  </div>
                </div>
              </Col>
              <Col>
              <div className="d-flex wrapper-method-sent-otp gmail" onClick={() => handleMethodSentOTP("gmail")}>
                <div className="wrapper-icon">
                  <img src={IconEmail} alt="Icon Gmail" />
                </div>
                <div>
                  Email
                </div>
              </div>
              </Col>
            </Row>
          </Modal.Body>
        </Form>
      </Modal>
    </div>
  );
}

export default ModalSendOTP;
