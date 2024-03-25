import React, {useState} from 'react';
import { Button, Modal, Spinner, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";

const ModalTemplate = ({t, stateModal, cancelModal, loading, sosmed, validationTemplate, formikTemplate}) => {

  const handleChangeSosmed = (value)=> {
    if(value) {
      const result = value.map(val => val.value)
      formikTemplate.setFieldValue("sosmed", result)
    }
  }

  const optionSosmed = sosmed.map(value => {
    return { value: value.short, label: value.label };
  })

  const defaultValue = formikTemplate.values.sosmed.map((item) => {
    return optionSosmed.find((val) => val.value === item);
  });

  console.log("defaultValue", defaultValue)

  return (
    <Modal show={stateModal} onHide={cancelModal} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{t('settingTemplateQr')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikTemplate.handleSubmit}>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("socialMedia")}</Form.Label>
                <Select
                  defaultValue={defaultValue}
                  placeholder={t('select')}
                  options={optionSosmed}
                  name="sosmed"
                  isMulti
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={(value) =>
                    handleChangeSosmed(value)
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("socialMediaName")}</Form.Label>
                <Form.Control
                  type="text"
                  name="name_sosmed"
                  {...formikTemplate.getFieldProps("name_sosmed")}
                  className={validationTemplate("name_sosmed")}
                  required
                />
                {formikTemplate.touched.name_sosmed && formikTemplate.errors.name_sosmed ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikTemplate.errors.name_sosmed}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Whatsapp</Form.Label>
                <Form.Control
                  type="text"
                  name="whatsapp"
                  {...formikTemplate.getFieldProps("whatsapp")}
                  className={validationTemplate("whatsapp")}
                  required
                />
                {formikTemplate.touched.whatsapp && formikTemplate.errors.whatsapp ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikTemplate.errors.whatsapp}
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
}

export default ModalTemplate;
