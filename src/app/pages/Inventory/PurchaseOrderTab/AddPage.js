import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";
import { useTranslation } from "react-i18next";

import {
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup
} from "react-bootstrap";
import { Paper } from "@material-ui/core";
import DatePicker from "react-datepicker";
import { CalendarToday, Delete } from "@material-ui/icons";

export const AddPurchaseOrderPage = ({ location }) => {
  const history = useHistory();
  const { allOutlets, allProducts, allSuppliers } = location.state;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [startDate, setStartDate] = React.useState(new Date());

  const initialValueOrder = {
    outlet_id: "",
    supplier_id: "",
    po_number: "",
    notes: "",
    date: startDate,
    items: [
      {
        product_id: "",
        quantity: 0,
        price: 0,
        total_price: 0
      }
    ],
    generated: true
  };
  const { t } = useTranslation();

  const OrderSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseOutlet")}`),
    supplier_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseSupplier")}`),
    po_number: Yup.string().nullable(),
    generated: Yup.boolean(),
    notes: Yup.string(),
    date: Yup.string().required(`${t("pleaseInputDate")}`),
    items: Yup.array().of(
      Yup.object().shape({
        product_id: Yup.number()
          .min(1)
          .required(`${t("pleaseInputProduct")}`),
        quantity: Yup.number()
          .min(1, `${t("minimum1Character")}`)
          .required(`${t("pleaseInputQuantity")}`),
        price: Yup.number()
          .min(0, `${t("minimum0Character")}`)
          .required(`${t("pleaseInputPrice")}`),
        total_price: Yup.number()
          .min(0, `${t("minimum0Character")}`)
          .required(`${t("pleaseInputPriceTotal")}`)
      })
    )
  });

  const formikOrder = useFormik({
    initialValues: initialValueOrder,
    validationSchema: OrderSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const orderData = {
        outlet_id: values.outlet_id,
        supplier_id: values.supplier_id,
        notes: values.notes,
        date: values.date,
        items: values.items
      };

      if (values.po_number) {
        orderData.po_number = values.po_number;
      }

      console.log("data yang akan dikirim", values)
      console.log("orderData", orderData)
      try {
        enableLoading();
        // await axios.post(`${API_URL}/api/v1/purchase-order`, orderData);
        await axios.post(`${API_URL}/api/v1/purchase-order`, orderData);
        disableLoading();
        history.push("/inventory");
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationOrder = (fieldname) => {
    if (formikOrder.touched[fieldname] && formikOrder.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikOrder.touched[fieldname] && !formikOrder.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleDate = (date) => {
    setStartDate(date);
    formikOrder.setFieldValue("date", date);
  };

  const handleChangePrice = (e, idx) => {
    const { value } = e.target;
    const total_price = formikOrder.values.items[idx].quantity * value || 0;

    formikOrder.setFieldValue(`items[${idx}].price`, value);
    formikOrder.setFieldValue(`items[${idx}].total_price`, total_price);
  };

  const handleChangeQuantity = (e, idx) => {
    const { value } = e.target;
    const total_price = value * formikOrder.values.items[idx].price || 0;

    formikOrder.setFieldValue(`items[${idx}].quantity`, value);
    formikOrder.setFieldValue(`items[${idx}].total_price`, total_price);
  };

  const CustomInputDate = ({ value, onClick }) => {
    return (
      <Form.Control
        type="text"
        defaultValue={value}
        onClick={onClick}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      />
    );
  };

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <Form noValidate onSubmit={formikOrder.handleSubmit}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("addPurchaseOrder")}</h3>
              </div>
              <div className="headerEnd">
                <Link to="/inventory">
                  <Button variant="secondary">{t("cancel")}</Button>
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

            <Row style={{ padding: "1rem" }} className="lineBottom">
              <Col sm={3}>
                <Form.Group>
                  <Form.Label>{t("poNumber")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="po_number"
                    {...formikOrder.getFieldProps("po_number")}
                    className={validationOrder("po_number")}
                    disabled={
                      formikOrder.getFieldProps("generated").value
                        ? true
                        : false
                    }
                    required
                  />
                  <Form.Check
                    type="checkbox"
                    label={t('generateBySystem')}
                    style={{ marginTop: "0.5rem" }}
                    {...formikOrder.getFieldProps("generated")}
                    checked={
                      formikOrder.getFieldProps("generated").value
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      const { value } = e.target;
                      if (value === "true") {
                        formikOrder.setFieldValue("generated", false);
                      } else {
                        formikOrder.setFieldValue("generated", true);
                      }
                      formikOrder.setFieldValue("po_number", "");
                    }}
                  />
                  {formikOrder.touched.po_number &&
                  formikOrder.errors.po_number ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOrder.errors.po_number}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("location")}</Form.Label>
                  <Form.Control
                    as="select"
                    name="outlet_id"
                    {...formikOrder.getFieldProps("outlet_id")}
                    className={validationOrder("outlet_id")}
                    required
                  >
                    <option value={""} disabled hidden>
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
                  {formikOrder.touched.outlet_id &&
                  formikOrder.errors.outlet_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOrder.errors.outlet_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("date")}:</Form.Label>
                  <InputGroup>
                    <DatePicker
                      name="date"
                      selected={startDate}
                      onChange={handleDate}
                      customInput={<CustomInputDate />}
                      required
                    />

                    <InputGroup.Append>
                      <InputGroup.Text>
                        <CalendarToday />
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                  {formikOrder.touched.date && formikOrder.errors.date ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOrder.errors.date}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>{t("supplier")}:</Form.Label>
                  <Form.Control
                    as="select"
                    name="outlet_to_id"
                    {...formikOrder.getFieldProps("supplier_id")}
                    className={validationOrder("supplier_id")}
                    required
                  >
                    <option value={""} disabled hidden>
                      {t("chooseSupplier")}
                    </option>
                    {allSuppliers.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                  {formikOrder.touched.supplier_id &&
                  formikOrder.errors.supplier_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOrder.errors.supplier_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("notes")}:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    {...formikOrder.getFieldProps("notes")}
                    className={validationOrder("notes")}
                  />
                  {formikOrder.touched.notes && formikOrder.errors.notes ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOrder.errors.notes}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>

            <Row style={{ padding: "1rem" }}>
              <Col>
                <Row>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>{t("productName")}</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>{t("quantity")}</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>{t("price")}</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>{t("priceTotal")}</h6>
                  </Col>
                  <Col sm={1}></Col>
                </Row>

                <FormikProvider value={formikOrder}>
                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => {
                      return (
                        <div>
                          {formikOrder.values.items.map((item, index) => {
                            return (
                              <Row key={index}>
                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      as="select"
                                      name={`items[${index}].product_id`}
                                      {...formikOrder.getFieldProps(
                                        `items[${index}].product_id`
                                      )}
                                      required
                                    >
                                      <option value="" disabled hidden>
                                        {t("chooseProduct")}
                                      </option>
                                      {allProducts.map((item) => {
                                        return (
                                          <option key={item.id} value={item.id}>
                                            {item.name}
                                          </option>
                                        );
                                      })}
                                    </Form.Control>
                                    {formikOrder.touched.items &&
                                    formikOrder.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikOrder.errors.items[index]
                                              ?.product_id
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      type="number"
                                      name={`items[${index}].quantity`}
                                      {...formikOrder.getFieldProps(
                                        `items[${index}].quantity`
                                      )}
                                      onChange={(e) =>
                                        handleChangeQuantity(e, index)
                                      }
                                      onBlur={(e) =>
                                        handleChangeQuantity(e, index)
                                      }
                                      required
                                    />
                                    {formikOrder.touched.items &&
                                    formikOrder.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikOrder.errors.items[index]
                                              ?.quantity
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      type="number"
                                      name={`items[${index}].price`}
                                      {...formikOrder.getFieldProps(
                                        `items[${index}].price`
                                      )}
                                      onChange={(e) =>
                                        handleChangePrice(e, index)
                                      }
                                      onBlur={(e) =>
                                        handleChangePrice(e, index)
                                      }
                                      required
                                    />
                                    {formikOrder.touched.items &&
                                    formikOrder.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikOrder.errors.items[index]
                                              ?.price
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      type="number"
                                      name={`items[${index}].total_price`}
                                      {...formikOrder.getFieldProps(
                                        `items[${index}].total_price`
                                      )}
                                      required
                                    />
                                    {formikOrder.touched.items &&
                                    formikOrder.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikOrder.errors.items[index]
                                              ?.total_price
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>
                                <Col sm={1}>
                                  <Button
                                    onClick={() => arrayHelpers.remove(index)}
                                    variant="danger"
                                  >
                                    <Delete />
                                  </Button>
                                </Col>
                              </Row>
                            );
                          })}

                          <Row style={{ padding: "1rem" }}>
                            <Button
                              onClick={() =>
                                arrayHelpers.push(initialValueOrder.items[0])
                              }
                              variant="primary"
                            >
                              + {t("addAnotherProduct")}
                            </Button>
                          </Row>
                        </div>
                      );
                    }}
                  />
                </FormikProvider>
              </Col>
            </Row>
          </Form>
        </Paper>
      </Col>
    </Row>
  );
};
