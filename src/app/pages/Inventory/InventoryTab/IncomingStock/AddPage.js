import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  ButtonGroup,
  ListGroup,
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
import ConfirmModal from "../../../../components/ConfirmModal";

export const AddIncomingStockPage = ({ location }) => {
  const history = useHistory();
  const { allOutlets, allProducts, allUnits } = location.state;
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [saveAsDraft, setSaveAsDraft] = React.useState(false);

  const [startDate, setStartDate] = React.useState(new Date());
  const [expiredDate, setExpiredDate] = React.useState(new Date());
  const [hasExpired, setHasExpired] = React.useState([]);
  const [incomingStockProduct, setIncomingStockProducts] = React.useState([]);

  const [hasUnit, setHasUnit] = React.useState(false);
  const [hasExpiredDate, setHasExpiredDate] = React.useState(false);

  const initialValueStock = {
    outlet_id: "",
    notes: "",
    date: startDate,
    items: [
      {
        product_id: "",
        quantity: 0,
        unit_id: "",
        price: 0,
        total_price: 0,
        expired_date: ""
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
        product_id: Yup.number()
          .min(1)
          .required(`${t("pleaseInputAProduct")}`),
        quantity: Yup.number()
          .min(1, `${t("minimum1Character")}`)
          .required(`${t("pleaseInputAQuantity")}`),
        unit_id: Yup.string(),
        price: Yup.number()
          .min(0, `${t("minimum0Character")}`)
          .required(`${t("pleaseInputAPrice")}`),
        total_price: Yup.number()
          .min(0, `${t("minimum0Character")}`)
          .required(`${t("pleaseInputATotalPrice")}`)
      })
    )
  });

  const formikStock = useFormik({
    initialValues: initialValueStock,
    validationSchema: StockSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const stockData = {
        outlet_id: values.outlet_id,
        notes: values.notes,
        date: values.date,
        items: values.items
      };

      console.log("data yang akan disave", stockData);

      try {
        enableLoading();
        if (saveAsDraft) {
          await axios.post(`${API_URL}/api/v1/incoming-stock/draft`, stockData);
        } else {
          await axios.post(`${API_URL}/api/v1/incoming-stock`, stockData);
        }
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

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleDate = (date) => {
    setStartDate(date);
    formikStock.setFieldValue("date", date);
  };

  const handleExpiredDate = (date, idx) => {
    incomingStockProduct[idx] = date;
    setExpiredDate(date);
    formikStock.setFieldValue(`items[${idx}].expired_date`, date);
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

  const CustomInputExpiredDate = ({ value, onClick }) => {
    return <Form.Control type="text" defaultValue={value} onClick={onClick} />;
  };

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  const optionsProduct = allProducts
    .map((item) => {
      console.log("semua item", item);
      if (item.outlet_id === formikStock.values.outlet_id) {
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

  console.log("optionsProduct", optionsProduct);
  console.log("allProducts", allProducts);

  const optionsUnit = allUnits.map((item) => {
    return { value: item.id, label: item.name };
  });

  const defaultValueUnit = (index) => {
    console.log("ini unit nya", formikStock.values.items[index]);
    let result;
    optionsUnit.map((item) => {
      if (item.value === formikStock.values.items[index].unit_id) {
        result = item.label;
      }
    });
    return result;
  };

  const handleShowConfirm = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const closeConfirmModal = () => setShowConfirm(false);

  const handleConfirm = () => {
    formikStock.handleSubmit();
    closeConfirmModal();
  };

  const handleSaveDraft = () => {
    setSaveAsDraft(true);
    formikStock.submitForm();
  };

  return (
    <>
      <ConfirmModal
        title={t("confirm")}
        body={t("areYouSureWantToAddIncomingStock")}
        buttonColor="warning"
        handleClick={handleConfirm}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <Form noValidate>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>{t("addIncomingStock")}</h3>
                </div>
                <div className="headerEnd d-flex">
                  <Link to="/inventory/incoming-stock">
                    <Button variant="secondary">{t("cancel")}</Button>
                  </Link>
                  <Dropdown className="ml-2">
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                      {t("save")}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {loading ? (
                        <Spinner animation="border" variant="light" size="sm" />
                      ) : (
                        <Dropdown.Item onClick={handleShowConfirm}>{t("save")}</Dropdown.Item>
                      )}
                      <Dropdown.Item onClick={handleSaveDraft}>{t("saveAsDraft")}</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              {alert ? <Alert variant="danger">{alert}</Alert> : ""}

              <Row style={{ padding: "1rem" }} className="lineBottom">
                <Col sm={3}>
                  <Form.Group>
                    <Form.Label>{t("location")}:</Form.Label>
                    <Select
                      options={optionsOutlet}
                      name="outlet_id"
                      placeholder={t('select')}
                      className="basic-single"
                      classNamePrefix="select"
                      onChange={(value) => {
                        formikStock.setFieldValue("outlet_id", value.value);
                        formikStock.setFieldValue("items", [
                          {
                            product_id: "",
                            quantity: 0,
                            unit_id: "",
                            price: 0,
                            total_price: 0
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

                    {/* {hasUnit ? (
                      <Col style={{ padding: "1rem", textAlign: "center" }}>
                        <h6>{t("unit")}</h6>
                      </Col>
                    ) : (
                      ""
                    )} */}

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
                                        options={optionsProduct}
                                        placeholder={t('select')}
                                        name={`items[${index}].product_id`}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        onChange={(value) => {
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

                                          formikStock.setFieldValue(
                                            `items[${index}].total_price`,
                                            value.price
                                          );

                                          console.log(
                                            "total quantity",
                                            formikStock.getFieldProps(
                                              `items[${index}].quantity`
                                            ).value
                                          );

                                          const currStock = value.Stocks.find(
                                            (val) => val.is_initial
                                          );
                                          console.log("currStock", currStock);
                                          if (currStock?.expired_date) {
                                            const resDate = new Date(
                                              currStock.expired_date
                                            );
                                            const tempExpired = hasExpired;
                                            hasExpired[index] = true;
                                            setHasExpired(tempExpired);
                                            formikStock.setFieldValue(
                                              `items[${index}].expired_date`,
                                              resDate
                                            );

                                            const tempExpiredDate = incomingStockProduct;
                                            tempExpiredDate[index] = resDate;
                                            setIncomingStockProducts(
                                              tempExpiredDate
                                            );
                                            setHasExpiredDate(true);
                                          } else {
                                            console.log(
                                              "TIDAK masuk expired nya"
                                            );
                                            const tempExpired = hasExpired;
                                            hasExpired[index] = null;
                                            setHasExpired(tempExpired);
                                            formikStock.setFieldValue(
                                              `items[${index}].expired_date`,
                                              null
                                            );

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
                                  </Col>
                                  <Col>
                                    <Form.Group>
                                      <Form.Control
                                        type="number"
                                        name={`items[${index}].quantity`}
                                        {...formikStock.getFieldProps(
                                          `items[${index}].quantity`
                                        )}
                                        onChange={(e) => {
                                          handleChangeQuantity(e, index);
                                        }}
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

                                  {hasUnit ? (
                                    <Col>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          value={defaultValueUnit(index)}
                                          disabled
                                          name={`materials[${index}].unit_id`}
                                        />
                                      </Form.Group>
                                    </Col>
                                  ) : (
                                    <Col>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          value="-"
                                          disabled
                                          name="material"
                                        />
                                      </Form.Group>
                                    </Col>
                                  )}

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
                                        onBlur={(e) =>
                                          handleChangePrice(e, index)
                                        }
                                        required
                                      />
                                      {formikStock.touched.items &&
                                      formikStock.errors.items ? (
                                        <div className="fv-plugins-message-container">
                                          <div className="fv-help-block">
                                            {
                                              formikStock.errors.items[index]
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

                                  {hasExpired[index] ? (
                                    <Col>
                                      <Form.Group>
                                        <DatePicker
                                          name={`items[${index}].expired_date`}
                                          selected={incomingStockProduct[index]}
                                          onChange={(date) =>
                                            handleExpiredDate(date, index)
                                          }
                                          customInput={
                                            <CustomInputExpiredDate />
                                          }
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
    </>
  );
};
