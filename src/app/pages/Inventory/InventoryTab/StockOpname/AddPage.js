import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";
import dayjs from "dayjs";
import Select from "react-select";
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

export const AddStockOpnamePage = ({ location }) => {
  const history = useHistory();
  const { allOutlets, allProducts, allUnits } = location.state;

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const { t } = useTranslation();
  const [startDate, setStartDate] = React.useState(new Date());

  const [hasUnit, setHasUnit] = React.useState(false);

  const initialValueStock = {
    outlet_id: "",
    notes: "",
    date: startDate,
    items: [
      {
        stock_id: "",
        quantity_system: 0,
        quantity_actual: 0,
        unit_id: "",
        difference: 0,
        price_system: 0,
        price_new: 0
      }
    ]
  };

  const StockSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAnOutlet")}`),
    notes: Yup.string(),
    date: Yup.string().required(`${t("pleaseInputDate")}`),
    items: Yup.array().of(
      Yup.object().shape({
        stock_id: Yup.number()
          .min(1)
          .required(`${t("pleaseInputAProduct")}`),
        quantity_system: Yup.number()
          .typeError(`${t("pleaseInputAProduct")}`)
          .required(`${t("pleaseInputAQuantitySystem")}`),
        quantity_actual: Yup.number()
          .min(0, `${t("minimum1Character")}`)
          .required(`${t("pleaseInputAQuantityActual")}`),
        unit_id: Yup.string(),
        difference: Yup.number()
          .typeError(`${t("pleaseInputAQuantityActual")}`)
          .required(`${t("pleaseInputADifference")}`),
        price_system: Yup.number()
          .typeError(`${t("pleaseInputAProduct")}`)
          .required(`${t("pleaseInputAPriceSystem")}`),
        price_new: Yup.number()
          .min(0, `${t("minimum0Character")}`)
          .required(`${t("pleaseInputAPriceActual")}`)
      })
    )
  });

  const formikStock = useFormik({
    initialValues: initialValueStock,
    validationSchema: StockSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      console.log("data yang akan dikirim", values)
      const stockData = {
        outlet_id: values.outlet_id,
        notes: values.notes,
        date: values.date,
        items: values.items
      };

      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/stock-opname`, stockData);
        disableLoading();
        history.push("/inventory/stock-opname");
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

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleDate = (date) => {
    setStartDate(date);
    formikStock.setFieldValue("date", date);
  };

  const handleSelectProduct = (val, index) => {
    const { value, Unit } = val;

    if (!value) {
      return;
    }

    if (Unit) {
      setHasUnit(true);
    } else {
      setHasUnit(false);
    }

    const currProduct = allProducts.find((item) =>
      item.Stocks.find((item) => item.id === parseInt(value))
    );
    const currStock = currProduct.Stocks.find(
      (item) => item.id === parseInt(value)
    );
    const diff = Math.abs(
      parseInt(formikStock.values.items[index].quantity_system) -
        parseInt(formikStock.values.items[index].quantity_actual)
    );

    formikStock.setFieldValue(`items[${index}].stock_id`, value);
    formikStock.setFieldValue(
      `items[${index}].quantity_system`,
      currStock.stock
    );
    formikStock.setFieldValue(`items[${index}].difference`, diff);
    formikStock.setFieldValue(
      `items[${index}].price_system`,
      currProduct.price
    );
    formikStock.setFieldValue(`items[${index}].price_new`, currProduct.price);
  };

  const handleChangeQuantity = (e, index) => {
    const { value } = e.target;

    const diff = Math.abs(
      parseInt(formikStock.values.items[index].quantity_system) -
        parseInt(value)
    );
    formikStock.setFieldValue(`items[${index}].quantity_actual`, value);
    formikStock.setFieldValue(`items[${index}].difference`, diff);
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

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  const optionsUnit = allUnits.map((item) => {
    return { value: item.id, label: item.name };
  });

  const defaultValueUnit = (index) => {
    console.log("ini unit nya", formikStock.values.items[index])
    let result;
    optionsUnit.map(item => {
      if(item.value === formikStock.values.items[index].unit_id){
        result = item.label
      }
    })
    return result
  }
  
  const optionsProducts = allProducts
    .map((item) => {
      if (item.outlet_id === formikStock.values.outlet_id) {
        return item;
      } else {
        return "";
      }
    })
    .filter((item) => item)
    .map((item) => {
      return {
        label: item.name,
        options: item.Stocks.map((val) => {
          return {
            value: val.id,
            label: `${item.name} | Stock: ${val.stock} | Expired: ${
              val.expired_date
                ? dayjs(val.expired_date).format("DD-MMM-YYYY")
                : "-"
            }`,
            Unit: item.unit_id
          };
        })
      };
    });

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  };
  const groupBadgeStyles = {
    backgroundColor: "#EBECF0",
    borderRadius: "2em",
    color: "#172B4D",
    display: "inline-block",
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: "1",
    minWidth: 1,
    padding: "0.16666666666667em 0.5em",
    textAlign: "center"
  };

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <Form noValidate onSubmit={formikStock.handleSubmit}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t('addStockOpname')}</h3>
              </div>
              <div className="headerEnd">
                <Link to="/inventory/stock-opname">
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
                  <Form.Label>{t('location')}:</Form.Label>
                  <Select
                    placeholder={t('select')}
                    options={optionsOutlet}
                    name="outlet_id"
                    className="basic-single"
                    classNamePrefix="select"
                    onChange={(value) => {
                      formikStock.setFieldValue("outlet_id", value.value);
                      formikStock.setFieldValue("items", [
                        {
                          stock_id: "",
                          quantity_system: 0,
                          quantity_actual: 0,
                          unit_id: "",
                          difference: 0,
                          price_system: 0,
                          price_new: 0
                        }
                      ]);
                    }}
                  />
                  {formikStock.touched.outlet_id &&
                  formikStock.errors.outlet_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikStock.errors.outlet_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t('date')}:</Form.Label>
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
                  {formikStock.touched.date && formikStock.errors.date ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikStock.errors.date}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>{t('notes')}:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    {...formikStock.getFieldProps("notes")}
                    className={validationStock("notes")}
                  />
                  {formikStock.touched.notes && formikStock.errors.notes ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikStock.errors.notes}
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
                    <h6>{t('productName')}</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>{t('quantitySystem')}</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>{t('quantityActual')}</h6>
                  </Col>

                  {hasUnit ? (
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>Unit</h6>
                    </Col>
                  ) : (
                    ""
                  )}

                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>{t('difference')}</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>{t('priceSystem')}</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>{t('priceNew')}</h6>
                  </Col>
                  <Col sm={1}></Col>
                </Row>

                <FormikProvider value={formikStock}>
                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => {
                      return (
                        <div>
                          {formikStock.values.items.map((item, index) => {
                            return (
                              <Row key={index}>
                                <Col>
                                  <Form.Group>
                                    <Select
                                      placeholder={t('select')}
                                      options={optionsProducts}
                                      formatGroupLabel={formatGroupLabel}
                                      name={`items[${index}].stock_id`}
                                      // className="basic-single"
                                      // classNamePrefix="select"
                                      onChange={(value) => {
                                        handleSelectProduct(value, index)

                                        if (value.Unit) {
                                          setHasUnit(true);
                                          formikStock.setFieldValue(
                                            `items[${index}].unit_id`,
                                            value.Unit
                                          );
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
                                              ?.stock_id
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
                                      name={`items[${index}].quantity_system`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].quantity_system`
                                      )}
                                      disabled
                                      required
                                    />
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.quantity_system
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
                                      name={`items[${index}].quantity_actual`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].quantity_actual`
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
                                              ?.quantity_actual
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                  </Form.Group>
                                </Col>

                                {/* {hasUnit ? (
                                  <Col>
                                    <Form.Group>
                                      <Select
                                        options={optionsUnit}
                                        name={`items[${index}].unit_id`}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        onChange={(value) =>
                                          formikStock.setFieldValue(
                                            `items[${index}].unit_id`,
                                            value.value
                                          )
                                        }
                                      />
                                      {formikStock.touched.items &&
                                      formikStock.errors.items ? (
                                        <div className="fv-plugins-message-container">
                                          <div className="fv-help-block">
                                            {
                                              formikStock.errors.items[index]
                                                .unit_id
                                            }
                                          </div>
                                        </div>
                                      ) : null}
                                    </Form.Group>
                                  </Col>
                                ) : (
                                  ""
                                )} */}

                                {hasUnit ? (
                                  <Col>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        value={defaultValueUnit(index)}
                                        disabled
                                        name={`items[${index}].unit_id`}
                                      />
                                    </Form.Group>
                                  </Col>
                                ) : null }

                                <Col>
                                  <Form.Group>
                                    <Form.Control
                                      type="number"
                                      name={`items[${index}].difference`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].difference`
                                      )}
                                      value={Math.abs(
                                        parseInt(
                                          formikStock.values.items[index]
                                            .quantity_system
                                        ) -
                                          parseInt(
                                            formikStock.values.items[index]
                                              .quantity_actual
                                          )
                                      )}
                                      disabled
                                      required
                                    />
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.difference
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
                                      name={`items[${index}].price_system`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].price_system`
                                      )}
                                      disabled
                                      required
                                    />
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.price_system
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
                                      name={`items[${index}].price_new`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].price_new`
                                      )}
                                      required
                                    />
                                    {formikStock.touched.items &&
                                    formikStock.errors.items ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikStock.errors.items[index]
                                              ?.price_new
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
                                arrayHelpers.push(initialValueStock.items[0])
                              }
                              variant="primary"
                            >
                              + {t('addAnotherProduct')}
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
