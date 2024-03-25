import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Form, Row, Col } from "react-bootstrap";
import styles from "./saleschannelpage.module.css";

import { Paper } from "@material-ui/core";

import logoTokopedia from "../../../images/tokopedia.png";
import logoBukalapak from "../../../images/logo-bukalapak.png";
import logoShopee from "../../../images/shopee.png";
import logoBlibli from "../../../images/blibli.png";
import logoLazada from "../../../images/lazada.png";
import logoJdid from "../../../images/jdid.png";
import logoZilingo from "../../../images/zilingo.png";
import logoZalora from "../../../images/zalora.png";

import ModalSalesChannel from './ModalSalesChannel'
import ModalBlibli from "./ModalBlibli";
import ModalShopee from "./ModalShopee";

export const SalesChannelPage = () => {
  const { t } = useTranslation();
  const API_URL = process.env.REACT_APP_API_URL;
  const [allOutlets, setAllOutlets] = useState([]);
  const [outletId, setOutletId] = useState();
  const [showModal, setShowModal] = useState(false)
  const [showModalBlibli, setShowModalBlibli] = useState(false)
  const [showModalShopee, setShowModalShopee] = useState(false)

  const [platform, setPlatform] = useState()

  const getOutlets = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectOutlet = (e) => {
    const { value } = e.target;
    setOutletId(value);
  };

  useEffect(() => {
    getOutlets();
  }, []);

  const handleClose = () => setShowModal(false)
  const handleCloseBlibli = () => setShowModalBlibli(false)
  const handleCloseShopee = () => setShowModalShopee(false)

  const handlePlatform = (name) => {
    console.log("name", name)
    setPlatform(name)
    if(name === 'Blibli') {
      setShowModalBlibli(true)
    } else if (name === 'Shopee') {
      setShowModalShopee(true)
      console.log("Masuk Shopee", name)
    }else {
      setShowModal(true)
    }
  }

  const handleOpenModal = () => setShowModal(true)

  return (
    <>
    <ModalSalesChannel 
      show={showModal}
      close={handleClose}
      platform={platform}
      t={t}
      outletId={outletId}
      handleOpenModal={handleOpenModal}
    />

    <ModalBlibli
      show={showModalBlibli}
      close={handleCloseBlibli}
      platform={platform}
      t={t}
      outletId={outletId}
      handleOpenModal={handleOpenModal}
    />

    <ModalShopee
      show={showModalShopee}
      close={handleCloseShopee}
      platform={platform}
      t={t}
      outletId={outletId}
      handleOpenModal={handleOpenModal}
    />

      <Paper elevation={2} style={{ padding: "1rem", height: "fit-content" }}>
        <div className="headerPage mb-5">
          <div className="headerStart">
            <h3>{t("salesChannel")}</h3>
          </div>
        </div>

        <div className="container">
          <Row>
            <Col>
              <Form.Group as={Row}>
                <Form.Label style={{ alignSelf: "center", marginBottom: "0" }}>
                  {t("selectOutlet")}:
                </Form.Label>
                <Col>
                  <Form.Control
                    as="select"
                    name="outlet_id"
                    value={outletId}
                    onChange={handleSelectOutlet}
                  >
                    <option value="">{t("all")}</option>
                    {allOutlets.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {/* {item.Location?.name} */}
                          {item.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Col>
              </Form.Group>
            </Col>
          </Row>
          {outletId ? (
            <>
              <Row style={{marginBottom: '30px'}}>
                <Col className="d-flex align-items-end">
                  <div className={styles.containerTokopedia}>
                    <div
                      className={`${styles.wrapperTokopedia} ${styles.hoverEffect}`}
                      onClick={() => handlePlatform("Tokopedia")}
                    >
                      <img src={logoTokopedia} alt="Logo Tokopedia" />
                    </div>
                  </div>
                  <div className={styles.containerBukalapak}>
                    <div
                      className={`${styles.wrapperBukalapak} ${styles.hoverEffect}`}
                      onClick={() => handlePlatform("Bukalapak")}
                    >
                      <img src={logoBukalapak} alt="Logo Bukalapak" />
                    </div>
                  </div>
                  <div className={styles.containerShopee}>
                    <div
                      className={`${styles.wrapperShopee} ${styles.hoverEffect}`}
                      onClick={() => handlePlatform("Shopee")}
                    >
                      <img src={logoShopee} alt="Logo Shopee" />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row style={{marginBottom: '30px'}}>
                <Col className="d-flex align-items-end">
                  <div className={styles.containerBlibli}>
                    <div
                      className={`${styles.wrapperBlibli} ${styles.hoverEffect}`}
                      onClick={() => handlePlatform("Blibli")}
                    >
                      <img src={logoBlibli} alt="Logo Blibli" />
                    </div>
                  </div>
                  {/* <div className={styles.containerLazada}>
                    <div
                      className={`${styles.wrapperLazada} ${styles.hoverEffect}`}
                      onClick={() => handlePlatform("Lazada")}
                    >
                      <img src={logoLazada} alt="Logo Lazada" />
                    </div>
                  </div> */}
                  <div className={styles.containerJDid}>
                    <div
                      className={`${styles.wrapperJDid} ${styles.hoverEffect}`}
                      onClick={() => handlePlatform("JDid")}
                    >
                      <img src={logoJdid} alt="Logo JDid" />
                    </div>
                  </div>
                  
                  <div className={styles.containerZalora}>
                    <div
                      className={`${styles.wrapperZalora} ${styles.hoverEffect}`}
                      onClick={() => handlePlatform("Zalora")}
                    >
                      <img src={logoZalora} alt="Logo Zalora" />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row style={{marginBottom: '30px'}}>
                <Col className="d-flex align-items-end">
                  {/* <div className={styles.containerZalora}>
                    <div
                      className={`${styles.wrapperZalora} ${styles.hoverEffect}`}
                      onClick={() => handlePlatform("Zalora")}
                    >
                      <img src={logoZalora} alt="Logo Zalora" />
                    </div>
                  </div> */}
                  <div className={styles.containerZilingo}>
                    {/* <div
                      className={`${styles.wrapperZilingo} ${styles.hoverEffect}`}
                      onClick={() => handlePlatform("Zilingo")}
                    >
                      <img src={logoZilingo} alt="Logo Zilingo" />
                    </div> */}
                  </div>
                  <div></div>
                </Col>
              </Row>
            </>
          ) : null}
        </div>
      </Paper>
    </>
  );
};
