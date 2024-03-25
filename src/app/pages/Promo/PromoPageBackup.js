/* 
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { Row, Col, Button } from "react-bootstrap";
import { Paper } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import "../style.css";

export const PromoPage = () => {
  const [promoCategories, setPromoCategories] = React.useState([]);
  const [voucherPromoList, setVoucherPromoList] = React.useState([])

  const getVoucherCustomerList = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const user_info = JSON.parse(localStorage.getItem('user_info'));
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/customer-voucher-list?business_id=${user_info.business_id}&status=available`)
      setVoucherPromoList(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const { t } = useTranslation();
  const getPromoCategories = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/promo-category`);
      data.data.map(value => {
        console.log("value.name", value.name)
        console.log("value.description", value.description)
        console.log("t('specialPromo')", t("specialPromo"))
        if (value.name === "Special Promo") {
          value.name = t("specialPromo")
          value.description = t("aPromoThatCanBeAppliedToACertainGroup/Individual")
        }
        if (value.name === "Automatic Promo") {
          value.name = t("automaticPromo")
          value.description = t("aPromoThatCanBeAutomaticallyAppliedIfATransactionMetACertainCriteriaThatHasBeenSet")
        }
        if (value.name === "Voucher Promo") {
          value.name = t("voucherPromo")
          value.description = t("voucherCanBeCreatedAndSharedToTheCustomerForADiscount")
        }
        if (value.name === "Point/Loyalty System") {
          value.name = t("point/LoyaltySystem")
          value.description = t("point/LoyalitySystemCanBeActivedToGiveCustomerLoyalityPointsThatCanBeExchangedForRewardsAndDiscount")
        }
      })
      console.log("data.data", data.data)
      setPromoCategories(data.data);
    } catch (err) {
      setPromoCategories([]);
    }
  };

  React.useEffect(() => {
    getPromoCategories();
    getVoucherCustomerList()
  }, []);
  const dataKategoriPromo = [
    {
      id: 1,
      name: "Special Promo",
      description: "A promo that can be applied to a certain group / individual. Can be applied by the cashier.",
    },
    {
      id: 2,
      name: "Automatic Promo",
      description: "A promo that can be automatically applied if a transaction met a certain criteria that has been set.",
    },
    {
      id: 3,
      name: "Voucher Promo",
      description: "Voucher can be created and shared to the customer for a discount.",
    },
    {
      id: 4,
      name: "Point/Loyalty System",
      description: "Point / Loyalty System can be activated to give customer loyalty points that can be exchanged for rewards and discounts.",
    }
  ]
  console.log("promoCategories", promoCategories)
  return (
    <>
      {promoCategories.map((item, index) => {
        if (item.name === "Promo Khusus" || item.name ===  "特别促销" || item.name === "特價" || item.name === "Special Promo") {
          item.name = "Special Promo"
          item.title_name = `${t("specialPromo")}`
        }
        if (item.name === "Promo Otomatis" || item.name === "自动促销" || item.name === "自動促銷" || item.name === "Automatic Promo") {
          item.name = "Automatic Promo"
          item.title_name = `${t("automaticPromo")}`
        }
        if (item.name === "Promo Voucher" || item.name === "折扣券促销" || item.name === "優惠卷" || item.name === "Voucher Promo") {
          item.name = "Voucher Promo"
          item.title_name = `${t("voucherPromo")}`
        }
        if (item.name === "Poin/Loyalitas Sistem" || item.name === "积分/忠诚度系统" || item.name === "積分/忠誠度系統" || item.name === "Point/Loyalty System") {
          item.name = "Point/Loyalty System"
          item.title_name = `${t("point/LoyaltySystem")}`
        }
        const link = item.name
          .split(" ")
          .map((val) => val.replace(/[^A-Za-z0-9]/, "-"))
          .join("-")
          .toLowerCase();

        let activePromos = [];
        // if (item.name === t("specialPromo")) {
        //   activePromos = item.Promos.filter(
        //     (val) => val.Special_Promo?.status === "active"
        //   );
        // }
        // if (item.name === t("automaticPromo")) {
        //   activePromos = item.Promos.filter(
        //     (val) => val.Automatic_Promo?.status === "active"
        //   );
        // }
        // if (item.name === t("voucherPromo")) {
        //   activePromos = item.Promos.filter(
        //     (val) => val.Voucher_Promo?.status === "active"
        //   );
        // }
        // if (item.name === t("point/LoyaltySystem")) {
        //   activePromos = item.Promos.filter(
        //     (val) => val.Loyalty_Promo?.status === "active"
        //   );
        // }

        if (item.title_name === t("specialPromo")) {
          activePromos = item.Promos.filter(
            (val) => val.Special_Promo?.status === "active"
          );
        }
        if (item.title_name === t("automaticPromo")) {
          activePromos = item.Promos.filter(
            (val) => val.Automatic_Promo?.status === "active"
          );
        }
        if (item.title_name === t("voucherPromo")) {
          activePromos = item.Promos.filter(
            (val) => val.Voucher_Promo?.status === "active"
          );
        }
        if (item.title_name === t("point/LoyaltySystem")) {
          activePromos = item.Promos.filter(
            (val) => val.Loyalty_Promo?.status === "active"
          );
        }

        console.log("activePromos", activePromos)

        return (
          <Row key={index} style={{ marginBottom: "2rem" }}>
            <Col>
              <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
                <div className="headerPage">
                  <div className="headerStart">
                    <h5>{item.title_name}</h5>
                  </div>
                  <div className="headerEnd" style={{ display: "inline-flex" }}>
                    <p style={{ margin: 0, alignSelf: "center" }}>
                      {activePromos.length ? activePromos.length : "No"} {t("activePromo")}
                    </p>

                    <Link to={`promo/${link}`}>
                      <Button
                        variant="primary"
                        style={{ marginLeft: "1rem", borderRadius: "2rem" }}
                      >
                        {t("viewPromo")}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div style={{ padding: "1rem" }}>{item.description}</div>
              </Paper>
            </Col>
          </Row>
        );
      })}
      <Row style={{ marginBottom: "2rem" }}>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h5>{t('voucherCustomer')}</h5>
              </div>
              <div className="headerEnd" style={{ display: "inline-flex" }}>
                <p style={{ margin: 0, alignSelf: "center" }}>
                  {voucherPromoList.length ? voucherPromoList.length : "No"} {t("activePromo")}
                </p>

                <Link to='promo/voucher-promo-customer'>
                  <Button
                    variant="primary"
                    style={{ marginLeft: "1rem", borderRadius: "2rem" }}
                  >
                    {t("viewPromo")}
                  </Button>
                </Link>
              </div>
            </div>

            <div style={{ padding: "1rem" }}>{t('generateCustomerVouchersCanBeRedeemedOnTheWebAppLoyaltyPromo')}</div>
          </Paper>
        </Col>
      </Row>
    </>
  );
};


*/