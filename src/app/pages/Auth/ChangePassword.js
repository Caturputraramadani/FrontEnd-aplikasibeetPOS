import React from "react";
import axios from "axios";
import { Link, Switch, Redirect } from "react-router-dom";

import {
  Form,
  Row,
  Col,
  Container,
  Button,
  Alert,
  Spinner
} from "react-bootstrap";

import { toAbsoluteUrl } from "../../../_metronic/_helpers";

export const ChangePassword = ({ location, history }) => {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const getParams = new URLSearchParams(location.search);
    const email = getParams.get("email");
    const verification_code = getParams.get("verification_code");

    const sendData = {
      email,
      verification_code,
      newPassword
    };

    const API_URL = process.env.REACT_APP_API_URL;

    setAlert("");

    try {
      enableLoading();
      await axios.patch(
        `${API_URL}/api/v1/forget-password/change-password`,
        sendData
      );
      disableLoading();
      setSuccess("Password changed successfully");

      setTimeout(() => {
        history.push("/auth");
      }, 1000);
    } catch (err) {
      setAlert(err.response?.data?.message || err.message);
      disableLoading();
    }
  };

  const handleSetPassword = (e) => setNewPassword(e.target.value);

  return (
    <div className="d-flex flex-column flex-root">
      {/*begin::Login*/}
      <div
        className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-row-fluid bg-white"
        id="kt_login"
      >
        {/*begin::Aside*/}
        <div
          className="login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10"
          style={{
            backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-11.jpg")})`
          }}
        >
          {/*begin: Aside Container*/}
          <div
            className="d-flex flex-row-fluid flex-column justify-content-between"
            style={{ alignSelf: "flex-end" }}
          >
            {/* start:: Aside footer for desktop */}
            <div className="d-none flex-column-auto d-lg-flex justify-content-between mt-10">
              <div className="opacity-70 font-weight-bold	text-white">
                &copy; 2021 Lifetech
              </div>
              <div className="d-flex">
                <Link to="/terms" className="text-white">
                  Privacy
                </Link>
                <Link to="/terms" className="text-white ml-10">
                  Legal
                </Link>
                <Link to="/terms" className="text-white ml-10">
                  Contact
                </Link>
              </div>
            </div>
            {/* end:: Aside footer for desktop */}
          </div>
          {/*end: Aside Container*/}
        </div>
        {/*begin::Aside*/}

        {/*begin::Content*/}
        <div className="flex-row-fluid d-flex flex-column position-relative p-7 overflow-hidden">
          {/* begin::Content body */}
          <Container style={{ margin: "auto" }}>
            <Row style={{ textAlign: "center", marginBottom: "2rem" }}>
              <Col>
                <h1>Reset Password</h1>
              </Col>
            </Row>

            <Row style={{ justifyContent: "center" }}>
              <Col md={6} style={{ textAlignLast: "center" }}>
                {alert ? <Alert variant="danger">{alert}</Alert> : ""}
                {success ? <Alert variant="success">{success}</Alert> : ""}

                <Form onSubmit={onSubmit}>
                  <Form.Group>
                    <Form.Control
                      type="password"
                      name="new_password"
                      placeholder="Enter New Password"
                      onChange={handleSetPassword}
                      style={{ textAlign: "center" }}
                    />
                  </Form.Group>

                  <Button type="submit" disabled={success ? true : false}>
                    {loading ? (
                      <Spinner animation="border" variant="light" size="sm" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
          {/*end::Content body*/}

          {/* begin::Mobile footer */}
          <div className="d-flex d-lg-none flex-column-auto flex-column flex-sm-row justify-content-between align-items-center mt-5 p-5">
            <div className="text-dark-50 font-weight-bold order-2 order-sm-1 my-2">
              &copy; 2021 Lifetech
            </div>
            <div className="d-flex order-1 order-sm-2 my-2">
              <Link to="/terms" className="text-dark-75 text-hover-primary">
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-dark-75 text-hover-primary ml-4"
              >
                Legal
              </Link>
              <Link
                to="/terms"
                className="text-dark-75 text-hover-primary ml-4"
              >
                Contact
              </Link>
            </div>
          </div>
          {/* end::Mobile footer */}
        </div>
        {/*end::Content*/}
      </div>
      {/*end::Login*/}
    </div>
  );
};
