import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import dayjs from 'dayjs'
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

export const EditIncomingMaterialPage = ({ location, match }) => {
  const history = useHistory();
  const { allOutlets, allMaterials, allUnits } = location.state;
  console.log("allUnits", allUnits)
  const { materialId } = match.params;
  const { t } = useTranslation();
  const [incomingStock, setIncomingStock] = React.useState("");
  const [currency, setCurrency] = React.useState("")
  
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");

  const [startDate, setStartDate] = React.useState(new Date());

  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

    // console.log("currency nya brpw", data.data.Currency.name)
     

    setCurrency(data.data.Currency.name)
  }
  React.useEffect(() => {
    handleCurrency()
  }, [])
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

      const stockData = {
        outlet_id: incomingStock.outlet_id,
        notes: values.notes,
        date: incomingStock.date,
        items: values.items
      };

      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/incoming-stock/${incomingStock.id}`, stockData);
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

      data.data.date = data.data.date ? dayjs(data.data.date).format('YYYY-MM-DD HH:mm:ss') : ""

      setIncomingStock(data.data);
      console.log("data.data", data.data)
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getIncomingStock(materialId);
  }, [materialId]);

  const handleSubmit = () => {
    formikStock.submitForm()
    console.log("handleSubmit")
  }

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
                  pathname: "/ingredient-inventory/incoming-stock"
                }}
              >
                <Button variant="outline-secondary">{t("back")}</Button>
              </Link>

              <Button variant="primary" style={{ marginLeft: "0.5rem" }} onClick={handleSubmit}>
                Save
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
                  name={'notes'}
                  {...formikStock.getFieldProps('notes')}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row style={{ padding: "1rem" }}>
              <Col>
                <Row>
                  <Col style={{ padding: "1rem", textAlign: "center" }}>
                    <h6>{t('rawMaterialName')}</h6>
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
                                    <Form.Control
                                      type="text"
                                      value={item.Raw_Material.name}
                                      disabled
                                    />
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
                                    <Form.Control
                                      type="text"
                                      value={item.Unit?.name || "-"}
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
