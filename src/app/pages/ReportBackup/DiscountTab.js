import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";
import { useTranslation } from "react-i18next";
import "../style.css";
import NumberFormat from 'react-number-format'
export const DiscountSalesTab = ({ selectedOutlet, startDate, endDate, endDateFilename }) => {
  const [allPromoSales, setAllPromoSales] = React.useState([]);
  const { t } = useTranslation();
  const [currency, setCurrency] = React.useState("")
  const handleCurrency = async () => {
      const API_URL = process.env.REACT_APP_API_URL;
      const userInfo = JSON.parse(localStorage.getItem("user_info"));

      const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

      // console.log("currency nya brpw", data.data.Currency.name)
       

      if (data.data.Currency.name === 'Rp') {
        setCurrency("Rp.")
      } else if (data.data.Currency.name === '$') {
        setCurrency("$")
      } else {
        setCurrency("Rp.")
      }
    }
    React.useEffect(() => {
      handleCurrency()
    }, [])

  const getDiscountSales = async (id, start_range, end_range) => {
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
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/promo-sales${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setAllPromoSales(data.data);
    } catch (err) {
      if (err.response.status === 404) {
        setAllPromoSales([]);
      }
      console.log(err);
    }
  };

  React.useEffect(() => {
    getDiscountSales(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  const promoSalesData = () => {
    const data = [];

    const completedTransactions = allPromoSales.filter(
      (item) => item.Payment?.status === "done"
    );
    const paymentPromos = completedTransactions.filter(
      (item) => item.Payment?.Payment_Promos.length
    );

    const automaticPromos = paymentPromos
      .map((item) =>
        item.Payment?.Payment_Promos.filter((val) => val.Promo.Automatic_Promo)
      )
      .flat(1);
    const specialPromos = paymentPromos
      .map((item) =>
        item.Payment?.Payment_Promos.filter((val) => val.Promo.Special_Promo)
      )
      .flat(1);
    const voucherPromos = paymentPromos
      .map((item) =>
        item.Payment?.Payment_Promos.filter((val) => val.Promo.Voucher_Promo)
      )
      .flat(1);

    const countAutomaticPromo = automaticPromos.reduce((init, curr) => {
      init[curr.Promo.Automatic_Promo.name] =
        (init[curr.Promo.Automatic_Promo.name] || 0) + 1;

      let valuePromo = init["value_promo"] || 0;

      if (curr.type === "percentage") {
        const currTransaction = paymentPromos.find(
          (item) => item.Payment.id === curr.payment_id
        );
        const totalTrans = currTransaction.Transaction_Items.reduce(
          (initTrans, currTrans) => (initTrans += currTrans.price_total),
          0
        );
        valuePromo += (totalTrans * curr.value) / 100;
      } else {
        valuePromo += curr.value;
      }

      init["value_promo"] = valuePromo;
      return init;
    }, {});
    const countSpecialPromo = specialPromos.reduce((init, curr) => {
      init[curr.Promo.Special_Promo.name] =
        (init[curr.Promo.Special_Promo.name] || 0) + 1;

      let valuePromo = init["value_promo"] || 0;

      if (curr.type === "percentage") {
        const currTransaction = paymentPromos.find(
          (item) => item.Payment.id === curr.payment_id
        );
        const totalTrans = currTransaction.Transaction_Items.reduce(
          (initTrans, currTrans) => (initTrans += currTrans.price_total),
          0
        );
        valuePromo += (totalTrans * curr.value) / 100;
      } else {
        valuePromo += curr.value;
      }

      init["value_promo"] = valuePromo;
      return init;
    }, {});
    const countVoucherPromo = voucherPromos.reduce((init, curr) => {
      init[curr.Promo.Voucher_Promo.name] =
        (init[curr.Promo.Voucher_Promo.name] || 0) + 1;

      let valuePromo = init["value_promo"] || 0;

      if (curr.type === "percentage") {
        const currTransaction = paymentPromos.find(
          (item) => item.Payment.id === curr.payment_id
        );
        const totalTrans = currTransaction.Transaction_Items.reduce(
          (initTrans, currTrans) => (initTrans += currTrans.price_total),
          0
        );
        valuePromo += (totalTrans * curr.value) / 100;
      } else {
        valuePromo += curr.value;
      }

      init["value_promo"] = valuePromo;
      init["quota_voucher"] = curr.Promo.Voucher_Promo.quota;
      return init;
    }, {});

    if (Object.keys(countSpecialPromo).length) {
      const specialPromo = {};
      for (const key of Object.keys(countSpecialPromo)) {
        if (key === "value_promo") {
          specialPromo.total = countSpecialPromo[key];
        } else {
          specialPromo.name = key;
          specialPromo.usage = countSpecialPromo[key];
        }
      }
      data.push(specialPromo);
    }

    if (Object.keys(countAutomaticPromo).length) {
      const automaticPromo = {};
      for (const key of Object.keys(countAutomaticPromo)) {
        if (key === "value_promo") {
          automaticPromo.total = countAutomaticPromo[key];
        } else {
          automaticPromo.name = key;
          automaticPromo.usage = countAutomaticPromo[key];
        }
      }
      data.push(automaticPromo);
    }

    if (Object.keys(countVoucherPromo).length) {
      const automaticPromo = {};
      for (const key of Object.keys(countVoucherPromo)) {
        if (key === "value_promo") {
          automaticPromo.total = countVoucherPromo[key];
        } else if (key === "quota_voucher") {
          automaticPromo.quota = countVoucherPromo[key];
        } else {
          automaticPromo.name = key;
          automaticPromo.usage = countVoucherPromo[key];
        }
      }
      data.push(automaticPromo);
    }

    const totalUsage = data.reduce(
      (init, curr) => (init += curr.usage || 0),
      0
    );
    const totalAmount = data.reduce(
      (init, curr) => (init += curr.total || 0),
      0
    );

    data.push({
      name: "Grand Total",
      usage: totalUsage,
      total: totalAmount
    });

    return data;
  };

  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };
  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-discount">
          <thead>
            <tr>
              <th>{t("discountReport")}</th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>{t("outlet")}</th>
              <td>
                {selectedOutlet.id === " " ||
                selectedOutlet.id === null ||
                selectedOutlet.id === undefined
                  ? "Semua Outlet"
                  : selectedOutlet.name}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>{t("date")}</th>
              <td>{`${startDate} - ${endDateFilename}`}</td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>{t("discountName")}</th>
              <th>{t("usage")}</th>
              <th>{t("totalUsage")}</th>
            </tr>
          </thead>
          <tbody>
            {promoSalesData().length > 0 ? (
              promoSalesData().map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                      {item.quota ? `${item.usage}/${item.quota}` : item.usage}
                    </td>
                    <td>{item.total}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>{t("dataNotFound")}</td>
              </tr>
            )}
            {/* <tr>
              <td>Grand Total</td>
              <td>{sumReports(promoSalesData(), "usage")}</td>
              <td>{sumReports(promoSalesData(), "total")} </td>
            </tr> */}
          </tbody>
        </table>
      </div>
      <Table striped>
        <thead>
          <tr>
            <th></th>
            <th>{t("discountName")}</th>
            <th>{t("totalUsage")}</th>
            <th>{t("totalCollected")}</th>
          </tr>
        </thead>
        <tbody>
          {promoSalesData().length > 0 ? (
            promoSalesData().map((item, index) => {
              return (
                <tr key={index}>
                  <td></td>
                  <td>{item.name}</td>
                  <td>
                    {item.quota ? `${item.usage}/${item.quota}` : item.usage}
                  </td>
                  <td><NumberFormat value={item.total} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>{t("dataNotFound")}</td>
            </tr>
          )}
          {/* <tr>
            <td></td>
            <td>{t("grandTotal")}</td>
            <td>{sumReports(promoSalesData(), "usage")}</td>
            <td>
              <NumberFormat value={sumReports(promoSalesData(), "total")} displayType={'text'} thousandSeparator={true} prefix={currency} />
            </td>
          </tr> */}
        </tbody>
      </Table>
    </>
  );
};
