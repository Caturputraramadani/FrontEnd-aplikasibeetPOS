import React, { useState, useEffect } from "react";
import { Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import styles from "./saleschannelpage.module.css";
import ModalAddAccount from "./ModalAddAccount";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

const ModalBlibli = ({ show, close, platform, t, outletId, handleOpenModal }) => {
  const [showPlatform, setShowPlatform] = useState(false);
  const [refresh, setRefresh] = useState(0)
  const [account, setAccount] = useState("")
  const [allUrlPlatform, setAllUrlPlatform] = useState({
    tokopedia_url: "",
    bukalapak_url: "",
    shopee_url: "",
    blibli_url: "",
    lazada_url: "",
    jdid_url: "",
    zalora_url: ""
  });
  const [hasCredentials, setHasCredentials] = useState(false)
  const [credentials, setCredentials] = useState({
    blibli_store_id: "",
    blibli_auth: ""
  })
  const handleRefresh = () => {
    setRefresh((state) => state + 1);
  };
  const API_URL = process.env.REACT_APP_API_URL;

  const openPlatform = () => {
    setShowPlatform(true);
    handleClose();
  };
  const closePlatform = () => setShowPlatform(false);
  
  const handleClose = () => {
    console.log("handleClose")
    setCredentials("")
    setHasCredentials(false)
    close()
  }

  const handleOutletId = async (outlet_id, platform_name) => {
    console.log("platform_name", platform_name)
    if (platform_name) {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/outlet/${outlet_id}`
        );
        const credentials = platform_name.toLowerCase() + "_store_id";
        const auth = platform_name.toLowerCase() + "_auth";

        if(data.data[credentials] || data.data[auth]){
          setHasCredentials(true)
          setCredentials({
            blibli_auth: data.data[auth] || null,
            blibli_store_id: data.data[credentials] || null
          })
        }
        setAllUrlPlatform({
          tokopedia_url: data.data.tokopedia_url,
          bukalapak_url: data.data.bukalapak_url,
          shopee_url: data.data.shopee_url,
          blibli_url: data.data.blibli_url,
          lazada_url: data.data.lazada_url,
          jdid_url: data.data.jdid_url,
          zalora_url: data.data.zalora_url
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    handleOutletId(outletId, platform);
  }, [outletId, platform, refresh]);

  const handleSave = async (value, params) => {
    try {
      const lowerCase = platform.toLowerCase() + `_${params}`;
      await axios.patch(`${API_URL}/api/v1/outlet/patch-credentials/${outletId}`,{
        [lowerCase]: value
      })
      toast.success(t('successfullyInputCredentials'), {
        position: "top-right",
        autoClose: 8500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      handleRefresh()
      closePlatform()
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleupdate = (value, name) => {
    handleSave(value, name)
  }

  const handleAccountName = (name) => setAccount(name)

  console.log("credentials", credentials)

  return (
    <div>
      <ModalAddAccount
        showPlatform={showPlatform}
        closePlatform={closePlatform}
        t={t}
        platform={platform}
        handleSave={handleSave}
        handleAccountName={handleAccountName}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            Credentials {platform}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Blibli Auth :</Form.Label>
          {credentials.blibli_auth ? (
            <div className={styles.wrapperCredentialsExist}>
              <input className={styles.inputCredentialsExist} type="text" defaultValue={credentials.blibli_auth} onBlur={(e) => handleupdate(e.target.value, 'auth')}/>
            </div>
          ) : (
            <div className={styles.wrapperCredentialsNew}>
              <input className={styles.inputCredentialsNew} type="text" placeholder={t('pleaseInputBlibliAuth')} onBlur={(e) => handleupdate(e.target.value, 'auth')}/>
            </div>
          )}

          <Form.Label className="mt-2">Store Id :</Form.Label>
          {credentials.blibli_store_id ? (
            <div className={styles.wrapperCredentialsExist}>
              <input className={styles.inputCredentialsExist} type="text" defaultValue={credentials.blibli_store_id} onBlur={(e) => handleupdate(e.target.value, 'store_id')}/>
            </div>
          ) : (
            <div className={styles.wrapperCredentialsNew}>
              <input className={styles.inputCredentialsNew} type="text" placeholder={t('pleaseInputBlibliStoreId')} onBlur={(e) => handleupdate(e.target.value, 'store_id')}/>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalBlibli;
