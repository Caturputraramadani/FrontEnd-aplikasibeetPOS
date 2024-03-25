import React, { useState } from "react";
import { Button, Modal, Spinner, Alert } from "react-bootstrap";

import { useTranslation } from "react-i18next";

const ConfirmModal = ({
  title,
  body,
  warning,
  buttonColor,
  handleClick,
  state,
  closeModal,
  loading,
  alert,
  children,
  second
}) => {
  const { t } = useTranslation();
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {alert ? <Alert variant="danger">{alert}</Alert> : ""}
        {warning ? (<h4 className="text-danger">{warning}</h4>) : null}
        {typeof body === "string" ? <p>{body}</p> : children}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          {t("close")}
        </Button>
        {handleClick ? (
          <Button variant={buttonColor} onClick={handleClick} disabled={second ? true : false}>
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              <div>{t("saveChanges")} {second ? (<span>({second})</span>) : null}</div>  
            )}
          </Button>
        ) : (
          ""
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
