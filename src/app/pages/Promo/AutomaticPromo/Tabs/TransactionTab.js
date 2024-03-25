import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import FormTemplate from "../Form";

import "../../../style.css";

const TransactionTab = ({
  title,
  formikPromo,
  validationPromo,
  allProducts,
  allOutlets,
  weekdays,
  photo,
  photoPreview,
  alert,
  alertPhoto,
  loading,
  startDate,
  endDate,
  startHour,
  endHour,
  handlePreviewPhoto,
  handlePromoStartDate,
  handlePromoEndDate,
  handlePromoDays,
  handlePromoHour,
  handleSelectOutlet,
  mode,
  t,
  errorDate
}) => {
  
  console.log("formikPromo name", formikPromo.values.name)
  console.log("formikPromo transaction_amount", formikPromo.values.transaction_amount)
  console.log("formikPromo transaction_type", formikPromo.values.transaction_type)

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <Form onSubmit={formikPromo.handleSubmit} noValidate>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{title}</h3>
              </div>

              <div className="headerEnd">
                <Link to="/promo/automatic-promo">
                  <Button variant="outline-secondary">{t("cancel")}</Button>
                </Link>
                <Button
                  variant="primary"
                  style={{ marginLeft: "1rem" }}
                  type="submit"
                >
                  {loading ? (
                    <Spinner animation="border" variant="light" size="sm" />
                  ) : (
                    `${t("save")}`
                  )}
                </Button>
              </div>
            </div>

            {alert ? <Alert variant="danger">{alert}</Alert> : ""}

            <Row className="lineBottom" style={{ padding: "2rem" }}>
              <Col>
                <Form.Group>
                  <Form.Label>{t("promoName")}:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    {...formikPromo.getFieldProps("name")}
                    className={validationPromo("name")}
                    required
                  />
                  {formikPromo.touched.name && formikPromo.errors.name ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikPromo.errors.name}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>

            <Row className="lineBottom" style={{ padding: "2rem" }}>
              <Col>
                <Row style={{ marginBottom: "1rem" }}>
                  <h5>{t("promoRules")}</h5>
                </Row>

                <Row>
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>{t("minimumTransaction:(nominalMinimum)")}</Form.Label>
                      <Form.Control
                        type="number"
                        name="transaction_amount"
                        {...formikPromo.getFieldProps("transaction_amount")}
                        className={validationPromo("transaction_amount")}
                        required
                      />
                      {formikPromo.touched.transaction_amount &&
                      formikPromo.errors.transaction_amount ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.transaction_amount}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col sm={3}>
                    <Form.Group>
                      <Form.Label>{t("discountType")}:</Form.Label>
                      <Form.Control
                        as="select"
                        name="transaction_type"
                        {...formikPromo.getFieldProps("transaction_type")}
                        className={validationPromo("transaction_type")}
                        required
                      >
                        <option value="percentage">{t("percentage")}</option>
                        <option value="currency">{t("rupiah")}</option>
                      </Form.Control>
                      {formikPromo.touched.transaction_type &&
                      formikPromo.errors.transaction_type ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.transaction_type}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col sm={3}>
                    <Form.Group>
                      <Form.Label>{t("discountRate")}:</Form.Label>
                      <Form.Control
                        type="number"
                        name="transaction_value"
                        {...formikPromo.getFieldProps("transaction_value")}
                        className={validationPromo("transaction_value")}
                        required
                      />
                      {formikPromo.touched.transaction_value &&
                      formikPromo.errors.transaction_value ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.transaction_value}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            <FormTemplate
              formikPromo={formikPromo}
              validationPromo={validationPromo}
              allProducts={allProducts}
              allOutlets={allOutlets}
              weekdays={weekdays}
              photo={photo}
              photoPreview={photoPreview}
              alertPhoto={alertPhoto}
              startDate={startDate}
              endDate={endDate}
              startHour={startHour}
              endHour={endHour}
              handlePreviewPhoto={handlePreviewPhoto}
              handlePromoStartDate={handlePromoStartDate}
              handlePromoEndDate={handlePromoEndDate}
              handlePromoDays={handlePromoDays}
              handlePromoHour={handlePromoHour}
              handleSelectOutlet={handleSelectOutlet}
              mode={mode}
              errorDate={errorDate}
            />
          </Form>
        </Paper>
      </Col>
    </Row>
  );
};

export default TransactionTab;
