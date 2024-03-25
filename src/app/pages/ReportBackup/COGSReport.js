import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'
import "../style.css";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const COGSReport = ({ selectedOutlet, startDate, endDate, endDateFilename }) => {
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
  }, [selectedOutlet, startDate, endDate]);
  return (
    <>
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
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default COGSReport;
