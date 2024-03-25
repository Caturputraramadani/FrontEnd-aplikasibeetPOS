import React from "react";

import { Button, Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import { IconButton, Paper } from "@material-ui/core";
import { Edit } from "@material-ui/icons";

import "../style.css";

const CustomerModal = ({
  stateModal,
  cancelModal,
  title,
  alert,
  loading,
  formikCustomer,
  validationCustomer,
  alertPhoto,
  photoPreview,
  photo,
  handlePreviewPhoto,
  t
}) => {
  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header>{title}</Modal.Header>
      <Form noValidate onSubmit={formikCustomer.handleSubmit}>
        <Modal.Body>
          <Row style={{ padding: "1rem" }}>
            {alert ? <Alert variant="danger">{alert}</Alert> : ""}
            {alertPhoto ? <Alert variant="danger">{alertPhoto}</Alert> : ""}

            <Col md={3}>
              <Paper
                elevation={2}
                style={{
                  width: "120px",
                  height: "120px",
                  overflow: "hidden",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${photoPreview || photo})`
                }}
              >
                <input
                  accept="image/jpeg,image/png"
                  style={{ display: "none" }}
                  id="icon-button-file"
                  type="file"
                  onChange={handlePreviewPhoto}
                />
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="secondary"
                    aria-label="upload picture"
                    component="span"
                    style={{
                      position: "absolute",
                      left: "-5px",
                      top: "-20px"
                    }}
                  >
                    <Edit />
                  </IconButton>
                </label>
              </Paper>

              <p className="text-muted mt-1">
              {t("allowedFileTypes")}: .png, .jpg, .jpeg | {t("fileSizeLimit")}: 2MB
              </p>
            </Col>

            <Col md={4}>
              <div className="title">{t("customerName")}</div>
              <Form.Control
                type="text"
                name="name"
                {...formikCustomer.getFieldProps("name")}
                className={validationCustomer("name")}
                required
              />
              {formikCustomer.touched.name && formikCustomer.errors.name ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.name}
                  </div>
                </div>
              ) : null}

              <div className="title">{t("customerEmail")}</div>
              <Form.Control
                type="email"
                name="email"
                {...formikCustomer.getFieldProps("email")}
                className={validationCustomer("email")}
                required
              />
              {formikCustomer.touched.email && formikCustomer.errors.email ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.email}
                  </div>
                </div>
              ) : null}

            {/* Update field nomor rekening 240522 */}
              {/* <div className="title">{t("bankName")}</div>
              <Form.Control
                type="text"
                name="bank"
                {...formikCustomer.getFieldProps("bank")}
                className={validationCustomer("bank")}
                required
              />
              {formikCustomer.touched.bank && formikCustomer.errors.bank ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.bank}
                  </div>
                </div>
              ) : null} */}

            </Col>

            <Col md={4}>
              <div className="title">{t("customerPhoneNumber")}</div>
              <Form.Control
                type="text"
                name="phone_number"
                {...formikCustomer.getFieldProps("phone_number")}
                className={validationCustomer("phone_number")}
                required
              />
              {formikCustomer.touched.phone_number &&
              formikCustomer.errors.phone_number ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.phone_number}
                  </div>
                </div>
              ) : null}

              <div className="title">{t("customerAddress")}</div>
              <Form.Control
                type="text"
                name="address"
                {...formikCustomer.getFieldProps("address")}
                className={validationCustomer("address")}
                required
              />
              {formikCustomer.touched.address &&
              formikCustomer.errors.address ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.address}
                  </div>
                </div>
              ) : null}

              {/* Update input bank - 240522 */}
              {/* <div className="title">{t("bankAccountNumber")}</div>
              <Form.Control
                type="text"
                name="no_rekening"
                {...formikCustomer.getFieldProps("no_rekening")}
                className={validationCustomer("no_rekening")}
                required
              />
              {formikCustomer.touched.no_rekening &&
              formikCustomer.errors.no_rekening ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.no_rekening}
                  </div>
                </div>
              ) : null} */}
            </Col>
       
          </Row>

          <Row style={{ padding: "1rem" }}>
            <Col>
              <Form.Group>
                <Form.Label>{t("notes")}</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  {...formikCustomer.getFieldProps("notes")}
                  className={validationCustomer("notes")}
                />
              </Form.Group>
              {formikCustomer.touched.notes && formikCustomer.errors.notes ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikCustomer.errors.notes}
                  </div>
                </div>
              ) : null}
            </Col>
          </Row>
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

export default CustomerModal;
