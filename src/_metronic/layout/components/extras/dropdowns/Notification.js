import React, { useEffect, useState } from 'react';
import { DropdownButton, Dropdown } from "react-bootstrap";
import axios from "axios"
import Moment from 'react-moment';
import './style.css'
import { useTranslation } from "react-i18next";

const Notification = ({margin, marginBottom}) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const { t } = useTranslation();
  const [allNotification, setAllNotification] = useState([])
  const [count, setCount] = useState(0)
  const calendarStrings = {
    lastDay : '[Yesterday at] LT',
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    lastWeek : '[last] dddd [at] LT',
    nextWeek : 'dddd [at] LT',
    sameElse : 'L'
  };
  const handleGetNotification = async () => {
    try {
      const result = await axios.get(`${API_URL}/api/v1/business-notification`)
      setAllNotification(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  const handleCountNotification = async () => {
    try {
      const result = await axios.get(`${API_URL}/api/v1/business-notification/count`)
      setCount(result.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleGetNotification()
    handleCountNotification()
  }, [])
  const setAlreadyRead = async () => {
    try {
      const result = await axios.get(`${API_URL}/api/v1/business-notification/read-notification`)
      setCount(result.data.count)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div style={{ margin, marginBottom }}>
      <Dropdown drop="down" alignRight>
        <Dropdown.Toggle style={{ marginLeft: "-15px" }} variant="transparent" id="dropdown-basic">
          <i className="flaticon-alert text-success" onClick={setAlreadyRead}/>
          {count > 0 ? (
            <span class="badges">{count}</span>
          ) : null}
        </Dropdown.Toggle>

        <Dropdown.Menu rootCloseEvent="click" id="wrap-menu" >
          <h3 className="p-3 mb-3">{t("notification")}</h3>
          {allNotification.length > 0 ? (
            allNotification.map(value =>
              <>
                <Dropdown.Item className="d-flex flex-column wrap-dropdown">
                  <h5>{value.title}</h5>
                  {value.message.length > 59 ? <h6>{value.message.slice(0, 60)}. . .</h6> : <h6>{value.message}</h6>}
                  <p className="justify-content-end"><Moment calendar={calendarStrings}>{value.createdAt}</Moment></p>
                </Dropdown.Item>
                <hr/>
              </>
            )
          ) : <div className="d-flex justify-content-center align-items-center text-muted">empty</div>}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default Notification;
