import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Form, Dropdown, InputGroup } from "react-bootstrap";


import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import ModalTable from "./ModalTable";
import ModalFloor from "./ModalFloors";
import ModalTemplate from './ModalTemplate'
import ShowConfirmModal from "../../../components/ConfirmModal";
import useDebounce from "../../../hooks/useDebounce";

import "../../style.css";

export const TableManagementTab = ({ handleRefresh, refresh }) => {
  const [allDataTemplate, setAllDataTemplate] = React.useState({})
  const [stateModalQr, setStateModalQr] = React.useState(false)
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const { t } = useTranslation();
  const [allTables, setAllTables] = React.useState([]);
  const [allFloors, setAllFloors] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [editDataTable, setEditDataTable] = React.useState({})

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const getTables = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterTable = search ? `?name=${search}` : "";

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/table-management${filterTable}`
      );
      setAllTables(data.data);
    } catch (err) {
      setAllTables([]);
    }
  };

  const getFloors = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterFloor = search ? `?name=${search}` : "";

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/floor-management${filterFloor}`
      );
      setAllTables(data.data);
    } catch (err) {
      setAllTables([]);
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

  React.useEffect(() => {
    getTables(debouncedSearch);
  }, [refresh, debouncedSearch]);

  React.useEffect(() => {
    getOutlets();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);

  const topFunction = async () => {
    const scrollToTopBtn = document.getElementById("kt_scrolltop");
    if (scrollToTopBtn) {
      scrollToTopBtn.click();
    }
  };

  const sosmed = [
    {
      id: 1,
      short: "FB",
      label: "Facebook"
    },
    {
      id: 2,
      short: "IG",
      label: "Instagram"
    },
    {
      id: 3,
      short: "TikTok",
      label: "TikTok"
    },
    {
      id: 4,
      short: "Twitter",
      label: "Twitter"
    }
  ]

  
  const initialValueTemplate = {
    sosmed: [],
    name_sosmed: "",
    whatsapp: "",
    business_id: ""
  };

  const TemplateSchema = Yup.object().shape({
    name_sosmed: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character ")}`),
    whatsapp: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character ")}`)
  });

  const formikTemplate = useFormik({
    enableReinitialize: true,
    initialValues: initialValueTemplate,
    validationSchema: TemplateSchema,
    onSubmit: async (values) => {
      console.log("formikTemplate", values)
      const sendData = {
        business_id: values.business_id,
        sosmed: JSON.stringify(values.sosmed),
        name_sosmed: values.name_sosmed,
        whatsapp: values.whatsapp
      };

      console.log('data yang akan dikirim', sendData)
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/template-qrcode`, sendData);
        handleRefresh();
        disableLoading();
        cancelAddModalTable();
      } catch (err) {
        disableLoading();
      }
    }
  });


  const validationTemplate = (fieldname) => {
    if (formikTemplate.touched[fieldname] && formikTemplate.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikTemplate.touched[fieldname] && !formikTemplate.errors[fieldname]) {
      return "is-valid";
    }
    return "";
  };

  const getBusiness = async () => {
    try {
      const user_info = JSON.parse(localStorage.getItem('user_info'))
      const API_URL = process.env.REACT_APP_API_URL;
      const { data } = await axios.get(`${API_URL}/api/v1/business/${user_info.business_id}`)
      formikTemplate.setFieldValue("business_id", user_info.business_id)
      formikTemplate.setFieldValue("whatsapp", data.data.phone_number)
      console.log("data business", data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getTemplateQrcode = async () => {
    try {
      const user_info = JSON.parse(localStorage.getItem('user_info'))
      const API_URL = process.env.REACT_APP_API_URL;
      const { data } = await axios.get(`${API_URL}/api/v1/template-qrcode?business_id=${user_info.business_id}`)
      console.log("getTemplateQrcode ada", data.data)
      const resultSosmed = sosmed.map(value => {
        data.data.sosmed.filter(value2 => {
          return value.short === value2
        })
      })
      console.log("resultSosmed", resultSosmed)
      setAllDataTemplate({
        sosmed: data.data.sosmed,
        name_sosmed: data.data.name_sosmed,
        whatsapp: data.data.whatsapp
      })
      formikTemplate.setFieldValue("sosmed", JSON.parse(data.data.sosmed))
      formikTemplate.setFieldValue("name_sosmed", data.data.name_sosmed)
      formikTemplate.setFieldValue("whatsapp", data.data.whatsapp)
    } catch (error) {
      console.log("getTemplateQrcode tidak ada")
      console.log(error)
    }
  }

  React.useEffect(() => {
    getBusiness()
    getTemplateQrcode()
  }, [])

  const initialValueTable = {
    id: "",
    business_id: "",
    outlet_id: "",
    name: "",
    capacity: "",
    status: "available"
  };

  const initialValueFloor = {
    id: "",
    business_id: "",
    outlet_id: "",
    floor_name: "",
    floor_order: "",
  }

  const TableSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseInputAnOutlet")}`),
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character ")}`)
      .required(`${t("pleaseInputAName")}`),
    capacity: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseInputACapacity")}`),
    status: Yup.string()
      .matches(/(available)/)
      .required(`${t("pleaseInputAStatus ")}`)
  });

  const formikTable = useFormik({
    enableReinitialize: true,
    initialValues: initialValueTable,
    validationSchema: TableSchema,
    onSubmit: async (values) => {
      const tableData = {
        outlet_id: values.outlet_id,
        name: values.name,
        capacity: values.capacity,
        status: values.status
      };

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/table-management`, tableData);
        handleRefresh();
        disableLoading();
        cancelAddModalTable();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const formikTableEdit = useFormik({
    enableReinitialize: true,
    initialValues: initialValueTable,
    validationSchema: TableSchema,
    onSubmit: async (values) => {
      const tableData = {
        outlet_id: values.outlet_id,
        name: values.name,
        capacity: values.capacity,
        status: values.status
      };

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/table-management/${values.id}`,
          tableData
        );
        handleRefresh();
        disableLoading();
        cancelEditModalTable();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const validationTable = (fieldname) => {
    if (formikTable.touched[fieldname] && formikTable.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikTable.touched[fieldname] && !formikTable.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const validationTableEdit = (fieldname) => {
    if (
      formikTableEdit.touched[fieldname] &&
      formikTableEdit.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikTableEdit.touched[fieldname] &&
      !formikTableEdit.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const showAddModalTable = () => setStateAddModal(true);

  const showEditModalQr = () => setStateModalQr(true)
  const cancelModalQr = () => setStateModalQr(false)

  const cancelAddModalTable = () => {
    formikTable.resetForm();
    setStateAddModal(false);
  };

  const showEditModalTable = (data) => {
    topFunction();
    setEditDataTable(data)
    formikTableEdit.setValues({
      id: data.id,
      outlet_id: data.outlet_id,
      name: data.name,
      business_id: data.business_id,
      capacity: data.capacity,
      status: data.status
    });
    setStateEditModal(true);
  };
  const cancelEditModalTable = () => {
    formikTableEdit.resetForm();
    setStateEditModal(false);
  };
  const showDeleteModalTable = (data) => {
    formikTable.setFieldValue("id", data.id);
    formikTable.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const cancelDeleteModalTable = () => {
    formikTable.resetForm();
    setStateDeleteModal(false);
  };

  const handleDeleteTable = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const payment_id = formikTable.getFieldProps("id").value;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/table-management/${payment_id}`);
      handleRefresh();
      disableLoading();
      cancelDeleteModalTable();
    } catch (err) {
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
      name: `${t("outletName")}`,
      selector: "outlet_name",
      sortable: true
    },
    {
      name: `${t("name")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("capacity")}`,
      selector: "capacity",
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
              <Dropdown.Item
                as="button"
                onClick={() => showEditModalTable(rows)}
              >
                {t("edit")}
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => showDeleteModalTable(rows)}
              >
                {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataTables = (data) => {
    if(!data.length){
      return;
    }

    return data.map((item, index) => {
      return {
        id: item.id,
        business_id: item.business_id,
        outlet_id: item.outlet_id,
        no: index + 1,
        name: item.name,
        outlet_name: item.Outlet?.name,
        capacity: item.capacity,
        status: item.status,
        outlet_phone_number: item.Outlet?.phone_number,
        outlet_sosmed: item.Outlet.sosmed ? JSON.parse(item.Outlet.sosmed) : [],
        outlet_sosmed_name: item.Outlet?.sosmed_name
      };
    });
  };

  const paginationComponentOptions = {
    rowsPerPageText: t('rowsPerPage'),
    rangeSeparatorText: t('of'),
    selectAllRowsItem: true,
    selectAllRowsItemText: t('showAll'),
  };

  return (
    <Row>
      <ModalTable
        t={t}
        stateModal={stateAddModal}
        cancelModal={cancelAddModalTable}
        title={t("addNewTable")}
        loading={loading}
        formikTable={formikTable}
        validationTable={validationTable}
        allOutlets={allOutlets}
        editDataTable={editDataTable}
        sosmed={sosmed}
      />

      <ModalTable
        t={t}
        stateModal={stateEditModal}
        cancelModal={cancelEditModalTable}
        title={`${t("editTable")} - ${formikTableEdit.getFieldProps("name").value}`}
        loading={loading}
        formikTable={formikTableEdit}
        validationTable={validationTableEdit}
        allOutlets={allOutlets}
        editDataTable={editDataTable}
        sosmed={sosmed}
      />

      <ModalTemplate
        t={t}
        stateModal={stateModalQr}
        cancelModal={cancelModalQr}
        loading={loading}
        sosmed={sosmed}
        formikTemplate={formikTemplate}
        validationTemplate={validationTemplate}
      />

      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={cancelDeleteModalTable}
        title={`${t("deleteTable")} - ${formikTable.getFieldProps("name").value}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeleteTable}
      />

      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>{t("tableManagement")}</h3>
            </div>
            <div className="headerEnd">
              {/* <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={showEditModalQr}
              >
                {t("settingTemplateQr")}
              </Button> */}
              <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={showAddModalTable}
              >
                {t("addNewTable")}
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
            paginationComponentOptions={paginationComponentOptions}
            responsive
            columns={columns}
            data={dataTables(allTables)}
            style={{ minHeight: "100%" }}
            noDataComponent={t('thereAreNoRecordsToDisplay')}
          />
        </Paper>
      </Col>
    </Row>
  );
};
