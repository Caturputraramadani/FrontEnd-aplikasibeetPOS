import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import FormTemplate from "../Form";

import "../../../style.css";

const QuantityTab = ({
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
                  <Col sm={4}>
                    <Form.Group>
                      <Form.Label>{t("products")}:</Form.Label>
                      <Form.Control
                        as="select"
                        name="quantity_product_id"
                        {...formikPromo.getFieldProps("quantity_product_id")}
                        className={validationPromo("quantity_product_id")}
                        required
                      >
                        <option value="" disabled hidden>
                        {t("chooseAProduct")}
                        </option>
                        {allProducts.map((item, index) => {
                          return (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Form.Control>
                      {formikPromo.touched.quantity_product_id &&
                      formikPromo.errors.quantity_product_id ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.quantity_product_id}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col sm={2}>
                    <Form.Group>
                      <Form.Label>{t("productAmount")}:</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity_amount"
                        {...formikPromo.getFieldProps("quantity_amount")}
                        className={validationPromo("quantity_amount")}
                        required
                      />
                      {formikPromo.touched.quantity_amount &&
                      formikPromo.errors.quantity_amount ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.quantity_amount}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col sm={4}>
                    <Form.Group>
                      <Form.Label>{t("discountType")}:</Form.Label>
                      <Form.Control
                        as="select"
                        name="quantity_type"
                        {...formikPromo.getFieldProps("quantity_type")}
                        className={validationPromo("quantity_type")}
                        required
                      >
                        <option value="percentage">{t("percentage")}</option>
                        <option value="currency">{t("rupiah")}</option>
                      </Form.Control>
                      {formikPromo.touched.quantity_type &&
                      formikPromo.errors.quantity_type ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.quantity_type}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col sm={2}>
                    <Form.Group>
                      <Form.Label>{t("discountRate")}:</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity_value"
                        {...formikPromo.getFieldProps("quantity_value")}
                        className={validationPromo("quantity_value")}
                        required
                      />
                      {formikPromo.touched.quantity_value &&
                      formikPromo.errors.quantity_value ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.quantity_value}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>
                  {/* <Col sm={2}>
                    <Form.Group>
                      <Form.Label>{t("applyMultiply")}:</Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="quantity_apply_multiply"
                        {...formikPromo.getFieldProps("quantity_apply_multiply")}
                        checked={
                          formikPromo.getFieldProps("quantity_apply_multiply").value
                        }
                      />
                    </Form.Group>
                  </Col> */}
                </Row>
              </Col>
            </Row>

            <FormTemplate
              t={t}
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

export default QuantityTab;
