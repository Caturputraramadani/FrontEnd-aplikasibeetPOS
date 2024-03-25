import React, { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

import ReCAPTCHA from "react-google-recaptcha";
import './style.css'
import styles from "./auth.module.css";

import OpenEye from "../../../../images/open-eye.png"
import ClosedEye from "../../../../images/closed-eye.png"

import LogoBeetpos from '../../../../images/logo beetPOS new.png'
import LogoTwitter from '../../../../images/twitter-480.png'
import LogoInstagram from '../../../../images/instagram-480.png'
import LogoFacebook from '../../../../images/facebook-500.png'

import LogoLocation from '../../../../images/location-512.png'
import LogoPhone from '../../../../images/phone-90.png'
import LogoWhatsapp from '../../../../images/whatsapp-240.png'
import LogoEmail from '../../../../images/email-512.png'

import IconMenu from '../../../../images/menu-384.png'

import ModalVerify from "../components/ModalVerify";
import ModalVerifyEmail from "../components/ModalVerifyEmail";
import ModalPersonal from "../components/ModalPersonal";
import ModalRegister from "../components/ModalRegister";
import ModalSendOTP from "../components/ModalSendOTP";

import * as auth from "../_redux/authRedux";
import { register, cancelRegistration } from "../_redux/authCrud";

import IconThick from '../../../../images/checkmark-384.png'
import NavDropdown from '../components/NavDropdown'

toast.configure();

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

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

const RegistrationTryNow = () => {
  const initialValues = {
    name: "",
    email: "",
    phone_number: "",
    password: "",
    changepassword: "",
    business_type_id: "",
    business_province_id: "",
    business_city_id: "",
    business_location_id: "",
    outlet_location_id: "",
    acceptTerms: false
  };

  const history = useHistory();

  const API_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [stateShowPassword, setStateShowPassword] = useState(false)
  const [stateShowPassword2, setStateShowPassword2] = useState(false)

  const [countryCallingCode, setCountryCallingCode] = useState([])
  const [openOption, setOpenOption] = useState(false)
  const [countryCodeIso, setCountryCodeIso] = useState("IDN")
  const [phoneCode, setPhoneCode] = useState("62")
  const [language, setLanguage] = useState("")

  const [width, height] = useWindowSize();
  const [showNavDropdown, setShowDropdown] = useState(false)

  const [expiredApp, setExpiredApp] = useState(false);

  const openNavDropdown = () => setShowDropdown(true)
  const closeNavDropdown = () => setShowDropdown(false)

  // expired_app
  const handleExpiredApp = () => {
    const dateNow = new Date();
    const dateNowFormat = dayjs(dateNow);
    const dateExpired = dayjs("2021-08-26");
    const resDate = dateExpired.diff(dateNowFormat, "day");
    if (resDate < 1) {
      setExpiredApp(true);
    }
  };
  // React.useEffect(() => {
  //   handleExpiredApp()
  // }, [])

  const { t, i18n } = useTranslation();

  const RegistrationSchema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string()
      .email(`${t('wrongEmailFormat')}`)
      .min(3, `${t("minimum3Symbols")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(`${t("pleaseInputEmail")}`),
    phone_number: Yup.string()
      .required(`${t("pleaseInputPhoneNumber")}`),
    password: Yup.string()
      .min(8, `${t("minimum8Character")}`)
      .max(50, `${t("maximum50Symbols")}`)
      .required(`${t("pleaseInputAPassword")}`)
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        t('mustContain8Characters,OneUppercase,OneLowercaseAndOneNumber')
      ),
    changepassword: Yup.string()
      .required(`${t("pleaseInputAPasswordConfirmation")}`)
      .when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Password and Confirm Password didn't match"
        )
      })
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
        t('mustContain8Characters,OneUppercase,OneLowercaseAndOneNumber')
      ),
    business_type_id: Yup.number()
      .integer(),
    business_province_id: Yup.number()
      .integer(),
    business_city_id: Yup.number()
      .integer(),
    business_location_id: Yup.number()
      .integer(),
    outlet_location_id: Yup.number()
      .integer(),
    acceptTerms: Yup.bool().oneOf([true], t('pleaseCheckTheBoxAboveToAgreeToTheTermsAndConditions'))
  });

  const [dataSentOTP, setDataSentOTP] = useState({});
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [alertModal, setAlertModal] = useState("");
  const [token, setToken] = useState("");
  const [second, setSecond] = useState(0);
  const [verificationCode, setVerificationCode] = useState(0);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [allBusinessTypes, setAllBusinessTypes] = useState([]);
  const [allProvinces, setAllProvinces] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [dataFormik, setDataFormik] = useState({});
  const [statusWhatsapp, setStatusWhatsapp] = useState(false);
  const [statusEmail, setStatusEmail] = useState(false);
  const [messageNotSent, setMessageNotSent] = React.useState(false);
  const [showModalPersonal, setShowModalPersonal] = React.useState(false);
  const [methodSendOTP, setMethodSendOTP] = React.useState("");

  const [code, setCode] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [sentEmail, setSentEmail] = useState("");

  const changePhoneNumber = (number) => setPhonenumber(number);
  const changeEmail = (email) => setSentEmail(email);

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
      .required(`${t("pleaseChooseABusinessType")}`),
    business_province_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAProvince")}`),
    business_city_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseACity")}`),
    business_location_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseABusinessLocation")}`),
    outlet_location_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAnOutletLocation")}`)
  });

  const handleFormikBusiness = async (values, accessToken) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      setAlertModal("");
      const userInfo = JSON.parse(localStorage.getItem("user_info"));

      const { data } = await axios.get(`${API_URL}/api/v1/outlet`, {
        headers: { Authorization: accessToken }
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
        `${API_URL}/api/v1/business/${userInfo.business_id}`,
        businessData,
        { headers: { Authorization: accessToken } }
      );
      const now = new Date();
      now.setDate(now.getDate() + 14);
      const dataSubscription = {
        subscription_type_id: 10,
        expired_date: now,
        status: "active"
      };
      await axios.post(`${API_URL}/api/v1/subscription`, dataSubscription, {
        headers: { Authorization: accessToken }
      });

      const resPartition = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`,
        {
          headers: { Authorization: accessToken }
        }
      );

      userInfo.subscription_partition_id =
        resPartition.data.data[0].subscription_partition_id;

      localStorage.setItem("user_info", JSON.stringify(userInfo));

      await axios.patch(`${API_URL}/api/v1/outlet/${outlet_id}`, outletData, {
        headers: { Authorization: accessToken }
      });
      verifyAccount();
      // disableLoading();
      history.push("/login");
      toast.success(t('registerSuccess,PleaseLogin'), {
        position: "top-right",
        autoClose: 4500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      // props.register(token.split(" ")[1]);
      // setShowModalPersonal(true)
    } catch (err) {
      setAlertModal(err.response.data.message);
      disableLoading();
    }
  };

  const registerSuccess = () => {
    // props.register(token.split(" ")[1]);
  };

  const changeLanguage = (language, noLanugage) => {
    setLanguage(language)
    i18n.changeLanguage(language);
  };

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
        // props.register(token.split(" ")[1]);
      } catch (err) {
        setAlertModal(err.response.data.message);
        disableLoading();
      }
    }
  });

  const validationBusiness = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const closeVerifyModal = () => setShowVerifyModal(false);
  const openVerifyModal = () => setShowVerifyModal(true);
  const handleVerifyModal = (e) => setCode(e.target.value);

  const closeOTPModal = () => setShowOTPModal(false);
  const openOTPModal = () => setShowOTPModal(true);

  const handleCaptcha = (value) => {
    setCaptchaToken(value);
  };

  React.useEffect(() => {
    let timer;
    if (showVerifyModal && second > 0) {
      timer = setTimeout(function() {
        setSecond((now) => now - 1);
      }, 1000);
    } else {
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  });

  const closeBusinessModal = () => setShowBusinessModal(false);
  const openBusinessModal = () => {
    getBusinessTypes();
    getProvinces();
    setShowBusinessModal(true);
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleResendCode = (phone, verify_code, email) => {
    if (methodSendOTP === "whatsapp") {
      handleSendWhatsapp(phone, verify_code);
      setSecond(15);
    }
    if (methodSendOTP === "gmail") {
      handleSendEmail(email, verify_code);
      setSecond(15);
    }
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const handleMethodSentOTP = async (param) => {
    setMethodSendOTP(param);
    if (param === "whatsapp") {
      setSecond(15);
      const resSendWhatsapp = await handleSendWhatsapp(
        dataSentOTP.phoneNumber,
        dataSentOTP.verifyCode
      );
      if (resSendWhatsapp) {
        closeOTPModal();
        openVerifyModal();
        setTimeout(() => {
          setMessageNotSent(true);
        }, 50000);
      } else {
        setMethodSendOTP("gmail");
        setSentEmail(formik.values.email);
        await handleSendEmail(formik.values.email, dataSentOTP.verifyCode);
        closeOTPModal();
        openVerifyModal();
        setTimeout(() => {
          setMessageNotSent(true);
        }, 50000);
        toast.info(
          `Send whatsapp failed, please check your email ${formik.values.email} for verification`,
          {
            position: "top-right",
            autoClose: 15000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          }
        );
      }
    }
    if (param === "gmail") {
      setSentEmail(formik.values.email);
      const resSendEmail = await handleSendEmail(
        formik.values.email,
        dataSentOTP.verifyCode
      );
      if (resSendEmail) {
        closeOTPModal();
        openVerifyModal();
        setTimeout(() => {
          setMessageNotSent(true);
        }, 50000);
        toast.success("Verification code sent", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      } else {
        setStatusEmail(false);
        toast.info("Verification code not sent", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        console.log("send email error");
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      const phoneNumber = `${phoneCode}${values.phone_number}`
      enableLoading();
      setPhonenumber(phoneNumber);
      setDataFormik(values);
      register(
        values.email,
        values.name,
        phoneNumber,
        values.password,
        captchaToken,
        language,
        countryCodeIso
      )
      .then(async ({ data }) => {
        const { owner, accessToken } = data.data;
        setToken(`Bearer ${accessToken}`);
        setVerificationCode(owner.verification_code)
        await handleSendEmail(values.email, owner.verification_code, `Bearer ${accessToken}`)
        history.push(`/register-process/verify-email?email=${values.email}&session=${accessToken}`);
      })
      .catch((err) => {
        disableLoading()
        setStatus(err.response.data.message);
        console.log("err.response", err.response);
      });
    }
  });

  const handleSendWhatsapp = async (phone, verifyCode) => {
    try {
      // const sendWhatsapp = await axios.get(`${API_URL}/api/v1/send-whatsapp/send-message?phone=${phone}&code=${verifyCode}`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // })
      // console.log("response send whatsapp ==>", sendWhatsapp)

      const tempSplit = phone.split("");
      if (tempSplit[0] == 0 || tempSplit[0].length == 0) {
        tempSplit[0] = "62";
      } else if (tempSplit[0] == 8) {
        tempSplit.unshift(62);
      }
      const resultPhone = tempSplit.join("");
      const dataSend = {
        message: `
          Verify Code = ${verifyCode}\nPowered By Beetpos
        `,
        phone: resultPhone,
        device: "backoffice_test3"
      };

      // https://nordicapis.com/10-free-to-use-cors-proxies/
      // Menggunakan proxy thinsproxy agar melewati cors origin
      // const sendMessage = await axios.post('https://thingproxy.freeboard.io/fetch/http://139.59.244.237:3001/api/v1/messaging/sendText', dataSend, {
      //   headers: {
      //     "x-api-key" : "EalYHzTieQVwZ83XnrPv"
      //   }
      // })

      // Menggunakan proxy cors-anywhere agar melewati cors origin
      const sendMessage = await axios.post(
        "shttps://cors-anywhere.herokuapp.com/http://139.59.244.237:3001/api/v1/messaging/sendText",
        dataSend,
        {
          headers: {
            "x-api-key": "EalYHzTieQVwZ83XnrPv"
          }
        }
      );

      // status whatsapp untuk cek response server error tidak
      setStatusWhatsapp(true);
      toast.success("Verification code sent", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      return true;
    } catch (error) {
      console.log("send whataspp error");
      console.log(error);

      // status whatsapp untuk cek response server error tidak
      setStatusWhatsapp(false);
      return false;
    }
  };

  const handleSendEmail = async (email, verifyCode, token) => {
    try {
      console.log("email =====>", email)
      console.log("verifyCode =====>", verifyCode)
      console.log("token =====>", token)
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/send-email/verify-otp?email=${email}&verifyCode=${verifyCode}`,
        { headers: { Authorization: token } }
      );
      console.log("response send email", data)
      setStatusEmail(true);
      return true;
    } catch (error) {
      console.log("error ketika send email", error);
      return false;
    }
  };

  const handleProvince = (e) => {
    if (!e.target.value) {
      return;
    }
    const province_id = e.target.value;
    formik.setFieldValue("business_province_id", province_id);
    formik.setFieldValue("business_city_id", "");
    formik.setFieldValue("business_location_id", "");
    formik.setFieldValue("outlet_location_id", "");
    setAllLocations([]);

    const provinces = [...allProvinces];
    const [cities] = provinces
      .filter((item) => item.id === parseInt(province_id))
      .map((item) => item.Cities);
    setAllCities(cities);
  };

  useEffect(() => {
    const currLanguage = localStorage.getItem("i18nextLng")
    setSelectedLanguage(currLanguage)
  }, [])

  const handleCity = (e) => {
    const city_id = e.target.value;
    formik.setFieldValue("business_city_id", city_id);
    formik.setFieldValue("business_location_id", "");
    formik.setFieldValue("outlet_location_id", "");

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
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      setAlertModal("");
      const { data } = await axios.get(`${API_URL}/api/v1/province`);
      setAllProvinces(data.data);
    } catch (err) {
      setAlertModal(err.response.data.message);
      setAllProvinces([]);
    }
  };

  const getCountryCallingCode = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const { data } = await axios.get(`${API_URL}/api/v1/country-calling-code`);
      data.data.map(value => {
        value.nicename = "   " + value.nicename.substring(0, value.nicename.length)
      })
      setCountryCallingCode(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCountryCallingCode()
    getBusinessTypes();
    getProvinces();
  }, []);

  const verifyAccount = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      await axios.post(
        `${API_URL}/api/v1/auth/verify-account`,
        { code },
        { headers: { Authorization: token } }
      );
    } catch (err) {
      console.log("error", err)
    }
  };

  const rollbackRegist = async () => {
    setCancelLoading(true);
    await cancelRegistration();
    setCancelLoading(false);
    setShowBusinessModal(false);
  };
  const checkCode = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      setAlertModal("");
      await axios.post(
        `${API_URL}/api/v1/auth/verify-account?check=${true}`,
        { code },
        { headers: { Authorization: token } }
      );
      // closeVerifyModal();
      handleFormikBusiness(dataFormik, token);
    } catch (err) {
      setAlertModal(err.response?.data.message);
      disableLoading();
    }
  };

  const words = [
    {
      id: 1,
      word: "Pencatatan Transaksi Penjualan dalam satu perangkat"
    },
    {
      id: 2,
      word: "Pencetakan struk kasir dan pelanggan dalam satu perangkat"
    },
    {
      id: 3,
      word: "Pembayaran kartu debit dan credit berbasis chip dan swipe dalam satu perangkat"
    },
    {
      id: 4,
      word: "Pembayaran kartu prepaid e-money berbasis contactless dalam satu perangkat"
    },
    {
      id: 5,
      word: "Pembayaran E-Wallet berbasis Qris scan dalam satu perangkat"
    },
    {
      id: 6,
      word: "Kemampuan scan QR dan Barcode dengan camera build-in"
    },
    {
      id: 7,
      word: "Keamanan transaksi pelanggan di merchant terjaga dalam satu perangkat"
    },
    {
      id: 8,
      word: "Keamanan aplikasi beetpos terhindar dari serangan hacker atau kejahatan siber"
    },
    {
      id: 9,
      word: "Perangkat berbasis android telah tersertifikasi PCI/DSS, NSICCS dan EMVCo"
    },
    {
      id: 10,
      word: "Fasilitas pemantauan keberadaan perangkat android real-time positioning system"
    }
  ]

  const handleCountryCallingCode = (value) => {
    setPhoneCode(value)
    const result = countryCallingCode.find(item => {
      return item.phonecode == value
    })
    setCountryCodeIso(result.iso3)
  }

  const handleOpenOption = (params) => {
    setOpenOption(params)
  }

  const showPassword = () => {
    setStateShowPassword(!stateShowPassword)
    const password = document.getElementById('show')
    if (password.type === 'password') {
      password.type = 'text'
    } else {
      password.type = 'password'
    }
  };

  const showPassword2 = () => {
    setStateShowPassword2(!stateShowPassword2)
    const password = document.getElementById('show2')
    if (password.type === 'password') {
      password.type = 'text'
    } else {
      password.type = 'password'
    }
  };

  return (
    <div className="login-form login-signin" style={{ display: "block" }}>
      <ModalVerify
        handleSendWhatsapp={handleSendWhatsapp}
        handleSendEmail={handleSendEmail}
        changePhoneNumber={changePhoneNumber}
        statusWhatsapp={statusWhatsapp}
        statusEmail={statusEmail}
        showVerifyModal={showVerifyModal}
        messageNotSent={messageNotSent}
        closeVerifyModal={closeVerifyModal}
        alertModal={alertModal}
        phonenumber={phonenumber}
        sentEmail={sentEmail}
        handleVerifyModal={handleVerifyModal}
        code={code}
        checkCode={checkCode}
        loading={loading}
        second={second}
        handleResendCode={handleResendCode}
        verification_code={verificationCode}
        changeEmail={changeEmail}
        methodSendOTP={methodSendOTP}
        centered={false}
      />

      {/* <ModalVerifyEmail
      
      /> */}

      <ModalPersonal
        registerSuccess={registerSuccess}
        showModalPersonal={showModalPersonal}
        closeVerifyModal={closeVerifyModal}
        alertModal={alertModal}
      />

      <ModalSendOTP
        loading={loading}
        closeOTPModal={closeOTPModal}
        openOTPModal={openOTPModal}
        showOTPModal={showOTPModal}
        handleMethodSentOTP={handleMethodSentOTP}
        centered={false}
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
        cancel={rollbackRegist}
        cancelLoading={cancelLoading}
      />

      <div className="text-center mb-10 mb-lg-20">
        <h3 className="register-to-beetpos">{t("registerToBeetPOS")}</h3>
        <p className="text-muted register-and-get-free-trial">
          {t("registerAndGetFreeTrial")}
        </p>
      </div>

      <form
        id="kt_login_signin_form"
        className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp"
        onSubmit={formik.handleSubmit}
      >
        {/* begin: Alert */}
        {formik.status && (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}
        {/* end: Alert */}

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

        {/* begin: Email */}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Email"
            type="email"
            autoComplete="new-password"
            className={`form-control py-5 px-6 ${getInputClasses("email")}`}
            name="email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.email}</div>
            </div>
          ) : null}
        </div>
        {/* end: Email */}

        {/* begin: Phone Number */}
        <div className="row no-gutters form-group fv-plugins-icon-container">
          <div className="col-4">
            <Form.Control
              as="select"
              required
              onClick={() => handleOpenOption(!openOption)}
              onBlur={() => handleOpenOption(false)}
              onChange={(e) => handleCountryCallingCode(e.target.value)}
            >
              {/* <option value="" disabled hidden>
                Choose Business Type
              </option> */}
              
              {countryCallingCode.map((item) =>
                openOption ? (
                  <>
                    <option value="62" selected disabled hidden>Indonesia</option>
                    <option style={{width: '600px'}} key={item.id} value={item.phonecode}>
                      {item.nicename}
                    </option>
                  </>
                ) : (
                  <>
                    <option value="62" selected disabled hidden>+62</option>
                    <option key={item.id} value={item.phonecode}>
                      {`+${item.phonecode}`}
                    </option>
                  </>
                )
              )}
            </Form.Control>
          </div>
          <div className="col-8 pl-2">
            <input
              placeholder={t('phoneNumber')}
              type="number"
              autoComplete="new-password"
              className={`form-control py-5 px-6 ${getInputClasses("phone_number")}`}
              name="phone_number"
              {...formik.getFieldProps("phone_number")}
            />
          </div>
          {formik.touched.phone_number && formik.errors.phone_number ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.phone_number}</div>
            </div>
          ) : null}
        </div>
        {/* end: Phone Number */}

        {/* begin: Password */}
        <div className={`form-group fv-plugins-icon-container ${styles.containerFormPassword}`}>
          <input
            placeholder={t('password')}
            type="password"
            autoComplete="new-password"
            className={`form-control py-5 px-6 ${getInputClasses("password")}`}
            name="password"
            {...formik.getFieldProps("password")}
            id="show"
          />
          <div className={styles.wrapperIconEyeRegister} onClick={() => showPassword()}>
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
        {/* end: Password */}

        {/* begin: Confirm Password */}
        <div className={`form-group fv-plugins-icon-container ${styles.containerFormPassword}`}>
          <input
            placeholder={t('confirmPassword')}
            type="password"
            className={`form-control py-5 px-6 ${getInputClasses(
              "changepassword"
            )}`}
            name="changepassword"
            {...formik.getFieldProps("changepassword")}
            id="show2"
          />
          <div className={styles.wrapperIconEyeRegister} onClick={() => showPassword2()}>
            {stateShowPassword2 ? (
              <img src={OpenEye} alt="Open-eye" />
            ) : (
              <img src={ClosedEye} alt="Closed-eye" />
            )}
          </div>
          {formik.touched.changepassword && formik.errors.changepassword ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                {formik.errors.changepassword}
              </div>
            </div>
          ) : null}
        </div>
        {/* end: Confirm Password */}

        {/* begin: Terms and Conditions */}
        {/* <div className="form-group">
          <label className="checkbox">
            <input
              type="checkbox"
              name="acceptTerms"
              {...formik.getFieldProps("acceptTerms")}
            />
            {t('iAgreeThe')}{" "}
            <Link to="/terms" target="_blank" rel="noopener noreferrer" className='mx-2'>
              {t('terms&Conditions')}
            </Link>
            <span />
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.acceptTerms}</div>
            </div>
          ) : null}
        </div> */}
        {/* end: Terms and Conditions */}

        {/* begin: New Terms and Conditions */}
        <div className="form-group">
          <div className="d-flex align-items-center">
            {t('iAgreeThe')}
            <Link to="/terms" target="_blank" rel="noopener noreferrer" className='mx-2'>
              {t('terms&Conditions')}
            </Link>
            <input 
              type="checkbox" 
              className={`${styles.checkbox} ${getInputClasses(
                "acceptTerms"
              )}`} 
              name="acceptTerms"
              {...formik.getFieldProps("acceptTerms")}
            />
          </div>
          {formik.touched.acceptTerms && formik.errors.acceptTerms ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.acceptTerms}</div>
            </div>
          ) : null}
        </div>
        {/* end: New Terms and Conditions */}

        <ReCAPTCHA
          sitekey={process.env.REACT_APP_SITE_KEY}
          onChange={handleCaptcha}
        />

        <div className="form-group d-flex flex-wrap flex-end">
          <button
            type="submit"
            className="btn btn-primary font-weight-bold px-9 py-4 mt-3"
            // disabled={
            //   formik.isSubmitting
            // }
          >
            <span>{t('submit')}</span>
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationTryNow;
