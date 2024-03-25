/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import axios from 'axios'
import { Card, Row, Col, Dropdown } from "react-bootstrap";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { useHtmlClassService } from "../../../layout";
import { DropdownCustomToggler, DropdownMenu1 } from "../../dropdowns";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'
import combineAllSales from "../helpers/combineAllSales";
import sum from "../helpers/sum";
import { useTranslation } from "react-i18next";
export function FinanceSummary({
  className,
  totalSales,
  totalTransactions,
  totalRange
}) {
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

  const uiService = useHtmlClassService();
  const { t } = useTranslation();
  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray500: objectPath.get(
        uiService.config,
        "js.colors.gray.gray500"
      ),
      colorsGrayGray200: objectPath.get(
        uiService.config,
        "js.colors.gray.gray200"
      ),
      colorsGrayGray300: objectPath.get(
        uiService.config,
        "js.colors.gray.gray300"
      ),
      colorsThemeBaseSuccess: objectPath.get(
        uiService.config,
        "js.colors.theme.base.success"
      ),
      colorsThemeLightSuccess: objectPath.get(
        uiService.config,
        "js.colors.theme.light.success"
      ),
      fontFamily: objectPath.get(uiService.config, "js.fontFamily")
    };
  }, [uiService]);

  const [totalEarnings, setTotalEarnings] = React.useState(0);
  const [averagePrice, setAveragePrice] = React.useState(0);

  const handleHover = (idx) => {
    const earnings = totalSales.map((item) => { 
      return sum(combineAllSales(item));
    });
    const averages = totalSales.map((item) => {
      const qty = item.reduce((init, curr) => {
        for (const val of curr.Transaction_Items) {
          init += val.quantity;
        }
        return init;
      }, 0);
      const price = sum(combineAllSales(item));

      const avg = Math.round(price / qty) || 0;
      return avg;
    });

    setTotalEarnings(earnings[idx]);
    setAveragePrice(averages[idx]);
  };

  useEffect(() => {
    const element = document.getElementById("finance-summary");

    if (!element) {
      return;
    }

    const options = getChartOption(
      layoutProps,
      totalTransactions,
      totalRange,
      handleHover
    );
    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, totalTransactions, totalRange, totalSales]);

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col style={{ alignSelf: "center" }}>
            <h5>{t("financeSummary")}</h5>
          </Col>
          <Col style={{ textAlign: "end" }}>
            <div className="card-toolbar">
              <Dropdown className="dropdown-inline" alignRight>
                <Dropdown.Toggle
                  className="btn btn-clean btn-hover-light-primary btn-sm btn-icon"
                  variant="transparent"
                  id="dropdown-toggle-top"
                  as={DropdownCustomToggler}
                >
                  <i className="ki ki-bold-more-hor" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                  <DropdownMenu1 />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body style={{ padding: "0" }}>
        <Row style={{ padding: "2rem" }}>
          <Col>
            <h6>{t("totalEarning")}</h6>
            <h5><NumberFormat value={totalEarnings || 0} displayType={'text'} thousandSeparator={true} prefix={currency} /></h5>
          </Col>
          <Col>
            <h6>{t("averageProductPrice")}</h6>
            <h5><NumberFormat value={averagePrice || 0} displayType={'text'} thousandSeparator={true} prefix={currency} /></h5>
          </Col>
        </Row>

        <div
          id="finance-summary"
          className="card-rounded-bottom"
          style={{ height: "150px" }}
        ></div>
      </Card.Body>
    </Card>
  );
}

function getChartOption(
  layoutProps,
  totalTransactions,
  totalRange,
  handleHover
) {
  const options = {
    series: [
      {
        name: "Transactions",
        data: totalTransactions
      }
    ],
    chart: {
      type: "area",
      height: 150,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {},
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: "solid",
      opacity: 1
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [layoutProps.colorsThemeBaseSuccess]
    },
    xaxis: {
      categories: totalRange,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: layoutProps.colorsGrayGray300,
          width: 1,
          dashArray: 3
        }
      }
    },
    yaxis: {
      labels: {
        show: false,
        style: {
          colors: layoutProps.colorsGrayGray500,
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      }
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0
        }
      },
      hover: {
        filter: {
          type: "none",
          value: 0
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0
        }
      }
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: layoutProps.fontFamily
      },
      y: {
        formatter: function(val, opts) {
          handleHover(opts.dataPointIndex);
          return val;
        }
      }
    },
    colors: [layoutProps.colorsThemeLightSuccess],
    markers: {
      colors: [layoutProps.colorsThemeLightSuccess],
      strokeColor: [layoutProps.colorsThemeBaseSuccess],
      strokeWidth: 3
    }
  };
  return options;
}
