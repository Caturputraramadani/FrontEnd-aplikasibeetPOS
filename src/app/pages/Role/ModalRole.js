import React from "react";

import {
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Container,
  Row,
  Col
} from "react-bootstrap";
import {
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch
} from "@material-ui/core";

const ModalRole = ({
  state,
  closeModal,
  loading,
  alert,
  title,
  formikRole,
  validationRole,
  accessLists,
  t,
  handleSelectAll
}) => {
  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikRole.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

          <Form.Group>
            <Form.Label>{t("roleName")}:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex. : Staff"
              {...formikRole.getFieldProps("name")}
              className={validationRole("name")}
              required
            />
            {formikRole.touched.name && formikRole.errors.name ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formikRole.errors.name}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>{t("privilege")}:</Form.Label>
            {
              // console.log("ini previlagenya", formikRole.getFieldProps("privileges").value)
            }
            <Row>
              {formikRole.getFieldProps("privileges").value.length
                ? accessLists.map((access, accessIdx) => {
                  console.log("access", access)
                    return (
                      <Col key={accessIdx} style={{ paddingTop: "1rem" }}>
                        <FormControl
                          component="fieldset"
                          style={{ width: "100%" }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <h6>{access === 'Cashier' ? 'Frontend App' : access}</h6>
                            <div className="badge badge-primary" onClick={() => handleSelectAll(access)}>
                              {t('selectAll')}
                            </div>
                          </div>

                          <FormGroup row>
                            <Container style={{ padding: "0" }}>
                              {formikRole
                                .getFieldProps("privileges")
                                .value.map((privilege, index) => {
                                  // console.log("privilege privilege privilege", privilege)
                                  if (access === privilege.access) {
                                    return (
                                      <Row
                                        key={index}
                                        style={{
                                          padding: "0.5rem 1rem"
                                        }}
                                      >
                                        <Col
                                          style={{
                                            alignSelf: "center"
                                          }}
                                        >
                                          <Form.Label>
                                            {privilege.name === "changingTransaction" ? `${t('deleteTransaction')}` : `${t(privilege.name)}`}
                                          </Form.Label>
                                        </Col>
                                        <Col style={{ textAlign: "end" }}>
                                          <FormControlLabel
                                            key={privilege.id}
                                            control={
                                              <Switch
                                                key={privilege.id}
                                                value={privilege.name}
                                                color="primary"
                                                checked={privilege.allow}
                                                onChange={(e) => {
                                                  const { value } = e.target;
                                                  const allowValue = formikRole
                                                    .getFieldProps("privileges")
                                                    .value.find(
                                                      (val) =>
                                                        val.name === value &&
                                                        val.access ===
                                                          privilege.access
                                                    );
                                                  if (allowValue.allow) {
                                                    formikRole.setFieldValue(
                                                      `privileges[${index}].allow`,
                                                      false
                                                    );
                                                  } else {
                                                    formikRole.setFieldValue(
                                                      `privileges[${index}].allow`,
                                                      true
                                                    );
                                                  }
                                                }}
                                              />
                                            }
                                          />
                                        </Col>
                                      </Row>
                                    );
                                  } else {
                                    return "";
                                  }
                                })}
                            </Container>
                          </FormGroup>
                        </FormControl>
                      </Col>
                    );
                  })
                : ""}
            </Row>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
          {t("close")}
          </Button>
          <Button type="submit">
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

export default ModalRole;
