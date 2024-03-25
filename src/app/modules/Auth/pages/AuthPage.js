/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from "react";
import { Link, Switch, Redirect, useHistory } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/_helpers";
import { ContentRoute } from "../../../../_metronic/layout";
import Login from "./Login";
import Registration from "./Registration";
import RegistrationTryNow from "./RegistrationTryNow";
import ForgotPassword from "./ForgotPassword";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";
import LoginStaff from "./LoginStaff";
import { useTranslation } from "react-i18next";

export function AuthPage() {
  const history = useHistory();
  const [authState, setAuthState] = useState("register")
  const { t } = useTranslation();

  const pushToLogin = () => {
    setAuthState("login")
    history.push("/auth");
  }
  const pushToRegister = () => {
    setAuthState("register")
    history.push("/auth/beetpos-registration");
    // history.push("/auth/registration");
  }

  useEffect(() => {
    const currentRoute = window.location.pathname
    if(currentRoute.includes("login")){
      setAuthState("login")
    } else if (currentRoute.includes("registration")) {
      setAuthState("register")
    } else {
      setAuthState("login")
    }
  }, [])

  return (
    <>
      <div className="d-flex flex-column flex-root">
        {/*begin::Login*/}
        <div
          className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-row-fluid bg-white"
          id="kt_login"
        >
          {/*begin::Aside*/}
          {/* className="login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10"*/}
          <div
            className="login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-lg-10"
            style={{
              backgroundImage: `url(${toAbsoluteUrl("/media/bg/bgtes1.jpg")})`
            }}
          >
            {/*begin: Aside Container*/}
            <div
              className="d-flex flex-row-fluid flex-column justify-content-between"
              style={{ alignSelf: "flex-end" }}
            >
              {/* start:: Aside header */}
              {/* <Link to="/" className="flex-column-auto mt-5">
                <img
                  alt="Logo"
                  className="max-h-70px"
                  src={toAbsoluteUrl("/media/logos/logo-letter-1.png")}
                />
              </Link> */}
              {/* end:: Aside header */}

              {/* start:: Aside content */}
              {/* <div className="flex-column-fluid d-flex flex-column justify-content-center">
                  <h3 className="font-size-h1 mb-5 text-white">
                    Welcome to BEETPOS!
                  </h3>
                  <p className="font-weight-lighter text-white opacity-80">
                    The ultimate Bootstrap & React 16 admin theme framework for next
                    generation web apps.
                  </p>
                </div> */}
              {/* end:: Aside content */}

              {/* start:: Aside footer for desktop */}
              <div className="d-none flex-column-auto d-lg-flex justify-content-between mt-10">
                <div className="opacity-70 font-weight-bold	text-white">
                  &copy; 2021 Lifetech
                </div>
                <div className="d-flex">
                  <Link to="/terms" className="text-white">
                    {t('privacy')}
                  </Link>
                  <Link to="/terms" className="text-white ml-10">
                    {t('legal')}
                  </Link>
                  <Link to="/terms" className="text-white ml-10">
                    {t('contact')}
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
            {/*begin::Content header*/}
            <div className="position-absolute top-0 right-0 text-right mt-5 mb-0 mb-lg-15 flex-column-auto justify-content-center py-5 px-10">
              {authState === 'login' ? (
                <>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="font-weight-bold text-dark-50 dont-have-an-account-yet">
                    {t('dontHaveAnAccountYet')}
                  </span>
                  <button type="button" class="btn btn-outline-primary btn-sm ml-2" onClick={pushToRegister}>
                    {t('signUp')}
                  </button>
                </div>
                </>
              ) : (
                <>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="font-weight-bold text-dark-50 dont-have-an-account-yet">
                    {t('alreadyHaveAccount')}
                  </span>
                  <button type="button" class="btn btn-outline-primary btn-sm ml-2" onClick={pushToLogin}>
                    {t('signIn')}
                  </button>
                </div>
                </>
              )}
            </div>
            {/*end::Content header*/}

            {/* begin::Content body */}
            <div className="d-flex flex-column-fluid flex-center mt-20 mt-lg-30">
              <Switch>
                <ContentRoute path="/auth/login/staff" component={LoginStaff} />

                <ContentRoute path="/auth/login" component={Login} />
                <ContentRoute
                  path="/auth/registration"
                  component={Registration}
                />
                <ContentRoute
                  path="/auth/beetpos-registration"
                  component={RegistrationTryNow}
                />
                <ContentRoute
                  path="/auth/forgot-password"
                  component={ForgotPassword}
                />
                <Redirect from="/auth" exact={true} to="/auth/login" />
                <Redirect to="/auth/login" />
              </Switch>
            </div>
            {/*end::Content body*/}

            {/* begin::Mobile footer */}
            <div className="d-flex d-lg-none flex-column-auto flex-column flex-sm-row justify-content-between align-items-center mt-5 p-5">
              <div className="text-dark-50 font-weight-bold order-2 order-sm-1 my-2">
                &copy; 2021 Lifetech
              </div>
              <div className="d-flex order-1 order-sm-2 my-2">
                <Link to="/terms" className="text-dark-75 text-hover-primary">
                  {t('privacy')}
                </Link>
                <Link
                  to="/terms"
                  className="text-dark-75 text-hover-primary ml-4"
                >
                  {t('legal')}
                </Link>
                <Link
                  to="/terms"
                  className="text-dark-75 text-hover-primary ml-4"
                >
                  {t('contact')}
                </Link>
              </div>
            </div>
            {/* end::Mobile footer */}
          </div>
          {/*end::Content*/}
        </div>
        {/*end::Login*/}
      </div>
    </>
  );
}
