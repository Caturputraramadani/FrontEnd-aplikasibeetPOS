import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import imageCompression from 'browser-image-compression';
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import rupiahFormat from "rupiah-format";
import NumberFormat from 'react-number-format'

import { Row, Col, Button, Dropdown } from "react-bootstrap";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper
} from "@material-ui/core";
import DataTable from "react-data-table-component";
import { Search, MoreHoriz } from "@material-ui/icons";

import SpecialPromoModal from "./SpecialPromoModal";
import SpecialPromoModalEdit from './SpecialPromoModalEdit'
import ShowConfirmModal from "../../../components/ConfirmModal";

import "../../style.css";

export const SpecialPromoPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [refresh, setRefresh] = React.useState(0);

  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [currency, setCurrency] = React.useState("")
  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

    console.log("currency nya brpw", data.data.Currency.name)
     

    setCurrency(data.data.Currency.name)
  }
  React.useEffect(() => {
    handleCurrency()
  }, [])
  
  const [specialPromos, setSpecialPromos] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const { t } = useTranslation();
  const initialValuePromo = {
    id: "",
    outlet_id: "",
    name: "",
    description_type: "",
    description: "",
    type: "",
    value: "",
    promo_category_id: 1
  };

  const EditPromoSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseOutlet")}`),
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAName")}`),
    description_type: Yup.string()
      .matches(/regulation|how_to_use/)
      .required(`${t("pleaseChooseType")}`),
    description: Yup.string().min(1, `${t("minimum1Character")}`),
    type: Yup.string()
      .matches(/percentage|currency/)
      .required(`${t("pleaseChooseType")}`),
    value: Yup.number()
      .min(0)
      .required(`${t("pleaseInputValue")}`),
    promo_category_id: Yup.number()
      .integer()
      .min(0)
      .required(`${t("pleaseInputValue")}`)
  });

  const PromoSchema = Yup.object().shape({
    outlet_id: Yup.array()
      .of(Yup.number().min(1))
      .required(`${t("pleaseChooseOutlet")}`),
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAName")}`),
    description_type: Yup.string()
      .matches(/regulation|how_to_use/)
      .required(`${t("pleaseChooseType")}`),
    description: Yup.string().min(1, `${t("minimum1Character")}`),
    type: Yup.string()
      .matches(/percentage|currency/)
      .required(`${t("pleaseChooseType")}`),
    value: Yup.number()
      .min(0)
      .required(`${t("pleaseInputValue")}`),
    promo_category_id: Yup.number()
      .integer()
      .min(0)
      .required(`${t("pleaseInputValue")}`)
  });

  const formikPromo = useFormik({
    enableReinitialize: true,
    initialValues: initialValuePromo,
    validationSchema: PromoSchema,
    onSubmit: async (values, {resetForm}) => {
      const promoData = new FormData();
      promoData.append("outlet_id", JSON.stringify(values.outlet_id));
      promoData.append("name", values.name);
      promoData.append("description_type", values.description_type);
      promoData.append("description", values.description);
      promoData.append("type", values.type);
      promoData.append("value", values.value);
      promoData.append("promo_category_id", values.promo_category_id);
      if (photo) {
        promoData.append("specialPromoImage", photo);
      }

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/special-promo/create-development`, promoData);
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
    validationSchema: EditPromoSchema,
    onSubmit: async (values) => {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      const promoData = new FormData();
      promoData.append("outlet_id", values.outlet_id);
      promoData.append("name", values.name);
      promoData.append("description_type", values.description_type);
      promoData.append("description", values.description);
      promoData.append("type", values.type);
      promoData.append("value", values.value);
      promoData.append("promo_category_id", values.promo_category_id);
      if (photo.name) {
        promoData.append("specialPromoImage", photo);
      }
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(
          // `${API_URL}/api/v1/special-promo/update-development/${values.id}`
          `${API_URL}/api/v1/special-promo/${values.id}`,
          promoData
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

  const getSpecialPromos = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/special-promo`);
      setSpecialPromos(data.data);
    } catch (err) {
      setSpecialPromos([]);
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
    getSpecialPromos();
  }, [refresh]);

  React.useEffect(() => {
    getOutlets();
  }, []);

  const handleChangeStatus = async (id) => {
    let currentStatus;

    const edited = specialPromos.map((item) => {
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
      await axios.patch(`${API_URL}/api/v1/special-promo/${id}`, {
        status: currentStatus
      });
    } catch (err) {
      console.log(err);
    }

    setSpecialPromos(edited);
  };

  const handleRefresh = () => setRefresh((state) => state + 1);

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    setPhoto("");
    setPhotoPreview("");
    setStateAddModal(false);
  };

  const showEditModal = (data) => {
    const API_URL = process.env.REACT_APP_API_URL;

    formikEditPromo.setValues({
      id: data.id,
      outlet_id: data.outlet_id,
      name: data.name,
      description_type: data.description_type,
      description: data.description,
      type: data.type,
      value: data.rate,
      promo_category_id: 1
    });
    if (data.image) {
      setPhoto(`${API_URL}${data.image}`);
      setPhotoPreview(`${API_URL}${data.image}`);
    }
    setStateEditModal(true);
  };
  const closeEditModal = () => {
    formikEditPromo.resetForm();
    setPhoto("");
    setPhotoPreview("");
    setStateEditModal(false);
  };

  const showDeleteModal = (data) => {
    formikPromo.setFieldValue("id", data.id);
    formikPromo.setFieldValue("name", data.name);
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => setStateDeleteModal(false);

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
          console.log("reader.result", reader.result)
          setPhotoPreview(reader.result);
        }
      }
      reader.readAsDataURL(file[0])
      img = file[0];
      console.log("img", img)
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
      await axios.delete(`${API_URL}/api/v1/special-promo/${promo_id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      disableLoading();
    }
  };

  const dataPromo = () => {
    return specialPromos.map((item, index) => {
      const value =
        item.type === "percentage"
          ? item.value + "%"
          : <NumberFormat value={item.value} displayType={'text'} thousandSeparator={true} prefix={currency} />;

      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        outlet_id: item.outlet_id,
        outlet_name: item.Outlet?.name,
        value,
        rate: item.value,
        type: item.type,
        description_type: item.description_type,
        description: item.description,
        image: item.image,
        status: item.status
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
      name: `${t("discountRate")}`,
      selector: "value",
      sortable: true
    },
    {
      name: `${t("promoBanner")}`,
      cell: (rows) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const linkImage = `${API_URL}${rows.image}`;
        return (
          <>
            {rows.image ? (
              <img
                src={linkImage}
                alt="promo-banner"
                style={{ width: "100px", height: "auto", padding: "0.5rem 0" }}
              />
            ) : (
              `[${t("noPromoBanner")}]`
            )}
          </>
        );
      }
    },
    {
      name: `${t("promoStatus")}`,
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
      <SpecialPromoModal
        t={t}
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title={t("addNewSpecialPromo")}
        loading={loading}
        alert={alert}
        formikPromo={formikPromo}
        validationPromo={validationPromo}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        handlePreviewPhoto={handlePreviewPhoto}
        allOutlets={allOutlets}
      />

      <SpecialPromoModalEdit
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
      />

      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`${t("deletePromo")} - ${formikPromo.getFieldProps("name").value}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeletePromo}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("specialPromo")}</h3>
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
                  {t("addNewSpecialPromo")}
                </Button>
              </div>
            </div>

            {/* <div className="filterSection lineBottom">
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
              </Row>
            </div> */}

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataPromo()}
              // expandableRows
              // expandableRowsComponent={ExpandableComponent}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
