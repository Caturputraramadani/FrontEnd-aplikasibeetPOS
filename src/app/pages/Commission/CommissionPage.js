import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NumberFormat from 'react-number-format'
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../components/ConfirmModal";
import useDebounce from "../../hooks/useDebounce";

import {
  Row,
  Col,
  Form,
  Dropdown,
  InputGroup,
  ListGroup
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import {
  Paper
} from "@material-ui/core";
import { Search, MoreHoriz, Delete } from "@material-ui/icons";

const CommissionPage = () => {
  const { t } = useTranslation();
  const API_URL = process.env.REACT_APP_API_URL;
  const [allOutlets, setAllOutlets] = React.useState([])
  const [allProducts, setAllProducts] = React.useState([])
  const [allStaff, setAllStaff] = React.useState([])
  const [currency, setCurrency] = React.useState("")
  const [allCommission, setAllCommission] = React.useState([])
  const [staffName, setStaffName] = React.useState([])
  const [commission, setCommission] = React.useState({
    id: "",
    name: ""
  })
  const [filter, setFilter] = React.useState({
    status: "",
    outlet: ""
  });
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)
    setCurrency(data.data.Currency.name)
  }

  React.useEffect(() => {
    handleCurrency()
  }, [])

  // console.log("filter opo iki bro?", filter)

  const showConfirmModal = (data) => {
    setCommission({ id: data.id, name: data.groupName });
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleRefresh = () => {
    setRefresh((state) => state + 1);
  };

  const handleDelete = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/commission/${commission.id}`);
      handleRefresh();
      disableLoading();
      closeConfirmModal();
    } catch (err) {
      console.log(err);
    }
  };

  const getOutlets = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/outlet`)
      // console.log("all outlet", data.data)
      setAllOutlets(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getStaff = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/staff`)
      // console.log("all staff", data.data)
      setAllStaff(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getProducts = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/product`)
      setAllProducts(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const debouncedSearch = useDebounce(search, 1000);

  const getCommission = async (search, filter) => {
    try {
      const filterCommission = `?name=${search}&status=${filter.status}&outlet_id=${filter.outlet}`;

      const {data} = await axios.get(`${API_URL}/api/v1/commission/${filterCommission}`)
      setAllCommission(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    getCommission(debouncedSearch, filter)
  }, [refresh, debouncedSearch, filter])
  
  const dataCommission = allCommission.map(value => {
    // console.log("value allcommission", value)
    return {
      id: value.id,
      groupName: value.name,
      commission: value.type_total === "Percentage" ? `${value.total}%` : <NumberFormat value={value.total} displayType={'text'} thousandSeparator={true} prefix={currency} />,
      commission_ori: value.total,
      type: value.commission_type,
      status: value.status,
      product_id: value.product_id,
      staff_id: value.staff_id,
      staff: value.staff_name,
      product: value.product_name,
      nominal: value.nominal,
      outlet_id: value.outlet_id,
      type_total: value.type_total,
      commission_type: value.commission_type
    }
  })

  const ExpandableComponent = ({ data }) => {
    // console.log("data expand", data)
    const keys = [
      {
        key: "Staff",
        value: "staff"
      }
    ]
    if(data.commission_type === "product" ){
      keys.push({
        key: "Product",
        value: "product"
      })
    } else {
      keys.push({
        key: "Nominal",
        value: "nominal"
      })
    }
    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          {keys.map((val, index) => {
            return (
              <ListGroup.Item key={index}>
                <Row>
                  <Col md={3} style={{ fontWeight: "700" }}>
                    {val.key}
                  </Col>
                  <Col>{data[val.value] || "-"}</Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </>
    );
  };

  // console.log("diluar staffName", staffName)

  const columns = [
    {
      name: `${t("groupName")}`,
      selector: "groupName",
      sortable: true
    },
    {
      name: `${t("commission")}`,
      selector: "commission",
      sortable: true
    },
    {
      name: `${t("type")}`,
      selector: "type",
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
        // console.log("rows id nya", rows.id)
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Link
                to={{
                  pathname: `/commission/group-commission/${rows.id}`,
                  state: {
                    product_id: rows.product_id,
                    staff_id: rows.staff_id,
                    outlet_id: rows.outlet_id,
                    type_total: rows.type_total,
                    type: rows.type,
                    allStaff,
                    allOutlets,
                    allProducts
                  }
                }}
              >
                <Dropdown.Item as="button">{t("edit")}</Dropdown.Item>
              </Link>
              <Dropdown.Item as="button" onClick={() => showConfirmModal(rows)}>
                {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  // console.log("dataCommission", dataCommission)

  const handleOptionsOutlet = () => {
    const uniqueArray = [];
    allCommission.map(value => {
      if(uniqueArray.indexOf(value.Outlet.name) === -1) {
        uniqueArray.push(value.Outlet.name);
      }
    })
    const result = []
    allOutlets.map(value => {
      uniqueArray.map(value2 => {
        if(value.name === value2) {
          result.push(value)
        }
      })
    })
    return result
  }
  const tempOptionOutlet = handleOptionsOutlet()

  const optionsOutlet = tempOptionOutlet.map((item) => {
    return { value: item.id, label: item.name };
  });

  // console.log("Muantuelll", optionsOutlet)

  React.useEffect(() => {
    getOutlets()
    getStaff()
    getProducts()
  }, [refresh])

  return (
    <div>
      <ConfirmModal
        title={`${t('deleteCommission')}- ${commission.name}`}
        body={t('areYouSureWantToDelete?')}
        buttonColor="danger"
        handleClick={handleDelete}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("commission")}</h3>
              </div>
              <div className="headerEnd" style={{ display: "flex" }}>
                <Link
                  to={{
                    pathname: "/commission/add-group-commission",
                    state: {
                      allStaff,
                      allOutlets,
                      allProducts
                    }
                  }}
                  className="btn btn-primary"
                >
                  {t("addGroupCommission")}
                </Link>
              </div>
            </div>

            <div className="filterSection lineBottom">
              <Row>
                <Col>
                  <InputGroup>
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
                  <Row>
                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label
                          style={{ alignSelf: "center", marginBottom: "0" }}
                        >
                          {t("outlet")}
                        </Form.Label>
                        <Col>
                          <Form.Control
                            as="select"
                            name="outlet"
                            value={filter.outlet}
                            onChange={handleFilter}
                          >
                            <option value="">{t("all")}</option>
                            {allOutlets.map((item) => {
                              return (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </Form.Control>
                        </Col>
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label
                          style={{ alignSelf: "center", marginBottom: "0" }}
                        >
                          {t("status")}
                        </Form.Label>
                        <Col>
                          <Form.Control
                            as="select"
                            name="status"
                            value={filter.status}
                            onChange={handleFilter}
                          >
                            <option value="">{t("all")}</option>
                            <option value="active">{t("active")}</option>
                            <option value="inactive">{t("inactive")}</option>
                          </Form.Control>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataCommission}
              expandableRows
              expandableRowsComponent={ExpandableComponent}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </div>
  );
}

export default CommissionPage;
