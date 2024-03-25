import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Row, Col, Button, Form, Dropdown, InputGroup } from "react-bootstrap";

import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import ModalSalesType from "./ModalSalesType";
import ShowConfirmModal from "../../../components/ConfirmModal";
import useDebounce from "../../../hooks/useDebounce";

import "../../style.css";

export const SalesTypeTab = ({ handleRefresh, refresh, t, optionsEcommerce, showOptionEcommerce }) => {
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [hidden, setHidden] = React.useState("Inactive")

  const [AllSalesTypes, setAllSalesTypes] = React.useState([]);

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const handleHidden = (status) => {
    setHidden(status)
  }

  const getSalesTypes = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterSalesType = search ? `?name=${search}` : "";
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/sales-type${filterSalesType}`
      );

      // partisi business type
      const business = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)
      const business_type_id = business.data.data.business_type_id

      console.log("business_type_id =====>", business_type_id)

      const result = data.data.filter((value) => {
        // Jika business type nya Retail (1) dan Service (3), Sales Type dengan nama Dine-In dan Take-Away akan di Hide  
        if(business_type_id === 3 || business_type_id === 1) {
          if(value.name.toLowerCase() !== 'dine-in' && value.name.toLowerCase() !== 'take-away') {
            return value
          }
        } else {
          return value
        }
      })
      
      setAllSalesTypes(result);
      // setAllSalesTypes(data.data);
    } catch (err) {
      console.log("err ====>", err)
      setAllSalesTypes([]);
    }
  };

  React.useEffect(() => {
    getSalesTypes(debouncedSearch);
  }, [refresh, debouncedSearch]);

  const handleSearch = (e) => setSearch(e.target.value);

  const initialValueSalesType = {
    name: "",
    ecommerce_name: "",
    require_table: false,
    is_booking: false,
    is_delivery: false,
    charge: 0,
    hidden: ""
  };

  const SalesTypeSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAName")}`),
    require_table: Yup.boolean(),
    is_booking: Yup.boolean(),
    is_delivery: Yup.boolean(),
    charge: Yup.number()
      .integer()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`)
      .required(`${t("pleaseInputACharge")}`)
  });

  const formikSalesType = useFormik({
    enableReinitialize: true,
    initialValues: initialValueSalesType,
    validationSchema: SalesTypeSchema,
    onSubmit: async (values) => {
      const salesTypeData = {
        name: values.name,
        require_table: values.require_table,
        is_booking: values.is_booking,
        is_delivery: values.is_delivery,
        charge: values.charge
      };
      if(values.hidden === "Active") salesTypeData.hidden = true
      if(values.hidden === "Inactive") salesTypeData.hidden = false

      console.log("salesTypeData", salesTypeData)

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/sales-type`, salesTypeData);
        handleRefresh();
        disableLoading();
        cancelAddModalSalesType();
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const formikSalesTypeEdit = useFormik({
    enableReinitialize: true,
    initialValues: initialValueSalesType,
    validationSchema: SalesTypeSchema,
    onSubmit: async (values) => {
      const salesTypeData = {
        name: values.name,
        require_table: values.require_table,
        is_booking: values.is_booking,
        is_delivery: values.is_delivery,
        charge: values.charge
      };
      if(values.hidden === "Active") salesTypeData.hidden = true
      if(values.hidden === "Inactive") salesTypeData.hidden = false

      console.log("salesTypeData", salesTypeData)

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/sales-type/${values.id}`,
          salesTypeData
        );
        handleRefresh();
        disableLoading();
        cancelEditModalSalesType();
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationSalesType = (fieldname) => {
    if (
      formikSalesType.touched[fieldname] &&
      formikSalesType.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikSalesType.touched[fieldname] &&
      !formikSalesType.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const validationSalesTypeEdit = (fieldname) => {
    if (
      formikSalesTypeEdit.touched[fieldname] &&
      formikSalesTypeEdit.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikSalesTypeEdit.touched[fieldname] &&
      !formikSalesTypeEdit.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const showAddModalSalesType = () => setStateAddModal(true);
  const cancelAddModalSalesType = () => {
    formikSalesType.resetForm();
    setStateAddModal(false);
    setAlert("");
  };

  const showEditModalSalesType = (data) => {
    formikSalesTypeEdit.setValues({
      id: data.id,
      name: data.name,
      ecommerce_name: data.ecommerce_name,
      require_table: data.require_table,
      is_booking: data.is_booking,
      is_delivery: data.is_delivery,
      charge: parseInt(data.charge.slice(0, -1))
    });
    if(data.hidden) setHidden("Active")
    if(!data.hidden) setHidden("Inactive")
    setStateEditModal(true);
  };

  const cancelEditModalSalesType = () => {
    formikSalesTypeEdit.resetForm();
    setStateEditModal(false);
    setAlert("");
  };
  const showDeleteModalSalesType = (data) => {
    formikSalesType.setFieldValue("id", data.id);
    formikSalesType.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const cancelDeleteModalSalesType = () => {
    formikSalesType.resetForm();
    setStateDeleteModal(false);
    setAlert("");
  };

  const handleDeleteSalesType = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const sales_type_id = formikSalesType.getFieldProps("id").value;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/sales-type/${sales_type_id}`);
      handleRefresh();
      disableLoading();
      cancelDeleteModalSalesType();
    } catch (err) {
      setAlert(err.response?.data.message || err.message);
      disableLoading();
    }
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
      name: `${t("name")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("charge")}`,
      selector: "charge",
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
              <Dropdown.Item
                as="button"
                onClick={() => showEditModalSalesType(rows)}
              >
                {t("edit")}
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => showDeleteModalSalesType(rows)}
              >
                {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataSalesTypes = () => {
    return AllSalesTypes.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        ecommerce_name: item.ecommerce,
        require_table: item.require_table,
        is_booking: item.is_booking,
        is_delivery: item.is_delivery,
        charge: item.charge + "%",
        hidden: item.hidden
      };
    });
  };

  return (
    <Row>
      <ModalSalesType
        t={t}
        stateModal={stateAddModal}
        cancelModal={cancelAddModalSalesType}
        title={t("addNewSalesType")}
        loading={loading}
        formikSalesType={formikSalesType}
        validationSalesType={validationSalesType}
        alert={alert}
        hidden={hidden}
        handleHidden={handleHidden}
        showOptionEcommerce={showOptionEcommerce}
        optionsEcommerce={optionsEcommerce}
      />

      <ModalSalesType
        t={t}
        stateModal={stateEditModal}
        cancelModal={cancelEditModalSalesType}
        title={`${t("editSalesType")} - ${
          formikSalesTypeEdit.getFieldProps("name").value
        }`}
        loading={loading}
        formikSalesType={formikSalesTypeEdit}
        validationSalesType={validationSalesTypeEdit}
        alert={alert}
        hidden={hidden}
        handleHidden={handleHidden}
        showOptionEcommerce={showOptionEcommerce}
        optionsEcommerce={optionsEcommerce}
      />

      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={cancelDeleteModalSalesType}
        title={`${t("deleteSalesType")} - ${
          formikSalesType.getFieldProps("name").value
        }`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeleteSalesType}
        alert={alert}
      />

      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>{t("salesType")}</h3>
            </div>
            <div className="headerEnd">
              <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={showAddModalSalesType}
              >
                {t("addNewSalesType")}
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
                    type="text"
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
            data={dataSalesTypes()}
            style={{ minHeight: "100%" }}
            noDataComponent={t('thereAreNoRecordsToDisplay')}
          />
        </Paper>
      </Col>
    </Row>
  );
};
