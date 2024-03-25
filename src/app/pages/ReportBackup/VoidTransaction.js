import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'
import "../style.css";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const VoidTransaction = ({ selectedOutlet, startDate, endDate, endDateFilename }) => {
  const { t } = useTranslation();
  const [voidTransaction, setVoidTransaction] = useState([]);
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

  const getVoidTransaction = async (id, start_range, end_range) => {
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
        `${API_URL}/api/v1/transaction/void${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setVoidTransaction(renderTable(data.data));
    } catch (err) {
      if (err.response.status === 404) {
        setVoidTransaction([]);
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
      if (seen.hasOwnProperty(entry.receiptId)) {
        previous = seen[entry.receiptId];
        previous.total_transaksi.push(entry.total);
        return false;
      }

      if (!Array.isArray(entry.array)) {
        entry.receipt = [entry.receiptId];
        entry.total_transaksi = [entry.total];
      }

      seen[entry.receipt] = entry;

      return true;
    });

    array.map((i) => {
      final.push({
        tanggal: dayjs(i.tanggal).format("DD/MM/YYYY"),
        receipt: i.receiptId,
        nama_staff: i.staff,
        note: i.note,
        refund_name: i.refund_type,
        total_transaksi: sum(i.total_transaksi)
      });
    });
    return final;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getVoidTransaction(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  console.log(voidTransaction);
  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-void">
          <thead>
            <tr>
              <th>{t("transaksiVoid/RefundReport")}</th>
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
              <th>{t("transactionID")}</th>
              <th>{t("staff")}</th>
              <th>{t("voidType")}</th>
              <th>{t("totalVoidTransactions")}</th>
              <th>{t("reason")}</th>
            </tr>
          </thead>
          <tbody>
            {voidTransaction.length > 0 ? (
              voidTransaction.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.tanggal}</td>
                    <td>{item.receipt}</td>
                    <td>{item.nama_staff}</td>
                    <td>{item.refund_name}</td>
                    <td>{item.total_transaksi}</td>
                    <td>{item.note}</td>
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
              <th></th>
              <th></th>
              <th>{sumReports(voidTransaction, "total_transaksi")} </th>
              <th></th>
            </tr>
          </tbody>
        </table>
      </div>
      <Table>
        <thead>
          <tr>
            <th>{t("date")}</th>
            <th>{t("transactionID")}</th>
            <th>{t("staff")}</th>
            <th>{t("voidType")}</th>
            <th>{t("totalVoidTransactions")}</th>
            <th>{t("note")}</th>
          </tr>
        </thead>
        <tbody>
          {voidTransaction.length > 0 ? (
            voidTransaction.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.tanggal}</td>
                  <td>{item.receipt}</td>
                  <td>{item.nama_staff}</td>
                  <td>{item.refund_name}</td>
                  <td>{<NumberFormat value={item.total_transaksi} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
                  <td>{item.note}</td>
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
            <th></th>
            <th></th>
            <th>
              {<NumberFormat value={sumReports(voidTransaction, "total_transaksi")} displayType={'text'} thousandSeparator={true} prefix={currency} />}{" "}
            </th>
            <th></th>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default VoidTransaction;
