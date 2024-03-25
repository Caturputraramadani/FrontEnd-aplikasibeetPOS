import React from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import axios from 'axios'
import DatePicker from 'react-date-picker';
import { useFormik } from "formik";
import * as Yup from "yup";

const ModalPersonal = ({
  showModalPersonal,
  closePersonalModal,
  token
}) => {
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [imageKtp, setImageKtp] = React.useState("");
  const [allBank, setAllBank] = React.useState([])
  const [date, setDate] = React.useState(new Date())

  const getAllBank = async () => {
    try {
      const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/bank`)
      setAllBank(data.data.rows)
    } catch (error) {
      console.log("Error get all bank", error)
    }
  }

  const [personal, setPersonal] = React.useState({
    name_on_ktp: "",
    birth_date: "",
    name_on_bank: "",
    bank_name: "",
    ktp_number: "",
    account_number: ""
  });

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);
  

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 3 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

  const PersonalSchema = Yup.object().shape({
    name_on_ktp: Yup.string()
      .min(3, `Minimum 3 Character`)
      .max(50, `Maximum 50 Character`)
      .required("Please input a ktp name."),
    name_on_bank: Yup.string()
      .min(3, `Minimum 3 Character`)
      .max(50, `Maximum 50 Character`)
      .required("Please input name on bank."),
    bank_name: Yup.string()
      .min(3, `Minimum 3 Character`)
      .max(50, `Maximum 50 Character`)
      .required("Please input name bank."),
    ktp_number: Yup.number()
      .typeError("Please input a number only")
      .test("ktp_number", "Must exactly 16 digits", (val) =>
        val ? val.toString().length === 16 : ""
      )
      .required("Please input a ktp_number"),
    account_number: Yup.number()
      .typeError("Please input a number only")
      .required("Please input a account number"),
  });

  const formikPersonal = useFormik({
    enableReinitialize: true,
    initialValues: personal,
    validationSchema: PersonalSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const data = {
        ktp_owner: values.ktp_number,
        birth_date: values.birth_date,
        name_on_bank: values.name_on_bank,
        bank_name: values.bank_name,
        name_on_ktp: values.name_on_ktp,
        account_number: values.account_number
      }

      // const formData = new FormData();
      // formData.append("ktp_owner", values.ktp_number);
      // formData.append("birth_date", values.birth_date);
      // formData.append("name_on_bank", values.name_on_bank);
      // formData.append("bank_name", values.bank_name);
      // formData.append("name_on_ktp", values.name_on_ktp);
      // formData.append("account_number", values.account_number);
      // if (imageKtp.name) {
      //   console.log("imageKtp.name", imageKtp.name)
      //   formData.append("ktp_picture", imageKtp);
      // }
      try {
        enableLoading();
        await axios.patch(
          `${API_URL}/api/v1/business/update-personal/${userInfo.business_id}`,
          data, {
            headers: {
              Authorization: token
            }
          }
        );
        disableLoading();
        // redirectToDashboard()
      } catch (err) {
        console.log("error apa", err)
        disableLoading();
      }
    }
  });

  const handlePreviewPhoto = async (file) => {
    setAlertPhoto("");
    let preview;
    let img;
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    if (file.length) {
      const reader = new FileReader();
      reader.onload = () => {
        if(reader.readyState === 2){
          // console.log("reader.result", reader.result)
          setPhotoPreview(reader.result);
        }
      }
      reader.readAsDataURL(file[0])
      img = file[0];
      const formData = new FormData()
      formData.append("ktp_picture", img);
      const {data} = await axios.patch(`${API_URL}/api/v1/business/ocr-ktp/${userInfo.business_id}`, formData,
        {
          headers: {
            Authorization: token
          }
        }
      )
      if (data.data[0].length > 15) {
        formikPersonal.setFieldValue("ktp_number", data.data[0]);
      }
      // setImageKtp(img)
    } else {
      preview = "";
      setAlertPhoto("file is too large or not supported");
    }
  };

  
  const validationPersonal = (fieldname) => {
    if (formikPersonal.touched[fieldname] && formikPersonal.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikPersonal.touched[fieldname] && !formikPersonal.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const handleBankName = (e, formik) => {
    const bank_name = e.target.value;
    formik.setFieldValue("bank_name", bank_name);
  };

  const handleChangeBirthDay = (value) => {
    setDate(value)
    formikPersonal.setFieldValue("birth_date", value);
  }

  React.useEffect(() => {
    getAllBank()
    console.log("new date", new Date())
  }, [])

  return (
    <Modal show={showModalPersonal} onHide={closePersonalModal}>
      <Modal.Header closeButton>
        <Modal.Title>Personal Form *</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikPersonal.handleSubmit}>
        <Modal.Body>
            <Form.Group>
              <Form.Label>Photo KTP</Form.Label>
              {alertPhoto ? <Alert variant="danger">{alertPhoto}</Alert> : ""}
              <div
                {...getRootProps({
                  className: "boxDashed dropzone"
                })}
              >
                <input {...getInputProps()} />
                {!photoPreview ? (
                  <>
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                    <p style={{ color: "gray" }}>file size limit: 2mb</p>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        margin: "auto",
                        width: "180px",
                        height: "120px",
                        overflow: "hidden",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundImage: `url(${photoPreview || photo})`
                      }}
                    />
                    <small>
                      {photo?.name
                        ? `${photo.name} - ${photo.size} bytes`
                        : ""}
                    </small>
                  </>
                )}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Name on ID Card (KTP)</Form.Label>
              <Form.Control
                type="text"
                name="name_on_ktp"
                placeholder="Enter Name on KTP"
                {...formikPersonal.getFieldProps("name_on_ktp")}
                className={validationPersonal("name_on_ktp")}
                required
              />
              {formikPersonal.touched.name_on_ktp && formikPersonal.errors.name_on_ktp ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikPersonal.errors.name_on_ktp}
                  </div>
                </div>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>ID Card (KTP) Number</Form.Label>
              <Form.Control
                type="text"
                name="ktp_number"
                placeholder="Enter KTP Number"
                {...formikPersonal.getFieldProps("ktp_number")}
                className={validationPersonal("ktp_number")}
                required
              />
              {formikPersonal.touched.ktp_number && formikPersonal.errors.ktp_number ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikPersonal.errors.ktp_number}
                  </div>
                </div>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>Date of Birth</Form.Label>
              <div></div>
              <DatePicker
                onChange={handleChangeBirthDay}
                value={date}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Name on Bank Account</Form.Label>
              <Form.Control
                type="text"
                name="name_on_bank"
                placeholder="Enter Name on Bank Account"
                {...formikPersonal.getFieldProps("name_on_bank")}
                className={validationPersonal("name_on_bank")}
                required
              />
              {formikPersonal.touched.name_on_bank && formikPersonal.errors.name_on_bank ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikPersonal.errors.name_on_bank}
                  </div>
                </div>
              ) : null}
            </Form.Group>
            
            <Form.Group>
              <Form.Label>Select Bank Name</Form.Label>
              <Form.Control
                as="select"
                name="bank_name"
                value={formikPersonal.getFieldProps("bank_name").value}
                onChange={(e) => handleBankName(e, formikPersonal)}
                onBlur={(e) => handleBankName(e, formikPersonal)}
                className={validationPersonal("bank_name")}
                required
              >
                <option value="" disabled hidden>
                  Bank Name
                </option>
                {allBank?.length
                  ? allBank.map((item) => {
                      return (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      );
                    })
                  : ""}
              </Form.Control>
              {formikPersonal.touched.bank_name &&
              formikPersonal.errors.bank_name ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikPersonal.errors.bank_name}
                  </div>
                </div>
              ) : null}
            </Form.Group>

            {/* <Form.Group>
              <Form.Label>Bank Name</Form.Label>
              <Form.Control
                type="text"
                name="bank_name"
                placeholder="Enter KTP Number"
                {...formikPersonal.getFieldProps("bank_name")}
                className={validationPersonal("bank_name")}
                required
              />
              {formikPersonal.touched.bank_name && formikPersonal.errors.bank_name ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikPersonal.errors.bank_name}
                  </div>
                </div>
              ) : null}
            </Form.Group> */}

            <Form.Group>
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                name="account_number"
                placeholder="Enter Account Number"
                {...formikPersonal.getFieldProps("account_number")}
                className={validationPersonal("account_number")}
                required
              />
              {formikPersonal.touched.account_number && formikPersonal.errors.account_number ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    {formikPersonal.errors.account_number}
                  </div>
                </div>
              ) : null}
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            className="px-9 py-4 mx-2"
            variant="primary"
            // onClick={() => submitFormPersonal()}
          >
            Submit
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalPersonal;
