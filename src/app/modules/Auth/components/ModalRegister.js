import React from "react";
import { Modal, Form, Alert, Spinner, Button } from "react-bootstrap";

const ModalRegister = ({
  showBusinessModal,
  closeBusinessModal,
  alertModal,
  loading,
  allBusinessTypes,
  allProvinces,
  allCities,
  cancelLoading,
  cancel,
  allLocations,
  formikBusiness,
  validationBusiness,
  handleProvince,
  handleCity
}) => {
  return (
    <Modal
      show={showBusinessModal}
      onHide={closeBusinessModal}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Welcome to BeetPOS</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formikBusiness.handleSubmit} style={{ padding: "1rem" }}>
        <Modal.Body>
          {alertModal ? <Alert variant="danger">{alertModal}</Alert> : ""}

          <Form.Group>
            <Form.Label>Select Business Type</Form.Label>
            <Form.Control
              as="select"
              name="business_type_id"
              {...formikBusiness.getFieldProps("business_type_id")}
              className={validationBusiness("business_type_id")}
              required
            >
              <option value="" disabled hidden>
                Choose Business Type
              </option>

              {allBusinessTypes.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formikBusiness.touched.business_type_id &&
            formikBusiness.errors.business_type_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikBusiness.errors.business_type_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Select Province</Form.Label>
            <Form.Control
              as="select"
              name="business_province_id"
              {...formikBusiness.getFieldProps("business_province_id")}
              onChange={handleProvince}
              onBlur={handleProvince}
              className={validationBusiness("business_province_id")}
              required
            >
              <option value="" disabled hidden>
                Choose Province
              </option>

              {allProvinces.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formikBusiness.touched.business_province_id &&
            formikBusiness.errors.business_province_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikBusiness.errors.business_province_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Select City</Form.Label>
            <Form.Control
              as="select"
              name="business_city_id"
              {...formikBusiness.getFieldProps("business_city_id")}
              onChange={handleCity}
              onBlur={handleCity}
              className={validationBusiness("business_city_id")}
              required
            >
              <option value="" disabled hidden>
                Choose City
              </option>

              {allCities.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formikBusiness.touched.business_city_id &&
            formikBusiness.errors.business_city_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikBusiness.errors.business_city_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Select Location</Form.Label>
            <Form.Control
              as="select"
              name="business_location_id"
              {...formikBusiness.getFieldProps("business_location_id")}
              className={validationBusiness("business_location_id")}
              required
            >
              <option value="" disabled hidden>
                Choose Location
              </option>

              {allLocations.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formikBusiness.touched.business_location_id &&
            formikBusiness.errors.business_location_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikBusiness.errors.business_location_id}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group>
            <Form.Label>Select Outlet Location</Form.Label>
            <Form.Control
              as="select"
              name="outlet_location_id"
              {...formikBusiness.getFieldProps("outlet_location_id")}
              className={validationBusiness("outlet_location_id")}
              required
            >
              <option value="" disabled hidden>
                Choose Outlet Location
              </option>

              {allLocations.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </Form.Control>
            {formikBusiness.touched.outlet_location_id &&
            formikBusiness.errors.outlet_location_id ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formikBusiness.errors.outlet_location_id}
                </div>
              </div>
            ) : null}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            {loading ? <Spinner animation="border" variant="light" /> : "Next"}
          </Button>
          <Button variant="danger" type="button" onClick={cancel}>
            {cancelLoading ? (
              <Spinner animation="border" variant="light" />
            ) : (
              "Cancel"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalRegister;
