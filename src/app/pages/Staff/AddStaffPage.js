import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  Container
} from "react-bootstrap";
import {
  Paper,
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch
} from "@material-ui/core";

import "../style.css";

import OpenEye from "../../../images/open-eye.png"
import ClosedEye from "../../../images/closed-eye.png"

export const AddStaffPage = ({ location }) => {
  const history = useHistory();
  const { allOutlets, allAccessLists, allRoles } = location.state;
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [stateShowPassword, setStateShowPassword] = React.useState(false)
  const [stateShowPassword2, setStateShowPassword2] = React.useState(false)
  const [stateShowPassword3, setStateShowPassword3] = React.useState(false)

  const [selectedPrivileges, setSelectedPrivileges] = React.useState([]);

  const initialValueStaff = {
    outlet_id: "",
    type: "Staff",
    role_id: "",
    name: "",
    staff_id: "",
    email: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
    pin: ""
  };
  const StaffSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAnOutlet")}`),
    type: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseChooseAType")}`),
    role_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseARole")}`),
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputProductName")}`),
    staff_id: Yup.string()
      .min(5)
      .max(10)
      .required(`${t("pleaseInputStaffID")}`),
    email: Yup.string()
      .email()
      .required(`${t("pleaseInputAnEmail")}`),
    phone_number: Yup.string()
      // .typeError(`${t("pleaseInputANumberOnly")}`)
      .matches(/^\d+$/, `${t("pleaseInputANumberOnly")}`)
      .max(15, `${t("maximum15Character")}`)
      .required(`${t("pleaseInputPhoneNumber")}`),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!#%*?&`~^]{8,20}$/,
        `${t("passwordAtLeastMustHaveOneLowercase,OneUppercase,OneNumeric,And8CharactersLongMinimum")}`
      )
      .required(`${t("pleaseInputAPassword")}`),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], `${t("passwordDoNotMatch")}`)
      .required(`${t("PleaseInputAPasswordConfirmation")}`),
    pin: Yup.string()
      .matches(/^\d+$/, `${t("pinMustBeNumbers")}`)
      .min(6)
      .max(6)
      .required(`${t("pleaseInputAPin")}`)
  });

  const formikStaff = useFormik({
    enableReinitialize: true,
    initialValues: initialValueStaff,
    validationSchema: StaffSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const staffData = {
        name: values.name,
        staff_id: values.staff_id,
        email: values.email,
        password: values.password,
        pin: values.pin,
        phone_number: values.phone_number,
        type: values.type,
        role_id: values.role_id,
        outlet_id: values.outlet_id
      };

      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/staff`, staffData);
        disableLoading();
        history.push("/staff");
      } catch (err) {
        console.error(err.response.data.message)
        setAlert(err.response?.data.message);
        disableLoading();
      }
    }
  });

  const validationStaff = (fieldname) => {
    if (formikStaff.touched[fieldname] && formikStaff.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikStaff.touched[fieldname] && !formikStaff.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  const handleChangeRole = (e) => {
    const { name, value } = e.target;

    if (!value) {
      return;
    }

    const selectedId = parseInt(value);
    formikStaff.setFieldValue(name, selectedId);

    const selectedRole = allRoles.find((item) => item.id === selectedId);

    const sortedPrivileges = selectedRole.Role_Privileges.sort(
      (a, b) => a.privilege_id - b.privilege_id
    );

    sortedPrivileges.map(value => {
      value.Privilege.name = camelize(value.Privilege.name)
    })

    // handle hide commisison management
    sortedPrivileges.map((value, index) => {
      if(value.name === 'commissionManagement') {
        delete sortedPrivileges[index]
      }
    })

    setSelectedPrivileges(sortedPrivileges);
  };

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

  const showPassword2 = () => {
    setStateShowPassword2(!stateShowPassword2)
    console.log("hellow brow")
    const password = document.getElementById('show2')
    if (password.type === 'password') {
      password.type = 'text'
    } else {
      password.type = 'password'
    }
  };

  const showPassword3 = () => {
    setStateShowPassword3(!stateShowPassword3)
    console.log("hellow brow")
    const password = document.getElementById('show3')
    if (password.type === 'password') {
      password.type = 'text'
    } else {
      password.type = 'password'
    }
  };

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <Form onSubmit={formikStaff.handleSubmit}>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>{t("addStaff")}</h3>
                </div>
                <div className="headerEnd">
                  <Link to="/staff">
                    <Button variant="secondary">{t("cancel")}</Button>
                  </Link>
                  <Button
                    variant="primary"
                    style={{ marginLeft: "0.5rem" }}
                    type="submit"
                  >
                    {t("save")}
                    {loading && (
                      <Spinner animation="border" variant="light" size="sm" />
                    )}
                  </Button>
                </div>
              </div>
              {alert ? <Row><Col><Alert variant="danger">{alert}</Alert></Col></Row> : ""}
              <Row style={{ padding: "1rem" }}>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("outlet")}*</Form.Label>
                    <Form.Control
                      as="select"
                      name="outlet_id"
                      autoComplete="new-password"
                      {...formikStaff.getFieldProps("outlet_id")}
                      className={validationStaff("outlet_id")}
                      required
                    >
                      <option value={""} disabled hidden>
                      {t("chooseOutlet")}
                      </option>
                      {allOutlets.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                    {formikStaff.touched.outlet_id &&
                    formikStaff.errors.outlet_id ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.outlet_id}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  {/* <Form.Group>
                    <Form.Label>Type*</Form.Label>
                    <Form.Control
                      as="select"
                      name="type"
                      {...formikStaff.getFieldProps("type")}
                      className={validationStaff("type")}
                      required
                    >
                      <option value={""} disabled hidden>
                        Choose Type
                      </option>
                      {["Kasir", "Waiter", "Staff", "Manager"].map(
                        (item, index) => {
                          return (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          );
                        }
                      )}
                    </Form.Control>
                    {formikStaff.touched.type && formikStaff.errors.type ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.type}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group> */}

                  <Form.Group>
                    <Form.Label>{t("role")}*</Form.Label>
                    <Form.Control
                      as="select"
                      name="role_id"
                      autoComplete="new-password"
                      {...formikStaff.getFieldProps("role_id")}
                      onChange={handleChangeRole}
                      onBlur={handleChangeRole}
                      className={validationStaff("role_id")}
                      required
                    >
                      <option value={""} disabled hidden>
                      {t("chooseRole")}
                      </option>
                      {allRoles.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                    {formikStaff.touched.role_id &&
                    formikStaff.errors.role_id ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.role_id}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>{t("name")}*</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      autoComplete="new-password"
                      {...formikStaff.getFieldProps("name")}
                      className={validationStaff("name")}
                      required
                    />
                    {formikStaff.touched.name && formikStaff.errors.name ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.name}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>{t("staffID")}*</Form.Label>
                    <Form.Control
                      type="text"
                      name="staff_id"
                      autoComplete="new-password"
                      {...formikStaff.getFieldProps("staff_id")}
                      className={validationStaff("staff_id")}
                      required
                    />
                    {formikStaff.touched.staff_id &&
                    formikStaff.errors.staff_id ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.staff_id}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>{t("email")}*</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      autoComplete="new-password"
                      {...formikStaff.getFieldProps("email")}
                      className={validationStaff("email")}
                      required
                    />
                    {formikStaff.touched.email && formikStaff.errors.email ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.email}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>{t("phoneNumber")}*</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone_number"
                      autoComplete="new-password"
                      {...formikStaff.getFieldProps("phone_number")}
                      className={validationStaff("phone_number")}
                      required
                    />
                    {formikStaff.touched.phone_number &&
                    formikStaff.errors.phone_number ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.phone_number}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="container-form-password">
                    <Form.Label>{t("password")}*</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      {...formikStaff.getFieldProps("password")}
                      className={validationStaff("password")}
                      required
                      id="show"
                    />
                    <div className="wrapper-icon-password-staff" onClick={() => showPassword()}>
                      {stateShowPassword ? (
                        <img src={OpenEye} alt="Open-eye" />
                      ) : (
                        <img src={ClosedEye} alt="Closed-eye" />
                      )}
                    </div>
                    {formikStaff.touched.password &&
                    formikStaff.errors.password ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.password}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="container-form-password">
                    <Form.Label>{t("passwordConfirmation")}*</Form.Label>
                    <Form.Control
                      type="password"
                      name="password_confirmation"
                      autoComplete="new-password"
                      {...formikStaff.getFieldProps("password_confirmation")}
                      className={validationStaff("password_confirmation")}
                      required
                      id="show2"
                    />
                    <div className="wrapper-icon-password-staff" onClick={() => showPassword2()}>
                      {stateShowPassword2 ? (
                        <img src={OpenEye} alt="Open-eye" />
                      ) : (
                        <img src={ClosedEye} alt="Closed-eye" />
                      )}
                    </div>
                    {formikStaff.touched.password_confirmation &&
                    formikStaff.errors.password_confirmation ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.password_confirmation}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group className="container-form-password">
                    <Form.Label>{t("pin")}*</Form.Label>
                    <Form.Control
                      type="password"
                      name="pin"
                      autoComplete="new-password"
                      {...formikStaff.getFieldProps("pin")}
                      className={validationStaff("pin")}
                      required
                      id="show3"
                    />
                    <div className="wrapper-icon-password-staff" onClick={() => showPassword3()}>
                      {stateShowPassword3 ? (
                        <img src={OpenEye} alt="Open-eye" />
                      ) : (
                        <img src={ClosedEye} alt="Closed-eye" />
                      )}
                    </div>
                    {formikStaff.touched.pin && formikStaff.errors.pin ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikStaff.errors.pin}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Paper>
        </Col>

        <Col>
          <Row>
            {selectedPrivileges.length
              ? allAccessLists.map((access) => {
                  return (
                    <Col key={access.id}>
                      <Paper
                        elevation={2}
                        style={{ padding: "1rem", height: "100%" }}
                      >
                        <h5>{access.name === 'Cashier' ? 'Frontend' : access.name} {t("accessList")}</h5>

                        <FormControl
                          component="fieldset"
                          style={{ width: "100%" }}
                        >
                          <FormGroup row>
                            <Container style={{ padding: "0" }}>
                              {selectedPrivileges.map((privilege, index) => {
                                if (
                                  access.name ===
                                  privilege.Privilege.Access.name
                                ) {
                                  return (
                                    <Row
                                      key={index}
                                      style={{ padding: "0.5rem 1rem" }}
                                    >
                                      <Col style={{ alignSelf: "center" }}>
                                        <Form.Label>
                                          {privilege.Privilege.name === "changingTransaction" ? `${t('deleteTransaction')}` : `${t(privilege.Privilege.name)}`}
                                        </Form.Label>
                                      </Col>
                                      <Col style={{ textAlign: "end" }}>
                                        <FormControlLabel
                                          key={privilege.Privilege.id}
                                          control={
                                            <Switch
                                              key={privilege.Privilege.id}
                                              value={privilege.Privilege.name}
                                              color="primary"
                                              checked={privilege.allow}
                                              style={{
                                                cursor: "not-allowed"
                                              }}
                                            />
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  );
                                } else {
                                  return "";
                                }
                              })}
                            </Container>
                          </FormGroup>
                        </FormControl>
                      </Paper>
                    </Col>
                  );
                })
              : ""}
          </Row>
        </Col>
      </Row>
    </>
  );
};
