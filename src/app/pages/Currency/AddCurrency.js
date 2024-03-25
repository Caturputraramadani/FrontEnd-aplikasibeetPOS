import React from 'react'
import axios from "axios";
import Select from "react-select";

import {
  Button,
  Modal,
  Spinner,
  Form,
  Row,
  Col,
  InputGroup,
  Alert
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";

export default function AddCurrency({ 
  t, 
  stateModal, 
  cancelModal, 
  title, 
  formikCurrency, 
  validationCurrency, 
  alertModal,
  action, 
  loading, 
  handleSelectOutlet ,
  allOutlets,
  showFeature,
  allCurrency,
  selectedCurrency
}) {
  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });
  optionsOutlet.unshift({ value: 1, label: t('allOutlets') });

  const defaultOptionOutlet = optionsOutlet.find((val) => {
    return val.value == formikCurrency.values.outlet_id
    }
  );

  const optionCurrencyA =  allCurrency.map((item) => {
    return {value: item.id, label: `${item.name} - ${item.full_name}` }
  })

  const defaultOptionCurrencyA = optionCurrencyA.find((val) => {
    return val.value == formikCurrency.values.currency_a
    }
  );

  const optionCurrencyB =  allCurrency.map((item) => {
    return {value: item.id, label: `${item.name} - ${item.full_name}` }
  })
  const defaultOptionCurrencyB = optionCurrencyB.find((val) => {
    return val.value == formikCurrency.values.currency_b
  });

  return (
    <div>
      <Modal show={stateModal} onHide={cancelModal} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formikCurrency.handleSubmit}>
          <Modal.Body>
          {alertModal ? (
            <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
              <div className="alert-text font-weight-bold">{alertModal}</div>
            </div>
          ) : (
            ""
          )}
          <Row>
            <Col>
              {/* <Form.Group>
                <Form.Label>{t("outlet")}:</Form.Label>
                {action === "Edit" ? (
                  <Select
                    options={optionsOutlet}
                    defaultValue={defaultOptionOutlet}
                    name="outlet_id"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(value) =>
                      formikCurrency.setFieldValue(
                        "outlet_id",
                        value.value
                      )
                    }
                  />
                ) : (
                  <Select
                    options={optionsOutlet}
                    isMulti
                    name="outlet_id"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(value) =>
                      handleSelectOutlet(value, formikCurrency)
                    }
                  />
                )}
                {formikCurrency.touched.outlet_id &&
                formikCurrency.errors.outlet_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikCurrency.errors.outlet_id}
                    </div>
                  </div>
                ) : null}
              </Form.Group> */}
              <Form.Group>
                <Form.Label>{t("location")}:</Form.Label>
                <Form.Control
                  type="text"
                  value={t('allOutlet')}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("currencyA")}</Form.Label>
                <Select
                  placeholder={t('select')}
                  options={optionCurrencyA}
                  defaultValue={defaultOptionCurrencyA}
                  name="currency_a"
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={(value) =>
                    formikCurrency.setFieldValue(
                      "currency_a",
                      value.value
                    )
                  }
                />
                {formikCurrency.touched.currency_a &&
                  formikCurrency.errors.currency_a ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikCurrency.errors.currency_a}
                      </div>
                    </div>
                  ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("currencyB")}</Form.Label>
                <Select
                  placeholder={t('select')}
                  options={optionCurrencyB}
                  defaultValue={defaultOptionCurrencyB}
                  name="currency_b"
                  className="basic-single"
                  classNamePrefix="select"
                  onChange={(value) =>
                    formikCurrency.setFieldValue(
                      "currency_b",
                      value.value
                    )
                  }
                />
                {formikCurrency.touched.currency_b &&
                  formikCurrency.errors.currency_b ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikCurrency.errors.currency_b}
                      </div>
                    </div>
                  ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("conversionAToB")}:</Form.Label>
                <Form.Control
                  type="text"
                  name="conversion_a_to_b"
                  placeholder={t("conversionAToB")}
                  {...formikCurrency.getFieldProps("conversion_a_to_b")}
                  className={validationCurrency("conversion_a_to_b")}
                  required
                />
                {formikCurrency.touched.conversion_a_to_b && formikCurrency.errors.conversion_a_to_b ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikCurrency.errors.conversion_a_to_b}
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
    </div>
  )
}
