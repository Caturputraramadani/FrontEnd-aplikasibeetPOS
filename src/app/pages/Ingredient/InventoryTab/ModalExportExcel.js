import React, { useEffect } from 'react';
import ExportExcel from "react-html-table-to-excel";
import { Button, Modal, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import axios from 'axios'
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import Pdf from "react-to-pdf";
import beetposLogo from '../../../../images/logo beetPOS new.png'
import localizedFormat from 'dayjs/plugin/localizedFormat'

const ModalExportExcel = ({state, closeModal, optionsOutlet, handleExports, dataExport}) => {  
  dayjs.extend(localizedFormat)
  const { t } = useTranslation();
  const ref = React.createRef()
  const [fileNameExcel, setFileNameExcel] = React.useState("")
  const [fileNamePdf, setFileNamePdf] = React.useState("")

  const options = {
    orientation: 'landscape'
  };

  const handleFilename = () => {
    const uniqueArray = [];
    dataExport.map(value => {
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

    const handleFileNameExcel = () => {
      if(dataExport) {
        return `Raw-Material_${dataExport[0]?.Business.name}_${uniqueArray.join("_")}_${dateTime}`
      }
    }

    const handleFileNamePdf = () => {
      if(dataExport) {
        return `Raw-Material_${dataExport[0]?.Business.name}_${uniqueArray.join("_")}_${dateTime}.pdf`
      }
    }

    setFileNameExcel(handleFileNameExcel)
    setFileNamePdf(handleFileNamePdf)
  }

  useEffect(() => {
    handleFilename()
  }, [dataExport])

  return (
    <div>
      <div className="style-pdf" style={{width: 1100, height: "fit-content", color: "black solid"}} ref={ref}>
        <div className="container">
          <div className="row justify-content-between mb-5">
            <div className="col-md-4">
              <h1 className="mb-4 font-bold">{t("rawMaterial")}</h1>
            </div>
            <div className="col-md-8 d-flex flex-column align-items-end">
              <div className="logo-wrapper">
                <img src={beetposLogo} alt="Logo BeetPOS"/>
              </div>
              <h5 className="text-mute">PT Lifetech Tanpa Batas</h5>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12">
              <table class="table">
                <thead>
                  <tr>
                    <th>{t("locationOutlet")}</th>
                    <th>{t("name")}</th>
                    <th>{t("category")}</th>
                    <th>{t("stock")}</th>
                    <th>{t("unit")}</th>
                    <th>{t("pricePerUnit")}</th>
                    <th>{t("caloriePerUnit")}</th>
                    <th>{t("calorieUnit")}</th>
                    <th>{t("notes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dataExport.map((value, index) =>
                    <tr key={index}>
                      <td>{value.Outlet.name}</td>
                      <td>{value.name}</td>
                      <td>{value.Raw_Material_Category.name}</td>
                      <td>{value.stock}</td>
                      <td>{value.Unit.name}</td>
                      <td>{value.price_per_unit}</td>
                      <td>{value.calorie_per_unit}</td>
                      <td>{value.calorie_unit}</td>
                      <td>{value.notes ? value.notes : "-"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t("exportProduct")}</Modal.Title>
        </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>{t("locationOutlet")}:</Form.Label>
                  <Select
                    placeholder={t('select')}
                    options={optionsOutlet}
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
              {dataExport.length > 0 ? (
                <div className="d-flex" onClick={closeModal}>
                  <ExportExcel
                    id="test-table-xls-button"
                    className="btn btn-outline-info mx-2"
                    table="table-to-xls"
                    filename={fileNameExcel}
                    sheet="tablexls"
                    buttonText={t("Export To Excel")}
                  />
                  <div style={{ display: "none" }}>
                    <table id="table-to-xls">
                      <tr>
                        <th>{t("exportRawMaterialResult")}</th>
                      </tr>
                      <tr>
                        <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("locationOutlet")}</th>
                        <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("name")}</th>
                        <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("category")}</th>
                        <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("stock")}</th>
                        <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("unit")}</th>
                        <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("pricePerUnit")}</th>
                        <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("caloriePerUnit")}</th>
                        <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("calorieUnit")}</th>
                        <th style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("notes")}</th>
                      </tr>
                      {dataExport.map((value, index) =>
                        <tr key={index}>
                          <td>{value.Outlet.name}</td>
                          <td>{value.name}</td>
                          <td>{value.Raw_Material_Category.name}</td>
                          <td>{value.stock}</td>
                          <td>{value.Unit.name}</td>
                          <td>{value.price_per_unit}</td>
                          <td>{value.calorie_per_unit}</td>
                          <td>{value.calorie_unit}</td>
                          <td>{value.notes ? value.notes : "-"}</td>
                        </tr>
                      )}
                    </table>
                  </div>
                  <Pdf targetRef={ref} filename={fileNamePdf} options={options} scale={1}>
                    {({ toPdf }) => <Button variant="btn btn-outline-primary mr-2" onClick={toPdf}>{t('exportToPdf')}</Button>}
                  </Pdf>
                </div>
              ) : ""}
            </div>
          </Modal.Body>
      </Modal>
    </div>
  );
}

export default ModalExportExcel;
