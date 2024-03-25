import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import ExportExcel from "react-html-table-to-excel";

import Pdf from "react-to-pdf";
import beetposLogo from '../../../../../images/logo beetPOS new.png'
import NumberFormat from 'react-number-format'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const DetailTransferStockPage = ({ match }) => {
  dayjs.extend(localizedFormat)
  const { t } = useTranslation();
  const ref = React.createRef()
  const { stockId } = match.params;

  const [dateTime, setDateTime] = React.useState("")
  const [transferStock, setTransferStock] = React.useState("");

  const getTransferStock = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transfer-stock/${id}`
      );
      const dt = new Date();
      setDateTime(`${
        (dt.getMonth()+1).toString().padStart(2, '0')}-${
        dt.getDate().toString().padStart(2, '0')}-${
        dt.getFullYear().toString().padStart(4, '0')}_${
        dt.getHours().toString().padStart(2, '0')}-${
        dt.getMinutes().toString().padStart(2, '0')}-${
        dt.getSeconds().toString().padStart(2, '0')}`)
      setTransferStock(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getTransferStock(stockId);
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
    },
    {
      name: t('expiredDate'),
      selector: "expired_date",
      sortable: true
    }
  ];

  const dataStock = transferStock
    ? transferStock.Transfer_Stock_Products.map((item) => {
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

  const options = {
    orientation: 'landscape'
  };
  console.log("dataStock", dataStock)
  console.log("transferStock", transferStock)

  const setFileName = () => {
    if(transferStock) {
      // Stock-Opname-Business.name-Outlet.name-[DD/MM/YYYY]-[HH:MM]
      return `Transfer-Stock_${transferStock.Business.name}_${transferStock.Origin.name}_${transferStock.Destination.name}_${dateTime}`
    }
  }
  const fileName = setFileName()
  console.log("fileName", fileName)

  return (
    <>
      <div className="style-pdf" style={{width: 1100, height: "fit-content", color: "black solid"}} ref={ref}>
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-md-6">
              <h1 className="mb-4 font-bold">{t("transferStock")}</h1>
              <div className="d-flex justify-content-between report-date">
                <h4 className="font-bold">{t("reportDate")}</h4>
                <p className="font-bold">{dayjs(transferStock.date).format("LLLL")}</p>
              </div>
              <div className="d-flex justify-content-between stock-id">
                <h4 className="font-bold">{t("stockId")}</h4>
                <p className="font-bold">{transferStock.code}</p>
              </div>
              <div className="d-flex justify-content-between wrap-content-opname">
                <div>
                  <h4 class="font-bold">{transferStock.Origin?.name}</h4>
                  <h4>-</h4>
                  <h4>{transferStock.Origin?.phone_number}</h4>
                </div>
                <div className="bulkhead"></div>
                <div>
                  <h4 class="font-bold">{transferStock.Destination?.name}</h4>
                  <h4>-</h4>
                  <h4>{transferStock.Destination?.phone_number}</h4>
                </div>
                <div className="bulkhead"></div>
                <div>
                  <h4>{t("notes")}</h4>
                  <p className="text-mute">{transferStock.notes || '-'}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex flex-column align-items-end">
              <div className="logo-wrapper">
                <img src={beetposLogo} alt="Logo BeetPOS"/>
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
                  {dataStock ? (
                    dataStock.map(item => 
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
                    )
                  ) : null }
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
                  <h3>{t('transferStockDetailSummary')}</h3>
                </div>
                <div className="headerEnd">
                  <Link
                    to={{
                      pathname: "/inventory/transfer-stock"
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
                        <th>{t("exportTransferStockResult")}</th>
                      </tr>
                      <tr>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("products")}</th>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("quantity")}</th>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("unit")}</th>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("expiredDate")}</th>
                      </tr>
                      {dataStock ? (
                      dataStock.map(item => 
                        <tr>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.unit}</td>
                          <td>{item.expired_date}</td>
                        </tr>
                      )
                    ) : null }
                    </table>
                  </div>
                  <Pdf targetRef={ref} filename={fileName} options={options} scale={1}>
                    {({ toPdf }) => <Button variant="btn btn-outline-primary mr-2" onClick={toPdf}>{t('exportToPdf')}</Button>}
                  </Pdf>
                    <Button variant="outline-secondary">{t('back')}</Button>
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
                    <Form.Label>{t('origin')}:</Form.Label>
                    <Form.Control
                      type="text"
                      value={transferStock ? transferStock.Origin.name : "-"}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>{t('destination')}:</Form.Label>
                    <Form.Control
                      type="text"
                      value={transferStock ? transferStock.Destination.name : "-"}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>{t('date')}:</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        transferStock
                          ? dayjs(transferStock.date).format("DD/MM/YYYY")
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
                      value={transferStock?.notes || "-"}
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
