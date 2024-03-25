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

const SalesPerHour = () => {
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
    no: 14,
    table: "table-sales-per-hour",
    filename: `laporan-transaksi-penjualan-per-jam_${startDate}-${endDateFilename}`,
  })
  const [status, setStatus] = React.useState("");

  const [salesPerHour, setSalesPerHour] = useState([]);
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
  const { t } = useTranslation();

  const getDataSalesPerHour = async (
    id,
    start_range,
    end_range,
    start_time,
    end_time
  ) => {
    let timeStart = dayjs(start_time).format("HH:mm:ss");
    let timeEnd = dayjs(end_time).format("HH:mm:ss");
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
    if (timeStart === timeEnd) {
      timeEnd = dayjs(end_time)
        .add(1, "hour")
        .format("HH:mm");
    }
    let times_start = dayjs(start_time).format("HH");
    let times_end = dayjs(end_time).format("HH");
    let switched;
    if (parseInt(times_start) > parseInt(times_end)) {
      switched = timeStart;
      timeStart = timeEnd;
      timeEnd = switched;
    }
    console.log("timeStart", timeStart)
    console.log("timeEnd", timeEnd)
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/sales-hour${outlet_id}date_start=${start_range}&date_end=${end_range}&time_start=${timeStart}&time_end=${timeEnd}`
      );
      // const { data } = await axios.get(
      //   `${API_URL}/api/v1/transaction/sales-hour/mdr${outlet_id}date_start=${start_range}&date_end=${end_range}&time_start=${timeStart}&time_end=${timeEnd}`
      // );

      setSalesPerHour(renderTime(renderReceipt(data.data)));
    } catch (err) {
      if (err.response.status === 404) {
        setSalesPerHour([]);
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
  function compare(a, b) {
    const timeA = parseInt(a.time);
    const timeB = parseInt(b.time);

    let comparison = 0;
    if (timeA > timeB) {
      comparison = 1;
    } else if (timeA < timeB) {
      comparison = -1;
    }
    return comparison;
  }
  const renderReceipt = (array) => {
    let final = [];
    let seen = {};
    let secondCompare;
    array = array.filter((entry) => {
      let previous;
      if (seen.hasOwnProperty(entry.receiptId)) {
        previous = seen[entry.receiptId];
        previous.penjualan.push(entry.penjualan);
        return false;
      }

      if (!Array.isArray(entry.array)) {
        entry.penjualan = [entry.penjualan];
      }

      seen[entry.receiptId] = entry;

      return true;
    });
    return array;
  };

  const renderTime = (array) => {
    let final = [];
    let seen2 = {};
    array = array.filter((entry) => {
      let previous;
      if (seen2.hasOwnProperty(entry.time)) {
        previous = seen2[entry.time];
        previous.receiptId.push(entry.receiptId);
        previous.penjualan.push(entry.penjualan);
        return false;
      }

      if (!Array.isArray(entry.array)) {
        entry.receiptId = [entry.receiptId];
        entry.penjualan = [entry.penjualan];
      }

      seen2[entry.time] = entry;

      return true;
    });

    // if(showMdr === 'Active') {
    //   handleMdr(array)
    //   array.map((i) => {
    //     // Masalah Ditemukan
    //     final.push({
    //       time: i.time,
    //       total_penjualan: sum(i.penjualan.flat(1)),
    //       jumlah_transaksi: i.receiptId.length,
    //       rata_rata: Math.round(sum(i.penjualan.flat(1)) / i.receiptId.length)
    //     });
    //   });
    // }else {
    // }
    array.map((i) => {
      final.push({
        time: i.time,
        total_penjualan: sum(i.penjualan.flat(1)),
        jumlah_transaksi: i.receiptId.length,
        rata_rata: Math.round(sum(i.penjualan.flat(1)) / i.receiptId.length)
      });
    });
    return final.sort(compare);
  };
  const timeSet = (time) => {
    return `${time}:00 - ${time + 1}:00`;
  };
  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  useEffect(() => {
    getDataSalesPerHour(
      selectedOutlet.id,
      startDate,
      endDate,
      startTime,
      endTime
    );
    setTabData({
      ...tabData,
      filename: `laporan-transaksi-penjualan-per-jam_${startDate}-${endDateFilename}`
    })
  }, [selectedOutlet, startDate, endDate, startTime, endTime, refresh, endDateFilename, mdr]);

  const handleStartDate = (date) => setStartDate(date)
  const handleEndDate = (date) => setEndDate(date)
  const handleEndDateFilename = (date) => setEndDateFilename(date)
  const handleSelectedOutlet = (outlet) => setSelectedOutlet(outlet)
  const handleSelectStatus = (status) => setStatus(status.target.value)
  const handleTimeStart = (time) => setStartTime(time)
  const handleTimeEnd = (time) => setEndTime(time)
  const handleMdr = (params) => setMdr(params)

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <FeatureReport
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              tabData={tabData}
              handleMdr={handleMdr}
              handleEndDateFilename={handleEndDateFilename}
              handleSelectedOutlet={handleSelectedOutlet}
              titleReport="reportSalesPerHour"
              handleSelectStatus={handleSelectStatus}
              handleTimeStart={handleTimeStart}
              handleTimeEnd={handleTimeEnd}
              stateShowMdr={true}
            />
            <div style={{ display: "none" }}>
              <table id="table-sales-per-hour">
                <thead>
                  <tr>
                    <th>Laporan Penjualan Per Jam</th>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
                <thead>
                  <tr>
                    <th>Outlet</th>
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
                    <th>Tanggal</th>
                    <td>{`${startDate} - ${endDateFilename}`}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <td>{`${dayjs(startTime).format("HH:mm:ss")} - ${dayjs(
                      endTime
                    ).format("HH:mm:ss")}`}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr></tr>
                </tbody>
                <thead>
                  <tr>
                    <th>{t('time')}</th>
                    <th>{t('numberOfTransaction')}</th>
                    <th>{t('sales')}</th>
                    <th>{t('averageSales')}</th>
                  </tr>
                </thead>
                <tbody>
                  {salesPerHour.length > 0 ? (
                    salesPerHour.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{timeSet(parseInt(item.time))}</td>
                          <td>{item.jumlah_transaksi}</td>
                          <td>{item.total_penjualan}</td>
                          <td>{item.rata_rata}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td>{t('dataNotFound')}</td>
                    </tr>
                  )}
                  <tr>
                    <th>{t('grandTotal')}</th>
                    <th>{sumReports(salesPerHour, "jumlah_transaksi")}</th>
                    <th>{sumReports(salesPerHour, "total_penjualan")} </th>
                    <th>{sumReports(salesPerHour, "rata_rata")} </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <Table>
              <thead>
                <tr>
                  <th>{t('time')}</th>
                  <th>{t('totalTransaction')}</th>
                  <th>{t('totalSales')}</th>
                  <th>{t('averageSales')}</th>
                </tr>
              </thead>
              <tbody>
                {salesPerHour.length > 0 ? (
                  salesPerHour.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{timeSet(parseInt(item.time))}</td>
                        <td>{item.jumlah_transaksi}</td>
                        <td>{<NumberFormat value={item.total_penjualan} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
                        <td>{<NumberFormat value={item.rata_rata} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>{t('dataNotFound')}</td>
                  </tr>
                )}
                <tr>
                  <th>{t("grandTotal")}</th>
                  <th>{sumReports(salesPerHour, "jumlah_transaksi")}</th>
                  <th>
                    {<NumberFormat value={sumReports(salesPerHour, "total_penjualan")} displayType={'text'} thousandSeparator={true} prefix={currency} />}{" "}
                  </th>
                  <th>
                    {<NumberFormat value={sumReports(salesPerHour, "rata_rata")} displayType={'text'} thousandSeparator={true} prefix={currency} />}{" "}
                  </th>
                </tr>
              </tbody>
            </Table>
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default SalesPerHour;
