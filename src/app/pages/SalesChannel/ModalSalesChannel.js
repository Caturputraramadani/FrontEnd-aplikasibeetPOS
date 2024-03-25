import React, { useState, useEffect } from "react";
import { Modal, Spinner, Form, Row, Col, Alert } from "react-bootstrap";
import styles from "./saleschannelpage.module.css";
import ModalAddAccount from "./ModalAddAccount";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure()

const ModalSalesChannel = ({ show, close, platform, t, outletId, handleOpenModal }) => {
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
  const [hasAccount, setHasAccount] = useState(false)
  const [accountName, setAccountName] = useState("")
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
    setAccountName("")
    setHasAccount(false)
    close()
  }

  const handleOutletId = async (outlet_id, platform_name) => {
    console.log("platform_name", platform_name)
    if (platform_name) {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/outlet/${outlet_id}`
        );
        const lowerCase = platform_name.toLowerCase() + "_url";
        if(data.data[lowerCase]){
          setHasAccount(true)
          console.log("account Name", data.data[lowerCase])
          setAccountName(data.data[lowerCase])
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
  console.log("allUrlPlatform", allUrlPlatform);

  useEffect(() => {
    handleOutletId(outletId, platform);
  }, [outletId, platform, refresh]);

  const handleSave = async (name) => {
    try {
      let currAccount;
      if (name) {
        currAccount = name
      } else {
        currAccount = account
      }
      const lowerCase = platform.toLowerCase() + "_url";
      await axios.put(`${API_URL}/api/v1/sales-channel/${outletId}`,{
        [lowerCase]: currAccount
      })
      toast.success(t('successfullyAddedAccountPleaseWaitForLeverageByBeetpos'), {
        position: "top-right",
        autoClose: 8500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      handleRefresh()
      handleOpenModal()
      closePlatform()
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleupdate = (name) => {
    handleSave(name)
  }

  const handleAccountName = (name) => setAccount(name)

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
            Select Account {platform}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {hasAccount ? (
            <div className={styles.wrapperAccount}>
              <>
              <input className={styles.inputAccountName} type="text" defaultValue={accountName} onBlur={(e) => handleupdate(e.target.value)}/>
              {/* {accountName} */}
              </>
            </div>
          ) : (
            <div className={styles.box} onClick={openPlatform}>
              <div className={styles.addAccount}>Add Account</div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalSalesChannel;
