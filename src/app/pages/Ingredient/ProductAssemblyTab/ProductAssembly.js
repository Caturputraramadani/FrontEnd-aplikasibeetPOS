import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, Dropdown, ListGroup } from "react-bootstrap";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";
import useDebounce from "../../../hooks/useDebounce";

import { AddProductAssembly } from "./AddProductAssembly";
import ConfirmModal from "../../../components/ConfirmModal";

const ProductAssemblyTab = ({
  allOutlets,
  allMaterials,
  allUnits,
  allCategories,
  refresh,
  handleRefresh,
  t,
  totalRecipePrice
}) => {
  const [alert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const [filter, setFilter] = React.useState({
    time: "newest"
  });

  const [allRecipes, setAllRecipes] = React.useState([]);
  const [allProductAssembly, setAllProductAssembly] = React.useState([]);

  const [currAssembly, setCurrAssembly] = React.useState({
    id: "",
    name: ""
  });

  const getRecipe = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filter = `?name=${search}`;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/recipe${filter}`);
      // console.log('ini all recipe', data.data)
      setAllRecipes(data.data);
    } catch (err) {
      setAllRecipes([]);
    }
  };

  const getProductAssembly = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filter = `?name=${search}`;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product-assembly${filter}`);
      console.log('All Product Assembly', data.data)
      setAllProductAssembly(data.data);
    } catch (error) {
      console.log("ERROR GET PRODUCT ASSEMBLY", error)
      setAllProductAssembly([])
    }
  }

  React.useEffect(() => {
    getProductAssembly(debouncedSearch)
    getRecipe(debouncedSearch);
  }, [refresh, debouncedSearch]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleSearch = (e) => setSearch(e.target.value);
  // const handleFilter = (e) => {
  //   const { name, value } = e.target;
  //   const filterData = { ...filter };
  //   filterData[name] = value;
  //   setFilter(filterData);
  // };

  const showDeleteModal = (data) => {
    setCurrAssembly({
      id: data.id,
      code: data.code
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setAlert("");
    setStateDeleteModal(false);
  };

  // console.log('ini curr recipe di recipe page', currAssembly)

  const handleDeleteAssembly = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/product-assembly/${id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      setAlert(err.response?.data.message || err.message);
      disableLoading();
    }
  };

  const columns = [
    {
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "70px"
    },
    {
      name: `${t("code")}`,
      selector: "code",
      sortable: true
    },
    {
      name: `${t("date")}`,
      selector: "date",
      sortable: true
    },
    {
      name: `${t("status")}`,
      selector: "status",
      sortable: true
    },
    {
      name: `${t("actions")}`,
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {/* <Link
                to={{
                  pathname: `/ingredient-inventory/recipe/${rows.id}`,
                  state: {
                    allOutlets,
                    allMaterials,
                    allUnits,
                    allCategories,
                    currAssembly: rows
                  }
                }}
              >
                <Dropdown.Item as="button">{t("edit")}</Dropdown.Item>
              </Link> */}
              <Link
                  to={{
                    pathname: `/ingredient-inventory/product-assembly/${rows.id}`,
                    state: {
                      allOutlets,
                      allMaterials,
                      allUnits
                    }
                  }}
                >
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
                {t("detail")}
              </Dropdown.Item>
              </Link>
              {rows.status === 'Pending' ? (
                <Link
                  to={{
                    pathname: `/ingredient-inventory/edit-product-assembly/${rows.id}`,
                    state: {
                      allOutlets,
                      allMaterials,
                      allUnits
                    }
                  }}
                >
                  <Dropdown.Item as="button">{t("edit")}</Dropdown.Item>
                </Link>
              ) : null }
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
              {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];


  const dataUnit = allProductAssembly.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      code: item.code,
      date: item.date
      ? dayjs(item.date).format("DD-MMM-YYYY")
      : "-",
      status: item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "-",
      items: item.Product_Assembly_Items.map((val) => {
        return {
          id: val.id,
          product_name: val.Product?.name,
          quantity: val.quantity,
          expired_date: val.expired_date,
          unit_name: val.Unit?.name
        };
      })
    };
  });

  console.log("dataUnit", dataUnit)
  const ExpandableComponent = ({ data }) => {
    console.log("ExpandableComponent", data)
    const stockData = data.items.map((item) => {
      return {
        id: item.id,
        product_name: item.product_name,
        quantity: item.quantity || "-",
        unit: item.unit_name || "-",
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
              <Col style={{ fontWeight: "700" }}>{t('productName')}</Col>
              <Col style={{ fontWeight: "700" }}>{t('quantity')}</Col>
              <Col style={{ fontWeight: "700" }}>{t('unit')}</Col>
              <Col style={{ fontWeight: "700" }}>{t('expiredDate')}</Col>
            </Row>
          </ListGroup.Item>
          {stockData.length ? (
            stockData.map((val, index) => {
              return (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col>{val.product_name}</Col>
                    <Col>{val.quantity}</Col>
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
      <ConfirmModal
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`${t("deleteProductAssembly")} - ${currAssembly.code}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={() => handleDeleteAssembly(currAssembly.id)}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("productAssembly")}</h3>
              </div>
              <div className="headerEnd">
                <Link to={{
                    pathname: "/ingredient-inventory/product-assembly/add",
                    state: { allOutlets, allMaterials, allUnits }
                  }}>
                  <Button variant="primary">
                    {t("addProductAssembly")}
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
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataUnit}
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

export default ProductAssemblyTab;
