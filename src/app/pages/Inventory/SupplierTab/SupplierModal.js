import React from "react";

import { Button, Modal, Spinner, Form, Alert } from "react-bootstrap";

import "../../style.css";

const SupplierModal = ({
  stateModal,
  cancelModal,
  title,
  loading,
  alert,
  formikSupplier,
  validationSupplier,
  t
}) => {
  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={formikSupplier.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>{t("supplierName")}:</Form.Label>
            <Form.Control
              type="text"
              name="supplier_name"
              {...formikSupplier.getFieldProps("supplier_name")}
              className={validationSupplier("supplier_name")}
              required
            />
            {formikSupplier.touched.supplier_name &&
            formikSupplier.errors.supplier_name ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikSupplier.errors.supplier_name}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("address")}:</Form.Label>
            <Form.Control
              as="textarea"
              name="address"
              {...formikSupplier.getFieldProps("address")}
              className={validationSupplier("address")}
              required
            />
            {formikSupplier.touched.address && formikSupplier.errors.address ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikSupplier.errors.address}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("phoneNumber")}:</Form.Label>
            <Form.Control
              type="text"
              name="phone_number"
              {...formikSupplier.getFieldProps("phone_number")}
              className={validationSupplier("phone_number")}
              required
            />
            {formikSupplier.touched.phone_number &&
            formikSupplier.errors.phone_number ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikSupplier.errors.phone_number}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("email")}:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              {...formikSupplier.getFieldProps("email")}
              className={validationSupplier("email")}
              required
            />
            {formikSupplier.touched.email && formikSupplier.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikSupplier.errors.email}
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

export default SupplierModal;
