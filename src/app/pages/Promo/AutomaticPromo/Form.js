import React from "react";
import { useDropzone } from "react-dropzone";
import { Row, Col, Form, Alert, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { OutlinedInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { CalendarToday } from "@material-ui/icons";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import "../../style.css";
import { KeyboardTimePicker } from "@material-ui/pickers";

const useStyles = makeStyles({
  input: {
    padding: "1rem"
  }
});

const FormTemplate = ({
  formikPromo,
  validationPromo,
  allOutlets,
  weekdays,
  photo,
  photoPreview,
  alertPhoto,
  startDate,
  endDate,
  startHour,
  endHour,
  handlePreviewPhoto,
  handlePromoStartDate,
  handlePromoEndDate,
  handlePromoDays,
  handlePromoHour,
  handleSelectOutlet,
  mode,
  errorDate
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 3 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

  const CustomInputDate = ({ value, onClick }) => {
    return (
      <Form.Control
        type="text"
        defaultValue={value}
        onClick={onClick}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      />
    );
  };

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  return (
    <>
      <Row className="lineBottom" style={{ padding: "2rem" }}>
        <Col>
          <Row style={{ marginBottom: "1rem" }}>
            <h5>{t("promoTime")}</h5>
          </Row>

          <Row>
            <Col sm={4}>
              <Form.Group>
                <Form.Label>{t("promoDate-Start")}:</Form.Label>
                <InputGroup>
                  <DatePicker
                    name="promo_date_start"
                    selected={startDate}
                    onChange={handlePromoStartDate}
                    customInput={<CustomInputDate />}
                    required
                  />

                  <InputGroup.Append>
                    <InputGroup.Text>
                      <CalendarToday />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                {formikPromo.touched.promo_date_start &&
                formikPromo.errors.promo_date_start ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.promo_date_start}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label>{t("promoDate-End")}:</Form.Label>
                <InputGroup>
                  <DatePicker
                    name="promo_date_end"
                    selected={endDate}
                    onChange={handlePromoEndDate}
                    customInput={<CustomInputDate />}
                    required
                  />

                  <InputGroup.Append>
                    <InputGroup.Text>
                      <CalendarToday />
                    </InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
                {formikPromo.touched.promo_date_end &&
                formikPromo.errors.promo_date_end ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.promo_date_end}
                    </div>
                  </div>
                ) : null}
                {errorDate ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {t('endDateMustBeGreaterThanTheStartDate')}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group>
                <Row>
                  <Col>
                    <Form.Label>{t("promoDays")}:</Form.Label>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Check
                      type="checkbox"
                      name="monday"
                      label={t("monday")}
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.monday.checked}
                      onChange={handlePromoDays}
                    />
                    <Form.Check
                      type="checkbox"
                      name="tuesday"
                      label={t("tuesday")}
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.tuesday.checked}
                      onChange={handlePromoDays}
                    />
                    <Form.Check
                      type="checkbox"
                      name="wednesday"
                      label={t("wednesday")}
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.wednesday.checked}
                      onChange={handlePromoDays}
                    />
                  </Col>

                  <Col>
                    <Form.Check
                      type="checkbox"
                      name="thursday"
                      label={t("thursday")}
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.thursday.checked}
                      onChange={handlePromoDays}
                    />
                    <Form.Check
                      type="checkbox"
                      name="friday"
                      label={t("friday")}
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.friday.checked}
                      onChange={handlePromoDays}
                    />
                    <Form.Check
                      type="checkbox"
                      name="saturday"
                      label={t("saturday")}
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.saturday.checked}
                      onChange={handlePromoDays}
                    />
                  </Col>

                  <Col>
                    <Form.Check
                      type="checkbox"
                      name="sunday"
                      label={t("sunday")}
                      disabled={weekdays.everyday.checked}
                      checked={weekdays.sunday.checked}
                      onChange={handlePromoDays}
                    />
                    <Form.Check
                      type="checkbox"
                      name="everyday"
                      label={t("everyday")}
                      checked={weekdays.everyday.checked}
                      onChange={handlePromoDays}
                    />
                  </Col>
                </Row>
                {formikPromo.touched.promo_days &&
                formikPromo.errors.promo_days ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.promo_days}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col sm={4}>
              <Form.Group>
                <Form.Label>{t("promoHour-Start")}:</Form.Label>
                <div>
                  {/* Time picker jam Analog */}
                  <KeyboardTimePicker
                    id="promo_hour_start"
                    name="promo_hour_start"
                    margin="normal"
                    label="Start"
                    ampm={false}
                    value={startHour}
                    onChange={(date, val) => handlePromoHour(date, val, "promo_hour_start")}
                    KeyboardButtonProps={{
                      "aria-label": "change time"
                    }}
                  />

                  {/* Time picker jam Digital */}
                  {/* <OutlinedInput
                    type="time"
                    name="promo_hour_start"
                    value={startHour}
                    fullWidth
                    variant="outlined"
                    classes={{ input: classes.input }}
                    onChange={handlePromoHour}
                  /> */}
                </div>
                {formikPromo.touched.promo_hour_start &&
                formikPromo.errors.promo_hour_start ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.promo_hour_start}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label>{t("promoHour-End")}</Form.Label>
                <div>
                  {/* Time picker jam Analog */}
                  <KeyboardTimePicker
                    id="promo_hour_end"
                    name="promo_hour_end"
                    margin="normal"
                    label="Close"
                    ampm={false}
                    value={endHour}
                    onChange={(date, val) => handlePromoHour(date, val, "promo_hour_end")}
                    KeyboardButtonProps={{
                      "aria-label": "change time"
                    }}
                  />

                  {/* Time picker jam Digital */}
                  {/* <OutlinedInput
                    type="time"
                    name="promo_hour_end"
                    value={endHour}
                    fullWidth
                    variant="outlined"
                    classes={{ input: classes.input }}
                    onChange={handlePromoHour}
                  /> */}
                </div>
                {formikPromo.touched.promo_hour_end &&
                formikPromo.errors.promo_hour_end ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.promo_hour_end}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row style={{ padding: "2rem" }}>
        <Col>
          <Row style={{ marginBottom: "1rem" }}>
            <h5>{t("promoLocation&Banner")}</h5>
          </Row>

          <Row>
            <Col sm={4}>
              {mode === "edit" ? (
                <Form.Group>
                  <Form.Label>{t("location")}:</Form.Label>
                  <Form.Control
                    as="select"
                    name="outlet_id"
                    {...formikPromo.getFieldProps("outlet_id")}
                    className={validationPromo("outlet_id")}
                    required
                  >
                    <option value="" disabled hidden>
                    {t("chooseAnOutlet")}
                    </option>
                    {allOutlets.map((item, index) => {
                      return (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                  {formikPromo.touched.outlet_id &&
                  formikPromo.errors.outlet_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikPromo.errors.outlet_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              ) : (
                <Form.Group>
                  <Form.Label>{t("location")}:</Form.Label>
                  <Select
                    options={optionsOutlet}
                    placeholder={t('select')}
                    isMulti
                    name="outlet_id"
                    className="basic-multi-select"
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
              )}
            </Col>

            <Col sm={4}>
              <Form.Group>
                <Form.Label>{t("promoBanner")}:</Form.Label>
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
                      {t("dragAndDrop")}
                      </p>
                      <p style={{ color: "gray" }}>{t("fileSizeLimit")}</p>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          margin: "auto",
                          width: "120px",
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
            </Col>

            <Col sm={4}>
              <Form.Group>
                <Form.Label>{t("descriptionType")}:</Form.Label>
                <Form.Control
                  as="select"
                  name="description_type"
                  {...formikPromo.getFieldProps("description_type")}
                  className={validationPromo("description_type")}
                  required
                >
                  <option value="regulation">{t("regulation")}</option>
                  <option value="how_to_use">{t("howToUse")}</option>
                </Form.Control>
                {formikPromo.touched.description_type &&
                formikPromo.errors.description_type ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.description_type}
                    </div>
                  </div>
                ) : null}
              </Form.Group>

              <Form.Group>
                <Form.Label>{t("description")}:</Form.Label>
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
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default FormTemplate;
