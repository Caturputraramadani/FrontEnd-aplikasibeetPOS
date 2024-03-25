import React, { useState } from "react";
import Select from "react-select";

import {
  Button,
  Modal,
  Spinner,
  Form,
  Row,
  Col,
  Alert,
  InputGroup
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { CalendarToday } from "@material-ui/icons";

import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";

import DatePicker from "react-datepicker";

import "../../style.css";

const VoucherPromoModal = ({
  stateModal,
  cancelModal,
  title,
  loading,
  alert,
  formikPromo,
  validationPromo,
  alertPhoto,
  photoPreview,
  photo,
  handlePreviewPhoto,
  allOutlets,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  t,
  handleDate,
  errorDate,
  handleCheckLimitDiscount,
  checkLimitDiscount
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 3 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });
  const handleSelectOutlet = (value, formik) => {
    console.log("handleSelectOutlet", value)
    if (value) {
      // const outlet = value.map((item) => item.value);
      formikPromo.setFieldValue("outlet_id", value.value);
    } else {
      formikPromo.setFieldValue("outlet_id", []);
    }
  };

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  const handleChangeStatus = () => {

  }

  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={formikPromo.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("outlet")}:</Form.Label>
                <Select
                  options={optionsOutlet}
                  placeholder={t('select')}
                  name="outlet_id"
                  classNamePrefix="select"
                  onChange={(value) => handleSelectOutlet(value, formikPromo)}
                />
                {formikPromo.touched.outlet_id &&
                formikPromo.errors.outlet_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.outlet_id}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("promoName")}:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder={t('enterPromoName')}
                  {...formikPromo.getFieldProps("name")}
                  className={validationPromo("name")}
                  required
                />
                {formikPromo.touched.name && formikPromo.errors.name ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.name}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>{t("limitClaim")}:</Form.Label>
                <Form.Control
                  type="number"
                  name="limit_claim"
                  placeholder={t('enterLimitClaim')}
                  {...formikPromo.getFieldProps("limit_claim")}
                  className={validationPromo("limit_claim")}
                  required
                />
                {formikPromo.touched.limit_claim && formikPromo.errors.limit_claim ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.limit_claim}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("limitUsage")}:</Form.Label>
                <Form.Control
                  type="number"
                  name="limit_usage"
                  placeholder={t('enterLimitUsage')}
                  {...formikPromo.getFieldProps("limit_usage")}
                  className={validationPromo("limit_usage")}
                  required
                />
                {formikPromo.touched.limit_usage && formikPromo.errors.limit_usage ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.limit_usage}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>{t("expirationDate")}:</Form.Label>

                <InputGroup>
                  <DateTimePicker
                    startDate={startDate}
                    setStartDate={setStartDate}
                    handleDate={handleDate}
                    state="start"
                  />

                  <InputGroup.Append>
                    <InputGroup.Text>
                      <CalendarToday />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                  <Form.Label>{t('dailyLimitClaim')}</Form.Label>
                  <Form.Control
                    type="number"
                    name="daily_claim"
                    placeholder={t('enterDailyLimitClaim')}
                    {...formikPromo.getFieldProps("daily_claim")}
                    className={validationPromo("daily_claim")}
                    required
                  />
                  <div className="font-italic text-muted mt-1">({t('dailyLimitEveryCustomer')})</div>
                  {formikPromo.touched.daily_claim && formikPromo.errors.daily_claim ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikPromo.errors.dis9count_limit}
                      </div>
                    </div>
                  ) : null}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                  <Form.Label>{t('obtainedAmount')}</Form.Label>
                  <Form.Control
                    type="number"
                    name="obtained_amount"
                    placeholder={t('enterAObtainedAmount')}
                    {...formikPromo.getFieldProps("obtained_amount")}
                    className={validationPromo("obtained_amount")}
                    required
                  />
                  <div className="font-italic text-muted mt-1">({t('1ClaimCanGetHowManyVouchersDefaultIs1')})</div>
                  {formikPromo.touched.obtained_amount && formikPromo.errors.obtained_amount ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikPromo.errors.dis9count_limit}
                      </div>
                    </div>
                  ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Label>{t("promoDescription")}:</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              {...formikPromo.getFieldProps("description")}
              className={validationPromo("description")}
            />
            {formikPromo.touched.description &&
            formikPromo.errors.description ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikPromo.errors.description}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Row className="align-items-center">
            <Col>
              <Form.Group>
                <Form.Label>{t("discountType")}:</Form.Label>
                <Form.Control
                  as="select"
                  name="discount_type"
                  {...formikPromo.getFieldProps("discount_type")}
                  className={validationPromo("discount_type")}
                  required
                >
                  <option value="" disabled hidden>
                  {t("chooseType")}
                  </option>
                  <option value="percentage">{t("percentage")}</option>
                  <option value="amount">{t("amount")}</option>
                </Form.Control>
                {formikPromo.touched.discount_type && formikPromo.errors.discount_type ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formikPromo.errors.discount_type}</div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            {formikPromo.values.discount_type === 'percentage' ? (
              <Col>
                  <Form.Check
                    type="checkbox"
                    name="check_limit_discount"
                    label={t("limitDiscount")}
                    checked={checkLimitDiscount}
                    onChange={() => handleCheckLimitDiscount(formikPromo)}
                  />
              </Col>
            ): null }
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("discountAmount")}:</Form.Label>
                <Form.Control
                  type="number"
                  name="discount_amount"
                  placeholder={t('enterDiscountAmount')}
                  {...formikPromo.getFieldProps("discount_amount")}
                  className={validationPromo("discount_amount")}
                  required
                />
                {formikPromo.touched.discount_amount && formikPromo.errors.discount_amount ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.discount_amount}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
              {formikPromo.values.discount_type === 'percentage' && checkLimitDiscount ? (
                <Col>
                  <Form.Group>
                  <Form.Label>{t("amountLimitDiscount")}:</Form.Label>
                    <Form.Control
                      type="number"
                      name="discount_limit"
                      placeholder={t('enterAmountLimitDiscount')}
                      {...formikPromo.getFieldProps("discount_limit")}
                      className={validationPromo("discount_limit")}
                      required
                    />
                    {formikPromo.touched.discount_limit && formikPromo.errors.discount_limit ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikPromo.errors.dis9count_limit}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              ) : null }
          </Row>
          {/* <Form.Group>
            <FormControl component="fieldset">
              <FormGroup row>
                <Form.Label
                  style={{ alignSelf: "center", marginRight: "1rem" }}
                >
                  {t("productFavorite")}*
                </Form.Label>
                <FormControlLabel
                  value={false}
                  name="is_favorite"
                  control={
                    <Switch
                      color="primary"
                      checked={true}
                      onChange={(e) => {
                        const { value } = e.target;
                        console.log("value", value)
                        if (value === "false") {
                          // formikProduct.setFieldValue("is_favorite", true);
                        } else {
                          // formikProduct.setFieldValue("is_favorite", false);
                        }
                      }}
                    />
                  }
                />
              </FormGroup>
            </FormControl>
          </Form.Group> */}

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("acquisitionType")}:</Form.Label>
                <Form.Control
                  as="select"
                  name="acquisition_type"
                  {...formikPromo.getFieldProps("acquisition_type")}
                  className={validationPromo("acquisition_type")}
                  required
                >
                  <option value="" disabled hidden>
                  {t("chooseAcquisitionType")}
                  </option>
                  <option value="currency">{t("currency")}</option>
                  <option value="point">{t("point")}</option>
                  <option value="claim">{t("claim")}</option>
                  <option value="system">{t("system")}</option>
                </Form.Control>
                <div className="font-italic text-muted mt-1">({t('acquisitionTypeIsHowToGetThisVoucher')})</div>
                {formikPromo.touched.acquisition_type && formikPromo.errors.acquisition_type ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formikPromo.errors.acquisition_type}</div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            {formikPromo.values.acquisition_type === 'point' || formikPromo.values.acquisition_type === 'currency' ? (
              <Col>
                <Form.Group>
                  <Form.Label>{t("acquisitionCost")}:</Form.Label>
                  <Form.Control
                    type="number"
                    name="acquisition_cost"
                    placeholder={t('enterAcquisitionCost')}
                    {...formikPromo.getFieldProps("acquisition_cost")}
                    className={validationPromo("acquisition_cost")}
                    required
                  />
                  {formikPromo.touched.acquisition_cost && formikPromo.errors.acquisition_cost ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikPromo.errors.dis9count_limit}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            ) : null }
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cancelModal}>
          {t("cancel")}
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

const DateTimePicker = ({ startDate, setStartDate, handleDate, state }) => {
  const CustomInput = ({ value, onClick }) => {
    return (
      <Form.Control
        type="text"
        defaultValue={value}
        onClick={onClick}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      />
    );
  };
  return (
    <DatePicker
      selected={startDate}
      // onChange={(date) => setStartDate(date)}
      onChange={(date) => handleDate(date, state)}
      dateFormat="dd/MM/yyyy"
      // showTimeInput
      // timeInputLabel="Time:"
      customInput={<CustomInput />}
    />
  );
};

export default VoucherPromoModal;
