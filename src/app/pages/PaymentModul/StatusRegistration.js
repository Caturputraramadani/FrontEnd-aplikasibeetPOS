import React, {useEffect, useState} from 'react';

import {
  Row,
  Col,
  Form
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

import {
  Paper
} from "@material-ui/core";

import './style.css'
import styles from './modalsignature.module.css'

const StatusRegistration = ({
	t,
	business,
	businessFormData
}) => {
	console.log("businessFormData", businessFormData)
  return (
    <div>
      <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
        <div className="headerPage mb-5">
          <div className="headerStart">
            <h3>{t("statusRegistration")}</h3>
          </div>
        </div>
        <div className="container">
					{businessFormData.length ? 
					businessFormData.map(value => 
					<div className="row">
						<div className="col-12 col-md-12 hh-grayBox pt45 pb20 mb-3">
							<div className={styles.wrapperPayment}>
								<div>
									<div className={styles.title}>
										{t('trackingProcess')}
									</div>
									<div className={styles.value}>
										{value.status}
									</div>
								</div>
								<div>
									<div className={styles.title}>
										{t('paymentGatewayName')}
									</div>
									<div className={styles.value}>
										{value.payment_gateway_name}
									</div>
								</div>
								<div>
									<div className={styles.title}>
										{t('registerTypeCashlez')}
									</div>
									<div className={styles.value}>
										{value.register_type_cz}
									</div>
								</div>
							</div>
							<div className="row justify-content-between">
								<div className={`order-tracking ${value.tracking_process > 0 && value.tracking_process < 5 ? 'completed' : ''}`}>
									<span className="is-complete"></span>
									<p>{t('alreadySubmittedOnBeetpos')}<br /><span>{value.date_tracking_1 ? value.date_tracking_1 : ""}</span>
									<br />
									{/* <span>{value.time_tracking_1 ? value.time_tracking_1 : ""}</span> */}
									</p>
								</div>
								<div className={`order-tracking ${value.tracking_process > 1 && value.tracking_process < 5 ? 'completed' : ''}`}>
									<span className="is-complete"></span>
									<p>{t('paymentGatewayIsInProgress')}<br /><span>{value.date_tracking_2 ? value.date_tracking_2 : ""}</span>
									<br />
									{/* <span>{value.time_tracking_2 ? value.time_tracking_2 : ""}</span> */}
									</p>
								</div>
								<div className={`order-tracking ${value.tracking_process > 2 && value.tracking_process < 5 ? 'completed' : ''}`}>
									<span className="is-complete"></span>
									<p>{t('cashlezIssuancePeriod')}<br /><span>{value.date_tracking_3 ? value.date_tracking_3 : ""}</span>
									<br />
									{/* <span>{value.time_tracking_3 ? value.time_tracking_3 : ""}</span> */}
									</p>
								</div>
								<div className={`order-tracking ${value.tracking_process > 3 && value.tracking_process < 5 ? 'completed' : ''}`}>
									<span className="is-complete"></span>
									<p>{t('completedStatus')}<br /><span>{value.date_tracking_4 ? value.date_tracking_4 : ""}</span>
									<br />
									{/* <span>{value.time_tracking_4 ? value.time_tracking_4 : ""}</span> */}
									</p>
								</div>
							</div>
						</div>
					</div>)
					: 
					(<div className="d-flex justify-content-center py-3">There are no status registration to display</div>)
				}
        </div>
      </Paper>
    </div>
  );
}

export default StatusRegistration;
