import React from "react";

import { Button, Modal, Spinner, Form, Alert } from "react-bootstrap";
import Select from "react-select";

import "../../../style.css";

const EditModal = ({
  stateModal,
  cancelModal,
  title,
  loading,
  alert,
  formikMaterial,
  validationMaterial,
  allOutlets,
  allCategories,
  allUnits,
  t
}) => {
  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueOutlet = optionsOutlet.find(
    (val) => val.value === formikMaterial.values.outlet_id
  );

  const optionsCategory = allCategories.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueCategory = optionsCategory.find(
    (val) => val.value === formikMaterial.values.raw_material_category_id
  );

  const optionsUnit = allUnits.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueUnit = optionsUnit.find(
    (val) => val.value === formikMaterial.values.unit_id
  );

  // const optionsCalorie = ["kcal", "cal"].map((item) => {
  //   return { value: item, label: item };
  // });

  const optionsCalorie = [
    {
      key: "kcal",
      name: `${t('unitKiloCalorie')}`
    },
    {
      key: "cal",
      name: `${t('unitCalorie')}`
    }
  ].map((item) => {
    return { value: item.key, label: item.name };
  });

  const defaultValueCalorie = optionsCalorie.find(
    (val) => val.value === formikMaterial.values.calorie_unit
  );

  return (
    <Modal show={stateModal} onHide={cancelModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={formikMaterial.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>{t("location")}:</Form.Label>
            <Select
              placeholder={t('select')}
              options={optionsOutlet}
              defaultValue={defaultValueOutlet}
              name="outlet_id"
              className="basic-single"
              classNamePrefix="select"
              onChange={(value) =>
                formikMaterial.setFieldValue("outlet_id", value.value)
              }
            />
            {formikMaterial.touched.outlet_id &&
            formikMaterial.errors.outlet_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikMaterial.errors.outlet_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("name")}:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              {...formikMaterial.getFieldProps("name")}
              className={validationMaterial("name")}
              required
            />
            {formikMaterial.touched.name && formikMaterial.errors.name ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikMaterial.errors.name}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("category")}:</Form.Label>
            <Select
              placeholder={t('select')}
              options={optionsCategory}
              defaultValue={defaultValueCategory}
              name="raw_material_category_id"
              className="basic-single"
              classNamePrefix="select"
              onChange={(value) =>
                formikMaterial.setFieldValue(
                  "raw_material_category_id",
                  value.value
                )
              }
            />
            {formikMaterial.touched.raw_material_category_id &&
            formikMaterial.errors.raw_material_category_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikMaterial.errors.raw_material_category_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            {/* <Form.Label>{t("stock")}:</Form.Label> */}
            {/* <Form.Control
              type="number"
              name="stock"
              {...formikMaterial.getFieldProps("stock")}
              className={validationMaterial("stock")}
              required
            /> */}
            {/* {formikMaterial.touched.stock && formikMaterial.errors.stock ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikMaterial.errors.stock}
                </div>
              </div>
            ) : null} */}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("unit")}:</Form.Label>
            <Select
              placeholder={t('select')}
              options={optionsUnit}
              defaultValue={defaultValueUnit}
              name="unit_id"
              className="basic-single"
              classNamePrefix="select"
              onChange={(value) =>
                formikMaterial.setFieldValue("unit_id", value.value)
              }
            />
            {formikMaterial.touched.unit_id && formikMaterial.errors.unit_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikMaterial.errors.unit_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("pricePerUnit")}:</Form.Label>
            <Form.Control
              type="number"
              name="price_per_unit"
              {...formikMaterial.getFieldProps("price_per_unit")}
              className={validationMaterial("price_per_unit")}
              required
            />
            {formikMaterial.touched.price_per_unit &&
            formikMaterial.errors.price_per_unit ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikMaterial.errors.price_per_unit}
                </div>
              </div>
            ) : null}
          </Form.Group>

          {/* <Form.Group>
            <Form.Label>{t("caloriePerUnit")}:</Form.Label>
            <Form.Control
              type="number"
              name="calorie_per_unit"
              {...formikMaterial.getFieldProps("calorie_per_unit")}
              className={validationMaterial("calorie_per_unit")}
              required
            />
            {formikMaterial.touched.calorie_per_unit &&
            formikMaterial.errors.calorie_per_unit ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikMaterial.errors.calorie_per_unit}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("calorieUnit")}:</Form.Label>
            <Select
              placeholder={t('select')}
              options={optionsCalorie}
              defaultValue={defaultValueCalorie}
              name="calorie_unit"
              className="basic-single"
              classNamePrefix="select"
              onChange={(value) =>
                formikMaterial.setFieldValue("calorie_unit", value.value)
              }
            />
            {formikMaterial.touched.calorie_unit &&
            formikMaterial.errors.calorie_unit ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikMaterial.errors.calorie_unit}
                </div>
              </div>
            ) : null}
          </Form.Group> */}

          <Form.Group>
            <Form.Label>{t("notes")}:</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              {...formikMaterial.getFieldProps("notes")}
              className={validationMaterial("notes")}
              required
            />
            {formikMaterial.touched.notes && formikMaterial.errors.notes ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikMaterial.errors.notes}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Check
              type="checkbox"
              label={t("sellAsProduct")}
              style={{ marginTop: "0.5rem" }}
              {...formikMaterial.getFieldProps("is_sold")}
              checked={formikMaterial.values.is_sold ? true : false}
              onChange={(e) => {
                const { value } = e.target;
                if (value === "true") {
                  formikMaterial.setFieldValue("is_sold", false);
                } else {
                  formikMaterial.setFieldValue("is_sold", true);
                }
              }}
            />
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

export default EditModal;
