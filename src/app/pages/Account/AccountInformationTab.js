import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

import { Row, Col, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import { Paper } from "@material-ui/core";

import "../style.css";

import OpenEye from "../../../images/open-eye.png"
import ClosedEye from "../../../images/closed-eye.png"

export const AccountInformation = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [stateModal, setStateModal] = React.useState(false);
  const [account, setAccount] = React.useState({
    name: "-",
    email: "-",
    phone_number: "-",
    registration_date: "-",
    last_login: "-",
    staff_id: "-",
    store_id: "-",
    old_password: "",
    new_password: "",
    password_confirmation: "",
    old_pin: "",
    new_pin: "",
    pin_confirmation: ""
  });
  const [refresh, setRefresh] = React.useState(0)
  const handleRefresh = () => setRefresh((state) => state + 1)

  const userInfo = JSON.parse(localStorage.getItem("user_info"));
  const isOwner = userInfo.owner_id ? true : false;

  const AccountSchema = Yup.object().shape({
    email: Yup.string()
      .email(`${t('emailMustBeAValidEmail')}`)
      .required(`${t("pleaseInputAnEmail")}`),
    phone_number: Yup.string()
      .max(15, `${t("maximum15Character")}`)
      .typeError("Please input a number only"),
    old_password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%*?&]{8,20}$/,
        `${t("passwordAtLeastMustHaveOneLowercase,OneUppercase,OneNumeric,And8CharactersLongMinimum")}`
      )
      .required(`${t("pleaseInputAPassword")}`),
    new_password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%*?&]{8,20}$/,
        `${t("passwordAtLeastMustHaveOneLowercase,OneUppercase,OneNumeric,And8CharactersLongMinimum")}`
      )
      .required(`${t("pleaseInputAPassword")}`),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("new_password"), null], `${t("passwordDontMatch")}`)
      .required(`${t("pleaseInputAPasswordConfirmation")}`)
  });

  const AccountStaffSchema = Yup.object().shape({
    email: Yup.string()
      .email(`${t('emailMustBeAValidEmail')}`)
      .required(`${t("pleaseInputAnEmail")}`),
    phone_number: Yup.number().typeError("Please input a number only"),
    old_password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%*?&]{8,20}$/,
        `${t("passwordAtLeastMustHaveOneLowercase,OneUppercase,OneNumeric,And8CharactersLongMinimum")}`
      )
      .required(`${t("pleaseInputAPassword")}`),
    new_password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%*?&]{8,20}$/,
        `${t("passwordAtLeastMustHaveOneLowercase,OneUppercase,OneNumeric,And8CharactersLongMinimum")}`
      )
      .required(`${t("pleaseInputAPassword")}`),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("new_password"), null], `${t("passwordDontMatch")}`)
      .required(`${t("pleaseInputAPasswordConfirmation")}`),
    old_pin: Yup.string()
      .matches(/^\d+$/, "Please input numbers")
      .min(6)
      .max(6)
      .required("Please input a pin. Pin should be an exact 6 numbers"),
    new_pin: Yup.string()
      .matches(/^\d+$/, "Please input numbers")
      .min(6)
      .max(6)
      .required("Please input a pin. Pin should be an exact 6 numbers"),
    pin_confirmation: Yup.string()
      .oneOf([Yup.ref("new_pin"), null], "Pin do not match")
      .required("Please input a pin confirmation.")
  });

  const formikAccount = useFormik({
    enableReinitialize: true,
    initialValues: account,
    validationSchema: isOwner ? AccountSchema : AccountStaffSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      let url;

      const accountData = {
        email: values.email,
        phone_number: values.phone_number,
        old_password: values.old_password,
        new_password: values.new_password
      };

      if (!isOwner) {
        accountData.old_pin = values.old_pin;
        accountData.new_pin = values.new_pin;
      }

      let request;
      if (isOwner) {
        url = `${API_URL}/api/v1/owner/${userInfo.owner_id}`;
        request = axios.put(url, accountData);
      } else {
        url = `${API_URL}/api/v1/staff/${userInfo.user_id}`;
        request = axios.patch(url, accountData);
      }

      try {
        enableLoading();
        await request;
        handleRefresh()
        disableLoading();
        closeModal();
      } catch (err) {
        setAlert(err.response?.message || err.message);
        disableLoading();
      }
    }
  });

  const validationAccount = (fieldname) => {
    if (formikAccount.touched[fieldname] && formikAccount.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikAccount.touched[fieldname] && !formikAccount.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);
  const openModal = () => setStateModal(true);
  const closeModal = () => {
    formikAccount.resetForm();
    setStateModal(false);
  };

  const getUserInfo = async (user, owner) => {
    const registrationDateFormat = (date) => dayjs(date).format("DD-MM-YYYY");
    const loginDateFormat = (date) => dayjs(date).format("DD-MM-YYYY HH:mm:ss");
    const API_URL = process.env.REACT_APP_API_URL;

    let storeStaffId = "";
    let url;

    if (owner) {
      url = `${API_URL}/api/v1/owner/${user.owner_id}`;
    } else {
      url = `${API_URL}/api/v1/staff/${user.user_id}`;
    }

    const { data } = await axios.get(url);

    if (owner) {
      storeStaffId = data.data.Business.store_id;

      setAccount({
        ...account,
        name: data.data.Business.name,
        phone_number: data.data.Business.phone_number,
        email: data.data.email,
        registration_date: registrationDateFormat(data.data.created_at),
        last_login: data.data.last_login
          ? loginDateFormat(data.data.last_login)
          : "-",
        [owner ? "store_id" : "staff_id"]: storeStaffId
      });
    } else {
      storeStaffId = data.data.User.staff_id;

      setAccount({
        ...account,
        name: data.data.name,
        phone_number: data.data.phone_number,
        email: data.data.User.email,
        registration_date: registrationDateFormat(data.data.created_at),
        last_login: data.data.User.last_login
          ? loginDateFormat(data.data.User.last_login)
          : "-",
        staff_id: storeStaffId
      });
    }
  };

  React.useEffect(() => {
    getUserInfo(userInfo, isOwner);
  }, [refresh]);

  const allFields = [
    {
      field: isOwner ? `${t("businessName")}` : `${t("name")}`,
      value: account.name
    },
    {
      field: `${t("email")}`,
      value: account.email
    },
    {
      field: `${t("phoneNumber")}`,
      value: account.phone_number
    },
    {
      field: `${t("registrationDate")}`,
      value: account.registration_date
    },
    {
      field: `${t("lastLogin")}`,
      name: "last_login",
      value: account.last_login
    },
    {
      field: isOwner ? `${t("storeID")}` : `${t("staffID")}`,
      value: isOwner ? account.store_id : account.staff_id
    }
  ];

  return (
    <>
      <ModalAccountInformation
        state={stateModal}
        closeModal={closeModal}
        loading={loading}
        accountData={account}
        alert={alert}
        formikAccount={formikAccount}
        validationAccount={validationAccount}
        isOwner={isOwner}
      />

      <Row>
        <Col md={12}>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("accountInformation")}</h3>
              </div>
              <div className="headerEnd">
                <Button variant="primary" onClick={openModal}>
                  {t("changeAccountInformation")}
                </Button>
              </div>
            </div>

            {allFields.map((item, index) => {
              return (
                <Row key={index} style={{ padding: "1rem" }}>
                  <Col md={4}>{item.field}</Col>
                  <Col md={8}>: {item.value}</Col>
                </Row>
              );
            })}
          </Paper>
        </Col>
      </Row>
    </>
  );
};

