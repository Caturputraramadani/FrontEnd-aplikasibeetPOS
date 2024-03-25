import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { ExcelRenderer } from "react-excel-renderer";
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
import ExportExcel from "./ModalExportExcel";

import { Search, MoreHoriz } from "@material-ui/icons";
import useDebounce from "../../../hooks/useDebounce";

import AddModal from "./RawMaterial/AddModal";
import EditModal from "./RawMaterial/EditModal";
import ConfirmModal from "../../../components/ConfirmModal";
import { Delete } from "@material-ui/icons";

import ImportModal from './ImportModal'

const InventoryIngredientTab = ({
  allOutlets,
  allCategories,
  allUnits,
  refresh,
  handleRefresh
}) => {
  const [alert, setAlert] = React.useState("");
  const [filename, setFilename] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const [stateExport, setStateExportExcel] = React.useState(false);
  const [stateImport, setStateImport] = React.useState(false);

  const [dataExport, setDataExport] = React.useState([])

  const [multiSelect, setMultiSelect] = React.useState(false);
  const [clearRows, setClearRows] = React.useState(true);
  const [selectedData, setSelectedData] = React.useState([]);
  const [showConfirmBulk, setShowConfirmBulk] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const [filter, setFilter] = React.useState({
    time: "",
    category: "",
    status: "",
    outlet: ""
  });

  const [rawMaterial, setRawMaterial] = React.useState([]);

  const [currMaterial, setCurrMaterial] = React.useState({
    id: "",
    name: ""
  });
  const initialValueMaterial = {
    outlet_id: "",
    name: "",
    raw_material_category_id: "",
    stock: "",
    unit_id: "",
    price_per_unit: "",
    calorie_per_unit: "",
    calorie_unit: "",
    notes: "",
    is_sold: false
  };
  const initialValueMaterialEdit = {
    id: "",
    outlet_id: "",
    name: "",
    raw_material_category_id: "",
    stock: "",
    unit_id: "",
    calorie_per_unit: "",
    price_per_unit: "",
    calorie_unit: "",
    notes: "",
    stock_id: "",
    is_sold: false
  };

  const MaterialSchema = Yup.object().shape({
    outlet_id: Yup.number().required(`${t("pleaseChooseOutlet")}`),
    name: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputName")}`),
    raw_material_category_id: Yup.number().required(`${t("pleaseChooseCategory")}`),
    stock: Yup.number().required(`${t("pleaseInputStock")}`),
    unit_id: Yup.number().required(`${t("pleaseInputUnit")}`),
    price_per_unit: Yup.number().required(`${t("pleaseInputPricePerUnit")}`),
    // calorie_per_unit: Yup.number().required(`${t("pleaseInputCalorie")}`),
    // calorie_unit: Yup.string().required(`${t("pleaseInputCalorieUnit")}`),
    notes: Yup.string().min(1, `${t("minimum1Character")}`),
    is_sold: Yup.boolean()
  });

  const MaterialEditSchema = Yup.object().shape({
    outlet_id: Yup.number().required(`${t("pleaseChooseOutlet")}`),
    name: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputName")}`),
    raw_material_category_id: Yup.number().required(`${t("pleaseChooseCategory")}`),
    stock: Yup.number().required(`${t("pleaseInputStock")}`),
    unit_id: Yup.number().required(`${t("pleaseInputUnit")}`),
    price_per_unit: Yup.number().required(`${t("pleaseInputPricePerUnit")}`),
    notes: Yup.string().min(1, `${t("minimum1Character")}`),
    is_sold: Yup.boolean()
  });

  const formikMaterial = useFormik({
    initialValues: initialValueMaterial,
    validationSchema: MaterialSchema,
    onSubmit: async (values) => {
      const materialData = {
        outlet_id: values.outlet_id,
        name: values.name,
        raw_material_category_id: values.raw_material_category_id,
        stock: values.stock,
        unit_id: values.unit_id,
        price_per_unit: values.price_per_unit,
        calorie_per_unit: values.calorie_per_unit,
        calorie_unit: values.calorie_unit,
        notes: values.notes,
        is_sold: values.is_sold
      };

      try {
        // console.log('ini data materialnya', materialData)
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.post(`${API_URL}/api/v1/raw-material`, materialData);
        handleRefresh();
        disableLoading();
        closeAddModal();
      } catch (err) {
        disableLoading();
        setAlert(err.response?.data.message || err.message);
      }
    }
  });

  const validationMaterial = (fieldname) => {
    if (formikMaterial.touched[fieldname] && formikMaterial.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikMaterial.touched[fieldname] &&
      !formikMaterial.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const formikEditMaterial = useFormik({
    initialValues: initialValueMaterialEdit,
    validationSchema: MaterialEditSchema,
    onSubmit: async (values) => {
      const materialData = {
        outlet_id: values.outlet_id,
        name: values.name,
        raw_material_category_id: values.raw_material_category_id,
        stock: values.stock,
        unit_id: values.unit_id,
        price_per_unit: values.price_per_unit, 
        calorie_per_unit: values.calorie_per_unit,
        calorie_unit: values.calorie_unit,
        notes: values.notes,
        stock_id: values.stock_id,
        is_sold: values.is_sold
      };
      // console.log('data edit', materialData)
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/raw-material/${values.id}`,
          materialData
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

  const validationEditMaterial = (fieldname) => {
    if (
      formikEditMaterial.touched[fieldname] &&
      formikEditMaterial.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikEditMaterial.touched[fieldname] &&
      !formikEditMaterial.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const handleMode = () => {
    setSelectedData([]);
    setMultiSelect((state) => !state);
    setClearRows((state) => !state);
  };

  const handleSelected = (state) => {
    setSelectedData(state.selectedRows);
  };

  const getRawMaterial = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const result_filter = `?name=${search}&raw_material_category_id=${filter.category}&outlet_id=${filter.outlet}`;
    
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/raw-material${result_filter}`
      );
      console.log("get raw material", data.data)
      setRawMaterial(data.data);
    } catch (err) {
      setRawMaterial([]);
    }
  };

  React.useEffect(() => {
    getRawMaterial(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    setAlert("");
    formikMaterial.resetForm();
    setStateAddModal(false);
  };

  const showEditModal = (data) => {
    // console.log('data show edit modal', data)
    formikEditMaterial.setValues({
      id: data.id,
      outlet_id: data.outlet_id,
      name: data.name,
      raw_material_category_id: data.raw_material_category_id,
      stock: data.stock,
      unit_id: data.unit_id,
      // price_per_unit: data.stocks[0].price_per_unit,
      price_per_unit: data.price_per_unit,
      calorie_per_unit: data.calorie_per_unit,
      calorie_unit: data.calorie_unit,
      notes: data.notes,
      stock_id: data.stock_id,
      is_sold: data.is_sold
    });
    setStateEditModal(true);
  };
  const closeEditModal = () => {
    setAlert("");
    formikEditMaterial.resetForm();
    setStateEditModal(false);
  };
  const handleCloseExportExcel = () => {
    setDataExport([])
    setStateExportExcel(false)
  }
  const showDeleteModal = (data) => {
    setCurrMaterial({
      id: data.id,
      name: data.name
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setAlert("");
    setStateDeleteModal(false);
  };

  const handleDeleteMaterial = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/raw-material/${id}`);
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
      name: `${t("location")}`,
      selector: "location",
      sortable: true,
      wrap: true
    },
    {
      name: `${t("name")}`,
      selector: "name",
      sortable: true,
      wrap: true
    },
    {
      name: `${t("stock")}`,
      selector: "stock",
      sortable: true
    },
    {
      name: `${t("unit")}`,
      selector: "unit_name",
      sortable: true
    },
    {
      name: `${t("notes")}`,
      selector: "notes",
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

  const dataRawMaterial = rawMaterial.map((item, index) => {
    const stock_initial = item.Stocks.find((item) => item.is_initial);

    return {
      id: item.id,
      no: index + 1,
      outlet_id: item.outlet_id,
      location: item.Outlet?.name,
      name: item.name,
      raw_material_category_id: item.raw_material_category_id,
      // stock: item.stock,
      stock: item.stock < 0 ? 0 : item.stock,
      unit_id: item.unit_id,
      unit_name: item.Unit?.name || "-",
      calorie_per_unit: item.calorie_per_unit,
      calorie_unit: item.calorie_unit,
      notes: item.notes || "-",
      stock_id: stock_initial ? stock_initial.id : "",
      stocks: item.Stocks,
      is_sold: item.Product ? true : false,
      price_per_unit: item.price_per_unit
    };
  });

  // console.log("rawMaterial asli", rawMaterial)
  // console.log("dataRawMaterial sudah di looping", dataRawMaterial)

  const handleOptionsOutlet = () => {
    const uniqueArray = [];
    rawMaterial.map(value => {
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
  // console.log("handleOptionsOutlet", tempOptionOutlet)

  const optionsOutlet = tempOptionOutlet.map((item) => {
    return { value: item.id, label: item.name };
  });

  const handleExports = (data) => {
    if (data) {
      const result = []
      rawMaterial.map((value) => {
        data.map(value2 => {
          if (value.Outlet.name === value2.label) {
            result.push(value)
          }
        })
      })
      // console.log("data export", result)
      setDataExport(result)
    } else {
      setDataExport([])
    }
  }

  // console.log("optionsOutlet", optionsOutlet)
  const ExpandableComponent = ({ data }) => {
    const stockData = data.stocks.map((item) => {
      return {
        batch: item.Incoming_Stock
          ? item.Incoming_Stock.code
          : item.Transfer_Stock
          ? item.Transfer_Stock.code
          : "-",
        // stock: item.stock || 0,
        stock: item.stock < 0 ? 0 : item.stock,
        unit: item.Unit?.name || "-"
      };
    });

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              <Col style={{ fontWeight: "700" }}>{t("batch")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("stock")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("unit")}</Col>
            </Row>
          </ListGroup.Item>
          {stockData.length ? (
            stockData.map((val, index) => {
              return (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col>{val.batch}</Col>
                    <Col>{val.stock}</Col>
                    <Col>{val.unit}</Col>
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

  const handleBulkDelete = async (data) => {
    if (!data.length) {
      return handleMode();
    }
    const API_URL = process.env.REACT_APP_API_URL;
    const raw_material_id = data.map((item) => item.id);

    // console.log("handleBulkDelete", data)

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/raw-material/bulk-delete`, {
        data: { raw_material_id }
      });
      disableLoading();
      handleRefresh();
      closeConfirmBulkModal();
    } catch (err) {
      console.log(err);
    }
  };

  const initialValueImportRawMaterial = {
    outlets_id: [],
    items: [
      {
        name: "",
        category: "",
        stock: null,
        unit: "",
        price_per_unit: 0,
        calorie_per_unit: 0,
        calorie_unit: "",
        notes: "",
        sell_as_product: 0
      }
    ]
  }

  const formikImportRawMaterial = useFormik({
    initialValues: initialValueImportRawMaterial,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        if (!values.outlets_id.length) {
          throw new Error(`${t("pleaseChooseOutlet")}`);
        }
        enableLoading();
        await axios.post(`${API_URL}/api/v1/raw-material/bulk-create`, {
          outlets_id: values.outlets_id,
          items: values.items
        });
        disableLoading()
        handleRefresh()
        handleCloseImport()
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const handleFile = (file) => {
    setFilename(file[0].name);
    ExcelRenderer(file[0], (err, resp) => {
      if (err) {
        console.log("handleFile", err)
        setAlert(err);
      } else {
        const data = []
        const obj = {};
        const content = resp.rows.slice(4)
        const keys = [
          "name",
          "category",
          "stock",
          "unit",
          "price_per_unit",
          "calorie_per_unit",
          "calorie_unit",
          "notes",
          "sell_as_product"
        ]
        content.map((value) => {
          keys.map((value2, index) => {
            obj[value2] = value[index];
          })
          data.push({
            name: obj.name,
            category: obj.category,
            stock: obj.stock === "-" ? 0 : obj.stock,
            unit: obj.unit,
            price_per_unit: obj.price_per_unit,
            calorie_per_unit: obj.calorie_per_unit === "-" ? 0 : obj.calorie_per_unit,
            calorie_unit: obj.calorie_unit,
            notes: obj.notes,
            sell_as_product: obj.sell_as_product
          });
        })
        console.log("itemsnya ====>", data)
        formikImportRawMaterial.setFieldValue("items", data);
      }
    });
  };

  const handleOpenImport = () => setStateImport(true);
  const handleCloseImport = () => {
    setStateImport(false);
    setFilename("");
    formikImportRawMaterial.setFieldValue("outlets_id", []);
    formikImportRawMaterial.setFieldValue("items", []);
  };

  const paginationComponentOptions = {
    rowsPerPageText: t('rowsPerPage'),
    rangeSeparatorText: t('of'),
    selectAllRowsItem: true,
    selectAllRowsItemText: t('showAll'),
  };

  return (
    <>
      <AddModal
        t={t}
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title={t("addIngredients")}
        loading={loading}
        alert={alert}
        formikMaterial={formikMaterial}
        validationMaterial={validationMaterial}
        allOutlets={allOutlets}
        allCategories={allCategories}
        allUnits={allUnits}
      />

      <EditModal
        t={t}
        stateModal={stateEditModal}
        cancelModal={closeEditModal}
        title={t("editRawMaterial")}
        loading={loading}
        alert={alert}
        formikMaterial={formikEditMaterial}
        validationMaterial={validationEditMaterial}
        allOutlets={allOutlets}
        allCategories={allCategories}
        allUnits={allUnits}
      />

      <ConfirmModal
        title={`${t('delete')} ${selectedData.length} Selected Products`}
        body={t('areYouSureWantToDelete?')}
        buttonColor="danger"
        handleClick={() => handleBulkDelete(selectedData)}
        state={showConfirmBulk}
        closeModal={closeConfirmBulkModal}
        loading={loading}
      />

      <ConfirmModal
        t={t}
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`${t("deleteRawMaterial")} - ${currMaterial.name}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={() => handleDeleteMaterial(currMaterial.id)}
      />

      <ExportExcel 
        loading={loading}
        state={stateExport}
        optionsOutlet={optionsOutlet}
        closeModal={handleCloseExportExcel}
        handleExports={handleExports}
        dataExport={dataExport}
      />

      <ImportModal
        state={stateImport}
        loading={loading}
        alert={alert}
        closeModal={handleCloseImport}
        formikImportRawMaterial={formikImportRawMaterial}
        allOutlets={allOutlets}
        handleFile={handleFile}
        filename={filename}
        // subscriptionType={subscriptionType}
      />
      
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                {!selectedData.length ? (
                  <h3>{t("ingredients")}</h3>
                ) : (
                  <h3>{selectedData.length} {t("itemSelected")}</h3>
                )}
              </div>
              <div className="headerEnd" style={{ display: "flex" }}>
              {!multiSelect ? (
                <>
                  <Button style={{ marginRight: "0.5rem" }} variant="secondary" onClick={() => setStateExportExcel(true)}>
                  {t("export")}
                  </Button>
                  <Button style={{ marginRight: "0.5rem" }} variant="secondary" onClick={handleOpenImport}>
                  {t("import")}
                  </Button>
                  <div style={{ marginRight: "0.5rem" }}>
                    <Button variant="primary" onClick={showAddModal}>
                      {t("addIngredients")}
                    </Button>
                  </div>

                  <Dropdown>
                    <Dropdown.Toggle variant="light">{t("stock")}</Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Link
                        to={{
                          pathname: "/ingredient-inventory/incoming-stock"
                        }}
                      >
                        <Dropdown.Item as="button">{t("incomingStock")}</Dropdown.Item>
                      </Link>
                      <Link
                        to={{
                          pathname: "/ingredient-inventory/outcoming-stock"
                        }}
                      >
                        <Dropdown.Item as="button">{t("outcomingStock")}</Dropdown.Item>
                      </Link>
                      <Link
                        to={{
                          pathname: "/ingredient-inventory/transfer-stock"
                        }}
                      >
                        <Dropdown.Item as="button">{t("transferStock")}</Dropdown.Item>
                      </Link>
                      <Link
                        to={{
                          pathname: "/ingredient-inventory/stock-opname"
                        }}
                      >
                        <Dropdown.Item as="button">{t("stockOpname")}</Dropdown.Item>
                      </Link>
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* <Link to={{ pathname: "/inventory/stock-opname" }}>
                    <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                      Stock Opname
                    </Button>
                  </Link> */}
                </>
              ) : (
                <Button
                  variant="danger"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => showConfirmBulkModal(selectedData)}
                >
                  {t("delete")}
                </Button>
              )}
              {rawMaterial.length ? (
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

                <Col>
                    <Form.Group as={Row}>
                      <Form.Label
                        style={{ alignSelf: "center", marginBottom: "0" }}
                      >
                        {t("category")}
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="category"
                          value={filter.category}
                          onChange={handleFilter}
                        >
                          <option value="">{t("all")}</option>
                          {allCategories.map((item) => {
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
              paginationComponentOptions={paginationComponentOptions}
              columns={columns}
              data={dataRawMaterial}
              expandableRows
              expandableRowsComponent={ExpandableComponent}
              style={{ minHeight: "100%" }}
              selectableRows={multiSelect}
              onSelectedRowsChange={handleSelected}
              clearSelectedRows={clearRows}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default InventoryIngredientTab;
