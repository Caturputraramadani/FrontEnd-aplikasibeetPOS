import React from "react";

import { Button, Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import Select from "react-select";

import "../../style.css";

const SpecialPromoModal = ({
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
  t
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 3 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

  const handleSelectOutlet = (value, formik) => {
    if (value) {
      console.log("handleSelectOutlet", value)
      const outlet = value.map((item) => item.value);
      formikPromo.setFieldValue("outlet_id", outlet);
    } else {
      formikPromo.setFieldValue("outlet_id", []);
    }
  };

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

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
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("promoName")}:</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Promo Name"
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
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("promoDescriptionType")}:</Form.Label>
                <Form.Control
                  as="select"
                  name="description_type"
                  value={""}
                  {...formikPromo.getFieldProps("description_type")}
                  className={validationPromo("description_type")}
                  required
                >
                  <option value="" disabled hidden>
                  {t("chooseType")}
                  </option>
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
            </Col>
          </Row>

          <Row>
            <Col>
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
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("promoRateType")}:</Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  {...formikPromo.getFieldProps("type")}
                  className={validationPromo("type")}
                  required
                >
                  <option value="" disabled hidden>
                  {t("chooseType")}
                  </option>
                  <option value="percentage">{t("percentage")}</option>
                  <option value="currency">{t("rupiah")}</option>
                </Form.Control>
                {formikPromo.touched.type && formikPromo.errors.type ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikPromo.errors.type}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group as={Row}>
                <Form.Label column md={2}>
                {t("promoRate")}:
                </Form.Label>
                <Col>
                  <Form.Control
                    type="number"
                    name="value"
                    {...formikPromo.getFieldProps("value")}
                    className={validationPromo("value")}
                    required
                  />
                  {formikPromo.touched.value && formikPromo.errors.value ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikPromo.errors.value}
                      </div>
                    </div>
                  ) : null}
                </Col>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("promoBanner")}</Form.Label>
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
