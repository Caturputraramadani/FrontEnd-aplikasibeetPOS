import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import rupiahFormat from "rupiah-format";
import NumberFormat from "react-number-format";
import { useTranslation } from "react-i18next";
import ExportExcel from "react-html-table-to-excel";
import ConfirmModal from "../../../../components/ConfirmModal";

import Pdf from "react-to-pdf";
import beetposLogo from "../../../../../images/logo beetPOS new.png";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const DetailIncomingStockPage = ({ match }) => {
  dayjs.extend(localizedFormat);
  const { t } = useTranslation();
  const ref = React.createRef();
  const { stockId } = match.params;
  const history = useHistory();

  const [showConfirm, setShowConfirm] = React.useState(false);
  const [dateTime, setDateTime] = React.useState("");
  const [incomingStock, setIncomingStock] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [currency, setCurrency] = React.useState("");
  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const { data } = await axios.get(
      `${API_URL}/api/v1/business/${userInfo.business_id}`
    );

    // console.log("currency nya brpw", data.data.Currency.name)

    if (data.data.Currency.name === "Rp") {
      setCurrency("Rp.");
    } else if (data.data.Currency.name === "$") {
      setCurrency("$");
    } else {
      setCurrency("Rp.");
    }
  };
  React.useEffect(() => {
    handleCurrency();
  }, []);

  const getIncomingStock = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/incoming-stock/${id}`
      );
      const dt = new Date();
      setDateTime(
        `${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt
          .getDate()
          .toString()
          .padStart(2, "0")}-${dt
          .getFullYear()
          .toString()
          .padStart(4, "0")}_${dt
          .getHours()
          .toString()
          .padStart(2, "0")}-${dt
          .getMinutes()
          .toString()
          .padStart(2, "0")}-${dt
          .getSeconds()
          .toString()
          .padStart(2, "0")}`
      );
      setIncomingStock(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getIncomingStock(stockId);
  }, [stockId]);

  const columns = [
    {
      name: t("productName"),
      selector: "product_name",
      sortable: true
    },
    {
      name: t("quantity"),
      selector: "quantity",
      sortable: true
    },
    {
      name: t("unit"),
      selector: "unit",
      sortable: true
    },
    {
      name: t("price"),
      selector: "price",
      sortable: true
    },
    {
      name: t("priceTotal"),
      selector: "total_price",
      sortable: true
    },
    {
      name: t("expiredDate"),
      selector: "expired_date",
      sortable: true
    }
  ];

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleStatus = async () => {
    try {
      enableLoading();
      const API_URL = process.env.REACT_APP_API_URL;

      const sendStock = {
        outlet_id: incomingStock.outlet_id,
        items: incomingStock.Incoming_Stock_Products,
        status: "done"
      };
      console.log("sendStock", sendStock);

      await axios.patch(
        `${API_URL}/api/v1/incoming-stock/status/${incomingStock.id}`,
        sendStock
      );
      disableLoading();
      history.push("/inventory/incoming-stock");
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowConfirm = () => {
    setShowConfirm(true);
  };

  const closeConfirmModal = () => setShowConfirm(false);

  const handleConfirm = () => {
    console.log("trigger handleConfirm");
    handleStatus();
    closeConfirmModal();
  };

  const dataStock = incomingStock
    ? incomingStock.Incoming_Stock_Products.map((item) => {
        return {
          product_name: item.Product ? item.Product.name : "",
          quantity: item.quantity,
          unit: item.Unit?.name || "-",
          price: (
            <NumberFormat
              value={item.price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={currency}
            />
          ),
          total_price: (
            <NumberFormat
              value={item.total_price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={currency}
            />
          ),
          expired_date: item.expired_date
            ? dayjs(item.expired_date).format("DD-MMM-YYYY")
            : "-"
        };
      })
    : [];

  console.log("dataStock", dataStock);
  console.log("incomingStock", incomingStock);
  const options = {
    orientation: "landscape"
  };
  const setFileName = () => {
    if (incomingStock) {
      return `Incoming-Stock_${incomingStock.Business.name}_${incomingStock.Outlet.name}_${dateTime}`;
    }
  };
  const fileName = setFileName();
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
      <div
        className="style-pdf"
        style={{ width: 1100, height: "fit-content", color: "black solid" }}
        ref={ref}
      >
        <div className="container">
          <div className="row justify-content-between mb-5">
            <div className="col-md-4">
              <h1 className="mb-4 font-bold">{t("incomingStock")}</h1>
              <div className="d-flex justify-content-between report-date">
                <h4 className="font-bold">{t("reportDate")}</h4>
                <p className="font-bold">
                  {dayjs(incomingStock.date).format("LLLL")}
                </p>
              </div>
              <div className="d-flex justify-content-between stock-id">
                <h4 className="font-bold">{t("stockId")}</h4>
                <p className="font-bold">{incomingStock.code}</p>
              </div>
              <div className="d-flex wrap-content-opname">
                <div className="content-opname-left">
                  <h4 class="font-bold">{incomingStock.Outlet?.name}</h4>
                  <h4>-</h4>
                  <h4>{incomingStock.Outlet?.phone_number}</h4>
                </div>
                <div className="bulkhead"></div>
                <div className="content-opname-left">
                  <h4>{t("notes")}</h4>
                  <p className="text-mute">{incomingStock.notes || "-"}</p>
                </div>
              </div>
            </div>
            <div className="col-md-8 d-flex flex-column align-items-end">
              <div className="logo-wrapper">
                <img src={beetposLogo} alt="Logo BeetPOS" />
              </div>
              <h5 className="text-mute">PT Lifetech Tanpa Batas</h5>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">{t("products")}</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">{t("quantity")}</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">{t("unit")}</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">{t("expiredDate")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dataStock
                    ? dataStock.map((item) => (
                        <tr>
                          <td>{item.product_name}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>{item.quantity}</td>
                          <td></td>
                          <td></td>
                          <td>{item.unit}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>{item.expired_date}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("incomingStockDetailSummary")}</h3>
              </div>
              <div className="headerEnd">
                <Button
                  className={`${incomingStock.status === "done" ? "btn-secondary" : "btn-primary"} btn`}
                  disabled={incomingStock.status === "done"}
                  onClick={handleShowConfirm}
                >
                  {t(incomingStock.status)}
                </Button>
                <Link
                  className="ml-2"
                  to={{
                    pathname: "/inventory/incoming-stock"
                  }}
                >
                  <ExportExcel
                    id="test-table-xls-button"
                    className="btn btn-outline-info mx-2"
                    table="table-to-xls"
                    filename={fileName}
                    sheet="tablexls"
                    buttonText={t("exportToExcel")}
                  />
                  <div style={{ display: "none" }}>
                    <table id="table-to-xls">
                      <tr>
                        <th>{t("exportIncomingStockResult")}</th>
                      </tr>
                      <tr>
                        <th
                          scope="col"
                          style={{
                            backgroundColor: "yellow",
                            fontWeight: "700"
                          }}
                        >
                          {t("products")}
                        </th>
                        <th
                          scope="col"
                          style={{
                            backgroundColor: "yellow",
                            fontWeight: "700"
                          }}
                        >
                          {t("quantity")}
                        </th>
                        <th
                          scope="col"
                          style={{
                            backgroundColor: "yellow",
                            fontWeight: "700"
                          }}
                        >
                          {t("unit")}
                        </th>
                        <th
                          scope="col"
                          style={{
                            backgroundColor: "yellow",
                            fontWeight: "700"
                          }}
                        >
                          {t("expiredDate")}
                        </th>
                      </tr>
                      {dataStock
                        ? dataStock.map((item) => (
                            <tr>
                              <td>{item.product_name}</td>
                              <td>{item.quantity}</td>
                              <td>{item.unit}</td>
                              <td>{item.expired_date}</td>
                            </tr>
                          ))
                        : null}
                    </table>
                  </div>
                  <Pdf
                    targetRef={ref}
                    filename={fileName}
                    options={options}
                    scale={1}
                  >
                    {({ toPdf }) => (
                      <Button
                        variant="btn btn-outline-primary mr-2"
                        onClick={toPdf}
                      >
                        {t("exportToPdf")}
                      </Button>
                    )}
                  </Pdf>
                  <Button variant="outline-secondary">{t("back")}</Button>
                </Link>

                {/* <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                  Download
                </Button> */}
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
                    value={
                      incomingStock
                        ? dayjs(incomingStock.date).format("DD/MM/YYYY")
                        : "-"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>{t("notes")}:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={incomingStock?.notes || "-"}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataStock}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
