/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import dayjs from "dayjs";
import rupiahFormat from "rupiah-format";
import { useTranslation } from "react-i18next";
import { useHtmlClassService } from "../../../layout";

import "./style.css";

export function StatsWidget11({
  className,
  realTimeTransactions,
  realTimeRange
}) {
  const { t } = useTranslation();
  const uiService = useHtmlClassService();
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

  useEffect(() => {
    const element = document.getElementById("kt_stats_widget_7_chart");

    if (!element) {
      return;
    }

    const options = getChartOption(
      layoutProps,
      realTimeTransactions,
      realTimeRange,
      t
    );
    const chart = new ApexCharts(element, options);
    chart.render();

    let min;
    for (const item of realTimeRange) {
      if (realTimeTransactions[item]?.transactions) {
        const index = realTimeRange.findIndex((val) => val === item);
        min = index - 1;
        break;
      }
    }

    const now = dayjs().hour();
    const index = realTimeRange.findIndex((val) => parseInt(val) === now);
    const max = index + 3;

    if (min && max) {
      chart.zoomX(min, max);
    }

    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, realTimeTransactions, realTimeRange]);

  return (
    <div className={`card card-custom ${className}`}>
      <div className="card-body d-flex flex-column p-0">
        <div className="d-flex align-items-center justify-content-between card-spacer flex-grow-1">
          <div className="d-flex flex-column mr-2">
            <a
              href="#"
              className="text-dark-75 text-hover-primary font-weight-bolder font-size-h5"
            >
              {t("realtimeSales")}
            </a>
            {/* <span className="text-muted font-weight-bold mt-2">
              Your Daily Sales Chart
            </span> */}
          </div>
        </div>
        <div
          id="kt_stats_widget_7_chart"
          className="card-rounded-bottom"
          style={{ height: "150px" }}
        ></div>
      </div>
    </div>
  );
}

function getChartOption(layoutProps, realTimeTransactions, realTimeRange, t) {
  const dataSalesTransactions = realTimeRange.map(
    (item) => realTimeTransactions[item]?.salesTransactions || 0
  );

  const dataTransactions = realTimeRange.map(
    (item) => realTimeTransactions[item]?.transactions || 0
  );
  const dataVoids = realTimeRange.map(
    (item) => realTimeTransactions[item]?.voids || 0
  );
  const dataVoidsNominal = realTimeRange.map(
    (item) => realTimeTransactions[item]?.voidsNominal || 0
  );

  const options = {
    series: [
      {
        name: "Transactions",
        data: dataTransactions
      }
      // {
      //   name: "Void Transactions",
      //   data: dataVoids
      // }
    ],
    chart: {
      type: "area",
      height: 300,
      zoom: {
        enabled: true
      },
      toolbar: false
    },
    plotOptions: {},
    legend: {
      show: true
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
      colors: [layoutProps.colorsThemeBaseSuccess, "black"]
    },
    xaxis: {
      categories: realTimeRange,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        formatter: function(val) {
          if (val) {
            let output;
            const time = val.split(".");

            if (time.length < 2 && parseInt(time[0]) < 10) {
              output = `0${time[0]}:00`;
            } else if (time.length < 2 && parseInt(time[0]) > 9) {
              output = `${time[0]}:00`;
            } else if (time.length > 1 && parseInt(time[0]) < 10) {
              output = `0${val.replace(".", ":")}`;
            } else {
              output = val.replace(".", ":");
            }

            return output;
          } else {
            return;
          }
        },
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
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
          fontFamily: layoutProps.fontFamily
        }
      }
    },
    yaxis: [
      {
        seriesName: "Transactions",
        labels: {
          formatter: function(val) {
            return Math.round(val);
          },
          style: {
            colors: layoutProps.colorsThemeBaseSuccess,
            fontSize: "12px",
            fontFamily: layoutProps.fontFamily
          }
        },
        title: {
          text: "Transactions",
          style: {
            color: layoutProps.colorsThemeBaseSuccess
          }
        }
      }
      // {
      //   opposite: true,
      //   seriesName: "Void Transactions",
      //   labels: {
      //     formatter: function(val) {
      //       return Math.round(val);
      //     },
      //     style: {
      //       colors: "black",
      //       fontSize: "12px",
      //       fontFamily: layoutProps.fontFamily
      //     }
      //   },
      //   title: {
      //     text: "Void Transactions"
      //   }
      // }
    ],
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
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        return `
          <div class="tooltip-chart">
            <span><b>${t('transactions')}:</b> ${
              dataTransactions[dataPointIndex]
            }</span><br />
            <span><b>${t('salesTransactions')}:</b> ${rupiahFormat.convert(
              dataSalesTransactions[dataPointIndex]
            )}</span><br />
            <span><b>${t('voids')}:</b> ${dataVoids[dataPointIndex]}</span><br />
            <span><b>${t('voidsNominal')}:</b> ${rupiahFormat.convert(
              dataVoidsNominal[dataPointIndex]
            )}</span>
          </div>
        `;
      }
    },
    colors: [layoutProps.colorsThemeLightSuccess, "black"],
    markers: {
      colors: [layoutProps.colorsThemeLightSuccess],
      strokeColor: [layoutProps.colorsThemeBaseSuccess],
      strokeWidth: 3
    }
  };
  return options;
}
