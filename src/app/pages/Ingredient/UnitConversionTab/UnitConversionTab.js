import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import {
  Button,
  InputGroup,
  Form,
  Row,
  Col,
  Dropdown,
  ListGroup
} from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";
import useDebounce from "../../../hooks/useDebounce";

import AddModal from "./AddModal";
import ConfirmModal from "../../../components/ConfirmModal";

const UnitConversionTab = ({ allUnits, refresh, handleRefresh }) => {
  const [alert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const [filter, setFilter] = React.useState({
    time: "newest"
  });

  const [units, setUnits] = React.useState([]);

  const [currUnit, setCurrUnit] = React.useState({
    id: "",
    name: ""
  });
  const initialValueUnit = {
    name: "",
    unit_from_id: "",
    unit_to_id: "",
    value: ""
  };
  const initialValueUnitEdit = {
    id: "",
    name: "",
    unit_from_id: "",
    unit_to_id: "",
    value: ""
  };

  const UnitSchema = Yup.object().shape({
    name: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputName")}`),
    unit_from_id: Yup.number().required(`${t("pleaseChooseUnit")}`),
    unit_to_id: Yup.number().required(`${t("pleaseChooseUnit")}`),
    value: Yup.number().required(`${t("pleaseInputValue")}`)
  });

  const UnitEditSchema = Yup.object().shape({
    name: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputName")}`),
    unit_from_id: Yup.number().required(`${t("pleaseChooseUnit")}`),
    unit_to_id: Yup.number().required(`${t("pleaseChooseUnit")}`),
    value: Yup.number().required(`${t("pleaseInputValue")}`)
  });

  const formikUnit = useFormik({
    initialValues: initialValueUnit,
    validationSchema: UnitSchema,
    onSubmit: async (values) => {
      const unitData = {
        name: values.name,
        unit_from_id: values.unit_from_id,
        unit_to_id: values.unit_to_id,
        value: values.value
      };

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.post(`${API_URL}/api/v1/unit-conversion`, unitData);
        handleRefresh();
        disableLoading();
        closeAddModal();
      } catch (err) {
        disableLoading();
        setAlert(err.response?.data.message || err.message);
      }
    }
  });

  const validationUnit = (fieldname) => {
    if (formikUnit.touched[fieldname] && formikUnit.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikUnit.touched[fieldname] && !formikUnit.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formikEditUnit = useFormik({
    initialValues: initialValueUnitEdit,
    validationSchema: UnitEditSchema,
    onSubmit: async (values) => {
      const unitData = {
        name: values.name,
        unit_from_id: values.unit_from_id,
        unit_to_id: values.unit_to_id,
        value: values.value
      };

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/unit-conversion/${values.id}`,
          unitData
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

  const validationEditUnit = (fieldname) => {
    if (formikEditUnit.touched[fieldname] && formikEditUnit.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikEditUnit.touched[fieldname] &&
      !formikEditUnit.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getUnit = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filter = `?name=${search}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/unit-conversion${filter}`
      );
      setUnits(data.data);
    } catch (err) {
      setUnits([]);
    }
  };

  React.useEffect(() => {
    getUnit(debouncedSearch);
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

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    setAlert("");
    formikUnit.resetForm();
    setStateAddModal(false);
  };

  const showEditModal = (data) => {
    formikEditUnit.setValues({
      id: data.id,
      name: data.name,
      unit_from_id: data.unit_from_id,
      unit_to_id: data.unit_to_id,
      value: data.value
    });
    setStateEditModal(true);
  };
  const closeEditModal = () => {
    setAlert("");
    formikEditUnit.resetForm();
    setStateEditModal(false);
  };

  const showDeleteModal = (data) => {
    setCurrUnit({
      id: data.id,
      name: data.name
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setAlert("");
    setStateDeleteModal(false);
  };

  const handleDeleteUnit = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/unit-conversion/${id}`);
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
      name: `${t("name")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("unitFrom")}`,
      selector: "unit_from",
      sortable: true
    },
    {
      name: `${t("unitTo")}`,
      selector: "unit_to",
      sortable: true
    },
    {
      name: `${t("value")}`,
      selector: "value",
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

  const dataUnit = units.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      name: item.name,
      unit_from_id: item.unit_from_id,
      unit_from: item.Unit_From ? item.Unit_From.name : "-",
      unit_to_id: item.unit_to_id,
      unit_to: item.Unit_To ?item.Unit_To.name : "-",
      value: item.value
    };
  });

  return (
    <>
      <AddModal
        t={t}
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title={t("addNewUnitConvertion")}
        loading={loading}
        alert={alert}
        formikUnitConversion={formikUnit}
        validationUnitConverion={validationUnit}
        allUnits={allUnits}
      />
      <AddModal
        t={t}
        stateModal={stateEditModal}
        cancelModal={closeEditModal}
        title={`${t("editunitConvertion")} - ${formikEditUnit.values.name}`}
        loading={loading}
        alert={alert}
        formikUnitConversion={formikEditUnit}
        validationUnitConverion={validationEditUnit}
        allUnits={allUnits}
      />

      <ConfirmModal
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`${t("deleteUnitConvertion")} - ${currUnit.name}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={() => handleDeleteUnit(currUnit.id)}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("unitConvertion")}</h3>
              </div>
              <div className="headerEnd">
                <Button variant="primary" onClick={showAddModal}>
                {t("addNewUnitConvertion")}
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
              data={dataUnit}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default UnitConversionTab;
