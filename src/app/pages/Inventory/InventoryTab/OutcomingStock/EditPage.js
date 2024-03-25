import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import Select from "react-select";

import * as Yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";
import { CalendarToday, Delete } from "@material-ui/icons";

import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../../../components/ConfirmModal";

export const EditOutcomingStockPage = ({ location, match }) => {
  const { stockId } = match.params;
  const history = useHistory();
  const { allOutlets, allUnits } = location.state;

  const [outcomingStock, setOutcomingStock] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);
  const { t } = useTranslation();

  const initialValueStock = {
    outlet_id: "",
    notes: "",
    date: "",
    items: []
  };

  const StockSchema = Yup.object().shape({
    // outlet_id: Yup.number()
    //   .integer()
    //   .min(1)
    //   .required(`${t("pleaseChooseAnOutletLocation")}`),
    // notes: Yup.string(),
    // date: Yup.string().required(`${t("pleaseInputDate")}`),
    // items: Yup.array().of(
    //   Yup.object().shape({
    //     stock_id: Yup.number()
    //       .min(1)
    //       .required(`${t("pleaseInputARawMaterial")}`),
    //     quantity: Yup.number()
    //       .min(1, `${t("minimum1Character")}`)
    //       .required(`${t("pleaseInputAQuantity ")}`),
    //     unit_id: Yup.string().required(`${t("pleaseInputAUnit")}`)
    //   })
    // )
  });

  const formikStock = useFormik({
    initialValues: initialValueStock,
    validationSchema: StockSchema,
    onSubmit: async (values) => {
      // console.log("onSubmit")
      const API_URL = process.env.REACT_APP_API_URL;

      const stockData = {
        outlet_id: outcomingStock.outlet_id,
        notes: values.notes,
        date: outcomingStock.date,
        items: values.items
      };

      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/outcoming-stock/${outcomingStock.id}`, stockData)
        disableLoading();
        history.push("/inventory/outcoming-stock");
      } catch (err) {
        console.log("Error formiknye breee", err)
        disableLoading();
      }
    }
  });

  const handleSubmit = () => {
    formikStock.submitForm()
    console.log("handleSubmit")
  }

  const validationStock = (fieldname) => {
    if (formikStock.touched[fieldname] && formikStock.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikStock.touched[fieldname] && !formikStock.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const getOutcomingStock = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/outcoming-stock/${id}`
      );
      
      console.log("outcoming stock", data.data)

      formikStock.setValues({
        notes: data.data.notes || "-",
        items: data.data.Outcoming_Stock_Products
      });
      
      data.data.date = data.data.date ? dayjs(data.data.date).format('YYYY-MM-DD HH:mm:ss') : ""

      setOutcomingStock(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getOutcomingStock(stockId);
  }, [stockId]);

  const columns = [
    {
      name: t('productName'),
      selector: "product_name",
      sortable: true
    },
    {
      name: t('quantity'),
      selector: "quantity",
      sortable: true
    },
    {
      name: t('unit'),
      selector: "unit",
      sortable: true
    }
  ];
  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  const optionsMaterial = []
    .map((item) => {
      if (item.outlet_id === outcomingStock.outlet_id) {
        return item;
      } else {
        return "";
      }
    })
    .filter((item) => item)
    .map((item) => {
      return {
        value: item.id,
        label: item.name,
        options: item.Stocks.map((val) => {
          return {
            value: val.id,
            label: `${item.name} | Stock: ${val.stock}`
          };
        })
      };
    });
  
  console.log("optionsMaterial", optionsMaterial)

  const optionsUnit = allUnits.map((item) => {
    return { value: item.id, label: item.name };
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

  const dataStock = outcomingStock
    ? outcomingStock.Outcoming_Stock_Products.map((item) => {
        return {
          product_name: item.Stock.Product ? item.Stock.Product.name : "-",
          quantity: item.quantity,
          unit: item.Unit?.name || "-",
          expired_date: item.Stock.expired_date
            ? dayjs(item.Stock.expired_date).format("DD-MMM-YYYY")
            : "-"
        };
      })
    : [];

  const handleStatus = async () => {
    try {
      enableLoading()
      const API_URL = process.env.REACT_APP_API_URL;

      const sendStock = {
        outlet_id: outcomingStock.outlet_id,
        items: outcomingStock.Outcoming_Stock_Products,
        status: 'done'
      }
      console.log("sendStock", sendStock)

      await axios.patch(`${API_URL}/api/v1/outcoming-stock/status/${outcomingStock.id}`, sendStock)
      disableLoading()
      history.push("/inventory/outcoming-stock");
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t('editOutcomingStock')}</h3>
              </div>
              <div className="headerEnd">
                <Link
                  to={{
                    pathname: "/inventory/outcoming-stock"
                  }}
                >
                  <Button variant="outline-secondary">{t('back')}</Button>
                </Link>
                <Button variant="primary" style={{ marginLeft: "0.5rem" }} onClick={handleSubmit}>
                  {t('save')}
              </Button>
              </div>
            </div>
  
            <Row
              style={{ padding: "1rem", marginBottom: "1rem" }}
              className="lineBottom"
            >
              <Col sm={3}>
                <Form.Group>
                  <Form.Label>{t('stockId')}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={outcomingStock ? outcomingStock.code : "-"}
                    disabled
                  />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>{t('location')}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={outcomingStock ? outcomingStock.Outlet?.name : "-"}
                    disabled
                  />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>{t('date')}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      outcomingStock
                        ? dayjs(outcomingStock.date).format("DD/MM/YYYY")
                        : "-"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
  
              <Col>
                <Form.Group>
                  <Form.Label>{t('notes')}:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    {...formikStock.getFieldProps('notes')}
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
                    <h6>{t('unit')}</h6>
                  </Col>
                  <Col sm={1}></Col>
                </Row>
                  <FormikProvider value={formikStock}>
                    <FieldArray
                      name="items"
                      render={(arrayHelpers) => {
                        console.log("items nya", formikStock.values.items)
                        return (
                          <div>
                            {formikStock.values.items.map((item, index) => {
                              return (
                                <Row key={index}>
                                  <Col>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        value={item.Stock.Product.name}
                                        disabled
                                      />
                                    </Form.Group>
                                    {/* <Form.Group>
                                      <Select
                                        options={optionsMaterial}
                                        // defaultValue={defaultMaterial[index]}
                                        formatGroupLabel={formatGroupLabel}
                                        name={`items[${index}].stock_id`}
                                        // className="basic-single"
                                        // classNamePrefix="select"
                                        onChange={(value) =>
                                          formikStock.setFieldValue(
                                            `items[${index}].stock_id`,
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
                                                ?.stock_id
                                            }
                                          </div>
                                        </div>
                                      ) : null}
                                    </Form.Group> */}
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
                                  <Col>
                                    <Form.Group>
                                      <Form.Control
                                        type="text"
                                        value={item.Unit?.name || "-"}
                                        disabled
                                      />
                                    </Form.Group>
                                  </Col>
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
    </>
  );
};
