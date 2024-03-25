import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import imageCompression from 'browser-image-compression';
import {
  Button,
  Row,
  Col,
  Form,
  Alert,
  Spinner,
  Container,
  ListGroup
} from "react-bootstrap";
import {
  IconButton,
  Paper,
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";

import "../style.css";

import OpenEye from "../../../images/open-eye.png"
import ClosedEye from "../../../images/closed-eye.png"

export const DetailStaffPage = ({ match, location }) => {
  const { staffId } = match.params;
  const { allOutlets, allRoles, allAccessLists } = location.state;
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [statePage, setStatePage] = React.useState("show");
  const [preview, setPreview] = React.useState("");

  const [stateShowPassword, setStateShowPassword] = React.useState(false)
  const [stateShowPassword2, setStateShowPassword2] = React.useState(false)

  const [selectedRole, setSelectedRole] = React.useState("");
  const [image, setImage] = React.useState("");
  const [business, setBusiness] = React.useState({
    id:"",
  })
  const [staff, setStaff] = React.useState({
    outlet_id: "",
    staff_id: "",
    type: "",
    role_id: "",
    name: "",
    email: "",
    phone_number: "",
    location_name: "",
    password: "",
    pin: ""
  });
  const [staffInitial, setStaffInitial] = React.useState({
    outlet_id: "",
    staff_id: "",
    type: "",
    role_id: "",
    name: "",
    email: "",
    phone_number: "",
    location_name: "",
    password: "",
    pin: ""
  });

  const [attendance, setAttendance] = React.useState([]);

  // const allTypes = ["Staff", "Manager", "Kasir", "Waiter"];

  const getBusinessInfo = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"))

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/business/${userInfo.business_id}`
      );
      const businessInfo = {
        id : data.data.id
      }
      setBusiness(businessInfo);
    } catch (err) {
      console.log(err);
    }
  };

  const StaffSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAnOutlet")}`),
    type: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Chartacter")}`)
      .required(`${t("pleaseChooseAType")}`),
    role_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseARole")}`),
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputaStaffName")}`),
    staff_id: Yup.string()
      .min(5)
      .max(10)
      .required(`${t("pleaseInputAStaffID")}`),
    email: Yup.string()
      .email()
      .required(`${t("pleaseInputAnEmail")}`),
    phone_number: Yup.string()
    .max(15, `${t("maximum15Character")}`)
    .typeError(`${t("pleaseInputANumberOnly")}`)
  });

  const formikStaff = useFormik({
    enableReinitialize: true,
    initialValues: staff,
    validationSchema: StaffSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      console.log("formikStaff", values)
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("staff_id", values.staff_id);
      formData.append("email", values.email);
      formData.append("role_id", values.role_id);
      formData.append("type", values.type);
      if(values.password){
        formData.append("password", values.password)
      }
      if(values.pin) {
        formData.append("pin", values.pin)
      }
      if (image.name) {
        formData.append("profile_picture", image);
      }
      formData.append("phone_number", values.phone_number);
      formData.append("outlet_id", values.outlet_id);

      try {
        enableLoading();
        // await axios.put(`${API_URL}/api/v1/staff/update-development/${staffId}`, formData);
        await axios.put(`${API_URL}/api/v1/staff/${staffId}`, formData);
        disableLoading();
        setAlert("");
        setStatePage("show");
      } catch (err) {
        console.log("error edit staff", err)
        setAlert(err.response.data.message || err.message);
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

  const getStaff = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/staff/${id}`);
      console.log("data staff", data.data)
      setStaff({
        outlet_id: data.data.outlet_id,
        staff_id: data.data.User.staff_id,
        business_id: data.data.business_id,
        name: data.data.name,
        email: data.data.User.email,
        phone_number: data.data.phone_number,
        type: data.data.User.type,
        role_id: data.data.User.role_id,
        location_name: data.data.Outlet?.name
      });
      setStaffInitial({
        outlet_id: data.data.outlet_id,
        staff_id: data.data.User.staff_id,
        business_id: data.data.business_id,
        name: data.data.name,
        email: data.data.User.email,
        phone_number: data.data.phone_number,
        type: data.data.User.type,
        role_id: data.data.User.role_id,
        location_name: data.data.Outlet.Location?.name
      });

      setImage(
        `${
          data.data.profile_picture
            ? `${API_URL}/${data.data.profile_picture}`
            : ""
        }`
      );

      setSelectedRole(parseInt(data.data.User.role_id));
    } catch (err) {
      console.log(err);
    }
  };

  const getAttendance = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/attendance?user_id=${id}`
      );
      const newest = data.data.sort((a, b) => b.id - a.id);
      const latest = newest.slice(0, 5);
      setAttendance(latest);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getStaff(staffId);
    getAttendance(staffId);
  }, [staffId]);

  const handleImage = (e) => {
    let preview;
    let img;
    // console.log('File Gambar', e.target.files[0])
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          console.log("reader.result", reader.result)
            setPreview(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      console.log("img", img)
      setImage(img)
    } else {
      preview = "";
    }
  };

  const handleStatePage = () => {
    if (statePage === "show") {
      setStatePage("edit");
    } else {
      formikStaff.resetForm();
      setSelectedRole(parseInt(staffInitial.role_id));
      setStatePage("show");
    }
  };
  
  const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }


  const privilegesData = (role_id) => {
    if (!role_id) {
      return [];
    }
    const staffPrivileges = allRoles.find((item) => item.id === selectedRole);
    const sortedPrivileges = staffPrivileges.Role_Privileges.sort(
      (a, b) => a.privilege_id - b.privilege_id
    );
    sortedPrivileges.map(value => {
      value.Privilege.name = camelize(value.Privilege.name)
    })
    return sortedPrivileges;
  };

  const columns = [
    {
      name: `${t("date")}`,
      selector: "date",
      sortable: true
    },
    {
      name: `${t("checkIn")}`,
      selector: "check_in",
      sortable: true
    },
    {
      name: `${t("checkOut")}`,
      selector: "check_out",
      sortable: true
    }
  ];

  const dataAttendance = attendance.map((item) => {
    return {
      date: dayjs(item.createdAt).format("dddd, DD/MM/YYYY"),
      check_in: dayjs(item.clock_in).format("HH:mm"),
      check_out: item.clock_out ? dayjs(item.clock_out).format("HH:mm") : "-",
      check_in_image: item.image_in,
      check_out_image: item.image_out
    };
  });

  const ExpandableComponent = ({ data }) => {
    const keys = [
      {
        key: "Check In Image",
        value: "check_in_image"
      },
      {
        key: "Check Out Image",
        value: "check_out_image"
      }
    ];

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              <Col sm={4}></Col>
              <Col style={{ fontWeight: "700" }}>{t("checkInImage")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("checkOutImage")}</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col sm={4}></Col>
              {keys.map((val, index) => {
                return (
                  <Col key={index}>
                    {data[val.value] ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${
                          data[val.value]
                        }`}
                        alt="attendance-img"
                        style={{
                          width: "120px",
                          height: "auto"
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </Col>
                );
              })}
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </>
    );
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

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            {alert ? <Alert variant="danger">{alert}</Alert> : ""}

            <Form onSubmit={formikStaff.handleSubmit}>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>{t("staffInformation")}</h3>
                </div>

                <div className="headerEnd">
                  {statePage === "show" ? (
                    <Link to="/staff">
                      <Button
                        variant="secondary"
                        style={{ marginRight: "1rem" }}
                      >
                        {t("backToStaffList")}
                      </Button>
                    </Link>
                  ) : (
                    ""
                  )}

                  <Button
                    variant={statePage === "show" ? "primary" : "secondary"}
                    onClick={handleStatePage}
                  >
                    {statePage === "show" ? `${t("editStaffData")}` : `${t("cancel")}`}
                  </Button>

                  {statePage === "show" ? (
                    ""
                  ) : (
                    <Button
                      variant="primary"
                      style={{ marginLeft: "1rem" }}
                      type="submit"
                    >
                      {loading ? (
                        <Spinner animation="border" variant="light" size="sm" />
                      ) : (
                        `${t("save")}`
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <Row style={{ padding: "1rem" }}>
                <Col md={3}>
                  <Paper
                    elevation={2}
                    style={{
                      width: "120px",
                      height: "120px",
                      overflow: "hidden",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: `url(${preview || image})`
                    }}
                  >
                    {statePage === "edit" ? (
                      <>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="icon-button-file"
                          type="file"
                          onChange={handleImage}
                        />
                        <label htmlFor="icon-button-file">
                          <IconButton
                            color="secondary"
                            aria-label="upload picture"
                            component="span"
                            style={{
                              position: "absolute",
                              left: "-5px",
                              top: "-20px"
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </label>
                      </>
                    ) : (
                      ""
                    )}
                  </Paper>

                  <p className="text-muted mt-1">
                    {t("allowedFileTypes")}: .png, .jpg, .jpeg | {t("fileSizeLimit")}: 2MB
                  </p>
                </Col>

                <Col md={3}>
                  <div className="title">{t("staffName")}</div>
                  {statePage === "show" ? (
                    <h5 className="mb-5">{formikStaff.values.name}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="name"
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
                    </>
                  )}

                  <div className="title">{t("staffEmail")}</div>
                  {statePage === "show" ? (
                    <h5>{formikStaff.values.email}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="email"
                        name="email"
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
                    </>
                  )}

                  {/* <div className="title">Staff ID</div>
                  {statePage === "show" ? (
                    <h5>{formikStaff.values.staff_id}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="staff_id"
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
                    </>
                  )} */}
                  
                  {statePage === "edit" ? (
                    <>
                      <div className="container-form-password">
                        <div className="title mt-5">{t("password")} ({t("optional")})</div>
                        <Form.Control
                          style={{paddingRight: '40px'}}
                          type="password"
                          name="password"
                          placeholder={t('pleaseInsertForUpdate')}
                          onChange={(e) => {
                            formikStaff.setFieldValue("password", e.target.value)
                          }}
                          id="show"
                        />
                        <div className="wrapper-icon-password-detail-staff" onClick={() => showPassword()}>
                          {stateShowPassword ? (
                            <img src={OpenEye} alt="Open-eye" />
                          ) : (
                            <img src={ClosedEye} alt="Closed-eye" />
                          )}
                        </div>
                      </div>
                    </>
                  ) : null }
                </Col>

                <Col md={3}>
                  <div className="title">{t("staffRole")}</div>
                  {statePage === "show" ? (
                    allRoles.map((item) => {
                      if (item.id === parseInt(formikStaff.values.role_id)) {
                        return (
                          <h5 key={item.id} className="mb-5">
                            {item.name}
                          </h5>
                        );
                      }

                      return "";
                    })
                  ) : (
                    <>
                      <Form.Control
                        as="select"
                        name="role_id"
                        {...formikStaff.getFieldProps("role_id")}
                        onChange={(e) => {
                          const { value } = e.target;
                          formikStaff.setFieldValue("role_id", value);
                          setSelectedRole(parseInt(value));
                        }}
                        onBlur={(e) => {
                          const { value } = e.target;
                          formikStaff.setFieldValue("role_id", value);
                          setSelectedRole(parseInt(value));
                        }}
                        className={validationStaff("email")}
                        required
                      >
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
                    </>
                  )}

                  <div className="title">{t("staffID")}</div>
                  {statePage === "show" ? (
                    <div>
                    <span contentEditable={false}>
                      <h5>{formikStaff.values.business_id}-{formikStaff.values.staff_id}</h5>
                    </span>
                    {/* <h5>{formikStaff.values.staff_id}</h5> */}
                    </div>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="staff_id"
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
                    </>
                  )}

                  {/* <div className="title">Staff Type</div>
                  {statePage === "show" ? (
                    <h5>{formikStaff.values.type}</h5>
                  ) : (
                    <>
                      <Form.Control
                        as="select"
                        name="type"
                        {...formikStaff.getFieldProps("type")}
                        className={validationStaff("type")}
                        required
                      >
                        {allTypes.map((item, index) => {
                          return (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          );
                        })}
                      </Form.Control>
                      {formikStaff.touched.type && formikStaff.errors.type ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikStaff.errors.type}
                          </div>
                        </div>
                      ) : null}
                    </>
                  )} */}
                  {statePage === "edit" ? (
                    <>
                      <div className="container-form-password">
                        <div className="title mt-5">{t("pin")} ({t("optional")})</div>
                        <Form.Control
                          style={{paddingRight: '40px'}}
                          type="password"
                          name="pin"
                          placeholder={t('pleaseInsertForUpdate')}
                          onChange={(e) => {
                            formikStaff.setFieldValue("pin", e.target.value)
                          }}
                          id="show2"
                        />
                        <div className="wrapper-icon-password-detail-staff" onClick={() => showPassword2()}>
                          {stateShowPassword2 ? (
                            <img src={OpenEye} alt="Open-eye" />
                          ) : (
                            <img src={ClosedEye} alt="Closed-eye" />
                          )}
                        </div>
                      </div>
                    </>
                  ) : null }
                </Col>

                <Col md={3}>
                  <div className="title">{t("outlet")}</div>
                  {statePage === "show" ? (
                    <h5 className="mb-5">{formikStaff.values.location_name}</h5>
                  ) : (
                    <>
                      <Form.Control
                        as="select"
                        name="outlet_id"
                        {...formikStaff.getFieldProps("outlet_id")}
                        className={validationStaff("outlet_id")}
                        required
                      >
                        {allOutlets.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {/* {item.Location?.name} */}
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
                    </>
                  )}

                  <div className="title">{t("staffPhoneNumber")}</div>
                  {statePage === "show" ? (
                    <h5>{formikStaff.values.phone_number}</h5>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        name="phone_number"
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
                    </>
                  )}
                </Col>
              </Row>

              <Row className="lineBottom">
                <Col>
                  <div className="headerPage">
                    <div className="headerStart">
                      <h3>{t("attendance")}</h3>
                    </div>
                  </div>

                  <DataTable
                    noHeader
                    columns={columns}
                    data={dataAttendance}
                    style={{ padding: "1rem" }}
                    expandableRows
                    expandableRowsComponent={ExpandableComponent}
                    noDataComponent={t('thereAreNoRecordsToDisplay')}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="headerPage">
                    <div className="headerStart">
                      <h3>{t("accessList")}</h3>
                    </div>
                  </div>

                  <Row>
                    {selectedRole
                      ? allAccessLists.map((access) => {
                          return (
                            <Col key={access.id} style={{ paddingTop: "1rem" }}>
                              <Paper
                                elevation={2}
                                style={{ padding: "1rem", height: "100%" }}
                              >
                                <h5>{access.name} Access List</h5>

                                <FormControl
                                  component="fieldset"
                                  style={{ width: "100%" }}
                                >
                                  <FormGroup row>
                                    <Container style={{ padding: "0" }}>
                                      {privilegesData(selectedRole).map(
                                        (privilege, index) => {
                                          if (
                                            access.name ===
                                            privilege.Privilege.Access.name
                                          ) {
                                            return (
                                              <Row
                                                key={index}
                                                style={{
                                                  padding: "0.5rem 1rem"
                                                }}
                                              >
                                                <Col
                                                  style={{
                                                    alignSelf: "center"
                                                  }}
                                                >
                                                  <Form.Label>
                                                    {privilege.Privilege.name === "changingTransaction" ? `${t('deleteTransaction')}` : `${t(privilege.Privilege.name)}`}
                                                  </Form.Label>
                                                </Col>
                                                <Col
                                                  style={{ textAlign: "end" }}
                                                >
                                                  <FormControlLabel
                                                    key={privilege.Privilege.id}
                                                    control={
                                                      <Switch
                                                        key={
                                                          privilege.Privilege.id
                                                        }
                                                        value={
                                                          privilege.Privilege
                                                            .name
                                                        }
                                                        color="primary"
                                                        checked={
                                                          privilege.allow
                                                        }
                                                        style={{
                                                          cursor: "not-allowed"
                                                        }}
                                                        disabled
                                                      />
                                                    }
                                                  />
                                                </Col>
                                              </Row>
                                            );
                                          } else {
                                            return "";
                                          }
                                        }
                                      )}
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
            </Form>
          </Paper>
        </Col>
      </Row>
    </>
  );
};
