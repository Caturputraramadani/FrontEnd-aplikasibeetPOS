import React from "react";
import { Button, Modal, Spinner, Alert } from "react-bootstrap";

import { useTranslation } from "react-i18next";

const ConfirmModal = ({
  title,
  body,
  buttonColor,
  handleClick,
  state,
  closeModal,
  loading,
  alert,
  children
}) => {
  const { t } = useTranslation();
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        {typeof body === "string" ? <p>{body}</p> : children}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          {t("close")}
        </Button>
        {handleClick ? (
          <Button variant={buttonColor} onClick={handleClick}>
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              `${t("saveChanges")}`
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
