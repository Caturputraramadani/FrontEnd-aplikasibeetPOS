import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../../../../_metronic/layout";
import * as auth from "../_redux/authRedux";
import { logout } from "../_redux/authCrud";

class Logout extends Component {
  async componentDidMount() {
    await logout();
    this.props.logout();
  }

  render() {
    const { hasAuthToken } = this.props;
    return hasAuthToken ? (
      <LayoutSplashScreen />
    ) : (
      <Redirect to="/auth/login" />
    );
  }
}

export default connect(
  ({ auth }) => ({ hasAuthToken: Boolean(auth.authToken) }),
  auth.actions
)(Logout);
