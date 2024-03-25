import React from "react";
import axios from "axios";
import { KeyboardTimePicker } from "@material-ui/pickers";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper,
  InputLabel,
  Select,
  TextField
} from "@material-ui/core";
import ModalRecepientEmail from "./modal/ModalRecepientEmail";

import "../style.css";
import { map } from "lodash-es";

export const EmailNotifications = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [switchState, setSwitchState] = React.useState({
    cashRecap: false,
    dailySales: false,
    weeklySales: false,
    lowStock: false
  });
  const [timingState, setTimingState] = React.useState({
    daily_sales: new Date(),
    weekly_sales: new Date(),
    stock_alert: new Date()
  });
  const [minimum, setMinimum] = React.useState(5);
  const [day, setDay] = React.useState(0);
  const [initialSwitchState, setInitialSwitchState] = React.useState({
    cashRecap: false,
    dailySales: false,
    weeklySales: false,
    lowStock: false
  });
  const [stateComponent, setStateComponent] = React.useState("show");
  const [loading, setLoading] = React.useState(false);
  const [showModalRecepient, setShowModalRecepient] = React.useState(false)

  const { t } = useTranslation();

  const handleNotifTransactionRecap = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const {data} = await axios.get(`${API_URL}/api/v1/transaction/find-transaction-recap?businessId=${userInfo.business_id}`)
      // console.log("data apaan", data.data)
      data.data.map(async value => {
        const message = {
          title: `Transaction Recap At ${value.Outlet.name}`,
          message: `${value.createdAt.split("T")[0]} - ${value.createdAt.split("T")[1]} \n Recap By ${value.User?.User_Profile.name}` 
        }
        // console.log("ini messagenya", message)
        // await axios.post(`${API_URL}/api/v1/business-notification`, message)
        // console.log("yey berhasill")
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getEmailNotifications = async () => {
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    try {
      const settingsNotification = await axios.get(
        `${API_URL}/api/v1/email-notification/${userInfo.business_id}`
      );
      const { data } = await axios.get(
        `${API_URL}/api/v1/product`
      );
      const dateSettings = new Date(settingsNotification.data.data.timeState[2].time)
      const dateNow = new Date()
      // console.log("ini data semua", settingsNotification.data.data)
      // console.log("data.data", data.data)
      
      data.data.map(async value => {
        if(value.has_stock) {
          if(value.stock <= settingsNotification.data.data.timeState[2].minimum_stock) {
            if(dateSettings.getHours() - dateNow.getHours() <= 0){
              if(dateSettings.getMinutes() - dateNow.getMinutes() <= 0 && dateSettings.getMinutes() - dateNow.getMinutes() >= -10) {
                // console.log("sudah waktunya kirim notif")
                if(value.unit_id) {
                  const message = {
                    title: "Stock Alert",
                    message: `${value.name} ${value.stock} ${value.Unit.name}` 
                  }
                  // await axios.post(`${API_URL}/api/v1/business-notification`, message)
                  // console.log("ini data yang akan di push notification", `${value.name} ${value.stock} ${value.Unit.name}`)
                } else {
                  const message = {
                    title: "Stock Alert",
                    message: `${value.name} ${value.stock} unit` 
                  }
                  // await axios.post(`${API_URL}/api/v1/business-notification`, message)
                  // console.log("ini data yang akan di push notification", `${value.name} ${value.stock} unit`)
                }
              }
            } else {
              console.log("belum waktunya kirim notif")
            }
          }
        }
      })
      const milisecond = new Date(settingsNotification.data.data.timeState[2].time)
      const milisecondSekarang = new Date()

      const convertWaktu = new Date(milisecond)
      const convertWaktuSekarang = new Date(milisecondSekarang)

      // console.log("ini data semua produk", data.data)
      // console.log("ini seting milisecond", milisecond.getTime());
      // console.log("ini milisecond sekarang", milisecondSekarang.getTime());
      // console.log("convert waktu", convertWaktu.toString())
      // console.log("convert waktu sekarang", convertWaktuSekarang.toString())

      // console.log("hasilnya jam", dateSettings.getHours() - dateNow.getHours())
      // console.log("hasilnya menit", dateSettings.getMinutes() - dateNow.getMinutes())

      // console.log("ini setting Jam", milisecond.getHours())
      // console.log("ini Jam sekarang", milisecondSekarang.getHours())
      // console.log("ini setting Menit", milisecond.getMinutes())
      // console.log("ini Meint sekarang", milisecondSekarang.getMinutes())

      setSwitchState({
        cashRecap:
          settingsNotification.data.data.emailNotification.rekap_kas || false,
        dailySales:
          settingsNotification.data.data.emailNotification
            .penjualan_produk_harian || false,
        weeklySales:
          settingsNotification.data.data.emailNotification
            .penjualan_produk_mingguan || false,
        lowStock:
          settingsNotification.data.data.emailNotification.stok_habis_harian ||
          false
      });

      setInitialSwitchState({
        cashRecap:
          settingsNotification.data.data.emailNotification.rekap_kas || false,
        dailySales:
          settingsNotification.data.data.emailNotification
            .penjualan_produk_harian || false,
        weeklySales:
          settingsNotification.data.data.emailNotification
            .penjualan_produk_mingguan || false,
        lowStock:
          settingsNotification.data.data.emailNotification.stok_habis_harian ||
          false
      });

      setTimingState({
        daily_sales: settingsNotification.data.data.timeState[0].time,
        weekly_sales: settingsNotification.data.data.timeState[1].time,
        stock_alert: settingsNotification.data.data.timeState[2].time
      });

      setMinimum(settingsNotification.data.data.minimum);
      setDay(settingsNotification.data.data.day);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMinimumChange = (e) => setMinimum(e.target.value);
  const handleDayChange = (e) => setDay(e.target.value);

  const handleDailyChange = (e) => {
    setTimingState({
      ...e,
      daily_sales: dayjs(e).format(),
      weekly_sales: timingState.weekly_sales,
      stock_alert: timingState.stock_alert
    });
  };
  const handleWeeklyChange = (e) => {
    setTimingState({
      ...e,
      daily_sales: timingState.daily_sales,
      weekly_sales: dayjs(e).format(),
      stock_alert: timingState.stock_alert
    });
  };
  const handleStockChange = (e) => {
    setTimingState({
      ...e,
      daily_sales: timingState.daily_sales,
      weekly_sales: timingState.weekly_sales,
      stock_alert: dayjs(e).format()
    });
  };
  React.useEffect(() => {
    getEmailNotifications();
    handleNotifTransactionRecap()
  }, []);

  const allFields = [
    {
      field: `${t("cashRecap")}`,
      description:
        `${t("getANorificationEmailWhenaCashRecapActivityHappened")}`,
      value: switchState.cashRecap,
      name: "cashRecap"
    },
    {
      field: `${t("dailySalesReport")}`,
      description: `${t("getASalesReportNotificationEmailOnceADay")}`,
      value: switchState.dailySales,
      timeValue: timingState.daily_sales,
      name: "dailySales",
      component: (
        <KeyboardTimePicker
          margin="normal"
          id="daily-sales"
          label={t("selectTime")}
          ampm={false}
          name="daily_sales"
          disabled={stateComponent === "show" ? true : false}
          value={timingState.daily_sales}
          onChange={handleDailyChange}
          KeyboardButtonProps={{
            "aria-label": "change time"
          }}
        />
      ),
      text: `${t('youCanChooseTimeForSendingEmailDailySalesReport')}`
    },
    {
      field: `${t("weeklySalesReport")}`,
      description: `${t("getASalesReportNotificationEmailOnceAWeek")}`,
      value: switchState.weeklySales,
      timeValue: timingState.weekly_sales,
      name: "weeklySales",
      component: (
        <KeyboardTimePicker
          margin="normal"
          id="weekly-sales"
          name="weekly_sales"
          label={t("selectTime")}
          ampm={false}
          disabled={stateComponent === "show" ? true : false}
          value={timingState.weekly_sales}
          onChange={handleWeeklyChange}
          KeyboardButtonProps={{
            "aria-label": "change time"
          }}
        />
      ),
      text: `${t("youCanChooseTimingForSendingEmailWeeklySalesReport")}`,
      low: (
        <FormControl style={{ width: "100%" }}>
          <InputLabel htmlFor="hari">{t('day')}</InputLabel>
          <Select
            native
            value={day}
            onChange={handleDayChange}
            disabled={stateComponent === "show" ? true : false}
            inputProps={{
              name: "hari",
              id: "hari"
            }}
          >
            <option aria-label="None" value="" />
            <option value={1}>{t("monday")}</option>
            <option value={2}>{t("tuesday")}</option>
            <option value={3}>{t("wednesday")}</option>
            <option value={4}>{t("thursday")}</option>
            <option value={5}>{t("friday")}</option>
            <option value={6}>{t("saturday")}</option>
            <option value={0}>{t("sunday")}</option>
          </Select>
        </FormControl>
      ),
      text2: `${t("youCanChangeTheDayForSetWeeklyReports")}`
    },
    {
      field: `${t("lowStockAlert")}`,
      description:
        `${t("getADailyNotificationWhenAProductStockIsNearlyEmpty/Empty")}`,
      value: switchState.lowStock,
      timeValue: timingState.stock_alert,
      name: "lowStock",
      low: (
        <TextField
          label={t("minimum")}
          type="number"
          disabled={stateComponent === "show" ? true : false}
          onChange={handleMinimumChange}
          value={minimum}
          min="0"
          id="standard-size-normal"
          defaultValue="Normal"
        />
      ),
      component: (
        <KeyboardTimePicker
          margin="normal"
          id="low-stock"
          name="stock_alert"
          ampm={false}
          label={t("selectTime")}
          disabled={stateComponent === "show" ? true : false}
          value={timingState.stock_alert}
          onChange={handleStockChange}
          KeyboardButtonProps={{
            "aria-label": "change time"
          }}
        />
      ),
      text: `${t("youcanSelecttimeForSendingEmailLowstockAlert")}`,
      text2: `${t("youcanSetTheMinimumAllStockForNotification")}`
    }
  ];

  const sendData = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const emailData = {
      rekap_kas: switchState.cashRecap,
      stok_habis_harian: switchState.lowStock,
      penjualan_produk_harian: switchState.dailySales,
      penjualan_produk_mingguan: switchState.weeklySales,
      daily_sales_time: timingState.daily_sales,
      weekly_sales_time: timingState.weekly_sales,
      stock_alert_time: timingState.stock_alert,
      minimum_stock: minimum,
      day: day
    };

    // console.log("emailData", emailData)

    try {
      enableLoading();
      await axios.put(
        `${API_URL}/api/v1/email-notification/${userInfo.business_id}`,
        emailData
      );
      disableLoading();

      setInitialSwitchState({
        cashRecap: switchState.cashRecap,
        dailySales: switchState.dailySales,
        weeklySales: switchState.weeklySales,
        lowStock: switchState.lowStock
      });

      setStateComponent("show");
    } catch (err) {
      console.log(err);
      disableLoading();
    }
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleSwitch = (e) => {
    setSwitchState({
      ...switchState,
      [e.target.name]: e.target.checked
    });
  };

  const handleStateComponent = () => {
    if (stateComponent === "show") {
      setStateComponent("edit");
    } else {
      setSwitchState(initialSwitchState);
      setStateComponent("show");
    }
  };

  const openModalRecepient = () => setShowModalRecepient(true)
  const closeModalRecepient = () => setShowModalRecepient(false)

  return (
    <>
      <ModalRecepientEmail
        t={t}
        cancelModal={closeModalRecepient}
        stateModal={showModalRecepient}
        title="Modal Recipient Email"
        loading={loading}
      />
      <Row>
        <Col md={12}>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("emailNotification")}</h3>
              </div>
  
              <div className="headerEnd">
                <div className="btn btn-primary mr-2" onClick={openModalRecepient}>
                  {t("addRecipientEmail")}
                </div>
                {stateComponent === "show" ? (
                  <Button variant="primary" onClick={handleStateComponent}>
                    {t("edit")}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={handleStateComponent}
                      style={{ marginRight: "1rem" }}
                    >
                      {t("cancel")}
                    </Button>
                    <Button variant="primary" onClick={sendData}>
                      {loading ? (
                        <Spinner animation="border" variant="light" size="sm" />
                      ) : (
                        `${t("saveChanges")}`
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
  
            {allFields.map((item, index) => {
              return (
                <>
                  <Row key={index} style={{ padding: "1rem" }}>
                    <Col md={4}>
                      {item.field} <br /> {item.description}
                    </Col>
                    <Col md={3}>
                      <FormControl component="fieldset">
                        <FormGroup aria-label="position" row>
                          <FormControlLabel
                            value={item.value}
                            control={
                              <Switch
                                color="primary"
                                checked={item.value}
                                onChange={handleSwitch}
                                name={item.name}
                                disabled={
                                  stateComponent === "show" ? true : false
                                }
                              />
                            }
                            label={item.value ? `${t("active")}` : `${t("inactive")}`}
                            labelPlacement="start"
                          />
                        </FormGroup>
                      </FormControl>
                    </Col>
                    <Col md={2}>
                      {item.low ? item.low : ""}
                      {item.text2 ? item.text2 : ""}
                    </Col>
                    <Col md={3} style={{ marginTop: "-30px" }}>
                      {item.component ? item.component : ""}
                      {item.text ? item.text : ""}
                    </Col>
                  </Row>
                  {index === allFields.length - 1 ? "" : <hr />}
                </>
              );
            })}
          </Paper>
        </Col>
      </Row>
    </>
  );
};