const ModalAccountInformation = ({
  state,
  closeModal,
  loading,
  alert,
  formikAccount,
  validationAccount,
  isOwner
}) => {
  const [stateShowPassword, setStateShowPassword] = React.useState(false)
  const [stateShowPassword2, setStateShowPassword2] = React.useState(false)
  const [stateShowPassword3, setStateShowPassword3] = React.useState(false)
  const [stateShowPassword4, setStateShowPassword4] = React.useState(false)
  const [stateShowPassword5, setStateShowPassword5] = React.useState(false)
  const [stateShowPassword6, setStateShowPassword6] = React.useState(false)

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

  const showPassword3 = () => {
    setStateShowPassword3(!stateShowPassword3)
    const password = document.getElementById('show3')
    if (password.type === 'password') {
      password.type = 'text'
    } else {
      password.type = 'password'
    }
  };

  const showPassword4 = () => {
    setStateShowPassword4(!stateShowPassword4)
    const password = document.getElementById('show4')
    if (password.type === 'password') {
      password.type = 'text'
    } else {
      password.type = 'password'
    }
  };

  const showPassword5 = () => {
    setStateShowPassword5(!stateShowPassword5)
    const password = document.getElementById('show5')
    if (password.type === 'password') {
      password.type = 'text'
    } else {
      password.type = 'password'
    }
  };

  const showPassword6 = () => {
    setStateShowPassword6(!stateShowPassword6)
    const password = document.getElementById('show6')
    if (password.type === 'password') {
      password.type = 'text'
    } else {
      password.type = 'password'
    }
  };

  const { t } = useTranslation();
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t("changeAccountInformation")}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formikAccount.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{t("email")}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  {...formikAccount.getFieldProps("email")}
                  className={validationAccount("email")}
                  required
                />
                {formikAccount.touched.email && formikAccount.errors.email ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikAccount.errors.email}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group className="container-form-password">
                <Form.Label>{t("oldPassword")}</Form.Label>
                <Form.Control
                  type="password"
                  name="old_password"
                  {...formikAccount.getFieldProps("old_password")}
                  className={validationAccount("old_password")}
                  required
                  id="show"
                />
                <div className="wrapper-icon-password-account-information" onClick={() => showPassword()}>
                  {stateShowPassword ? (
                    <img src={OpenEye} alt="Open-eye" />
                  ) : (
                    <img src={ClosedEye} alt="Closed-eye" />
                  )}
                </div>
                {formikAccount.touched.old_password &&
                formikAccount.errors.old_password ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikAccount.errors.old_password}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group className="container-form-password">
                <Form.Label>{t("newPassword")}</Form.Label>
                <Form.Control
                  type="password"
                  name="new_password"
                  {...formikAccount.getFieldProps("new_password")}
                  className={validationAccount("new_password")}
                  required
                  id="show2"
                />
                <div className="wrapper-icon-password-account-information" onClick={() => showPassword2()}>
                  {stateShowPassword2 ? (
                    <img src={OpenEye} alt="Open-eye" />
                  ) : (
                    <img src={ClosedEye} alt="Closed-eye" />
                  )}
                </div>
                {formikAccount.touched.new_password &&
                formikAccount.errors.new_password ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikAccount.errors.new_password}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group className="container-form-password">
                <Form.Label>{t("confirmPassword")}</Form.Label>
                <Form.Control
                  type="password"
                  name="password_confirmation"
                  {...formikAccount.getFieldProps("password_confirmation")}
                  className={validationAccount("password_confirmation")}
                  required
                  id="show3"
                />
                <div className="wrapper-icon-password-account-information" onClick={() => showPassword3()}>
                  {stateShowPassword3 ? (
                    <img src={OpenEye} alt="Open-eye" />
                  ) : (
                    <img src={ClosedEye} alt="Closed-eye" />
                  )}
                </div>
                {formikAccount.touched.password_confirmation &&
                formikAccount.errors.password_confirmation ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikAccount.errors.password_confirmation}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>{t("phoneNumber")}</Form.Label>
                <Form.Control
                  type="text"
                  name="phone_number"
                  {...formikAccount.getFieldProps("phone_number")}
                  className={validationAccount("phone_number")}
                  required
                />
                {formikAccount.touched.phone_number &&
                formikAccount.errors.phone_number ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikAccount.errors.phone_number}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              {!isOwner ? (
                <>
                  <Form.Group className="container-form-password">
                    <Form.Label>{t("oldPin")}</Form.Label>
                    <Form.Control
                      type="password"
                      name="old_pin"
                      {...formikAccount.getFieldProps("old_pin")}
                      className={validationAccount("old_pin")}
                      required
                      id="show4"
                    />
                    <div className="wrapper-icon-password-account-information" onClick={() => showPassword4()}>
                      {stateShowPassword4 ? (
                        <img src={OpenEye} alt="Open-eye" />
                      ) : (
                        <img src={ClosedEye} alt="Closed-eye" />
                      )}
                    </div>
                    {formikAccount.touched.old_pin &&
                    formikAccount.errors.old_pin ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikAccount.errors.old_pin}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="container-form-password">
                    <Form.Label>{t("newPin")}</Form.Label>
                    <Form.Control
                      type="password"
                      name="new_pin"
                      {...formikAccount.getFieldProps("new_pin")}
                      className={validationAccount("new_pin")}
                      required
                      id="show5"
                    />
                    <div className="wrapper-icon-password-account-information" onClick={() => showPassword5()}>
                      {stateShowPassword5 ? (
                        <img src={OpenEye} alt="Open-eye" />
                      ) : (
                        <img src={ClosedEye} alt="Closed-eye" />
                      )}
                    </div>
                    {formikAccount.touched.new_pin &&
                    formikAccount.errors.new_pin ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikAccount.errors.new_pin}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="container-form-password">
                    <Form.Label>{t("confirmPin")}</Form.Label>
                    <Form.Control
                      type="password"
                      name="pin_confirmation"
                      {...formikAccount.getFieldProps("pin_confirmation")}
                      className={validationAccount("pin_confirmation")}
                      required
                      id="show6"
                    />
                    <div className="wrapper-icon-password-account-information" onClick={() => showPassword6()}>
                      {stateShowPassword6 ? (
                        <img src={OpenEye} alt="Open-eye" />
                      ) : (
                        <img src={ClosedEye} alt="Closed-eye" />
                      )}
                    </div>
                    {formikAccount.touched.pin_confirmation &&
                    formikAccount.errors.pin_confirmation ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikAccount.errors.pin_confirmation}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>
                </>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            {t("close")}
          </Button>
          <Button variant="primary" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              `${t("saveChanges")}`
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
