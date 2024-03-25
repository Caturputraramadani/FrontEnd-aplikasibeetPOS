/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { Card } from "react-bootstrap";
import { useHtmlClassService } from "../../../layout";
import { KTUtil } from "../../../_assets/js/components/util";
import { useTranslation } from "react-i18next";
export function ProductSale({ className, productSales }) {
  const uiService = useHtmlClassService();
  const { t } = useTranslation();
  const layoutProps = useMemo(() => {
    return {
      colorsGrayGray100: objectPath.get(
        uiService.config,
        "js.colors.gray.gray100"
      ),
      colorsGrayGray700: objectPath.get(
        uiService.config,
        "js.colors.gray.gray700"
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
    const element = document.getElementById("product-sales");
    if (!element) {
      return;
    }

    const height = parseInt(KTUtil.css(element, "height"));
    const options = getChartOptions(layoutProps, height, productSales);

    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, productSales]);

  return (
    <Card className="card-stretch gutter-b">
      <Card.Body style={{ padding: "2rem" }}>
        <h3>{t("productSales")}</h3>
        <h5 style={{ fontSize: "1rem" }}>
          {t("checkOutEachColumnForMoreDetails")}
        </h5>
        <div
          id="product-sales"
          style={{ height: "200px", marginTop: "3rem" }}
        ></div>
      </Card.Body>
    </Card>
  );
}

function getChartOptions(layoutProps, height, productSales) {
  const productName = Object.keys(productSales);
  const productQty = Object.values(productSales);

  const options = {
    series: [
      {
        name: "Quantity",
        type: "column",
        data: productQty
      }
    ],
    xaxis: {
      categories: productName
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return Math.round(val);
        }
      }
    },
    tooltip: {
      x: {
        show: false
      }
    },
    chart: {
      height,
      type: "line",
      stacked: false,
      toolbar: false
    },
    stroke: {
      width: [0, 2, 5],
      curve: "smooth"
    }
    // plotOptions: {
    //   bar: {
    //     columnWidth: "20%"
    //   }
    // }
  };
  return options;
}
