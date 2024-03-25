import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import rupiahFormat from "rupiah-format";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import NumberFormat from 'react-number-format'

import ConfirmModal from "../../../../components/ConfirmModal";

export const DetailIncomingMaterialPage = ({ match }) => {
  const history = useHistory();

  const { materialId } = match.params;
  const { t } = useTranslation();
  const [incomingStock, setIncomingStock] = React.useState("");
  const [currency, setCurrency] = React.useState("")
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [loading, setLoading] = React.useState(false);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

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
  
  const getIncomingStock = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    // const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/incoming-stock/${id}`
      );
      // console.log("getIncomingStock", data.data)
      setIncomingStock(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatus = async () => {
    try {
      enableLoading()
      const API_URL = process.env.REACT_APP_API_URL;

      const sendStock = {
        outlet_id: incomingStock.outlet_id,
        items: incomingStock.Incoming_Stock_Products,
        status: 'done'
      }
      console.log("sendStock", sendStock)

      await axios.patch(`${API_URL}/api/v1/incoming-stock/status/${incomingStock.id}`, sendStock)
      disableLoading()
      history.push("/ingredient-inventory/incoming-stock");
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    getIncomingStock(materialId);
  }, [materialId]);

  const columns = [
    {
      name: `${t("rawMaterialName")}`,
      selector: "material_name",
      sortable: true
    },
    {
      name: `${t("quantity")}`,
      selector: "quantity",
      sortable: true
    },
    {
      name: `${t("unit")}`,
      selector: "unit",
      sortable: true
    },
    {
      name: `${t("price")}`,
      selector: "price",
      sortable: true
    },
    {
      name: `${t("priceTotal")}`,
      selector: "total_price",
      sortable: true
    }
  ];

  const dataStock = incomingStock
    ? incomingStock.Incoming_Stock_Products.map((item) => {
        return {
          material_name: item.Raw_Material.name,
          quantity: item.quantity,
          price: <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={currency} />,
          unit: item.Unit?.name || "-",
          total_price: <NumberFormat value={item.total_price} displayType={'text'} thousandSeparator={true} prefix={currency} />
        };
      })
    : [];

    const handleShowConfirm = () => {
      setShowConfirm(true)
    }
  
    const closeConfirmModal = () => setShowConfirm(false);
  
    const handleConfirm = () => {
      console.log("trigger handleConfirm")
      handleStatus()
      closeConfirmModal()
    };

  return (
    <>
      <ConfirmModal
        title={t("confirm")}
        body={t("areYouSureWantToAddIncomingStock")}
        buttonColor="warning"
        handleClick={handleConfirm}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("incomingStockDetailSummary")}</h3>
              </div>
              <div className="headerEnd">
                <Button className="btn" className={incomingStock.status === "done" ? 'btn-secondary' : 'btn-primary'} disabled={incomingStock.status === "done"} onClick={handleShowConfirm}>{t(incomingStock.status)}</Button>
                <Link
                  className="ml-2"
                  to={{
                    pathname: "/ingredient-inventory/incoming-stock"
                  }}
                >
                  <Button variant="outline-secondary">{t("back")}</Button>
                </Link>
  
                {/* <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                  Download
                </Button> */}
              </div>
            </div>
  
            <Row
              style={{ padding: "1rem", marginBottom: "1rem" }}
              className="lineBottom"
            >
              <Col sm={3}>
                <Form.Group>
                  <Form.Label>{t("stockId")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={incomingStock ? incomingStock.code : "-"}
                    disabled
                  />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>{t("location")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={incomingStock ? incomingStock.Outlet?.name : "-"}
                    disabled
                  />
                </Form.Group>
  
                <Form.Group>
                  <Form.Label>{t("date")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      incomingStock
                        ? dayjs(incomingStock.date).format("DD/MM/YYYY")
                        : "-"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
  
              <Col>
                <Form.Group>
                  <Form.Label>{t("notes")}:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={incomingStock?.notes || "-"}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
  
            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataStock}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
