import React, {useState} from "react";
import { Modal, Button, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import styles from "./saleschannelpage.module.css";
import axios from 'axios'

const ModalAddAccount = ({ showPlatform, closePlatform, platform, t, handleSave,handleAccountName }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  return (
    <div>
      <Modal show={showPlatform} onHide={closePlatform}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {t('addAccount')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>{t('enterYourDomainNameIn')} <span className="font-weight-bold">{platform}</span></Form.Label>
            <Form.Control
              placeholder={t("enterNewAccount")}
              name="add_account"
              required
              onChange={(e) => handleAccountName(e.target.value)}
            />
          </Form.Group>
          {/* <div className="d-flex justify-content-end">
            <div className="btn btn-primary">Submit</div>
          </div> */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleSave(false)}>
          {t('addAccount')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalAddAccount;
