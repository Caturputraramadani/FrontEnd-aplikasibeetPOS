import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'
import imageCompression from 'browser-image-compression';
import { useTranslation } from "react-i18next";
import {
  Button,
  Row,
  Col,
  Form,
  Alert,
  Spinner,
  ListGroup
} from "react-bootstrap";
import { IconButton, Paper } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import DataTable from "react-data-table-component";

import "../style.css";

export const DetailCustomerPage = ({ match }) => {
  const { customerId } = match.params;
  const { t } = useTranslation();
  const [refresh, setRefresh] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [statePage, setStatePage] = React.useState("show");
  const [preview, setPreview] = React.useState("");
  const [image, setImage] = React.useState("");
  const [previewInitial, setPreviewInitial] = React.useState("");
  const [imageInitial, setImageInitial] = React.useState("");
  const [currency, setCurrency] = React.useState("")
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

  const [customer, setCustomer] = React.useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    // no_rekening:"",
    // bank:"",
    notes: ""
  });
  const [customerInitial, setCustomerInitial] = React.useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
    // no_rekening:"",
    // bank:"",
    notes: ""
  });

  const [customerStats, setCustomerStats] = React.useState({
    total_transaction_count: "",
    total_transaction: "",
    average_transaction: "",
    favorite_product: "",
    last_visit: "",
    registration_date: "",
    points: "",
    points_spent: ""
  });

  const [customerHistory, setCustomerHistory] = React.useState([]);

  const CustomerSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputACustomerName")}`),
    email: Yup.string()
      .email()
      .required(`${t("pleaseInputAnEmail")}`),
    phone_number: Yup.number()
      .typeError("Please input a number only")
      .required(`${t("pleaseInputAPhoneNumber")}`),
    address: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAnAddress")}`),
    // no_rekening: Yup.number()
    //   .min(3, `${t("minimum3Character")}`)
    //   .typeError("Please input a number only")
    //   .required(`${t("pleaseInputABankaccountnumber")}`),
    // bank: Yup.string()
    //   .required(`${t("pleaseInputABankName")}`),
    notes: Yup.string()
  });

  const formikCustomer = useFormik({
    enableReinitialize: true,
    initialValues: customer,
    validationSchema: CustomerSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (image) {
        formData.append("profilePicture", image);
      }
      formData.append("phone_number", values.phone_number);
      formData.append("address", values.address);
      // formData.append("no_rekening", values.no_rekening);
      // formData.append("bank", values.bank);
      formData.append("notes", values.notes);

      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/customer/${customerId}`, formData);
        handleRefresh();
        disableLoading();
        setAlert("");
        setStatePage("show");
      } catch (err) {
        setAlert(err.response.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationCustomer = (fieldname) => {
    if (formikCustomer.touched[fieldname] && formikCustomer.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikCustomer.touched[fieldname] &&
      !formikCustomer.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getCustomer = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/customer/${id}`);
      setCustomer({
        name: data.data.name,
        email: data.data.email,
        phone_number: data.data.phone_number,
        address: data.data.address,
        // no_rekening: data.data.no_rekening,
        // bank: data.data.bank,
        notes: data.data.notes
      });
      setCustomerInitial({
        name: data.data.name,
        email: data.data.email,
        phone_number: data.data.phone_number,
        address: data.data.address,
        // no_rekening: data.data.no_rekening,
        // bank: data.data.bank,
        notes: data.data.notes
      });
      if (data.data.profile_picture) {
        setImage(`${API_URL}${data.data.profile_picture}`);
        setPreview(`${API_URL}${data.data.profile_picture}`);

        setImageInitial(`${API_URL}${data.data.profile_picture}`);
        setPreviewInitial(`${API_URL}${data.data.profile_picture}`);
      }

      const allTransactions = data.data.Transactions;

      const registration_date = data.data.createdAt;
      const points = data.data.points;
      const points_spent = data.data.points_spent;

      setCustomerStats({
        total_transaction_count: "",
        total_transaction: "",
        average_transaction: "",
        favorite_product: "",
        last_visit: "",
        registration_date,
        points,
        points_spent
      });

      if (allTransactions.length) {
        const allTransactionsDone = allTransactions.filter(
          (item) => item.status === "done" || item.status === "closed"
        );

        const total_transaction_count = data.data.Transactions.length;
        const total_transaction = allTransactionsDone.reduce(
          (init, curr) => (init += curr.Payment.payment_total),
          0
        );
        const average_transaction = Math.floor(
          total_transaction / total_transaction_count
        );

        const purchasedProducts = allTransactionsDone.map((trans) => {
          return trans.Transaction_Items.map((item) => item.Product.name);
        });

        const countProducts = purchasedProducts.flat(1).reduce((init, curr) => {
          init[curr] = (init[curr] || 0) + 1;
          return init;
        }, {});

        const favorite_product = Object.keys(countProducts)[0];
        const last_visit = allTransactionsDone.sort((a, b) => b.id - a.id)[0]
          .createdAt;

        setCustomerStats({
          total_transaction_count,
          total_transaction,
          average_transaction,
          favorite_product,
          last_visit,
          registration_date,
          points,
          points_spent
        });

        setCustomerHistory(allTransactionsDone);
      }
    } catch (err) {
      setAlert(err.response?.data.message || err.message);
    }
  };

  React.useEffect(() => {
    getCustomer(customerId);
  }, [refresh, customerId]);

  const handleRefresh = () => setRefresh((state) => state + 1);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleStatePage = () => {
    if (statePage === "show") {
      setStatePage("edit");
    } else {
      setCustomer(customerInitial);
      setImage(imageInitial);
      setPreview(previewInitial);
      setStatePage("show");
    }
  };
   const handleImage = (e) => {
    let preview;
    let img;

    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          // console.log("reader.result", reader.result)
          setPreview(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      console.log("img", img)
      setImage(img)
    } else {
      preview = "";
    }
  };

  const formatDate = (date) => dayjs(date).format("DD/MM/YYYY");

  const columns = [
    {
      name: "Time",
      selector: "time",
      sortable: true
    },
    {
      name: "Product",
      cell: (rows) => {
        return (
          <div>
            {rows.product.map((item, index) => {
              return (
                <p key={index} style={{ margin: 0 }}>
                  {item}
                </p>
              );
            })}
          </div>
        );
      }
    },
    {
      name: "Total Price",
      selector: "total_price",
      sortable: true
    }
  ];

  const dataTransactions = () => {
    const currHistory = [...customerHistory];
    const sliceHistory = currHistory.slice(0, 5);

    if (!sliceHistory.length) {
      return;
    }

    return sliceHistory.map((item) => {
      const product = item.Transaction_Items.map((val) => {
        return `${val.Product.name} x ${val.quantity}`;
      });

      const total_price = item.Payment.payment_total;

      return {
        time: dayjs(item.createdAt).format("DD/MM/YYYY HH:mm"),
        product,
        total_price: <NumberFormat value={total_price} displayType={'text'} thousandSeparator={true} prefix={currency} /> || 0,
        items: item.Transaction_Items
      };
    });
  };

  const ExpandableComponent = ({ data }) => {
    const head = ["Sales Type", "Addons"];
    const body = data.items.map((item) => {
      const addons = item.Transaction_Item_Addons.map((val) => val.Addon.name);
      return [item.Sales_Type.name, addons.join(",")];
    });

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              {head.map((item, index) => {
                return (
                  <Col key={index} style={{ fontWeight: "700" }}>
                    {item}
                  </Col>
                );
              })}
            </Row>
          </ListGroup.Item>
          {body.map((item, index) => {
            return (
              <ListGroup.Item key={index}>
                <Row>
                  {item.map((val, valIndex) => {
                    return <Col key={valIndex}>{val}</Col>;
                  })}
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </>
    );
  };

  return (
    <>
      <Row>
        <Col>
          <Form noValidate onSubmit={formikCustomer.handleSubmit}>
            <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>{t("customerInformation")}</h3>
                </div>

                <div className="headerEnd">
                  {statePage === "show" ? (
                    <Link to="/customer">
                      <Button
                        variant="secondary"
                        style={{ marginRight: "1rem" }}
                      >
                        {t("backToCustomerList")}
                      </Button>
                    </Link>
                  ) : (
                    ""
                  )}

                  <Button
                    variant={statePage === "show" ? "primary" : "secondary"}
                    onClick={handleStatePage}
                  >
                    {statePage === "show" ? `${t("editCustomerData")}` : `${t("cancel")}`}
                  </Button>

                  {statePage === "show" ? (
                    ""
                  ) : (
                    <Button
                      variant="primary"
                      style={{ marginLeft: "1rem" }}
                      type="submit"
                    >
                      {loading ? (
                        <Spinner animation="border" variant="light" size="sm" />
                      ) : (
                        `${t("save")}`
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {alert ? <Alert variant="danger">{alert}</Alert> : ""}

              <Row style={{ padding: "1rem" }}>
                <Col md={3}>
                  <Paper
                    elevation={2}
                    style={{
                      width: "120px",
                      height: "120px",
                      overflow: "hidden",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: `url(${preview || image})`
                    }}
                  >
                    {statePage === "edit" ? (
                      <>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="icon-button-file"
                          type="file"
                          onChange={handleImage}
                        />
                        <label htmlFor="icon-button-file">
                          <IconButton
                            color="secondary"
                            aria-label="upload picture"
                            component="span"
                            style={{
                              position: "absolute",
                              left: "-5px",
                              top: "-20px"
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </label>
                      </>
                    ) : (
                      ""
                    )}
                  </Paper>

                  {statePage === "edit" ? (
                    <p className="text-muted mt-1">
                      {t("allowedFileTypes")}: .png, .jpg, .jpeg | {t("fileSizeLimit")}: 2MB
                    </p>
                  ) : (
                    ""
                  )}
                </Col>

                <Col md={3}>
                  <div className="title">{t("customerName")}</div>
                  {statePage === "show" ? (
                    <h5 className="mb-5">{formikCustomer.values.name}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="name"
                        {...formikCustomer.getFieldProps("name")}
                        className={validationCustomer("name")}
                        required
                      />
                      {formikCustomer.touched.name &&
                      formikCustomer.errors.name ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikCustomer.errors.name}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}

                  <div className="title">{t("customerEmail")}</div>
                  {statePage === "show" ? (
                    <h5>{formikCustomer.values.email}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="email"
                        name="email"
                        {...formikCustomer.getFieldProps("email")}
                        className={validationCustomer("email")}
                        required
                      />
                      {formikCustomer.touched.email &&
                      formikCustomer.errors.email ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikCustomer.errors.email}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                  {/* Update input bank - 240522 */}
                   {/* <div className="title">{t("bankName")}</div>
                  {statePage === "show" ? (
                    <h5>{formikCustomer.values.bank}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="bank"
                        {...formikCustomer.getFieldProps("bank")}
                        className={validationCustomer("bank")}
                        required
                      />
                      {formikCustomer.touched.bank &&
                      formikCustomer.errors.bank ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikCustomer.errors.bank}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )} */}
                </Col>

                <Col md={3}>
                  <div className="title">{t("customerPhoneNumber")}</div>
                  {statePage === "show" ? (
                    <h5>{formikCustomer.values.phone_number}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="phone_number"
                        {...formikCustomer.getFieldProps("phone_number")}
                        className={validationCustomer("phone_number")}
                        required
                      />
                      {formikCustomer.touched.phone_number &&
                      formikCustomer.errors.phone_number ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikCustomer.errors.phone_number}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}

                  <div className="title">{t("customerAddress")}</div>
                  {statePage === "show" ? (
                    <h5>{formikCustomer.values.address}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="address"
                        {...formikCustomer.getFieldProps("address")}
                        className={validationCustomer("address")}
                        required
                      />
                      {formikCustomer.touched.address &&
                      formikCustomer.errors.address ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikCustomer.errors.address}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )}
                  {/* Update input no rek - 240522 */}
                  {/* <div className="title">{t("bankAccountNumber")}</div>
                  {statePage === "show" ? (
                    <h5>{formikCustomer.values.no_rekening}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="no_rekening"
                        {...formikCustomer.getFieldProps("no_rekening")}
                        className={validationCustomer("no_rekening")}
                        required
                      />
                      {formikCustomer.touched.no_rekening &&
                      formikCustomer.errors.no_rekening ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikCustomer.errors.no_rekening}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )} */}
                </Col>
              </Row>
              <Row style={{ padding: "1rem" }}>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("notes")}</Form.Label>
                    <Form.Control
                      as="textarea"
                      disabled={statePage === "show" ? true : false}
                      {...formikCustomer.getFieldProps("notes")}
                      className={validationCustomer("notes")}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Paper>
          </Form>
        </Col>
      </Row>
      {}
      <Row style={{ marginTop: "2rem" }}>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("customerStatistic")}</h3>
              </div>

              {/* <div className="headerEnd"></div> */}
            </div>

            <Row style={{ padding: "1rem" }}>
              <Col md={3}>
                <div className="title">{t("transactionNumber")}</div>
                <h5 style={{ marginBottom: "2rem" }}>
                  {customerStats.total_transaction_count
                    ? customerStats.total_transaction_count
                    : "-"}
                </h5>

                <div className="title">{t("lastVisit")}</div>
                <h5>
                  {customerStats.last_visit
                    ? formatDate(customerStats.last_visit)
                    : "-"}
                </h5>
              </Col>

              <Col md={3}>
                <div className="title">{t("totalTransaction")}</div>
                <h5 style={{ marginBottom: "2rem" }}>
                  {customerStats.total_transaction
                    ? <NumberFormat value={customerStats.total_transaction} displayType={'text'} thousandSeparator={true} prefix={currency} />
                    : "-"}
                </h5>

                <div className="title">{t("favoriteProduct")}</div>
                <h5>
                  {customerStats.favorite_product
                    ? customerStats.favorite_product
                    : "-"}
                </h5>
              </Col>

              <Col md={3}>
                <div className="title">{t("averageTransaction")}</div>
                <h5 style={{ marginBottom: "2rem" }}>
                  {customerStats.average_transaction
                    ? <NumberFormat value={customerStats.average_transaction} displayType={'text'} thousandSeparator={true} prefix={currency} />
                    : "-"}
                </h5>

                <div className="title">{t("registrationDate")}</div>
                <h5>
                  {customerStats.registration_date
                    ? formatDate(customerStats.registration_date)
                    : "-"}
                </h5>
              </Col>

              <Col md={3}>
                <div className="title">{t("remainingPoint")}</div>
                <h5 style={{ marginBottom: "2rem" }}>
                  {customerStats.points ? customerStats.points : "-"}
                </h5>

                <div className="title">{t("totalPointSpent")}</div>
                <h5>
                  {customerStats.points_spent
                    ? customerStats.points_spent
                    : "-"}
                </h5>
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>

      <Row style={{ marginTop: "2rem" }}>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("transactionHistory")}</h3>
              </div>

              {/* <div className="headerEnd"></div> */}
            </div>

            <DataTable
              noHeader
              columns={columns}
              data={dataTransactions()}
              expandableRows
              expandableRowsComponent={ExpandableComponent}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
