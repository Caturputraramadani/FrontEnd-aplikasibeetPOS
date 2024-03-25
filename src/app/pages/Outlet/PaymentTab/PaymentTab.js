import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Form, Dropdown, InputGroup } from "react-bootstrap";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel
} from "@material-ui/core";
import DataTable from "react-data-table-component";

import { Paper } from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import ModalPayment from "./ModalPayment";
import ShowConfirmModal from "../../../components/ConfirmModal";
import useDebounce from "../../../hooks/useDebounce";

import "../../style.css";

export const PaymentTab = ({ 
  handleRefresh, 
  refresh, 
  showOptionEcommerce, 
  optionsEcommerce, 
  showFeature 
}) => {
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState("");
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const { t } = useTranslation();
  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [idMethod, setIdMethod] = React.useState(null);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [dataBusiness, setDataBusiness] = React.useState({})

  const [allPaymentMethods, setAllPaymentMethods] = React.useState([]);
  const [allTypes, setAllTypes] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState({
    type: "",
    status: ""
  });

  const allStatuses = [`${t("active")}`, `${t("inactive")}`];
  const debouncedSearch = useDebounce(search, 1000);

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      console.log("get outlets paymentTab", data.data);
      setAllOutlets(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectOutlet = (value, formik) => {
    if (value) {
      const outlet = value.map((item) => item.value);
      console.log("outletnya", outlet);
      formik.setFieldValue("outlet_id", outlet);
    } else {
      formik.setFieldValue("outlet_id", []);
    }
  };

  const getPaymentMethod = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterPayment = `?name=${search}&type=${filter.type}&status=${filter.status}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/payment-method${filterPayment}`
      );
      console.log(
        "${API_URL}/api/v1/payment-method${filterPayment}",
        data.data
      );
      setAllPaymentMethods(data.data);
    } catch (err) {
      setAllPaymentMethods([]);
    }
  };
  const refreshDelete = () => {
    console.log("refresh delete");
    setPhotoPreview("");
    setPhoto("");
  };
  const getPaymentMethodTypes = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/payment-method-type`);
      console.log("${API_URL}/api/v1/payment-method-type", data.data);
      setAllTypes(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // cz_user
  // cz_pin
  // cz_entity_id
  // cz_vendor_identifier

  const handleDataBusiness = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const user_info = JSON.parse(localStorage.getItem('user_info'))
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/business/${user_info.business_id}`)
      setDataBusiness(data.data)
      console.log("data business", data.data)
    } catch (error) {
      console.log("Error get business", error)
    }
  }

  React.useEffect(() => {
    handleDataBusiness()
  }, [])

  React.useEffect(() => {
    getPaymentMethod(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);

  React.useEffect(() => {
    getPaymentMethodTypes();
    getOutlets();
  }, [refresh]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const initialValuePaymentCreate = {
    name: "",
    payment_method_type_id: "",
    ecommerce_name: "",
    mdr: 0,
    status: "active",
    outlet_id: [],
    cz_type_qris: false,
    cz_type_manual: true,
    cz_type_debit: false,
    cz_type_credit_reader: false,
    online_payment: false
  };

  const PaymentSchemaCreate = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAName")}`),
    payment_method_type_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseInputAPaymentMethodType")}`),
    mdr: Yup.number()
      // .integer()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`)
      // .required(`${t("pleaseInputAMdr")}`)
      ,
    status: Yup.string()
      .matches(/(active|inactive)/)
      .required(`${t("pleaseInputAStatus")}`),
    outlet_id: Yup.array().of(Yup.number().min(1))
  });

  const formikPayment = useFormik({
    enableReinitialize: true,
    initialValues: initialValuePaymentCreate,
    validationSchema: PaymentSchemaCreate,
    onSubmit: async (values) => {
      console.log("values tambah", values);
      const paymentMethodData = new FormData();
      paymentMethodData.append("name", values.name);
      paymentMethodData.append(
        "payment_method_type_id",
        values.payment_method_type_id
      );
      paymentMethodData.append("mdr", values.mdr);
      paymentMethodData.append("status", values.status);
      paymentMethodData.append("ecommerce_name", values.ecommerce_name);
      paymentMethodData.append("online_payment", values.online_payment);
      paymentMethodData.append("outlet_id", JSON.stringify(values.outlet_id));
      if (photo) paymentMethodData.append("qrImage", photo);
      let cz_allow = 0
      let cz_type = ''
      if(values.cz_type_qris || values.cz_type_credit_reader || values.cz_type_debit) {
        cz_allow = 1
      } 
      if (values.cz_type_qris) {
        cz_type = 'qr'
      } 
      if(values.cz_type_debit) {
        cz_type = 'debit'
      }
      if(values.cz_type_credit_reader) {
        cz_type = 'creditreader'
      }

      paymentMethodData.append("cz_allow", cz_allow);
      paymentMethodData.append("cz_type", cz_type);

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(
          // `${API_URL}/api/v1/payment-method/create-development`,
          // paymentMethodData
          `${API_URL}/api/v1/payment-method/`,
          paymentMethodData
        );
        handleRefresh();
        disableLoading();
        cancelAddModalPayment();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const initialValuePaymentEdit = {
    name: "",
    payment_method_type_id: "",
    ecommerce_name: "",
    mdr: "",
    status: "active",
    cz_type_qris: false,
    cz_type_manual: true,
    cz_type_debit: false,
    cz_type_credit_reader: false,
    online_payment: false
  };

  const PaymentSchemaEdit = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAName")}`),
    payment_method_type_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseInputAPaymentMethodType")}`),
    mdr: Yup.number()
      // .integer()
      .min(0)
      .required(`${t("pleaseInputAMdr")}`),
    status: Yup.string()
      .matches(/(active|inactive)/)
      .required(`${t("pleaseInputAStatus")}`)
  });

  const formikPaymentEdit = useFormik({
    enableReinitialize: true,
    initialValues: initialValuePaymentEdit,
    validationSchema: PaymentSchemaEdit,
    onSubmit: async (values) => {
      const paymentMethodData = new FormData();
      paymentMethodData.append("name", values.name);
      paymentMethodData.append(
        "payment_method_type_id",
        values.payment_method_type_id
      );
      paymentMethodData.append(
        "ecommerce_name",
        values.ecommerce_name
      );
      paymentMethodData.append("mdr", values.mdr);
      paymentMethodData.append("online_payment", values.online_payment);
      paymentMethodData.append("status", values.status);
      paymentMethodData.append("outlet_id", values.outlet_id);
      if (photo) paymentMethodData.append("qrImage", photo);

      let cz_allow = 0
      let cz_type = ''
      if(values.cz_type_qris || values.cz_type_credit_reader || values.cz_type_debit) {
        cz_allow = 1
      } 
      if (values.cz_type_qris) {
        cz_type = 'qr'
      } 
      if(values.cz_type_debit) {
        cz_type = 'debit'
      }
      if(values.cz_type_credit_reader) {
        cz_type = 'creditreader'
      }

      paymentMethodData.append("cz_allow", cz_allow);
      paymentMethodData.append("cz_type", cz_type);

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        //`${API_URL}/api/v1/payment-method/update-development/${values.id}`
        await axios.put(
          `${API_URL}/api/v1/payment-method/${values.id}`,
          paymentMethodData
        );
        handleRefresh();
        disableLoading();
        cancelEditModalPayment();
      } catch (err) {
        disableLoading();
      }
    }
  });

  const validationPayment = (fieldname) => {
    if (formikPayment.touched[fieldname] && formikPayment.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikPayment.touched[fieldname] && !formikPayment.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const validationPaymentEdit = (fieldname) => {
    if (
      formikPaymentEdit.touched[fieldname] &&
      formikPaymentEdit.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikPaymentEdit.touched[fieldname] &&
      !formikPaymentEdit.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const showAddModalPayment = (data) => {
    setStateAddModal(true);
    setState("Create");
  };
  const cancelAddModalPayment = () => {
    formikPayment.resetForm();
    setPhoto("");
    setPhotoPreview("");
    setStateAddModal(false);
    setState("");
  };

  const showEditModalPayment = (data) => {
    console.log("data yang mau di edit", data);
    setState("Edit");
    
    let cz_type_qris,
    cz_type_manual,
    cz_type_debit,
    cz_type_credit_reader,
    online_payment

    // if(data.cz_allow)
    let cz_allow = 0
    if(data.cz_type === 'creditreader') {
      cz_type_credit_reader = true
      cz_allow = true
    } else if(data.cz_type === 'qr') {
      cz_type_qris = true
      cz_allow = true
    } else if(data.cz_type === 'debit') {
      cz_type_debit = true
      cz_allow = true
    } else {
      cz_allow = false
      cz_type_manual = true
    }

    formikPaymentEdit.setValues({
      id: data.id,
      name: data.name,
      payment_method_type_id: data.type_id,
      // mdr: parseInt(data.mdr.slice(0, -1)),
      ecommerce_name: data.ecommerce,
      mdr: parseFloat(data.mdr),
      status: data.status,
      outlet_id: data.outlet_id,
      cz_type_qris,
      cz_type_manual,
      cz_type_debit,
      cz_type_credit_reader,
      online_payment: data.online_payment
    });

    if (data.qr_image) {
      const API_URL = process.env.REACT_APP_API_URL;
      setIdMethod(data.id);
      setPhoto(`${API_URL}${data.qr_image}`);
      setPhotoPreview(`${API_URL}${data.qr_image}`);
    }

    setStateEditModal(true);
  };
  const cancelEditModalPayment = () => {
    formikPaymentEdit.resetForm();
    setPhoto("");
    setPhotoPreview("");
    setStateEditModal(false);
    setState("");
  };
  const showDeleteModalPayment = (data) => {
    formikPayment.setFieldValue("id", data.id);
    formikPayment.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const cancelDeleteModalPayment = () => {
    formikPayment.resetForm();
    setStateDeleteModal(false);
  };

  const handleDeletePayment = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const payment_id = formikPayment.getFieldProps("id").value;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/payment-method/${payment_id}`);
      handleRefresh();
      disableLoading();
      cancelDeleteModalPayment();
    } catch (err) {
      disableLoading();
    }
  };

  const handleChangeStatus = async (id) => {
    let currentStatus;
    const API_URL = process.env.REACT_APP_API_URL;

    allPaymentMethods.forEach((item) => {
      if (item.id === id) {
        if (item.status === "active") {
          currentStatus = "inactive";
        } else {
          currentStatus = "active";
        }
      }
    });

    try {
      await axios.patch(`${API_URL}/api/v1/payment-method/status/${id}`, {
        status: currentStatus
      });
      handleRefresh();
    } catch (err) {
      console.log(err);
    }
  };

  const handlePreviewPhoto = (file) => {
    setAlertPhoto("");

    let preview;
    let img;

    if (file.length) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          console.log("reader.result", reader.result);
          setPhotoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file[0]);
      img = file[0];
      console.log("img", img);
      setPhoto(img);
    } else {
      preview = "";
      setAlertPhoto("file is too large or not supported");
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
      name: `${t("outlet")}`,
      selector: "outlet",
      sortable: true
    },
    {
      name: `${t("mdr")}`,
      selector: "mdr",
      sortable: true,
      omit: showFeature.mdr ? false : true
    },
    {
      name: `${t("status")}`,
      cell: (rows) => {
        return (
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value={rows.status}
                control={
                  <Switch
                    color="primary"
                    checked={rows.status === "active" ? true : false}
                    onChange={() => handleChangeStatus(rows.id)}
                    name=""
                  />
                }
              />
            </FormGroup>
          </FormControl>
        );
      }
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
                onClick={() => showEditModalPayment(rows)}
              >
                {t("edit")}
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => showDeleteModalPayment(rows)}
              >
                {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataPayments = () => {
    return allPaymentMethods.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        type: item.Payment_Method_Type.name,
        type_id: item.payment_method_type_id,
        ecommerce: item.ecommerce,
        mdr: item.mdr + "%",
        outlet: item.Outlet ? item.Outlet.name : t('allOutlets'),
        qr_image: item.qr_image,
        status: item.status,
        outlet_id: item.outlet_id,
        cz_allow: item.cz_allow,
        cz_type: item.cz_type,
        online_payment: item.online_payment
      };
    });
  };

  console.log("allPaymentMethods", allPaymentMethods);

  return (
    <Row>
      <ModalPayment
        t={t}
        state={state}
        stateModal={stateAddModal}
        cancelModal={cancelAddModalPayment}
        title={t("addNewPaymentMethod")}
        allOutlets={allOutlets}
        handleSelectOutlet={handleSelectOutlet}
        loading={loading}
        formikPayment={formikPayment}
        validationPayment={validationPayment}
        allTypes={allTypes}
        handlePreviewPhoto={handlePreviewPhoto}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        showOptionEcommerce={showOptionEcommerce}
        optionsEcommerce={optionsEcommerce}
        showFeature={showFeature}
        dataBusiness={dataBusiness}
      />

      <ModalPayment
        t={t}
        state={state}
        stateModal={stateEditModal}
        cancelModal={cancelEditModalPayment}
        title={`${t("editPaymentMethod")} - ${
          formikPaymentEdit.getFieldProps("name").value
        }`}
        refreshDelete={refreshDelete}
        allOutlets={allOutlets}
        handleSelectOutlet={handleSelectOutlet}
        idMethod={idMethod}
        loading={loading}
        formikPayment={formikPaymentEdit}
        validationPayment={validationPaymentEdit}
        allTypes={allTypes}
        handlePreviewPhoto={handlePreviewPhoto}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        showOptionEcommerce={showOptionEcommerce}
        optionsEcommerce={optionsEcommerce}
        showFeature={showFeature}
        dataBusiness={dataBusiness}
      />

      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={cancelDeleteModalPayment}
        title={`${t("deletePaymentMethod")} - ${
          formikPayment.getFieldProps("name").value
        }`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeletePayment}
      />

      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              <h3>{t("paymentMethod")}</h3>
            </div>
            <div className="headerEnd">
              <Button
                variant="primary"
                style={{ marginLeft: "0.5rem" }}
                onClick={showAddModalPayment}
              >
                {t("addNewPaymentMethod")}
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
                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label
                        style={{ alignSelf: "center", marginBottom: "0" }}
                      >
                        {t("status")}:
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="status"
                          value={filter.status}
                          onChange={handleFilter}
                        >
                          <option value="">{t("all")}</option>
                          {allStatuses.map((item, index) => {
                            return (
                              <option key={index} value={item.toLowerCase()}>
                                {item}
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
            data={dataPayments()}
            style={{ minHeight: "100%" }}
            noDataComponent={t('thereAreNoRecordsToDisplay')}
          />
        </Paper>
      </Col>
    </Row>
  );
};
