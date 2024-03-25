import React from 'react';

import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

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

const ModalSosmed = ({stateModal, cancelModal, t, refreshSosmed}) => {

  const initialValueSosmed = {
    short_name: "",
    full_name: ""
  };

  const SosmedSchema = Yup.object().shape({
    short_name: Yup.string()
      .min(2, `${t("minimum2Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(),
    full_name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required()
  });

  const formikSosmed = useFormik({
    enableReinitialize: true,
    initialValues: initialValueSosmed,
    validationSchema: SosmedSchema,
    onSubmit: async (values) => {
      console.log("formikSosmed", values)
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        const data = {
          short_name: values.short_name,
          full_name: values.full_name
        }
        await axios.post(`${API_URL}/api/v1/sosmed`, data);
        cancelModal()
        refreshSosmed()
      } catch (err) {
        console.log(err)
      }
    }
  });

  const validationSosmed = (fieldname) => {
    if (formikSosmed.touched[fieldname] && formikSosmed.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikSosmed.touched[fieldname] && !formikSosmed.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  return (
    <div>
      <Modal show={stateModal} onHide={cancelModal} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>{t('addSosmed')}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={formikSosmed.handleSubmit}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("shortName")}:</Form.Label>
                  <Form.Control
                    type="text"
                    name="short_name"
                    placeholder="Ex. : FB"
                    {...formikSosmed.getFieldProps("short_name")}
                    className={validationSosmed("short_name")}
                    required
                  />
                  {formikSosmed.touched.short_name && formikSosmed.errors.short_name ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikSosmed.errors.short_name}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("fullName")}:</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    placeholder="Ex. : Facebook"
                    {...formikSosmed.getFieldProps("full_name")}
                    className={validationSosmed("full_name")}
                    required
                  />
                  {formikSosmed.touched.full_name && formikSosmed.errors.full_name ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikSosmed.errors.full_name}
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
              {t("saveChanges")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ModalSosmed;
