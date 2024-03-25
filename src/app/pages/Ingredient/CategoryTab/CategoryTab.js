import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";
import useDebounce from "../../../hooks/useDebounce";

import AddModal from "./AddModal";
import ConfirmModal from "../../../components/ConfirmModal";

const CategoryTab = ({ refresh, handleRefresh }) => {
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

  const [categories, setCategories] = React.useState([]);

  const [currCategory, setCurrCategory] = React.useState({
    id: "",
    name: ""
  });
  const initialValueCategory = {
    name: ""
  };
  const initialValueCategoryEdit = {
    id: "",
    name: ""
  };

  const CategorySchema = Yup.object().shape({
    name: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .max(25, `${t("maximum25Character")}`)
      .required(`${t("pleaseInputName")}`)
  });

  const CategoryEditSchema = Yup.object().shape({
    name: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .max(25, `${t("maximum25Character")}`)
      .required(`${t("pleaseInputName")}`)
  });

  const formikCategory = useFormik({
    initialValues: initialValueCategory,
    validationSchema: CategorySchema,
    onSubmit: async (values) => {
      const categoryData = {
        name: values.name
      };

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.post(
          `${API_URL}/api/v1/raw-material-category`,
          categoryData
        );
        handleRefresh();
        disableLoading();
        closeAddModal();
      } catch (err) {
        disableLoading();
        setAlert(err.response?.data.message || err.message);
      }
    }
  });

  const validationCategory = (fieldname) => {
    if (formikCategory.touched[fieldname] && formikCategory.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikCategory.touched[fieldname] &&
      !formikCategory.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const formikEditCategory = useFormik({
    initialValues: initialValueCategoryEdit,
    validationSchema: CategoryEditSchema,
    onSubmit: async (values) => {
      const categoryData = {
        name: values.name
      };

      try {
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/raw-material-category/${values.id}`,
          categoryData
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

  const validationEditCategory = (fieldname) => {
    if (
      formikEditCategory.touched[fieldname] &&
      formikEditCategory.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikEditCategory.touched[fieldname] &&
      !formikEditCategory.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getCategory = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filter = `?name=${search}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/raw-material-category${filter}`
      );
      setCategories(data.data);
    } catch (err) {
      setCategories([]);
    }
  };

  React.useEffect(() => {
    getCategory(debouncedSearch);
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
    formikCategory.resetForm();
    setStateAddModal(false);
  };

  const showEditModal = (data) => {
    formikEditCategory.setValues({
      id: data.id,
      name: data.name
    });
    setStateEditModal(true);
  };
  const closeEditModal = () => {
    setAlert("");
    formikEditCategory.resetForm();
    setStateEditModal(false);
  };

  const showDeleteModal = (data) => {
    setCurrCategory({
      id: data.id,
      name: data.name
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setAlert("");
    setStateDeleteModal(false);
  };

  const handleDeleteCategory = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/raw-material-category/${id}`);
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
      sortable: true,
      wrap: true
    },
    {
      name: `${t("numberOfIngredients")}`,
      selector: "total",
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

  const dataCategory = categories.map((item, index) => {
    const total = item.Raw_Materials?.length || 0;

    return {
      id: item.id,
      no: index + 1,
      name: item.name,
      total
    };
  });

  return (
    <>
      <AddModal
        t={t}
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title={t("addNewCategory")}
        loading={loading}
        alert={alert}
        formikCategory={formikCategory}
        validationCategory={validationCategory}
      />
      <AddModal
        t={t}
        stateModal={stateEditModal}
        cancelModal={closeEditModal}
        title={t("editCategory")}
        loading={loading}
        alert={alert}
        formikCategory={formikEditCategory}
        validationCategory={validationEditCategory}
      />

      <ConfirmModal
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`${t("deleteCategory")}-  ${currCategory.name}`}
        body={t("")}
        loading={loading}
        buttonColor="danger"
        handleClick={() => handleDeleteCategory(currCategory.id)}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("ingredientsCategory")}</h3>
              </div>
              <div className="headerEnd">
                <Button variant="primary" onClick={showAddModal}>
                {t("addNewCategory")}
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
              data={dataCategory}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default CategoryTab;
