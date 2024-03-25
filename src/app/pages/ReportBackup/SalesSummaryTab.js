import React from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import rupiahFormat from "rupiah-format";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import "../style.css";
import NumberFormat from 'react-number-format'

export const SalesSummaryTab = ({ selectedOutlet, startDate, endDate, refresh, endDateFilename }) => {
  const [allTransactions, setAllTransactions] = React.useState([]);
  const [currency, setCurrency] = React.useState("")

  const [reports, setReports] = React.useState([
    {
      product_name: "",
      addons_name: "",
      category_name: "",
      sku: "",
      totalItems: 0,
      grossSales: 0,
      discountSales: 0,
      totalSales: 0
    }
  ]);
  const { t } = useTranslation();
  
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

  const getTransactions = async (id, start_range, end_range) => {
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

    let allSales = [];
    try {
      console.log("start_range", start_range)
      console.log("end_range", end_range)

      // const { data } = await axios.get(
      //   `${API_URL}/api/v1/transaction${outlet_id}date_start=${start_range}&date_end=${end_range}`
      // );
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction/mdr${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      
      console.log("all transaction", data.data)
      setAllTransactions(data.data);
      allSales = data.data;
    } catch (err) {
      if (err.response?.status === 404) {
        setAllTransactions([]);
      }
      allSales = [];
      console.log(err);
    }

    const completedTransactions = allSales.filter(
      (item) => item.Payment?.status === "done"
    );
    const transItems = [];
    const prodIdList = [];
    for (const item of completedTransactions) {
      item.Transaction_Items.forEach((val) => {
        transItems.push(val);
        if (!prodIdList.includes(val.product_id))
          prodIdList.push(val.product_id);
      });
    }

    // sort transItems by product
    transItems.sort((a, b) => {
      if (a.product_id > b.product_id) return 1;
      if (b.product_id > a.product_id) return -1;
    });
    prodIdList.sort();

    // get gross sales of each product
    let allItems2 = [];
    prodIdList.forEach((val) => {
      const temp = transItems.filter((item) => item.product_id === val);
      const grossSales = temp.reduce(
        (init, curr) => (init += curr.price_total + curr.price_discount),
        0
      );
      // const discountSales = temp.reduce(
      //   (init, curr) => (init += curr.),
      //   0
      // );
      const totalSales = temp.reduce(
        (init, curr) => (init += curr.price_total),
        0
      );
      const quantity = temp.reduce((init, curr) => (init += curr.quantity), 0);
      let joinedAddons = "";
      for (const item of temp) {
        const currAddons = item.Transaction_Item_Addons.map(
          (addons) => addons.Addon?.name
        ).filter((val) => val);

        joinedAddons = currAddons.length ? currAddons.join(",") : "";
      }

      allItems2.push({
        product_name: temp[0].Product.name,
        addons_name: joinedAddons,
        category_name: temp[0].Product.Product_Category?.name,
        sku: temp[0].Product?.sku,
        totalItems: quantity,
        grossSales: grossSales,
        // discountSales: discountSales,
        totalSales: totalSales
      });
    });

    //
    //
    //
    // const allItems = completedTransactions.map((item) => {
    //   const grossSales = item.Transaction_Items.reduce(
    //     (init, curr) => (init += curr.price_total + curr.price_discount),
    //     0
    //   );
    //   const discountSales = item.Transaction_Items.reduce(
    //     (init, curr) => (init += curr.price_discount),
    //     0
    //   );
    //   const totalSales = item.Transaction_Items.reduce(
    //     (init, curr) => (init += curr.price_total),
    //     0
    //   );

    //   const output = item.Transaction_Items.map((val) => {
    //     const currAddons = val.Transaction_Item_Addons.map(
    //       (addons) => addons.Addon?.name
    //     ).filter((val) => val);

    //     const joinedAddons = currAddons.length ? currAddons.join(",") : "";

    //     return {
    //       product_name: val.Product.name,
    //       addons_name: joinedAddons,
    //       category_name: val.Product.Product_Category?.name,
    //       sku: val.Product?.sku,
    //       totalItems: val.quantity,
    //       grossSales: grossSales,
    //       discountSales: discountSales,
    //       totalSales: totalSales
    //     };
    //   });

    //   return output;
    // });

    const allProductNames = allItems2.flat(1).reduce((init, curr) => {
      init[`${curr.product_name}-${curr.addons_name}`] = curr?.category_name;
      return init;
    }, {});

    const compileReports = Object.keys(allProductNames).map((item) => {
      const name = item.split("-")[0];
      const addons = item.split("-")[1];
      const category = allProductNames[item];

      const sku = allItems2
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init = curr?.sku), "");

      const totalItems = allItems2
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.totalItems), 0);

      const grossSales = allItems2
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.grossSales), 0);

      // const discountSales = allItems2
      //   .flat(1)
      //   .filter(
      //     (val) => val.product_name === name && val.addons_name === addons
      //   )
      //   .reduce((init, curr) => (init += curr.discountSales), 0);
      const totalSales = allItems2
        .flat(1)
        .filter(
          (val) => val.product_name === name && val.addons_name === addons
        )
        .reduce((init, curr) => (init += curr.totalSales), 0);
      return {
        product_name: name,
        addons_name: addons,
        category_name: category,
        sku,
        totalItems,
        grossSales,
        // discountSales,
        totalSales
      };
    });
    setReports(compileReports);
  };

  React.useEffect(() => {
    getTransactions(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate, refresh]);

  const summaryData = () => {
    const data = [
      {
        key: `(${t("income")})`,
        value: 0
      },
      {
        key: `${t("grossSales")}`,
        value: 0
      },
      {
        key: `(${t("discount")})`,
        value: 0
      },
      {
        key: `(${t("void")})`,
        value: 0
      },
      {
        key: `${t("nettSales")}`,
        value: 0
      },
      {
        key: `(${t("services")})`,
        value: 0
      },
      {
        key: `(${t("tax")})`,
        value: 0
      },
      {
        key: `(${t("rounding")})`,
        value: 0
      },
      {
        key: `${t("totalCollected")}`,
        value: 0
      }
    ];

    const completedTransactions = allTransactions.filter(
      (item) =>
        item.Payment?.status === "done" || item.Payment?.status === "refund"
    );
    const doneTransactions = allTransactions.filter(
      (item) => item.Payment?.status === "done"
    );
    const voidTransactions = allTransactions.filter(
      (item) => item.Payment?.status === "refund"
    );

    const income = completedTransactions.reduce(
      (init, curr) => (init += curr.Payment?.payment_total),
      0
    );

    // discount
    const discount = completedTransactions.reduce(
      (init, curr) => (init += curr.Payment?.payment_discount),
      0
    );

    // income sales
    const incomeSales = income;
    data[0].value = incomeSales + discount;

    // gross sales dikurangi hpp
    const grossSales = income;
    data[1].value = grossSales + discount;

    // discount
    data[2].value = discount;

    // refund / void
    const voidSales = voidTransactions.reduce(
      (init, curr) => (init += curr.Payment.payment_total),
      0
    );
    data[3].value = voidSales;

    // bonus or services
    const bonus = completedTransactions.reduce(
      (init, curr) => (init += curr.Payment?.payment_service),
      0
    );

    // nett sales
    const nettSales = grossSales - voidSales - bonus;
    data[4].value = nettSales;

    // bonus or services
    data[5].value = bonus;

    // tax
    const taxSales = doneTransactions.reduce(
      (init, curr) => (init += curr.Payment.payment_tax),
      0
    );
    data[6].value = taxSales;

    // rounding
    const roundingSales = 0;
    data[7].value = roundingSales;

    // total
    //const totalCollected = nettSales - bonus - taxSales + roundingSales;
    const totalCollected = nettSales + bonus - taxSales + roundingSales;
    data[8].value = totalCollected;

    return data;
  };

  const sumReports = (data, key) => {
    return data.reduce((init, curr) => (init += curr[key]), 0);
  };

  let totalDiscount = 0;
  let totalService = 0;
  if (allTransactions.length) {
    const temp = allTransactions.filter(
      (item) => item.Payment?.status === "done"
    );
    // temp.forEach((item) => {
    //   totalDiscount += item.Payment.payment_discount;
    // });
    totalDiscount = temp.reduce(
      (init, curr) => (init += curr.Payment?.payment_discount),
      0
    );
    totalService = temp.reduce(
      (init, curr) => (init += curr.Payment?.payment_service),
      0
    );
  }

  const completedTransactions = allTransactions.filter(
    (item) =>
      item.Payment?.status === "done" || item.Payment?.status === "refund"
  );
  const doneTransactions = allTransactions.filter(
    (item) => item.Payment?.status === "done"
  );
  const voidTransactions = allTransactions.filter(
    (item) => item.Payment?.status === "refund"
  );

  const income = completedTransactions.reduce(
    (init, curr) => (init += curr.Payment?.payment_total),
    0
  );

  const grossSales = income;

  const voidSales = voidTransactions.reduce(
    (init, curr) => (init += curr.Payment.payment_total),
    0
  );

  const bonus = completedTransactions.reduce(
    (init, curr) => (init += curr.Payment?.payment_service),
    0
  );

  const taxSales = doneTransactions.reduce(
    (init, curr) => (init += curr.Payment.payment_tax),
    0
  );

  const nettSales = grossSales - voidSales - bonus;

  const roundingSales = 0;

  const totalCollected = nettSales + bonus - taxSales + roundingSales;

  // const grandTotal =
  //   sumReports(reports, "totalSales") - totalDiscount + totalService;
  const grandTotal = totalCollected;

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-summary">
          <thead>
            <tr>
              <th>{t("productSalesReport")}</th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>{t("outlet")}</th>
              <td>{selectedOutlet?.name}</td>
            </tr>
          </thead>
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
              <th>{t("productName")}</th>
              <th>{t("additionalOptionNames")}</th>
              <th>{t("category")}</th>
              <th>{t("sku")}</th>
              <th>{t("sold")}</th>
              {/* <th>Penjualan Kotor</th> */}
              <th>{t("total")}</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td>{item.addons_name}</td>
                  <td>{item.category_name}</td>
                  <td>{item.sku}</td>
                  <td>{item.totalItems}</td>
                  {/* <td>{item.grossSales}</td> */}
                  <td>{item.totalSales}</td>
                </tr>
              );
            })}
            <tr>
              <th>{t("subtotal")}</th>
              <th></th>
              <th></th>
              <th></th>
              <th>{sumReports(reports, "totalItems")} </th>
              {/* <th>{sumReports(reports, "grossSales")} </th> */}
              <th>{sumReports(reports, "totalSales")} </th>
            </tr>
            <tr>
              <th>{t("discountGiven")}</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              {/* <th></th> */}
              <th>{totalDiscount}</th>
            </tr>
            <tr>
              <th>{t("service")}</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              {/* <th></th> */}
              <th>{totalService}</th>
            </tr>
            <tr>
              <th>{t("grandTotal")}</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              {/* <th></th> */}
              <th>{grandTotal}</th>
            </tr>
          </tbody>
        </table>
      </div>

      <Table striped>
        <tbody>
          {summaryData().map((item, index) => {
            return (
              <tr key={index}>
                <td></td>
                <td>{item.key}</td>
                <td><NumberFormat value={item.value} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};
