import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import dayjs from 'dayjs'
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

export const EditProductAssembly = ({ location, match }) => {
  const { materialId } = match.params;

  const history = useHistory();
  const { allOutlets, allMaterials, allUnits } = location.state;
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [saveAsDraft, setSaveAsDraft] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [hasUnit, setHasUnit] = React.useState(false);

  const [currProductAssemblyItems, setCurrProductAssemblyitems] = React.useState([])
  const [currProductAssembly, setCurrProductAssembly] = React.useState({})

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
    // outlet_id: Yup.number()
    //   .integer()
    //   .min(1)
    //   .required(`${t("minimum1Character")}`),
    // notes: Yup.string(),
    // date: Yup.string().required(`${t("pleaseInputDate")}`),
    // items: Yup.array().of(
    //   Yup.object().shape({
    //     recipe_id: Yup.number()
    //       .min(1)
    //       .required(`${t("pleaseInputARawMaterial")}`),
    //     quantity: Yup.number()
    //       .min(1, `${t("minimum1Character")}`)
    //       .required(`${t("pleaseInputAQuantity ")}`)
    //   })
    // )
  });

  const formikProductAssembly = useFormik({
    initialValues: initialValueAssembly,
    validationSchema: ProdductAssembly,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      console.log("data yang akan dikirim", values)

      const dataAssembly = {
        outlet_id: currProductAssembly.outlet_id,
        notes: values.notes,
        date: currProductAssembly.date,
        items: values.items
      };
      console.log("dataAssembly", dataAssembly)
      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/product-assembly/${materialId}`, dataAssembly);
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

  const getProductAssembly = async (materialId) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/product-assembly/${materialId}`)  
      formikProductAssembly.setValues({
        notes: data.data.notes || "-",
        items: data.data.Product_Assembly_Items
      });
      data.data.date = data.data.date ? dayjs(data.data.date).format('YYYY-MM-DD HH:mm:ss') : "";
      data.data.Product_Assembly_Items.map(value => {
        const format = new Date(value.expired_date)
        value.expired_date = format
      })
      setCurrProductAssemblyitems(data.data.Product_Assembly_Items)
      setCurrProductAssembly(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    getProductAssembly(materialId)
  }, [materialId])

  const closeConfirmModal = () => setShowConfirm(false);

  const handleConfirm = () => {
    console.log("handleConfirm")
    formikProductAssembly.handleSubmit()
    closeConfirmModal()
  };

  const handleOptionRecipe = async (outlet_id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const {data} = await axios.get(`${API_URL}/api/v1/recipe?outlet_id=${outlet_id}`)

      const resOption = data.data.map((item) => {
          if (item.outlet_id === outlet_id) {
            return { 
              value: item.id, 
              label: item.Product?.name,
              unit: {
                id: item.Product?.unit_id,
                name: item.Product.Unit?.name,
              }, 
            };
          } else {
            return "";
          }
        })
        .filter((item) => item);

      console.log("resOption", resOption)

      setOptionRecipe(resOption)
    } catch (error) {
      console.log("ERROR handleOptionRecipe", error)
      setOptionRecipe([])
    }
  }

  const handleExpiredDate = (date, idx) => {
    currProductAssemblyItems[idx].expired_date = date
    formikProductAssembly.setFieldValue(`items[${idx}].expired_date`, date);
  };

  const CustomInputExpiredDate = ({ value, onClick }) => {
    return <Form.Control type="text" defaultValue={value} onClick={onClick} />;
  };

  const defaultValueUnit = (index) => {
    console.log("ini unit nya", formikProductAssembly.values.items[index]);
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
                  <h3>{t('editProductAssembly')}</h3>
                </div>
                <div className="headerEnd d-flex">
                  <Link to="/ingredient-inventory">
                    <Button variant="secondary">{t("cancel")}</Button>
                  </Link>
                  <Button
                    variant="primary"
                    style={{ marginLeft: "0.5rem" }}
                    type="submit"
                    onClick={handleShowConfirm}
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
                    <Form.Label>{t("location")}:</Form.Label>
                    <Form.Control
                      type="text"
                      value={currProductAssembly ? currProductAssembly.Outlet?.name : "-"}
                      disabled
                    />
                  </Form.Group>
  
                  <Form.Group>
                    <Form.Label>{t("date")}:</Form.Label>
                    <Form.Control
                      type="text"
                      value={currProductAssembly?.date || "-"}
                      disabled
                    />
                  </Form.Group>
                </Col>
  
                <Col>
                  <Form.Group>
                    <Form.Label>{t("notes")}:</Form.Label>
                    <Form.Control
                      as="textarea"
                      name={'notes'}
                      {...formikProductAssembly.getFieldProps('notes')}
                    />
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
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t('expiredDate')}</h6>
                    </Col>
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
                                      <Form.Control
                                        type="text"
                                        value={item.Product?.name}
                                        disabled
                                      />
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
                                  {currProductAssemblyItems[index]?.expired_date ? (  
                                    <Col>
                                      <Form.Group>
                                        <DatePicker
                                          name={`items[${index}].expired_date`}
                                          selected={currProductAssemblyItems[index]?.expired_date}
                                          onChange={(date) =>
                                            handleExpiredDate(date, index)
                                          }
                                          customInput={<CustomInputExpiredDate />}
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
                                  {/* <Col sm={1}>
                                    <Button
                                      onClick={() => arrayHelpers.remove(index)}
                                      variant="danger"
                                    >
                                      <Delete />
                                    </Button>
                                  </Col> */}
                                </Row>
                              );
                            })}
  
                            {/* <Row style={{ padding: "1rem" }}>
                              <Button
                                onClick={() =>
                                  arrayHelpers.push(initialValueAssembly.items[0])
                                }
                                variant="primary"
                              >
                                + {t('addProductAssembly')}
                              </Button>
                            </Row> */}
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
