import React from 'react';
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { saveAs } from 'file-saver'
import fileDownload from 'js-file-download'

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios'

const ModalFormCashlez = ({showModalFormCz, closeFormCzModal}) => {
  console.log("modal form cashlez")

  const InitialFormCz = {
    nama_pemilik: "",
    tempat_tanggal_lahir: "",
    alamat_pemilik_merchant: "",
    kota: "",
    provinsi: "",
    kode_pos: "",
    nomor_hp_merchant: "",
    alamat_email_pemilik_merchant: "",
    ktp: "",
    kk: "",
    nama_merchant: "",
    alamat_usaha_merchant: "",
    kota_merchant: "",
    provinsi_merchant: "",
    kode_pos_merchant: "",
    tipe_usaha_merchant: "",
    status_usaha: "",
    nomor_telp_merchant: "",
    alamat_email_merchant: "",
    bentuk_bidang_usaha: "",
    deskripsi_produk: "",
    nama_bank: "",
    nomor_rekening: "",
    nama_pemilik_rekening: "",
    hari: "",
    tanggal: ""
  }

  const FormCzSchema = Yup.object().shape({
    // nama_pemilik: Yup.string()
    //   .min(3, `Minimum 3 Character`)
    //   .max(50, `Maximum 50 Character`)
    //   .required("Please input a ktp name."),
    // tempat_tanggal_lahir: Yup.string()
    //   .min(3, `Minimum 3 Character`)
    //   .max(50, `Maximum 50 Character`)
    //   .required("Please input name on bank."),
    // alamat_pemilik_merchant: Yup.string()
    //   .min(3, `Minimum 3 Character`)
    //   .max(50, `Maximum 50 Character`)
    //   .required("Please input name bank."),
    // kota: Yup.number()
    //   .typeError("Please input a number only")
    //   .test("ktp_number", "Must exactly 16 digits", (val) =>
    //     val ? val.toString().length === 16 : ""
    //   )
    //   .required("Please input a ktp_number"),
    // provinsi: Yup.number()
    //   .typeError("Please input a number only")
    //   .required("Please input a account number"),
  });

  const formikFormCz = useFormik({
    enableReinitialize: true,
    initialValues: InitialFormCz,
    validationSchema: FormCzSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      console.log("userInfo", userInfo)
      const dataSend = {
        nama_pemilik: values.nama_pemilik,
        tempat_tanggal_lahir: values.tempat_tanggal_lahir,
        alamat_pemilik_merchant: values.alamat_pemilik_merchant,
        kota: values.kota,
        provinsi: values.provinsi,
        kode_pos: values.kode_pos,
        nomor_hp_merchant: values.nomor_hp_merchant,
        alamat_email_pemilik_merchant: values.alamat_email_pemilik_merchant,
        ktp: values.ktp,
        kk: values.kk,
        nama_merchant: values.nama_merchant,
        alamat_usaha_merchant: values.alamat_usaha_merchant,
        kota_merchant: values.kota_merchant,
        provinsi_merchant: values.provinsi_merchant,
        kode_pos_merchant: values.kode_pos_merchant,
        tipe_usaha_merchant: values.tipe_usaha_merchant,
        status_usaha: values.status_usaha,
        nomor_telp_merchant: values.nomor_telp_merchant,
        alamat_email_merchant: values.alamat_email_merchant,
        bentuk_bidang_usaha: values.bentuk_bidang_usaha,
        deskripsi_produk: values.deskripsi_produk,
        nama_bank: values.nama_bank,
        nomor_rekening: values.nomor_rekening,
        nama_pemilik_rekening: values.nama_pemilik_rekening,
        // hari: values.hari,
        // tanggal: values.tanggal
      }
      console.log("data form cz", dataSend)
      try {
        const {data} = await axios.post(`${API_URL}/api/v1/modify-pdf`, dataSend, {
          responseType: "blob"
        });
        console.log("result axios.post", data)
        // const blob = new Blob([data], { type: 'application/pdf' })
        // saveAs(blob, 'test.pdf')
        await fileDownload(data, 'test123.pdf')

      } catch (err) {
        console.log("error apa", err)
      }
    }
  });

  const validationFormCz = (fieldname) => {
    if (formikFormCz.touched[fieldname] && formikFormCz.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikFormCz.touched[fieldname] && !formikFormCz.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const handleSubmit = async () => {
    try {
      formikFormCz.submitForm()
      console.log("handle submit", formikFormCz.values)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Modal size="lg" show={showModalFormCz} onHide={closeFormCzModal}>
        <Modal.Header closeButton>
          <Modal.Title>Test Form Cashlez</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Owner Name</Form.Label>
            <Form.Control
              name="nama_pemilik"
              placeholder="Enter Owner Name"
              {...formikFormCz.getFieldProps("nama_pemilik")}
              className={validationFormCz("nama_pemilik")}
              required
            />
            {formikFormCz.touched.nama_pemilik && formikFormCz.errors.nama_pemilik ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.nama_pemilik}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>Place and Date of Birth</Form.Label>
            <Form.Control
              name="tempat_tanggal_lahir"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("tempat_tanggal_lahir")}
              className={validationFormCz("tempat_tanggal_lahir")}
              required
            />
            {formikFormCz.touched.tempat_tanggal_lahir && formikFormCz.errors.tempat_tanggal_lahir ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.tempat_tanggal_lahir}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>alamat_pemilik_merchant</Form.Label>
            <Form.Control
              name="alamat_pemilik_merchant"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("alamat_pemilik_merchant")}
              className={validationFormCz("alamat_pemilik_merchant")}
              required
            />
            {formikFormCz.touched.alamat_pemilik_merchant && formikFormCz.errors.alamat_pemilik_merchant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.alamat_pemilik_merchant}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>kota</Form.Label>
            <Form.Control
              name="kota"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("kota")}
              className={validationFormCz("kota")}
              required
            />
            {formikFormCz.touched.kota && formikFormCz.errors.kota ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.kota}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>provinsi</Form.Label>
            <Form.Control
              name="provinsi"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("provinsi")}
              className={validationFormCz("provinsi")}
              required
            />
            {formikFormCz.touched.provinsi && formikFormCz.errors.provinsi ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.provinsi}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>kode_pos</Form.Label>
            <Form.Control
              name="kode_pos"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("kode_pos")}
              className={validationFormCz("kode_pos")}
              required
            />
            {formikFormCz.touched.kode_pos && formikFormCz.errors.kode_pos ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.kode_pos}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>nomor_hp_merchant</Form.Label>
            <Form.Control
              name="nomor_hp_merchant"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("nomor_hp_merchant")}
              className={validationFormCz("nomor_hp_merchant")}
              required
            />
            {formikFormCz.touched.nomor_hp_merchant && formikFormCz.errors.nomor_hp_merchant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.nomor_hp_merchant}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>alamat_email_pemilik_merchant</Form.Label>
            <Form.Control
              name="alamat_email_pemilik_merchant"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("alamat_email_pemilik_merchant")}
              className={validationFormCz("alamat_email_pemilik_merchant")}
              required
            />
            {formikFormCz.touched.alamat_email_pemilik_merchant && formikFormCz.errors.alamat_email_pemilik_merchant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.alamat_email_pemilik_merchant}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>ktp</Form.Label>
            <Form.Control
              name="ktp"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("ktp")}
              className={validationFormCz("ktp")}
              required
            />
            {formikFormCz.touched.ktp && formikFormCz.errors.ktp ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.ktp}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>kk</Form.Label>
            <Form.Control
              name="kk"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("kk")}
              className={validationFormCz("kk")}
              required
            />
            {formikFormCz.touched.kk && formikFormCz.errors.kk ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.kk}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>nama_merchant</Form.Label>
            <Form.Control
              name="nama_merchant"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("nama_merchant")}
              className={validationFormCz("nama_merchant")}
              required
            />
            {formikFormCz.touched.nama_merchant && formikFormCz.errors.nama_merchant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.nama_merchant}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>alamat_usaha_merchant</Form.Label>
            <Form.Control
              name="alamat_usaha_merchant"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("alamat_usaha_merchant")}
              className={validationFormCz("alamat_usaha_merchant")}
              required
            />
            {formikFormCz.touched.alamat_usaha_merchant && formikFormCz.errors.alamat_usaha_merchant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.alamat_usaha_merchant}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>kota_merchant</Form.Label>
            <Form.Control
              name="kota_merchant"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("kota_merchant")}
              className={validationFormCz("kota_merchant")}
              required
            />
            {formikFormCz.touched.kota_merchant && formikFormCz.errors.kota_merchant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.kota_merchant}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>provinsi_merchant</Form.Label>
            <Form.Control
              name="provinsi_merchant"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("provinsi_merchant")}
              className={validationFormCz("provinsi_merchant")}
              required
            />
            {formikFormCz.touched.provinsi_merchant && formikFormCz.errors.provinsi_merchant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.provinsi_merchant}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>kode_pos_merchant</Form.Label>
            <Form.Control
              name="kode_pos_merchant"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("kode_pos_merchant")}
              className={validationFormCz("kode_pos_merchant")}
              required
            />
            {formikFormCz.touched.kode_pos_merchant && formikFormCz.errors.kode_pos_merchant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.kode_pos_merchant}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>tipe_usaha_merchant</Form.Label>
            <Form.Control
              name="tipe_usaha_merchant"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("tipe_usaha_merchant")}
              className={validationFormCz("tipe_usaha_merchant")}
              required
            />
            {formikFormCz.touched.tipe_usaha_merchant && formikFormCz.errors.tipe_usaha_merchant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.tipe_usaha_merchant}
                </div>
              </div>
            ) : null}
          </Form.Group>
          {/* <Form.Group>
            <Form.Label>status_usaha</Form.Label>
            <Form.Control
              name="status_usaha"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("status_usaha")}
              className={validationFormCz("status_usaha")}
              required
            />
            {formikFormCz.touched.status_usaha && formikFormCz.errors.status_usaha ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.status_usaha}
                </div>
              </div>
            ) : null}
          </Form.Group> */}
          <Form.Group>
            <Form.Label>nomor_telp_merchant</Form.Label>
            <Form.Control
              name="nomor_telp_merchant"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("nomor_telp_merchant")}
              className={validationFormCz("nomor_telp_merchant")}
              required
            />
            {formikFormCz.touched.nomor_telp_merchant && formikFormCz.errors.nomor_telp_merchant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.nomor_telp_merchant}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>alamat_email_merchant</Form.Label>
            <Form.Control
              name="alamat_email_merchant"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("alamat_email_merchant")}
              className={validationFormCz("alamat_email_merchant")}
              required
            />
            {formikFormCz.touched.alamat_email_merchant && formikFormCz.errors.alamat_email_merchant ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.alamat_email_merchant}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>bentuk_bidang_usaha</Form.Label>
            <Form.Control
              name="bentuk_bidang_usaha"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("bentuk_bidang_usaha")}
              className={validationFormCz("bentuk_bidang_usaha")}
              required
            />
            {formikFormCz.touched.bentuk_bidang_usaha && formikFormCz.errors.bentuk_bidang_usaha ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.bentuk_bidang_usaha}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>deskripsi_produk</Form.Label>
            <Form.Control
              name="deskripsi_produk"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("deskripsi_produk")}
              className={validationFormCz("deskripsi_produk")}
              required
            />
            {formikFormCz.touched.deskripsi_produk && formikFormCz.errors.deskripsi_produk ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.deskripsi_produk}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>nama_bank</Form.Label>
            <Form.Control
              name="nama_bank"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("nama_bank")}
              className={validationFormCz("nama_bank")}
              required
            />
            {formikFormCz.touched.nama_bank && formikFormCz.errors.nama_bank ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.nama_bank}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>nomor_rekening</Form.Label>
            <Form.Control
              name="nomor_rekening"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("nomor_rekening")}
              className={validationFormCz("nomor_rekening")}
              required
            />
            {formikFormCz.touched.nomor_rekening && formikFormCz.errors.nomor_rekening ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.nomor_rekening}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>nama_pemilik_rekening</Form.Label>
            <Form.Control
              name="nama_pemilik_rekening"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("nama_pemilik_rekening")}
              className={validationFormCz("nama_pemilik_rekening")}
              required
            />
            {formikFormCz.touched.nama_pemilik_rekening && formikFormCz.errors.nama_pemilik_rekening ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.nama_pemilik_rekening}
                </div>
              </div>
            ) : null}
          </Form.Group>
          {/* <Form.Group>
            <Form.Label>hari</Form.Label>
            <Form.Control
              name="hari"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("hari")}
              className={validationFormCz("hari")}
              required
            />
            {formikFormCz.touched.hari && formikFormCz.errors.hari ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.hari}
                </div>
              </div>
            ) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>tanggal</Form.Label>
            <Form.Control
              name="tanggal"
              placeholder="Enter place and date of birth"
              {...formikFormCz.getFieldProps("tanggal")}
              className={validationFormCz("tanggal")}
              required
            />
            {formikFormCz.touched.tanggal && formikFormCz.errors.tanggal ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikFormCz.errors.tanggal}
                </div>
              </div>
            ) : null}
          </Form.Group> */}
          <div className="d-flex justify-content-end">
            <div className="btn btn-primary" onClick={handleSubmit}>
              Export
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ModalFormCashlez;
