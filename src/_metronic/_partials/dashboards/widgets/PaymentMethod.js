/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo, useEffect } from "react";
import objectPath from "object-path";
import ApexCharts from "apexcharts";
import { Card } from "react-bootstrap";
import { useHtmlClassService } from "../../../layout";
import { KTUtil } from "../../../_assets/js/components/util";
import { useTranslation } from "react-i18next";

export function PaymentMethod({ className, paymentMethods }) {
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
    const element = document.getElementById("payment-method");
    if (!element) {
      return;
    }

    const height = parseInt(KTUtil.css(element, "height"));
    const options = getChartOptions(layoutProps, height, paymentMethods, t);

    const chart = new ApexCharts(element, options);
    chart.render();
    return function cleanUp() {
      chart.destroy();
    };
  }, [layoutProps, paymentMethods]);

  return (
    <Card>
      <Card.Body style={{ padding: "2rem" }}>
        <h3>{t("paymentMethod")}</h3>
        <h5 style={{ fontSize: "1rem" }}>
          {t("byTheByTheMostUsedByCustomer")}
        </h5>
        <div
          id="payment-method"
          style={{ height: "200px", marginTop: "3rem" }}
        ></div>
      </Card.Body>
    </Card>
  );
}

function getChartOptions(layoutProps, height, paymentMethods, t) {
  const paymentName = Object.keys(paymentMethods);
  const paymentCount = Object.values(paymentMethods);

  // const dataName = paymentName.length ? paymentName : null;
  // const dataCount = paymentCount.length ? paymentCount : null;

  const options = {
    series: paymentCount.length ? paymentCount : [1],
    labels: paymentName.length ? paymentName : [`[${t('noSales')}]`],
    chart: {
      type: "donut"
    },
    noData: {
      text: undefined,
      style: {
        color: undefined,
        fontSize: "14px",
        fontFamily: undefined
      }
    }
  };
  return options;
}
