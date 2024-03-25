import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'
import "../style.css";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  Paper
} from "@material-ui/core";
import { FeatureReport } from './components/FeatureReport'
import {
  Row,
  Col
} from "react-bootstrap";

const COGSReport = () => {
  const [mdr, setMdr] = React.useState("")

  const [refresh, setRefresh] = React.useState(0)
  const handleRefresh = () => setRefresh((state) => state + 1)

  const [selectedOutlet, setSelectedOutlet] = React.useState({
    id: "",
    name: "All Outlet"
  })
  const [startDate, setStartDate] = React.useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(dayjs().format("YYYY-MM-DD"));
  const [endDateFilename, setEndDateFilename] = React.useState("");
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());
  const [tabData, setTabData] = React.useState({
    no: 10,
    table: "table-cogs",
    filename: `laporan-COGS_${startDate}-${endDateFilename}`,
  })
  const [status, setStatus] = React.useState("");

  const { t } = useTranslation();
  const [currency, setCurrency] = React.useState("")
  const handleCurrency = async () => {
      const API_URL = process.env.REACT_APP_API_URL;
      const userInfo = JSON.parse(localStorage.getItem("user_info"));

      const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

      console.log("currency nya brpw", data.data.Currency.name)
       

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

  const [COGSTransaction, setCOGSTransaction] = useState([]);
  const getDataCOGS = async (id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = id ? `?outlet_id=${id}&` : "?";
    if (start_range === end_range) {
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }

    if (new Date(start_range) > new Date(end_range)) {
      start_range = dayjs(start_range)
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/cogs${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setCOGSTransaction(renderTable(data.data));
    } catch (err) {
      if (err.response.status === 404) {
        setCOGSTransaction([]);
      }
    }
  };
  function sum(input) {
    if (toString.call(input) !== "[object Array]") return false;

    var total = 0;
    for (var i = 0; i < input.length; i++) {
      if (isNaN(input[i])) {
        continue;
      }
      total += Number(input[i]);
    }
    return total;
  }
  const handlePercentage = (data) => {
    data = data.map((i) => {
      return (i.product_sold_price / i.product_hpp) * 100;
    });
    let hasil = sum(data) / data.length;
    if (hasil === NaN) {
      return "0";
    } else {
      return Math.round(hasil);
    }
  };
  const renderTable = (array) => {
    let final = [];
    let seen = {};
    array = array.filter((entry) => {
      let previous;
      if (seen.hasOwnProperty(entry.product_name)) {
        previous = seen[entry.product_name];
        previous.quantity.push(entry.sold_quantity);
        return false;
      }

      if (!Array.isArray(entry.array)) {
        entry.product = [entry.product_name];
        entry.quantity = [entry.sold_quantity];
      }

      seen[entry.product] = entry;

      return true;
    });

    array.map((i) => {
      final.push({
        product: i.product_name,
        category: i.category,
        kuantitas: sum(i.quantity),
        product_hpp: i.product_hpp * sum(i.quantity),
        product_sold_price: i.product_sold_price * sum(i.quantity),
        profit:
          i.product_sold_price * sum(i.quantity) -
          i.product_hpp * sum(i.quantity)
      });
    });
    return final;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getDataCOGS(selectedOutlet.id, startDate, endDate);
    setTabData({
      ...tabData,
      filename: `laporan-COGS_${startDate}-${endDateFilename}`
    })
  }, [selectedOutlet, startDate, endDate, endDateFilename, mdr]);

  const handleStartDate = (date) => setStartDate(date)
  const handleEndDate = (date) => setEndDate(date)
  const handleEndDateFilename = (date) => setEndDateFilename(date)
  const handleSelectedOutlet = (outlet) => setSelectedOutlet(outlet)
  const handleSelectStatus = (status) => setStatus(status.target.value)
  const handleTimeStart = (time) => setStartTime(time)
  const handleTimeEnd = (time) => setEndTime(time)
  const handleMdr = (params) => setMdr(params)

  // Update Table ke react-data-table-component
  // const columns =[
  //   {
  //     name: `${t('soldQuantity')}`,
  //     selector: "soldQuantity",
  //     sortable: true,
  //   }
  // ]

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <FeatureReport
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              handleMdr={handleMdr}
              tabData={tabData}
              handleEndDateFilename={handleEndDateFilename}
              handleSelectedOutlet={handleSelectedOutlet}
              titleReport="cogsReport"
              handleSelectStatus={handleSelectStatus}
              handleTimeStart={handleTimeStart}
              handleTimeEnd={handleTimeEnd}
              stateShowMdr={true}
            />
            <div style={{ display: "none" }}>
              <table id="table-cogs">
                <thead>
                  <tr>
                    <th>{t("cogsReport")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
                <thead>
                  <tr>
                    <th>{t("outlet")}</th>
                    <td>
                      {selectedOutlet.id === " " ||
                      selectedOutlet.id === null ||
                      selectedOutlet.id === undefined
                        ? "Semua Outlet"
                        : selectedOutlet.name}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
                <thead>
                  <tr>
                    <th>{t("date")}</th>
                    <td>{`${startDate} - ${endDateFilename}`}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
                <thead>
                  <tr>
                    <th>{t("productName")}</th>
                    <th>{t("category")}</th>
                    <th>{t("amountSold")}</th>
                    <th>{t("costOfGoodsSold")}</th>
                    <th>{t("sellingPrice")}</th>
                    <th>{t("profit")}</th>
                    {/* <th>{t("%ProfitperItem")}</th> */}
                  </tr>
                </thead>
                <tbody>
                  {COGSTransaction.length > 0 ? (
                    COGSTransaction.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.product}</td>
                          <td>{item.category}</td>
                          <td>{item.kuantitas}</td>
                          <td>{item.product_hpp}</td>
                          <td>{item.product_sold_price}</td>
                          <td>{item.profit}</td>
                          {/* <td>{`${Math.round(
                          (item.profit / item.product_hpp) * 100
                        )}%`}</td> */}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td>{t("dataNotFound")}</td>
                    </tr>
                  )}
                  <tr>
                    <th>{t("grandTotal")}</th>
                    <th></th>
                    <th>{sumReports(COGSTransaction, "kuantitas")} </th>
                    <th>{sumReports(COGSTransaction, "product_hpp")} </th>
                    <th>{sumReports(COGSTransaction, "product_sold_price")} </th>
                    <th>{sumReports(COGSTransaction, "profit")} </th>
                    {/* <th>{`${handlePercentage(COGSTransaction)}%`}</th>    */}
                  </tr>
                </tbody>
              </table>
            </div>
            <Table>
              <thead>
                <tr>
                  <th>{t("productName")}</th>
                  <th>{t("category")}</th>
                  <th>{t("soldQuantity")}</th>
                  <th>{t("cogs")}</th>
                  <th>{t("sellingPrice")}</th>
                  <th>{t("profit")}</th>
                  {/* <th>{t("%ProfitperItem")}</th> */}
                </tr>
              </thead>
              <tbody>
                {COGSTransaction.length > 0 ? (
                  COGSTransaction.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.product}</td>
                        <td>{item.category}</td>
                        <td>{item.kuantitas}</td>
                        <td><NumberFormat value={item.product_hpp} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                        <td><NumberFormat value={item.product_sold_price} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                        <td><NumberFormat value={item.profit} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                        {/* <td>{`${Math.round(
                          (item.profit / item.product_hpp) * 100
                        )}%`}</td> */}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>{t("dataNotFound")}</td>
                  </tr>
                )}
                <tr>
                  <th>{t("grandTotal")}</th>
                  <th></th>
                  <th>{sumReports(COGSTransaction, "kuantitas")} </th>
                  <th>
                  <NumberFormat value={sumReports(COGSTransaction, "product_hpp")} displayType={'text'} thousandSeparator={true} prefix={currency} />
                  </th>
                  <th>
                  <NumberFormat value={sumReports(COGSTransaction, "product_sold_price")} displayType={'text'} thousandSeparator={true} prefix={currency} />
                  </th>
                  <th>
                  <NumberFormat value={sumReports(COGSTransaction, "profit")} displayType={'text'} thousandSeparator={true} prefix={currency} />
                  </th>
                  {/* <th>{`${handlePercentage(COGSTransaction)}%`}</th> */}
                </tr>
              </tbody>
            </Table>
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default COGSReport;
