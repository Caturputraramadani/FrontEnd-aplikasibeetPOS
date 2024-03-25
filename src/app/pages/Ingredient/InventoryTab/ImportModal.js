import React from "react";
import { Button, Modal, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
const ConfirmModal = ({
  state,
  loading,
  alert,
  closeModal,
  formikImportRawMaterial,
  allOutlets,
  handleFile,
  filename,
  // subscriptionType
}) => {
  const handleSelectOutlet = (value) => {
    if (value) {
      const outlet = value.map((item) => item.value);
      formikImportRawMaterial.setFieldValue("outlets_id", outlet);
    } else {
      formikImportRawMaterial.setFieldValue("outlets_id", []);
    }
  };
  const { t } = useTranslation();
  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept:
      "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    maxSize: 5 * 1000 * 1000,
    onDrop(file) {
      handleFile(file);
    }
  });

  const handleDownload = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const newWindow = window.open(
      `${API_URL}/templates/template-raw-material.xlsx`,
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t("importRawMaterial")}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikImportRawMaterial.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("location")}:</Form.Label>
                <Select
                  options={optionsOutlet}
                  isMulti
                  placeholder={t('select')}
                  name="outlets_id"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(value) => handleSelectOutlet(value)}
                />
                {formikImportRawMaterial.touched.outlets_id &&
                formikImportRawMaterial.errors.outlets_id ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formikImportRawMaterial.errors.outlets_id}
                    </div>
                  </div>
                ) : null}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("importExcel")}:</Form.Label>
                <div
                  {...getRootProps({
                    className: "boxDashed dropzone"
                  })}
                >
                  <input {...getInputProps()} />
                  {filename ? (
                    <p>{filename}</p>
                  ) : (
                    <>
                      <p>
                        {t("dragAndDrop")}
                      </p>
                      <p style={{ color: "gray" }}>{t("fileSizeLimit")}</p>
                    </>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>{t("downloadTemplateExcel")}:</Form.Label>
                <div
                  className="box"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={handleDownload}
                  >
                    {t("downloadTemplate")}
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            {t("close")}
          </Button>
          <Button variant="primary" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              `${t("confirm")}`
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ConfirmModal;
