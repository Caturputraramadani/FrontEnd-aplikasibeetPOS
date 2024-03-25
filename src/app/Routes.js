/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage, AdvancedProcessRegister } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
import { ChangePassword } from "./pages/Auth/ChangePassword";
import  RegistrationMarketing from "./modules/Auth/pages/RegistrationMarketing";
import PaymentDoku from "./pages/Payment/DOKU/CCandVA/PaymentDoku";
import SignOn from "./pages/Payment/DOKU/QRIS/SignOn"
import GenerateQRString from "./pages/Payment/DOKU/QRIS/GenerateQRString"
import ShowQRCode from "./pages/Payment/DOKU/QRIS/ShowQRCode";

export function Routes() {
  const { isAuthorized } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null
    }),
    shallowEqual
  );

  const [stateScroll, setStateScroll] = React.useState(false)

  const handleScrollBottom = () => {
    setStateScroll(!stateScroll)
  }

  return (
    <Switch>
      <Route path="/auth/registration-backoffice" component={RegistrationMarketing} />
      <Route path="/auth/change-password" component={ChangePassword} />
      <Route path="/payment/doku" component={PaymentDoku} />
      <Route path="/payment/sign-on" component={SignOn} />
      <Route path="/payment/generate-qr-string" component={GenerateQRString} />
      <Route path="/payment/show-qrcode" component={ShowQRCode} />

      {!isAuthorized ? (
        /*Render auth page when user at `/auth` and not authorized.*/
        <Route path="/register-process" component={AdvancedProcessRegister} />
      ) : (
        /*Otherwise redirect to root page (`/`)*/
        <Redirect from="/auth" to="/" />
      )}

      {!isAuthorized ? (
        /*Render auth page when user at `/auth` and not authorized.*/
        <Route>
          <AuthPage />
        </Route>
      ) : (
        /*Otherwise redirect to root page (`/`)*/
        <Redirect from="/auth" to="/" />
      )}

      <Route path="/error" component={ErrorsPage} />
      <Route path="/logout" component={Logout} />

      {!isAuthorized ? (
        /*Redirect to `/auth` when user is not authorized*/
        <Redirect to="/auth/login" />
      ) : (
        <Layout stateScroll={stateScroll}>
          <BasePage handleScrollBottom={handleScrollBottom}/>
        </Layout>
      )}
    </Switch>
  );
}
