import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'
import "../style.css";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const StaffTransaction = ({ selectedOutlet, startDate, endDate, endDateFilename }) => {
  const { t } = useTranslation();
  const [StaffTransaction, setStaffTransaction] = useState([]);
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

  const getStaffTransaction = async (id, start_range, end_range) => {
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
        `${API_URL}/api/v1/transaction/staff-history${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );

      setStaffTransaction(renderTable(data.data));
    } catch (err) {
      if (err.response.status === 404) {
        setStaffTransaction([]);
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
      if (seen.hasOwnProperty(entry.nama_staff)) {
        previous = seen[entry.nama_staff];
        previous.total_transaksi.push(entry.total_transaksi);
        previous.jumlah_rekap.push(entry.jumlah_rekap);
        previous.jumlah_transaksi.push(entry.jumlah_transaksi);
        return false;
      }

      if (!Array.isArray(entry.array)) {
        entry.total_transaksi = [entry.total_transaksi];
        entry.jumlah_rekap = [entry.jumlah_rekap];
        entry.jumlah_transaksi = [entry.jumlah_transaksi];
      }

      seen[entry.nama_staff] = entry;

      return true;
    });

    array.map((i) => {
      final.push({
        staff_name: i.nama_staff,
        jumlah_rekap: sum(i.jumlah_rekap),
        jumlah_transaksi: sum(i.jumlah_transaksi),
        total_transaksi: sum(i.total_transaksi)
      });
    });
    return final;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getStaffTransaction(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-staff-transaction">
          <thead>
            <tr>
              <th>{t("staffSalesReports")}</th>
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
              <th>{t("staffName")}</th>
              <th>{t("totalCashRecap")}</th>
              <th>{t("numberOfTransaction")}</th>
              <th>{t("totalSales")}</th>
            </tr>
          </thead>
          <tbody>
            {StaffTransaction.length > 0 ? (
              StaffTransaction.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.staff_name}</td>
                    <td>{item.jumlah_rekap}</td>
                    <td>{item.jumlah_transaksi}</td>
                    <td>{item.total_transaksi}</td>
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
              <th>{sumReports(StaffTransaction, "total_transaksi")} </th>
            </tr>
          </tbody>
        </table>
      </div>
      <Table>
        <thead>
          <tr>
            <th>{t("staffName")}</th>
            <th>{t("totalCashRecap")}</th>
            <th>{t("totalTransaction")}</th>
            <th>{t("totalSales")}</th>
          </tr>
        </thead>
        <tbody>
          {StaffTransaction.length > 0 ? (
            StaffTransaction.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.staff_name}</td>
                  <td>{item.jumlah_rekap}</td>
                  <td>{item.jumlah_transaksi}</td>
                  <td>{<NumberFormat value={item.total_transaksi} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
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
            <th>
              {<NumberFormat value={sumReports(StaffTransaction, "total_transaksi")} displayType={'text'} thousandSeparator={true} prefix={currency} />}{" "}
            </th>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default StaffTransaction;
