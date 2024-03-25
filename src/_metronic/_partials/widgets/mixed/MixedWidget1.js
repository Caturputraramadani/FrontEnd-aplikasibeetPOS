/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import rupiah from "rupiah-format";
import axios from 'axios'
import { useTranslation } from "react-i18next";
import SVG from "react-inlinesvg";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { Dropdown, Button, Modal } from "react-bootstrap";
import { CalendarToday } from "@material-ui/icons";
import { toAbsoluteUrl } from "../../../_helpers";
import { useHtmlClassService } from "../../../layout";
import { DropdownMenu2 } from "../../dropdowns";
import { DateRangePicker } from "react-date-range";
import Swal from "sweetalert2"
import ExportExcel from "react-html-table-to-excel";
import NumberFormat from 'react-number-format'
import { useHistory, useLocation } from 'react-router-dom'
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import './style.css'

export function MixedWidget1({
  handleScrollBottom,
  className,
  currentSales,
  currentRange,
  rangeName,
  outletName,
  ranges,
  rangeId,
  handleSelectRange,
  handleSelectOutlet,
  allOutlets,
  yesterdaySales,
  yesterdayTransactions,
  todaySales,
  todayTransactions,
  startRange,
  endRange,
  handleStartRange,
  reports
}) {
  const uiService = useHtmlClassService();
  const [currency, setCurrency] = React.useState("")

  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

     

    setCurrency(data.data.Currency.name)
  }
  React.useEffect(() => {
    handleCurrency()
  }, [])
  
  const calcPercentage = (a, b) => Math.floor((a / b) * 100) || 0;
  const { t } = useTranslation();
  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray500: objectPath.get(
        uiService.config,
        "js.colors.gray.gray500"
      ),
      colorsGrayGray200: objectPath.get(
        uiService.config,
        "js.colors.gray.gray200"
      ),
      colorsGrayGray300: objectPath.get(
        uiService.config,
        "js.colors.gray.gray300"
      ),
      colorsThemeBaseDanger: objectPath.get(
        uiService.config,
        "js.colors.theme.base.danger"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily")
    };
  }, [uiService]);

  useEffect(() => {
    const element = document.getElementById("kt_mixed_widget_1_chart");
    if (!element) {
      return;
    }

    const options = getChartOptions(layoutProps, currentSales, currentRange, t);

    const chart = new ApexCharts(element, options);
    chart.render();

    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, currentSales, currentRange]);

  const [selectDate, setSelectDate] = React.useState(false);

  const handleSelectDate = () => setSelectDate((state) => !state);

  // function insertAfter(referenceNode, newNode) {
  //   if (referenceNode) {
  //     referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  //   }
  // }

  // React.useEffect(() => {
  //   const el = document.createElement("div");
  //   el.innerHTML = "test";
  //   // el.className = "header header-fixed";
  //   // el.innerHTML =
  //   //   "<div class='container-fluid d-flex align-items-stretch justify-content-between'>Test</div>";
  //   // el.style.cssText = "position:fixed;top:65px";
  //   const div = document.getElementById("kt_header");
  //   div.append(el);
  //   // insertAfter(div, el);
  // }, []);

  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };

  const filename = () => {
    const value = ranges.find((item) => item.id === rangeId).valueId;
    const date = ranges.find((item) => item.id === rangeId).displayDate;

    const processValue = value
      .split(" ")
      .join("-")
      .toLowerCase();
    return `transaksi-${processValue}_${date}`;
  };
  return (
    <>
      <ModalCustomRange
        handleScrollBottom={handleScrollBottom}
        show={selectDate}
        handleClose={handleSelectDate}
        startRange={startRange}
        endRange={endRange}
        handleStartRange={handleStartRange}
        handleSelectRange={handleSelectRange}
        ranges={ranges}
      />

      <div style={{ display: "none" }}>
        <table id="table-transactions">
          <thead>
            <tr>
              <th>
                {t("salesReport")}{" "}
                {ranges.find((item) => item.id === rangeId).valueId}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>{t("outlet")}</th>
              <td>{outletName}</td>
            </tr>
          </thead>
          <thead>
            <tr>
              <th>{t("date")}</th>
              <td>{ranges.find((item) => item.id === rangeId).displayDate}</td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>{t("date")}</th>
              <th>{t("numberOfTransaction")}</th>
              <th>{t("sales")}</th>
              <th>{t("average")}</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.totalTransactions}</td>
                  <td>{item.totalSales}</td>
                  <td>{item.average}</td>
                </tr>
              );
            })}
            <tr>
              <th>{t("grandTotal")}</th>
              <th>{sumReports(reports, "totalTransactions")} </th>
              <th>{sumReports(reports, "totalSales")} </th>
              <th>{sumReports(reports, "average")} </th>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={`card card-custom bg-gray-100 ${className}`}>
        {/* Header */}
        <div className="card-header border-0 bg-gray-100 py-5">
          <h3 className="card-title font-weight-bolder text-black">
            {t("todayReport")}
          </h3>

          <div className="card-toolbar">
            {/* <Dropdown className="dropdown-inline" drop="down" alignRight>
              <Dropdown.Toggle
                className="btn btn-transparent-white btn-sm font-weight-bolder dropdown-toggle px-5"
                variant="transparent"
                id="dropdown-toggle-top"
              >
                {rangeName}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                {ranges.map((item) => {
                  if (item.id === 9) return "";

                  return (
                    <Dropdown.Item
                      key={item.id}
                      onClick={() => handleSelectRange(item)}
                    >
                      {item.value}
                    </Dropdown.Item>
                  );
                })}
                <Dropdown.Item onClick={handleSelectDate}>{t("custom")}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}

            {/* <Dropdown
              className="dropdown-inline"
              drop="down"
              alignRight
              style={{ marginLeft: "1rem" }}
            >
              <Dropdown.Toggle
                className="btn btn-transparent-white btn-sm font-weight-bolder dropdown-toggle px-5"
                variant="transparent"
                id="dropdown-toggle-top"
              >
                {outletName}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                <Dropdown.Item onClick={() => handleSelectOutlet()}>
                  {t("allOutlets")}
                </Dropdown.Item>
                {allOutlets.length
                  ? allOutlets.map((item) => {
                      return (
                        <Dropdown.Item
                          key={item.id}
                          onClick={() => handleSelectOutlet(item)}
                        >
                          {item.name}
                        </Dropdown.Item>
                      );
                    })
                  : ""}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              className="dropdown-inline"
              drop="down"
              alignRight
              style={{ marginLeft: "1rem" }}
            >
              <ExportExcel
                className="btn btn-transparent-white btn-sm font-weight-bolder px-5"
                table="table-transactions"
                filename={filename()}
                sheet="transaction-report"
                buttonText={t('export')}
              />
            </Dropdown> */}
          </div>
        </div>
        {/* Body */}
        <div className="card-body p-0 position-relative overflow-hidden">
          {/* Chart */}
          {/* <div
            id="kt_mixed_widget_1_chart"
            className="card-rounded-bottom bg-danger"
            style={{ height: "200px" }}
          ></div> */}

          {/* Stat */}
          <div className="card-spacer" style={{ marginTop: "-3rem" }}>
            <div className="row m-0">
              <div className="col bg-light-warning px-6 py-8 rounded-xl mr-7 mb-7">
                <span className="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/Media/Equalizer.svg")}
                  ></SVG>
                </span>
                <a
                  href="#"
                  className="text-warning font-weight-bold font-size-h6"
                >
                  {t("sales")}
                </a>
                <p>
                  {/* (<NumberFormat value={yesterdaySales} displayType={'text'} thousandSeparator={true} prefix={currency} />) {t("yesterdaySales")}<br />
                  {yesterdaySales && todaySales ? (
                    <>+{calcPercentage(todaySales, yesterdaySales) + "%"}</>
                  ) : (
                    ""
                  )}{" "} */}
                  (<NumberFormat value={todaySales} displayType={'text'} thousandSeparator={true} prefix={currency} />) {t("todaySales")}
                </p>
              </div>
              <div className="col bg-light-primary px-6 py-8 rounded-xl mb-7">
                <span className="svg-icon svg-icon-3x svg-icon-primary d-block my-2">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/Communication/Add-user.svg"
                    )}
                  ></SVG>
                </span>
                <a
                  href="#"
                  className="text-primary font-weight-bold font-size-h6 mt-2"
                >
                  {t("transaction")}
                </a>
                <p>
                  {/* ({yesterdayTransactions.length}) {t("yesterdayTransaction")} <br />
                  {yesterdayTransactions.length && todayTransactions.length ? (
                    <>
                      +
                      {calcPercentage(
                        todayTransactions.length,
                        yesterdayTransactions.length
                      ) + "%"}{" "}
                    </>
                  ) : (
                    ""
                  )} */}
                  ({todayTransactions.length}) {t("todayTransaction")}
                </p>
              </div>
            </div>
            {/* <div className="row m-0">
            <div className="col bg-light-danger px-6 py-8 rounded-xl mr-7">
              <span className="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
                <SVG
                  src={toAbsoluteUrl("/media/svg/icons/Design/Layers.svg")}
                ></SVG>
              </span>
              <a
                href="#"
                className="text-danger font-weight-bold font-size-h6 mt-2"
              >
                Customers
              </a>
              <p>
                12 Outlets <br />
                +5 New Customers added to customer database
              </p>
            </div>
            <div className="col bg-light-success px-6 py-8 rounded-xl">
              <span className="svg-icon svg-icon-3x svg-icon-success d-block my-2">
                <SVG
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Urgent-mail.svg"
                  )}
                ></SVG>
              </span>
              <a
                href="#"
                className="text-success font-weight-bold font-size-h6 mt-2"
              >
                Products
              </a>
              <p>
                25 Products <br />
                +5 New Products added to product database
              </p>
            </div>
          </div> */}
          </div>
          <div className="card-toolbar">
            {/* <Dropdown className="dropdown-inline" drop="down" alignRight>
              <Dropdown.Toggle
                className="btn btn-transparent-white btn-sm font-weight-bolder dropdown-toggle px-5"
                variant="transparent"
                id="dropdown-toggle-top"
              >
                {rangeName}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                {ranges.map((item) => {
                  if (item.id === 9) return "";

                  return (
                    <Dropdown.Item
                      key={item.id}
                      onClick={() => handleSelectRange(item)}
                    >
                      {item.value}
                    </Dropdown.Item>
                  );
                })}
                <Dropdown.Item onClick={handleSelectDate}>{t("custom")}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}

            {/* <Dropdown
              className="dropdown-inline"
              drop="down"
              alignRight
              style={{ marginLeft: "1rem" }}
            >
              <Dropdown.Toggle
                className="btn btn-transparent-white btn-sm font-weight-bolder dropdown-toggle px-5"
                variant="transparent"
                id="dropdown-toggle-top"
              >
                {outletName}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                <Dropdown.Item onClick={() => handleSelectOutlet()}>
                  {t("allOutlets")}
                </Dropdown.Item>
                {allOutlets.length
                  ? allOutlets.map((item) => {
                      return (
                        <Dropdown.Item
                          key={item.id}
                          onClick={() => handleSelectOutlet(item)}
                        >
                          {item.name}
                        </Dropdown.Item>
                      );
                    })
                  : ""}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown
              className="dropdown-inline"
              drop="down"
              alignRight
              style={{ marginLeft: "1rem" }}
            >
              <ExportExcel
                className="btn btn-transparent-white btn-sm font-weight-bolder px-5"
                table="table-transactions"
                filename={filename()}
                sheet="transaction-report"
                buttonText={t('export')}
              />
            </Dropdown> */}
          </div>
          {/* Resize */}
          <div className="resize-triggers">
            <div className="expand-trigger">
              <div style={{ width: "411px", height: "461px" }} />
            </div>
            <div className="contract-trigger" />
          </div>
        </div>
      </div>
    </>
  );
}

