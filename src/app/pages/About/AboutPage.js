import React from 'react';
import { Paper } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import beetposLogo from '../../../images/logo beetPOS new.png'
import styles from './aboutpage.module.css'

const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className={styles.wrapperContent}>
            <div className="d-flex flex-column align-items-center">
              <div className={styles.wrapperLogo}>
                <img src={beetposLogo} alt="Logo BeetPOS"/>
              </div>
              <h6>POS System</h6>
              <h5>Version 1.0.1</h5>
              <br />
              &copy; 2021 Lifetech
            </div>
          </div>
        </Paper>
    </div>
  )
}

export default AboutPage;
