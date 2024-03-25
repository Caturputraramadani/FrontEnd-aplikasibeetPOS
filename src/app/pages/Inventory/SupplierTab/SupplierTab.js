import React from "react";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";

import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { MoreHoriz } from "@material-ui/icons";

import { Search } from "@material-ui/icons";
import useDebounce from "../../../hooks/useDebounce";

import SupplierModal from "./SupplierModal";
import ConfirmModal from "../../../components/ConfirmModal";

const SupplierTab = ({ refresh, handleRefresh, t }) => {
  const [alert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  // const [filter, setFilter] = React.useState({
  //   time: "newest"
  // });

  const [supplier, setSupplier] = React.useState([]);
  const [currSupplier, setCurrSupplier] = React.useState({
    id: "",
    supplier_name: ""
  });

  const initialValueSupplier = {
    supplier_name: "",
    address: "",
    phone_number: "",
    email: ""
  };

  const initialValueSupplierEdit = {
    id: "",
    supplier_name: "",
    address: "",
    phone_number: "",
    email: ""
  };

  const SupplierSchema = Yup.object().shape({
    supplier_name: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputASupplierName")}`),
    address: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("minimum1Character")}`),
    phone_number: Yup.number()
      .typeError(`${t("numberOnly")}`)
      .required(`${t("pleaseInputPhoneNumber")}`),
    email: Yup.string()
      .email()
      .required(`${t("pleaseInputEmail")}`)
  });

  const SupplierEditSchema = Yup.object().shape({
    supplier_name: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputSupplierName")}`),
    address: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("minimum1Character")}`),
    phone_number: Yup.number()
      .typeError(`${t("numberOnly")}`)
      .required(`${t("pleaseInputPhoneNumber")}`),
    email: Yup.string()
      .email()
      .required(`${t("pleaseInputEmail")}`)
  });

  const formikSupplier = useFormik({
    initialValues: initialValueSupplier,
    validationSchema: SupplierSchema,
    onSubmit: async (values, {resetForm}) => {
      const supplierData = {
        name: values.supplier_name,
        address: values.address,
        phone_number: values.phone_number,
        email: values.email
      };

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.post(`${API_URL}/api/v1/supplier`, supplierData);
        resetForm()
        handleRefresh();
        disableLoading();
        closeAddModal();
      } catch (err) {
        disableLoading();
        setAlert(err.response?.data.message || err.message);
      }
    }
  });

  const validationSupplier = (fieldname) => {
    if (formikSupplier.touched[fieldname] && formikSupplier.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikSupplier.touched[fieldname] &&
      !formikSupplier.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const formikEditSupplier = useFormik({
    initialValues: initialValueSupplierEdit,
    validationSchema: SupplierEditSchema,
    onSubmit: async (values) => {
      const supplierData = {
        name: values.supplier_name,
        address: values.address,
        phone_number: values.phone_number,
        email: values.email
      };

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/supplier/${values.id}`,
          supplierData
        );
        handleRefresh();
        disableLoading();
        closeEditModal();
      } catch (err) {
        disableLoading();
        setAlert(err.response?.data.message || err.message);
      }
    }
  });

  const validationEditSupplier = (fieldname) => {
    if (
      formikEditSupplier.touched[fieldname] &&
      formikEditSupplier.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikEditSupplier.touched[fieldname] &&
      !formikEditSupplier.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getSupplier = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filter = `?name=${search}`;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/supplier${filter}`);
      setSupplier(data.data);
    } catch (err) {
      setSupplier([]);
    }
  };

  React.useEffect(() => {
    getSupplier(debouncedSearch);
  }, [refresh, debouncedSearch]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    setAlert("");
    setStateAddModal(false);
  };

  const showEditModal = (data) => {
    formikEditSupplier.setFieldValue("id", data.id);
    formikEditSupplier.setFieldValue("supplier_name", data.supplier_name);
    formikEditSupplier.setFieldValue("address", data.address);
    formikEditSupplier.setFieldValue("phone_number", data.phone_number);
    formikEditSupplier.setFieldValue("email", data.email);
    setStateEditModal(true);
  };
  const closeEditModal = () => {
    setAlert("");
    formikEditSupplier.resetForm();
    setStateEditModal(false);
  };

  const showDeleteModal = (data) => {
    setCurrSupplier({
      id: data.id,
      supplier_name: data.supplier_name
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setAlert("");
    setStateDeleteModal(false);
  };

  const handleSearch = (e) => setSearch(e.target.value);
  // const handleFilter = (e) => {
  //   const { name, value } = e.target;
  //   const filterData = { ...filter };
  //   filterData[name] = value;
  //   setFilter(filterData);
  // };

  const handleDeleteSupplier = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/supplier/${id}`);
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
      name: `${t("supplierName")}`,
      selector: "supplier_name",
      sortable: true
    },
    {
      name: `${t("address")}`,
      selector: "address",
      sortable: true
    },
    {
      name: `${t("phoneNumber")}`,
      selector: "phone_number",
      sortable: true
    },
    {
      name: `${t("email")}`,
      selector: "email",
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
              <Dropdown.Item as="button" onClick={() => showEditModal(rows)}>
              {t("edit")}
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
              {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataSupplier = supplier.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      supplier_name: item.name,
      address: item.address,
      phone_number: item.phone_number,
      email: item.email
    };
  });

  return (
    <>
      <SupplierModal
        t={t}
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title={t("addNewSupplier")}
        loading={loading}
        alert={alert}
        formikSupplier={formikSupplier}
        validationSupplier={validationSupplier}
      />

      <SupplierModal
        t={t}
        stateModal={stateEditModal}
        cancelModal={closeEditModal}
        title={`${t("editSupplier")} - ${formikEditSupplier.values.supplier_name}`}
        loading={loading}
        alert={alert}
        formikSupplier={formikEditSupplier}
        validationSupplier={validationEditSupplier}
      />

      <ConfirmModal
        t={t}
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`${t("deleteSupplier")} - ${currSupplier.supplier_name}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={() => handleDeleteSupplier(currSupplier.id)}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("supplierList")}</h3>
              </div>
              <div className="headerEnd">
                <Button variant="primary" onClick={showAddModal}>
                  {t("addNewSupplier")}
                </Button>
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
              data={dataSupplier}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default SupplierTab;
