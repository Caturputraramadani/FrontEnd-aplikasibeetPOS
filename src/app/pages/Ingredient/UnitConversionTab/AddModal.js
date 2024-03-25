import React from "react";

import { Button, Modal, Spinner, Form, Alert, Row, Col } from "react-bootstrap";
import Select from "react-select";

import "../../style.css";

const AddModal = ({
  stateModal,
  cancelModal,
  title,
  loading,
  alert,
  formikUnitConversion,
  validationUnitConverion,
  allUnits,
  t
}) => {
  const optionsUnitFrom = allUnits.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueUnitFrom = optionsUnitFrom.find(
    (val) => val.value === formikUnitConversion.values.unit_from_id
  );

  const optionsUnitTo = allUnits.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueUnitTo = optionsUnitTo.find(
    (val) => val.value === formikUnitConversion.values.unit_to_id
  );

  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={formikUnitConversion.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("name")}:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  {...formikUnitConversion.getFieldProps("name")}
                  className={validationUnitConverion("name")}
                  required
                />
                {formikUnitConversion.touched.name &&
                formikUnitConversion.errors.name ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikUnitConversion.errors.name}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("1UnitOf")}:</Form.Label>
                <Select
                  options={optionsUnitFrom}
                  defaultValue={defaultValueUnitFrom}
                  placeholder={t('select')}
                  name="unit_from_id"
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={(value) =>
                    formikUnitConversion.setFieldValue(
                      "unit_from_id",
                      value.value
                    )
                  }
                />
                {formikUnitConversion.touched.unit_from_id &&
                formikUnitConversion.errors.unit_from_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikUnitConversion.errors.unit_from_id}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col sm={1} style={{ padding: 0, alignSelf: "center" }}>
              <p style={{ margin: 0, textAlign: "center" }}>{t("equalsTo")}</p>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>{t("value")}:</Form.Label>
                <Form.Control
                  type="number"
                  name="value"
                  {...formikUnitConversion.getFieldProps("value")}
                  className={validationUnitConverion("value")}
                  required
                />
                {formikUnitConversion.touched.value &&
                formikUnitConversion.errors.value ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikUnitConversion.errors.value}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>{t("unitTo")}:</Form.Label>
                <Select
                  options={optionsUnitTo}
                  placeholder={t('select')}
                  defaultValue={defaultValueUnitTo}
                  name="unit_to_id"
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={(value) =>
                    formikUnitConversion.setFieldValue(
                      "unit_to_id",
                      value.value
                    )
                  }
                />
                {formikUnitConversion.touched.unit_to_id &&
                formikUnitConversion.errors.unit_to_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikUnitConversion.errors.unit_to_id}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
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

export default AddModal;
