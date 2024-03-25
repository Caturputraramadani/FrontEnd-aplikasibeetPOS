import React from "react";
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { Tabs, Tab } from "react-bootstrap";
import NotificationExpired from "../../components/NotificationExpired"

import { AccountInformation } from "./AccountInformationTab";
import { BusinessInformation } from "./BusinessInformationTab";
import { EmailNotifications } from "./EmailNotificationsTab";

export const AccountPage = () => {
  const [tabs, setTabs] = React.useState("account");
  const [user, setUser] = React.useState("");
  const [updateState, setUpdateState] = React.useState("")

  const location = useLocation()
  const history = useHistory()

  const handleUser = () => {
    const curr = JSON.parse(localStorage.getItem("user_info")).privileges
      ? "staff"
      : "owner";
    setUser(curr);
  };
  const { t } = useTranslation();
  React.useEffect(() => {
    handleUser();
  }, []);

  React.useEffect(() => {
    const queryParams = location.search
    if (queryParams.includes("business-information")) {
      if(queryParams.includes("update-state")) {
        setUpdateState("edit")
      }
      setTabs('business')
      history.replace({ ...history.location.search, location })
    }
  }, [location.search])

  return (
    <>
      <NotificationExpired />
      <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
        <Tab eventKey="account" title={t("accountInformation")}>
          <AccountInformation/>
        </Tab>

        <Tab
          eventKey="business"
          title={t("businessInformation")}
          disabled={user === "owner" ? false : true}
        >
          <BusinessInformation
            updateState={updateState}
          />
        </Tab>

        <Tab
          eventKey="email"
          title={t("emailNotification")}
          disabled={user === "owner" ? false : true}
        >
          <EmailNotifications/>
        </Tab>
      </Tabs>
    </>
  );
};
