import React from 'react'
import { Link, Switch, Redirect, useHistory } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../_metronic/_helpers";
import { ContentRoute } from "../../../../../_metronic/layout";
import Login from "../Login";
import Registration from "../Registration";
import RegistrationTryNow from "../RegistrationTryNow";
import ForgotPassword from "../ForgotPassword";
import "../../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";
import LoginStaff from "../LoginStaff";
import { useTranslation } from "react-i18next";
import VerifyEmail from './VerifyEmail'
import LocationBusiness from './LocationBusiness'

export function AdvancedProcessRegister() {
  const { t } = useTranslation();

  return (
    <>
      <div className="d-flex flex-column flex-root">
        {/*begin::Login*/}
        <div
          className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-row-fluid bg-white"
          id="kt_login"
        >
          {/* className="login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10" */}
          {/*begin::Aside*/}
          <div
            className="login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-lg-10"
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
            <div className="position-absolute top-0 right-0 text-right mt-5 mb-15 mb-lg-0 flex-column-auto justify-content-center py-5 px-10">
            </div>
            {/*end::Content header*/}

            {/* begin::Content body */}
            <div className="d-flex flex-column-fluid justify-content-center mt-lg-0 ml-lg-3 my-lg-3">
              <Switch>
                <ContentRoute path="/register-process/verify-email" component={VerifyEmail} />
                <ContentRoute path="/register-process/business-location" component={LocationBusiness} />

                <Redirect from="/register-process" exact={true} to="/register-process/verify-email" />
                <Redirect to="/register-process/verify-email" />
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
  )
}
