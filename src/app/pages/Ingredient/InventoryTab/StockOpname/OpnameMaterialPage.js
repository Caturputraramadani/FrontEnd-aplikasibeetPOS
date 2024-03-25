import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";
import useDebounce from "../../../../hooks/useDebounce";
import { useTranslation } from "react-i18next";

import ConfirmModal from "../../../../components/ConfirmModal";

export const OpnameMaterialPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [refresh, setRefresh] = React.useState(0);
  const [alert, setAlert] = React.useState(0);

  const debouncedSearch = useDebounce(search, 1000);

  // const [filter, setFilter] = React.useState({
  //   time: "newest"
  // });

  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const { t } = useTranslation();

  const [currStock, setCurrStock] = React.useState({
    id: "",
    code: ""
  });
  const [stockOpname, setStockOpname] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allMaterials, setAllMaterials] = React.useState([]);
  const [allUnits, setAllUnits] = React.useState([]);

  const getStockOpname = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterStock = `?code=${search}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/stock-opname${filterStock}`
      );
      const dataOutput = data.data
        .map((item) => {
          const rawMaterial = item.Stock_Opname_Products.filter(
            (val) => val.Stock?.raw_material_id
          );
          if (rawMaterial.length) {
            return item;
          } else {
            return "";
          }
        })
        .filter((item) => item);

      setStockOpname(dataOutput);
    } catch (err) {
      setStockOpname([]);
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

  const getMaterials = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/raw-material`);
      setAllMaterials(data.data);
    } catch (err) {
      setAllMaterials([]);
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
    getStockOpname(debouncedSearch);
  }, [refresh, debouncedSearch]);

  React.useEffect(() => {
    getOutlets();
    getMaterials();
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
      await axios.delete(`${API_URL}/api/v1/stock-opname/${id}`);
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
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "70px"
    },
    {
      name: t('stockOpnameId'),
      selector: "code",
      sortable: true
    },
    {
      name: t('location'),
      selector: "outlet_name",
      sortable: true
    },
    {
      name: t('date'),
      selector: "date",
      sortable: true
    },
    {
      name: t('actions'),
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Link
                to={{
                  pathname: `/ingredient-inventory/stock-opname/${rows.id}`,
                  state: {
                    allOutlets,
                    allMaterials,
                    allUnits
                  }
                }}
              >
                <Dropdown.Item as="button">{t('detail')}</Dropdown.Item>
              </Link>
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
                {t('delete')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataStock = stockOpname.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      outlet_name: item.Outlet?.name,
      code: item.code,
      date: dayjs(item.date).format("DD/MM/YYYY")
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
                <h3>{t('stockOpname')}</h3>
              </div>
              <div className="headerEnd">
                <Link
                  to={{
                    pathname: "/ingredient-inventory"
                  }}
                >
                  <Button variant="outline-secondary">{t('backToMainView')}</Button>
                </Link>

                <Link
                  to={{
                    pathname: "/ingredient-inventory/stock-opname/add",
                    state: { allOutlets, allMaterials, allUnits }
                  }}
                >
                  <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                   {t('addNewStockOpname')}
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
                      placeholder="Search..."
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
