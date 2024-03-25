import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

import {
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  InputGroup,
  FormControl
} from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import ModalTax from "./ModalTax";
import ShowConfirmModal from "../../../components/ConfirmModal";
import useDebounce from "../../../hooks/useDebounce";

import "../../style.css";

export const TaxTab = ({ handleRefresh, refresh }) => {
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const [allTaxTypes, setAllTaxTypes] = React.useState([]);
  const [allTypes, setAllTypes] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState({
    type: ""
  });

  const debouncedSearch = useDebounce(search, 1000);

  const getTypes = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/tax-type`);
      console.log("get types tax", data.data)
      data.data.map(value => {
        value.name = value.name.toLowerCase()
      })
      setAllTypes(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      console.log("get outlets", data.data)
      setAllOutlets(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getTaxes = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterTaxType = `?name=${search}&type=${filter.type}`;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/tax${filterTaxType}`);
      console.log("get taxes", data.data)
      setAllTaxTypes(data.data);
    } catch (err) {
      setAllTaxTypes([]);
    }
  };
  const { t } = useTranslation();
  React.useEffect(() => {
    getTypes();
    getOutlets();
  }, []);

  React.useEffect(() => {
    getTaxes(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const initialValueTax = {
    name: "",
    value: "",
    tax_type_id: "",
    outlet_id: []
  };

  const TaxSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAName")}`),
    value: Yup.number()
      // .integer()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`)
      .required(`${t("pleaseInputValue")}`),
    tax_type_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAType")}`),
    outlet_id: Yup.array().of(Yup.number().min(1))
  });

  const formikTax = useFormik({
    enableReinitialize: true,
    initialValues: initialValueTax,
    validationSchema: TaxSchema,
    onSubmit: async (values) => {
      const taxData = {
        name: values.name,
        value: values.value,
        tax_type_id: values.tax_type_id,
        outlet_id: values.outlet_id
      };

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/tax`, taxData);
        handleRefresh();
        disableLoading();
        cancelAddModalTax();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const formikTaxEdit = useFormik({
    enableReinitialize: true,
    initialValues: initialValueTax,
    validationSchema: TaxSchema,
    onSubmit: async (values) => {
      const taxData = {
        name: values.name,
        value: values.value,
        tax_type_id: values.tax_type_id,
        outlet_id: values.outlet_id
      };
      console.log("values", values)
      console.log("data yang mau diedit", taxData)
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/tax/${values.id}`, taxData);
        handleRefresh();
        disableLoading();
        cancelEditModalTax();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const validationTax = (fieldname) => {
    if (formikTax.touched[fieldname] && formikTax.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikTax.touched[fieldname] && !formikTax.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const validationTaxEdit = (fieldname) => {
    if (formikTaxEdit.touched[fieldname] && formikTaxEdit.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikTaxEdit.touched[fieldname] && !formikTaxEdit.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const showAddModalTax = () => setStateAddModal(true);
  const cancelAddModalTax = () => {
    formikTax.resetForm();
    setStateAddModal(false);
  };

  const showEditModalOutlet = (data) => {
    formikTaxEdit.setValues({
      id: data.id,
      name: data.name,
      // value: parseInt(data.amount.slice(0, -1)),
      value: parseFloat(data.amount),
      tax_type_id: data.tax_type_id,
      outlet_id: data.outlet_id
    });

    setStateEditModal(true);
  };
  const cancelEditModalTax = () => {
    formikTaxEdit.resetForm();
    setStateEditModal(false);
  };
  const showDeleteModalTax = (data) => {
    formikTax.setFieldValue("id", data.id);
    formikTax.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const cancelDeleteModalTax = () => {
    formikTax.resetForm();
    setStateDeleteModal(false);
  };

  const handleDeleteTax = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const tax_id = formikTax.getFieldProps("id").value;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/tax/${tax_id}`);
      handleRefresh();
      disableLoading();
      cancelDeleteModalTax();
    } catch (err) {
      disableLoading();
    }
  };

  const handleSelectOutlet = (value, formik) => {
    if (value) {
      const outlet = value.map((item) => item.value);
      console.log("outletnya", outlet)
      formik.setFieldValue("outlet_id", outlet);
    } else {
      formik.setFieldValue("outlet_id", []);
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
      name: `${t("type")}`,
      selector: "type",
      sortable: true
    },
    {
      name: `${t("amount")}`,
      selector: "amount",
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
                onClick={() => showEditModalOutlet(rows)}
              >
                {t("edit")}
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => showDeleteModalTax(rows)}
              >
                {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataTaxes = () => {
    return allTaxTypes.map((item, index) => {
      console.log("item.value", item.value)
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        type: item.Tax_Type.name ? t(item.Tax_Type.name.toLowerCase()) : "",
        tax_type_id: item.tax_type_id,
        amount: parseFloat(item.value) + "%",
        outlet_id: item.Outlet_Taxes.map((item) => item.outlet_id)
      };
    });
  };

  return (
    <Row>
      <ModalTax
        t={t}
        stateModal={stateAddModal}
        cancelModal={cancelAddModalTax}
        title={t("addNewTax/Charges")}
        loading={loading}
        formikTax={formikTax}
        validationTax={validationTax}
        allTypes={allTypes}
        allOutlets={allOutlets}
        handleSelectOutlet={handleSelectOutlet}
      />

      <ModalTax
        t={t}
        stateModal={stateEditModal}
        cancelModal={cancelEditModalTax}
        title={`${t("editTax")} - ${formikTaxEdit.getFieldProps("name").value}`}
        loading={loading}
        formikTax={formikTaxEdit}
        validationTax={validationTaxEdit}
        allTypes={allTypes}
        allOutlets={allOutlets}
        handleSelectOutlet={handleSelectOutlet}
      />

      <ShowConfirmModal
        t={t}
        state={stateDeleteModal}
        closeModal={cancelDeleteModalTax}
        title={`${t("deleteTax")} - ${formikTax.getFieldProps("name").value}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeleteTax}
      />

      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>{t("tax&Charges")}</h3>
            </div>
            <div className="headerEnd">
              <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={showAddModalTax}
              >
                {t("addNewTax")}
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
                  <FormControl
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
                        {t("type")}:
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="type"
                          value={filter.type}
                          onChange={handleFilter}
                        >
                          <option value="">{t("all")}</option>
                          {allTypes.map((item) => {
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
                </Row>
              </Col>
            </Row>
          </div>

          <DataTable
            noHeader
            pagination
            columns={columns}
            data={dataTaxes()}
            style={{ minHeight: "100%" }}
            noDataComponent={t('thereAreNoRecordsToDisplay')}
          />
        </Paper>
      </Col>
    </Row>
  );
};
