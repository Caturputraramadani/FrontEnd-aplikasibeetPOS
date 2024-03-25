import React from "react";

import { Button, Modal, Spinner, Form, Alert } from "react-bootstrap";

import "../../style.css";

const AddModal = ({
  stateModal,
  cancelModal,
  title,
  loading,
  alert,
  formikCategory,
  validationCategory,
  t
}) => {
  return (
    <Modal show={stateModal} onHide={cancelModal} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={formikCategory.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>{t("name")}:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              {...formikCategory.getFieldProps("name")}
              className={validationCategory("name")}
              required
            />
            {formikCategory.touched.name && formikCategory.errors.name ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikCategory.errors.name}
                </div>
              </div>
            ) : null}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cancelModal}>
          {t("cancel")}
          </Button>
          <Button variant="primary" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              `${t("saveChanges")}`
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddModal;
