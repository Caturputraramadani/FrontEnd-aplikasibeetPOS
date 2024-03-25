import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { loginStaff } from "../_redux/authCrud";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import OpenEye from "../../../../images/open-eye.png"
import ClosedEye from "../../../../images/closed-eye.png"

import styles from "./auth.module.css";

import ModalVerify from "../components/ModalVerify";
import ModalRegister from "../components/ModalRegister";

const LoginStaff = (props) => {
  const { intl } = props;

  const initialValues = {
    staff_id: "",
    email: "",
    password: ""
  };

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(false);
  const { t, i18n } = useTranslation();
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [stateShowPassword, setStateShowPassword] = useState(false)

  const LoginSchema = Yup.object().shape({
    staff_id: Yup.string()
      .min(3, `${t("minimum3Symbols")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(`${t("pleaseInputStaffId")}`),
    email: Yup.string()
      .email(`${t("wrongFormatEmail")}`)
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

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      const device = window.navigator.userAgent;

      loginStaff(values.staff_id, values.email, values.password, device)
        .then(async ({ data }) => {
          const { token, user } = data.data;

          const resPartition = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${user.business_id}`, {
            headers: { Authorization: `Bearer ${token}` } 
          })

          user.subscription_partition_id = resPartition.data.data[0].subscription_partition_id

          setToken(`Bearer ${token}`);
          localStorage.setItem("user_info", JSON.stringify(user));
          disableLoading();
          props.loginStaff(token, user.privileges);
        })
        .catch((err) => {
          disableLoading();
          setSubmitting(false);
          setStatus(err.response?.data.message || err.message);
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
    console.log("hellow brow")
    const password = document.getElementById('show')
    if (password.type === 'password') {
      password.type = 'text'
    } else {
      password.type = 'password'
    }
  };

  return (
    <>
      <div className="login-form login-signin" id="kt_login_signin_form">
        {/* begin::Head */}
        <div className="text-center mb-10 mb-lg-20">
          <h3 className="font-size-h1">{t("loginStaff")}</h3>
          <p className="text-muted font-weight-bold">
            {t("enterYourOwnerEmail,StaffIdAndPassword")}
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
              placeholder={t("staffId")}
              type="text"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "staff_id"
              )}`}
              name="staff_id"
              {...formik.getFieldProps("staff_id")}
            />
            {formik.touched.staff_id && formik.errors.staff_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.staff_id}</div>
              </div>
            ) : null}
          </div>

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
              placeholder={t("password")}
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
              <FormattedMessage id={t('forgotPassword')} />
            </Link>
            <Link
              to="/auth/login"
              className="text-dark-50 text-hover-primary my-3 mr-2"
              id="kt_login_forgot"
            >
              {t("owner?LoginHere")}
            </Link>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_SITE_KEY}
              // onChange={handleCaptcha}
            />
            <button
              id="kt_login_signin_submit"
              type="submit"
              disabled={formik.isSubmitting}
              className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}
            >
              <span>{t("signIn")}</span>
              {loading && <span className="ml-3 spinner spinner-white"></span>}
            </button>
          </div>
        </form>
        {/*end::Form*/}
      </div>
    </>
  );
};

export default injectIntl(connect(null, auth.actions)(LoginStaff));
