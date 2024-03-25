import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'
import "../style.css";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const ProfitReport = ({ selectedOutlet, startDate, endDate, endDateFilename }) => {
  const { t } = useTranslation();
  const [profitReport, setProfitReport] = useState([]);
  const [currency, setCurrency] = React.useState("")
  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

    console.log("currency nya brpw", data.data.Currency.name)
     

    setCurrency(data.data.Currency.name)
  }
  React.useEffect(() => {
    handleCurrency()
  }, [])

  const getProfitReport = async (id, start_range, end_range) => {
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
        `${API_URL}/api/v1/transaction/profit${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setProfitReport(renderTable(data.data));
    } catch (err) {
      if (err.response.status === 404) {
        setProfitReport([]);
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
      return (i.laba_kotor / i.penjualan_kotor) * 100;
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
      if (seen.hasOwnProperty(dayjs(entry.tanggal).format("DD/MM/YYYY"))) {
        previous = seen[dayjs(entry.tanggal).format("DD/MM/YYYY")];
        previous.penjualan_kotor.push(entry.penjualan_kotor);
        previous.diskon.push(entry.diskon);
        return false;
      }

      if (!Array.isArray(entry.array)) {
        entry.tanggal = [dayjs(entry.tanggal).format("DD/MM/YYYY")];
        entry.penjualan_kotor = [entry.penjualan_kotor];
        entry.diskon = [entry.diskon];
      }

      seen[entry.tanggal] = entry;

      return true;
    });
    array.map((i) => {
      final.push({
        tanggal: i.tanggal,
        penjualan_kotor: sum(i.penjualan_kotor),
        diskon: sum(i.diskon),
        pembulatan: 0,
        laba_kotor: sum(i.penjualan_kotor) - sum(i.diskon)
      });
    });
    return final;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getProfitReport(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-profit">
          <thead>
            <tr>
              <th>{t("profitCalculationReport")}</th>
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
              <th>{t("date")}</th>
              <th>{t("grossSales")}</th>
              <th>{t("totalDiscount")}</th>
              <th>{t("rounding")}</th>
              <th>{t("grossProfit")}</th>
              <th>{t("%grossProfit")}</th>
            </tr>
          </thead>
          <tbody>
            {profitReport.length > 0 ? (
              profitReport.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.tanggal}</td>
                    <td>{item.penjualan_kotor}</td>
                    <td>{item.diskon}</td>
                    <td>{item.pembulatan}</td>
                    <td>{item.laba_kotor}</td>
                    <td>{`${Math.round(
                      (item.laba_kotor / item.penjualan_kotor) * 100
                    )}%`}</td>
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
              <th>{sumReports(profitReport, "penjualan_kotor")} </th>
              <th>{sumReports(profitReport, "diskon")} </th>
              <th>{sumReports(profitReport, "pembulatan")} </th>
              <th>{sumReports(profitReport, "laba_kotor")}</th>
              <th>{`${handlePercentage(profitReport)}%`}</th>
            </tr>
          </tbody>
        </table>
      </div>
      <Table>
        <thead>
          <tr>
            <th>{t("date")}</th>
            <th>{t("grossSales")}</th>
            <th>{t("discountTotal")}</th>
            <th>{t("rounding")}</th>
            <th>{t("grossProfit")}</th>
            <th>{t("%grossProfit")}</th>
          </tr>
        </thead>
        <tbody>
          {profitReport.length > 0 ? (
            profitReport.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.tanggal}</td>
                  <td>{<NumberFormat value={item.penjualan_kotor} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
                  <td>{<NumberFormat value={item.diskon} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
                  <td>{<NumberFormat value={item.pembulatan} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
                  <td>{<NumberFormat value={item.laba_kotor} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
                  <td>{`${Math.round(
                    (item.laba_kotor / item.penjualan_kotor) * 100
                  )}%`}</td>
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
            <th>
              {<NumberFormat value={sumReports(profitReport, "penjualan_kotor")} displayType={'text'} thousandSeparator={true} prefix={currency} />}{" "}
            </th>
            <th>{<NumberFormat value={sumReports(profitReport, "diskon")} displayType={'text'} thousandSeparator={true} prefix={currency} />} </th>
            <th>
              {<NumberFormat value={sumReports(profitReport, "pembulatan")} displayType={'text'} thousandSeparator={true} prefix={currency} />}
            </th>
            <th>
              {<NumberFormat value={sumReports(profitReport, "laba_kotor")} displayType={'text'} thousandSeparator={true} prefix={currency} />}
            </th>
            <th>{`${handlePercentage(profitReport)}%`}</th>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default ProfitReport;
