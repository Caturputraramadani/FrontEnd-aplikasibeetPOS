import React from 'react';
import { Modal, Button, Form, Alert } from "react-bootstrap";
import SignatureCanvas from 'react-signature-canvas'
import styles from './modalsignature.module.css'

const ModalSignaturePad = ({show, close, handleResultSignature, t, ownerName}) => {
  const ref = React.createRef()
  let signatureRef = {}
  const submitSignature = () => {
    console.log("signatureRef", signatureRef)
    const result = signatureRef.getTrimmedCanvas().toDataURL('image/png')
    handleResultSignature(result)
    close()
  }

  const clearSignature = () => {
    signatureRef.clear()
  }

  const fullNameSignature = ownerName || "Lifetech"

  return (
    <div>
      <Modal show={show} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Signature Pad</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            <div className={styles.merchantOwner}>
              {t("merchantOwner")}
            </div>
            <div className={styles.wrapperSignaturePad}>
              <SignatureCanvas 
                penColor='black' 
                canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} 
                ref={(ref) => { signatureRef = ref }}
              />
            </div>
            <div className={styles.containerSignature}>
              (
              <div className={styles.wrapperFullNameSignature}>
                <div className={styles.fullNameSignature}>{fullNameSignature}</div>
                <div>{t("fullName&Signature")}</div>
              </div>
              )
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={clearSignature}>
              {t("delete")}
            </Button>
            <Button
              type="submit"
              className="mx-2"
              variant="primary"
              onClick={() => submitSignature()}
            >
              {t("saveChanges")}
            </Button>
          </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ModalSignaturePad;
