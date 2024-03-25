import React from "react";

import { Button, Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";

import "../../style.css";

const SpecialPromoModal = ({
  stateModal,
  cancelModal,
  title,
  loading,
  alert,
  formikPromo,
  validationPromo,
  allOutlets,
  allProducts,
  selectedProducts,
  t
}) => {
  const listSelected = selectedProducts.map((item) => item.id);
  listSelected.push(formikPromo.values.product_id);

  const listProducts = allProducts.filter((item) =>
    listSelected.find((val) => item.id === val)
  );

  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={formikPromo.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>{t("outlet")}:</Form.Label>
            <Form.Control
              as="select"
              name="outlet_id"
              {...formikPromo.getFieldProps("outlet_id")}
              className={validationPromo("outlet_id")}
              required
            >
              <option value="" disabled hidden>
              {t("chooseOutlet")}
              </option>
              {allOutlets.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formikPromo.touched.outlet_id && formikPromo.errors.outlet_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikPromo.errors.outlet_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("product")}:</Form.Label>
            <Form.Control
              as="select"
              name="product_id"
              {...formikPromo.getFieldProps("product_id")}
              className={validationPromo("product_id")}
              required
            >
              {listProducts.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formikPromo.touched.product_id && formikPromo.errors.product_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikPromo.errors.product_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("point")}:</Form.Label>
            <Form.Control
              type="number"
              name="point"
              {...formikPromo.getFieldProps("point")}
              className={validationPromo("point")}
              required
            />
            {formikPromo.touched.point && formikPromo.errors.point ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formikPromo.errors.point}</div>
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

export default SpecialPromoModal;
