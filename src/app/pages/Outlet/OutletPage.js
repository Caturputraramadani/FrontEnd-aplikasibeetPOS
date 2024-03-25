import React from "react";
import axios from "axios";

import { Tabs, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { OutletTab } from "./OutletTab/OutletTab";
import { TaxTab } from "./TaxTab/TaxTab";
import { PaymentTab } from "./PaymentTab/PaymentTab";
import { TableManagementTab } from "./TableManagementTab/TableManagementTab";
import { SalesTypeTab } from "./SalesTypeTab/SalesTypeTab";

export const OutletPage = () => {
  const [tabs, setTabs] = React.useState("outlet");
  const [allProvinces, setAllProvinces] = React.useState([]);
  const [allTaxes, setAllTaxes] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);
  const [showOptionEcommerce, setShowOptionEcommerce] = React.useState(false)
  const [optionsEcommerce, setOptionsEcommerce] = React.useState([])
  const { t } = useTranslation();
  const handleRefresh = () => setRefresh((state) => state + 1);
  const [showFeature, setShowFeature] = React.useState({
    mdr: false
  })

  const [businessTypeId, setBusinessTypeId] = React.useState(0)

  const getProvinces = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/province`);
      setAllProvinces(data.data);
    } catch (err) {
      setAllProvinces([]);
    }
  };

  const getTaxes = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/tax`);
      setAllTaxes(data.data);
    } catch (err) {
      setAllTaxes([]);
    }
  };

  const handleEcommerceIntegrate = async () => {
    try {
      const localData = JSON.parse(localStorage.getItem("user_info"));
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/business/${localData.business_id}`
      );
      if (data.data.ecommerce_integrate) {
        setShowOptionEcommerce(true)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionEcommerce = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/ecommerce-list`
      );
      setOptionsEcommerce(data.data.rows)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubscriptionPartition = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`
      );

      let mdr;

      if(data.data[0].subscription_partition_id === 3) {
        mdr = true
      }
      if(data.data[0].subscription_partition_id === 2) {
        mdr = true
      }
      if(data.data[0].subscription_partition_id === 1) {
        mdr = false
      }
      setShowFeature({
        mdr
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleBusiness = async () => {
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/business/${userInfo.business_id}`)
      console.log("business_type_id", data.data.business_type_id)
      setBusinessTypeId(data.data.business_type_id)
    } catch (error) {
      console.log("error handleBusiness", error)
    }
  }

  React.useEffect(() => {
    handleBusiness()
    handleSubscriptionPartition()
    handleEcommerceIntegrate()
    handleOptionEcommerce()
  }, [])

  React.useEffect(() => {
    getProvinces();
    getTaxes();
  }, [refresh]);

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="outlet" title={t("outlet")}>
        <OutletTab
          allProvinces={allProvinces}
          allTaxes={allTaxes}
          handleRefresh={handleRefresh}
          refresh={refresh}
        />
      </Tab>

      <Tab eventKey="tax" title={t("tax&Charges")}>
        <TaxTab handleRefresh={handleRefresh} refresh={refresh}/>
      </Tab>

      <Tab eventKey="payment" title={t("payment")}>
        <PaymentTab 
          handleRefresh={handleRefresh} 
          refresh={refresh}
          showOptionEcommerce={showOptionEcommerce}
          optionsEcommerce={optionsEcommerce}
          showFeature={showFeature}
        />
      </Tab>

      <Tab eventKey="sales-type" title={t("salesType")}>
        <SalesTypeTab 
          handleRefresh={handleRefresh} 
          refresh={refresh} 
          t={t}
          showOptionEcommerce={showOptionEcommerce}
          optionsEcommerce={optionsEcommerce}
        />
      </Tab>

      {/* partisi business type */}
      {businessTypeId === 2 ? (
        <Tab eventKey="table-management" title={t("tableManagement")}>
          <TableManagementTab handleRefresh={handleRefresh} refresh={refresh} t={t}/>
        </Tab>
      ) : null}
    </Tabs>
  );
};
