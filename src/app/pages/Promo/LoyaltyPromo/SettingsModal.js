import React from "react";

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
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel
} from "@material-ui/core";
import DatePicker from "react-datepicker";
import { CalendarToday } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import "../../style.css";

const SpecialPromoModal = ({
  stateModal,
  cancelModal,
  loading,
  alert,
  formikSettings,
  validationPromoSettings,
  typeDate,
  expiryDate,
  handleSelectTypeDate,
  handlePromoExpiryDate
}) => {
  const CustomInputDate = ({ value, onClick }) => {
    return (
      <Form.Control
        type="text"
        defaultValue={value}
        onClick={onClick}
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        disabled={typeDate["no-date"]}
      />
    );
  };
  const { t } = useTranslation();
  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t("pointSettings")}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={formikSettings.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Row
            className="lineBottom"
            style={{ marginBottom: "1rem", padding: "1rem" }}
          >
            <Col>
              <h5>{t("loyality/PointsSystemModule")}</h5>
              <Row style={{ alignItems: "center" }}>
                <Col>{t("turnLoyality/PointsSystemOn/Off")}</Col>

                <Col>
                  <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                      <FormControlLabel
                        value={formikSettings.getFieldProps("status").value}
                        control={
                          <Switch
                            name="status"
                            color="primary"
                            checked={
                              formikSettings.getFieldProps("status").value ===
                              "active"
                                ? true
                                : false
                            }
                            onChange={() => {
                              const currStatus = formikSettings.getFieldProps(
                                "status"
                              ).value;

                              if (currStatus === "active") {
                                formikSettings.setFieldValue(
                                  "status",
                                  "inactive"
                                );
                              } else {
                                formikSettings.setFieldValue(
                                  "status",
                                  "active"
                                );
                              }
                            }}
                          />
                        }
                      />
                    </FormGroup>
                  </FormControl>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row
            className="lineBottom"
            style={{ marginBottom: "1rem", padding: "1rem" }}
          >
            <Col>
              <h5>{t("registrationBonus")}</h5>
              <Row style={{ alignItems: "center", marginBottom: "1rem" }}>
                <Col>
                {t("turnRegistrationBonusOn/Off")} <br /> {t("giveInitialPointsToCustomerAsARegistrationBonus")}.
                </Col>

                <Col>
                  <FormControl component="fieldset">
                    <FormGroup aria-label="position" row>
                      <FormControlLabel
                        value={
                          formikSettings.getFieldProps(
                            "registration_bonus_status"
                          ).value
                        }
                        control={
                          <Switch
                            color="primary"
                            checked={
                              formikSettings.getFieldProps(
                                "registration_bonus_status"
                              ).value === "active"
                                ? true
                                : false
                            }
                            onChange={() => {
                              const currStatus = formikSettings.getFieldProps(
                                "registration_bonus_status"
                              ).value;

                              if (currStatus === "active") {
                                formikSettings.setFieldValue(
                                  "registration_bonus_status",
                                  "inactive"
                                );
                              } else {
                                formikSettings.setFieldValue(
                                  "registration_bonus_status",
                                  "active"
                                );
                              }
                            }}
                            name=""
                          />
                        }
                      />
                    </FormGroup>
                  </FormControl>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("initialPointGiven")}:</Form.Label>
                    <Form.Control
                      type="number"
                      name="registration_bonus"
                      {...formikSettings.getFieldProps("registration_bonus")}
                      className={validationPromoSettings("registration_bonus")}
                    />
                    {formikSettings.touched.registration_bonus &&
                    formikSettings.errors.registration_bonus ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikSettings.errors.registration_bonus}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row
            className="lineBottom"
            style={{ marginBottom: "1rem", padding: "1rem" }}
          >
            <Col>
              <h5>{t("pointExchangeRate")}</h5>
              <Row style={{ alignItems: "center", marginBottom: "1rem" }}>
                <Col>{t("setExchangeRateForPoints")}s</Col>
              </Row>

              <Row>
                <Col>{t("every1PointEligableFor")}</Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("exchangeType")}:</Form.Label>
                    <Form.Control
                      as="select"
                      {...formikSettings.getFieldProps("type")}
                      className={validationPromoSettings("type")}
                    >
                      <option value="percentage">{t("percentage")}</option>
                      <option value="currency">{t("rupiah")}</option>
                    </Form.Control>
                    {formikSettings.touched.type &&
                    formikSettings.errors.type ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikSettings.errors.type}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>{t("exchangeValue")}:</Form.Label>
                    <Form.Control
                      type="number"
                      name="value"
                      {...formikSettings.getFieldProps("value")}
                      className={validationPromoSettings("value")}
                    />
                    {formikSettings.touched.value &&
                    formikSettings.errors.value ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formikSettings.errors.value}
                        </div>
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row
            className="lineBottom"
            style={{ marginBottom: "1rem", padding: "1rem" }}
          >
            <Col>
              <h5>{t("pointExpirationDate")}</h5>
              <Row style={{ alignItems: "center", marginBottom: "1rem" }}>
                <Col>{t("setTheExpirationDateForThePoints")}</Col>
              </Row>

              <Row>
                <Col className="box" style={{ margin: "1rem" }}>
                  <Row>
                    <Col sm={1}>
                      <Form.Group>
                        <Form.Check
                          type="radio"
                          name="with-date"
                          checked={typeDate["with-date"]}
                          onChange={handleSelectTypeDate}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <h6>{t("withAnExpiryDate")}</h6>
                      <p>
                        {t("selectAnExpiryDateForPoints(WhenTheExpirydateHasPassed)")}
                      </p>
                      <InputGroup>
                        <DatePicker
                          name="expiry_date"
                          selected={expiryDate}
                          onChange={handlePromoExpiryDate}
                          customInput={<CustomInputDate />}
                          required
                        />

                        <InputGroup.Append>
                          <InputGroup.Text>
                            <CalendarToday />
                          </InputGroup.Text>
                        </InputGroup.Append>
                      </InputGroup>
                      {/* {formikPromo.touched.expiry_date &&
                      formikPromo.errors.expiry_date ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formikPromo.errors.expiry_date}
                          </div>
                        </div>
                      ) : null} */}
                    </Col>
                  </Row>
                </Col>

                <Col className="box" style={{ margin: "1rem" }}>
                  <Row>
                    <Col sm={1}>
                      <Form.Group>
                        <Form.Check
                          type="radio"
                          name="no-date"
                          checked={typeDate["no-date"]}
                          onChange={handleSelectTypeDate}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <h6>{t("noExpiryDate")}</h6>
                      <p>
                      {t("thePointsThatHasBeenGivenWillAlwaysBeAvailable")}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
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

export default SpecialPromoModal;
