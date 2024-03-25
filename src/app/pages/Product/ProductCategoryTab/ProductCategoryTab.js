import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Button,
  Alert,
  Dropdown,
  InputGroup,
  Form
} from "react-bootstrap";
import { Paper } from "@material-ui/core";

import DataTable from "react-data-table-component";
import { Search, MoreHoriz, Delete } from "@material-ui/icons";

import useDebounce from "../../../hooks/useDebounce";

import ConfirmModal from "../../../components/ConfirmModal";
import ProductCategoryModal from "./ProductCategoryModal";
import ModalAddToProduct from "./ModalAddToProduct";

import "../../style.css";

const ProductCategoryTab = ({ refresh, handleRefresh}) => {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [alertModal, setAlertModal] = React.useState("");
  const [showConfirmBulk, setShowConfirmBulk] = React.useState(false);
  const [modalAddToProduct, setModalAddToProduct] = React.useState(false);
  const { t } = useTranslation();
  const [multiSelect, setMultiSelect] = React.useState(false);
  const [clearRows, setClearRows] = React.useState(true);
  const [selectedData, setSelectedData] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState({
    id: "",
    category_name: ""
  });
  const [selectedProducts, setSelectedProducts] = React.useState([]);

  const [allCategories, setAllCategories] = React.useState([]);
  const [allProducts, setAllProducts] = React.useState([]);

  const [search, setSearch] = React.useState("");

  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showAddCategory, setShowAddCategory] = React.useState(false);
  const [showEditCategory, setShowEditCategory] = React.useState(false);
  const [hiddenCategory, setHiddenCategory] = React.useState("Inactive")

  const debouncedSearch = useDebounce(search, 1000);

  const inputRef = React.useRef();

  const initialCategory = {
    id: "",
    name: "",
    hidden: "Inactive"
  };

  const handleHiddenCategory = (status) => {
    setHiddenCategory(status)
  }

  const CategorySchema = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputACategory")}`)
  });

  const formikAddCategory = useFormik({
    initialValues: initialCategory,
    validationSchema: CategorySchema,
    onSubmit: async (values) => {
      console.log("data ditambahkan", values)
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        if(values.hidden === "Active") values.hidden = true
        if(values.hidden === "Inactive") values.hidden = false
        console.log("data yang ditambah", values )
        setAlert("");
        enableLoading();
        await axios.post(`${API_URL}/api/v1/product-category`, values);

        getProductCategory();

        handleRefresh();
        disableLoading();
        closeAddCategoryModal();
      } catch (err) {
        disableLoading();
        setAlertModal(err.response.data.message);
      }
    }
  });

  const formikEditCategory = useFormik({
    enableReinitialize: true,
    initialValues: initialCategory,
    validationSchema: CategorySchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        if(values.hidden === "Active") values.hidden = true
        if(values.hidden === "Inactive") values.hidden = false
        console.log("data yang diupdate", values )
        setAlert("");
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/product-category/${values.id}`,
          values
        );

        getProductCategory();

        handleRefresh();
        disableLoading();
        closeEditCategoryModal();
      } catch (err) {
        disableLoading();
        setAlertModal(err.response.data.message);
      }
    }
  });

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showAddCategoryModal = () => {
    setShowAddCategory(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };
  const closeAddCategoryModal = () => {
    setAlertModal("");
    formikAddCategory.setFieldValue("name", "");
    setShowAddCategory(false);
  };

  const showEditCategoryModal = (data) => {
    console.log("data edit", data)
    setAlertModal("");
    formikEditCategory.setFieldValue("id", data.id);
    formikEditCategory.setFieldValue("name", data.name);
    if(data.hidden) setHiddenCategory("Active")
    if(!data.hidden) setHiddenCategory("Inactive")
    setShowEditCategory(true);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const closeEditCategoryModal = () => setShowEditCategory(false);

  const showConfirmModal = (data) => {
    formikEditCategory.setFieldValue("id", data.id);
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

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
  const showAddToProduct = (data) => {
    setSelectedCategory({
      id: data.id,
      category_name: data.name
    });
    setModalAddToProduct(true);
  };
  const closeAddToProduct = () => {
    setSelectedProducts([]);
    setModalAddToProduct(false);
  };

  const handleMode = () => {
    setSelectedData([]);
    setMultiSelect((state) => !state);
    setClearRows((state) => !state);
  };

  const handleSelected = (state) => setSelectedData(state.selectedRows);
  const handleSelectProducts = (e) => {
    const { value } = e.target;

    const copyProducts = [...selectedProducts];

    if (copyProducts.includes(value)) {
      copyProducts.splice(copyProducts.indexOf(value), 1);
    } else {
      copyProducts.push(value);
    }

    setSelectedProducts(copyProducts);
  };

  const handleAddToProduct = async (categories, products, e) => {
    e.preventDefault();
    const API_URL = process.env.REACT_APP_API_URL;

    if (!products.length) {
      closeAddToProduct();
    }

    const sendData = {
      category_id: categories.id,
      products_id: products
    };

    try {
      enableLoading();
      await axios.post(
        `${API_URL}/api/v1/product-category/add-to-product`,
        sendData
      );
      disableLoading();
      handleRefresh();
      closeAddToProduct();
    } catch (err) {
      console.log(err);
    }
  };

  const getProductCategory = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterProductCategory = search ? `?name=${search}` : "";

    try {
      const allCategories = await axios.get(
        `${API_URL}/api/v1/product-category${filterProductCategory}`
      );
      setAllCategories(allCategories.data.data);
    } catch (err) {
      setAllCategories([]);
    }
  };

  const getProduct = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product`);
      const filterProduct = data.data.filter(
        (item) => item.product_category_id === null
      );
      setAllProducts(filterProduct);
    } catch (err) {
      setAllProducts([]);
    }
  };

  const handleBulkDelete = async (data) => {
    if (!data.length) {
      return handleMode();
    }

    const API_URL = process.env.REACT_APP_API_URL;
    const product_category_id = data.map((item) => item.id);

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/product-category/bulk-delete`, {
        data: { product_category_id }
      });
      disableLoading();
      handleRefresh();
      closeConfirmBulkModal();
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getProductCategory(debouncedSearch);
  }, [refresh, debouncedSearch]);

  React.useEffect(() => {
    getProduct();
  }, [refresh]);

  const categoryData = (data) => {
    if (!data.length) {
      return;
    }

    return data.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        products: item.Products.length,
        hidden: item.hidden
      };
    });
  };
 
  const columns = [

    {
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "70px"
    },
    {
      name: `${t("categoryName")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("numberOfProduct")}`,
      selector: "products",
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
              <Dropdown.Item as="button" onClick={() => showAddToProduct(rows)}>
                {t("addNewProductCategory")}
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => showEditCategoryModal(rows)}
              >
                {t("edit")}
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => showConfirmModal(rows)}>
                {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const handleDelete = async () => {
    const categoryId = formikEditCategory.getFieldProps("id").value;
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/product-category/${categoryId}`);

      setAllCategories(allCategories.filter((item) => item.id !== categoryId));
      handleRefresh();

      disableLoading();
      closeConfirmModal();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);

  return (
    <Row>
      <ConfirmModal
        title={t("deleteProductCategory")}
        body={t("areYouSureWantToDelete?")}
        buttonColor="danger"
        handleClick={handleDelete}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />

      <ProductCategoryModal
        t={t}
        hiddenCategory={hiddenCategory}
        handleHiddenCategory={handleHiddenCategory}
        state={showAddCategory}
        closeModal={closeAddCategoryModal}
        loading={loading}
        alert={alertModal}
        title={t("addProductCategory")}
        formikCategory={formikAddCategory}
        inputRef={inputRef}
      />

      <ProductCategoryModal
        t={t}
        hiddenCategory={hiddenCategory}
        handleHiddenCategory={handleHiddenCategory}
        state={showEditCategory}
        closeModal={closeEditCategoryModal}
        loading={loading}
        alert={alertModal}
        title={t("editProductCategory")}
        formikCategory={formikEditCategory}
        inputRef={inputRef}
      />

      <ConfirmModal
        title={`${t("delete")} ${selectedData.length} ${t("selectedModifiers")}`}
        body={t("areYouSureWantToDelete?")}
        buttonColor="danger"
        handleClick={() => handleBulkDelete(selectedData)}
        state={showConfirmBulk}
        closeModal={closeConfirmBulkModal}
        loading={loading}
      />

      <ModalAddToProduct
        t={t}
        state={modalAddToProduct}
        closeModal={closeAddToProduct}
        loading={loading}
        alert={alertModal}
        title={`${t("add")} "${selectedCategory.category_name}" ${t("toProducts")}`}
        selectedCategory={selectedCategory}
        selectedProducts={selectedProducts}
        allProducts={allProducts}
        handleSelectProducts={handleSelectProducts}
        handleAddToProduct={handleAddToProduct}
      />

      <Col md={12} style={{ minHeight: "100%" }}>
        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              {!selectedData.length ? (
                <h3>{t("categoryTitle")}</h3>
              ) : (
                <h3>{selectedData.length}{t("itemSelected")}</h3>
              )}
            </div>
            <div className="headerEnd">
              {!multiSelect ? (
                <Button variant="primary" onClick={showAddCategoryModal}>
                  {t("addNewProductCategory")}
                </Button>
              ) : (
                <Button
                  variant="danger"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => showConfirmBulkModal(selectedData)}
                >
                  {t("delete")}
                </Button>
              )}
              {allCategories.length ? (
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
          </div>

          <DataTable
            noHeader
            pagination
            columns={columns}
            data={categoryData(allCategories)}
            style={{ minHeight: "100%" }}
            selectableRows={multiSelect}
            onSelectedRowsChange={handleSelected}
            clearSelectedRows={clearRows}
            noDataComponent={t('thereAreNoRecordsToDisplay')}
          />
        </Paper>
      </Col>
    </Row>
  );
};

export default ProductCategoryTab;
