import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";
import useDebounce from "../../../../hooks/useDebounce";

import ConfirmModal from "../../../../components/ConfirmModal";

export const OutcomingStockPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [refresh, setRefresh] = React.useState(0);
  const [alert, setAlert] = React.useState(0);

  const debouncedSearch = useDebounce(search, 1000);

  // const [filter, setFilter] = React.useState({
  //   time: "newest"
  // });
  const { t } = useTranslation();

  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [currStock, setCurrStock] = React.useState({
    id: "",
    code: ""
  });
  const [outcomingStock, setOutcomingStock] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allProducts, setAllProducts] = React.useState([]);
  const [allUnits, setAllUnits] = React.useState([]);

  const getOutcomingStock = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterStock = `?code=${search}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/outcoming-stock${filterStock}`
      );
      const dataOutput = data.data
        .map((item) => {
          const products = item.Outcoming_Stock_Products.filter(
            (val) => val.Stock?.product_id
          );
          if (products.length) {
            return item;
          } else {
            return "";
          }
        })
        .filter((item) => item);

      setOutcomingStock(dataOutput);
    } catch (err) {
      setOutcomingStock([]);
    }
  };

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getProducts = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product`);
      setAllProducts(data.data);
    } catch (err) {
      setAllProducts([]);
    }
  };

  const getUnits = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/unit`);
      setAllUnits(data.data);
    } catch (err) {
      setAllUnits([]);
    }
  };

  React.useEffect(() => {
    getOutcomingStock(debouncedSearch);
  }, [refresh, debouncedSearch]);

  React.useEffect(() => {
    getOutlets();
    getProducts();
    getUnits();
  }, []);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleRefresh = () => setRefresh((state) => state + 1);

  const handleSearch = (e) => setSearch(e.target.value);
  // const handleFilter = (e) => {
  //   const { name, value } = e.target;
  //   const filterData = { ...filter };
  //   filterData[name] = value;
  //   setFilter(filterData);
  // };

  const handleDeleteStock = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    setAlert("");

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/outcoming-stock/${id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      setAlert(err.response?.data.message || err.message);
      disableLoading();
    }
  };

  const showDeleteModal = (data) => {
    setCurrStock({
      id: data.id,
      code: data.code
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => setStateDeleteModal(false);

  const columns = [
    {
      name: t('no'),
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: t('outcomingStockId'),
      selector: "code",
      sortable: true
    },
    {
      name: t('location'),
      selector: "outlet_name",
      sortable: true,
      wrap: true
    },
    {
      name: t('date'),
      selector: "date",
      sortable: true
    },
    {
      name: t('status'),
      selector: "status",
      sortable: true
    },
    {
      name: "Actions",
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Link
                to={{
                  pathname: `/inventory/outcoming-stock/${rows.id}`,
                  state: {
                    allOutlets,
                    allProducts
                  }
                }}
              >
                <Dropdown.Item as="button">{t("detail")}</Dropdown.Item>
              </Link>
              {rows.status === 'Pending' ? (
                <>
                  <Link
                    to={{
                      pathname: `/inventory/edit-outcoming-stock/${rows.id}`,
                      state: {
                        allOutlets,
                        allUnits
                      }
                    }}
                  >
                    <Dropdown.Item as="button">{t("edit")}</Dropdown.Item>
                  </Link>
                  <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
                    {t("delete")}
                  </Dropdown.Item>
                </>
              ) : null }
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataStock = outcomingStock.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      outlet_name: item.Outlet?.name,
      code: item.code,
      date: dayjs(item.date).format("DD/MM/YYYY"),
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "-"
    };
  });

  return (
    <>
      <ConfirmModal
        title={`${t('deleteStock')} - ${currStock.code}`}
        body={t('areYouSureWantToDelete?')}
        buttonColor="danger"
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        handleClick={() => handleDeleteStock(currStock.id)}
        loading={loading}
        alert={alert}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("outcomingStock")}</h3>
              </div>
              <div className="headerEnd">
                <Link
                  to={{
                    pathname: "/inventory"
                  }}
                >
                  <Button variant="outline-secondary">{t("backToMainMenu")}</Button>
                </Link>

                <Link
                  to={{
                    pathname: "/inventory/outcoming-stock/add",
                    state: { allOutlets, allProducts, allUnits }
                  }}
                >
                  <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                    {t("addNewOutcomingStock")}
                  </Button>
                </Link>
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

                {/* <Col>
                  <Form.Group as={Row}>
                    <Form.Label
                      style={{ alignSelf: "center", marginBottom: "0" }}
                    >
                      Time:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="time"
                        value={filter.time}
                        onChange={handleFilter}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col> */}
              </Row>
            </div>

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
