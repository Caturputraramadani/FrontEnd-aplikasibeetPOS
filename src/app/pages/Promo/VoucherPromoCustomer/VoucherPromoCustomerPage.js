import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import imageCompression from 'browser-image-compression';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Dropdown } from "react-bootstrap";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper
} from "@material-ui/core";
import DataTable from "react-data-table-component";
import { MoreHoriz } from "@material-ui/icons";
import NumberFormat from 'react-number-format'

import VoucherPromoCustomerModal from "./VoucherPromoCustomerModal";
import VoucherPromoCustomerModalEdit from "./VoucherPromoCustomerModalEdit";
import ShowConfirmModal from "../../../components/ConfirmModal";
import ConfirmModalDelete from "../../../components/ConfirmModalDelete";

import "../../style.css";

export const VoucherPromoCustomerPage = () => {
  const [checkLimitDiscount, setCheckLimitDiscount] = React.useState(false)

  const [validateDiscountLimit, setValidateDiscountLimit] = React.useState('')
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [refresh, setRefresh] = React.useState(0);
  const { t } = useTranslation();

  const [warning, setWarning] = React.useState("")
  const [body, setBody] = React.useState("")
  const [second, setSecond] = React.useState(0);

  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [errorDate, setErrorDate] = React.useState(false)

  const [voucherPromos, setVoucherPromos] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);

  const initialValuePromo = {
    business_id: "", 
    outlet_id: "", 
    name: "",  
    description: "",  
    discount_type: "",  
    discount_amount: "",
    expiration_date: "", 
    status: "available", 
    acquisition_type: "", 
    acquisition_cost: "",
    used_amount: 0, 
    limit_usage: "", 
    discount_limit: "",
    limit_claim: 0,
    daily_claim: null,
    obtained_amount: 1
  }

  const [currency, setCurrency] = React.useState("")
  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

    // console.log("currency nya brpw", data.data.Currency.name)
    
    setCurrency(data.data.Currency.name)
  }
  React.useEffect(() => {
    handleCurrency()
  }, [])

  const PromoSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseOutlet")}`),
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAName")}`),
    description: Yup.string().min(1, `${t("minimum1Character")}`),
    discount_type: Yup.string()
      .required(`${t("pleaseInputDiscountType")}`),
    discount_amount: Yup.number()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`)
      .required(`${t("pleaseInputValue")}`),
    acquisition_type: Yup.string()
      .required(`${t("pleaseInputAcquisitionType")}`),
    acquisition_cost: Yup.number()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`),
    limit_usage: Yup.number()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`),
    discount_limit: Yup.number()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`),
    limit_claim: Yup.number()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`),
    daily_claim: Yup.number()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`),
    obtained_amount: Yup.number()
      .min(1, `${t('valueMustBeGreaterThanOrEqualTo1')}`),
  });

  const PromoSchemaEdit = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseOutlet")}`),
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAName")}`),
    description: Yup.string().min(1, `${t("minimum1Character")}`),
    discount_amount: Yup.number()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`)
      .required(`${t("pleaseInputValue")}`),
    acquisition_cost: Yup.number()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`),
    limit_usage: Yup.number()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`),
    // discount_limit: Yup.number()
    //   .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`),
    limit_claim: Yup.number()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`),
    daily_claim: Yup.number()
      .min(0, `${t('valueMustBeGreaterThanOrEqualTo0')}`),
    obtained_amount: Yup.number()
      .min(1, `${t('valueMustBeGreaterThanOrEqualTo1')}`),
  });

  const EditPromoSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseOutlet")}`),
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAName")}`),
    code: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputACode")}`),
    quota: Yup.number()
      .min(1, `${t("minimum1Quota")}`)
      .required(`${t("pleaseInputQuota")}`),
    description_type: Yup.string()
      .matches(/regulation|how_to_use/)
      .required(`${t("pleaseChooseType")}`),
    description: Yup.string().min(1, `${t("minimum1Character")}`),
    type: Yup.string()
      .matches(/percentage|currency/)
      .required(`${t("pleaseChooseType")}`),
    value: Yup.number()
      .min(0)
      .required(`${t("pleaseInputValue")}`)
  });

  const formikPromo = useFormik({
    enableReinitialize: true,
    initialValues: initialValuePromo,
    validationSchema: PromoSchema,
    onSubmit: async (values, {resetForm}) => {
      const user_info = JSON.parse(localStorage.getItem('user_info'))

      let formatExpiredDate = dayjs(startDate).format('YYYY-MM-DD HH:mm')
      const dataFormat = formatExpiredDate.split(' ')[0]
      const resultExpiredDate = `${dataFormat} 23:59`

      const data = {
        business_id: user_info.business_id,
        outlet_id: values.outlet_id,
        acquisition_type: values.acquisition_type,
        acquisition_cost: values.acquisition_cost,
        description: values.description,
        discount_amount: values.discount_amount,
        discount_limit: values.discount_limit,
        discount_type: values.discount_type,
        expiration_date: resultExpiredDate,
        limit_usage: values.limit_usage,
        name: values.name,
        status: values.status,
        used_amount: values.used_amount,
        limit_claim: values.limit_claim,   
        daily_claim: values.daily_claim,
        obtained_amount: values.obtained_amount
      }
      const API_URL = process.env.REACT_APP_API_URL;
      console.log("data =====>", data)
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/customer-voucher-list`, data);
        resetForm()
        handleRefresh();
        setValidateDiscountLimit()
        disableLoading();
        closeAddModal();
      } catch (err) {
        disableLoading();
        setAlert(err.response?.data.message || err.message);
      }
    }
  });

  const validationPromo = (fieldname) => {
    if (formikPromo.touched[fieldname] && formikPromo.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikPromo.touched[fieldname] && !formikPromo.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formikEditPromo = useFormik({
    enableReinitialize: true,
    initialValues: initialValuePromo,
    validationSchema: PromoSchemaEdit,
    onSubmit: async (values) => {

      console.log("data yang akan di sep", values)

      if(values.discount_limit && values.discount_limit < 0) {
        console.log("validateDiscountLimit", validateDiscountLimit)
        setValidateDiscountLimit('error')
        return 
      }
      let result_acquisition_cost = values.acquisition_cost
      // if(values.acquisition_type !== 'currency' && values.acquisition_type !== 'point' ) {
      //   result_acquisition_cost = "0"
      // } else {
      //   result_acquisition_cost = values.acquisition_cost
      // }

      const data = {
        business_id: values.business_id,
        outlet_id: values.outlet_id,
        name: values.name, 
        description: values.description, 
        discount_type: values.discount_type, 
        discount_amount: values.discount_amount,
        expiration_date: startDate,
        status: values.status,
        acquisition_type: values.acquisition_type,
        acquisition_cost: result_acquisition_cost,
        used_amount: values.used_amount,
        discount_limit: values.discount_limit,
        limit_usage: values.limit_usage,
        limit_claim: values.limit_claim,
        obtained_amount: values.obtained_amount,
        daily_claim: values.daily_claim
      }

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.patch(
          `${API_URL}/api/v1/customer-voucher-list/${values.id}`,
          data
        );
        handleRefresh();
        setValidateDiscountLimit()
        disableLoading();
        closeEditModal();
      } catch (err) {
        disableLoading();
        setAlert(err.response?.data.message || err.message);
      }
    }
  });

  const validationEditPromo = (fieldname) => {
    if (
      formikEditPromo.touched[fieldname] &&
      formikEditPromo.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikEditPromo.touched[fieldname] &&
      !formikEditPromo.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getVoucherPromos = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const user_info = JSON.parse(localStorage.getItem('user_info'))
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/customer-voucher-list?business_id=${user_info.business_id}`);
      setVoucherPromos(data.data);
    } catch (err) {
      setVoucherPromos([]);
    }
  };

  const getOutlets = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  React.useEffect(() => {
    getVoucherPromos();
  }, [refresh]);

  React.useEffect(() => {
    getOutlets();
  }, []);

  const handleChangeStatus = async (id) => {
    let currentStatus;

    const edited = voucherPromos.map((item) => {
      if (item.id === id) {
        if (item.status === "active") {
          item.status = "inactive";
          currentStatus = "inactive";
        } else {
          item.status = "active";
          currentStatus = "active";
        }
      }

      return item;
    });

    const API_URL = process.env.REACT_APP_API_URL;
    try {
      await axios.patch(`${API_URL}/api/v1/voucher-promo/${id}`, {
        status: currentStatus
      });
    } catch (err) {
      console.log(err);
    }

    setVoucherPromos(edited);
  };

  const handleRefresh = () => setRefresh((state) => state + 1);

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    setPhoto("");
    setPhotoPreview("");
    setStateAddModal(false);
    setCheckLimitDiscount(false)
  };

  const showEditModal = (data) => {
    const API_URL = process.env.REACT_APP_API_URL;
    console.log("showEditModal", data)

    if(data.discount_amount) {
      setCheckLimitDiscount(true)
    }

    formikEditPromo.setValues({
      id: data.id,
      business_id: data.business_id,
      outlet_id: data.outlet_id,
      acquisition_type: data.acquisition_type,
      acquisition_cost: data.acquisition_cost,
      description: data.description,
      discount_amount: data.discount_amount,
      discount_limit: data.discount_limit,
      discount_type: data.discount_type,
      limit_usage: data.limit_usage || 0,
      name: data.name,
      status: data.status,
      used_amount: data.used_amount,
      limit_claim: data.limit_claim || 0,
      obtained_amount: data.obtained_amount,
      daily_claim: data.daily_claim
    });
    if (data.image) {
      setPhoto(`${API_URL}${data.image}`);
      setPhotoPreview(`${API_URL}${data.image}`);
    }
    if (data.expiration_date) {
      setStartDate(new Date(data.expiration_date));
    }
    setStateEditModal(true);
  };

  const handleDate = (date, state) => {
    if(state === 'start') {
      const formatStartDate = dayjs(date).format('YYYY-MM-DD')
      const formatEndDate = dayjs(endDate).format('YYYY-MM-DD')
      const startDateDiff = dayjs(formatStartDate)
      const resultCompare = startDateDiff.diff(formatEndDate, 'day')

      if(resultCompare > 0) {
        setErrorDate(true)
        console.log("silahkan masuk")
      } else {
        setErrorDate(false)
      }
      console.log("Params Date", date)
      console.log("Params State", state)
      setStartDate(date)
    } else {
      const formatStartDate = dayjs(startDate).format('YYYY-MM-DD')
      const formatEndDate = dayjs(date).format('YYYY-MM-DD')
      const endDateDiff = dayjs(formatEndDate)
      const resultCompare = endDateDiff.diff(formatStartDate, 'day')
      if(resultCompare >= 0) {
        setErrorDate(false)
      } else {
        setErrorDate(true)
      }
      setEndDate(date)
    }
  } 

  const closeEditModal = () => {
    formikEditPromo.resetForm();
    setPhoto("");
    setPhotoPreview("");
    setStateEditModal(false);
    setCheckLimitDiscount(false)
  };

  const handleCheckVoucher = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/customer-voucher-list/check-used/${id}`)
      console.log("response check voucher", data.data)
      if(data.data.message === "Voucher already in use") {
        setWarning("voucherAlreadyInUse")
        setBody("areYouSureWantToDelete?")
        setSecond(10)
      } else {
        setBody("areYouSureWantToDelete?")
      }
    } catch (error) {
      console.log("error check voucher", error)
    }
  }

  React.useEffect(() => {
    let timer;
    if (second > 0) {
      timer = setTimeout(function() {
        setSecond((now) => now - 1);
      }, 1000);
    } else {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  });

  const showDeleteModal = async (data) => {
    console.log("handle open modal delete voucher", data)
    await handleCheckVoucher(data.id)
    formikPromo.setFieldValue("id", data.id);
    formikPromo.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setStateDeleteModal(false)
    setSecond(0)
    setWarning('')
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handlePreviewPhoto = (file) => {
    setAlertPhoto("");

    let preview;
    let img;

    if (file.length) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          setPhotoPreview(reader.result);
        }
      }
      reader.readAsDataURL(file[0])
      img = file[0];
      setPhoto(img)
    } else {
      preview = "";
      setAlertPhoto("file is too large or not supported");
    }
  };

  const handleDeletePromo = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const promo_id = formikPromo.getFieldProps("id").value;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/customer-voucher-list/${promo_id}`);
      closeDeleteModal();
      handleRefresh();
      setValidateDiscountLimit()
      disableLoading();
    } catch (err) {
      disableLoading();
    }
  };

  const formatDate = (date) => dayjs(date).format("DD/MM/YYYY HH:mm");

  const dataPromo = () => {
    return voucherPromos.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        outlet_name: item.Outlet?.name,
        business_id: item.business_id,
        outlet_id: item.outlet_id,
        acquisition_type: item.acquisition_type,
        acquisition_cost: item.acquisition_cost,
        description: item.description,
        discount_amount: item.discount_amount,
        discount_limit: item.discount_limit,
        discount_type: item.discount_type,
        expiration_date: item.expiration_date,
        limit_usage: item.limit_usage,
        name: item.name,
        status: item.status,
        used_amount: item.used_amount,
        limit_claim: item.limit_claim,
        obtained_amount: item.obtained_amount,
        daily_claim: item.daily_claim
      };
    });
  };

  const handleCheckLimitDiscount = (formik) => {
    if(checkLimitDiscount) {
      formik.setFieldValue("discount_limit", 0)
    }
    setCheckLimitDiscount(!checkLimitDiscount)
  }

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
      name: `${t("discountAmount")}`,
      cell: (rows) => {
        if(rows.discount_type === 'percentage') {
          return (
            <div>{rows.discount_amount}%</div>
          )
        } else {
          return (
            <NumberFormat value={rows.discount_amount || 0} displayType={'text'} thousandSeparator={true} prefix={currency} />
          )
        }
      },
      sortable: true
    },
    {
      name: `${t("discountType")}`,
      selector: "discount_type",
      sortable: true
    },
    {
      name: `${t("voucherExpired")}`,
      cell: (rows) => {
        console.log("rows", rows)
        return (
          <div style={{ padding: "5px 0" }}>
            {formatDate(rows.expiration_date)}
          </div>
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

  return (
    <>
      <VoucherPromoCustomerModal
        t={t}
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title={t("addNewVoucherCustomer")}
        loading={loading}
        alert={alert}
        formikPromo={formikPromo}
        validationPromo={validationPromo}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        handlePreviewPhoto={handlePreviewPhoto}
        allOutlets={allOutlets}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleDate={handleDate}
        errorDate={errorDate}
        handleCheckLimitDiscount={handleCheckLimitDiscount}
        checkLimitDiscount={checkLimitDiscount}
      />

      <VoucherPromoCustomerModalEdit
        t={t}
        stateModal={stateEditModal}
        cancelModal={closeEditModal}
        title={`${t("editPromo")} - ${formikEditPromo.getFieldProps("name").value}`}
        loading={loading}
        alert={alert}
        formikPromo={formikEditPromo}
        validationPromo={validationEditPromo}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        handlePreviewPhoto={handlePreviewPhoto}
        allOutlets={allOutlets}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleDate={handleDate}
        errorDate={errorDate}
        handleCheckLimitDiscount={handleCheckLimitDiscount}
        checkLimitDiscount={checkLimitDiscount}
        validateDiscountLimit={validateDiscountLimit}
      />

      {/* <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`${t("deletePromo")} - ${formikPromo.getFieldProps("name").value}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeletePromo}
      /> */}

      <ConfirmModalDelete
        title={`${t("deletePromo")} - ${formikPromo.getFieldProps("name").value}`}
        body={t(body)}
        warning={t(warning)}
        buttonColor="danger"
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        handleClick={handleDeletePromo}
        loading={loading}
        second={second}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("voucherCustomer")}</h3>
              </div>
              <div className="headerEnd">
                <Link to={{ pathname: "/promo"}}>
                  <Button variant="outline-secondary">{t("backToMainView")}</Button>
                </Link>
                <Button
                  variant="primary"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={showAddModal}
                >
                  {t("addNewVoucherCustomer")}
                </Button>
              </div>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataPromo()}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