function getChartOptions(layoutProps, currentSales, currentRange, t) {
  const strokeColor = "#D13647";

  const options = {
    series: [
      {
        name: `${t('salesStats')}`,
        data: currentSales
      }
    ],
    chart: {
      type: "area",
      height: 200,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: strokeColor,
        opacity: 0.5
      }
    },
    plotOptions: {},
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: "solid",
      opacity: 0
    },
    stroke: {
      curve: "straight",
      show: true,
      width: 3,
      colors: [strokeColor]
    },
    xaxis: {
      categories: currentRange,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3
        }
      }
    },
    yaxis: {
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      }
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0
        }
      },
      hover: {
        filter: {
          type: "none",
          value: 0
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0
        }
      }
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily
      },
      y: {
        formatter: function(val) {
          return val;
        }
      },
      marker: {
        show: false
      }
    },
    colors: ["transparent"],
    markers: {
      colors: layoutProps.colorsThemeBaseDanger,
      strokeColor: [strokeColor],
      strokeWidth: 3
    }
  };
  return options;
}

const ModalCustomRange = ({
  handleScrollBottom,
  show,
  handleClose,
  startRange,
  endRange,
  handleStartRange,
  handleSelectRange,
  ranges
}) => {
  const { t } = useTranslation();
  const [showGuide, setShowGuide] = React.useState(null)
  const API_URL = process.env.REACT_APP_API_URL;
  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const [countExpired, setCountExpired] = useState(0)
  const [subscriptionPartitoin, setSubscriptionPartitoin] = useState(null)
  const [countryCodeIso3, setCountryCodeIso3] = useState("")

  const dispatch = useDispatch();
  const [kitchenModul, setKitchenModul] = React.useState("");

  const location = useLocation()
  const history = useHistory()

  const state = useSelector((state) => state);
  console.log("react redux", state)

  const checkUserGuideBusiness = async () => {
    
    const queryParams = location.search
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)
      setCountryCodeIso3(data.data.country_code_iso3)
      console.log("setCountryCodeIso3", data.data.country_code_iso3)
      if(!data.data.user_guide || queryParams.includes("repeat-tour")) {
        setShowGuide("dashboard")
      } else {
        setShowGuide(null)
      }
      history.replace({ ...history.location.search, location })
    } catch (error) {
      console.log(error)
    }
  }

  const handleShowGuide = async (state) => {
    if (state === 'finish_guide') {
      // handleScrollBottom()
      await axios.patch(`${API_URL}/api/v1/business/update-guide/${userInfo.business_id}`, {
        user_guide: 1
      })
      setShowGuide(null)
    } else {
      setShowGuide(state)
    }
  }

  const handleCheckExpired = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const dataSubscription = await axios.get(`${API_URL}/api/v1/subscription`,
      { headers: { Authorization: localStorage.getItem("token") } })
    if (dataSubscription.data.data.length > 0) {
      const dt = new Date()
      const month = dt.getMonth() + 1
      const year = dt.getFullYear()

      const daysInMonth = new Date(year, month, 0).getDate()
      const userInfo = JSON.parse(localStorage.getItem("user_info"))
      const subscription = dataSubscription.data.data.find(item => {
        return item.business_id === userInfo.business_id
      })
      if (subscription) {
        const getDateExpired = subscription.expired_date
        const expired_tolerance = subscription.Subscription_Type.expired_tolerance
        const dateNow = new Date()
        const dateExpired = new Date(getDateExpired)
        let countDate;
        if (dateExpired.getFullYear() - dateNow.getFullYear() > 0) {
          const resultMonth = 12 - dateNow.getMonth()
          const resultMonth2 = dateExpired.getMonth() + resultMonth
          const expired = Math.floor(resultMonth2 * daysInMonth +  dateExpired.getDate())
          setCountExpired(expired)
        }
        if (dateExpired.getFullYear() - dateNow.getFullYear() < 1) {
          if (dateExpired.getMonth() - dateNow.getMonth() <= 0) {
            countDate = dateExpired.getDate() - dateNow.getDate()
            setCountExpired(countDate)
          } else if (dateExpired.getMonth() - dateNow.getMonth() === 1) {
            const expired = daysInMonth - dateNow.getDate() + dateExpired.getDate()
            setCountExpired(expired)
          } else {
            const resultMonth = dateExpired.getMonth() - dateNow.getMonth()
            const expired = Math.floor(resultMonth * daysInMonth + dateExpired.getDate())
            setCountExpired(expired)
          }
        }
      } else {
        console.log(null)
      } 
    }
  }

  const handleTypeBusiness = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem("user_info"));

      let nameKitchenModul;
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/business/${localData.business_id}`
      );
      if (data.data.business_type_id == 1) nameKitchenModul = "assembly";
      if (data.data.business_type_id == 2) nameKitchenModul = "kitchen";
      if (data.data.business_type_id == 3) nameKitchenModul = "assembly";

      setKitchenModul(nameKitchenModul);

      console.log();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubscriptionPartition = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`
      );
      setSubscriptionPartitoin(data.data[0].subscription_partition_id)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    handleSubscriptionPartition()
    handleTypeBusiness()
    handleCheckExpired()
  },[])

  React.useEffect(() => {
    checkUserGuideBusiness()
  }, [location.search])

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <DateRangePicker
          ranges={[
            {
              startDate: startRange,
              endDate: endRange,
              key: "selection"
            }
          ]}
          onChange={handleStartRange}
        />
        <Modal.Footer>
          <Button
            onClick={() => {
              handleSelectRange(ranges.find((item) => item.id === 9));
              handleClose();
            }}
          >
            {t("save")}
          </Button>
          <Button onClick={handleClose} variant="secondary">
            {t("cancel")}
          </Button>
        </Modal.Footer>
      </Modal>
      {showGuide ? (
        <div className="background-black" />
      ) : null}
      {showGuide === 'dashboard' ? (
        <div className={`wrapper-guide dashboard ${countExpired > 14 ? 'margin-top-55' : ""}`}>
          <div className="font-weight-bold">{t('dashboard')}</div>
          {t('onTheDashboardSubmenu')}
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end" onClick={() => handleShowGuide('report')}>
              <div className="badge badge-info">{t('skipGuide')}</div>
            </div>
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ) : null}
      {showGuide === 'report' ? (
        <div className={`wrapper-guide report ${countExpired > 14 ? 'margin-top-55' : ""}`}>
          <div className="font-weight-bold">{t('report')}</div>
          {t('inTheMainMenuOfTheReport')}
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end" onClick={() => handleShowGuide('product')}>
              <div className="badge badge-info">{t('skipGuide')}</div>
            </div>
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ) : null}
      {showGuide === 'product' ? (
        <div className={`wrapper-guide product ${countExpired > 14 ? 'margin-top-55' : ""}`}>
          <div className="font-weight-bold">{t('product')}</div>
            {t('inTheMainMenuOfTheProductModule')}
          <div className="d-flex justify-content-end">
            {subscriptionPartitoin > 1 ? (
              // Jika subscription nya Standard (2) atau Complete (3) maka guide selanjutnya Inventory
              <div className="d-flex justify-content-end" onClick={() => handleShowGuide('inventory')}>
                <div className="badge badge-info">{t('skipGuide')}</div>
              </div>
            ): (
              <div className="d-flex justify-content-end" onClick={() => handleShowGuide('outlet')}>
                <div className="badge badge-info">{t('skipGuide')}</div>
              </div>
            )}
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ) : null }
      {showGuide === 'inventory' ? (
        <div className={`wrapper-guide inventory ${countExpired > 14 ? 'margin-top-55' : ""}`}>
          <div className="font-weight-bold">{t('inventory')}</div>
          {t('inTheInventoryModule')}
          <div className="d-flex justify-content-end">
            {subscriptionPartitoin > 2 ? (
              <div className="d-flex justify-content-end" onClick={() => handleShowGuide('kitchen')}>
                <div className="badge badge-info">{t('skipGuide')}</div>
              </div>
            ) : (
              <div className="d-flex justify-content-end" onClick={() => handleShowGuide('outlet')}>
                <div className="badge badge-info">{t('skipGuide')}</div>
              </div>
            )}
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ): null}
      {showGuide === 'kitchen' ? (
        <div className={`wrapper-guide kitchen ${countExpired > 14 ? 'margin-top-55' : ""}`}>
          <div className="font-weight-bold">{t(kitchenModul)}</div>
          {kitchenModul === 'assembly' ? (
            <div>
              {t('inTheAssemblyModule')}
            </div>
          ) : (
            <div>
              {t('inTheKitchenModule')}
            </div>
          )}
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end" onClick={() => handleShowGuide('outlet')}>
              <div className="badge badge-info">{t('skipGuide')}</div>
            </div>
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ): null}
      {showGuide === 'outlet' ? (
        <div className={`wrapper-guide ${subscriptionPartitoin === 1 ? 'outlet-basic' : subscriptionPartitoin === 2 ? 'outlet-standard' : 'outlet' } ${countExpired > 14 ? 'margin-top-55' : ""}`}>
          <div className="font-weight-bold">{t('outlet')}</div>
          {t('inTheMainOutletMenu')}
          <div className="d-flex justify-content-end">
            {subscriptionPartitoin > 2 ? (
              <div className="d-flex justify-content-end" onClick={() => handleShowGuide('promo')}>
                <div className="badge badge-info">{t('skipGuide')}</div>
              </div>
            ) : (
              <div className="d-flex justify-content-end" onClick={() => handleShowGuide('staff')}>
                <div className="badge badge-info">{t('skipGuide')}</div>
              </div>
            )}
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ): null}
      {showGuide === 'promo' ? (
        <div className={`wrapper-guide promo ${countExpired > 14 ? 'margin-top-55' : ""}`}> 
          <div className="font-weight-bold">{t('promo')}</div>
          {t('inTheSpecialPromoMenu')}
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end" onClick={() => handleShowGuide('staff')}>
              <div className="badge badge-info">{t('skipGuide')}</div>
            </div>
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ): null}
      {showGuide === 'staff' ? (
        <div className={`wrapper-guide ${subscriptionPartitoin === 1 ? 'staff-basic' : subscriptionPartitoin === 2 ? 'staff-standard' : 'staff'}  ${countExpired > 14 ? 'margin-top-55' : ""}`}>
          <div className="font-weight-bold">{t('staff')}</div>
          {t('onTheStaffMenu')}
          <div className="d-flex justify-content-end">
            {subscriptionPartitoin > 1 ? (
              <div className="d-flex justify-content-end" onClick={() => handleShowGuide('role')}>
                <div className="badge badge-info">{t('skipGuide')}</div>
              </div>
            ) : (
              <div className="d-flex justify-content-end" onClick={() => handleShowGuide('account')}>
                <div className="badge badge-info">{t('skipGuide')}</div>
              </div>
            )}
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ): null}
      {showGuide === 'role' ? (
        <div className={`wrapper-guide ${subscriptionPartitoin === 2 ? 'role-standard' : " role"} ${countExpired > 14 ? 'margin-top-55' : ""}`}>
          <div onClick={() => handleShowGuide('customer')}>
            <div className="font-weight-bold">{t('role')}</div>
            {t('theMainRoleMenuWillShowTheRolesThatExistInYourBusiness')}
          </div>
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end" onClick={() => handleShowGuide('customer')}>
              <div className="badge badge-info">{t('skipGuide')}</div>
            </div>
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ): null}
      {showGuide === 'customer' ? (
        <div className={`wrapper-guide ${subscriptionPartitoin === 2 ? 'customer-standard' : 'customer'} ${countExpired <= 14 ? 'margin-bottom-55' : ""}`}>
          <div onClick={() => handleShowGuide('account')}>
            <div className="font-weight-bold">{t('customer')}</div>
            {t('inTheCustomerManagementMainMenu')}
          </div>
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end" onClick={() => handleShowGuide('account')}>
              <div className="badge badge-info">{t('skipGuide')}</div>
            </div>
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ): null}
      {/* {showGuide === 'commission' ? (
        <div className={`wrapper-guide commission ${countExpired > 14 ? 'margin-top-55' : ""}`}>
          <div onClick={() => handleShowGuide('account')}>
            <div className="font-weight-bold">{t('commission')}</div>
            {t('recordTheCommissionsEarnedByYourStaffUsingTheCommissionModule')}
          </div>
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end" onClick={() => handleShowGuide('account')}>
              <div className="badge badge-info">{t('skipGuide')}</div>
            </div>
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ): null} */}
      {showGuide === 'account' ? (
        <div className={`wrapper-guide ${subscriptionPartitoin === 1 ? 'account-bassic' : subscriptionPartitoin === 2 ? 'account-standard' : 'account'}  ${countExpired <= 14 ? 'margin-bottom-55' : ""}`}>
          <div onClick={() => handleShowGuide('payment')}>
            <div className="font-weight-bold">{t('account')}</div>
            {t('onTheAccountInformationMenu')}
          </div>
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end" onClick={() => handleShowGuide('payment')}>
              <div className="badge badge-info">{t('skipGuide')}</div>
            </div>
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('subscription')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ): null}
      {/* {showGuide === 'subscription' ? (
        <div className={`wrapper-guide subscription ${countExpired > 14 ? 'margin-top-55' : ""}`}>
          <div onClick={() => handleShowGuide('payment')}>
            <div className="font-weight-bold">Subscription</div>
            {t('seeTheStatusOfYourBeetPOSSubscriptionHere')}
          </div>
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end" onClick={() => handleShowGuide('payment')}>
              <div className="badge badge-info">{t('skipGuide')}</div>
            </div>
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('payment')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ): null} */}
      {showGuide === 'payment' && countryCodeIso3 === "IDN" ? (
        <div className={`wrapper-guide ${subscriptionPartitoin === 1 ? 'payment-basic' : subscriptionPartitoin === 2 ? 'payment-standard' : 'payment'}  ${countExpired <= 14 ? 'margin-bottom-55' : ""}`}>
          <div onClick={() => handleShowGuide('finish_guide')}>
            <div className="font-weight-bold">{t('payment')}</div>
            {t('simplifyYourBusinessTransactionsByRegisteringYourBusinessOnThisMenu')}
          </div>
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-info">{t('skipGuide')}</div>
            </div>
            <div className="d-flex justify-content-end ml-2" onClick={() => handleShowGuide('finish_guide')}>
              <div className="badge badge-danger">{t('skipAllGuide')}</div>
            </div>
          </div>
        </div>
      ): null}
    </div>
  );
};
