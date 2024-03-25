import React from "react";
import { FormikProvider, FieldArray } from "formik";
import Select from "react-select";

import { Button, Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";

import "../../style.css";

const SpecialPromoModal = ({
  stateModal,
  cancelModal,
  title,
  loading,
  alert,
  formikPromo,
  validationPromo,
  loyaltyPromos,
  allOutlets,
  allProducts,
  selectedProducts,
  handleSelectedProducts,
  t
}) => {
  const [listProducts, setListProducts] = React.useState([]);
  const [filter, setFilter] = React.useState([]);

  React.useEffect(() => {
    if (selectedProducts.length) {
      const currSelectedProducts = filter.filter(
        (item) => !selectedProducts.find((val) => item.id === val.id)
      );
      setListProducts(currSelectedProducts);
    } else {
      setListProducts(filter);
    }
  }, [selectedProducts, filter]);

  const handleSelect = (e) => {
    const { value } = e.target;
    const currPromoProducts = loyaltyPromos
      .filter((item) => item.outlet_id === parseInt(value))
      .map((item) => item.product_id);
    const filterAllProducts = allProducts.filter(
      (item) => !currPromoProducts.find((val) => item.id === val)
    );
    setFilter(filterAllProducts);

    formikPromo.setFieldValue("outlet_id", value);
  };
  
  const handleSelectOutlet = (value, formik) => {
    if (value) {
      console.log("value", value)
      console.log("loyaltyPromos", loyaltyPromos)
      value.map(item2 => {
        const currPromoProducts = loyaltyPromos
        .filter((item) => item.outlet_id === parseInt(item2.value))
        .map((item) => item.product_id);
        console.log("currPromoProducts", currPromoProducts)

        const filterAllProducts = allProducts.filter(
          (item) => !currPromoProducts.find((val) => item.id === val)
        );
        setFilter(filterAllProducts);
      })
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
          <Form.Group>
            <Form.Label>{t("product")}:</Form.Label>
            <Form.Control
              as="select"
              value={""}
              onChange={handleSelectedProducts}
            >
              <option value="" disabled hidden>
              {t("chooseProduct")}
              </option>
              {listProducts.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <FormikProvider value={formikPromo}>
            <FieldArray
              name="loyaltyPromo"
              render={(arrayHelpers) => {
                return (
                  <div>
                    <Row style={{ padding: "1rem" }}>
                      <Col>{t("productName")}</Col>
                      <Col>{t("productPrice")}</Col>
                      <Col>{t("point")}</Col>
                    </Row>
                    {selectedProducts.map((item, index) => {
                      return (
                        <Row key={index} style={{ padding: "1rem" }}>
                          <Col>
                            <Form.Control
                              type="text"
                              name={`loyaltyPromo[${index}].product_id`}
                              disabled
                              hidden
                              value={item.id}
                            />
                            <Form.Control
                              type="text"
                              disabled
                              value={item.name}
                            />
                          </Col>
                          <Col>
                            <Form.Control
                              type="text"
                              disabled
                              value={item.price}
                            />
                          </Col>
                          <Col>
                            <Form.Control
                              type="number"
                              name={`loyaltyPromo[${index}].point`}
                              {...formikPromo.getFieldProps(
                                `loyaltyPromo[${index}].point`
                              )}
                              required
                            />
                            {formikPromo.touched.loyaltyPromo &&
                            formikPromo.errors.loyaltyPromo ? (
                              <div className="fv-plugins-message-container">
                                <div className="fv-help-block">
                                  {
                                    formikPromo.errors.loyaltyPromo[index]
                                      ?.point
                                  }
                                </div>
                              </div>
                            ) : null}
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                );
              }}
            />
          </FormikProvider>
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
