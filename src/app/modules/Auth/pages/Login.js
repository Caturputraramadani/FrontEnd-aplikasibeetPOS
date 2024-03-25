import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import ModalVerify from "../components/ModalVerify";
import ModalRegister from "../components/ModalRegister";
import dayjs from 'dayjs'
import OpenEye from "../../../../images/open-eye.png"
import ClosedEye from "../../../../images/closed-eye.png"

import styles from "./auth.module.css";

const initialValues = {
  email: "",
  password: ""
};

function Login(props) {
  const history = useHistory();
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [token, setToken] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [alertModal, setAlertModal] = useState("");
  const [second, setSecond] = useState(0);

  const [allBusinessTypes, setAllBusinessTypes] = useState([]);
  const [allProvinces, setAllProvinces] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const { t, i18n } = useTranslation();
  const [code, setCode] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("")

  const [stateShowPassword, setStateShowPassword] = useState(false)

  const [expiredApp, setExpiredApp] = useState(false)
  // expired_app
  const handleExpiredApp = () => {
    const dateNow = new Date()
    const dateNowFormat = dayjs(dateNow)
    const dateExpired = dayjs('2021-08-26')
    const resDate = dateExpired.diff(dateNowFormat, 'day')
    console.log("resDate", resDate)
    if(resDate < 1) {
      setExpiredApp(true)
    }
  }
  // React.useEffect(() => {
  //   handleExpiredApp()
  // }, [])

  const initialValueBusiness = {
    business_type_id: "",
    business_province_id: "",
    business_city_id: "",
    business_location_id: "",
    outlet_location_id: ""
  };

  const BusinessSchema = Yup.object().shape({
    business_type_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t('pleaseChooseABusinessType')}`),
    business_province_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t('pleaseChooseAProvince')}`),
    business_city_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t('pleaseChooseAProvince')}`),
    business_location_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t('pleaseChooseABusinessLocation')}`),
    outlet_location_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t('pleaseChooseAnOutletLocation')}`)
  });

  const formikBusiness = useFormik({
    enableReinitialize: true,
    initialValues: initialValueBusiness,
    validationSchema: BusinessSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        setAlertModal("");
        const { business_id } = JSON.parse(localStorage.getItem("user_info"));

        const { data } = await axios.get(`${API_URL}/api/v1/outlet`, {
          headers: { Authorization: token }
        });

        const outlet_id = data.data[0].id;

        const businessData = {
          business_type_id: values.business_type_id,
          location_id: values.business_location_id
        };

        const outletData = {
          location_id: values.outlet_location_id
        };

        await axios.patch(
          `${API_URL}/api/v1/business/${business_id}`,
          businessData,
          { headers: { Authorization: token } }
        );

        await axios.patch(`${API_URL}/api/v1/outlet/${outlet_id}`, outletData, {
          headers: { Authorization: token }
        });

        verifyAccount();
        disableLoading();
        props.register(token.split(" ")[1]);
      } catch (err) {
        setAlertModal(err.response.data.message);
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

  const closeVerifyModal = () => setShowVerifyModal(false);
  const openVerifyModal = () => setShowVerifyModal(true);
  const handleVerifyModal = (e) => setCode(e.target.value);

  const handleResendCode = () => setSecond(60);

  const closeBusinessModal = () => setShowBusinessModal(false);
  const openBusinessModal = () => {
    getBusinessTypes();
    getProvinces();
    setShowBusinessModal(true);
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleProvince = (e) => {
    const province_id = e.target.value;
    formikBusiness.setFieldValue("business_province_id", province_id);
    formikBusiness.setFieldValue("business_city_id", "");
    formikBusiness.setFieldValue("business_location_id", "");
    formikBusiness.setFieldValue("outlet_location_id", "");
    setAllLocations([]);

    const provinces = [...allProvinces];
    const [cities] = provinces
      .filter((item) => item.id === parseInt(province_id))
      .map((item) => item.Cities);
    setAllCities(cities);
  };

  const handleCity = (e) => {
    const city_id = e.target.value;
    formikBusiness.setFieldValue("business_city_id", city_id);
    formikBusiness.setFieldValue("business_location_id", "");
    formikBusiness.setFieldValue("outlet_location_id", "");

    if (!city_id) return "";

    if (allCities.length) {
      const cities = [...allCities];
      const [locations] = cities
        .filter((item) => item.id === parseInt(city_id))
        .map((item) => item.Locations);
      setAllLocations(locations);
    }
  };

  const getBusinessTypes = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      setAlertModal("");
      const { data } = await axios.get(`${API_URL}/api/v1/business-type`);
      setAllBusinessTypes(data.data);
    } catch (err) {
      setAlertModal(err.response.data.message);
      setAllBusinessTypes([]);
    }
  };

  const getProvinces = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      setAlertModal("");
      const { data } = await axios.get(`${API_URL}/api/v1/province`);
      setAllProvinces(data.data);
    } catch (err) {
      setAlertModal(err.response.data.message);
      setAllProvinces([]);
    }
  };

  const verifyAccount = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      enableLoading();
      setAlertModal("");
      await axios.post(
        `${API_URL}/api/v1/auth/verify-account`,
        { code },
        { headers: { Authorization: token } }
      );
      disableLoading();
      closeVerifyModal();
      openBusinessModal();
    } catch (err) {
      setAlertModal(err.response.data.message);
      disableLoading();
    }
  };

  const checkCode = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      enableLoading();
      setAlertModal("");
      await axios.post(
        `${API_URL}/api/v1/auth/verify-account?check=${true}`,
        { code },
        { headers: { Authorization: token } }
      );
      disableLoading();
      closeVerifyModal();
      openBusinessModal();
    } catch (err) {
      setAlertModal(err.response?.data.message);
      disableLoading();
    }
  };

  const handleCaptcha = (value) => setCaptchaToken(value);

  React.useEffect(() => {
    let timer;
    if (showVerifyModal && second > 0) {
      timer = setTimeout(() => {
        setSecond((now) => now - 1);
      }, 1000);
    } else {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  });

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(`${t('wrongEmailFormat')}`)
      .min(3, `${t("minimum3Symbols")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(`${t('pleaseInputEmail')}`),
    password: Yup.string()
      .min(3, `${t("minimum3Symbols")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(`${t('pleaseInputAPassword')}`),
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const handleSendEmail = async (email, verifyCode, token) => {
    try {
      await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/send-email/verify-otp?email=${email}&verifyCode=${verifyCode}`,
        { headers: { Authorization: token } }
      );
      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  };

  const toLogin = async (dataBusiness, token, user, API_URL) => {
    // Jika Sudah di verifikasi dan Lokasi bisnis nya sudah ada
    localStorage.setItem("currency", dataBusiness.data.data.Currency.name)
    localStorage.setItem("token", `Bearer ${token}`)
    setToken(`Bearer ${token}`);
    // Handle Check Country || jika diluar indonesia, ketika membuat outlet bisa select addres. Jika luar indonesia select diubah menjadi text
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    const success = async (pos) =>  {
      try {
        const crd = pos.coords;
        const result = await axios.get(`${API_URL}/api/v1/outlet/get-address?latitude=${parseFloat(crd.latitude)}&longitude=${parseFloat(crd.longitude)}`)
        const checkCountry = result.data.resultAddress.address.includes("Indonesia");
        if(checkCountry) {
          localStorage.setItem("checkCountry", true);
        } else {
          localStorage.setItem("checkCountry", false);
        }
      } catch (error) {
        localStorage.setItem("checkCountry", true);
        console.error(error)
        console.log("catch check country")
      }
    }
    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.getCurrentPosition(success, error, options)
    // End Check Country
    const resPartition = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${user.business_id}`, {
    headers: { Authorization: `Bearer ${token}` } 
    })
    user.subscription_partition_id = resPartition.data.data[0].subscription_partition_id
    localStorage.setItem("user_info", JSON.stringify(user));
    disableLoading();
    props.login(token);
  }

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      login(values.email, values.password, captchaToken)
        .then(async ({ data }) => {
          const API_URL = process.env.REACT_APP_API_URL;
          const { token, user } = data.data;
          console.log("return nya data.data", data.data)
          // Jika akun belum diverifikasi
          if (!user.is_verified) {
            const getOwner = await axios.get(`${API_URL}/api/v1/owner/my-id`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            console.log("Belum diverifikasi")
            console.log("Verify Code nya", getOwner.data.data.verification_code)
            disableLoading()
            handleSendEmail(values.email, getOwner.data.data.verification_code, `Bearer ${token}`)
            history.push(`/register-process/verify-email?email=${values.email}&session=${token}`);
          // Jika akun sudah terverifikasi
          } else {
            console.log("Sudah diverifikasi")
            const dataBusiness = await axios.get(`${API_URL}/api/v1/business/${user.business_id}`,
              { headers: { Authorization: `Bearer ${token}` } })
            console.log("dataBusiness", dataBusiness)
            console.log("dataBusiness.data.data", dataBusiness.data.data)
            // Jika Lokasi bisnisnya belum ada
            if(dataBusiness.data.data.country_code_iso3 === "IDN" && dataBusiness.data.data.location_id) {
              toLogin(dataBusiness, token, user, API_URL)
            } 
            // Jika Province, City, Location belum ada
            else if (dataBusiness.data.data.country_code_iso3 !== "IDN" && dataBusiness.data.data.province && dataBusiness.data.data.city && dataBusiness.data.data.location) {
              toLogin(dataBusiness, token, user, API_URL)
            } else {
              // Check bahasa
              if(dataBusiness.data.data.language) {
                console.log("language dari bisnis", dataBusiness.data.data.language)
                changeLanguage(dataBusiness.data.data.language)
                localStorage.setItem("i18nextLng", dataBusiness.data.data.language)
              } else {
                const currLanguage = localStorage.getItem("i18nextLng")
                console.log("language dari localstorage", currLanguage)
                setSelectedLanguage(currLanguage)
              }
              history.push(`/register-process/business-location?session=${token}`)
            }
          }
        })
        .catch((err) => {
          console.log(err);
          disableLoading();
          setSubmitting(false);
          setStatus(
            intl.formatMessage({
              id: "AUTH.VALIDATION.INVALID_LOGIN"
            })
          );
        });
    }
  });

  const chooseLanguages = [
    {
      no: 1,
      key: "id",
      language: "Indonesia"
    },
    {
      no: 2,
      key: "en",
      language: "English"
    },
    {
      no: 3,
      key: "cn_simplified",
      language: "Chinese Simplified"
    },
    {
      no: 4,
      key: "cn_traditional",
      language: "Chinese Traditional"
    }
  ];

  const changeLanguage = (language, noLanugage) => {
    console.log("language", language)
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    const currLanguage = localStorage.getItem("i18nextLng")
    setSelectedLanguage(currLanguage)
  }, [])

  const showPassword = () => {
    setStateShowPassword(!stateShowPassword)
    // console.log("hellow brow")
    const password = document.getElementById('show')
    if (password.type === 'password') {
      password.type = 'text'
    } else {
      password.type = 'password'
    }
  };

  return (
    <>
      <ModalVerify
        showVerifyModal={showVerifyModal}
        closeVerifyModal={closeVerifyModal}
        alertModal={alertModal}
        phonenumber={phonenumber}
        handleVerifyModal={handleVerifyModal}
        code={code}
        checkCode={checkCode}
        loading={loading}
        second={second}
        handleResendCode={handleResendCode}
      />

      <ModalRegister
        showBusinessModal={showBusinessModal}
        closeBusinessModal={closeBusinessModal}
        alertModal={alertModal}
        loading={loading}
        allBusinessTypes={allBusinessTypes}
        allProvinces={allProvinces}
        allCities={allCities}
        allLocations={allLocations}
        formikBusiness={formikBusiness}
        validationBusiness={validationBusiness}
        handleProvince={handleProvince}
        handleCity={handleCity}
      />

      <div className="login-form login-signin" id="kt_login_signin_form">
        {/* begin::Head */}
        <div className="text-center mb-10 mb-lg-20">
          <h3 className="font-size-h1">
            {t('loginAccount')}
          </h3>
          <p className="text-muted font-weight-bold">
            {t('enterYourEmailAndPassword')}
          </p>
        </div>
        {/* end::Head */}

        {/*begin::Form*/}
        <form
          onSubmit={formik.handleSubmit}
          className="form fv-plugins-bootstrap fv-plugins-framework"
        >
          {formik.status ? (
            <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
              <div className="alert-text font-weight-bold">{formik.status}</div>
            </div>
          ) : (
            ""
          )}

          {/* Choose Language */}
          <div className="form-group d-flex align-items-end justify-content-between">
            <label className="mr-4" for="exampleFormControlSelect1">{t('language')}</label>
            <select 
              className="form-control" 
              id="exampleFormControlSelect1" 
              onClick={(e) => changeLanguage(e.target.value)}
            >
              {chooseLanguages?.length
                ? chooseLanguages.map((item) => {
                    return (
                      <option 
                        key={item.id} 
                        value={item.key}
                        selected={selectedLanguage == item.key}
                      >
                        {item.language}
                      </option>
                    );
                  })
                : ""}
            </select>
          </div>
          {/* End Choose Language */}

          <div className="form-group fv-plugins-icon-container">
            <input
              placeholder="Email"
              type="email"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "email"
              )}`}
              name="email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.email}</div>
              </div>
            ) : null}
          </div>
          <div className={`form-group fv-plugins-icon-container ${styles.containerFormPassword}`}>
            <input
              placeholder={t('password')}
              type="password"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "password"
              )}`}
              name="password"
              {...formik.getFieldProps("password")}
              id="show"
            />
            <div className={styles.wrapperIconEye} onClick={() => showPassword()}>
              {stateShowPassword ? (
                <img src={OpenEye} alt="Open-eye" />
              ) : (
                <img src={ClosedEye} alt="Closed-eye" />
              )}
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.password}</div>
              </div>
            ) : null}
          </div>
          <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
            <Link
              to="/auth/forgot-password"
              className="text-dark-50 text-hover-primary my-3 mr-2"
              id="kt_login_forgot"
            >
              {t('forgotPassword')}
            </Link>
            <Link
              to="/auth/login/staff"
              className="text-dark-50 text-hover-primary my-3 mr-2"
            >
              {t('staff?LoginHere')}
            </Link>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_SITE_KEY}
              onChange={handleCaptcha}
            />
            <button
              id="kt_login_signin_submit"
              type="submit"
              disabled={formik.isSubmitting || expiredApp}
              className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
            >
              <span>{t('signIn')}</span>
              {loading && <span className="ml-3 spinner spinner-white"></span>}
            </button>
          </div>
        </form>
        {/*end::Form*/}
      </div>
    </>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
