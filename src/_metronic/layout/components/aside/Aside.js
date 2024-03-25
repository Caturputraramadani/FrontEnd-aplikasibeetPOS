import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import objectPath from "object-path";
import { Brand } from "../brand/Brand";
import { AsideMenu } from "./aside-menu/AsideMenu";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import ChatBox from "../ChatBox";

export function Aside({ t, stateScroll }) {
  const uiService = useHtmlClassService();
  const [hide, setHide] = React.useState(false);

  const layoutProps = useMemo(() => {
    return {
      disableScroll: objectPath.get(uiService.config, "aside.menu.dropdown") === "true" || false,
      asideClassesFromConfig: uiService.getClasses("aside", true),
      disableAsideSelfDisplay: objectPath.get(uiService.config, "aside.self.display") === false,
      headerLogo: uiService.getLogo(),
    };
  }, [uiService]);

  return (
    <>
      <div
        id="kt_aside"
        className={`aside aside-left  ${layoutProps.asideClassesFromConfig} d-flex flex-column flex-row-auto`}
      >
        <Brand t={t} hide={hide} />

        <div id="kt_aside_menu_wrapper" className="aside-menu-wrapper flex-column-fluid d-flex flex-column justify-content-between">
          {layoutProps.disableAsideSelfDisplay && (
            <>
              <div className="header-logo">
                <Link to="/">
                  <img alt="logo" src={layoutProps.headerLogo} />
                </Link>
              </div>
            </>
          )}
          <AsideMenu
            disableScroll={layoutProps.disableScroll}
            hide={hide}
            stateScroll={stateScroll}
          />
          <ChatBox />
        </div>
      </div>
    </>
  );
}