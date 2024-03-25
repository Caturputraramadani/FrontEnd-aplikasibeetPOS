import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ExportExcel from "react-html-table-to-excel";

import dayjs from "dayjs";
import { jsPDF } from "jspdf"
import Pdf from "react-to-pdf";
import beetposLogo from '../../../../images/logo beetPOS new.png'
import NumberFormat from 'react-number-format'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { Paper } from "@material-ui/core";
import { Row, Col, Form, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ConfirmModal from "../../../components/ConfirmModal";

export const DetailSalesOrderPage = ({ match }) => {
  const { orderId } = match.params;
  const { t } = useTranslation();
  const user_info = JSON.parse(localStorage.getItem('user_info'))

  const ref = React.createRef()

  dayjs.extend(localizedFormat)
  const history = useHistory();

  const [showConfirm, setShowConfirm] = React.useState(false);
  const [SalesOrder, setSalesOrder] = React.useState("");
  const [dateTime, setDateTime] = React.useState("")
  const [dataToPdf, setDataToPdf] = React.useState({})
  const [currency, setCurrency] = React.useState("")
  const [loading, setLoading] = React.useState(false);

  const getPurchaseOrder = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const data = await axios.get(
        `${API_URL}/api/v1/sales-order/${id}`
      );
      console.log("data sales order", data.data)
      if (data.request.status === 200) {
        const resultCustomer = await axios.get(
          `${API_URL}/api/v1/customer/${data.data.data.customer_id}`
        )
        const resultBusiness = await axios.get(
          `${API_URL}/api/v1/business/${data.data.data.business_id}`
        )
        if (resultBusiness.request.status === 200) {
          const resultOwner = await axios.get(
            `${API_URL}/api/v1/owner/${resultBusiness.data.data.owner_id}`
          )
          const allData = {
            dataPembelian: data.data.data.date,
            // orderPurchase: data.data.data.Sales_Order_Products,
            // hargaUnit: data.data.data.Sales_Order_Products[0].price,
            // kuantitas: data.data.data.Sales_Order_Products[0].quantity,
            // produk: data.data.data.Sales_Order_Products[0].Product?.name,
            namaCustomer: resultCustomer.data.data.name,
            alamatCustomer: resultCustomer.data.data.address,
            nomorTeleponCustomer: resultCustomer.data.data.phone_number,
            emailCustomer: resultCustomer.data.data.email,
            namaBusiness: resultBusiness.data.data.name,
            alamatBusiness: `${resultBusiness.data.data.Location.name}, ${resultBusiness.data.data.Location.City.name} ${resultBusiness.data.data.Location.City.Province.name}`,
            emailBusiness: resultOwner.data.data.email
          }
          setDataToPdf(allData)
          setSalesOrder(data.data.data)
          const dt = new Date();
          setDateTime(`${
            (dt.getMonth()+1).toString().padStart(2, '0')}-${
            dt.getDate().toString().padStart(2, '0')}-${
            dt.getFullYear().toString().padStart(4, '0')}_${
            dt.getHours().toString().padStart(2, '0')}-${
            dt.getMinutes().toString().padStart(2, '0')}-${
            dt.getSeconds().toString().padStart(2, '0')}`)
        }
      } else {
        console.log('something went wrong')
      }
    } catch (err) {
      console.log("error sales order", err);
    }
  };
  // console.log('ini semua data', SalesOrder.Sales_Order_Products)

  React.useEffect(() => {
    getPurchaseOrder(orderId);
  }, [orderId]);
  const handleCurrency = () => {
    if (localStorage.getItem("prefix") === 'Rp') {
      setCurrency("Rp.")
    } else if (localStorage.getItem("prefix") === '$') {
      setCurrency("$")
    } else {
      setCurrency("Rp.")
    }
  }

  React.useEffect(() => {
    handleCurrency()
  }, [])
  const columns = [
    {
      name: `${t("productName")}`,
      selector: "product_name",
      sortable: true
    },
    {
      name: `${t("quantity")}`,
      selector: "quantity",
      sortable: true
    },
    {
      name: `${t("price")}`,
      selector: "price",
      sortable: true
    },
    {
      name: `${t("priceTotal")}`,
      selector: "total_price",
      sortable: true
    }
  ];

  const handleShowConfirm = () => {
    // console.log("gak manusiawi")
    setShowConfirm(true)
  }


  const handleExportPdf = () => {
    // console.log('hello pdf')
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
    });
    
    doc.text("Purchase Order", 1, 1);
    doc.text("lagi lagi", 1, 1.2);
    doc.text("lagi lagi lagi", 1, 1.4);    
    doc.save("two-by-four.pdf");
  }

  const options = {
    orientation: 'landscape'
  };
  console.log("SalesOrder", SalesOrder)
  const setFileName = () => {
    if(SalesOrder) {
      return `Sales-Order_${dataToPdf.namaBusiness}_${SalesOrder.Outlet.name}_${dateTime}`
    }
  }
  const fileName = setFileName()
  console.log("fileName", fileName)

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleSalesType =  async (API_URL) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/sales-type/guest?business_id=${user_info.business_id}`)
      let result = {}
      data.data.map(value => {
        if(!value.is_booking || !value.require_table || value.is_delivery) {
          result = value
        }
        if(!value.is_booking || !value.require_table || !value.is_delivery) {
          result = value
        }
      })
      return result
    } catch (error) {
      console.log(error)
    }
  }

  const handleCharge = async (API_URL, outlet_id) => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/tax`)
      console.log("handleCharge", data.data)
      let result = []
      data.data.map(value => {
        if(value.tax_type_id === 2) {
          result.push(value)
        }
      })
      const reduce = result.reduce((acc, curr) => {
        return acc + curr.value
      }, 0)
      return reduce
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleTax = async (API_URL, outlet_id) => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/tax`)
      let result = []
      data.data.map(value => {
        if(value.tax_type_id === 1) {
          result.push(value)
        }
      })
      const reduce = result.reduce((acc, curr) => {
        return acc + curr.value
      }, 0)
      return reduce
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleStatus = async () => {
    try {
      enableLoading();
      const API_URL = process.env.REACT_APP_API_URL;
      await axios.patch(`${API_URL}/api/v1/sales-order/${orderId}`, {
        status: 'done'
      });
      
      const salesType = await handleSalesType(API_URL)
      const charge = await handleCharge(API_URL, SalesOrder.outlet_id)
      const tax = await handleTax(API_URL, SalesOrder.outlet_id)

      console.log("salesType", salesType)
      console.log("charge", charge)

      const tempItems = []
      SalesOrder.Sales_Order_Products.map(value => {
        const price_service = charge ? Math.round(value.total_price * parseFloat(charge / 100)) : 0
        tempItems.push({
          sales_type_id: salesType.id,
          product_id: value.product_id,
          quantity: value.quantity,
          price_product: value.price,
          price_discount: 0,
          price_service,
          price_addons_total: 0,
          price_total: (value.price + 0 + price_service) * value.quantity,
          notes: ""
        })
      })
      const orderData = {
        outlet_id: SalesOrder.outlet_id,
        customer_id: SalesOrder.customer_id,
        notes: SalesOrder.notes,
        date: SalesOrder.date,
        items: SalesOrder.items
      };

      if (SalesOrder.so_number) {
        orderData.so_number = SalesOrder.so_number;
      }

      const sumTotalPrice = tempItems.reduce((acc, curr) => {
        return acc + curr.price_total
      }, 0)
      const PaymentTax = tax ? Math.round(sumTotalPrice * parseFloat(tax / 100)) : 0
      const PaymentService = charge ? Math.round(sumTotalPrice * parseFloat(charge / 100)) : 0
      const receipt_id = 'S.O' +
      SalesOrder.outlet_id +
      ':' +
      SalesOrder.customer_id || null +
      ':' +
      dayjs(new Date()).format('YYYY/MM/DD:HH:mm:ss')

      orderData.status = 'done'
      orderData.amount = sumTotalPrice
      orderData.payment_change = 0
      orderData.payment_discount = 0
      orderData.payment_tax = PaymentTax
      orderData.payment_service = PaymentService
      orderData.payment_total = sumTotalPrice + PaymentTax + PaymentService - 0
      orderData.custom_price = 0
      orderData.custom_price_tax = 0
      orderData.promo  = null
      orderData.receipt_id  = receipt_id
      orderData.items = tempItems
      orderData.payment_method_id = SalesOrder.payment_method_id
      orderData.status = 'done'

      console.log("orderData", orderData)

      await axios.post(`${API_URL}/api/v1/transaction`, orderData);
      disableLoading();
      history.push("/inventory");
    } catch (error) {
      console.log(error);
    }
  };

  const closeConfirmModal = () => setShowConfirm(false);

  const handleConfirm = () => {
    handleStatus();
    closeConfirmModal();
  };

  const dataOrder = SalesOrder
    ? SalesOrder.Sales_Order_Products.map((item, index) => {
        return {
          product_name: item.Product?.name,
          quantity: item.quantity,
          price: item.price,
          total_price: item.total_price
        };
      })
    : [];
  return (
    <>
      <ConfirmModal
        title={t("confirm")}
        body={t("areYouSureWantToAddIncomingStock")}
        buttonColor="warning"
        handleClick={handleConfirm}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />
      <div className="style-pdf" style={{width: 1100, height: "fit-content", color: "black solid"}} ref={ref}>
          <div className="container">
            <div className="row justify-content-between mb-5">
              <div className="col-md-6">
                <h1 className="mb-3">{t("SalesOrder")}</h1>
                <div className="d-flex justify-content-between">
                  <h4>{t("purchaseDate")}</h4>
                  <p className="text-mute">{dayjs(dataToPdf.dataPembelian).format("LLLL")}</p>
                </div>
                <h4>{t("priceTotal")}</h4>
                <h2><NumberFormat value={dataToPdf.tagihan} displayType={'text'} thousandSeparator={true} prefix={currency} /></h2>
              </div>
              <div className="col-md-6 d-flex flex-column align-items-end">
                <div className="logo-wrapper">
                  <img src={beetposLogo} alt="Logo BeetPOS"/>
                </div>
                <h5 className="text-mute">PT Lifetech Tanpa Batas</h5>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-4">
                <h4 className="font-weight-bold">{t("to")}</h4>
                <h6>{dataToPdf.namaCustomer}</h6>
                <h6>{dataToPdf.alamatCustomer}</h6>
                <h6>{dataToPdf.nomorTelephoneCustomer}</h6>
                <h6>{dataToPdf.emailCustomer}</h6>
              </div>
              <div className="col-md-8">
                <h4 className="font-weight-bold">{t("buyer")}</h4>
                <h6>{dataToPdf.namaBusiness}</h6>
                <h6>{dataToPdf.alamatBusiness}</h6>
                <h6>{dataToPdf.emailBusiness}</h6>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-12">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">{t("products")}</th>
                      <th scope="col">{t("quantity")}</th>
                      <th scope="col">{t("price")} {currency}</th>
                      <th scope="col">{t("priceTotal")} {currency}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SalesOrder ? 
                      SalesOrder.Sales_Order_Products.map((item) => 
                        <tr>
                          <td>{item.Product?.name}</td>
                          <td>{item.quantity}</td>
                          <td><NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                          <td><NumberFormat value={item.total_price} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                        </tr> 
                        )
                    : ""}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row align-items-end flex-column mr-3">
              <div className="d-flex">
                <p className="text-mute mr-5">{t("priceSubtotal")}</p>
                <p className="text-mute ml-5"><NumberFormat value={dataToPdf.tagihan} displayType={'text'} thousandSeparator={true} prefix={currency} /></p>
              </div>
              <div className="d-flex">
                <h4 className="mr-5">{t("totalBill")}</h4>
                <h4 className="text-mute ml-5"><NumberFormat value={dataToPdf.tagihan} displayType={'text'} thousandSeparator={true} prefix={currency} /></h4>
              </div>
            </div>
          </div>
        </div>
      <Row className="modal-detail">
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("salesOrderDetailSummary")}</h3>
              </div>
              <div className="headerEnd">
                <Button
                  className="btn"
                  className={
                    SalesOrder.status === "done"
                      ? "btn-secondary"
                      : "btn-primary"
                  }
                  disabled={SalesOrder.status === "done"}
                  onClick={handleShowConfirm}
                >
                  {t(SalesOrder.status)}
                </Button>
                <Link
                  to={{
                    pathname: "/inventory"
                  }}
                >
                  <ExportExcel
                    id="test-table-xls-button"
                    className="btn btn-outline-info mx-2"
                    table="table-to-xls"
                    filename={fileName}
                    sheet="tablexls"
                    buttonText={t("exportToExcel")}
                  />
                  <div style={{ display: "none" }}>
                    <table id="table-to-xls">
                      <tr>
                        <th>{t("exportSalesOrderResult")}</th>
                      </tr>
                      <tr>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("products")}</th>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("quantity")}</th>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("price")} {currency}</th>
                        <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("priceTotal")} {currency}</th>
                      </tr>
                      {SalesOrder ? (
                      SalesOrder.Sales_Order_Products.map(item => 
                        <tr>
                          <td>{item.Product?.name}</td>
                          <td>{item.quantity}</td>
                          <td><NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                          <td><NumberFormat value={item.total_price} displayType={'text'} thousandSeparator={true} prefix={currency} /></td>
                        </tr>
                      )
                    ) : null }
                    </table>
                  </div>
                  <Pdf targetRef={ref} filename={fileName} options={options} scale={1}>
                    {({ toPdf }) => <Button variant="btn btn-outline-primary mr-2" onClick={toPdf}>{t('exportToPdf')}</Button>}
                  </Pdf>
                  {/* <Button variant="btn btn-outline-primary mr-2" onClick={handleExportPdf}>Export</Button> */}
                  <Button variant="outline-secondary">{t('back')}</Button>
                </Link>

                {/* <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                  Download
                </Button> */}
              </div>
            </div>

            <Row
              style={{ padding: "1rem", marginBottom: "1rem" }}
              className="lineBottom"
            >
              <Col sm={3}>
                <Form.Group>
                  <Form.Label>S.O ID:</Form.Label>
                  <Form.Control
                    type="text"
                    value={SalesOrder ? SalesOrder.code : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("poNumber")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={SalesOrder ? SalesOrder.so_number : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("location")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={SalesOrder ? SalesOrder.Outlet?.name : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("date")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      SalesOrder
                        ? dayjs(SalesOrder.date).format("DD/MM/YYYY")
                        : "-"
                    }
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <Form.Label>{t("supplier")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={SalesOrder ? SalesOrder.Customer.name : "-"}
                    disabled
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>{t("notes")}:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={SalesOrder?.notes || "-"}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataOrder}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
