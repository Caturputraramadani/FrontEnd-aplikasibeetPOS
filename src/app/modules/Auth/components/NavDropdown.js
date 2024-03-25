import React, {useState
} from 'react';
import styles from '../pages/registrationmarketing.module.css'
import IconClose from '../../../../images/icons8-multiply-100.png'
import LogoBeetpos from '../../../../images/logo beetPOS new.png'
import { Link } from "react-router-dom";

const NavDropdown = ({state, handleClose}) => {
  return (
    <div>
        <div className={`${styles.containerNavDropdown} ${state ? styles.show : null }`}>
          {state ? (
            <>
              <div className="d-flex justify-content-between">
                <div>
                  <div className={styles.wrapperLogoBeetpos}>
                    <img src={LogoBeetpos} alt="Logo Beetpos" />
                  </div>
                  {/* <div className={styles.MenuNavDropdown}>Point Of Sale</div>
                  <div className={styles.MenuNavDropdown}>Go Onlie</div>
                  <div className={styles.MenuNavDropdown}>Harga</div>
                  <div className={styles.MenuNavDropdown}>Perangkat</div>
                  <div className={styles.MenuNavDropdown}>Lainya</div> */}
                </div>
                <div className="d-flex justify-content-end">
                  <div className={styles.wrapperIconClose} onClick={handleClose}>
                    <img src={IconClose} alt="Icon Close" />
                  </div>
                </div>
              </div>
              <hr />
              <Link to="/auth/login">
                <div 
                  type="button"
                  className={`${styles.buttonLogin} btn btn-primary`}
                >
                  Login
                </div>
              </Link>
              {/* <div
                type="button"
                className={`${styles.buttonSignup} btn btn-light-primary`}
              >
                Sign Up
              </div> */}
            </>
          ) : null }
        </div>
    </div>
  );
}

export default NavDropdown;
