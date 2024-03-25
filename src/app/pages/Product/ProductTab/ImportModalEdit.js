import React from "react";
import { Button, Modal, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import ExportExcel from "react-html-table-to-excel";
import NumberFormat from 'react-number-format';
import Moment from 'react-moment';
const ImportModalEdit = ({
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
  dataBusiness
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
          return `List-Product_${dataProduct[0]?.Business.name}_${uniqueArray.join("_")}_${dateTime}`
        }
      }
      setFileName(FileName)
    } else {
      setFileName(`List-Product_${dataBusiness.name}_${dateTime}`)
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
                          <th>{t("exportProductResult")}</th>
                        </tr>
                        <tr >
                          <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("productName")}</th>
                          <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("description")}</th>
                          <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("barcode")}</th>
                          <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("sku")}</th>
                          <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("price")}</th>
                          <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("cogs")}</th>
                          <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("favorite")}</th>
                          <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("category")}</th>
                          {showFeature.recipe ? (
                            <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("withRecipe")}</th>
                          ) : null}
                          <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("stock")}</th>
                          <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("unit")}</th>
                          {showFeature.expired ? (
                            <th style={{ backgroundColor: "yellow", fontWeight: "700", border: "1px solid"}}>{t("expiredDate")}</th>
                          ) : null}
                        </tr>
                        <tr>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('nameOfProductBeingSold')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('explanationOfTheProductBeingSold')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('canBeNumbersLetters&Symbols')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('canBeNumbersLetters&SymbolsIfYouWantToAutoGenerateYouCanLeaveItBlankOrEnter')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('nameOfProductBeingSold')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('mustBeAnumber(WithoutSymbolsLike)')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('1IfYouWantToAddToFavoriteMenu')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('groupNameOfAProduct')}</th>
                          {showFeature.recipe ? (
                            <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('1IfProductHasRecipe(ForRawMaterial)')}</th>
                          ) : null}
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('mustBeAnumber(WithoutSymbolsLike)')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('enterTheUnitNameAccordingToTheUnitNameInTheSystem')}</th>
                          {showFeature.expired ? (
                            <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('enterTheDateInDD/MM/YYYYFormatTextFormat')}</th>
                          ) : null}
                        </tr>
                        <tr>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('willAppearInTheBeetPOSListMenu')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}> </th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('noProductsCanHaveTheSameBarcode')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('noProductsCanHaveTheSameSku')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('productSalesPrice')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('productPurchasePrice(HPP)')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('0IfYouDontWantToAddToFavoriteMenu')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('ifYouAlreadyHaveACategoryWriteItAccordingToTheNameOfTheCategory (IfItDoesntMatchANewCategoryWillBeCreated)')}</th>
                          {showFeature.recipe ? (
                            <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('0IfTheProductDoesNotHaveARecipe(SoldSingly)')}</th>
                          ) : null}
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('enterIfEmpty')}</th>
                          <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('ifItDoesntMatchANewUnitWillBeCreatedCapitalLettersMatter')}</th>
                          {showFeature.expired ? (
                            <th style={{ backgroundColor: "#FEDE00", fontWeight: "700", border: "1px solid"}}>{t('enterIfEmpty')}</th>
                          ) : null}
                        </tr>
                        {dataProduct.map((value, index) =>
                          <tr key={index}>
                            <td>{value.name ? value.name : "-"}</td>
                            <td>{value.description ? value.description : "-"}</td>
                            <td>{value.barcode ? value.barcode : "-"}</td>
                            <td>{value.sku ? value.sku : "-"}</td>
                            {/* <td>{value.price ? <NumberFormat value={value.price} displayType={'text'} thousandSeparator={true} prefix={currency} /> : 0}</td>
                            <td>{value.price_purchase ? <NumberFormat value={value.price_purchase} displayType={'text'} thousandSeparator={true} prefix={currency} /> : 0}</td> */}
                            <td>{value.price ? value.price.toString() : 0}</td>
                            <td>{value.price_purchase ? value.price_purchase.toString() : 0}</td>
                            <td>{value.is_favorite ? 1 : 0}</td>
                            <td>{value.Product_Category === null ? "-" : value.Product_Category.name}</td>
                            {showFeature.recipe ? (
                              <td>{value.recipe_id ? 1 : 0}</td>
                            ) : null}
                            <td>{value.stock ? value.stock : "-"}</td>
                            <td>{value.Unit === null ? "-" : value.Unit.name}</td>
                            {showFeature.expired ? (
                              <td>{value.Stocks.length > 0 ? <Moment format="YYYY/MM/DD" date={value.Stocks[0].expired_date} /> : "-"}</td>
                            ) : null}
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

export default ImportModalEdit;
