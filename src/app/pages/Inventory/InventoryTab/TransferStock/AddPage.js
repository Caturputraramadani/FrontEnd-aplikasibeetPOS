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

export const AddTransferStockPage = ({ location }) => {
  const history = useHistory();
  const { allOutlets, allProducts, allUnits } = location.state;
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [startDate, setStartDate] = React.useState(new Date());
  const [hasUnit, setHasUnit] = React.useState(false);

  const initialValueStock = {
    outlet_from_id: "",
    outlet_to_id: "",
    notes: "",
    date: startDate,
    items: [
      {
        stock_id: "",
        quantity: 0,
        unit_id: ""
      }
    ]
  };

  const StockSchema = Yup.object().shape({
    outlet_from_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAnOutletOrigin")}`),
    outlet_to_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAnOutletDestination")}`),
    notes: Yup.string(),
    date: Yup.string().required(`${t("pleaseInputDate")}`),
    items: Yup.array().of(
      Yup.object().shape({
        stock_id: Yup.number()
          .min(1)
          .required(`${t("pleaseInputAProduct")}`),
        quantity: Yup.number()
          .min(1, `${t("minimum1Character")}`)
          .required(`${t("pleaseInputQuantity")}`),
        unit_id: Yup.string()
      })
    )
  });

  const formikStock = useFormik({
    initialValues: initialValueStock,
    validationSchema: StockSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      try {
        const stockData = {
          outlet_from_id: values.outlet_from_id,
          outlet_to_id: values.outlet_to_id,
          notes: values.notes,
          date: values.date,
          items: values.items
        };

        if (stockData.outlet_from_id === stockData.outlet_to_id) {
          throw new Error("origin and destination cannot be the same outlet");
        }

        enableLoading();
        await axios.post(`${API_URL}/api/v1/transfer-stock`, stockData);
        disableLoading();
        history.push("/inventory/transfer-stock");
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
      if (item.outlet_id === formikStock.values.outlet_from_id) {
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

  console.log("allUnits", allUnits)

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <Form noValidate onSubmit={formikStock.handleSubmit}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("addTransferStock")}</h3>
              </div>
              <div className="headerEnd">
                <Link to="/inventory/transfer-stock">
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
                  <Form.Label>{t("origin")}:</Form.Label>
                  <Select
                    options={optionsOutlet}
                    placeholder={t('select')}
                    name="outlet_from_id"
                    className="basic-single"
                    classNamePrefix="select"
                    onChange={(value) => {
                      formikStock.setFieldValue("outlet_from_id", value.value);
                      formikStock.setFieldValue("items", [
                        {
                          stock_id: "",
                          quantity: 0,
                          unit_id: ""
                        }
                      ]);
                    }}
                  />
                  {formikStock.touched.outlet_from_id &&
                  formikStock.errors.outlet_from_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikStock.errors.outlet_from_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("destination")}:</Form.Label>
                  <Select
                    options={optionsOutlet}
                    placeholder={t('select')}
                    name="outlet_to_id"
                    className="basic-single"
                    classNamePrefix="select"
                    onChange={(value) =>
                      formikStock.setFieldValue("outlet_to_id", value.value)
                    }
                  />
                  {formikStock.touched.outlet_to_id &&
                  formikStock.errors.outlet_to_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikStock.errors.outlet_to_id}
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
                  <Form.Label>{t("notes")}:</Form.Label>
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
                    <h6>{t("productName")}</h6>
                  </Col>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>{t("quantity")}</h6>
                  </Col>

                  {hasUnit ? (
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t("unit")}</h6>
                    </Col>
                  ) : (
                    ""
                  )}

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
                                      options={optionsProducts}
                                      placeholder={t('select')}
                                      formatGroupLabel={formatGroupLabel}
                                      name={`items[${index}].stock_id`}
                                      // className="basic-single"
                                      // classNamePrefix="select"
                                      onChange={(value) => {
                                        formikStock.setFieldValue(
                                          `items[${index}].stock_id`,
                                          value.value
                                        );
                                        formikStock.setFieldValue(
                                          `items[${index}].quantity`,
                                          1
                                        );

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
                                      name={`items[${index}].quantity`}
                                      {...formikStock.getFieldProps(
                                        `items[${index}].quantity`
                                      )}
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
