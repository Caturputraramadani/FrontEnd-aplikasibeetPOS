import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import imageCompression from 'browser-image-compression';
import { useTranslation } from "react-i18next";
import NumberFormat from 'react-number-format'

import { Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import "../style.css";
import { DropdownButton, Dropdown } from "react-bootstrap";

// updateState dari query parameter /account?business-information&update-state

export const BusinessInformation = ({updateState}) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = React.useState(false);

  const [stateImage, setStateImage] = React.useState(false)
  const [previewKtp, setPreviewKtp] = React.useState("");
  const [previewNpwp, setPreviewNpwp] = React.useState("");
  const [previewBusinessImage, setPreviewBusinessImage] = React.useState("");
  const [imageKtp, setImageKtp] = React.useState("");
  const [imageNpwp, setImageNpwp] = React.useState("");
  const [businessImage, setBusinessImage] = React.useState("");
  const [allCurrencies, setAllCurrencies] = React.useState([])

  const [countryCodeIso3, setCountryCodeIso3] = React.useState("")

  const [allBusinessTypes, setAllBusinessTypes] = React.useState([]);
  const [allProvinces, setAllProvinces] = React.useState([]);
  const [allCities, setAllCities] = React.useState([]);
  const [allLocations, setAllLocations] = React.useState([]);
  const [tabs, setTabs] = React.useState(0);

  const [stateComponent, setStateComponent] = React.useState("show");
  const [refresh, setRefresh] = React.useState("show");

  React.useEffect(() => {
    if(updateState) {
      setStateComponent(updateState)
    }
  }, [updateState])

  const [business, setBusiness] = React.useState({
    name: "",
    province_name: "",
    city_name: "",
    business_location: "",
    business_address: "",
    business_phone_number: "",
    name_on_ktp: "",
    ktp_number: "",
    npwp_number: "",
    business_type: "",
    payment_method: "",
    sales_type: "",
    business_type_id: "",
    province_id: "",
    city_id: "",
    location_id: "",
    currency_id: ""
  });
  const { t } = useTranslation();
  const BusinessSchema = Yup.object().shape({
    // name: Yup.string()
    //   .min(3, `${t("minimum3Character")}`)
    //   .max(50, `${t("maximum50Character")}`)
    //   .required("Please input a business name."),
    // name_on_ktp: Yup.string()
    //   .min(3, `${t("minimum3Character")}`)
    //   .max(50, `${t("maximum50Character")}`)
    //   .required("Please input a name on ktp."),
    // business_address: Yup.string()
    //   .min(3, `${t("minimum3Character")}`)
    //   .max(50, `${t("maximum50Character")}`)
    //   .required("Please input a business address."),
    // business_phone_number: Yup.number()
    //   .typeError("Please input a number only")
    //   .required("Please input a business phone_number"),
    // ktp_number: Yup.number()
    //   .typeError("Please input a number only")
    //   .test("ktp_number", "Must exactly 16 digits", (val) =>
    //     val ? val.toString().length === 16 : ""
    //   )
    //   .required("Please input a ktp_number"),
    // npwp_number: Yup.number()
    //   .typeError("Please input a number only")
    //   .test("npwp_number", "Must exactly 15 digits", (val) =>
    //     val ? val.toString().length === 15 : ""
    //   )
    //   .required("Please input a npwp_number"),
    // business_type_id: Yup.number()
    //   .integer()
    //   .min(1)
    //   .required("Please input a business category"),
    // location_id: Yup.number()
    //   .integer()
    //   .min(1)
    //   .required("Please input a business location"),
    // currency_id: Yup.string()
    //   .required("Please choose currency")
  });
  // const handleSelectTab = async (prefix, noCurrency) => {
  //   try {
  //     const dataObj = JSON.parse(localStorage.getItem("user_info"))
  //     const {data} = await axios.get(`${API_URL}/api/v1/business/${dataObj.business_id}`)
  //     console.log('ini data business', data.data)
  //     const editBusiness = {
  //       name: "Hanif Kumaraaaaaaaa",
  //       phone_number: data.data.phone_number,
  //       address: data.data.address,
  //       ktp_owner: data.data.ktp_owner,
  //       npwp_business: data.data.npwp_business,
  //       business_type_id: data.data.business_type_id,
  //       location_id: data.data.location_id,
  //       currency_id: noCurrency,
  //     }
  //     console.log('edit business', editBusiness)
  //     // await axios.put(`${API_URL}/api/v1/business/${dataObj.business_id}`,
  //     //   editBusiness
  //     // )
  //     setTabs(noCurrency);
  //     console.log('ini value apa', noCurrency)
  //   } catch (error) {
  //     console.log('error edit currency', error)
  //   }
  // };
  const handleAllCurrencies = async () => {
    const {data} = await axios.get(`${API_URL}/api/v1/currency`)
    setAllCurrencies(data.data)
  }
  React.useEffect(() => {
    handleAllCurrencies()
  },[])

  const formikBusiness = useFormik({
    enableReinitialize: true,
    initialValues: business,
    validationSchema: BusinessSchema,
    onSubmit: async (values) => {
      // console.log("Bismillah")
      // console.log("formikBusiness values", values)
      const API_URL = process.env.REACT_APP_API_URL;
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      // console.log('ini valie ap aaja', values)
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      
      const formData = new FormData();
      if(countryCodeIso3 !== "IDN" ) {
        formData.append("province", values.province_name);
        formData.append("city", values.city_name);
        formData.append("location", values.business_location);
      }
      formData.append("name", values.name);
      formData.append("currency_id", values.currency_id);
      formData.append("phone_number", values.business_phone_number);
      formData.append("location_id", values.location_id);
      formData.append("name_on_ktp", values.name_on_ktp);
      formData.append("ktp_owner", values.ktp_number);
      formData.append("npwp_business", values.npwp_number);
      formData.append("business_type_id", values.business_type_id);
      formData.append("address", values.business_address);
      if (imageKtp.name) {
        formData.append("ktp_picture", imageKtp);
      }
      if (imageNpwp.name) {
        formData.append("npwp_picture", imageNpwp)
      }
      // console.log("businessImage", businessImage)
      if (businessImage.name) {
        formData.append("image", businessImage);
      }
      try {
        // console.log('ini append', formData)
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/business/${userInfo.business_id}`,
          formData
        );
        handleRefresh();
        disableLoading();
        // console.log("imageKtp", imageKtp)
        // console.log("imageNpwp", imageNpwp)
        // console.log("businessImage", businessImage)
        if (stateImage) {
        } else {
          setStateComponent("show");
        }
        setStateImage(false)
      } catch (err) {
        setStateImage(false)
        console.log("error apa", err)
        disableLoading();
      }
    }
  });

  const validationBusiness = (fieldname) => {
    if (formikBusiness.touched[fieldname] && formikBusiness.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikBusiness.touched[fieldname] &&
      !formikBusiness.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getBusinessInfo = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/business/${userInfo.business_id}`
      );


      const businessInfo = {
        name: data.data.name,
        province_name: "",
        city_name: "",
        business_location: "",
        business_type: data.data.Business_Type.name,
        business_address: data.data.address || "",
        business_phone_number: data.data.phone_number,
        name_on_ktp: data.data.name_on_ktp === "null" ? "" : data.data.name_on_ktp,
        ktp_number: data.data.ktp_owner || "",
        npwp_number: data.data.npwp_business || "",
        payment_method: "",
        sales_type: "",
        business_type_id: data.data.business_type_id,
        province_id: "",
        city_id: "",
        location_id: data.data.location_id,
        currency_id: data.data.currency_id,
        currency_name: data.data.Currency?.full_name
      }

      if (data.data.country_code_iso3 === 'IDN') {
        console.log("masuk Indonesia")
        businessInfo.province_name= data.data.Location.City.Province.name
        businessInfo.city_name= data.data.Location.City.name
        businessInfo.business_location= data.data.Location.name
        businessInfo.province_id = data.data.Location.City.Province.id
        businessInfo.city_id = data.data.Location.City.id
      } else if (data.data.country_code_iso3 !== 'IDN') {
        console.log("masuk Bukan Indonesia")
        businessInfo.province_name = data.data.province
        businessInfo.city_name = data.data.city
        businessInfo.business_location = data.data.location
      } else {
        console.log("masuk default")
        businessInfo.province_name= data.data.Location.City.Province.name
        businessInfo.city_name= data.data.Location.City.name
        businessInfo.business_location= data.data.Location.name
      }

      setCountryCodeIso3(data.data.country_code_iso3)
      setBusiness(businessInfo);

      setImageKtp(
        `${data.data.ktp_picture ? `${API_URL}/${data.data.ktp_picture}` : ""}`
      );

      setImageNpwp(
        `${
          data.data.npwp_picture ? `${API_URL}/${data.data.npwp_picture}` : ""
        }`
      );
      
      setBusinessImage(
        `${data.data.image ? `${API_URL}/${data.data.image}` : ""}`
      );

      getAllProvinces(
        data.data.Location.City.Province.id,
        data.data.Location.City.id
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getAllBusinessTypes = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/business-type`);
      setAllBusinessTypes(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllProvinces = async (province_id, city_id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/province`);
      setAllProvinces(data.data);

      const [cities] = data.data
        .filter((item) => item.id === parseInt(province_id))
        .map((item) => item.Cities);
      setAllCities(cities);

      const [locations] = cities
        .filter((item) => item.id === parseInt(city_id))
        .map((item) => item.Locations);
      setAllLocations(locations);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getAllBusinessTypes();
  }, []);

  React.useEffect(() => {
    getBusinessInfo();
  }, [refresh]);

  const handleRefresh = () => setRefresh((state) => state + 1);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleProvince = (e) => {
    const province_id = e.target.value;
    formikBusiness.setFieldValue("province_id", province_id);
    formikBusiness.setFieldValue("city_id", "");
    formikBusiness.setFieldValue("location_id", "");
    setAllLocations([]);

    const provinces = [...allProvinces];
    const [cities] = provinces
      .filter((item) => item.id === parseInt(province_id))
      .map((item) => item.Cities);
    setAllCities(cities);
  };

  const handleCity = (e) => {
    const city_id = e.target.value;
    formikBusiness.setFieldValue("city_id", city_id);

    if (!city_id) return "";

    if (allCities.length) {
      const cities = [...allCities];
      const [locations] = cities
        .filter((item) => item.id === parseInt(city_id))
        .map((item) => item.Locations);
      setAllLocations(locations);
    }
  };

  const allFields = [
    {
      field: `${t("businessName")}`,
      value: business.name
    },
    {
      field: `${t("province")}`,
      value: business.province_name
    },
    {
      field: `${t("city")}`,
      value: business.city_name
    },
    {
      field: `${t("location")}`,
      value: business.business_location
    },
    {
      field: `${t("businessAddress")}`,
      value: business.business_address
    },
    {
      field: `${t("businessPhoneNumber")}`,
      value: business.business_phone_number
    },
    {
      field: `${t("nameOnKtp")}`,
      value: business.name_on_ktp
    },
    {
      field: `${t("ktpNumber")}`,
      value: business.ktp_number
    },
    {
      field: `${t("npwpNumber")}`,
      value: business.npwp_number
    },
    {
      field: `${t("businessType")}`,
      value: business.business_type
    },
    {
      field: `${t("paymentMethod")}`,
      value: business.payment_method
    },
    {
      field: `${t("salesType")}`,
      value: business.sales_type
    },
    {
      field: `${t("chooseCurrency")}`,
      value: business.currency_name
    }
  ];

  const handleStateComponent = () => {
    if (stateComponent === "show") {
      setStateComponent("edit");
    } else {
      formikBusiness.resetForm();
      setStateComponent("show");
    }
  };

  const handlePreviewKtp = (e) => {
    setStateImage(true)
    let preview;
    let img;
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          // console.log("reader.result", reader.result)
            setPreviewKtp(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      // console.log("img", img)
      setImageKtp(img)
      formikBusiness.submitForm()
    } else {
      preview = "";
    }
  };

  const handlePreviewNpwp = (e) => {
    setStateImage(true)
    let preview;
    let img;
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          // console.log("reader.result", reader.result)
          setPreviewNpwp(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      // console.log("img", img)
      setImageNpwp(img)
      formikBusiness.submitForm()
    } else {
      preview = "";
    }
  };

  const handlePreviewBusiness = (e) => {
    setStateImage(true)
    let preview;
    let img;
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          // console.log("reader.result", reader.result)
            setPreviewBusinessImage(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      // console.log("img", img)
      setBusinessImage(img)
      formikBusiness.submitForm()
    } else {
      preview = "";
    }
  };

  const currency = [
    {
      no: 1,
      prefix: "Rp",
      name: "Indonesia (Rupiah)"
    },
    {
      no: 2,
      prefix: "$",
      name: "US (Dollar)"
    }
  ]

  return (
    <Row>
      <Col md={12}>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <Form noValidate onSubmit={formikBusiness.handleSubmit}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("businessInformation")}</h3>
              </div>
              <div className="headerEnd">
                {stateComponent === "show" ? (
                  <div className="d-flex">
                    {/* <DropdownButton id="dropdown-basic-button"
                      title={ tabs !== 0 ?
                        allCurrencies.find((item) => item.id === parseInt(tabs))
                          .full_name : `${t("chooseCurrency")}`
                      }>
                      {allCurrencies.map(item =>
                        <Dropdown.Item
                          as="button"
                          onClick={() => handleSelectTab(item.name, item.id)}
                          className="selected"
                        >
                        {item.full_name}
                        </Dropdown.Item>
                      )}
                    </DropdownButton> */}
                    <Button variant="primary" style={{marginLeft: ".5rem"}} onClick={handleStateComponent}>
                      {t("changeBusinessInformation")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      onClick={handleStateComponent}
                      style={{ marginRight: "1rem" }}
                    >
                      {t("cancel")}
                    </Button>
                    <Button variant="primary" type="submit">
                      {loading ? (
                        <Spinner animation="border" variant="light" size="sm" />
                      ) : (
                        `${t("saveChanges")}`
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {stateComponent === "show" ? (
              allFields.map((item, index) => {
                return (
                  <Row key={index} style={{ padding: "1rem" }}>
                    <Col md={4}>{item.field}</Col>
                    <Col md={8}>: {item.value || "-"}</Col>
                  </Row>
                );
              })
            ) : (
              <Row style={{ padding: "1rem" }}>
                <Col>
                  <Row style={{ padding: "1rem" }}>
                    <h5>{t("changeBusinessInformation")}</h5>
                  </Row>
                  <Row style={{ padding: "1rem" }}>
                    <Col md={6}>
                      <Form.Group style={{ width: "80%" }}>
                        <Form.Label>{t("businessName")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          {...formikBusiness.getFieldProps("name")}
                          className={validationBusiness("name")}
                          required
                        />
                        {formikBusiness.touched.email &&
                        formikBusiness.errors.email ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.email}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>

                      <Form.Group style={{ width: "80%" }}>
                        <Form.Label>{t("nameOnKtp")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_on_ktp"
                          {...formikBusiness.getFieldProps("name_on_ktp")}
                          className={validationBusiness("name_on_ktp")}
                          required
                        />
                        {formikBusiness.touched.name_on_ktp &&
                        formikBusiness.errors.name_on_ktp ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.name_on_ktp}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>

                      <Form.Group style={{ width: "80%" }}>
                        <Form.Label>{t("ktpNumber")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="ktp_number"
                          {...formikBusiness.getFieldProps("ktp_number")}
                          className={validationBusiness("ktp_number")}
                          required
                        />
                        {formikBusiness.touched.ktp_number &&
                        formikBusiness.errors.ktp_number ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.ktp_number}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>

                      <Form.Group style={{ width: "80%" }}>
                        <Form.Label>{t("npwpNumber")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="npwp_number"
                          {...formikBusiness.getFieldProps("npwp_number")}
                          className={validationBusiness("npwp_number")}
                          required
                        />
                        {formikBusiness.touched.npwp_number &&
                        formikBusiness.errors.npwp_number ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.npwp_number}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                      <Form.Group style={{ width: "80%" }}>
                        <Form.Label>{t("businessCategory")}</Form.Label>
                        <Form.Control
                          as="select"
                          name="business_type_id"
                          {...formikBusiness.getFieldProps("business_type_id")}
                          className={validationBusiness("business_type_id")}
                          required
                        >
                          {allBusinessTypes.length
                            ? allBusinessTypes.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })
                            : ""}
                        </Form.Control>
                        {formikBusiness.touched.business_type_id &&
                        formikBusiness.errors.business_type_id ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.business_type_id}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                      <Form.Group style={{ width: "80%" }}>
                        <Form.Label>{t("chooseCurrency")}</Form.Label>
                        <Form.Control
                          as="select"
                          name="currency_id"
                          {...formikBusiness.getFieldProps("currency_id")}
                          className={validationBusiness("currency_id")}
                          required
                        >
                          {allCurrencies.length
                            ? allCurrencies.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.full_name}
                                  </option>
                                );
                              })
                            : ""}
                        </Form.Control>
                        {formikBusiness.touched.currency_id &&
                        formikBusiness.errors.currency_id ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.currency_id}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <label>
                        {t("uploadKtpPicture")}
                        <small className="ml-4">{t("fileSizeLimit")}</small>
                      </label>
                      <Row className="box">
                        <Col>
                          <div
                            style={{
                              width: "180px",
                              height: "120px",
                              overflow: "hidden",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundImage: `url(${previewKtp || imageKtp})`
                            }}
                          />
                        </Col>
                        <Col style={{ alignSelf: "center" }}>
                          <input
                            accept="image/jpeg,image/png"
                            style={{ display: "none" }}
                            id="upload-ktp-file"
                            type="file"
                            onChange={handlePreviewKtp}
                          />
                          <label
                            htmlFor="upload-ktp-file"
                            className="btn btn-primary"
                          >
                            {t("uploadFile")}
                          </label>
                        </Col>
                      </Row>

                      <label>
                        {t("uploadNpwpPicture")}
                        <small className="ml-4">{t("fileSizeLimit")}</small>
                      </label>
                      <Row className="box">
                        <Col>
                          <div
                            style={{
                              width: "120px",
                              height: "120px",
                              overflow: "hidden",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundImage: `url(${previewNpwp ||
                                imageNpwp})`
                            }}
                          />
                        </Col>
                        <Col style={{ alignSelf: "center" }}>
                          <input
                            accept="image/jpeg,image/png"
                            style={{ display: "none" }}
                            id="upload-npwp-file"
                            type="file"
                            onChange={handlePreviewNpwp}
                          />
                          <label
                            htmlFor="upload-npwp-file"
                            className="btn btn-primary"
                          >
                            {t("uploadFile")}
                          </label>
                        </Col>
                      </Row>

                      <label>
                        {t("uploadBusinessPicture")}
                        <small className="ml-4">{t("fileSizeLimit")}</small>
                      </label>
                      <Row className="box">
                        <Col>
                          <div
                            style={{
                              width: "120px",
                              height: "120px",
                              overflow: "hidden",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundImage: `url(${previewBusinessImage ||
                                businessImage})`
                            }}
                          />
                        </Col>
                        <Col style={{ alignSelf: "center" }}>
                          <input
                            accept="image/jpeg,image/png"
                            style={{ display: "none" }}
                            id="upload-business-file"
                            type="file"
                            onChange={handlePreviewBusiness}
                          />
                          <label
                            htmlFor="upload-business-file"
                            className="btn btn-primary"
                          >
                            {t("uploadFile")}
                          </label>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row style={{ padding: "1rem" }}>
                    <h5>{t("changeBusinessLocation")}</h5>
                  </Row>
                  <Row style={{ padding: "1rem" }}>
                    <Col md={6}>
                      {countryCodeIso3 === "IDN" ? (
                        <Form.Group>
                          <Form.Label>{t("province")}</Form.Label>
                          <Form.Control
                            as="select"
                            name="province_id"
                            {...formikBusiness.getFieldProps("province_id")}
                            onChange={handleProvince}
                            onBlur={handleProvince}
                            className={validationBusiness("province_id")}
                            required
                          >
                            {allProvinces.length
                              ? allProvinces.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })
                              : ""}
                          </Form.Control>
                          {formikBusiness.touched.province_id &&
                          formikBusiness.errors.province_id ? (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                {formikBusiness.errors.province_id}
                              </div>
                            </div>
                          ) : null}
                        </Form.Group>
                      ) : (
                        <Form.Group>
                          <Form.Label>{t("pleaseInputProvince")}:</Form.Label>
                          <Form.Control
                            type="text"
                            name="province"
                            placeholder="Enter province"
                            {...formikBusiness.getFieldProps("province_name")}
                            className={validationBusiness("province_name")}
                            required
                          />
                          {formikBusiness.touched.province_name && formikBusiness.errors.province_name ? (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                {formikBusiness.errors.province_name}
                              </div>
                            </div>
                          ) : null}
                        </Form.Group>
                      )}

                      {countryCodeIso3 === "IDN" ? (
                        <Form.Group>
                          <Form.Label>{t("location")}</Form.Label>
                          <Form.Control
                            as="select"
                            name="location_id"
                            {...formikBusiness.getFieldProps("location_id")}
                            className={validationBusiness("location_id")}
                            required
                          >
                            <option value={""} disabled hidden>
                              {t("chooseALocation")}
                            </option>
                            {allLocations.length
                              ? allLocations.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })
                              : ""}
                          </Form.Control>
                          {formikBusiness.touched.location_id &&
                          formikBusiness.errors.location_id ? (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                {formikBusiness.errors.location_id}
                              </div>
                            </div>
                          ) : null}
                        </Form.Group>
                      ) : (
                        <Form.Group>
                          <Form.Label>{t("pleaseInputLocation")}:</Form.Label>
                          <Form.Control
                            type="text"
                            name="Location"
                            placeholder="Enter Location"
                            {...formikBusiness.getFieldProps("business_location")}
                            className={validationBusiness("business_location")}
                            required
                          />
                          {formikBusiness.touched.business_location && formikBusiness.errors.business_location ? (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                {formikBusiness.errors.business_location}
                              </div>
                            </div>
                          ) : null}
                        </Form.Group>
                      )}
                      <Form.Group>
                        <Form.Label>{t("phoneNumber")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="business_phone_number"
                          {...formikBusiness.getFieldProps(
                            "business_phone_number"
                          )}
                          className={validationBusiness(
                            "business_phone_number"
                          )}
                          required
                        />
                        {formikBusiness.touched.business_phone_number &&
                        formikBusiness.errors.business_phone_number ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.business_phone_number}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      {countryCodeIso3 === "IDN" ? (
                        <Form.Group>
                          <Form.Label>{t("city")}</Form.Label>
                          <Form.Control
                            as="select"
                            name="city_id"
                            {...formikBusiness.getFieldProps("city_id")}
                            onChange={handleCity}
                            onBlur={handleCity}
                            className={validationBusiness("city_id")}
                            required
                          >
                            <option value={""} disabled hidden>
                              {t("chooseACity")}
                            </option>
                            {allCities.length
                              ? allCities.map((item) => {
                                  return (
                                    <option key={item.id} value={item.id}>
                                      {item.name}
                                    </option>
                                  );
                                })
                              : ""}
                          </Form.Control>
                          {formikBusiness.touched.city_id &&
                          formikBusiness.errors.city_id ? (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                {formikBusiness.errors.city_id}
                              </div>
                            </div>
                          ) : null}
                        </Form.Group>
                      ) : (
                        <Form.Group>
                          <Form.Label>{t("pleaseInputCity")}:</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            placeholder="Enter city"
                            {...formikBusiness.getFieldProps("city_name")}
                            className={validationBusiness("city_name")}
                            required
                          />
                          {formikBusiness.touched.city_name && formikBusiness.errors.city_name ? (
                            <div className="fv-plugins-message-container">
                              <div className="fv-help-block">
                                {formikBusiness.errors.city_name}
                              </div>
                            </div>
                          ) : null}
                        </Form.Group>
                      )}

                      <Form.Group>
                        <Form.Label>{t("address")}</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="business_address"
                          {...formikBusiness.getFieldProps("business_address")}
                          className={validationBusiness("business_address")}
                          required
                        />
                        {formikBusiness.touched.business_address &&
                        formikBusiness.errors.business_address ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikBusiness.errors.business_address}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </Form>
        </Paper>
      </Col>
    </Row>
  );
};
