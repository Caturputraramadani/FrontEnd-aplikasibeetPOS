import React, { useMemo, useState } from "react";
import AsideMenuList from "./AsideMenuList";
import { useHtmlClassService } from "../../../_core/MetronicLayout";

export function AsideMenu({ disableScroll, hideLabel, hide, stateScroll }) {
  const uiService = useHtmlClassService();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State to manage mobile menu open/close

  const layoutProps = useMemo(() => {
    return {
      layoutConfig: uiService.config,
      asideMenuAttr: uiService.getAttributes("aside_menu"),
      ulClasses: uiService.getClasses("aside_menu_nav", true),
      asideClassesFromConfig: uiService.getClasses("aside_menu", true)
    };
  }, [uiService]);

  // Function to open mobile menu
  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  // Function to close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* begin::Menu Container */}
      <div
        id="kt_aside_menu"
        data-menu-vertical="1"
        className={`aside-menu my-4 ${layoutProps.asideClassesFromConfig} ${mobileMenuOpen ? "aside-mobile-show" : ""}`}
        {...layoutProps.asideMenuAttr}
      >
        <AsideMenuList layoutProps={layoutProps} hideLabel={hideLabel} hide={hide} stateScroll={stateScroll}/>
      </div>
      {/* end::Menu Container */}
      {/* Mobile menu toggle button */}
      <button className="aside-toggle btn btn-icon btn-primary" onClick={mobileMenuOpen ? closeMobileMenu : openMobileMenu}>
        <i className="ki ki-bold-more-ver" />
      </button>
    </>
  );
}