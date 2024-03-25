import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import socketIOClient from "socket.io-client";

import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { MixedWidget1, MixedWidget2, MixedWidget3, StatsWidget11 } from "../widgets";
import { ProductSale } from "./widgets/ProductSale";
import { PaymentMethod } from "./widgets/PaymentMethod";
import { ProductCategory } from "./widgets/ProductCategory";
import { FinanceSummary } from "./widgets/FinanceSummary";
import sum from "./helpers/sum";
import combineAllSales from "./helpers/combineAllSales";

import weekday from "dayjs/plugin/weekday";
import isYesterday from "dayjs/plugin/isYesterday";
import dayOfYear from "dayjs/plugin/dayOfYear";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(weekday);
dayjs.extend(isYesterday);
dayjs.extend(dayOfYear);
dayjs.extend(customParseFormat);

export function Demo1Dashboard({handleScrollBottom}) {
  const [realTimeTransactions, setRealTimeTransactions] = React.useState([]);
  const [realTimeRange, setRealTimeRange] = React.useState([]);
  const { t } = useTranslation();
  const [productSales, setProductSales] = React.useState({});
  const [paymentMethods, setPaymentMethods] = React.useState({});
  const [productCategories, setProductCategories] = React.useState({});

  const [allOutlets, setAllOutlets] = React.useState([]);
  const [outletId, setOutletId] = React.useState("");
  // const [businessId, setBusinessId] = React.useState("")
  const [outletName, setOutletName] = React.useState(`${t("allOutlet")}`);
  const [rangeId, setRangeId] = React.useState(1);
  const [rangeName, setRangeName] = React.useState(`${t("today")}`);

  const [startRange, setStartRange] = React.useState(new Date());
  const [endRange, setEndRange] = React.useState(new Date());

  const [yesterdayTransactions, setYesterdayTransactions] = React.useState([]);
  const [todayTransactions, setTodayTransactions] = React.useState([]);

  const [yesterdaySales, setYesterdaySales] = React.useState(0);
  const [todaySales, setTodaySales] = React.useState(0);

  const [totalSales, setTotalSales] = React.useState([]);
  const [totalRange, setTotalRange] = React.useState([]);
  const [totalTransactions, setTotalTransactions] = React.useState([]);

  const [currentSales, setCurrentSales] = React.useState([]);
  const [currentRange, setCurrentRange] = React.useState([]);

  const [reports, setReports] = React.useState([
    {
      date: "",
      totalTransactions: "",
      totalSales: "",
      average: ""
    }
  ]);

  const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];

  const ranges = [
    {
      id: 1,
      value: `${t("today")}`,
      valueId: "Hari Ini",
      displayDate: dayjs().format("DD-MM-YYYY"),
      date_start: dayjs()
        //.subtract(1, "day")
        .format("YYYY-MM-DD 00:00:00"),
      date_end: dayjs()
        //.add(1, "day")
        .format("YYYY-MM-DD 23:59:59")
    },
    // {
    //   id: 2,
    //   value: `${t("yesterday")}`,
    //   valueId: "Kemarin",
    //   displayDate: `${dayjs()
    //     .add(-1,'day')
    //     .format("DD-MM-YYYY")}`,
    //   date_start: dayjs()
    //     .add(-1,'day').isYesterday()
    //     //.subtract(1, "day")
    //     .format("YYYY-MM-DD 00:00:00"),
    //   date_end: dayjs()
    //     //.add(1, "day")
    //     .format("YYYY-MM-DD 23:59:59")
    // },
    {
      id: 2,
      value: `${t("thisWeek")}`,
      valueId: "Pekan Ini",
      displayDate: `${dayjs()
        .startOf("week")
        .format("DD-MM-YYYY")} - ${dayjs()
        .endOf("week")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .startOf("week")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .endOf("week")
        .format("YYYY-MM-DD")
    },
    {
      id: 3,
      value: `${t("lastWeek")}`,
      valueId: "Pekan Lalu",
      displayDate: `${dayjs()
        .startOf("week")
        .subtract(1, "week")
        .format("DD-MM-YYYY")} - ${dayjs()
        .endOf("week")
        .subtract(1, "week")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .startOf("week")
        .subtract(1, "week")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .endOf("week")
        .subtract(1, "week")
        .format("YYYY-MM-DD")
    },
    {
      id: 4,
      value: `${t("thisMonth")}`,
      valueId: "Bulan Ini",
      displayDate: `${dayjs()
        .startOf("month")
        .format("DD-MM-YYYY")} - ${dayjs()
        .endOf("month")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .startOf("month")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .endOf("month")
        .format("YYYY-MM-DD")
    },
    {
      id: 5,
      value: `${t("lastMonth")}`,
      valueId: "Bulan Lalu",
      displayDate: `${dayjs()
        .subtract(1, "month")
        .startOf("month")
        .format("DD-MM-YYYY")} - ${dayjs()
        .subtract(1, "month")
        .endOf("month")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .subtract(1, "month")
        .startOf("month")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .subtract(1, "month")
        .endOf("month")
        .format("YYYY-MM-DD")
    },
    // {
    //   id: 6,
    //   value: "Last 6 Months",
    //   date_start: dayjs()
    //     .subtract(6, "month")
    //     .date(1)
    //     .format("YYYY-MM-DD"),
    //   date_end: dayjs()
    //     .endOf("month")
    //     .format("YYYY-MM-DD")
    // },
    {
      id: 7,
      value: `${t("thisYear")}`,
      valueId: "Tahun Ini",
      displayDate: `${dayjs()
        .startOf("year")
        .format("DD-MM-YYYY")} - ${dayjs()
        .endOf("year")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .startOf("year")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .endOf("year")
        .format("YYYY-MM-DD")
    },
    {
      id: 8,
      value: `${t("lastYear")}`,
      valueId: "Tahun Lalu",
      displayDate: `${dayjs()
        .subtract(1, "year")
        .startOf("year")
        .format("DD-MM-YYYY")} - ${dayjs()
        .subtract(1, "year")
        .endOf("year")
        .format("DD-MM-YYYY")}`,
      date_start: dayjs()
        .subtract(1, "year")
        .startOf("year")
        .format("YYYY-MM-DD"),
      date_end: dayjs()
        .subtract(1, "year")
        .endOf("year")
        .format("YYYY-MM-DD")
    },
    {
      id: 9,
      value: `${dayjs(startRange).format("YYYY-MM-DD")} - ${dayjs(
        endRange
      ).format("YYYY-MM-DD")}`,
      valueId: "",
      displayDate: `${dayjs(startRange).format("DD-MM-YYYY")} - ${dayjs(
        endRange
      ).format("DD-MM-YYYY")}`,
      date_start: dayjs(startRange).format("YYYY-MM-DD"),
      date_end: dayjs(endRange).format("YYYY-MM-DD")
    }
  ];

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getTransactions = async (id, range_id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const { date_start, date_end } = ranges.find(
      (item) => item.id === range_id
    );

    let allSalesDone = [];
    let allSalesRefund;
    const outlet_id = id ? `?outlet_id=${id}&` : "?";
    // const business_id = b_id ? `?business_id=${id}&` : "?";

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/transaction${outlet_id}date_start=${date_start}&date_end=${date_end}`
        //https://api.beetpos.com/api/v1/kitchen-management/find-all-temp?outlet_id=121&business_id=87&date_start=2022-07-30%2000:00:00&date_end=2022-08-30%2023:59:59
      );

      allSalesDone = data.data.filter(
        (item) => item.Payment?.status === "done"
      );
      allSalesRefund = data.data.filter(
        (item) => item.Payment?.status === "refund"
      );
    } catch (err) {
      if (err.response?.status === 404) {
        allSalesDone = [];
      }
      console.log(err);
    }

    const countAverage = (sum, number) => Math.round(sum / number);
    const createDate = (start_date, operation, number, time) => {
      return Array.from({ length: number }, (v, k) =>
        dayjs(start_date)
          [operation](k, time)
          .format("DD-MM-YYYY")
      );
    };

    switch (range_id) {
      case 1: {
        const range = {
          type: weeks,
          value: [dayjs(date_start).weekday(), dayjs(date_end).weekday() - 1]
        };

        const dates = [date_start, date_end];
        const day = range.value.map((item, index) => {
          return `${range.type[item]},
          ${dayjs(dates[index])
            .subtract(index, "day")
            .format("DD-MM-YYYY")}`;
        });
        setCurrentRange(day);

        const transactions = [];
        const beforeCombinesales = [[], []];
        const now = dayjs().date();

        if (allSalesDone.length) {
          allSalesDone.forEach((item) => {
            if (dayjs(item.Payment.createdAt).date() < now) {
              beforeCombinesales[0].push(item);
            } else {
              beforeCombinesales[1].push(item);
            }
          });
        }

        const afterCombineSales = beforeCombinesales.map((item) => {
          transactions.push(item.length);
          return sum(combineAllSales(item));
        });

        setCurrentSales(transactions);
        setYesterdayTransactions(beforeCombinesales[0]);
        setYesterdaySales(afterCombineSales[0]);
        setTodayTransactions(beforeCombinesales[1]);
        setTodaySales(afterCombineSales[1]);

        setTotalSales(beforeCombinesales);
        setTotalTransactions(transactions);
        setTotalRange(day);

        setReports([
          {
            date: ranges.find((item) => item.id === range_id).displayDate,
            totalTransactions: transactions[1],
            totalSales: afterCombineSales[1],
            average: countAverage(afterCombineSales[1], transactions[1]) || 0
          }
        ]);

        // realtime
        const realtimeType = Array.from({ length: 24 }, (v, k) => k);
        const realtimeAddHalf = realtimeType.reduce((init, curr, index) => {
          init[index] = {
            transactions: [],
            transactionsRefund: [],
            salesTransactions: [],
            voids: [],
            voidsNominal: []
          };
          init[index + ".30"] = {
            transactions: [],
            transactionsRefund: [],
            salesTransactions: [],
            voids: [],
            voidsNominal: []
          };
          return init;
        }, {});

        if (allSalesDone.length) {
          allSalesDone.forEach((item) => {
            if (dayjs(item.Payment.createdAt).date() === now) {
              let index;
              if (dayjs(item.Payment.createdAt).minute() <= 30) {
                index = dayjs(item.Payment.createdAt).hour();
              } else {
                index = dayjs(item.Payment.createdAt).hour() + ".30";
              }
              realtimeAddHalf[index].transactions.push(item);
            }
          });

          allSalesRefund.forEach((item) => {
            if (dayjs(item.Payment.createdAt).date() === now) {
              let index;
              if (dayjs(item.Payment.createdAt).minute() <= 30) {
                index = dayjs(item.Payment.createdAt).hour();
              } else {
                index = dayjs(item.Payment.createdAt).hour() + ".30";
              }
              realtimeAddHalf[index].transactionsRefund.push(item);
            }
          });
        }

        const realtimeRange = realtimeType.reduce((init, curr, index) => {
          init.push(index.toString());
          init.push(index + ".30");
          return init;
        }, []);

        Object.keys(realtimeAddHalf).forEach((item) => {
          const allTransactions = realtimeAddHalf[item].transactions;
          const allTransactionsRefund =
            realtimeAddHalf[item].transactionsRefund;

          const transactions = allTransactions.reduce((init, curr) => {
            init += 1;
            return init;
          }, 0);

          const salesTransactions = sum(combineAllSales(allTransactions));

          const allVoidsTransactions = [];
          const voids = allTransactionsRefund.reduce((init, curr) => {
            if (curr.Transaction_Refund) {
              allVoidsTransactions.push(curr);
              init += 1;
            }

            return init;
          }, 0);
          const voidsNominal = allTransactionsRefund.reduce((init, curr) => {
            if (curr.Transaction_Refund) {
              init = sum(combineAllSales(allVoidsTransactions));
            }

            return init;
          }, 0);

          realtimeAddHalf[item].transactions = transactions;
          realtimeAddHalf[item].salesTransactions = salesTransactions;
          realtimeAddHalf[item].voids = voids;
          realtimeAddHalf[item].voidsNominal = voidsNominal;
        });

        setRealTimeRange(realtimeRange);
        setRealTimeTransactions(realtimeAddHalf);

        // product sales, payment methods, product categories
        if (allSalesDone.length) {
          const allProducts = [];
          const allPaymentMethods = [];
          const allProductCategories = [];

          allSalesDone.forEach((sale) => {
            sale.Transaction_Items.forEach((item) => {
              allProducts.push({
                name: item.Product?.name || "[Deleted Product]",
                qty: item.quantity
              });

              allProductCategories.push({
                name:
                  item.Product?.Product_Category?.name || "[Deleted Product]"
              });
            });

            allPaymentMethods.push({
              name:
                sale.Payment?.Payment_Method?.name || "[Deleted Payment Method]"
            });
          });

          const countProducts = allProducts.reduce((init, curr) => {
            init[curr.name] = (init[curr.name] || 0) + curr.qty;
            return init;
          }, {});

          const countPaymentMethods = allPaymentMethods.reduce((init, curr) => {
            init[curr.name] = (init[curr.name] || 0) + 1;
            return init;
          }, {});

          const countProductCategories = allProductCategories.reduce(
            (init, curr) => {
              init[curr.name] = (init[curr.name] || 0) + 1;
              return init;
            },
            {}
          );

          setProductSales(countProducts);
          setPaymentMethods(countPaymentMethods);
          setProductCategories(countProductCategories);
        }
        break;
      }

      case 2: {
        const value = Array.from({ length: 7 }, () => []);

        if (allSalesDone.length) {
          allSalesDone.forEach((item) => {
            const index = dayjs(item.Payment.createdAt).weekday();
            value[index].push(item);
          });
        }

        const range = {
          type: weeks,
          value
        };

        const transactions = range.value.map((item) => item.length);

        const week = range.type.map((item, index) => {
          return `${item}, ${dayjs()
            .startOf("week")
            .add(index, "day")
            .format("DD-MM-YYYY")}`;
        });

        setCurrentRange(week);
        setCurrentSales(transactions);

        // report
        const reportDates = createDate(
          ranges.find((item) => item.id === range_id).date_start,
          "add",
          7,
          "day"
        );

        const report = reportDates.map((item) => {
          const currTransaction = allSalesDone.filter(
            (val) => dayjs(val.Payment.createdAt).format("DD-MM-YYYY") === item
          );
          const reportSum = sum(combineAllSales(currTransaction));

          return {
            date: item,
            totalTransactions: currTransaction.length,
            totalSales: reportSum,
            average: countAverage(reportSum, currTransaction.length) || 0
          };
        });

        setReports(report);

        break;
      }

      case 3: {
        const value = Array.from({ length: 7 }, () => []);

        if (allSalesDone.length) {
          allSalesDone.forEach((item) => {
            const index = dayjs(item.Payment.createdAt).weekday();
            value[index].push(item);
          });
        }

        const range = {
          type: weeks,
          value
        };

        const transactions = range.value.map((item) => item.length);

        const week = range.type.map((item, index) => {
          return `${item}, ${dayjs()
            .startOf("week")
            .subtract(1, "week")
            .add(index, "day")
            .format("DD-MM-YYYY")}`;
        });

        setCurrentRange(week);
        setCurrentSales(transactions);

        // report
        const reportDates = createDate(
          ranges.find((item) => item.id === range_id).date_start,
          "add",
          7,
          "day"
        );

        const report = reportDates.map((item) => {
          const currTransaction = allSalesDone.filter(
            (val) => dayjs(val.Payment.createdAt).format("DD-MM-YYYY") === item
          );
          const reportSum = sum(combineAllSales(currTransaction));

          return {
            date: item,
            totalTransactions: currTransaction.length,
            totalSales: reportSum,
            average: countAverage(reportSum, currTransaction.length) || 0
          };
        });

        setReports(report);

        break;
      }

      case 4: {
        // const weekCount = (year, month_number) => {
        //   const firstOfMonth = new Date(year, month_number, 1);
        //   const lastOfMonth = new Date(year, month_number, 0);
        //   const used = firstOfMonth.getDay() + lastOfMonth.getDate();

        //   return Math.ceil(used / 7);
        // };
        // const thisMonthCount = weekCount(dayjs().year(), dayjs().month());
        const thisMonthCount = dayjs().daysInMonth();

        const type = Array.from(
          { length: thisMonthCount },
          (v, k) => `Day ${k + 1}`
        );
        const value = Array.from({ length: thisMonthCount }, () => []);

        if (allSalesDone.length) {
          allSalesDone.forEach((item) => {
            const index = dayjs(item.Payment.createdAt).date() - 1;
            value[index].push(item);
          });
        }

        const range = {
          type,
          value
        };

        const transactions = range.value.map((item) => item.length);

        const allWeekdayInMonth = range.type.map((item, index) => {
          return dayjs()
            .startOf("month")
            .add(index, "day")
            .weekday();
        });

        const day = allWeekdayInMonth.map((item, index) => {
          return `${weeks[item]}, ${dayjs()
            .startOf("month")
            .add(index, "day")
            .format("DD-MM-YYYY")}`;
        });

        setCurrentRange(day);
        setCurrentSales(transactions);

        // report
        const reportDates = createDate(
          ranges.find((item) => item.id === range_id).date_start,
          "add",
          thisMonthCount,
          "day"
        );

        const report = reportDates.map((item) => {
          const currTransaction = allSalesDone.filter(
            (val) => dayjs(val.Payment.createdAt).format("DD-MM-YYYY") === item
          );
          const reportSum = sum(combineAllSales(currTransaction));

          return {
            date: item,
            totalTransactions: currTransaction.length,
            totalSales: reportSum,
            average: countAverage(reportSum, currTransaction.length) || 0
          };
        });

        // group per week
        // let counterWeek = 1;
        // let totalDays = [];
        // const dayNumber = (date) => dayjs(date, "DD-MM-YYYY").day();

        // const filterWeek = reportDates.reduce((init, curr) => {
        //   if (dayNumber(curr) === 0) {
        //     counterWeek += 1;
        //     totalDays = [];
        //   }

        //   totalDays.push(curr);
        //   init["Week " + counterWeek] = totalDays;

        //   return init;
        // }, {});

        // const report = Object.keys(filterWeek).reduce((init, curr) => {
        //   const currTransaction = [];

        //   for (const date of filterWeek[curr]) {
        //     currTransaction.push(
        //       allSalesDone.filter(
        //         (item) =>
        //           dayjs(item.Payment.createdAt).format("DD-MM-YYYY") === date
        //       )
        //     );
        //   }

        //   init[curr] = currTransaction.flat(1);
        //   return init;
        // }, {});

        // const compileReport = Object.keys(report).map((item) => {
        //   const reportSum = sum(combineAllSales(report[item]));

        //   return {
        //     date: `${filterWeek[item][0]} - ${
        //       filterWeek[item][filterWeek[item].length - 1]
        //     }`,
        //     totalTransactions: report[item].length,
        //     totalSales: reportSum,
        //     average: countAverage(reportSum, report[item].length) || 0
        //   };
        // });

        setReports(report);

        break;
      }

      case 5: {
        const lastMonthCount = dayjs()
          .subtract(1, "month")
          .daysInMonth();

        const type = Array.from(
          { length: lastMonthCount },
          (v, k) => `Day ${k + 1}`
        );
        const value = Array.from({ length: lastMonthCount }, () => []);

        if (allSalesDone.length) {
          allSalesDone.forEach((item) => {
            const index = dayjs(item.Payment.createdAt).date() - 1;
            value[index].push(item);
          });
        }

        const range = {
          type,
          value
        };

        const transactions = range.value.map((item) => item.length);

        const allWeekdayLastMonth = range.type.map((item, index) => {
          return dayjs()
            .subtract(1, "month")
            .startOf("month")
            .add(index, "day")
            .weekday();
        });

        const day = allWeekdayLastMonth.map((item, index) => {
          return `${weeks[item]}, ${dayjs()
            .subtract(1, "month")
            .startOf("month")
            .add(index, "day")
            .format("DD-MM-YYYY")}`;
        });

        setCurrentRange(day);
        setCurrentSales(transactions);

        // report
        const reportDates = createDate(
          ranges.find((item) => item.id === range_id).date_start,
          "add",
          lastMonthCount,
          "day"
        );

        const report = reportDates.map((item) => {
          const currTransaction = allSalesDone.filter(
            (val) => dayjs(val.Payment.createdAt).format("DD-MM-YYYY") === item
          );
          const reportSum = sum(combineAllSales(currTransaction));

          return {
            date: item,
            totalTransactions: currTransaction.length,
            totalSales: reportSum,
            average: countAverage(reportSum, currTransaction.length) || 0
          };
        });

        setReports(report);

        break;
      }

      case 7: {
        const yearCount = 12;

        const type = months;
        const value = Array.from({ length: yearCount }, () => []);

        if (allSalesDone.length) {
          allSalesDone.forEach((item) => {
            const index = dayjs(item.Payment.createdAt).month();
            value[index].push(item);
          });
        }

        const range = {
          type,
          value
        };

        const transactions = range.value.map((item) => item.length);

        const month = range.type.map((item, index) => {
          return `${months[index]}, ${dayjs()
            .startOf("year")
            .add(index, "month")
            .format("YYYY")}`;
        });

        setCurrentRange(month);
        setCurrentSales(transactions);

        // report
        const reportDates = createDate(
          ranges.find((item) => item.id === range_id).date_start,
          "add",
          yearCount,
          "month"
        );

        const report = reportDates.map((item) => {
          const currTransaction = allSalesDone.filter(
            (val) =>
              dayjs(val.Payment.createdAt).month() ===
              dayjs(item, "DD-MM-YYYY").month()
          );
          const reportSum = sum(combineAllSales(currTransaction));

          return {
            date: dayjs(item, "DD-MM-YYYY").format("MMMM YYYY"),
            totalTransactions: currTransaction.length,
            totalSales: reportSum,
            average: countAverage(reportSum, currTransaction.length) || 0
          };
        });

        setReports(report);

        break;
      }

      case 8: {
        const yearCount = 12;

        const type = months;
        const value = Array.from({ length: yearCount }, () => []);

        if (allSalesDone.length) {
          allSalesDone.forEach((item) => {
            const index = dayjs(item.Payment.createdAt).month();
            value[index].push(item);
          });
        }

        const range = {
          type,
          value
        };

        const transactions = range.value.map((item) => item.length);

        const month = range.type.map((item, index) => {
          return `${months[index]}, ${dayjs()
            .subtract(1, "year")
            .startOf("year")
            .add(index, "month")
            .format("YYYY")}`;
        });

        setCurrentRange(month);
        setCurrentSales(transactions);

        // report
        const reportDates = createDate(
          ranges.find((item) => item.id === range_id).date_start,
          "add",
          yearCount,
          "month"
        );

        const report = reportDates.map((item) => {
          const currTransaction = allSalesDone.filter(
            (val) =>
              dayjs(val.Payment.createdAt).month() ===
              dayjs(item, "DD-MM-YYYY").month()
          );
          const reportSum = sum(combineAllSales(currTransaction));

          return {
            date: dayjs(item, "DD-MM-YYYY").format("MMMM YYYY"),
            totalTransactions: currTransaction.length,
            totalSales: reportSum,
            average: countAverage(reportSum, currTransaction.length) || 0
          };
        });

        setReports(report);

        break;
      }

      default:
        break;
    }
  };

  const handleRealtime = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const socket = socketIOClient(API_URL);

    socket.on("order", (allSales) => {
      const now = dayjs().date();
      const realtimeType = Array.from({ length: 24 }, (v, k) => k);
      const realtimeAddHalf = realtimeType.reduce((init, curr, index) => {
        init[index] = {
          transactions: [],
          salesTransactions: [],
          voids: [],
          voidsNominal: []
        };
        init[index + ".30"] = {
          transactions: [],
          salesTransactions: [],
          voids: [],
          voidsNominal: []
        };
        return init;
      }, {});

      if (allSales.length) {
        allSales.forEach((item) => {
          if (dayjs(item.Payment.createdAt).date() === now) {
            let index;
            if (dayjs(item.Payment.createdAt).minute() <= 30) {
              index = dayjs(item.Payment.createdAt).hour();
            } else {
              index = dayjs(item.Payment.createdAt).hour() + ".30";
            }
            realtimeAddHalf[index].transactions.push(item);
          }
        });
      }

      const realtimeRange = realtimeType.reduce((init, curr, index) => {
        init.push(index.toString());
        init.push(index + ".30");
        return init;
      }, []);

      Object.keys(realtimeAddHalf).forEach((item) => {
        const allTransactions = realtimeAddHalf[item].transactions;

        const transactions = allTransactions.reduce((init, curr) => {
          init += 1;
          return init;
        }, 0);

        const salesTransactions = sum(combineAllSales(allTransactions));

        const allVoidsTransactions = [];
        const voids = allTransactions.reduce((init, curr) => {
          if (curr.Transaction_Refund) {
            allVoidsTransactions.push(curr);
            init += 1;
          }

          return init;
        }, 0);
        const voidsNominal = allTransactions.reduce((init, curr) => {
          if (curr.Transaction_Refund) {
            init = sum(combineAllSales(allVoidsTransactions));
          }

          return init;
        }, 0);

        realtimeAddHalf[item].transactions = transactions;
        realtimeAddHalf[item].salesTransactions = salesTransactions;
        realtimeAddHalf[item].voids = voids;
        realtimeAddHalf[item].voidsNominal = voidsNominal;
      });

      setRealTimeRange(realtimeRange);
      setRealTimeTransactions(realtimeAddHalf);
    });
  };

  React.useEffect(() => {
    getOutlets();
  }, []);

  React.useEffect(() => {
    handleRealtime();
  }, []);

  React.useEffect(() => {
    getTransactions(outletId, rangeId);
  }, [outletId, rangeId]);

  const handleSelectOutlet = (data) => {
    if (data) {
      setOutletId(data.id);
      setOutletName(data.name);
    } else {
      setOutletId("");
      setOutletName("All Outlets");
    }
  };


  const handleSelectRange = (data) => {
    setRangeId(data.id);
    setRangeName(data.value);

    if (data.id === 9) {
      setStartRange(new Date());
      setEndRange(new Date());
    }
  };

  const handleStartRange = ({ selection }) => {
    const { startDate, endDate } = selection;
    setStartRange(startDate);
    setEndRange(endDate);
  };

  return (
    <>
      <div className="row">
        {/* Sales Stat */}
        <div className="col-lg-12 col-xxl-12">
          <MixedWidget1
            handleScrollBottom={handleScrollBottom}
            className="card-stretch gutter-b"
            currentSales={currentSales}
            currentRange={currentRange}
            rangeName={rangeName}
            outletName={outletName}
            ranges={ranges}
            rangeId={rangeId}
            handleSelectRange={handleSelectRange}
            handleSelectOutlet={handleSelectOutlet}
            allOutlets={allOutlets}
            yesterdaySales={yesterdaySales}
            yesterdayTransactions={yesterdayTransactions}
            todaySales={todaySales}
            todayTransactions={todayTransactions}
            startRange={startRange}
            endRange={endRange}
            handleStartRange={handleStartRange}
            reports={reports}
          />
        </div>
      </div>
      {/* <div className="row"> */}
        {/* Sales Stat */}
        {/* <div className="col-lg-12 col-xxl-12">
          <MixedWidget3
            handleScrollBottom={handleScrollBottom}
            className="card-stretch gutter-b"
            currentSales={currentSales}
            currentRange={currentRange}
            rangeName={rangeName}
            outletName={outletName}
            ranges={ranges}
            rangeId={rangeId}
            handleSelectRange={handleSelectRange}
            handleSelectOutlet={handleSelectOutlet}
            allOutlets={allOutlets}
            yesterdaySales={yesterdaySales}
            yesterdayTransactions={yesterdayTransactions}
            todaySales={todaySales}
            todayTransactions={todayTransactions}
            startRange={startRange}
            endRange={endRange}
            handleStartRange={handleStartRange}
            reports={reports}
          />
        </div>
      </div> */}
      {/* <div className="row"> */}
        {/* Sales Stat Chart */}
        {/* <div className="col-lg-12 col-xxl-12">
          <MixedWidget2
            handleScrollBottom={handleScrollBottom}
            className="card-stretch gutter-b"
            currentSales={currentSales}
            currentRange={currentRange}
            rangeName={rangeName}
            outletName={outletName}
            ranges={ranges}
            rangeId={rangeId}
            handleSelectRange={handleSelectRange}
            handleSelectOutlet={handleSelectOutlet}
            allOutlets={allOutlets}
            yesterdaySales={yesterdaySales}
            yesterdayTransactions={yesterdayTransactions}
            todaySales={todaySales}
            todayTransactions={todayTransactions}
            startRange={startRange}
            endRange={endRange}
            handleStartRange={handleStartRange}
            reports={reports}
          />
        </div> */}
      {/* </div> */}

      <div className="row">
        <div className="col-lg-12 col-xxl-12">
          <StatsWidget11
            t={t}
            className="card-stretch gutter-b"
            realTimeTransactions={realTimeTransactions}
            realTimeRange={realTimeRange}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4">
          <ProductSale productSales={productSales} />
        </div>
        <div className="col-lg-4">
          <PaymentMethod paymentMethods={paymentMethods} />
        </div>
        <div className="col-lg-4">
          <ProductCategory productCategories={productCategories} />
        </div>
      </div>
      <Row>
        {/* <Col>
          <FinanceSummary
            totalSales={totalSales}
            totalTransactions={totalTransactions}
            totalRange={totalRange}
          />
        </Col> */}
      </Row>
    </>
  );
}
