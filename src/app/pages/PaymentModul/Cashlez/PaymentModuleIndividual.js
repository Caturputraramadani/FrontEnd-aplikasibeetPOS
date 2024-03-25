import React, {useState, useEffect} from 'react';
import {
  Row,
  Col,
  Form
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Button, Modal, Spinner, Alert} from "react-bootstrap";

import {
  Paper
} from "@material-ui/core";
import dayjs from 'dayjs'

import { saveAs } from 'file-saver'
import fileDownload from 'js-file-download'

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios'

import Signature from '../ModalSignaturePad'

const PaymentModuleIndividual = ({
  stateModal,
  closeModal,
  title,
  t,
  formikFormCz,
  validationFormCz,
  ownerName,
  handleResultSignature,
  showSignaturePad,
  closeSignaturePad,
  handleSubmit,
  handlePreviewLocation,
  handlePreviewSignpost,
  handlePreviewProduct,
  handlePreviewNpwp,
  handlePreviewKtp,
  handleOwnerName,
  openSignaturePad,
  business,
  imageLocation,
  previewLocation,
  imageSignpost,
  previewSignpost,
  imageProduct,
  previewProduct,
  imageNpwp,
  previewNpwp,
  imageKtp,
  previewKtp,
  register_type_cz
}) => {
  return (
    <div>
      <Signature
        ownerName={ownerName}
        handleResultSignature={handleResultSignature}
        show={showSignaturePad}
        close={closeSignaturePad}
        t={t}
      />

      {/* <Modal show={stateModal} onHide={closeModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
          <Modal.Body> */}
        {stateModal ? (
          <Row className="px-5">
            <Col>
              <div className="d-flex justify-content-center">
                <div>
                  <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("merchantOwnerData")}</strong>
                </div>
              </div>
              <Form.Group>
                <Form.Label>{t("merchantOwnerName")} *</Form.Label>
                <Form.Control
                  name="nama_pemilik"
                  placeholder={t("enterMerchantOwnerName")}
                  {...formikFormCz.getFieldProps("nama_pemilik")}
                  className={validationFormCz("nama_pemilik")}
                  required
                  onBlur={(e) => handleOwnerName(e.target.value)}
                />
                {formikFormCz.touched.nama_pemilik && formikFormCz.errors.nama_pemilik ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikFormCz.errors.nama_pemilik}
                    </div>
                  </div>
                ) : null}
                <small><em>({t("accordingToTheIdentityOfTheRegisteredMerchantOwner")})</em></small>
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("place&DateOfBirthOfMerchantOwner")}</Form.Label>
                <Form.Control
                  name="tempat_tanggal_lahir"
                  placeholder={t("enterPlace&DateOfBirthOfMerchantOwner")}
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
                <Form.Label>{t("merchantOwner'sAddress")} *</Form.Label>
                <Form.Control
                  name="alamat_pemilik_merchant"
                  placeholder={t("enterMerchantOwner'sAddress")}
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
                <small><em>({t("accordingToTheRegisteredMerchantOwner")})</em></small>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("city")} *</Form.Label>
                    <Form.Control
                      name="kota"
                      placeholder={t("enterCity")}
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
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("province")}</Form.Label>
                    <Form.Control
                      name="provinsi"
                      placeholder={t("enterProvince")}
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
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("postcode")}</Form.Label>
                    <Form.Control
                      name="kode_pos"
                      placeholder={t("enterPostcode")}
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
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("merchantOwner'sMobileNumber")} *</Form.Label>
                    <Form.Control
                      name="nomor_hp_merchant"
                      placeholder={t("enterMerchantOwner'sMobileNumber")}
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
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("merchantOwnerEmailAddress")}</Form.Label>
                    <Form.Control
                      name="alamat_email_pemilik_merchant"
                      placeholder={t("enterMerchantOwnerEmailAddress")}
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
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                  <Form.Label>{t("no.Identity(KTP/Pasport/KITAS)")} *</Form.Label>
                  <Form.Control
                    name="ktp"
                    placeholder={t("enterNo.Identity(KTP/Pasport/KITAS)")}
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
                  <small><em>({t("originalPhotoRequired")})</em></small>
                </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("no.NPWP/KK")} *</Form.Label>
                    <Form.Control
                      name="kk"
                      placeholder={t("enterNo.NPWP/KK")}
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
                    <small><em>({t("originalPhotoRequired")})</em></small>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-center mt-4">
                <div>
                  <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("dataMerchant")}</strong>
                </div>
              </div>
              <Form.Group>
                <Form.Label>{t("merchantName")}</Form.Label>
                <Form.Control
                  name="nama_merchant"
                  placeholder={t("enterMerchantName")}
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
                <Form.Label>{t("merchantBusinessAddress")} *</Form.Label>
                <Form.Control
                  name="alamat_usaha_merchant"
                  placeholder={t("enterMerchantBusinessAddress")}
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
                <small><em>({t("building/house/mall/apartment/shop")})   ({t("mandatoryPhotoOfBusinessLocation,MerchantNameSignboard/merchantResidence")})</em></small>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("city")} *</Form.Label>
                    <Form.Control
                      name="kota_merchant"
                      placeholder={t("enterCity")}
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
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("province")}</Form.Label>
                    <Form.Control
                      name="provinsi_merchant"
                      placeholder={t("enterProvince")}
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
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("postcode")}</Form.Label>
                    <Form.Control
                      name="kode_pos_merchant"
                      placeholder={t("enterPostcode")}
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
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>{t("merchantBusinessType")}</Form.Label>
                <Form.Control
                  name="tipe_usaha_merchant"
                  placeholder={t("enterMerchantBusinessType")}
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
                <small><em>({t("pt/individual/cooperative/firm/cv/foundation")})</em></small>
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
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("merchantPhoneNumber")} *</Form.Label>
                    <Form.Control
                      name="nomor_telp_merchant"
                      placeholder={t("enterMerchantPhoneNumber")}
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
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("merchantEmailAddress")}</Form.Label>
                    <Form.Control
                      name="alamat_email_merchant"
                      placeholder={t("enterMerchantEmailAddress")}
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
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("form/FieldOfBusiness")} *</Form.Label>
                    <Form.Control
                      name="bentuk_bidang_usaha"
                      placeholder={t("enterForm/FieldOfBusiness")}
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
                    <small><em>({t("mandatoryPhotoOfBusinessLocation,NameSign/Merchant/MerchantResidence")})   ({t("mandatoryPhotosOfProductsSoldByMerchants")})</em></small>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("productDescriptionForSale")} *</Form.Label>
                    <Form.Control
                      name="deskripsi_produk"
                      placeholder={t("enterProductDescriptionForSale")}
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
                </Col>
              </Row>

              <div className="d-flex flex-column justify-content-center align-items-center mt-4">
                <div>
                  <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("dataBank")}</strong>
                </div>
                <div>
                  <small><em>({t("mustAttachAPhotoOfTheCoverOfTheSavingsBook")})</em></small>
                </div>
              </div>
              
              <Row className="mt-3">
                <Col>
                  <Form.Group>
                    <Form.Label>{t("bankName")} *</Form.Label>
                    <Form.Control
                      name="nama_bank"
                      placeholder={t("enterBankName")}
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
                    <small>({t("accordingToTheRegisteredMerchant/CompanyOwner")}</small>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("bankAccountNumber")} *</Form.Label>
                    <Form.Control
                      name="nomor_rekening"
                      placeholder={t("enterBankAccountNumber")}
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
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("nameOfOwnerMerchantAccount")} *</Form.Label>
                    <Form.Control
                      name="nama_pemilik_rekening"
                      placeholder={t("enterBankName")}
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
                    <small>({t("accordingToTheRegisteredMerchant/CompanyOwner")}</small>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex flex-column justify-content-center align-items-center mt-4">
                <div>
                  <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("requirements")} *</strong>
                </div>
                <div>
                  <small><em>({t("individualRegistrationRequirements")})</em></small>
                </div>
              </div>
              
              <Row className="mt-3">
                <Col>
                  <div className="px-2">
                    <label>
                      {t("uploadKtpPicture")} *
                      <small className="ml-4">{t("fileSizeLimit")}</small>
                    </label>
                    <Row className="d-flex justify-content-between box">
                      <div>
                        <div
                          style={{
                            width: "160px",
                            height: "120px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${previewKtp || imageKtp})`
                          }}
                        />
                      </div>
                      <div style={{ alignSelf: "center"}}>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="upload-ktp-file"
                          type="file"
                          onChange={handlePreviewKtp}
                          required
                        />
                        <label
                          htmlFor="upload-ktp-file"
                          className="btn btn-primary"
                        >
                          {t("uploadFile")}
                        </label>
                      </div>
                    </Row>
                  </div>
                </Col>
                <Col>
                  <div className="px-2">
                    <label>
                      {t("uploadNpwpPicture")} *
                      <small className="ml-4">{t("fileSizeLimit")}</small>
                    </label>
                    <Row className="d-flex justify-content-between box">
                      <div>
                        <div
                          style={{
                            width: "160px",
                            height: "120px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${previewNpwp || imageNpwp})`
                          }}
                        />
                      </div>
                      <div style={{ alignSelf: "center" }}>
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
                      </div>
                    </Row>
                  </div>
                </Col>
                <Col>
                  <div className="px-2">
                    <label>
                      {t("uploadProductPicture")} *
                      <small className="ml-4">{t("fileSizeLimit")}</small>
                    </label>
                    <Row className="d-flex justify-content-between box">
                      <div>
                        <div
                          style={{
                            width: "160px",
                            height: "120px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${previewProduct || imageProduct})`
                          }}
                        />
                      </div>
                      <div style={{ alignSelf: "center" }}>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="upload-product-file"
                          type="file"
                          onChange={handlePreviewProduct}
                        />
                        <label
                          htmlFor="upload-product-file"
                          className="btn btn-primary"
                        >
                          {t("uploadFile")}
                        </label>
                      </div>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <div className="px-2">
                    <label>
                      {t("uploadSignpostPicture")} *
                      <small className="ml-4">{t("fileSizeLimit")}</small>
                    </label>
                    <Row className="d-flex justify-content-between box">
                      <div>
                        <div
                          style={{
                            width: "160px",
                            height: "120px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${previewSignpost || imageSignpost})`
                          }}
                        />
                      </div>
                      <div style={{ alignSelf: "center" }}>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="upload-signpost-file"
                          type="file"
                          onChange={handlePreviewSignpost}
                        />
                        <label
                          htmlFor="upload-signpost-file"
                          className="btn btn-primary"
                        >
                          {t("uploadFile")}
                        </label>
                      </div>
                    </Row>
                  </div>
                </Col>
                <Col>
                  <div className="px-2">
                    <label style={{fontSize: '11px'}}>
                      {t("uploadLocationBusinessPicture")} *
                      <small className="ml-4">{t("fileSizeLimit")}</small>
                    </label>
                    <Row className="d-flex justify-content-between box">
                      <div>
                        <div
                          style={{
                            width: "160px",
                            height: "120px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${previewLocation || imageLocation})`
                          }}
                        />
                      </div>
                      <div style={{ alignSelf: "center" }}>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="upload-location-file"
                          type="file"
                          onChange={handlePreviewLocation}
                          required
                        />
                        <label
                          htmlFor="upload-location-file"
                          className="btn btn-primary"
                        >
                          {t("uploadFile")}
                        </label>
                      </div>
                    </Row>
                  </div>
                </Col>
                <Col />
              </Row>
              <div className="d-flex justify-content-end mt-4">
                <div className="d-flex">
                  <div className="btn btn-info mr-2" onClick={openSignaturePad}>
                    {t("signaturePad")}
                  </div>
                  <div className="btn btn-primary" onClick={handleSubmit}>
                    {t("register")}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        ) : null }
        {/* </Modal.Body>
      </Modal> */}

    </div>
  );
}

export default PaymentModuleIndividual;
