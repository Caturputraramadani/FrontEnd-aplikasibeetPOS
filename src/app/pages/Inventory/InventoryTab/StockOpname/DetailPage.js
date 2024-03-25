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

import rupiahFormat from "rupiah-format";

import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const DetailStockOpnamePage = ({ match }) => {
  dayjs.extend(localizedFormat)
  const { t } = useTranslation();
  const ref = React.createRef()
  const { stockId } = match.params;
  const [dateTime, setDateTime] = React.useState("")
  const [currency, setCurrency] = React.useState("")
  const handleCurrency = async () => {
      const API_URL = process.env.REACT_APP_API_URL;
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
  
      const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)
  
      // console.log("currency nya brpw", data.data.Currency.name)
       
  
      if (data.data.Currency.name === 'Rp') {
        setCurrency("Rp.")
      } else if (data.data.Currency.name === '$') {
        setCurrency("$")
      } else {
        setCurrency("Rp.")
      }
    }
    React.useEffect(() => {
      handleCurrency()
    }, [])
  
  const [stockOpname, setOpnameStock] = React.useState("");

  const getStockOpname = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/stock-opname/${id}`);
      const dt = new Date();
      setDateTime(`${
        (dt.getMonth()+1).toString().padStart(2, '0')}-${
        dt.getDate().toString().padStart(2, '0')}-${
        dt.getFullYear().toString().padStart(4, '0')}_${
        dt.getHours().toString().padStart(2, '0')}-${
        dt.getMinutes().toString().padStart(2, '0')}-${
        dt.getSeconds().toString().padStart(2, '0')}`)
      setOpnameStock(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getStockOpname(stockId);
  }, [stockId]);

  const columns = [
    {
      name: t('productName'),
      selector: "product_name",
      sortable: true
    },
    {
      name: t('quantitySystem'),
      selector: "quantity_system",
      sortable: true
    },
    {
      name: t('quantityActual'),
      selector: "quantity_actual",
      sortable: true
    },
    {
      name: t('unit'),
      selector: "unit",
      sortable: true
    },
    {
      name: t('difference'),
      selector: "difference",
      sortable: true
    },
    {
      name: t('priceSystem'),
      selector: "price_system",
      sortable: true
    },
    {
      name: t('priceNew'),
      selector: "price_new",
      sortable: true
    }
  ];

  const dataStock = stockOpname
    ? stockOpname.Stock_Opname_Products.map((item) => {
        return {
          product_name: item.Stock.Product ? item.Stock.Product.name : "-",
          quantity_system: item.quantity_system,
          quantity_actual: item.quantity_actual,
          unit: item.Unit?.name || "-",
          difference: item.difference,
          price_system: <NumberFormat value={item.price_system} displayType={'text'} thousandSeparator={true} prefix={currency} />,
          price_new: <NumberFormat value={item.price_new} displayType={'text'} thousandSeparator={true} prefix={currency} />
        };
      })
    : [];

  const options = {
    orientation: 'landscape'
  };

  console.log("list stock", dataStock)
  console.log("stockOpname", stockOpname)
  const setFileName = () => {
    if(stockOpname) {
      // Stock-Opname-Business.name-Outlet.name-[DD/MM/YYYY]-[HH:MM]
      return `Stock-Opname_${stockOpname.Business.name}_${stockOpname.Outlet.name}_${dateTime}`
    }
  }
  const fileName = setFileName()
  console.log("fileName", fileName)

  return (
    <>
      <div className="style-pdf" style={{width: 1100, height: "fit-content", color: "black solid"}} ref={ref}>
        <div className="container">
          <div className="row justify-content-between mb-5">
            <div className="col-md-6">
              <h1 className="mb-4 font-bold">{t("stockOpname")}</h1>
              <div className="d-flex justify-content-between report-date">
                <h4 className="font-bold">{t("reportDate")}</h4>
                <p className="font-bold">{dayjs(stockOpname.date).format("LLLL")}</p>
              </div>
              <div className="d-flex justify-content-between stock-id">
                <h4 className="font-bold">{t("stockId")}</h4>
                <p className="font-bold">{stockOpname.code}</p>
              </div>
              <div className="d-flex wrap-content-opname">
                <div className="content-opname-left">
                  <h4 class="font-bold">{stockOpname.Outlet?.name}</h4>
                  <h4>-</h4>
                  <h4>{stockOpname.Outlet?.phone_number}</h4>
                </div>
                <div className="bulkhead"></div>
                <div className="content-opname-left">
                  <h4>{t("notes")}</h4>
                  <p className="text-mute">{stockOpname.notes || '-'}</p>
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
                    <th scope="col">{t("quantitySystem")}</th>
                    <th scope="col">{t("quantityActual")}</th>
                    <th scope="col">{t("unit")}</th>
                    <th scope="col">{t("difference")}</th>
                    <th scope="col">{t("priceSystem")}</th>
                    <th scope="col">{t("priceNew")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dataStock ? (
                    dataStock.map(item => 
                      <tr>
                      <td>{item.product_name}</td>
                      <td>{item.quantity_system}</td>
                      <td>{item.quantity_actual}</td>
                      <td>{item.unit}</td>
                      <td>{item.difference}</td>
                      <td>{item.price_new.props.value}</td>
                      <td>{item.price_system.props.value}</td>
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
              <h3>{t('stockOpnameDetailSummary')}</h3>
            </div>
            <div className="headerEnd">
              <Link
                to={{
                  pathname: "/inventory/stock-opname"
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
                    <th>{t("exportStockOpnameResult")}</th>
                  </tr>
                  <tr>
                    <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("productName")}</th>
                    <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("quantitySystem")}</th>
                    <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("quantityActual")}</th>
                    <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("unit")}</th>
                    <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("difference")}</th>
                    <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("priceSystem")}</th>
                    <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("priceNew")}</th>
                  </tr>
                  {dataStock ? (
                    dataStock.map(item => 
                      <tr>
                      <td>{item.product_name}</td>
                      <td>{item.quantity_system}</td>
                      <td>{item.quantity_actual}</td>
                      <td>{item.unit}</td>
                      <td>{item.difference}</td>
                      <td>{item.price_new.props.value}</td>
                      <td>{item.price_system.props.value}</td>
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
                <Form.Label>{t('stockId')}:</Form.Label>
                <Form.Control
                  type="text"
                  value={stockOpname ? stockOpname.code : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>{t('location')}:</Form.Label>
                <Form.Control
                  type="text"
                  value={stockOpname ? stockOpname.Outlet?.name : "-"}
                  disabled
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>{t('date')}:</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    stockOpname
                      ? dayjs(stockOpname.date).format("DD/MM/YYYY")
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
                  value={stockOpname?.notes || "-"}
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
