import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'
import { useTranslation } from "react-i18next";
import "../style.css";

export const CategorySalesTab = ({ selectedOutlet, startDate, endDate, refresh }) => {
  const [allCategorySales, setAllCategorySales] = React.useState([]);
  const [allCategories, setAllCategories] = React.useState([]);
  const [currency, setCurrency] = React.useState("")
  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

    // console.log("currency nya brpw", data.data.Currency.name)
     

    setCurrency(data.data.Currency.name)
  }
  React.useEffect(() => {
    handleCurrency()
  }, [])

  const { t } = useTranslation();
  const getCategorySales = async (id, start_range, end_range) => {
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
        `${API_URL}/api/v1/transaction/category-sales${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      // const { data } = await axios.get(
      //   `${API_URL}/api/v1/transaction/category-sales/mdr${outlet_id}date_start=${start_range}&date_end=${end_range}`
      // );
      setAllCategorySales(data.data);
    } catch (err) {
      if (err.response.status === 404) {
        setAllCategorySales([]);
      }
      console.log(err);
    }
  };

  const getCategories = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product-category`);
      const categories = data.data.map((item) => item.name);
      setAllCategories(categories);
    } catch (err) {
      if (err.response.status === 404) {
        setAllCategories([]);
      }
      console.log(err);
    }
  };

  React.useEffect(() => {
    getCategorySales(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate, refresh]);

  React.useEffect(() => {
    getCategories();
  }, []);

  // NOTE: jika product tidak ada category, tidak masuk ke report ini. harus diubah cara ambil list category nya
  const categorySalesData = () => {
    const data = [];

    const completedTransactions = allCategorySales.filter(
      (item) => item.Payment?.status === "done"
    );
    const voidTransactions = allCategorySales.filter(
      (item) => item.Payment?.status === "refund"
    );

    const typesSold = completedTransactions.map((item) =>
      item.Transaction_Items.map((val) => val.Product.Product_Category?.name)
    );
    const typesRefund = voidTransactions.map((item) =>
      item.Transaction_Items.map((val) => val.Product.Product_Category?.name)
    );
    const countTypesSold = typesSold.map((item, index) => {
      return item.reduce((init, curr) => {
        const filterProduct = completedTransactions[
          index
        ].Transaction_Items.filter(
          (prod) => prod.Product.Product_Category?.name === curr
        );
        init[curr] = filterProduct.reduce(
          (initItem, currItem) => (initItem += currItem.quantity),
          0
        );
        return init;
      }, {});
    });
    const countTypesRefund = typesRefund.map((item, index) => {
      return item.reduce((init, curr) => {
        const filterProduct = voidTransactions[index].Transaction_Items.filter(
          (prod) => prod.Product.Product_Category?.name === curr
        );
        init[curr] = filterProduct.reduce(
          (initItem, currItem) => (initItem += currItem.quantity),
          0
        );
        return init;
      }, {});
    });
    const countTypesTotal = typesSold.map((item, index) => {
      return item.reduce((init, curr) => {
        const filterProduct = completedTransactions[
          index
        ].Transaction_Items.filter(
          (prod) => prod.Product.Product_Category?.name === curr
        );
        init[curr] = filterProduct.reduce(
          (initItem, currItem) =>
            (initItem +=
              currItem.quantity *
              (currItem.price_product -
                currItem.price_discount +
                currItem.price_service)),
          0
        );
        return init;
      }, {});
    });

    const categorySold = allCategories.reduce((init, curr) => {
      init[curr] = countTypesSold.reduce(
        (initItem, currItem) => (initItem += currItem[curr] || 0),
        0
      );
      return init;
    }, {});
    const categoryRefund = allCategories.reduce((init, curr) => {
      init[curr] = countTypesRefund.reduce(
        (initItem, currItem) => (initItem += currItem[curr] || 0),
        0
      );
      return init;
    }, {});
    const categoryTotal = allCategories.reduce((init, curr) => {
      init[curr] = countTypesTotal.reduce(
        (initItem, currItem) => (initItem += currItem[curr] || 0),
        0
      );
      return init;
    }, {});

    allCategories.forEach((category) => {
      console.log("categoryTotal[category]", categoryTotal[category])
      data.push({
        category,
        sold: categorySold[category],
        refunded: categoryRefund[category],
        total: categoryTotal[category]
      });
    });

    data.sort((a, b) => b.sold - a.sold);

    const totalSold = data.reduce((init, curr) => (init += curr.sold), 0);
    const totalRefunded = data.reduce(
      (init, curr) => (init += curr.refunded),
      0
    );
    const totalAmount = data.reduce((init, curr) => (init += curr.total), 0);

    data.push({
      category: "",
      sold: totalSold,
      refunded: totalRefunded,
      total: totalAmount
    });

    return data;
  };

  return (
    <>
      <Table id="table-category" striped>
        <thead>
          <tr>
            <th></th>
            <th>{t("category")}</th>
            <th>{t("itemsSold")}</th>
            <th>{t("itemsRefunded")}</th>
            <th>{t("totalCollected")}</th>
          </tr>
        </thead>
        <tbody>
          {categorySalesData().map((item, index) => {
            return (
              <tr key={index}>
                <td></td>
                <td>{item.category}</td>
                <td>{item.sold}</td>
                <td>{item.refunded}</td>
                <td><NumberFormat value={item.total} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
