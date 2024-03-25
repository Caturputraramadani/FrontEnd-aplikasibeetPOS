import React from "react";

import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";

const ModalAddToProduct = ({
  t,
  state,
  closeModal,
  loading,
  alert,
  title,
  selectedCategory,
  selectedProducts,
  allProducts,
  handleSelectProducts,
  handleAddToProduct
}) => {
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form
        onSubmit={(e) =>
          handleAddToProduct(selectedCategory, selectedProducts, e)
        }
      >
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>{t("categoryName")}</Form.Label>
            <Form.Control
              type="text"
              value={selectedCategory.category_name}
              disabled
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("products")}</Form.Label>
            <Form.Control
              as="select"
              multiple
              value={selectedProducts}
              onChange={handleSelectProducts}
            >
              {allProducts.map((item, index) => {
                return (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            {t("close")}
          </Button>
          <Button type="submit">
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

export default ModalAddToProduct;
