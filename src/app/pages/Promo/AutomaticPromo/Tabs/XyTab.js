import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";
import Select from "react-select";

import FormTemplate from "../Form";

import "../../../style.css";

const XyTab = ({
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
  handleSelectX,
  handleSelectY,
  handleSelectOutlet,
  mode,
  t,
  errorDate
}) => {
  const defaultValueX = formikPromo.values["xy_product_x_id"].map((item) => {
    const product = allProducts.find((val) => val.id === item);
    return { value: item, label: product ? product.name: "-" };
  });

  const defaultValueY = formikPromo.values["xy_product_y_id"].map((item) => {
    const product = allProducts.find((val) => val.id === item);
    return { value: item, label: product ? product.name: "-" };
  });

  const options = allProducts.map((item) => {
    return { value: item.id, label: item ? item.name: "-" };
  });

  
  console.log("formikPromo name", formikPromo.values.name)
  console.log("formikPromo productToBuy", formikPromo.values.productToBuy)
  console.log("formikPromo xy_apply_multiply", formikPromo.values.xy_apply_multiply)

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
                  <Col sm={5}>
                    <Form.Group>
                      <Form.Label>{t("productToBuy")}:</Form.Label>
                      <Select
                        defaultValue={defaultValueX}
                        placeholder={t('select')}
                        options={options}
                        isMulti
                        name="xy_product_x_id"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleSelectX}
                      />
                      {formikPromo.touched.xy_product_x_id &&
                      formikPromo.errors.xy_product_x_id ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.xy_product_x_id}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col sm={4}>
                    <Form.Group>
                      <Form.Label>{t("productAmount")}:</Form.Label>
                      <Form.Control
                        type="number"
                        name="xy_amount_x"
                        {...formikPromo.getFieldProps("xy_amount_x")}
                        className={validationPromo("xy_amount_x")}
                        required
                      />
                      {formikPromo.touched.xy_amount_x &&
                      formikPromo.errors.xy_amount_x ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.xy_amount_x}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col sm={2}>
                    <Form.Group>
                      <Form.Label>{t("applyMultiply")}:</Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="xy_apply_multiply"
                        {...formikPromo.getFieldProps("xy_apply_multiply")}
                        checked={
                          formikPromo.getFieldProps("xy_apply_multiply").value
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm={5}>
                    <Form.Group>
                      <Form.Label>{t("freeProduct")}:</Form.Label>
                      <Select
                        defaultValue={defaultValueY}
                        placeholder={t('select')}
                        options={options}
                        isMulti
                        name="xy_product_y_id"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleSelectY}
                      />
                      {formikPromo.touched.xy_product_y_id &&
                      formikPromo.errors.xy_product_y_id ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.xy_product_y_id}
                          </div>
                        </div>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col sm={4}>
                    <Form.Group>
                      <Form.Label>{t("productAmount")}:</Form.Label>
                      <Form.Control
                        type="number"
                        name="xy_amount_y"
                        {...formikPromo.getFieldProps("xy_amount_y")}
                        className={validationPromo("xy_amount_y")}
                        required
                      />
                      {formikPromo.touched.xy_amount_y &&
                      formikPromo.errors.xy_amount_y ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.xy_amount_y}
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

export default XyTab;
