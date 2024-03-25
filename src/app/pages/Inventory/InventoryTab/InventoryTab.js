import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, ListGroup } from "react-bootstrap";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";

import { Search } from "@material-ui/icons";
import useDebounce from "../../../hooks/useDebounce";
import { Delete } from "@material-ui/icons";
import ConfirmModal from "../../../components/ConfirmModal";

const InventoryTab = ({ refresh, t, handleRefresh }) => {
  // const [alert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const [multiSelect, setMultiSelect] = React.useState(false);
  const [clearRows, setClearRows] = React.useState(true);
  const [selectedData, setSelectedData] = React.useState([]);
  const [showConfirmBulk, setShowConfirmBulk] = React.useState(false);

  const [filter, setFilter] = React.useState({
    time: "newest"
  });

  const [inventory, setInventory] = React.useState([]);

  const getInventory = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterInventory = `?name=${search}&order=${filter.time}`;
    console.log("filterInventory", filterInventory)
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product${filterInventory}`);
      setInventory(data.data);
    } catch (err) {
      setInventory([]);
    }
  };

  React.useEffect(() => {
    getInventory(debouncedSearch);
  }, [filter, refresh, debouncedSearch]);

  const handleMode = () => {
    setSelectedData([]);
    setMultiSelect((state) => !state);
    setClearRows((state) => !state);
  };

  const handleSelected = (state) => {
    setSelectedData(state.selectedRows);
  };

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    console.log("filterData", filterData)
    setFilter(filterData);
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

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
      sortable: true,
      wrap: true
    },
    {
      name: `${t("name")}`,
      selector: "name",
      sortable: true,
      wrap: true
    },
    {
      name: `${t("supplier")}`,
      selector: "supplier",
      sortable: true,
      wrap: true
    },
    {
      name: `${t("startingStock")}`,
      selector: "stock_starting",
      sortable: true
    },
    {
      name: `${t("currentStock")}`,
      selector: "stock",
      sortable: true
    },
    {
      name: `${t("incomingStock")}`,
      selector: "incoming_stock",
      sortable: true
    },
    {
      name: `${t("outcomingStock")}`,
      selector: "outcoming_stock",
      sortable: true
    },
    {
      name: `${t("adjusment")}`,
      selector: "adjusment",
      sortable: true
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
      supplier: item.supplier ? item.supplier : "-",
      // stock: item.stock,
      stock: item.stock < 0 ? 0 : item.stock,
      stock_starting: item.stock_starting,
      incoming_stock,
      outcoming_stock,
      adjusment,
      stocks: item.Stocks,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };
  });

  const ExpandableComponent = ({ data }) => {
    const stockData = data.stocks.map((item) => {
      return {
        id: item.id,
        batch: item.Incoming_Stock
          ? item.Incoming_Stock.code
          : item.Transfer_Stock
          ? item.Transfer_Stock.code
          : item.Product_Assembly
          ? item.Product_Assembly.code
          : "-",
        stock: item.stock || 0,
        unit: item.Unit?.name || "-",
        expired_date: item.expired_date
          ? dayjs(item.expired_date).format("DD-MMM-YYYY")
          : "-"
      };
    });
    stockData.sort((a,b)=>a.id-b.id);
    console.log("stockData", stockData)

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              <Col style={{ fontWeight: "700" }}>{t('batch')}</Col>
              <Col style={{ fontWeight: "700" }}>{t('stock')}</Col>
              <Col style={{ fontWeight: "700" }}>{t('unit')}</Col>
              {/* <Col style={{ fontWeight: "700" }}>{t('expiredDate')}</Col> */}
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

  const showConfirmBulkModal = (data) => {
    if (!data.length) {
      return handleMode();
    }
    setShowConfirmBulk(true);
  };
  
  const closeConfirmBulkModal = () => {
    handleMode();
    setShowConfirmBulk(false);
  };

  const handleBulkDelete = async (data) => {
    if (!data.length) {
      return handleMode();
    }
    const API_URL = process.env.REACT_APP_API_URL;
    const product_id = data.map((item) => item.id);

    console.log("handleBulkDelete", data)

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/product/bulk-delete`, {
        data: { product_id }
      });
      disableLoading();
      handleRefresh();
      closeConfirmBulkModal();
    } catch (err) {
      console.log(err);
    }
  };

  const paginationComponentOptions = {
    rowsPerPageText: t('rowsPerPage'),
    rangeSeparatorText: t('of'),
    selectAllRowsItem: true,
    selectAllRowsItemText: t('showAll'),
  };

  return (
    <>
      <ConfirmModal
        title={`${t('delete')} ${selectedData.length} Selected Products`}
        body={t('areYouSureWantToDelete?')}
        buttonColor="danger"
        handleClick={() => handleBulkDelete(selectedData)}
        state={showConfirmBulk}
        closeModal={closeConfirmBulkModal}
        loading={loading}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                {!selectedData.length ? (
                  <h3>{t("inventoryManagement")}</h3>
                ) : (
                  <h3>{selectedData.length} {t("itemSelected")}</h3>
                )}
              </div>
              <div className="headerEnd">
              {!multiSelect ? (
                <>
                  <Link to={{ pathname: "/inventory/incoming-stock" }}>
                    <Button variant="primary">{t("incomingStock")}</Button>
                  </Link>

                  <Link to={{ pathname: "/inventory/outcoming-stock" }}>
                    <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                      {t("outcomingStock")}
                    </Button>
                  </Link>

                  <Link to={{ pathname: "/inventory/transfer-stock" }}>
                    <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                      {t("transferStock")}
                    </Button>
                  </Link>

                  <Link to={{ pathname: "/inventory/stock-opname" }}>
                    <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                      {t("stockOpname")}
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  variant="danger"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => showConfirmBulkModal(selectedData)}
                >
                  {t("delete")}
                </Button>
              )}
              {inventory.length ? (
                <Button
                  variant={!multiSelect ? "danger" : "secondary"}
                  style={{ marginLeft: "0.5rem" }}
                  onClick={handleMode}
                >
                  {!multiSelect ? <Delete /> : `${t("cancel")}`}
                </Button>
              ) : (
                ""
              )}
              </div>
            </div>

            <div className="filterSection lineBottom">
              <Row>
                <Col>
                  <InputGroup className="pb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text style={{ background: "transparent" }}>
                        <Search />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      placeholder={t("search")}
                      value={search}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </Col>

                <Col>
                  <Form.Group as={Row}>
                    <Form.Label
                      style={{ alignSelf: "center", marginBottom: "0" }}
                    >
                      {t("time")}:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="time"
                        value={filter.time}
                        onChange={handleFilter}
                      >
                        <option value="newest">{t("newest")}</option>
                        <option value="oldest">{t("oldest")}</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              paginationComponentOptions={paginationComponentOptions}
              columns={columns}
              data={dataInventory}
              expandableRows
              expandableRowsComponent={ExpandableComponent}
              style={{ minHeight: "100%" }}
              selectableRows={multiSelect}
              onSelectedRowsChange={handleSelected}
              clearSelectedRows={clearRows}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default InventoryTab;
