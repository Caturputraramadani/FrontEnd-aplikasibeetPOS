import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";
import { useTranslation } from "react-i18next";
import "../style.css";

import NumberFormat from 'react-number-format'
import {
  Paper
} from "@material-ui/core";
import { FeatureReport } from './components/FeatureReport'
import {
  Row,
  Col
} from "react-bootstrap";

export const PaymentMethodTab = () => {
  const [mdr, setMdr] = React.useState("")
  const [refresh, setRefresh] = React.useState(0)
  const handleRefresh = () => setRefresh((state) => state + 1)

  const [dataRevenue, setDataRevenue] = React.useState({})
  const [resultRevenueBusiness, setResultRevenueBusiness] = React.useState({
    result_revenue_manager: "",
    result_revenue_business: ""
  })

  

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
    no: 2,
    table: "table-payment",
    filename: `payment-method_${startDate}-${endDateFilename}`,
  })
  const [status, setStatus] = React.useState("");

  const [allPaymentMethods, setAllPaymentMethods] = React.useState([]);
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

  const { t } = useTranslation();
  const getPaymentMethod = async (id, start_range, end_range) => {
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
      // const { data } = await axios.get(
      //   `${API_URL}/api/v1/transaction/payment-method${outlet_id}date_start=${start_range}&date_end=${end_range}`
      // );
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/payment-method/mdr${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      
      setAllPaymentMethods(data.data);
      console.log("getPaymentMethod", data.data)
    } catch (err) {
      if (err.response.status === 404) {
        setAllPaymentMethods([]);
      }
      console.log(err);
    }
  };

  const calculateRevenue = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
   try {
     const {data} = await axios.get(`${API_URL}/api/v1/business-revenue-sharing/business-id/${userInfo.business_id}`)
     console.log("calculateRevenue", data.data)
     setDataRevenue(data.data)
   } catch (err) {
    console.log(err);
   }
 }

  React.useEffect(() => {
    getPaymentMethod(selectedOutlet.id, startDate, endDate);
    calculateRevenue()
    setTabData({
      ...tabData,
      filename: `payment-method_${startDate}-${endDateFilename}` 
    })
  }, [selectedOutlet, startDate, endDate, refresh, endDateFilename, mdr]);

  const paymentMethodData = () => {
    const data = [];

    allPaymentMethods.forEach((item) => {
      const allPayments = item.Payments.filter(
        (item) => item.status === "done"
      );

      const totalCollected = allPayments.reduce(
        (init, curr) => (init += curr.payment_total),
        0
      );

      data.push({
        method: item.name,
        transaction: allPayments.length,
        total: totalCollected
      });
    });

    data.sort((a, b) => b.transaction - a.transaction);

    const totalTransactions = data.reduce(
      (init, curr) => (init += curr.transaction),
      0
    );
    const totalAmount = data.reduce((init, curr) => (init += curr.total), 0);

    // data.push({
    //   method: "",
    //   transaction: totalTransactions,
    //   total: totalAmount
    // });

    // Calculate Revenue Sharing
    const percentage_manager = dataRevenue.manager_percent_share / 100
    const temp_kali_manager = totalAmount * percentage_manager

    const percentage_business = dataRevenue.business_percent_share / 100
    const temp_kali_business = totalAmount * percentage_business

    const result_revenue_manager =  temp_kali_manager
    const result_revenue_business =  temp_kali_business
    // End Calculate Revenue Sharing

    return {
      data,
      totalCollected: {
          transaction: totalTransactions,
          total: totalAmount
      },
      resultRevenueBusiness: {
        result_revenue_manager: result_revenue_manager > 0 ? result_revenue_manager : "",
        result_revenue_business: result_revenue_business > 0 ? result_revenue_business : "-"
      }
    };
  };

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
                handleMdr={handleMdr}
                tabData={tabData}
                handleEndDateFilename={handleEndDateFilename}
                handleSelectedOutlet={handleSelectedOutlet}
                titleReport="reportPaymentMethod"
                handleSelectStatus={handleSelectStatus}
                handleTimeStart={handleTimeStart}
                handleTimeEnd={handleTimeEnd}
                stateShowMdr={true}
              />
            <Table id="table-payment" striped>
              <thead>
                <tr>
                  <th></th>
                  <th>{t("paymentMethod")}</th>
                  <th>{t("numberOfTransaction")}</th>
                  <th>{t("totalCollected")}</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethodData().data.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td></td>
                      <td>{item.method}</td>
                      <td>{item.transaction}</td>
                      <td><NumberFormat value={item.total} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>Total Collected</td>
                  <td>{paymentMethodData().totalCollected.transaction}</td>
                  <td><NumberFormat value={paymentMethodData().totalCollected.total} displayType={'text'} thousandSeparator={true} prefix={"Rp."} /></td>
                </tr>
                <tr>
                  <td></td>
                  <td className="text-danger">Profit Sharing ({dataRevenue.manager_percent_share}%)</td>
                  <td></td>
                  <td className="text-danger">- <NumberFormat value={paymentMethodData().resultRevenueBusiness.result_revenue_manager} displayType={'text'} thousandSeparator={true} prefix={"Rp."} /></td>
                </tr>
                <tr>
                  <td></td>
                  <td className="text-success">Net ({dataRevenue.business_percent_share}%)</td>
                  <td></td>
                  <td className="text-success"><NumberFormat value={paymentMethodData().resultRevenueBusiness.result_revenue_business} displayType={'text'} thousandSeparator={true} prefix={"Rp."} /></td>
                </tr>
              </tfoot>
            </Table>
            {/* {paymentMethodData().resultRevenueBusiness.result_revenue_manager ||  paymentMethodData().resultRevenueBusiness.result_revenue_business ? (
              <div className="d-flex flex-column align-items-end" style={{marginRight: "19%"}}>
                <div className="text-danger">- {paymentMethodData().resultRevenueBusiness.result_revenue_manager}</div>
                <div className="text-success">{paymentMethodData().resultRevenueBusiness.result_revenue_business}</div>
              </div>
            ) : null} */}
          </Paper>
        </Col>
      </Row>
    </>
  );
};
