import React from 'react';
import { Button, Modal } from "react-bootstrap";

const AlertOutletLimit = ({cancelModal, stateModal, title, t}) => {
  return (
    <div>
      <Modal show={stateModal} onHide={cancelModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="title-outlet-limit">
              {title}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <div className="alert-outlet-limit my-5">
            {t('youHaveReachedTheOutletQuotaLimit')}
            <br />
            {t('contactUsForAdditionalOutletRequest')}
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-end">
          <Button className="mx-4 my-4" variant="secondary" onClick={cancelModal}>
            {t("close")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default AlertOutletLimit;
