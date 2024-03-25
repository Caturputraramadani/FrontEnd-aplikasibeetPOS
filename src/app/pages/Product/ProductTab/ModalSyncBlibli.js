import React from "react";
import { Button, Modal, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import ExportExcel from "react-html-table-to-excel";
import NumberFormat from "react-number-format";
import rupiahFormat from "rupiah-format";
import moment from 'moment';
import { useTranslation } from "react-i18next";
import dayjs from 'dayjs'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from './modalsync.module.css'
toast.configure();
const ModalSyncBlibli = ({
  state,
  closeModal,
  optionsOutlet,
  handleExports,
  loading,
  dataProduct,
  showFeature,
  handleOptionOutlet,
  productOfOutlet,
  tempOptionOutlet,
  outletIntegratedBlibli
}) => {
  const { t } = useTranslation();

  const API_URL = process.env.REACT_APP_API_URL;
  const date = new Date()

  const [fileName, setFileName] = React.useState("");
  const [currency, setCurrency] = React.useState("");
  const [currProduct, setCurrProduct] = React.useState([])

  const [outletId, setOutletId] = React.useState(null)
  const [outletWithIntegrate, setOutletWithIntegrate] = React.useState([])
  const [alert, setAlert] = React.useState("");

  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const { data } = await axios.get(
      `${API_URL}/api/v1/business/${userInfo.business_id}`
    );

    setCurrency(data.data.Currency.name);
  };

  const handleFilename = () => {
    const uniqueArray = [];
    dataProduct.map((value) => {
      if (uniqueArray.indexOf(value.Outlet.name) === -1) {
        uniqueArray.push(value);
      }
    });
    setCurrProduct(uniqueArray)
  };

  const optionOutletIntegrate = (allOutlet) => {
    const result = []
    allOutlet.map(value => {
      outletIntegratedBlibli.map(value2 => {
        console.log("value.name", value.name)
        console.log("value2", value2)
        if(value.name === value2) {
          result.push(value)
        }
      })
    })
    console.log("result", result)
    const optionsOutlet = result.map((item) => {
      return { value: item.id, label: item.name };
    });
    setOutletWithIntegrate(optionsOutlet)
  }

  React.useEffect(() => {
    handleCurrency();
  }, []);

  React.useEffect(() => {
    handleFilename();
  }, [dataProduct]);

  React.useEffect(() => {
    optionOutletIntegrate(tempOptionOutlet)
  }, [tempOptionOutlet])

  const productData = [
    {
      id: 1,
      name: "Bakso Bakso Bakso Bakso ",
      stock: 20
    },
    {
      id: 2,
      name: "Sate",
      stock: 30
    },
    {
      id: 3,
      name: "Rawon",
      stock: 40
    },
    {
      id: 4,
      name: "Mie Ayam",
      stock: 50
    },
    {
      id: 5,
      name: "Nasi Bungkus",
      stock: 60
    },
    {
      id: 1,
      name: "Bakso Bakso Bakso Bakso ",
      stock: 20
    },
    {
      id: 2,
      name: "Sate",
      stock: 30
    },
    {
      id: 3,
      name: "Rawon",
      stock: 40
    },
    {
      id: 4,
      name: "Mie Ayam",
      stock: 50
    },
    {
      id: 5,
      name: "Nasi Bungkus",
      stock: 60
    }
  ];

  const checkOutletIntegrate = () => {
    const currOutlet = tempOptionOutlet.find(
      (val) => val.id == outletId
    )
    console.log("currOutlet", currOutlet)
    if(currOutlet.blibli_store_id && currOutlet.blibli_auth) {
      return true
    } else {
      return false
    }
  }

  const handleSyncBlili = async () => {
    try {
      if(true) {
      // if(checkOutletIntegrate()) {
        setAlert("")
      
        const request_id = `Lifetech - ${outletId} - ${moment(new Date()).format("YYYYMMDDHHmmss")}`
        const container_gdnsku_blibli = []
        const send_list_product_blibli = {
          requestId: request_id,
          outlet_id: outletId,
          page: 0
        }
        const listProductBlibli = await axios.post(`${API_URL}/api/v1/blibli/get-product`, send_list_product_blibli)
  
        const page_number = listProductBlibli.data.data.pageMetaData.pageNumber
  
        for (let i = 0; i <= page_number ; i++) {
          const temp_obj = {
            ...send_list_product_blibli,
            page: i
          }
          const listProductBlibli = await axios.post(`${API_URL}/api/v1/blibli/get-product`, temp_obj)
          const temp_content = listProductBlibli.data.data.content
          temp_content.map(async (value) => {
            container_gdnsku_blibli.push(value.gdnSku)
            const send_save_temp_product = {
              requestId: request_id,
              outlet_id: outletId,
              sku: value.gdnSku,
              updatedDateBlibli: value.updatedDate
            }
            await axios.post(`${API_URL}/api/v1/blibli/save-temp-product`, send_save_temp_product)
          })
        }
        for(const value of container_gdnsku_blibli) {
          const send_sync_in_single = {
            sku: value,
            outlet_id: outletId,
          }
          await axios.post(`${API_URL}/api/v1/blibli/sync-in-single`, send_sync_in_single)
        }
        await handleOptionOutlet(outletId)
        toast.success(t('synsBlibliProductSuccess'), {
          position: "top-right",
          autoClose: 4500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      } else {
        throw new Error(`${t("theOutletIsNotIntegratedWithBlibli")}`)
      }
    } catch (err) {
      console.log("ERROR handleSyncBlili", err)
      setAlert(err.response?.data.message || err.message);
    }
  }

  return (
    <div>
      <Modal show={state} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t("syncProduct")} Blibli</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}
          <Row>
            <Col>
              <small>* {t('pleaseSelectAnOutletToSyncProducts')}</small>
              <Form.Group>
                <div className="d-flex justify-content-between align-items-end py-2">
                  <div style={{fontSize: "1 rem", fontWeight: "400", color: "#3F4254"}}>{t("locationOutlet")}:</div>
                  {outletId ? (
                    <div className="badge badge-info" onClick={handleSyncBlili}>
                      sync
                    </div>
                  ) : null }
                </div>
                <Select
                  options={outletWithIntegrate}
                  placeholder={t('select')}
                  name="outlet_id"
                  className="basic-select"
                  classNamePrefix="select"
                  onChange={(value) => {
                    setOutletId(value.value)
                    handleOptionOutlet(value.value)
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={styles.wrapperBodyModalSync}>
                {productOfOutlet.map((value) => (
                  <>
                    <div className={styles.wrapperListProduct}>
                      <div className="">
                        <label style={{margin: 0, padding: 0}}>{t('productName')} :</label>
                        <h5>{value.name}</h5>
                      </div>
                      <div className="">
                        <label style={{margin: 0, padding: 0}}>{t('stock')} :</label>
                        <h5>{value.stock}</h5>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </Col>
          </Row>
        </Modal.Body>

        {/* <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              "Confirm"
            )}
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
};

export default ModalSyncBlibli;
