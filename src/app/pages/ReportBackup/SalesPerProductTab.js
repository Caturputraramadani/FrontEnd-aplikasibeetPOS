import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'
import "../style.css";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
export const SalesPerProductTab = ({ selectedOutlet, startDate, endDate, endDateFilename }) => {
  const { t } = useTranslation();
  const [salesPerProduct, setSalesPerProduct] = useState([]);
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

  const getDataSalesPerProduct = async (id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = id ? `?outlet_id=${id}&` : "?";

    console.log("startDate", start_range)
    console.log("endDate", end_range)

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
        `${API_URL}/api/v1/transaction/perproduct${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setSalesPerProduct(renderTable(data.data));
    } catch (err) {
      if (err.response.status === 404) {
        setSalesPerProduct([]);
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
        total_sales:
          i.product_price * sum(i.quantity)
      });
    });
    return final;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getDataSalesPerProduct(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);
  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-sales-per-product">
          <thead>
            <tr>
              <th>{t("productSalesReport")}</th>
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
              <th>{t("totalSales")}</th>
            </tr>
          </thead>
          <tbody>
            {salesPerProduct.length > 0 ? (
              salesPerProduct.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.product}</td>
                    <td>{item.category}</td>
                    <td>{item.kuantitas}</td>
                    <td>{item.total_sales}</td>
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
              <th>{sumReports(salesPerProduct, "kuantitas")} </th>
              <th>{sumReports(salesPerProduct, "total_sales")} </th>
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
            <th>{t("totalSales")}</th>
          </tr>
        </thead>
        <tbody>
          {salesPerProduct.length > 0 ? (
            salesPerProduct.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.category}</td>
                  <td>{item.kuantitas}</td>
                  <td>{<NumberFormat value={item.total_sales} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
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
            <th>{sumReports(salesPerProduct, "kuantitas")} </th>
            <th>
              {<NumberFormat value={sumReports(salesPerProduct, "total_sales")} displayType={'text'} thousandSeparator={true} prefix={currency} />}{" "}
            </th>
          </tr>
        </tbody>
      </Table>
    </>
  );
};
