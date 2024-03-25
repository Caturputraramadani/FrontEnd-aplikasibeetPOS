import React, {useMemo, useState} from "react";
import {Link} from "react-router-dom";
import objectPath from "object-path";
import SVG from "react-inlinesvg";
import {useHtmlClassService} from "../../_core/MetronicLayout";
import {toAbsoluteUrl} from "../../../_helpers";


export function Brand({t, hide, hideLabel}) {

  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      brandClasses: uiService.getClasses("brand", true),
      asideSelfMinimizeToggle: objectPath.get(
          uiService.config,
          "aside.self.minimize.toggle"
      ),
      headerLogo: uiService.getLogo(),
      headerStickyLogo: uiService.getStickyLogo()
    };
  }, [uiService]);

  return (
    <>
      {/* begin::Brand */}
      <div
          className={`brand flex-column-auto ${layoutProps.brandClasses}`}
          id="kt_brand"
      >
        {/* begin::Logo */}
        <div>
          <Link to="" className="brand-logo">
            <img alt="logo" src={layoutProps.headerLogo}/>
          </Link>
          {!hide ? (
            <div className="text-primary">
              {t('owner')}
            </div>
          ) : null }
        </div>
        {/* end::Logo */}

        {layoutProps.asideSelfMinimizeToggle && (
          <>
            {/* begin::Toggle */}
            <button className="brand-toggle btn btn-sm px-0" id="kt_aside_toggle" onClick={hideLabel}>
              <span className="svg-icon svg-icon-xl">
                  <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Angle-double-left.svg")}/>
              </span>
            </button>
            {/* end::Toolbar */}
            </>
        )}
      </div>
      {/* end::Brand */}
      </>
  );
}
