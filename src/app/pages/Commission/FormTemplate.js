import React from 'react';
import { Link } from "react-router-dom";
import Select from "react-select";
import { useTranslation } from "react-i18next";

import { useDropzone } from "react-dropzone";

import {
  Row,
  Col,
  Button,
  Form,
  Alert,
  Spinner,
  InputGroup
} from "react-bootstrap";
import {
  FormControl,
  FormControlLabel,
  Switch,
  FormGroup
} from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { CalendarToday } from "@material-ui/icons";
import DatePicker from "react-datepicker";
import "../style.css";
import { FormikConsumer } from 'formik';

const FormTemplate = ({title, loading, formikCommission, alert, t, optionsOutlet, optionsStaff, optionsTypeTotalCommission, listStaffCommission, listProduct, optionsProduct, handleSelectOutlet, handleSelectProduct, validationCommission, defaultValueStaff, defaultCommissionType, defaultValueProduct, handleStatusGroup, statusGroup}) => {

  // console.log("optionsOutlet", optionsOutlet)

  const defaultValueOutlet = optionsOutlet.find((val) => {
    // console.log("val.value", val.value)
    // console.log("val outlet_id", formikCommission.values.outlet_id)
    return val.value === formikCommission.values.outlet_id
  });

  // console.log("defaultValueOutlet commission", defaultValueOutlet)
  // console.log("defaultValueStaff commission", defaultValueStaff)
  // console.log("defaultValueProduct commission", defaultValueProduct)

  return (
    <div>
      <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
        <Form noValidate onSubmit={formikCommission.handleSubmit}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>{title}</h3>
            </div>
            <div className="headerEnd">
              <Link to="/commission">
                <Button variant="outline-secondary">{t("cancel")}</Button>
              </Link>
              <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
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

          <Row style={{ padding: "1rem" }}>
            <Col>
              <Form.Group>
                <Form.Label>{t("outlet")}</Form.Label>
                <Select
                  options={optionsOutlet}                
                  defaultValue={defaultValueOutlet}
                  name="outlet_id"
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={(value) =>
                    formikCommission.setFieldValue("outlet_id", value.value)
                  }
                />
                {formikCommission.touched.outlet_id &&
                formikCommission.errors.outlet_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikCommission.errors.outlet_id}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label>{t("nameGroupCommission")}</Form.Label>
                <Form.Control
                  type="text"
                  name="name_group_commission"
                  {...formikCommission.getFieldProps("name_group_commission")}
                  onChange={(e) => {
                    let initial = "";
                    const initialEvery = e.target.value.split(" ");
                    initialEvery.forEach((item) => (initial += item.slice(0, 1)));
                    formikCommission.setFieldValue("name_group_commission", e.target.value);
                  }}
                  required
                />
                {formikCommission.touched.name_group_commission &&
                  formikCommission.errors.name_group_commission ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikCommission.errors.name_group_commission}
                      </div>
                    </div>
                  ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label>{t("typeTotalCommission")}</Form.Label>
                <Select
                  options={optionsTypeTotalCommission}
                  defaultValue={defaultCommissionType}
                  name="type_commission_total"
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={(value) =>
                    formikCommission.setFieldValue("type_commission_total", value.label)
                  }
                />
                {formikCommission.touched.type_commission_total &&
                  formikCommission.errors.type_commission_total ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikCommission.errors.type_commission_total}
                      </div>
                    </div>
                  ) : null}
              </Form.Group>
            </Col>

            <Col>
              <FormControl className="mt-3 mb-3" component="fieldset">
                <FormGroup aria-label="position">
                  <div>
                    <Form.Label>{t("status")}</Form.Label>
                  </div>
                  <div className="d-flex align-items-center">
                    <h4 className="text-muted mr-3">{statusGroup}</h4>
                    <FormControlLabel
                      value={statusGroup}
                      control={
                        <Switch
                          color="primary"
                          checked={statusGroup === "Active" ? true : false}
                          onChange={(e) => {
                            console.log("switch status", e.target.value)
                            if (statusGroup === e.target.value) {
                              if (statusGroup === "Active") {
                                handleStatusGroup("Inactive");
                                formikCommission.setFieldValue("status", "Inactive")
                              } else {
                                handleStatusGroup("Active");
                                formikCommission.setFieldValue("status", "Active")
                              }
                            }
                          }}
                          name=""
                        />
                      }
                    />
                  </div>
                </FormGroup>
              </FormControl>

              <Form.Group className="mt-4 mb-5">
                <div>
                  <Form.Label>{t("commissionType")}</Form.Label>
                </div>
                <div>
                  {["Product", "Nominal"].map((item, index) => {
                    return (
                      <Form.Check
                        key={index}
                        type="radio"
                        name="commission_type"
                        value={formikCommission.values.commission_type}
                        onChange={(e) => {
                          if (e.target.value === "product") {
                            formikCommission.setFieldValue("commission_type", "nominal");
                          } else {
                            formikCommission.setFieldValue("commission_type", "product");
                          }
                        }}
                        label={item}
                        checked={
                          item.toLowerCase() === formikCommission.values.commission_type
                            ? true
                            : false
                        }
                        required
                      />
                    );
                  })}
                </div>
              </Form.Group>

              <Form.Group className="total-commission">
                <Form.Label>{t("totalCommission")}</Form.Label>
                <Form.Control
                  type="text"
                  name="total_commission"
                  {...formikCommission.getFieldProps("total_commission")}
                  onChange={(e) => {
                    let initial = "";
                    const initialEvery = e.target.value.split(" ");
                    initialEvery.forEach((item) => (initial += item.slice(0, 1)));
                    formikCommission.setFieldValue("total_commission", e.target.value);
                  }}
                  required
                />
                {formikCommission.touched.total_commission &&
                  formikCommission.errors.total_commission ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikCommission.errors.total_commission}
                      </div>
                    </div>
                  ) : null}
              </Form.Group>
              
            </Col>
          </Row>
          <Row>
            <Col>
              <Col>
                <Form.Group>
                  <Form.Label>{t("addStaff")}</Form.Label>
                  <Select
                    options={optionsStaff}
                    isMulti
                    name="staff_id"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(value) => handleSelectOutlet(value, formikCommission)}
                    defaultValue={defaultValueStaff}
                  />
                  {formikCommission.touched.staff_id &&
                    formikCommission.errors.staff_id ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikCommission.errors.staff_id}
                        </div>
                      </div>
                    ) : null}
                </Form.Group>
              </Col>
            </Col>
          </Row>
          <Row>
            <Col>
              <Col>
                <Form.Group>
                  <Form.Label>{t("listStaffCommission")}</Form.Label>
                    <table className="table">
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col">{t("name")}</th>
                          <th scope="col">{t("staffID")}</th>
                          <th scope="col">{t("role")}</th>
                          <th scope="col">{t("outlet")}</th>
                        </tr>
                      </thead>
                        <tbody>
                          {listStaffCommission ? (
                            listStaffCommission.map(value => 
                              <tr>
                                <td>{value.name}</td>
                                <td>{value.User?.staff_id}</td>
                                <td>{value.User?.Role.name}</td>
                                <td>{value.Outlet?.name}</td>
                              </tr>
                            )
                          ) : null }
                        </tbody>
                    </table>
                </Form.Group>
              </Col>
            </Col>
          </Row>
          {formikCommission.values.commission_type === "product" ? (
            <>
              <Row>
                <Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>{t("addProduct")}</Form.Label>
                      <Select
                        options={optionsProduct}
                        defaultValue={defaultValueProduct}
                        isMulti
                        name="product_id"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(value) => handleSelectProduct(value, formikCommission)}
                      />
                      {formikCommission.touched.product_id &&
                        formikCommission.errors.product_id ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikCommission.errors.product_id}
                            </div>
                          </div>
                        ) : null}
                    </Form.Group>
                  </Col>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>{t("listProductCommission")}</Form.Label>
                        <table className="table">
                          <thead className="thead-dark">
                            <tr>
                              <th scope="col">{t("product")}</th>
                              <th scope="col">{t("price")}</th>
                            </tr>
                          </thead>
                            <tbody>
                              {listProduct ? (
                                listProduct.map(value =>
                                  <tr>
                                    <td>{value.name}</td>
                                    <td>{value.price}</td>
                                  </tr>
                                )) : null }
                            </tbody>
                        </table>
                    </Form.Group>
                  </Col>
                </Col>
              </Row>
            </>
          ) : (
            <Row>
              <Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("nominalCommission")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="nominal_commission"
                      {...formikCommission.getFieldProps("nominal_commission")}
                      onChange={(e) => {
                        let initial = "";
                        const initialEvery = e.target.value.split(" ");
                        initialEvery.forEach((item) => (initial += item.slice(0, 1)));

                        formikCommission.setFieldValue("nominal_commission", e.target.value);
                      }}
                      required
                    />
                    {formikCommission.touched.nominal_commission &&
                      formikCommission.errors.nominal_commission ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikCommission.errors.nominal_commission}
                          </div>
                        </div>
                      ) : null}
                  </Form.Group>
                </Col>
              </Col>
            </Row>
          )}
        </Form>
      </Paper>
    </div>
  );
}

export default FormTemplate;
