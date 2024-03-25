import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
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

export const EditIncomingStockPage = ({ location, match }) => {
  const history = useHistory();
  const [hasUnit, setHasUnit] = React.useState(false);
  const [optionsProduct, setOptionsProduct] = React.useState([]);
  const [defaultProduct, setDefaultProduct] = React.useState([]);

  const { allOutlets, allProducts, allUnits } = location.state;
  console.log("allUnits", allUnits);
  const { stockId } = match.params;
  const { t } = useTranslation();
  const [incomingStock, setIncomingStock] = React.useState({});
  const [incomingStockProduct, setIncomingStockProducts] = React.useState([]);

  const [currency, setCurrency] = React.useState("");
  const [hasExpiredDate, setHasExpiredDate] = React.useState(false);
  const [expiredDate, setExpiredDate] = React.useState(new Date());

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [startDate, setStartDate] = React.useState(new Date());

  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const { data } = await axios.get(
      `${API_URL}/api/v1/business/${userInfo.business_id}`
    );

    // console.log("currency nya brpw", data.data.Currency.name)

    setCurrency(data.data.Currency.name);
  };
  React.useEffect(() => {
    handleCurrency();
  }, []);
  const initialValueStock = {
    outlet_id: "",
    notes: "",
    date: startDate,
    items: []
  };

  const StockSchema = Yup.object().shape({
    // outlet_id: Yup.number()
    //   .integer()
    //   .min(1)
    //   .required(`${t("minimum1Character")}`),
    // notes: Yup.string(),
    // date: Yup.string().required(`${t("pleaseInputDate")}`),
    // items: Yup.array().of(
    //   Yup.object().shape({
    //     raw_material_id: Yup.number()
    //       .min(1)
    //       .required(`${t("pleaseInputARawMaterial")}`),
    //     quantity: Yup.number()
    //       .min(1, `${t("minimum1Character")}`)
    //       .required(`${t("pleaseInputAQuantity ")}`),
    //     price: Yup.number()
    //       .min(0, `${t("minimum0Character")}`)
    //       .required(`${t("pleaseInputAPrice ")}`),
    //     total_price: Yup.number()
    //       .min(0, `${t("minimum0Character")}`)
    //       .required(`${t("pleaseInputATotalPrice")}`)
    //   })
    // )
  });

  const formikStock = useFormik({
    initialValues: initialValueStock,
    validationSchema: StockSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      console.log("send incomingStock", incomingStock);

      const stockData = {
        outlet_id: incomingStock.outlet_id,
        notes: values.notes,
        date: incomingStock.date,
        items: values.items
      };

      console.log("stockData", stockData);

      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/incoming-stock/${incomingStock.id}`,
          stockData
        );
        disableLoading();
        history.push("/inventory/incoming-stock");
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationStock = (fieldname) => {
    if (formikStock.touched[fieldname] && formikStock.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikStock.touched[fieldname] && !formikStock.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const CustomInputExpiredDate = ({ value, onClick }) => {
    return <Form.Control type="text" defaultValue={value} onClick={onClick} />;
  };

  const handleExpiredDate = (date, idx) => {
    incomingStockProduct[idx].expired_date = date;
    setExpiredDate(date);
    formikStock.setFieldValue(`items[${idx}].expired_date`, date);
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleDate = (date) => {
    setStartDate(date);
    formikStock.setFieldValue("date", date);
  };

  const handleChangePrice = (e, idx) => {
    const { value } = e.target;
    const total_price = formikStock.values.items[idx].quantity * value || 0;

    formikStock.setFieldValue(`items[${idx}].price`, value);
    formikStock.setFieldValue(`items[${idx}].total_price`, total_price);
  };

  const handleChangeQuantity = (e, idx) => {
    const { value } = e.target;
    const total_price = value * formikStock.values.items[idx].price || 0;

    formikStock.setFieldValue(`items[${idx}].quantity`, value);
    formikStock.setFieldValue(`items[${idx}].total_price`, total_price);
  };

  const getIncomingStock = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/incoming-stock/${id}`
      );

      formikStock.setValues({
        notes: data.data.notes,
        items: data.data.Incoming_Stock_Products
      });

      data.data.date = data.data.date
        ? dayjs(data.data.date).format("YYYY-MM-DD HH:mm:ss")
        : "";

      const optionsProduct = allProducts
        .map((item) => {
          if (item.outlet_id === data.data.outlet_id) {
            return {
              value: item.id,
              label: item.name,
              Stocks: item.Stocks,
              Unit: item.unit_id,
              price: item.price
            };
          } else {
            return "";
          }
        })
        .filter((item) => item);

      // console.log("optionsProduct", optionsProduct);

      const result = [];

      data.data.Incoming_Stock_Products.map((item) => {
        optionsProduct.find((item2) => {
          if (item2.value === item.product_id) {
            result.push({
              label: item2.label,
              value: item2.value
            });
          }
        });
      });

      data.data.Incoming_Stock_Products.map((item) => {
        if (item.expired_date) {
          const date = new Date(item.expired_date);
          item.expired_date = date;
        }
      });

      setDefaultProduct(result);
      console.log(
        "sebelum setIncomingStockProducts",
        data.data.Incoming_Stock_Products
      );
      setIncomingStockProducts(data.data.Incoming_Stock_Products);
      setIncomingStock(data.data);
    } catch (err) {
      console.log("error getIncomingStock", err);
    }
  };

  console.log("incomingStockProduct", incomingStockProduct);

  React.useEffect(() => {
    getIncomingStock(stockId);
  }, [stockId]);

  const handleSubmit = () => {
    formikStock.submitForm();
    console.log("handleSubmit");
  };

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>{t("editIncomingStock")}</h3>
            </div>
            <div className="headerEnd">
              <Link
                to={{
                  pathname: "/inventory/incoming-stock"
                }}
              >
                <Button variant="outline-secondary">{t("back")}</Button>
              </Link>

              <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={handleSubmit}
              >
                {t("save")}
              </Button>
            </div>
          </div>

          <Row
            style={{ padding: "1rem", marginBottom: "1rem" }}
            className="lineBottom"
          >
            <Col sm={3}>
              <Form.Group>
                <Form.Label>{t("stockId")}:</Form.Label>
                <Form.Control
                  type="text"
                  value={incomingStock ? incomingStock.code : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>{t("location")}:</Form.Label>
                <Form.Control
                  type="text"
                  value={incomingStock ? incomingStock.Outlet?.name : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>{t("date")}:</Form.Label>
                <Form.Control
                  type="text"
                  value={incomingStock?.date || "-"}
                  disabled
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>{t("notes")}:</Form.Label>
                <Form.Control
                  as="textarea"
                  name={"notes"}
                  {...formikStock.getFieldProps("notes")}
                />
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
                  <h6>{t("unit")}</h6>
                </Col>
                <Col style={{ padding: "1rem", textAlign: "center" }}>
                  <h6>{t("price")}</h6>
                </Col>
                <Col style={{ padding: "1rem", textAlign: "center" }}>
                  <h6>{t("priceTotal")}</h6>
                </Col>

                <Col style={{ padding: "1rem", textAlign: "center" }}>
                  <h6>{t("expiredDate")}</h6>
                </Col>

                {/* <Col sm={1}></Col> */}
              </Row>

              <FormikProvider value={formikStock}>
                <FieldArray
                  name="items"
                  render={(arrayHelpers) => {
                    return (
                      <div>
                        {formikStock.values.items.map((item, index) =>
                          defaultProduct[index] ? (
                            <Row key={index}>
                              <Col>
                                <Form.Group>
                                  <Form.Control
                                    type="text"
                                    value={item.Product.name}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              {/* <Col>
                                    <Form.Group>
                                      <Select
                                        options={optionsProduct}
                                        defaultValue={defaultProduct[index]}
                                        name={`items[${index}].product_id`}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        onChange={(value) => {
                                          // console.log("opo neh iki ??", value)
                                          formikStock.setFieldValue(
                                            `items[${index}].product_id`,
                                            value.value
                                          );
  
                                          formikStock.setFieldValue(
                                            `items[${index}].price`,
                                            value.price
                                          );
  
                                          formikStock.setFieldValue(
                                            `items[${index}].quantity`,
                                            1
                                          );
  
                                          formikStock.setFieldValue(`items[${index}].total_price`, value.price);
  
                                          console.log("total quantity", formikStock.getFieldProps(`items[${index}].quantity`).value)
  
                                          const currStock = value.Stocks.find(
                                            (val) => val.is_initial
                                          );
                                          if (currStock?.expired_date) {
                                            setHasExpiredDate(true);
                                          } else {
                                            setHasExpiredDate(false);
                                          }
                                          if (value.Unit) {
                                            formikStock.setFieldValue(
                                              `items[${index}].unit_id`,
                                              value.Unit
                                            );
                                            setHasUnit(true);
                                          } else {
                                            setHasUnit(false);
                                          }
                                        }}
                                      />
                                      {formikStock.touched.items &&
                                      formikStock.errors.items ? (
                                        <div className="fv-plugins-message-container">
                                          <div className="fv-help-block">
                                            {
                                              formikStock.errors.items[index]
                                                ?.product_id
                                            }
                                          </div>
                                        </div>
                                      ) : null}
                                    </Form.Group>
                                  </Col> */}
                              <Col>
                                <Form.Group>
                                  <Form.Control
                                    type="number"
                                    name={`items[${index}].quantity`}
                                    {...formikStock.getFieldProps(
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
                                  {formikStock.touched.items &&
                                  formikStock.errors.items ? (
                                    <div className="fv-plugins-message-container">
                                      <div className="fv-help-block">
                                        {
                                          formikStock.errors.items[index]
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
                                    type="text"
                                    value={item.Unit?.name}
                                    disabled
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group>
                                  <Form.Control
                                    type="number"
                                    name={`items[${index}].price`}
                                    {...formikStock.getFieldProps(
                                      `items[${index}].price`
                                    )}
                                    onChange={(e) =>
                                      handleChangePrice(e, index)
                                    }
                                    onBlur={(e) => handleChangePrice(e, index)}
                                    required
                                  />
                                  {formikStock.touched.items &&
                                  formikStock.errors.items ? (
                                    <div className="fv-plugins-message-container">
                                      <div className="fv-help-block">
                                        {formikStock.errors.items[index]?.price}
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
                                    {...formikStock.getFieldProps(
                                      `items[${index}].total_price`
                                    )}
                                    required
                                  />
                                  {formikStock.touched.items &&
                                  formikStock.errors.items ? (
                                    <div className="fv-plugins-message-container">
                                      <div className="fv-help-block">
                                        {
                                          formikStock.errors.items[index]
                                            ?.total_price
                                        }
                                      </div>
                                    </div>
                                  ) : null}
                                </Form.Group>
                              </Col>
                              {console.log(
                                "looping incomingStockProduct",
                                incomingStockProduct[index]
                              )}
                              {incomingStockProduct[index]?.expired_date ? (
                                <Col>
                                  <Form.Group>
                                    <DatePicker
                                      name={`items[${index}].expired_date`}
                                      selected={
                                        incomingStockProduct[index]
                                          ?.expired_date
                                      }
                                      onChange={(date) =>
                                        handleExpiredDate(date, index)
                                      }
                                      customInput={<CustomInputExpiredDate />}
                                      required
                                    />
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.expired_date
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>
                              ) : (
                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      type="text"
                                      value="-"
                                      disabled
                                      name="expired_date"
                                    />
                                  </Form.Group>
                                </Col>
                              )}
                              {/* <Col sm={1}>
                                <Button
                                  onClick={() => arrayHelpers.remove(index)}
                                  variant="danger"
                                >
                                  <Delete />
                                </Button>
                              </Col> */}
                            </Row>
                          ) : null
                        )}
                      </div>
                    );
                  }}
                />
              </FormikProvider>
            </Col>
          </Row>
        </Paper>
      </Col>
    </Row>
  );
};
