import React, {useEffect, useState} from 'react'
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark'
import IconBackoffice from '../../../../../images/logo beetPOS new.png'
import styles from './advancedregister.module.css'
import { useTranslation } from "react-i18next";
import qs from 'qs'
import { useLocation, useHistory } from 'react-router-dom'
import axios from 'axios'
import {
  Alert
} from 'react-bootstrap'
import { ToastContainer, toast } from "react-toastify";
import LoadingAnimated from '../../../../../images/Spinner-0.5s-504px.svg'

toast.configure();

export default function VerifyEmail({location}) {
  const API_URL = process.env.REACT_APP_API_URL;

  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [session, setSession] = useState("")
  const [code, setCode] = useState("")
  const [showCode, setShowCode] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [timeCount, setTimeCount] = useState(false)
  const [second, setSecond] = useState(0);
  const [defaultValue, setDefaultValue] = useState("")
  const [inputCode, setInputCode] = useState("")
  const [alert, setAlert] = useState("")
  const [loadingResend, setLoadingResend] = useState(false)

  // const location = useLocation();

  const responseToast = (status, message, position = 'top-right', autoClose = 4500) => {
    if(status === 'success') {
      return toast.success(message, {
        position,
        autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (status === 'error') {
      return toast.error(message, {
        position,
        autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  }

  const getCode = async (token) => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/owner/my-id`, 
        { headers: { Authorization: token }} )
      console.log("data.data.verification_code", data.data.verification_code)
      setCode(data.data.verification_code)
    } catch (error) {
      console.log("error getCode", error)
    }
  }

  const resendCode = async () => {
    if(!loadingResend) {
      try {
        setLoadingResend(true)
        await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/send-email/verify-otp?email=${email}&verifyCode=${code}`,
          { headers: { Authorization: token } }
        );
        setLoadingResend(false)
        responseToast('success', t('resendCodeSuccess,PleaseCheckYourEmail'))
      } catch (error) {
        setLoadingResend(false)
        responseToast('error', t('resendCodeFailed,PleaseTryAgain'))
        console.log("error", error);
        return false;
      }
    }
  };

  const showHere = () => {
    if(second > 0) {
      return
    } else {
      setShowCode(true)
    }
  }

  const handleFillCode = () => {
    setDefaultValue(code)
    setInputCode(code)
  }

  const handleInputCode  = (value) => {
    setInputCode(value)
  }

  const checkCode = async () => {
    console.log("inputCode", inputCode)
    if(!inputCode) return setAlert(t('codeIsInvalid'))
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      await axios.post(
        `${API_URL}/api/v1/auth/verify-account`,
        { code: inputCode },
        { headers: { Authorization: token } }
      );
      history.push(`/register-process/business-location?session=${session}`)
    } catch (err) {
      setAlert(t('codeIsInvalid'))
      console.log("error", err.response?.data.message)
    }
  };

  const handleBusinessInformation = async (token) => {
    try {
      const getBusinessId = await axios.get(`${API_URL}/api/v1/business/my-businessid`,
        { headers: { Authorization: token } 
      })
      const business_id = getBusinessId.data.data

      const {data} = await axios.get(`${API_URL}/api/v1/business/${business_id}`,
      { headers: { Authorization: token } })

      if(!data.data.language || data.data.language == 'en') {
        changeLanguage("en", 2)
      } else if (data.data.language == 'id') {
        changeLanguage("id", 1)
      } else if (data.data.language === 'cn_simplified'){
        changeLanguage("cn_simplified", 3)
      } else if (data.data.language === 'cn_traditional'){
        changeLanguage("cn_traditional", 4)
      } else {
        changeLanguage("en", 2)
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    const email = qs.parse(location.search, { ignoreQueryPrefix: true }).email
    const token = qs.parse(location.search, { ignoreQueryPrefix: true }).session
    setEmail(email)

    // untuk authorization, state
    setToken(`Bearer ${token}`)

    // untuk session di url, state
    setSession(token)

    // Funsgi untuk mendapatkan code verify, bukan state
    getCode(`Bearer ${token}`)

    // Fungsi untuk get bahasa
    handleBusinessInformation(`Bearer ${token}`)
  }, [location])

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
    console.log("language verify email", language)
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    const currLanguage = localStorage.getItem("i18nextLng")
    setSelectedLanguage(currLanguage)
    setTimeout(() => {
      setTimeCount(true)
      setSecond(5)
    }, 5000 )
  }, [])

  useEffect(() => {
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

  return (
    <div>
      <div className="d-flex justify-content-end">
        <div className={styles.wrapperLogoBeetpos}>
          <img src={IconBackoffice} alt="Icon Backoffice" />
        </div>
      </div>
      
      <div className={styles.contentVerifyEmail}>
        <div className={styles.title}>{t("accountVerification")}</div>
        <div className="my-3">
          <div>{t("enterTheVerificationCodeWeSend")}</div>
          <div>{t("emailTo")} <span className="ml-2 font-weight-bold">{email}</span></div>
        </div>
        {/* Choose Language */}
        {/* <div className="form-group d-flex align-items-end justify-content-between">
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
        </div> */}
        {/* End Choose Language */}

        {alert ? <Alert variant="danger">{alert}</Alert> : ""}

        <div className="form-group fv-plugins-icon-container mb-4">
          <input
            placeholder={t("pleaseInputVerifyCode")}
            type="code_verification"
            className="form-control h-auto py-3 px-4"
            name="code_verification"
            defaultValue={defaultValue}
            onChange={(e) => {
              handleInputCode(e.target.value)
            }}
          />
        </div>
        <button
          id="kt_login_signin_submit"
          type="submit"
          className="btn btn-primary font-weight-bold btn-block mb-5"
          onClick={checkCode}
        >
          <span>{t("confirm")}</span>
        </button>
        <div>{t("didntReceiveTheVerificationCode")}</div>
        <div className="d-flex align-items-center">
          <div className={`${styles.resendCode} ${loadingResend ? 'text-muted' : 'text-primary '}`} onClick={resendCode}>{t("resendVerificationCode")}</div>
          {loadingResend ? (
            <div className={styles.wrapperLoading}>
              <img src={LoadingAnimated} alt="Loading"/>
            </div>
          ) : null }
        </div>
        {timeCount ? 
          showCode ? (
            <div className="text-primary" onClick={handleFillCode}>{code}</div>
          ) : (
            <div className={`${styles.resendCode} ${second > 0 ? 'text-muted' : 'text-primary'}`} onClick={showHere}>{t("showHere")}{second > 0 && (<span className="ml-2">{second}</span>)}</div>
          )
        : null }
      </div>
      <div />
    </div>
  )
}
