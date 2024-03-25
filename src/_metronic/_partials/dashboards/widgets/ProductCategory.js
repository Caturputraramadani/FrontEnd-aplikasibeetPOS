/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { Card } from "react-bootstrap";
import { useHtmlClassService } from "../../../layout";
import { KTUtil } from "../../../_assets/js/components/util";
import { useTranslation } from "react-i18next";
export function ProductCategory({ className, productCategories }) {
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
    const element = document.getElementById("product-category");
    if (!element) {
      return;
    }

    const height = parseInt(KTUtil.css(element, "height"));
    const options = getChartOptions(layoutProps, height, productCategories, t);

    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, productCategories]);

  return (
    <Card className="card-stretch gutter-b">
      <Card.Body style={{ padding: "2rem" }}>
        <h3>{t("productCategory")}</h3>
        <h5 style={{ fontSize: "1rem" }}>{t("byQuantitySoldItems")}</h5>
        <div
          id="product-category"
          style={{ height: "200px", marginTop: "3rem" }}
        ></div>
      </Card.Body>
    </Card>
  );
}

function getChartOptions(layoutProps, height, productCategories, t) {
  const categoryName = Object.keys(productCategories);
  const categoryQty = Object.values(productCategories);

  const options = {
    series: categoryQty.length ? categoryQty : [1],
    labels: categoryName.length ? categoryName : [`[${t('noSales')}]`],
    chart: {
      type: "donut"
    }
  };
  return options;
}
