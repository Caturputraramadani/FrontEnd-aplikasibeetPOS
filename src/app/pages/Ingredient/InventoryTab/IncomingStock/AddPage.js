import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import {
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
  Dropdown,
  ButtonGroup,
  ListGroup
} from "react-bootstrap";
import { Paper } from "@material-ui/core";
import DatePicker from "react-datepicker";
import { CalendarToday, Delete } from "@material-ui/icons";
import ConfirmModal from "../../../../components/ConfirmModal";

export const AddIncomingMaterialPage = ({ location }) => {
  const history = useHistory();
  const { allOutlets, allMaterials, allUnits } = location.state;
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [saveAsDraft, setSaveAsDraft] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)

  const [startDate, setStartDate] = React.useState(new Date());

  const initialValueStock = {
    outlet_id: "",
    notes: "",
    date: startDate,
    items: [
      {
        raw_material_id: "",
        quantity: 0,
        price: 0,
        total_price: 0
      }
    ]
  };

  const StockSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("minimum1Character")}`),
    notes: Yup.string(),
    date: Yup.string().required(`${t("pleaseInputDate")}`),
    items: Yup.array().of(
      Yup.object().shape({
        raw_material_id: Yup.number()
          .min(1)
          .required(`${t("pleaseInputARawMaterial")}`),
        quantity: Yup.number()
          .min(1, `${t("minimum1Character")}`)
          .required(`${t("pleaseInputAQuantity ")}`),
        price: Yup.number()
          .min(0, `${t("minimum0Character")}`)
          .required(`${t("pleaseInputAPrice ")}`),
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
      try {
        enableLoading();
        if(saveAsDraft) {
          await axios.post(`${API_URL}/api/v1/incoming-stock/draft`, stockData);
        } else {
          await axios.post(`${API_URL}/api/v1/incoming-stock`, stockData);
        }
        disableLoading();
        history.push("/ingredient-inventory/incoming-stock");
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

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  const optionsMaterial = allMaterials
    .map((item) => {
      if (item.outlet_id === formikStock.values.outlet_id) {
        return { value: item.id, label: item.name };
      } else {
        return "";
      }
    })
    .filter((item) => item);

  const optionsUnit = allUnits.map((item) => {
    return { value: item.id, label: item.name };
  });

  const handleShowConfirm = (e) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const closeConfirmModal = () => setShowConfirm(false);

  const handleConfirm = () => {
    formikStock.handleSubmit()
    closeConfirmModal()
  };

  const handleSaveDraft = () => {
    setSaveAsDraft(true)
    formikStock.submitForm()
  }

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
                  <h3>{t('addIncomingStock')}</h3>
                </div>
                <div className="headerEnd d-flex">
                  <Link to="/ingredient-inventory/incoming-stock">
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
                            raw_material_id: "",
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
                      <h6>{t('ingredientsName')}</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t('quantity')}</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t('unit')}</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t('price')}</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t('priceTotal')}</h6>
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
                                        options={optionsMaterial}
                                        name={`items[${index}].raw_material_id`}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        onChange={(value) =>
                                          formikStock.setFieldValue(
                                            `items[${index}].raw_material_id`,
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
                                                ?.raw_material_id
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
                                      <Select
                                        placeholder={t('select')}
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
                                                ?.unit_id
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
                                + {t('addIngredients')}
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
