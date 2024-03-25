import React from "react";

import { Button, Modal, Form, Spinner, Alert } from "react-bootstrap";

import {
  FormControl,
  FormControlLabel,
  Switch,
  FormGroup
} from "@material-ui/core";

const ProductCategoryModal = ({
  state,
  closeModal,
  loading,
  alert,
  title,
  formikCategory,
  inputRef,
  t,
  hiddenCategory,
  handleHiddenCategory
}) => {
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formikCategory.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>{t("categoryName")}</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex. : Food"
              {...formikCategory.getFieldProps("name")}
              ref={inputRef}
              required
            />
          </Form.Group>
          <Form.Group>
            <div>
              <Form.Label>{t("hiddenCategory")}</Form.Label>
            </div>
            <div className="d-flex align-items-center">
              <h5 className="text-muted h6 mr-3">{hiddenCategory}</h5>
              <FormControlLabel
                value={hiddenCategory}
                control={
                  <Switch
                    color="primary"
                    checked={hiddenCategory === "Active" ? true : false}
                    onChange={(e) => {
                      console.log("switch hidden", e.target.value)
                      if (hiddenCategory === e.target.value) {
                        if (hiddenCategory === "Active") {
                          handleHiddenCategory("Inactive");
                          formikCategory.setFieldValue("hidden", "Inactive")
                        } else {
                          handleHiddenCategory("Active");
                          formikCategory.setFieldValue("hidden", "Active")
                        }
                      }
                    }}
                    name=""
                  />
                }
              />
            </div>
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

export default ProductCategoryModal;
