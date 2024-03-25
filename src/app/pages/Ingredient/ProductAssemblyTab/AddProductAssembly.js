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
import ConfirmModal from "../../../components/ConfirmModal";

export const AddProductAssembly = ({ location }) => {
  const history = useHistory();
  const { allOutlets, allMaterials, allUnits } = location.state;
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [saveAsDraft, setSaveAsDraft] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [hasUnit, setHasUnit] = React.useState(false);

  const [productAssembly, setProductAssembly] = React.useState([])
  const [optionsRecipe, setOptionRecipe] = React.useState([])
  const [startDate, setStartDate] = React.useState(new Date());

  const initialValueAssembly = {
    outlet_id: "",
    notes: "",
    date: startDate,
    status: "",
    items: [
      {
        recipe_id: "",
        quantity: 0,
        expired_date: "",
        unit_id: ""
      }
    ]
  };

  const ProdductAssembly = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("minimum1Character")}`),
    notes: Yup.string(),
    date: Yup.string().required(`${t("pleaseInputDate")}`),
    items: Yup.array().of(
      Yup.object().shape({
        recipe_id: Yup.number()
          .min(1)
          .required(`${t("pleaseInputARawMaterial")}`),
        quantity: Yup.number()
          .min(1, `${t("minimum1Character")}`)
          .required(`${t("pleaseInputAQuantity ")}`)
      })
    )
  });

  const formikProductAssembly = useFormik({
    initialValues: initialValueAssembly,
    validationSchema: ProdductAssembly,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      // console.log("data yang akan dikirim", values)

      const dataAssembly = {
        outlet_id: values.outlet_id,
        notes: values.notes,
        date: values.date,
        items: values.items,
        status: "done"
      };
      try {
        enableLoading();
        if(saveAsDraft) {
          console.log("=====> masuk draft <=====")
          await axios.post(`${API_URL}/api/v1/product-assembly/draft`, dataAssembly);
        } else {
          console.log("=====> TIDAK masuk draft <=====")
          await axios.post(`${API_URL}/api/v1/product-assembly`, dataAssembly);
        }
        disableLoading();
        history.push("/ingredient-inventory");
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationStock = (fieldname) => {
    if (formikProductAssembly.touched[fieldname] && formikProductAssembly.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikProductAssembly.touched[fieldname] && !formikProductAssembly.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleDate = (date) => {
    setStartDate(date);
    formikProductAssembly.setFieldValue("date", date);
  };

  const handleChangePrice = (e, idx) => {
    const { value } = e.target;
    const total_price = formikProductAssembly.values.items[idx].quantity * value || 0;

    formikProductAssembly.setFieldValue(`items[${idx}].price`, value);
    formikProductAssembly.setFieldValue(`items[${idx}].total_price`, total_price);
  };

  const handleChangeQuantity = (e, idx) => {
    const { value } = e.target;
    const total_price = value * formikProductAssembly.values.items[idx].price || 0;

    formikProductAssembly.setFieldValue(`items[${idx}].quantity`, value);
    formikProductAssembly.setFieldValue(`items[${idx}].total_price`, total_price);
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

  const handleShowConfirm = (e) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const closeConfirmModal = () => setShowConfirm(false);

  const handleConfirm = () => {
    formikProductAssembly.handleSubmit()
    closeConfirmModal()
  };

  const handleSaveDraft = () => {
    setSaveAsDraft(true)
    formikProductAssembly.submitForm()
  }

  const handleOptionRecipe = async (outlet_id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const {data} = await axios.get(`${API_URL}/api/v1/recipe?outlet_id=${outlet_id}`)

      const resOption = data.data.map((item) => {
          if (item.outlet_id === outlet_id) {
            if(item.Product.has_assembly) {
              return { 
                value: item.id, 
                label: item.Product?.name,
                unit: {
                  id: item.Product?.unit_id,
                  name: item.Product.Unit?.name,
                }, 
              };
            }
          } else {
            return "";
          }
        })
        .filter((item) => item);

      // console.log("resOption", resOption)

      setOptionRecipe(resOption)
    } catch (error) {
      console.log("ERROR handleOptionRecipe", error)
      setOptionRecipe([])
    }
  }

  const handleExpiredDate = (date, idx) => {
    productAssembly[idx] = date
    formikProductAssembly.setFieldValue(`items[${idx}].expired_date`, date);
  };

  const CustomInputExpiredDate = ({ value, onClick }) => {
    return <Form.Control type="text" defaultValue={value} onClick={onClick} />;
  };

  const defaultValueUnit = (index) => {
    // console.log("ini unit nya", formikProductAssembly.values.items[index]);
    let result;
    optionsUnit.map((item) => {
      if (item.value === formikProductAssembly.values.items[index].unit_id) {
        result = item.label;
      }
    });
    return result;
  };

  return (
    <> 
      <ConfirmModal
        title={t("confirm")}
        body={t("areYouSureWantToAddProductAssembly")}
        buttonColor="warning"
        handleClick={handleConfirm}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />
      <Row style={{position: "relative"}}>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <Form noValidate>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>{t('addProductAssembly')}</h3>
                </div>
                <div className="headerEnd d-flex">
                  <Link to="/ingredient-inventory">
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
                  {/* <Button
                    variant="primary"
                    style={{ marginLeft: "0.5rem" }}
                    type="submit"
                  >
                    {loading ? (
                      <Spinner animation="border" variant="light" size="sm" />
                    ) : (
                      `${t("save")}`
                    )}
                  </Button> */}
                </div>
              </div>
  
              {alert ? <Alert variant="danger">{alert}</Alert> : ""}
  
              <Row style={{ padding: "1rem" }} className="lineBottom">
                <Col sm={3}>
                  <Form.Group>
                    <Form.Label>{t('locationOutlet')}:</Form.Label>
                    <Select
                      options={optionsOutlet}
                      placeholder={t('select')}
                      name="outlet_id"
                      className="basic-single"
                      classNamePrefix="select"
                      onChange={(value) => {
                        handleOptionRecipe(value.value)
                        formikProductAssembly.setFieldValue("outlet_id", value.value);
                        formikProductAssembly.setFieldValue("items", [
                          {
                            recipe_id: "",
                            quantity: 0,
                          }
                        ]);
                      }}
                    />
                    {formikProductAssembly.touched.outlet_id &&
                    formikProductAssembly.errors.outlet_id ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikProductAssembly.errors.outlet_id}
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
                    {formikProductAssembly.touched.date && formikProductAssembly.errors.date ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikProductAssembly.errors.date}
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
                      {...formikProductAssembly.getFieldProps("notes")}
                      className={validationStock("notes")}
                    />
                    {formikProductAssembly.touched.notes && formikProductAssembly.errors.notes ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikProductAssembly.errors.notes}
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
                      <h6>{t('quantity')}</h6>
                    </Col>
                    {/* <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t('expiredDate')}</h6>
                    </Col> */}
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t('unit')}</h6>
                    </Col>
                    {/* <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t('price')}</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t('priceTotal')}</h6>
                    </Col> */}
                    <Col sm={1}></Col>
                  </Row>
  
                  <FormikProvider value={formikProductAssembly}>
                    <FieldArray
                      name="items"
                      render={(arrayHelpers) => {
                        return (
                          <div>
                            {formikProductAssembly.values.items.map((item, index) => {
                              return (
                                <Row key={index}>
                                  <Col>
                                    <Form.Group>
                                      <Select
                                        options={optionsRecipe}
                                        placeholder={t('select')}
                                        name={`items[${index}].recipe_id`}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        onChange={(value) => {
                                          formikProductAssembly.setFieldValue(
                                            `items[${index}].recipe_id`,
                                            value.value
                                          )
                                          const resDate = new Date()
                                          const tempExpiredDate = productAssembly;
                                          tempExpiredDate[index] = resDate;
                                          setProductAssembly(
                                            tempExpiredDate
                                          );
                                          formikProductAssembly.setFieldValue(
                                            `items[${index}].expired_date`,
                                            resDate
                                          )
                                          // console.log("value.unit", value.unit)
                                          if (value.unit.id) {
                                            formikProductAssembly.setFieldValue(
                                              `items[${index}].unit_id`,
                                              value.unit.id
                                            );
                                            setHasUnit(true);
                                          } else {
                                            setHasUnit(false);
                                          }
                                        }}
                                      />
                                      {formikProductAssembly.touched.items &&
                                      formikProductAssembly.errors.items ? (
                                        <div className="fv-plugins-message-container">
                                          <div className="fv-help-block">
                                            {
                                              formikProductAssembly.errors.items[index]
                                                ?.recipe_id
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
                                        {...formikProductAssembly.getFieldProps(
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
                                      {formikProductAssembly.touched.items &&
                                      formikProductAssembly.errors.items ? (
                                        <div className="fv-plugins-message-container">
                                          <div className="fv-help-block">
                                            {
                                              formikProductAssembly.errors.items[index]
                                                ?.quantity
                                            }
                                          </div>
                                        </div>
                                      ) : null}
                                    </Form.Group>
                                  </Col>
                                  {/* <Col> */}
                                    {/* <Form.Group className="d-flex justify-content-center">
                                      <DatePicker
                                        name={`items[${index}].expired_date`}
                                        selected={productAssembly[index]}
                                        onChange={(date) =>
                                          handleExpiredDate(date, index)
                                        }
                                        customInput={
                                          <CustomInputExpiredDate />
                                        }
                                        required
                                      />
                                      {formikProductAssembly.touched.items &&
                                      formikProductAssembly.errors.items ? (
                                        <div className="fv-plugins-message-container">
                                          <div className="fv-help-block">
                                            {
                                              formikProductAssembly.errors.items[index]
                                                ?.expired_date
                                            }
                                          </div>
                                        </div>
                                      ) : null}
                                    </Form.Group> */}
                                  {/* </Col> */}
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
                                  ) : (
                                    <Col>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          value="-"
                                          disabled
                                          name="items"
                                        />
                                      </Form.Group>
                                    </Col>
                                  )}
                                  {/* <Col>
                                    <Form.Group>
                                      <Form.Control
                                        type="number"
                                        name={`items[${index}].price`}
                                        {...formikProductAssembly.getFieldProps(
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
                                      {formikProductAssembly.touched.items &&
                                      formikProductAssembly.errors.items ? (
                                        <div className="fv-plugins-message-container">
                                          <div className="fv-help-block">
                                            {
                                              formikProductAssembly.errors.items[index]
                                                ?.price
                                            }
                                          </div>
                                        </div>
                                      ) : null}
                                    </Form.Group>
                                  </Col> */}
                                  {/* <Col>
                                    <Form.Group>
                                      <Form.Control
                                        type="number"
                                        name={`items[${index}].total_price`}
                                        {...formikProductAssembly.getFieldProps(
                                          `items[${index}].total_price`
                                        )}
                                        required
                                      />
                                      {formikProductAssembly.touched.items &&
                                      formikProductAssembly.errors.items ? (
                                        <div className="fv-plugins-message-container">
                                          <div className="fv-help-block">
                                            {
                                              formikProductAssembly.errors.items[index]
                                                ?.total_price
                                            }
                                          </div>
                                        </div>
                                      ) : null}
                                    </Form.Group>
                                  </Col> */}
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
                                  arrayHelpers.push(initialValueAssembly.items[0])
                                }
                                variant="primary"
                              >
                                + {t('addProductAssembly')}
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
