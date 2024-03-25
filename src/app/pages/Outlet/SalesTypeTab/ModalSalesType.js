import React from "react";

import {
  Button,
  Modal,
  Spinner,
  Form,
  Row,
  Col,
  InputGroup,
  Alert
} from "react-bootstrap";

import {
  FormControl,
  FormControlLabel,
  Switch,
  FormGroup
} from "@material-ui/core";

import "../../style.css";

const ModalPayment = ({
  stateModal,
  cancelModal,
  title,
  loading,
  formikSalesType,
  validationSalesType,
  alert,
  t,
  handleHidden,
  hidden,
  showOptionEcommerce,
  optionsEcommerce
}) => {
  return (
    <Modal show={stateModal} onHide={cancelModal} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikSalesType.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("name")}:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder={t('enterName')}
                  {...formikSalesType.getFieldProps("name")}
                  className={validationSalesType("name")}
                  required
                />
                {formikSalesType.touched.name && formikSalesType.errors.name ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikSalesType.errors.name}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          {showOptionEcommerce ? (
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("selectEcommerce")}:</Form.Label>
                  <Form.Control
                    as="select"
                    name="ecommerce_name"
                    {...formikSalesType.getFieldProps("ecommerce_name")}
                    className={validationSalesType("ecommerce_name")}
                    required
                  >
                    <option value="" disabled hidden>
                      {t("chooseAEcommerce")}
                    </option>
                    {optionsEcommerce?.length
                      ? optionsEcommerce.map((item) => {
                          return (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          );
                        })
                      : ""}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          ) : null}

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("charge")}:</Form.Label>
                <InputGroup className="pb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{ background: "transparent" }}>
                      %
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="number"
                    name="charge"
                    placeholder="Enter Charge"
                    {...formikSalesType.getFieldProps("charge")}
                    className={validationSalesType("charge")}
                    required
                  />
                </InputGroup>

                {formikSalesType.touched.charge &&
                formikSalesType.errors.charge ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikSalesType.errors.charge}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label={t("requireTable")}
                  name="require_table"
                  value={formikSalesType.getFieldProps("require_table").value}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === "false") {
                      formikSalesType.setFieldValue("require_table", true);
                    } else {
                      formikSalesType.setFieldValue("require_table", false);
                    }
                  }}
                  checked={formikSalesType.getFieldProps("require_table").value}
                />
              </Form.Group>

              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label={t("isBooking")}
                  name="is_booking"
                  value={formikSalesType.getFieldProps("is_booking").value}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === "false") {
                      formikSalesType.setFieldValue("is_booking", true);
                    } else {
                      formikSalesType.setFieldValue("is_booking", false);
                    }
                  }}
                  checked={formikSalesType.getFieldProps("is_booking").value}
                />
              </Form.Group>

              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label={t("isDelivery")}
                  name="is_delivery"
                  value={formikSalesType.getFieldProps("is_delivery").value}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (value === "false") {
                      formikSalesType.setFieldValue("is_delivery", true);
                    } else {
                      formikSalesType.setFieldValue("is_delivery", false);
                    }
                  }}
                  checked={formikSalesType.getFieldProps("is_delivery").value}
                />
              </Form.Group>

              <Form.Group>
                <div>
                  <Form.Label>{t("hideInEmenu")}</Form.Label>
                </div>
                <div className="d-flex align-items-center">
                  <h4 className="text-muted h6 mr-3">{t(hidden.toLowerCase())}</h4>
                  <FormControlLabel
                    value={hidden}
                    control={
                      <Switch
                        color="primary"
                        checked={hidden === "Active" ? true : false}
                        onChange={(e) => {
                          console.log("switch hidden", e.target.value);
                          if (hidden === e.target.value) {
                            if (hidden === "Active") {
                              handleHidden("Inactive");
                              formikSalesType.setFieldValue(
                                "hidden",
                                "Inactive"
                              );
                            } else {
                              handleHidden("Active");
                              formikSalesType.setFieldValue("hidden", "Active");
                            }
                          }
                        }}
                        name=""
                      />
                    }
                  />
                </div>
              </Form.Group>
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

export default ModalPayment;
