import React from "react";
import axios from "axios";

import { Tabs, Tab } from "react-bootstrap";

import ProductTab from "./ProductTab/ProductTab";

import UnitTab from "../Ingredient/UnitTab/UnitTab";

import ProductCategoryTab from "./ProductCategoryTab/ProductCategoryTab";

import ProductConvertion from './ProductConvertion/ProductConvertion'

import { useTranslation } from "react-i18next";

export const ProductPage = () => {
  const [tabs, setTabs] = React.useState("product");
  const [refresh, setRefresh] = React.useState(0);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allCategories, setAllCategories] = React.useState([]);
  const [allTaxes, setAllTaxes] = React.useState([]);
  const [allUnit, setAllUnit] = React.useState([]);
  const [allMaterials, setAllMaterials] = React.useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const userInfo = JSON.parse(localStorage.getItem("user_info"));

  const getOutlet = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const outlets = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(outlets.data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getProductCategory = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const allCategories = await axios.get(
        `${API_URL}/api/v1/product-category`
      );
      setAllCategories(allCategories.data.data);
    } catch (err) {
      setAllCategories([]);
    }
  };

  const getTax = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product-tax`);
      setAllTaxes(data.data);
    } catch (err) {
      setAllTaxes([]);
    }
  };

  const getEmailNotifications = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const settingsNotification = await axios.get(
        `${API_URL}/api/v1/email-notification/${userInfo.business_id}`
      );
      const { data } = await axios.get(
        `${API_URL}/api/v1/product`
      );
      const dateSettings = new Date(settingsNotification.data.data.timeState[2].time)
      const dateNow = new Date()
      data.data.map(async value => {
        if(value.has_stock) {
          if(value.stock <= settingsNotification.data.data.timeState[2].minimum_stock) {
            if(dateSettings.getHours() - dateNow.getHours() <= 0){
              if(dateSettings.getMinutes() - dateNow.getMinutes() <= 0 && dateSettings.getMinutes() - dateNow.getMinutes() >= -10) {
                if(value.unit_id) {
                  const message = {
                    title: "Stock Alert",
                    message: `${value.name} ${value.stock} ${value.Unit.name}` 
                  }
                  // await axios.post(`${API_URL}/api/v1/business-notification`, message)
                } else {
                  const message = {
                    title: "Stock Alert",
                    message: `${value.name} ${value.stock} unit` 
                  }
                  // await axios.post(`${API_URL}/api/v1/business-notification`, message)
                }
              }
            } else {
            }
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getUnit = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/unit`);
      setAllUnit(data.data);
    } catch (err) {
      setAllUnit([]);
    }
  };

  const getMaterial = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/raw-material`);
      setAllMaterials(data.data);
    } catch (err) {
      setAllMaterials([]);
    }
  };

  const handleRefresh = () => {
    setRefresh((state) => state + 1);
  };

  React.useEffect(() => {
    getOutlet();
    getTax();
    getUnit();
    getMaterial();
    getEmailNotifications()
  }, []);

  React.useEffect(() => {
    getProductCategory();
  }, [refresh]);

  const { t } = useTranslation();

  return (
    <>
      <hr/>
      <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
        <Tab eventKey="product" title={t("titleTabProduct")}>
          <ProductTab
            t={t}
            allOutlets={allOutlets}
            allCategories={allCategories}
            allTaxes={allTaxes}
            allUnit={allUnit}
            allMaterials={allMaterials}
            refresh={refresh}
            handleRefresh={handleRefresh}
            userInfo={userInfo}
          />
        </Tab>

        <Tab eventKey="unit" title={t("titleTabUnit")}>
          <UnitTab refresh={refresh} t={t} handleRefresh={handleRefresh} />
        </Tab>

        <Tab eventKey="product-category" title={t("titleTabCategory")}>
          <ProductCategoryTab
            t={t}
            allOutlets={allOutlets}
            refresh={refresh}
            handleRefresh={handleRefresh}
          />
        </Tab>

        {/* <Tab eventKey="product-convertion" title="Product Convertion">
          <ProductConvertion
            allOutlets={allOutlets}
            refresh={refresh}
            handleRefresh={handleRefresh}
          />
        </Tab> */}

      </Tabs>
    </>
  );
};
