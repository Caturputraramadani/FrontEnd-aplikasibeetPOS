import React from "react";
import axios from "axios";
import { Row, Col, ListGroup } from "react-bootstrap";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
// import { Search } from "@material-ui/icons";
// import useDebounce from "../../hooks/useDebounce";

const StockReport = ({ selectedOutlet, startDate, endDate, endDateFilename, subscriptionPartitoin }) => {
  // const [alert, setAlert] = React.useState("");
  // const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const [inventory, setInventory] = React.useState([]);

  const getInventory = async (id, start_range, end_range) => {
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
        `${API_URL}/api/v1/product/inventory-report${outlet_id}date_start=${start_range}&date_end=${end_range}`
      );
      setInventory(data.data);
    } catch (err) {
      setInventory([]);
    }
  };

  React.useEffect(() => {
    getInventory(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

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
      name: `${t("outletName")}`,
      selector: "outlet_name",
      sortable: true
    },
    {
      name: `${t("name")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("startingStock")}`,
      selector: "stock_starting",
      sortable: true,
      omit: (subscriptionPartitoin === 3) ? false : (subscriptionPartitoin === 2) ? false : true
    },
    {
      name: `${t("currentStock")}`,
      selector: "stock",
      sortable: true
    },
    {
      name: `${t("incomingStock")}`,
      selector: "incoming_stock",
      sortable: true,
      omit: (subscriptionPartitoin === 3) ? false : (subscriptionPartitoin === 2) ? false : true
    },
    {
      name: `${t("outcomingStock")}`,
      selector: "outcoming_stock",
      sortable: true,
      omit: (subscriptionPartitoin === 3) ? false : (subscriptionPartitoin === 2) ? false : true
    },
    {
      name: `${t("adjusment")}`,
      selector: "adjusment",
      sortable: true,
      omit: (subscriptionPartitoin === 3) ? false : (subscriptionPartitoin === 2) ? false : true
    }
  ];

  const dataInventory = inventory.map((item, index) => {
    let adjusment = 0;
    let incoming_stock = 0;
    let outcoming_stock = 0;

    if (item.Product_Adjusment) {
      const difference =
        item.Product_Adjusment.stock_current -
        item.Product_Adjusment.stock_previous;
      adjusment = difference < 1 ? difference : "+" + difference;
    }

    if (item.Stocks.length) {
      for (const val of item.Stocks) {
        if (val.Incoming_Stock?.Incoming_Stock_Products.length) {
          for (const stock of val.Incoming_Stock.Incoming_Stock_Products) {
            incoming_stock += stock.quantity;
          }
        }

        if (val.Outcoming_Stock_Products.length) {
          for (const stock of val.Outcoming_Stock_Products) {
            outcoming_stock += stock.quantity;
          }
        }
      }
    }

    return {
      id: item.id,
      no: index + 1,
      outlet_name: item.Outlet?.name,
      name: item.name,
      stock: item.stock,
      stock_starting: item.stock_starting,
      incoming_stock,
      outcoming_stock,
      adjusment,
      stocks: item.Stocks
    };
  });

  const ExpandableComponent = ({ data }) => {
    const stockData = data.stocks.map((item) => {
      return {
        batch: item.Incoming_Stock
          ? item.Incoming_Stock.code
          : item.Transfer_Stock
          ? item.Transfer_Stock.code
          : "-",
        stock: item.stock || 0,
        unit: item.Unit?.name || "-",
        expired_date: item.expired_date
          ? dayjs(item.expired_date).format("DD-MMM-YYYY")
          : "-"
      };
    });

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              <Col style={{ fontWeight: "700" }}>{t("batch")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("stock")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("unit")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("expiredDate")}</Col>
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
  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-stock">
          <thead>
            <tr>
              <th>{t("goodsStockReport")}</th>
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
            {dataInventory.length > 0 ? (
              dataInventory.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.outlet_name}</td>
                    <td>{item.name}</td>
                    <td>{item.stock_starting}</td>
                    <td>{item.stock}</td>
                    <td>{item.incoming_stock}</td>
                    <td>{item.outcoming_stock}</td>
                    <td>{item.adjusment}</td>
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
        data={dataInventory}
        expandableRows
        expandableRowsComponent={ExpandableComponent}
        style={{ minHeight: "100%" }}
        noDataComponent={t('thereAreNoRecordsToDisplay')}
      />
    </>
  );
};

export default StockReport;
