import React from "react";

import { Button, Modal, Spinner, Form, InputGroup } from "react-bootstrap";
import Select from "react-select";

import "../../style.css";

const ModalTax = ({
  stateModal,
  cancelModal,
  title,
  loading,
  formikTax,
  validationTax,
  allTypes,
  allOutlets,
  handleSelectOutlet,
  t
}) => {
  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValue = formikTax.values.outlet_id.map((item) => {
    return optionsOutlet.find((val) => val.value === item);
  });

  console.log("optionsOutlet modaltax", optionsOutlet)
  console.log("defaultValue modaltax", defaultValue)

  return (
    <Modal show={stateModal} onHide={cancelModal} size="sm">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikTax.handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>{t("selectType")}:</Form.Label>
            <Form.Control
              as="select"
              name="tax_type_id"
              {...formikTax.getFieldProps("tax_type_id")}
              className={validationTax("tax_type_id")}
              required
            >
              <option value="" disabled hidden>
                {t("chooseAType")}
              </option>
              {allTypes.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {t(item.name)}
                  </option>
                );
              })}
            </Form.Control>
            {formikTax.touched.tax_type_id && formikTax.errors.tax_type_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikTax.errors.tax_type_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("name")}:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder={t('enterTaxName')}
              {...formikTax.getFieldProps("name")}
              className={validationTax("name")}
              required
            />
            {formikTax.touched.name && formikTax.errors.name ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formikTax.errors.name}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("amount")}:</Form.Label>
            <InputGroup className="pb-3">
              <InputGroup.Prepend>
                <InputGroup.Text style={{ background: "transparent" }}>
                  %
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="number"
                name="value"
                placeholder={t('enterTaxAmount')}
                {...formikTax.getFieldProps("value")}
                className={validationTax("value")}
                required
              />
            </InputGroup>
            {formikTax.touched.value && formikTax.errors.value ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formikTax.errors.value}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("outlet")}:</Form.Label>
            <Select
              options={optionsOutlet}
              isMulti
              name="outlet_id"
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder={t('select')}
              onChange={(value) => handleSelectOutlet(value, formikTax)}
              defaultValue={defaultValue}
            />
            {formikTax.touched.outlet_id && formikTax.errors.outlet_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikTax.errors.outlet_id}
                </div>
              </div>
            ) : null}
          </Form.Group>
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

export default ModalTax;
