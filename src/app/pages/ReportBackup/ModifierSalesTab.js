import React from "react";
import axios from "axios";
import NumberFormat from 'react-number-format'
import { Row, Col, Table, Dropdown, DropdownButton } from "react-bootstrap";

import { Paper } from "@material-ui/core";

import "../style.css";

import rupiahFormat from "rupiah-format";

export const ModifierSalesTab = ({ allOutlets }) => {
  const [loading, setLoading] = React.useState(false);

  const [allModifierSales, setAllModifierSales] = React.useState([]);
  const [outletId, setOutletId] = React.useState("");
  const [outletName, setOutletName] = React.useState("All Outlets");

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);
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
  
  const getModifierSales = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    if (id) {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/transaction/modifier-sales?outlet_id=${id}`
        );
        setAllModifierSales(data.data);
      } catch (err) {
        if (err.response.status === 404) {
          setAllModifierSales([]);
        }
        console.log(err);
      }
    } else {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/transaction/modifier-sales`
        );
        setAllModifierSales(data.data);
      } catch (err) {
        if (err.response.status === 404) {
          setAllModifierSales([]);
        }
        console.log(err);
      }
    }
  };

  React.useEffect(() => {
    getModifierSales(outletId);
  }, [outletId]);

  const handleSelectOutlet = (data) => {
    if (data) {
      setOutletId(data.id);
      setOutletName(data.name);
    } else {
      setOutletId("");
      setOutletName("All Outlets");
    }
  };

  const modifierSalesData = () => {
    const data = [];

    allModifierSales.forEach((item) => {
      const allTransactionItems = item.Transaction_Items;
      let totalCollected = 0;
      let sold = 0;
      let refunded = 0;

      if (allTransactionItems.length) {
        allTransactionItems.forEach((val) => {
          val.forEach((curr) => {
            totalCollected += curr.subtotal;

            if (curr.Transaction.Transaction_Refund) {
              refunded += curr.quantity;
            } else {
              sold += curr.quantity;
            }
          });

          data.push({
            modifier: item.name,
            sold,
            refunded,
            total: totalCollected
          });
        });
      } else {
        data.push({
          modifier: item.name,
          sold: 0,
          refunded: 0,
          total: 0
        });
      }
    });

    const totalSold = data.reduce((init, curr) => (init += curr.sold), 0);
    const totalRefunded = data.reduce(
      (init, curr) => (init += curr.refunded),
      0
    );
    const totalAmount = data.reduce((init, curr) => (init += curr.total), 0);

    data.push({
      modifier: "",
      sold: totalSold,
      refunded: totalRefunded,
      total: totalAmount
    });

    return data;
  };

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div
            className="headerPage lineBottom"
            style={{ marginBottom: "1rem" }}
          >
            <div className="headerStart">
              <h3 style={{ margin: "0" }}>Modifier Sales</h3>
            </div>
            <div className="headerEnd">
              <Row>
                <DropdownButton title={outletName}>
                  <Dropdown.Item onClick={() => handleSelectOutlet()}>
                    {t('allOutlets')}
                  </Dropdown.Item>
                  {allOutlets.map((item, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        onClick={() => handleSelectOutlet(item)}
                      >
                        {item.name}
                      </Dropdown.Item>
                    );
                  })}
                </DropdownButton>

                <DropdownButton title="Exports" style={{ margin: "0 1rem" }}>
                  <Dropdown.Item href="#/action-1">PDF</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Excel</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">CSV</Dropdown.Item>
                </DropdownButton>
              </Row>
            </div>
          </div>

          <Table striped>
            <thead>
              <tr>
                <th></th>
                <th>Modifier</th>
                <th>Items Sold</th>
                <th>Items Refunded</th>
                <th>Total Collected</th>
              </tr>
            </thead>
            <tbody>
              {modifierSalesData().map((item, index) => {
                return (
                  <tr key={index}>
                    <td></td>
                    <td>{item.modifier}</td>
                    <td>{item.sold}</td>
                    <td>{item.refunded}</td>
                    <td>{<NumberFormat value={item.total} displayType={'text'} thousandSeparator={true} prefix={currency} />}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Paper>
      </Col>
    </Row>
  );
};
