/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { DropdownButton, Dropdown } from "react-bootstrap";
import iconTrash from "../../../../../../src/images/5981684251543238936 5.png";
import axios from "axios";
import dayjs from "dayjs";

import objectPath from "object-path";
import { useHtmlClassService } from "../../../_core/MetronicLayout";
import { toAbsoluteUrl } from "../../../../_helpers";
import { DropdownTopbarItemToggler } from "../../../../_partials/dropdowns";
import { useTranslation } from "react-i18next";
import "./style.css";
export function UserProfileDropdownBackup() {
  const [tabs, setTabs] = React.useState(0);
  const [notifStockAlert, setNotifStockAlert] = useState(false);
  const [notifRecapTransaction, setNotifRecapTransaction] = useState(false);
  const [dateReport, setDateReport] = useState([]);
  const [filterWeeklyReport, setFilterWeeklyReport] = useState(false);
  const [filterDailyReport, setFilterDailyReport] = useState(false);
  const [emailNotification, setEmailNotification] = useState({});

  const API_URL = process.env.REACT_APP_API_URL;

  const { user } = useSelector((state) => state.auth);
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      light:
        objectPath.get(uiService.config, "extras.user.dropdown.style") ===
        "light"
    };
  }, [uiService]);
  const getEmailNotifications = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const settingsNotification = await axios.get(
        `${API_URL}/api/v1/email-notification/${userInfo.business_id}`
      );

      setEmailNotification(settingsNotification.data.data);

      const { data } = await axios.get(`${API_URL}/api/v1/product`);

      const dateSettings = new Date(
        settingsNotification.data.data.timeState[2].time
      );
      const dateNow = new Date();
      data.data.map(async (value) => {
        if (value.has_stock) {
          if (
            value.stock <=
            settingsNotification.data.data.timeState[2].minimum_stock
          ) {
            if (dateSettings.getHours() - dateNow.getHours() <= 0) {
              if (
                dateSettings.getMinutes() - dateNow.getMinutes() <= 0 &&
                dateSettings.getMinutes() - dateNow.getMinutes() >= -10
              ) {
                if (value.unit_id) {
                  const message = {
                    title: "Stock Alert",
                    message: `${value.name} ${value.stock} ${value.Unit.name}`
                  };
                  // await axios.post(`${API_URL}/api/v1/business-notification`, message)
                } else {
                  const message = {
                    title: "Stock Alert",
                    message: `${value.name} ${value.stock} unit`
                  };
                  // await axios.post(`${API_URL}/api/v1/business-notification`, message)
                }
              }
            } else {
            }
          }
        }
      });
      return settingsNotification.data.data;
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetNotification = async () => {
    try {
      await getEmailNotifications();
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const resultReport = await axios.get(
        `${API_URL}/api/v1/transaction/find-transaction-recap?businessId=${userInfo.business_id}`
      );
      setDateReport(resultReport.data.data);
      const result = await axios.get(`${API_URL}/api/v1/business-notification`);
      const stockAlert = [];
      const transactionRecap = [];
      result.data.data.map((value) => {
        if (value.title === "Stock Alert") {
          stockAlert.push(value);
        }
        if (value.title.split("At")[0] === "Transaction Recap ") {
          transactionRecap.push(value);
        }
      });
      setNotifStockAlert(stockAlert);
      setNotifRecapTransaction(transactionRecap);
      logicDate(resultReport.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const logicDate = async (dateReport) => {
    const result = await getEmailNotifications();
    const esBuah = [];
    const esAlpukat = [];
    dateReport.map((value) => {
      const now = new Date();
      const dateRecap = new Date(value.createdAt);

      let dateWeekly = null;
      if (now.getMonth() - dateRecap.getMonth() == 0) {
        if (dateRecap.getDay() === result.day) {
          dateWeekly = now.getDate() - 7;
        }
        if (dateRecap.getDate() >= dateWeekly) {
          // console.log("value", value)
        }
        if (
          dateRecap.getDate() >= dateWeekly &&
          dateRecap.getDate() <= now.getDate()
        ) {
          esBuah.push(value);
        }
        // if(now.getDate() - dateRecap.getDate() <= 7) {
        //   console.log("jika sama bulannya dan kurang dari 8 hari")
        //   console.log("now.getDate() - dateRecap.getDate()", now.getDate() - dateRecap.getDate() === 0)
        //   esBuah.push(value)
        // }
        if (now.getDate() - dateRecap.getDate() === 0) {
          if (dateRecap.getHours() - now.getHours() <= 0) {
            esAlpukat.push(value);
          }
        }
        if (now.getDate() - dateRecap.getDate() === 1) {
          if (dateRecap.getHours() - now.getHours() >= 0) {
            esAlpukat.push(value);
          }
        }
      } else if (now.getMonth() - dateRecap.getMonth() == 1) {
        if (now.getDate() + dateRecap.getDate() - 30 <= 7) {
          esBuah.push(value);
        }
      }
    });
    setFilterWeeklyReport(esBuah);
    setFilterDailyReport(esAlpukat);
  };
  const chooseLanguages = [
    {
      no: 1,
      key: "id",
      language: "Indonesia"
    },
    {
      no: 2,
      key: "en",
      language: "English"
    },
    {
      no: 3,
      key: "cn_simplified",
      language: "Chinese Simplified"
    },
    {
      no: 4,
      key: "cn_traditional",
      language: "Chinese Traditional"
    }
  ];

  const { t, i18n } = useTranslation();

  const changeLanguage = (language, noLanugage) => {
    setTabs(noLanugage);
    i18n.changeLanguage(language);
  };

  const handleDeleteStock = async () => {
    const idStock = [];
    notifStockAlert.map((value) => {
      idStock.push(value.id);
    });
    if (idStock) {
      idStock.map(async (value) => {
        const result = await axios.delete(
          `${API_URL}/api/v1/business-notification/${value}`
        );
        // console.log("thenNotification", result.data.data)
        setNotifStockAlert(result.data.data);
      });
    }
  };

  const handleDeleteRecap = async (id) => {
    try {
      const result = await axios.delete(
        `${API_URL}/api/v1/business-notification/${id}`
      );
      handleGetNotification();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetNotification();
  }, []);

  return (
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle
        as={DropdownTopbarItemToggler}
        id="dropdown-toggle-user-profile"
      >
        <div
          onClick={handleGetNotification}
          className={
            "btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
          }
        >
          <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">
            Hi,
          </span>
          <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
            {user.name}
          </span>
          <span className="symbol symbol-35 symbol-light-success">
            <span className="symbol-label font-size-h5 font-weight-bold">
              {user.name.slice(0, 1)}
            </span>
          </span>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround  dropdown-menu-xl">
        <>
          {/** ClassName should be 'dropdown-menu p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround dropdown-menu-xl' */}
          {layoutProps.light && (
            <>
              <div className="d-flex align-items-center p-8 rounded-top">
                <div className="symbol symbol-md bg-light-primary mr-3 flex-shrink-0">
                  <img src={toAbsoluteUrl("/media/users/300_21.jpg")} alt="" />
                </div>
                <div className="text-dark m-0 flex-grow-1 mr-3 font-size-h5">
                  {user.name}
                </div>
                <span className="label label-light-success label-lg font-weight-bold label-inline">
                  3 messages
                </span>
              </div>
              <div className="separator separator-solid"></div>
            </>
          )}

          {!layoutProps.light && (
            <>
              <div
                className="p-6 bgi-size-cover bgi-no-repeat rounded-top rounded-bottom"
                style={{
                  backgroundImage: `url(${toAbsoluteUrl(
                    "/media/misc/bg-1.jpg"
                  )})`
                }}
              >
                <div className="d-flex align-items-center justify-content-between flex-wrap">
                  <div className="symbol bg-white-o-15 mr-3">
                    <span className="symbol-label text-success font-weight-bold font-size-h4">
                      {user.name.slice(0, 1)}
                    </span>
                    {/*<img alt="Pic" className="hidden" src={user.pic} />*/}
                  </div>
                  <div className="text-white m-0 flex-grow-1 mr-3 font-size-h5">
                    {user.name}
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-6">
                  <Link
                    to="/logout"
                    className="btn btn-light-primary font-weight-bold"
                  >
                    {t("signOut")}
                  </Link>
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={
                      tabs !== 0
                        ? chooseLanguages.find(
                            (item) => item.no === parseInt(tabs)
                          ).language
                        : `${t("chooseLanguage")}`
                    }
                  >
                    {chooseLanguages.map((item) => (
                      <Dropdown.Item
                        as="button"
                        onClick={() => changeLanguage(item.key, item.no)}
                        className="selected"
                      >
                        {item.language}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </div>
                {/* <span className="label label-success label-lg font-weight-bold label-inline">
                  3 messages
                </span> */}
              </div>
            </>
          )}
        </>

        {(notifStockAlert.length > 0 &&
          emailNotification.emailNotification?.stok_habis_harian) ||
        (notifRecapTransaction.length > 0 &&
          emailNotification.emailNotification?.rekap_kas) ||
        (filterWeeklyReport.length > 0 &&
          emailNotification.emailNotification?.penjualan_produk_mingguan) ||
        (filterDailyReport.length > 0 &&
          emailNotification.emailNotification?.penjualan_produk_harian) ? (
          <div className="navi navi-spacer-x-0 pt-5 wrapper-popup-notification">
            {/* Start Notification Email */}

            <div className="low-stock-alert px-8">
              {notifStockAlert.length > 0 &&
              emailNotification.emailNotification?.stok_habis_harian ? (
                <>
                  <h5 style={{ fontWeight: 700 }}>Low Stock Alert</h5>
                  <div className="content-notif mt-5">
                    <div className="content-left">
                      {notifStockAlert.map((value) => (
                        <p>{value.message}</p>
                      ))}
                    </div>
                    <div className="content-right">
                      <div className="wrap-image" onClick={handleDeleteStock}>
                        <img src={iconTrash} alt="Icon Trash" />
                      </div>
                    </div>
                  </div>
                </>
              ) : // <h5 style={{ fontWeight: 700 }}>Low Stock Alert (empty)</h5>
              null}
            </div>
            {notifRecapTransaction.length > 0 &&
            emailNotification.emailNotification?.rekap_kas ? (
              <>
                <div>
                  <hr />
                  <div className="low-stock-alert px-8">
                    {notifRecapTransaction.map((value) => (
                      <>
                        <h5 className="mt-4" style={{ fontWeight: 700 }}>
                          {value.title}
                        </h5>
                        <div className="content-notif mt-2">
                          <div className="content-left">
                            <p>{value.message}</p>
                          </div>
                          <div className="content-right">
                            <div
                              className="wrap-image"
                              onClick={() => handleDeleteRecap(value.id)}
                            >
                              <img src={iconTrash} alt="Icon Trash" />
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                    <div className="button-download">Download Report</div>
                  </div>
                </div>
              </>
            ) : /* <div className="low-stock-alert px-8">
                    <h5 className="mt-4" style={{ fontWeight: 700 }}>Transaction Recap (empty)</h5>
                  </div> */
            null}
            {filterWeeklyReport.length > 0 &&
            emailNotification.emailNotification?.penjualan_produk_mingguan ? (
              <div>
                <hr />
                <div className="low-stock-alert px-8">
                  <h5 style={{ fontWeight: 700 }}>
                    Weekly Report has been sent
                  </h5>
                  {filterWeeklyReport.map((value) => (
                    <div className="content-notif mt-5">
                      <div className="content-left">
                        <p>
                          {value.createdAt.split("T")[0]} -{" "}
                          {value.createdAt.split("T")[1]}
                        </p>
                      </div>
                      <div className="content-right">
                        <div className="wrap-image">
                          <img src={iconTrash} alt="Icon Trash" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="button-download">Download Report</div>
                </div>
              </div>
            ) : // <div className="low-stock-alert px-8">
            //   <h5 style={{ fontWeight: 700 }}>Weekly Report (empty)</h5>
            // </div>
            null}
            {filterDailyReport.length > 0 &&
            emailNotification.emailNotification?.penjualan_produk_harian ? (
              <div>
                <hr />
                <div className="low-stock-alert px-8">
                  <h5 style={{ fontWeight: 700 }}>
                    Daily Report has been sent
                  </h5>
                  {filterDailyReport.map((value) => (
                    <div className="content-notif mt-5">
                      <div className="content-left">
                        <p>
                          {value.createdAt.split("T")[0]} -{" "}
                          {value.createdAt.split("T")[1]}
                        </p>
                      </div>
                      <div className="content-right">
                        <div className="wrap-image">
                          <img src={iconTrash} alt="Icon Trash" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="button-download">Download Report</div>
                </div>
              </div>
            ) : /* <div className="low-stock-alert px-8">
                    <h5 style={{ fontWeight: 700 }}>Daily Report (empty)</h5>
                  </div> */
            null}
            {/* End Notification Email */}

            {/* <a className="navi-item px-8">
                    <div className="navi-link">
                      <div className="navi-icon mr-2">
                        <i className="flaticon2-calendar-3 text-success"/>
                      </div>
                      <div className="navi-text">
                        <div className="font-weight-bold">
                          My Profile
                        </div>
                        <div className="text-muted">
                          Account settings and more
                          <span className="label label-light-danger label-inline font-weight-bold">update</span>
                        </div>
                      </div>
                    </div>
                  </a>
      
                  <a className="navi-item px-8">
                    <div className="navi-link">
                      <div className="navi-icon mr-2">
                        <i className="flaticon2-mail text-warning"></i>
                      </div>
                      <div className="navi-text">
                        <div className="font-weight-bold">
                          My Messages
                        </div>
                        <div className="text-muted">
                          Inbox and tasks
                        </div>
                      </div>
                    </div>
                  </a>
      
                  <a className="navi-item px-8">
                    <div className="navi-link">
                      <div className="navi-icon mr-2">
                        <i className="flaticon2-rocket-1 text-danger"></i>
                      </div>
                      <div className="navi-text">
                        <div className="font-weight-bold">
                          My Activities
                        </div>
                        <div className="text-muted">
                          Logs and notifications
                        </div>
                      </div>
                    </div>
                  </a>
      
                  <a className="navi-item px-8">
                    <div className="navi-link">
                      <div className="navi-icon mr-2">
                        <i className="flaticon2-hourglass text-primary"></i>
                      </div>
                      <div className="navi-text">
                        <div className="font-weight-bold">
                          My Tasks
                        </div>
                        <div className="text-muted">
                          latest tasks and projects
                        </div>
                      </div>
                    </div>
                  </a> */}
            <div className="navi-separator mt-3"></div>

            {/* navi-footer px-8 py-5 */}
            <div className="">
              {/* backup logout */}
              {/* <Link
                    to="/logout"
                    className="btn btn-light-primary font-weight-bold"
                  >
                    {t("signOut")}
                  </Link> */}

              {/* <Dropdown>
                    <Dropdown.Toggle variant="light">{t("chooseLanguage")}</Dropdown.Toggle>
      
                    <Dropdown.Menu>
                      {chooseLanguages.map(item =>
                        <Dropdown.Item as="button" onClick={() => changeLanguage(item.key)}>{item.language}</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown> */}

              {/* backup choose language */}
              {/* <DropdownButton
                    id="dropdown-basic-button"
                    title={
                      tabs !== 0
                        ? chooseLanguages.find((item) => item.no === parseInt(tabs))
                            .language
                        : `${t("chooseLanguage")}`
                    }
                  >
                    {chooseLanguages.map((item) => (
                      <Dropdown.Item
                        as="button"
                        onClick={() => changeLanguage(item.key, item.no)}
                        className="selected"
                      >
                        {item.language}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton> */}

              {/* <a href="#" className="btn btn-clean font-weight-bold">
                    Upgrade Plan
                  </a> */}
            </div>
          </div>
        ) : null}
      </Dropdown.Menu>
    </Dropdown>
  );
}
