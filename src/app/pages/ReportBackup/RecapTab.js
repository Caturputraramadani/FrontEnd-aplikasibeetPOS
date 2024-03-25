import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'
import { useTranslation } from "react-i18next";
import "../style.css";

export const RecapTab = ({ selectedOutlet, startDate, endDate, endDateFilename }) => {
  const [allRecaps, setAllRecaps] = React.useState([]);
  const { t } = useTranslation();
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

  const [reports, setReports] = React.useState([
    {
      date: "",
      outlet: "",
      cash: 0,
      cash_in: 0,
      cash_out: 0,
      debit_credit: 0,
      total: 0,
      staff: "",
      device: ""
    }
  ]);

  const getRecap = async (id, start_range, end_range) => {
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

    let recapData = [];
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/recap${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setAllRecaps(data.data);
      recapData = data.data;
    } catch (err) {
      if (err.response.status === 404) {
        setAllRecaps([]);
      }
      recapData = [];
    }

    const closedRecap = recapData.filter((item) => item.time_close);

    const allData = closedRecap.map((item) => {
      const date = item.time_open;
      const outlet = item.Outlet?.name;
      const cash = item.cash_total;
      const cash_in = item.Cash.filter((item) => item.type === "in").reduce(
        (init, curr) => init + curr.value,
        0
      );
      const cash_out = item.Cash.filter((item) => item.type === "out").reduce(
        (init, curr) => init + curr.value,
        0
      );
      const debit_credit = item.card_total;
      const ewallet = item.ewallet_total;
      const total = item.sales_total;
      const staff = item.User?.User_Profile?.name || "-";
      const device = item.User?.device || "-";

      return {
        date,
        outlet,
        cash,
        cash_in,
        cash_out,
        debit_credit,
        ewallet,
        total,
        staff,
        device
      };
    });

    setReports(allData);
  };

  React.useEffect(() => {
    getRecap(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  const recapData = () => {
    const data = [];

    allRecaps.forEach((item) => {
      data.push({
        recap_date: item.time_open,
        user: item.User?.User_Profile?.name || "-",
        recap_time_open: item.time_open,
        recap_time_close: item.time_close,
        total_actual: item.actual_total,
        total_system: item.system_total,
        difference: item.difference
      });
    });

    data.sort((a, b) => new Date(b.recap_date) - new Date(a.recap_date));

    return data;
  };

  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-recap">
          <thead>
            <tr>
              <th>{t("cashRekapReport")}</th>
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
              <th>{t("outlet")}</th>
              <th>{t("cash")}</th>
              <th>{t("cashOut")}</th>
              <th>{t("cashIn")}</th>
              <th>{t("debit/Credit")}</th>
              <th>{t("e-wallet")}</th>
              <th>{t("total")}</th>
              <th>{t("staffName")}</th>
              <th>{t("device")}</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{dayjs(item.date).format("DD/MM/YYYY")}</td>
                  <td>{item.outlet}</td>
                  <td>{item.cash}</td>
                  <td>{item.cash_in}</td>
                  <td>{item.cash_out}</td>
                  <td>{item.debit_credit}</td>
                  <td>{item.ewallet}</td>
                  <td>{item.total}</td>
                  <td>{item.staff}</td>
                  <td>{item.device}</td>
                </tr>
              );
            })}
            <tr>
              <th>{t("grandTotal")}</th>
              <th></th>
              <th>{sumReports(reports, "cash")} </th>
              <th>{sumReports(reports, "cash_in")} </th>
              <th>{sumReports(reports, "cash_out")} </th>
              <th>{sumReports(reports, "debit_credit")} </th>
              <th>{sumReports(reports, "ewallet")} </th>
              <th>{sumReports(reports, "total")} </th>
              <th></th>
              <th></th>
            </tr>
          </tbody>
        </table>
      </div>

      <Table striped>
        <thead>
          <tr>
            <th></th>
            <th>{t("recapDate")}</th>
            <th>{t("user")}</th>
            <th>{t("recapTimeOpen")}</th>
            <th>{t("recapTimeClose")}</th>
            <th>{t("totalActual")}</th>
            <th>{t("totalSystem")}</th>
            <th>{t("difference")}</th>
          </tr>
        </thead>
        <tbody>
          {recapData().map((item, index) => {
            return (
              <tr key={index}>
                <td></td>
                <td>{dayjs(item.recap_date).format("DD/MM/YYYY")}</td>
                <td>{item.user}</td>
                <td>{dayjs(item.recap_time_open).format("HH:mm")}</td>
                <td>
                  {item.recap_time_close
                    ? dayjs(item.recap_time_close).format("HH:mm")
                    : "-"}
                </td>
                <td>{<NumberFormat value={item.total_actual} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
                <td>{<NumberFormat value={item.total_system} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
                <td>{<NumberFormat value={item.difference} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
