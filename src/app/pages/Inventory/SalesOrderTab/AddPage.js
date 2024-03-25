import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import dayjs from 'dayjs'

import {
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
  ButtonGroup,
  Dropdown
} from "react-bootstrap";
import { Paper } from "@material-ui/core";
import DatePicker from "react-datepicker";
import { CalendarToday, Delete } from "@material-ui/icons";

export const AddSalesOrderPage = ({ location }) => {
  const history = useHistory();
  const { allOutlets, allProducts, allCustomers } = location.state;

  console.log("allCustomers", allCustomers)

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [startDate, setStartDate] = React.useState(new Date());
  const [optionProduct, setOptionProduct] = React.useState([])
  const [saveAsDraft, setSaveAsDraft] = React.useState(false);
  const [paymentMethods, setPaymentMethods] = React.useState([])

  const user_info = JSON.parse(localStorage.getItem('user_info'))
  const API_URL = process.env.REACT_APP_API_URL;

  const initialValueOrder = {
    outlet_id: "",
    payment_method_id: "",
    customer_id: "",
    so_number: "",
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
    customer_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseSupplier")}`),
    so_number: Yup.string().nullable(),
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

  const handleSalesType =  async (API_URL) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/sales-type/guest?business_id=${user_info.business_id}`)
      let result = {}
      data.data.map(value => {
        if(!value.is_booking || !value.require_table || value.is_delivery) {
          result = value
        }
        if(!value.is_booking || !value.require_table || !value.is_delivery) {
          result = value
        }
      })
      return result
    } catch (error) {
      console.log(error)
    }
  }

  const handleCharge = async (API_URL, outlet_id) => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/tax`)
      console.log("handleCharge", data.data)
      let result = []
      data.data.map(value => {
        if(value.tax_type_id === 2) {
          result.push(value)
        }
      })
      const reduce = result.reduce((acc, curr) => {
        return acc + curr.value
      }, 0)
      return reduce
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleTax = async (API_URL, outlet_id) => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/tax`)
      let result = []
      data.data.map(value => {
        if(value.tax_type_id === 1) {
          result.push(value)
        }
      })
      const reduce = result.reduce((acc, curr) => {
        return acc + curr.value
      }, 0)
      return reduce
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const formikOrder = useFormik({
    initialValues: initialValueOrder,
    validationSchema: OrderSchema,
    onSubmit: async (values) => {
      const salesType = await handleSalesType(API_URL)
      const charge = await handleCharge(API_URL, values.outlet_id)
      const tax = await handleTax(API_URL, values.outlet_id)

      console.log("salesType", salesType)
      console.log("charge", charge)

      const tempItems = []

      values.items.map(value => {
        const price_service = charge ? Math.round(value.total_price * parseFloat(charge / 100)) : 0
        console.log("price_service", price_service)
        console.log("charge", charge)
        console.log("value.total_price", value.total_price)
        tempItems.push({
          sales_type_id: salesType.id,
          product_id: value.product_id,
          quantity: value.quantity,
          price_product: value.price,
          price_discount: 0,
          price_service,
          price_addons_total: 0,
          price_total: (value.price + 0 + price_service) * value.quantity,
          notes: "",
          price: value.price,
          total_price: (value.price + 0 + price_service) * value.quantity
        })
      })

      console.log("tempItems", tempItems)

      const orderData = {
        outlet_id: values.outlet_id,
        customer_id: values.customer_id,
        notes: values.notes,
        date: values.date,
        items: values.items
      };
      orderData.items = tempItems

      orderData.payment_method_id = values.payment_method_id

      if (values.so_number) {
        orderData.so_number = values.so_number;
      }

      console.log("data yang akan dikirim", values)
      
      try {
        enableLoading();
        // await axios.post(`${API_URL}/api/v1/purchase-order`, orderData);
        if(saveAsDraft) {
          orderData.status = 'pending'
          console.log("orderData", orderData)
          await axios.post(`${API_URL}/api/v1/sales-order/create-development`, orderData);
        } else {
          const sumTotalPrice = tempItems.reduce((acc, curr) => {
            return acc + curr.price_total
          }, 0)
          const PaymentTax = tax ? Math.round(sumTotalPrice * parseFloat(tax / 100)) : 0
          const PaymentService = charge ? Math.round(sumTotalPrice * parseFloat(charge / 100)) : 0
          const receipt_id = 'S.O' +
          values.outlet_id +
          ':' +
          values.customer_id || null +
          ':' +
          dayjs(new Date()).format('YYYY/MM/DD:HH:mm:ss')

          orderData.status = 'done'
          orderData.amount = sumTotalPrice
          orderData.payment_change = 0
          orderData.payment_discount = 0
          orderData.payment_tax = PaymentTax
          orderData.payment_service = PaymentService
          orderData.payment_total = sumTotalPrice + PaymentTax + PaymentService - 0
          orderData.custom_price = 0
          orderData.custom_price_tax = 0
          orderData.promo  = null
          orderData.receipt_id  = receipt_id
          // orderData.items = tempItems
          orderData.status = 'done'
          console.log("orderData", orderData)
          //           await axios.post(`${API_URL}/api/v1/sales-order/create-development`, orderData);
          await axios.post(`${API_URL}/api/v1/sales-order/create-development`, orderData);
          await axios.post(`${API_URL}/api/v1/transaction`, orderData);
        }
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

  const handleOptionPayment = async(outlet_id) => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/payment-method/development?businessId=${user_info.business_id}`)
      console.log("data.data.rows", data.data.rows)
      if(data.data.rows) {
        const filterOutlet = data.data.rows.filter(value => {
          return value.outlet_id === parseInt(outlet_id) || value.outlet_id === null
        })
        const dataArray = filterOutlet
        const resOption = dataArray.map(value => {
          return {
            value: value.id,
            label: value.name
          }
        })
        console.log("resOption", resOption)
        setPaymentMethods(resOption)
      }
    } catch (error) {
      console.log(error)
    }
  }

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

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  const handleSaveDraft = () => {
    setSaveAsDraft(true);
    formikOrder.submitForm();
  };

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <Form noValidate onSubmit={formikOrder.handleSubmit}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("addSalesOrder")}</h3>
              </div>
              <div className="headerEnd">
                <Link to="/inventory">
                  <Button variant="secondary">{t("cancel")}</Button>
                </Link>
                <Dropdown as={ButtonGroup} style={{ marginLeft: "0.5rem" }}>
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

                  <Dropdown.Toggle split variant="primary" />

                  <Dropdown.Menu>
                    <Dropdown.Item
                      variant="primary"
                      onClick={handleSaveDraft}
                    >
                      {t("saveAsDraft")}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {alert ? <Alert variant="danger">{alert}</Alert> : ""}

            <Row style={{ padding: "1rem" }} className="lineBottom">
              <Col sm={3}>
                <Form.Group>
                  <Form.Label>{t("soNumber")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="so_number"
                    {...formikOrder.getFieldProps("so_number")}
                    className={validationOrder("so_number")}
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
                      formikOrder.setFieldValue("so_number", "");
                    }}
                  />
                  {formikOrder.touched.so_number &&
                  formikOrder.errors.so_number ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOrder.errors.so_number}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("outlet")}</Form.Label>
                  <Select
                    options={optionsOutlet}
                    placeholder={t('select')}
                    name="outlet_id"
                    className="basic-single"
                    classNamePrefix="select"
                    onChange={(value) =>{
                      handleOptionPayment(value.value)
                      const filterProduct = allProducts.filter(
                        (val) => val.outlet_id === parseInt(value.value)
                      )
                      if(filterProduct) {
                        const optionProduct = filterProduct.map(value => {
                          return {
                            value: value.id,
                            label: value.name
                          }
                        })
                        setOptionProduct(optionProduct)
                      }
                      formikOrder.setFieldValue("outlet_id", value.value)
                    }}
                  />
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
                  <Form.Label>{t("paymentMethod")}</Form.Label>
                  <Select
                    options={paymentMethods}
                    placeholder={t('select')}
                    name="payment_method_id"
                    className="basic-single"
                    classNamePrefix="select"
                    onChange={(value) =>{
                      formikOrder.setFieldValue("payment_method_id", value.value)
                    }}
                  />
                  {formikOrder.touched.payment_method_id &&
                  formikOrder.errors.payment_method_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOrder.errors.payment_method_id}
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
                  <Form.Label>{t("customer")}:</Form.Label>
                  <Form.Control
                    as="select"
                    name="outlet_to_id"
                    {...formikOrder.getFieldProps("customer_id")}
                    className={validationOrder("customer_id")}
                    required
                  >
                    <option value={""} disabled hidden>
                      {t("chooseCustomer")}
                    </option>
                    {allCustomers.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {/* {`${item.name}  -  ${item.address ? item.address : null}  -  ${item.email ? item.email : null}`} */}
                          {item.name} - {item.address ? item.address : null}  -  {item.email ? item.email : null}
                        </option>
                      );
                    })}
                  </Form.Control>
                  {formikOrder.touched.customer_id &&
                  formikOrder.errors.customer_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikOrder.errors.customer_id}
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
                                    <Select
                                      options={optionProduct}
                                      placeholder={t('select')}
                                      name={`items[${index}].product_id`}
                                      className="basic-single"
                                      classNamePrefix="select"
                                      onChange={(value) =>{
                                        const selectProduct = allProducts.find(
                                          (val) => val.id === parseInt(value.value)
                                        )
                                        formikOrder.setFieldValue(
                                          `items[${index}].product_id`,
                                          value.value
                                        );
                                        formikOrder.setFieldValue(
                                          `items[${index}].quantity`,
                                          1
                                        );
                                        formikOrder.setFieldValue(
                                          `items[${index}].price`,
                                          selectProduct.price
                                        )
                                        formikOrder.setFieldValue(
                                          `items[${index}].total_price`,
                                          selectProduct.price
                                        )
                                      }}
                                    />
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
