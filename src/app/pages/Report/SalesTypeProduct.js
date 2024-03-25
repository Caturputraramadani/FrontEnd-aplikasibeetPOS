import React from "react";
import axios from "axios";
import { Row, Col, ListGroup } from "react-bootstrap";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
// import { Search } from "@material-ui/icons";
// import useDebounce from "../../hooks/useDebounce";
import {
  Paper
} from "@material-ui/core";
import { FeatureReport } from './components/FeatureReport'

const SalesTypeProduct = () => {
  const [mdr, setMdr] = React.useState("")
  const [refresh, setRefresh] = React.useState(0)
  const handleRefresh = () => setRefresh((state) => state + 1)

  const [selectedOutlet, setSelectedOutlet] = React.useState({
    id: "",
    name: "All Outlet"
  })
  const [startDate, setStartDate] = React.useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(dayjs().format("YYYY-MM-DD"));
  const [endDateFilename, setEndDateFilename] = React.useState("");
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());
  const [tabData, setTabData] = React.useState({
    no: 15,
    table: "table-stock",
    filename: `laporan-stock-barang_${startDate}-${endDateFilename}`,
  })
  const [status, setStatus] = React.useState("");
  const [subscriptionPartitoin, setSubscriptionPartitoin] = React.useState(null)

  // const [alert, setAlert] = React.useState("");
  // const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const [salesTypeProduct, setSalesTypeProduct] = React.useState([]);

  const getSalesTypeProduct = async (id, start_range, end_range) => {
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
        `${API_URL}/api/v1/sales-type/report${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setSalesTypeProduct(data.data);
    } catch (err) {
      setSalesTypeProduct([]);
    }
  };

  const handleSubscriptionPartition = async () => {
    try {
      const tempTabData = tabData
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`
      );
      setSubscriptionPartitoin(data.data[0].subscription_partition_id)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    handleSubscriptionPartition()
  }, []);

  React.useEffect(() => {
    getSalesTypeProduct(selectedOutlet.id, startDate, endDate);
    setTabData({
      ...tabData,
      filename: `laporan-stock-barang_${startDate}-${endDateFilename}`
    })
  }, [selectedOutlet, startDate, endDate, endDateFilename, mdr]);

  const kolom = [
    "No",
    "Nama Outlet",
    "Nama Barang",
    "Stok Awal",
    "Stok Tersedia",
    "Stok Masuk",
    "Stok Keluar",
    "Adjusment"
  ];
  const columns = [
    {
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "70px"
    },
    {
      name: `${t("nameSalesTypeProduct")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("totalProduct")}`,
      selector: "total_product",
      sortable: true
    }
  ];

  const dataSalesTypeProduct = salesTypeProduct.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      name: item.name,
      total_product: 10
    };
  });

  const ExpandableComponent = ({ data }) => {
    const stockData = data.stocks.map((item) => {
      return {
        product_name: item.Incoming_Stock
          ? item.Incoming_Stock.code
          : item.Transfer_Stock
          ? item.Transfer_Stock.code
          : "-",
        outlet_name: item.stock || 0,
        sales_type_product_price: item.Unit?.name || "-"
      };
    });

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              <Col style={{ fontWeight: "700" }}>{t("productName")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("outletName")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("salesTypeProductPrice")}</Col>
            </Row>
          </ListGroup.Item>
          {stockData.length ? (
            stockData.map((val, index) => {
              return (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col>{val.batch}</Col>
                    <Col>{val.stock}</Col>
                    <Col>{val.unit}</Col>
                    <Col>{val.expired_date}</Col>
                  </Row>
                </ListGroup.Item>
              );
            })
          ) : (
            <ListGroup.Item>
              <Row>
                <Col>-</Col>
                <Col>-</Col>
                <Col>-</Col>
              </Row>
            </ListGroup.Item>
          )}
        </ListGroup>
      </>
    );
  };

  const handleStartDate = (date) => setStartDate(date)
  const handleEndDate = (date) => setEndDate(date)
  const handleEndDateFilename = (date) => setEndDateFilename(date)
  const handleSelectedOutlet = (outlet) => setSelectedOutlet(outlet)
  const handleSelectStatus = (status) => setStatus(status.target.value)
  const handleTimeStart = (time) => setStartTime(time)
  const handleTimeEnd = (time) => setEndTime(time)
  const handleMdr = (params) => setMdr(params)

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <FeatureReport
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              tabData={tabData}
              handleMdr={handleMdr}
              handleEndDateFilename={handleEndDateFilename}
              handleSelectedOutlet={handleSelectedOutlet}
              titleReport="reportStock"
              handleSelectStatus={handleSelectStatus}
              handleTimeStart={handleTimeStart}
              handleTimeEnd={handleTimeEnd}
              stateShowMdr={true}
            />

            <div style={{ display: "none" }}>
              <table id="table-stock">
                <thead>
                  <tr>
                    <th>{t("salesTypeProduct")}</th>
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
                    {kolom.map((i) => (
                      <th>{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataSalesTypeProduct.length > 0 ? (
                    dataSalesTypeProduct.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.total_product}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td>{t("dataNotFound")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataSalesTypeProduct}
              expandableRows
              expandableRowsComponent={ExpandableComponent}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default SalesTypeProduct;
