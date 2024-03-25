import React from 'react'
import { Button, Modal, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import axios from 'axios'
import ExportExcel from "react-html-table-to-excel";
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';
import rupiahFormat from "rupiah-format";
import { useTranslation } from "react-i18next";
const ExportModalAddons = ({state, closeModal, optionsOutlet, handleExports, loading, dataProduct, dataAddonsProduct, showFeature}) => {
  const { t } = useTranslation();

  const [fileName, setFileName] = React.useState("")
  const [currency, setCurrency] = React.useState("")

  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));

    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)

    setCurrency(data.data.Currency.name)
  }

  const handleFilename = () => {
    console.log("dataProduct", dataProduct)
    const uniqueArray = [];
    dataProduct.map(value => {
      if(uniqueArray.indexOf(value.Outlet.name) === -1) {
        uniqueArray.push(value.Outlet.name);
      }
    })

    const dt = new Date();
    const dateTime = `${
      (dt.getMonth()+1).toString().padStart(2, '0')}-${
      dt.getDate().toString().padStart(2, '0')}-${
      dt.getFullYear().toString().padStart(4, '0')}_${
      dt.getHours().toString().padStart(2, '0')}-${
      dt.getMinutes().toString().padStart(2, '0')}-${
      dt.getSeconds().toString().padStart(2, '0')}`

    const FileName = () => {
      if(dataProduct.length) {
        return `List-Addons-Product_${dataProduct[0]?.Business.name}_${uniqueArray.join("_")}_${dateTime}`
      }
    }
    setFileName(FileName)
  }

  React.useEffect(() => {
    handleCurrency()
  }, [])

  React.useEffect(() => {
    handleFilename()
  }, [dataProduct])

  return (
    <div>
      <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t("exportAddons")}</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("locationOutlet")}:</Form.Label>
                <Select
                  options={optionsOutlet}
                  placeholder={t('select')}
                  isMulti
                  name="outlet_id"
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(value) => handleExports(value)}
                />
              </Form.Group>
            </Col>

          </Row>
          <div className="d-flex align-items-end flex-column">
            {dataProduct.length > 0 ? (
              <>
                <ExportExcel
                  id="test-table-xls-button"
                  className="btn btn-outline-primary mx-2"
                  table="table-to-xlsx"
                  filename={fileName}
                  sheet="tablexlsx"
                  buttonText={t("export")}
                />
                <div style={{ display: "none" }}>
                  <table id="table-to-xlsx">
                    <tr>
                      <th>{t("exportResultAddonsProduct")}</th>
                    </tr>
                    <tr >
                      <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700"}}>{t("productName")}</th>
                      <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700"}}>{t("skuProduct")}</th>
                      <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700"}}>{t("groupName")}</th>
                      <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700"}}>{t("groupType")}</th>
                      <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700"}}>{t("addonName")}</th>
                      <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700"}}>{t("price")}</th>
                      <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700"}}>{t("addonStatus")}</th>
                    </tr>
                    {dataAddonsProduct.map((value, index) =>
                      <tr key={index}>
                        <td>{value.name_product ? value.name_product : "-"}</td>
                        <td>{value.sku_product ? value.sku_product : "-"}</td>
                        <td>{value.group_name ? value.group_name : "-"}</td>
                        <td>{value.group_type ? value.group_type : "-"}</td>
                        <td>{value.addon_name ? value.addon_name : "-"}</td>
                        <td>{value.price ? value.price : "-"}</td>
                        <td>{value.status_addon ? value.status_addon : "-"}</td>
                      </tr>
                    )}
                  </table>
                </div>
              </>
            ) : ""}
          </div>
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
}

export default ExportModalAddons;
