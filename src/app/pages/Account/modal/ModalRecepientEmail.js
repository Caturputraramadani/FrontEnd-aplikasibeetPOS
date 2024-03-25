import React from 'react';
import { Button, Modal, Spinner, Form, Row, Col } from "react-bootstrap";
import axios from 'axios'
import './style.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalRecepientEmail = ({
  t,
  cancelModal,
  stateModal,
  title,
  loading
}) => {
  toast.configure()
  const [businessEmail, setBusinessEmail] = React.useState([])
  const [addEmail, setAddEmail] = React.useState("")

  const API_URL = process.env.REACT_APP_API_URL;

  const getBusinessEmail = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/business-email`)
      setBusinessEmail(data.data)
      // console.log("getBusinessEmail", data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const toastSuccess = () => {
    return toast.success(t('addEmailRecipientSuccess'), {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const toastInfo = () => {
    return toast.info(t('somethingWentWrong'), {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const handleAddBusinessEmail = async () => {
    try {
      if(addEmail.length < 1) return toastInfo()
      await axios.post(`${API_URL}/api/v1/business-email`, {email: addEmail})
      toastSuccess()
      getBusinessEmail()
      setAddEmail(" ")
    } catch (error) {
      setAddEmail("")
      console.log(error)
      toastInfo()
    }
  }

  const handleDeleteBusinessEmail = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/v1/business-email/${id}`)
      toastSuccess()
      getBusinessEmail()
    } catch (error) {
      console.log(error)
      console.log(error)
      toastInfo()
    }
  }

  React.useEffect(() => {
    getBusinessEmail()
  },[])

  return (
    <Modal show={stateModal} onHide={cancelModal} size="md">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="wrapper-form-add-recepient-email">
          <Form.Group>
            <Form.Label>{t("addRecipientEmail")}:</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={addEmail}
              placeholder={t("addNewEmail")}
              required
              onChange={(e) => {
                setAddEmail(e.target.value)
              }}
            />
          </Form.Group>
        </div>
        <Form.Label>{t("emailRecipientList")}:</Form.Label>
        {businessEmail.map(value => 
          <div className="list-business-email-modal-recepient">
            <div className="business-email-recepient">
              {value.email}
            </div>
            <div className="badge badge-danger" onClick={() => handleDeleteBusinessEmail(value.id)}>{t("delete")}</div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancelModal}>
          {t("cancel")}
        </Button>
        <Button variant="primary" type="submit" onClick={handleAddBusinessEmail}>
          {loading ? (
            <Spinner animation="border" variant="light" size="sm" />
          ) : (
            `${t("saveChanges")}`
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalRecepientEmail;
