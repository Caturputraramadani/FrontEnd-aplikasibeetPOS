import React from "react";
import { Button, Modal, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import ExportExcel from "react-html-table-to-excel";
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';
const ImportModalAddonsEdit = ({
  title,
  state,
  loading,
  alert,
  closeModal,
  formikImportProduct,
  allOutlets,
  handleFile,
  filename,
  subscriptionType,
  showFeature,
  handleExports,
  dataProduct,
  dataBusiness,
  dataAddonsProduct
}) => {
  
  const [fileName, setFileName] = React.useState("")
  const [currency, setCurrency] = React.useState("")

  const handleSelectOutlet = (value) => {
    handleExports(value)
    if (value) {
      const outlet = value.map((item) => item.value);
      formikImportProduct.setFieldValue("outlet_id", outlet);
    } else {
      formikImportProduct.setFieldValue("outlet_id", []);
    }
  };
  const { t } = useTranslation();
  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept:
      "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    maxSize: 5 * 1000 * 1000,
    onDrop(file) {
      handleFile(file);
    }
  });

  const handleDownload = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    let template;
    if(subscriptionType === 1) template = "templates/template-product-basic.xlsx"
    if(subscriptionType === 2) template = "templates/template-product-standard.xlsx"
    if(subscriptionType === 3) template = "templates/template-product-complete.xlsx"
    const newWindow = window.open(
      `${API_URL}/${template}`,
      "_blank",
      "noopener,noreferrer"
    );
    if (newWindow) newWindow.opener = null;
  };

  const handleFilename = () => {
    console.log("dataProduct", dataProduct)
    const dt = new Date();
    const dateTime = `${
      (dt.getMonth()+1).toString().padStart(2, '0')}-${
      dt.getDate().toString().padStart(2, '0')}-${
      dt.getFullYear().toString().padStart(4, '0')}_${
      dt.getHours().toString().padStart(2, '0')}-${
      dt.getMinutes().toString().padStart(2, '0')}-${
      dt.getSeconds().toString().padStart(2, '0')}`

    if(dataProduct.length) {
      const uniqueArray = [];
      dataProduct.map(value => {
        if(uniqueArray.indexOf(value.Outlet.name) === -1) {
          uniqueArray.push(value.Outlet.name);
        }
      })
  
      const FileName = () => {
        if(dataProduct.length) {
          return `Template-Addon-${dataProduct[0]?.Business.name}_${uniqueArray.join("_")}_${dateTime}`
        }
      }
      setFileName(FileName)
    } else {
      setFileName(`Template-Addon_${dataBusiness.name}_${dateTime}`)
    }
  }

  React.useEffect(() => {
    handleFilename()
  }, [dataProduct])

  return (
    <Modal show={state} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={formikImportProduct.handleSubmit}>
        <Modal.Body>
          {alert ? <Alert variant="danger">{alert}</Alert> : ""}

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
                  onChange={(value) => handleSelectOutlet(value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>{t("importExcel")}:</Form.Label>
                <div
                  {...getRootProps({
                    className: "boxDashed dropzone"
                  })}
                >
                  <input {...getInputProps()} />
                  {filename ? (
                    <p>{filename}</p>
                  ) : (
                    <>
                      <p>
                        {t("dragAndDrop")}
                      </p>
                      <p style={{ color: "gray" }}>{t("fileSizeLimit")}</p>
                    </>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col>
              {/* <Form.Group>
                <Form.Label>{t("downloadTemplateExcel")}:</Form.Label>
                <div
                  className="box"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={handleDownload}
                  >
                      {t("downloadTemplate")}
                  </Button>
                </div>
              </Form.Group> */}
              <Form.Group>
                <Form.Label>{t("downloadTemplateExcel")}:</Form.Label>
                  <div className="box" style={{ textAlign: "center", padding: "2rem" }}>
                    <ExportExcel
                      id="test-table-xls-button"
                      className="btn btn-outline-success mx-2"
                      table="table-to-xlsx"
                      filename={fileName}
                      sheet="tablexlsx"
                      buttonText={t("downloadTemplate")}
                    />
                    <div style={{ display: "none" }}>
                    <table id="table-to-xlsx">
                      <tr>
                        <th>{t("exportResultAddonsProduct")}</th>
                      </tr>
                      <tr >
                        <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700", border: "1px solid"}}>{t("productName")}</th>
                        <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700", border: "1px solid"}}>{t("skuProduct")}</th>
                        <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700", border: "1px solid"}}>{t("groupName")}</th>
                        <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700", border: "1px solid"}}>{t("groupType")}</th>
                        <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700", border: "1px solid"}}>{t("addonName")}</th>
                        <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700", border: "1px solid"}}>{t("price")}</th>
                        <th style={{ backgroundColor: "yellow",  fontSize:"16px", fontWeight: "700", border: "1px solid"}}>{t("addonStatus")}</th>
                      </tr>
                      <tr>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('productName')}</th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('nameOfTheProductSkuToBeAddedAddons')}</th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('writeSeparatorIfYouWantToAddMoreThanOneGroupName')}</th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('typeGrubThereAreTwoOptionsSingleOrMultiWriteSeparatorIfTheGroupNameIsMoreThanOne')}</th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('oneAddonsNameGroupCanBeManyAddonNamesWriteSeparatorToAddMoreThanOneAddonNameWriteSeparatorIfTheGroupNameIsMoreThanOne')}</th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('priceInEachAddonNameTheWritingPositionMustExactlyMatchTheAddonName')}</th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('addonStatusThereAre2OptionsActiveOrInactiveStatusInEachAddonNameTheStatusOfEachAddonNameTheWritingPositionMustExactlyMatchTheAddonName')}</th>
                      </tr>
                      <tr>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}></th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('SkuNameMustBeFilledUppercaseOrLowercaseLettersMatter')}</th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('noSpacesForExampleSizeTopping')}</th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('thereCannotBeAnySpacesInEachSeparatorForExampleSingleMulti')}</th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('thereShouldBeNoSpacesForEachSeparatorForExampleSmallMediumBananaCheeseChocolate')}</th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('beginsAndEndsWithQuotes1OrQuotes2ThereShouldBeNoSpacesForEachSeparatorForExample2000300050004000')}</th>
                        <th style={{ backgroundColor: "#FDFD8D", fontSize:"15px", border: "1px solid"}}>{t('therecanBeNoSpacesInEachSeparatorForExampleActiveInactiveActiveActive')}</th>
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
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            {t("close")}
          </Button>
          <Button variant="primary" type="submit">
            {loading ? (
              <Spinner animation="border" variant="light" size="sm" />
            ) : (
              `${t("confirm")}`
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ImportModalAddonsEdit;
