import React from 'react'
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FormikProvider, FieldArray } from "formik";
import Select from "react-select";
import { Delete } from "@material-ui/icons";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";
export default function ModalSalesType({
  closeModalSalesType,
  openSalesType,
  title,
  formikProduct,
  saveChangesSalesTypes,
  optionsSalesTypes,
  defaultValueSalesTypes,
  handleActiveSalesType,
  handleDeleteArayHelper
}) {
  const { t } = useTranslation();
  console.log("optionsSalesTypes", optionsSalesTypes)
  console.log("formikProduct.values.sales_types", formikProduct.values.sales_types)
  return (
    <Modal show={openSalesType} onHide={closeModalSalesType} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={saveChangesSalesTypes}>
        <Modal.Body>
          <Row style={{ padding: "1rem" }}>
            <Col>
              <Row>
                <Col style={{ padding: "1rem", textAlign: "center" }}>
                  <h6>{t("salesType")}</h6>
                </Col>

                <Col style={{ padding: "1rem", textAlign: "center" }}>
                  <h6>{t("price")}</h6>
                </Col>

                <Col style={{ padding: "1rem", textAlign: "center" }}>
                  <h6>{t("active")}</h6>
                </Col>
                <Col sm={1}></Col>
              </Row>

              <FormikProvider value={formikProduct}>
                <FieldArray
                  name="sales_types"
                  render={(arrayHelpers) => {
                    return (
                      <div>
                        {formikProduct.values.sales_types.map((item, index) => {
                          return (
                            <Row key={index}>
                              <Col>
                                <Form.Group>
                                  <Select
                                    options={optionsSalesTypes}
                                    placeholder={t('select')}
                                    defaultValue={defaultValueSalesTypes(
                                      formikProduct.values.sales_types[index].sales_type_id
                                    )}
                                    name={`sales_types[${index}].sales_type_id`}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    onChange={(value) => {
                                      formikProduct.setFieldValue(`sales_types[${index}].sales_type_id`, value.value)
                                    }}
                                  />
                                  {formikProduct.touched.sales_types && formikProduct.errors.sales_types ? (
                                    <div className="fv-plugins-message-container">
                                      <div className="fv-help-block">
                                        {
                                          formikProduct.errors.sales_types[index]
                                            ?.sales_type_id
                                        }
                                      </div>
                                    </div>
                                  ) : null}
                                </Form.Group>
                              </Col>

                              <Col>
                                <Form.Group>
                                  <Form.Control
                                    type="number"
                                    name={`sales_types[${index}].price`}
                                    {...formikProduct.getFieldProps(
                                      `sales_types[${index}].price`
                                    )}
                                  />
                                  {formikProduct.touched.sales_types &&
                                    formikProduct.errors.sales_types ? (
                                      <div className="fv-plugins-message-container">
                                        <div className="fv-help-block">
                                          {
                                            formikProduct.errors.sales_types[index]
                                              ?.price
                                          }
                                        </div>
                                      </div>
                                    ) : null}
                                </Form.Group>
                              </Col>
                              <Col>
                                <div className="d-flex align-items-center justify-content-center">
                                  <FormControl component="fieldset">
                                    <FormGroup aria-label="position" row>
                                      <FormControlLabel
                                        value={formikProduct.values.sales_types[index].active}
                                        control={
                                          <Switch
                                            color="primary"
                                            checked={formikProduct.values.sales_types[index].active === "Active" ? true : false}
                                            onChange={(e) => {
                                              if (formikProduct.values.sales_types[index].active === e.target.value) {
                                                if (formikProduct.values.sales_types[index].active === "Active") {
                                                  handleActiveSalesType("Inactive", index, formikProduct);
                                                } else {
                                                  handleActiveSalesType("Active", index, formikProduct);
                                                }
                                              }
                                            }}
                                          />
                                        }
                                      />
                                    </FormGroup>
                                  </FormControl>
                                </div>
                              </Col>

                              <Col sm={1}>
                                <Button
                                  onClick={() => {
                                    handleDeleteArayHelper(item.id)
                                    arrayHelpers.remove(index)
                                  }}
                                  variant="danger"
                                >
                                  <Delete />
                                </Button>
                              </Col>
                            </Row>
                          );
                        })}

                        <Row style={{ padding: "1rem" }}>
                          <Button
                            onClick={() =>
                              arrayHelpers.push(
                                {
                                  sales_type_id: "",
                                  price: 0,
                                  active: "Active"
                                }
                              )
                            }
                            variant="primary"
                          >
                            + {t("addAnotherProduct")}
                          </Button>
                        </Row>
                      </div>
                    );
                  }}
                />
              </FormikProvider>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModalSalesType}>
            {t("cancel")}
          </Button>
          <Button variant="primary" type="submit">
            {t("saveChanges")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
