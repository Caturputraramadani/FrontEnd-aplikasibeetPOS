import React, {useEffect, useState} from 'react';
import { useTranslation } from "react-i18next";
import styles from './subscription.module.css'
import Money from '../../../images/Group 124.png'
import InvoiceEmpty from '../../../images/Vector.png'
import axios from 'axios'
import NumberFormat from 'react-number-format'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import outletIcon from "../../../images/icons8-store-front-96 black.png"

import {
  Paper
} from "@material-ui/core";
import {
  Row,
  Col,
  Form,
  Dropdown,
  InputGroup,
  ListGroup
} from "react-bootstrap";

const SubscriptionPage = () => {
  dayjs.extend(LocalizedFormat)
  const { t } = useTranslation();

  const API_URL = process.env.REACT_APP_API_URL;
  const [subscriptionName, setSubscriptionName] = useState([])
  const [selected, setSelected] = useState("1")
  const [totalAmount, setTotalAmount] = useState("")
  const [activeOutlet, setActiveOutlet] = useState([])
  const [totalActiveOutlet, setTotalActiveOutlet] = useState(0)
  const [business, setBusiness] = useState({})
  const [currency, setCurrency] = useState("")
  const [expirationDate, setExpirationDate] = useState("") 
  const [expiredOutlet, setExpiredOutlet] = useState("") 

  const getSubscriptionName = async () => {
    // output
    // 1 month, 2 month, 3 month, 1 year, trial
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/subscription-type`);
      setSubscriptionName(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getOutlet = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      console.log("getOutlet", data.data)
      const tempActiveOutlet = []
      data.data.map(value => {
        if(value.status === 'active') {
          tempActiveOutlet.push(value)
        }
      })
      console.log("tempActiveOutlet", tempActiveOutlet.length)
      setTotalActiveOutlet(tempActiveOutlet.length)
      setActiveOutlet(tempActiveOutlet)
    } catch (error) {
      console.log(error)
    }
  }

  const getBusiness = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)
      const tempDataExpired = data.data.Subscription.expired_date
      console.log("tempDataExpired", tempDataExpired)
      const textFormatDayjs = dayjs(tempDataExpired).format('D MMMM YYYY')
      const formatDayjs = dayjs(tempDataExpired)
      const date = new Date()
      const resultDate = formatDayjs.diff(dayjs(date), 'day')
      console.log("resultDate", resultDate)
      const expiredOutlet = `${textFormatDayjs} (${resultDate + 1} days)`
      console.log("expiredOutlet", expiredOutlet)
      setExpiredOutlet(expiredOutlet)
      setCurrency(data.data.Currency.name)
      setBusiness(data.data)
    } catch (error) {
      console.log("Error get Date", error)
    }
  }

  const handleSubscriptionName = (e) => {
    if(e) {
      const tempId = e.target.value
      const found = subscriptionName.find(value => value.id == tempId)

      const addDayjs = dayjs().add(parseInt(found.limit), 'day')
      const formatDayjs = dayjs(addDayjs).format('D MMMM YYYY')

      setExpirationDate(formatDayjs)
      setSelected(e.target.value)
      setTotalAmount(found.price)
    }
  }
  useEffect(() => {
    getOutlet()
    getSubscriptionName()
    getBusiness()
  }, [])

  return (
    <div>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("subscription")}</h3>
              </div>
            </div>
            <Row>
              <Col>
                  <div className={styles.wrapperLeft}>
                    <div><strong>{t("subscriptionInformation")}</strong></div>
                    <hr />
                    <div className={styles.fontDefault}>{t("business")}: {business.name}</div>
                    <div className={styles.fontDefault}>{t("currentPlan")}: {business.Subscription?.Subscription_Type.name}</div>
                    <div className={styles.fontDefault}>{t("lastPayment")}: N/A</div>
                    <hr />
                    <div className="mb-2"><strong>{t("activeOutlet")}</strong></div>
                    {activeOutlet.length > 0 ? activeOutlet.map(value =>
                      <div className="d-flex align-items-center mb-2">
                        <div className={styles.wrapperMoney}>
                          <img src={outletIcon} alt="Outlet Icon" />
                        </div>
                        <div>
                          <div className={styles.fontDefault}>{value.name}</div>
                          <div className={styles.fontDefault}>{t("expiredDate")}</div>
                          <div className={styles.fontDefault}>{expiredOutlet}</div>
                        </div>
                      </div>
                      ) : null
                    }
                  </div>
              </Col>
              <Col>
                <div className={styles.wrapperRight}>
                  <div><strong>{t("subscription")}</strong></div>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong className={styles.left}>{t("subscriptionType")}</strong>
                    <select className={styles.right} value={selected} onChange={(e) => handleSubscriptionName(e)}>
                      {subscriptionName.map((val, idx) => {
                        return (
                          <option key={val.id} value={val.id}>
                            {val.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <strong className={styles.left}>{t("activeOutlet")}</strong>
                    <div className={styles.wrapperTotal}>
                      <div className={styles.totalActiveOutlet}>{totalActiveOutlet}</div>
                    </div>
                  </div>

                    <div className={styles.toalAmount} >
                      <div className="">{t("totalAmount")}</div>
                        {totalAmount ? (
                          <div><NumberFormat value={totalAmount} displayType={'text'} thousandSeparator={true} prefix={currency} /></div>
                        ): "-"}
                    </div>

                    <div className="mt-2">
                      <div className={styles.fontDefault, styles.italic}>{t("expirationDateWillBeExtendedTo")}</div>
                      {expirationDate ? (
                        <strong className={styles.italic}>{expirationDate}</strong>
                      ): '-'}
                    </div>

                  <div className={styles.wrapperButton}>
                    {/* <div className={styles.button}> */}
                      <div className="btn btn-primary">{t("continueToPayment")}</div>
                    {/* </div> */}
                  </div>

                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className={styles.activeInvoice}>{t("activeInvoice&SubscriptionHistory")}</div>
                <hr />
                <div className={styles.containerActiveInvoice}>
                  <div className={styles.invoiceEmpty}>
                    <img src={InvoiceEmpty} alt="Empty" />
                  </div>
                  <div className={styles.dontHaveInvoce}>{t("youDontHaveAnyInvoiceYet")}</div>
                </div>
                <hr />
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
    </div>
  );
}

export default SubscriptionPage;
