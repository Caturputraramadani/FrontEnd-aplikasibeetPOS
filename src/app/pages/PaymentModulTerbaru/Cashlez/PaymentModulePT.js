import React, {useState, useEffect} from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  InputGroup,
  ButtonGroup,
  ListGroup
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Modal, Spinner, Alert} from "react-bootstrap";

import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper
} from "@material-ui/core";
import dayjs from 'dayjs'

import { saveAs } from 'file-saver'
import fileDownload from 'js-file-download'

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios'

import Signature from '../ModalSignaturePad'

const PaymentModulePT = ({
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
  handlePreviewPriceList,
  handlePreviewNPWPMerchant,
  handlePreviewPassBook,
  handlePreviewDeedCompany,
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
  handlePreviewNpwpPt,
  handlePreviewSiup,
  register_type_cz,
  imageNpwpPt,
  previewNpwpPt,
  imageSiup,
  previewSiup,
  imagePriceList,
  previewPriceList,
  previewNPWPMerchant,
  imageNPWPMerchant,
  imageDeedCompany,
  previewDeedCompany,
  previewPassBook,
  imagePassBook,
  handleFeatureTransaction,
  featureTransaction,
  loading
}) => {
  
  const allFeatureTransaction = [
    {
      id: "1", 
      key: "kartu_kredit",
      name: "creditCard"
    }, 
    {
      id: "2", 
      key: "kartu_debit",
      name: "debitCard"
    },
    {
      id: "3", 
      key: "cicilan",
      name: "instalment"
    }, 
    {
      id: "4", 
      key: "qris_uang_lektronik",
      name: "qrisElectronicMoney"
    },
    {
      id: "5", 
      key: "debit_transfer",
      name: "debitTransfer"
    }, 
    {
      id: "6", 
      key: "ecommerce",
      name: "ecommerce"
    }
  ]
  
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
          <Row className="p-5">
            <Col>
              {/* <div className="d-flex justify-content-center">
                <div>
                  <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("headers")}</strong>
                </div>
              </div>

              <Form.Group as={Row} style={{ padding: "0 1rem", width: '80%' }} className="d-flex mt-2">
                <div style={{ width: '27%' }}>
                  <Form.Label>{t('submissionAs')}:</Form.Label>
                </div>
                <div style={{ width: '60%' }} className="d-flex">
                  {[{id: "1", name: "individualMerchant"}, {id: "2", name: "businessEntityMerchant"}].map((item, index) => {
                    return (
                      <div style={{width: "60%"}}>
                        <Form.Check
                          key={index}
                          type="checkbox"
                          name="submission_as"
                          label={t(item.name)}
                          value={item.id}
                          checked={
                            item.id ==
                            formikFormCz.getFieldProps("submission_as").value
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            const submission_as = e.target.value;
                            console.log("submission_as", submission_as)
                            if (submission_as == "1") {
                              formikFormCz.setFieldValue("submission_as", "1");
                            } else {
                              formikFormCz.setFieldValue("submission_as", "2");
                            }
                          }}
                          className={validationFormCz("submission_as")}
                        />
                      </div>
                    );
                  })}
                </div>
                
                {formikFormCz.touched.submission_as && formikFormCz.errors.submission_as ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikFormCz.errors.submission_as}
                    </div>
                  </div>
                ) : null}
              </Form.Group> */}

              <Form.Group as={Row} style={{ padding: "0 1rem", width: '80%' }} className="d-flex mt-2">
                <div style={{ width: '27%' }}>
                  <Form.Label>{t('businessPlaceStatus')}:</Form.Label>
                </div>
                <div style={{ width: '60%' }} className="d-flex">
                {[{id: "1", name: "rightOfOwnership"}, {id: "2", name: "rent"}].map((item, index) => {
                  return (
                    <div style={{width: "60%"}}>
                      <Form.Check
                        key={index}
                        type="checkbox"
                        name="business_place_status"
                        label={t(item.name)}
                        value={item.id}
                        checked={
                          item.id ==
                          formikFormCz.getFieldProps("business_place_status").value
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          const business_place_status = e.target.value;
                          console.log("business_place_status", business_place_status)
                          if (business_place_status == "1") {
                            formikFormCz.setFieldValue("business_place_status", "1");
                          } else {
                            formikFormCz.setFieldValue("business_place_status", "2");
                          }
                        }}
                        className={validationFormCz("business_place_status")}
                      />
                    </div>
                  );
                })}
                </div>
                {formikFormCz.touched.business_place_status && formikFormCz.errors.business_place_status ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikFormCz.errors.business_place_status}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
              
              <Form.Group as={Row} style={{ padding: "0 1rem", width: '100%' }} className="d-flex" >
                <div style={{ width: '20%' }}>
                  <Form.Label>{t('transactionFeatures')}:</Form.Label>
                </div>
                <div style={{width: '70%'}} className="d-flex justify-content-between ml-3">
                  {allFeatureTransaction.map(value => 
                    <Form.Check
                      type="checkbox"
                      name={value.key}
                      label={t(value.name)}
                      // disabled={featureTransaction.everyday.checked}
                      checked={featureTransaction[value.key].checked}
                      onChange={handleFeatureTransaction}
                    />
                  )}
                </div>
              </Form.Group>

              <div className="d-flex justify-content-center">
                <div>
                  <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("ownerAuthoritiveOfficerDataAtMerchant")}</strong>
                </div>
              </div>
              <Form.Group>
                <Form.Label>{t("nameOfMerchantOwnerAuthorizedOfficial")}*</Form.Label>
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
                <small><em>({t("accordingToTheKtpOfTheMerchantOwnerAuthorizedOfficialIndividualBusinessEntity")})</em></small>
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
                <Form.Label>{t("merchantOwner'sAddress")}*</Form.Label>
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
                <small><em>({t("accordingToTheKtpOfTheMerchantOwnerAuthorizedOfficialIndividualBusinessEntity")})</em></small>
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
                    <Form.Label>{t("merchantOwner'sMobileNumber")}*</Form.Label>
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
                  <small><em>({t("noMobileAndEmailOfMerchantOwnerAuthorizedOfficialIndividualBusinessEntity")})</em></small>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("merchantOwnerEmailAddress")}*</Form.Label>
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
                  <Form.Label>{t("noIdentityKtpPassportKitasForeigners")}*</Form.Label>
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
                    <Form.Label>{t("no.NPWP/KK")}*</Form.Label>
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
                  <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("merchantDataBusinessEntity")}</strong>
                </div>
              </div>
              <Form.Group>
                <Form.Label>{t("nameOfMerchantIndividualBusinessEntity")}*</Form.Label>
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
                <Form.Label>{t('individualMerchantBusinessEntityContactName')}**</Form.Label>
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
                <small><em>({t("nameOfTheContactPersonWhoIsResponsibleToTheMerchantOwnerAuthorizedOfficialIndividualBusinessEntity")})</em></small>
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t('noMobileContactMerchant')}**</Form.Label>
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
                    <Form.Label>{t("noPhoneMerchant")} *</Form.Label>
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
              </Row>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t('noNpwpMerchantBusinessEntity')}*</Form.Label>
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
                    <small><em>({t("originalPhotoRequired")})</em></small>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("emailMerchant")}*</Form.Label>
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

              <Form.Group>
                <Form.Label>{t("individualMerchantBusinessEntityAddress")} *</Form.Label>
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
                <small><em>({t("requiredPhotoOfBusinessDomicileCertificateNameplateOfIndividualMerchantBusinessEntity")})</em></small>
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
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("typeOfBusiness")}*</Form.Label>
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
                    <small><em>({t("mustAttachABusinessPermitIndividualMerchantOrDeedNibBusinessEntityMerchant")})</em></small>
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
                    <small><em>({t("mandatoryPhotoOfTheProductBeingSold")})</em></small>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group>
                <Form.Label>{t('averageTransactionsPerMonth')}</Form.Label>
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
                <small><em>({t("attachAListPriceListOfGoodsServicesIfAny")})</em></small>
              </Form.Group>

              <div className="d-flex flex-column justify-content-center align-items-center mt-4">
                <div>
                  <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("dataBank")}</strong>
                </div>
                <div>
                  <small><em>({t("requiredCoverPhotoOfPassbookCurrentAccountElectronicAccountAtmTransferEeceipt")})</em></small>
                </div>
              </div>
              
              <Row className="mt-3">
                <Col>
                  <Form.Group>
                    <Form.Label>{t("hostBankAccountNumber")}</Form.Label>
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
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("nameOfMerchantAccountOwnerBusinessEntity")} *</Form.Label>
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
                    <small>({t("theMerchantAccountOwnerMustBeInTheNameOfTheIndividualBusinessEntityMerchantOwner")}</small>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex flex-column justify-content-center align-items-center mt-4">
                <div>
                  <strong style={{fontSize:"15px", textDecoration: "underline"}}>{t("PTRegistrationRequirements")}</strong>
                </div>
                <div>
                  <small><em>({t("PTRegistrationRequirements")})</em></small>
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
              <Row className="my-3">
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
                <Col>
                  <div className="px-2">
                    <label style={{fontSize: '11px'}}>
                      {t("uploadNpwpPtPicture")} *
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
                            backgroundImage: `url(${previewNpwpPt || imageNpwpPt})`
                          }}
                        />
                      </div>
                      <div style={{ alignSelf: "center" }}>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="upload-npwp-pt-file"
                          type="file"
                          onChange={handlePreviewNpwpPt}
                          required
                        />
                        <label
                          htmlFor="upload-npwp-pt-file"
                          className="btn btn-primary"
                        >
                          {t("uploadFile")}
                        </label>
                      </div>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row className="">
                <Col>
                  <div className="px-2">
                    <label>
                      {t("uploadsiupTdpNibPicture")} *
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
                            backgroundImage: `url(${previewSiup || imageSiup})`
                          }}
                        />
                      </div>
                      <div style={{ alignSelf: "center" }}>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="upload-siup-file"
                          type="file"
                          onChange={handlePreviewSiup}
                        />
                        <label
                          htmlFor="upload-siup-file"
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
                    <label style={{fontSize: '11px', margin: 0}}>
                      {t('priceList')}*
                    </label>
                    <div>
                      <small>{t("fileSizeLimit")}</small>
                    </div>
                    <Row className="d-flex justify-content-between box">
                      <div>
                        <div
                          style={{
                            width: "160px",
                            height: "120px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${previewPriceList || imagePriceList})`
                          }}
                        />
                      </div>
                      <div style={{ alignSelf: "center" }}>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="upload-price-list"
                          type="file"
                          onChange={handlePreviewPriceList}
                          required
                        />
                        <label
                          htmlFor="upload-price-list"
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
                    <label style={{fontSize: '10px', margin: 0}}>
                    {t('companyDeedDeedOfAmendmentIfAny')} *
                    </label>
                    <div>
                      <small>{t("fileSizeLimit")}</small>
                    </div>
                    <Row className="d-flex justify-content-between box">
                      <div>
                        <div
                          style={{
                            width: "160px",
                            height: "120px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${previewDeedCompany || imageDeedCompany})`
                          }}
                        />
                      </div>
                      <div style={{ alignSelf: "center" }}>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="upload-dedd-company-file"
                          type="file"
                          onChange={handlePreviewDeedCompany}
                          required
                        />
                        <label
                          htmlFor="upload-dedd-company-file"
                          className="btn btn-primary"
                        >
                          {t("uploadFile")}
                        </label>
                      </div>
                    </Row>
                  </div>
                </Col>
              </Row>
              <Row>
              <Col>
                  <div className="px-2">
                    <label style={{fontSize: '10px', margin: 0}}>
                    {t('npwpMerchantPhoto')}
                    </label>
                    <div>
                      <small>{t("fileSizeLimit")}</small>
                    </div>
                    <Row className="d-flex justify-content-between box">
                      <div>
                        <div
                          style={{
                            width: "160px",
                            height: "120px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${previewNPWPMerchant || imageNPWPMerchant})`
                          }}
                        />
                      </div>
                      <div style={{ alignSelf: "center" }}>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="upload-npwp-merchant-file"
                          type="file"
                          onChange={handlePreviewNPWPMerchant}
                          required
                        />
                        <label
                          htmlFor="upload-npwp-merchant-file"
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
                    <label style={{fontSize: '10px', margin: 0}}>
                      {t('photoOfPassbookCover')}
                    </label>
                    <div>
                      <small>{t("fileSizeLimit")}</small>
                    </div>
                    <Row className="d-flex justify-content-between box">
                      <div>
                        <div
                          style={{
                            width: "160px",
                            height: "120px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${previewPassBook || imagePassBook})`
                          }}
                        />
                      </div>
                      <div style={{ alignSelf: "center" }}>
                        <input
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          id="upload-pass-book-file"
                          type="file"
                          onChange={handlePreviewPassBook}
                          required
                        />
                        <label
                          htmlFor="upload-pass-book-file"
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
              <div className="d-flex justify-content-between">
                <div>
                  <i style={{fontSize: "10px"}}>
                    *{t('mandatoryToBeFilledInByTheOwnerAuthorizedOfficialOfIndividualMerchantBusinessEntity')}
                  </i>
                  <br />
                  <i style={{fontSize: "10px"}}>
                    **{t('ifTheNameOfTheOwnerAuthorizedOfficial')}
                  </i>
                </div>
                <div className="d-flex">
                  <div className="btn btn-info mr-2" onClick={openSignaturePad}>
                    {t("signaturePad")}
                  </div>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {t("register")}
                    {/* {loading && <span className="ml-3 spinner spinner-white"></span>} */}
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        ) : null}
        {/* </Modal.Body>
      </Modal> */}
    </div>
  );
}

export default PaymentModulePT;
