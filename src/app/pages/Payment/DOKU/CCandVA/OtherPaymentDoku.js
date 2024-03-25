import React, {useEffect, useState} from 'react';
import { useLocation } from "react-router";
import { useFormik } from "formik";
import SHA1 from 'sha1';
import "../style.css"
import NumberFormat from 'react-number-format'

import {
  Row,
  Col,
  Button,
  Form,
  Alert,
  Spinner,
  InputGroup,
  Modal
} from "react-bootstrap";
import {
  FormControl,
  FormControlLabel,
  Switch,
  FormGroup
} from "@material-ui/core";
import axios from 'axios';

const OtherPaymentDoku = () => {
  const location = useLocation();
  const [stateShowModal, setStateShowModal] = React.useState(false);
  const [detailPayment, setDetailPayment] = React.useState({
    subTotal: null,
    tax: null,
    grandTotal: null
  })
  const showModalPayment = () => setStateShowModal(true);
  const cancleShowModalPayment = () => {
    setStateShowModal(false);
  };

  const initialValuePayment = {
    MALLID: "",
    CHAINMERCHANT: "",
    AMOUNT: "",
    PURCHASEAMOUNT: "",
    TRANSIDMERCHANT: "",
    WORDS: "",
    REQUESTDATETIME: "",
    CURRENCY: "",
    PURCHASECURRENCY: "",
    SESSIONID: "",
    NAME: "",
    EMAIL: "",
    BASKET: "",
    CARDNUMBER: "",
    EXPIRYDATE: "",
    CVV2: "",
    CC_NAME: "",
    PAYMENTCHANNEL: ""
  }

  console.log("initialValuePayment", initialValuePayment)

  const formikPayment = useFormik({
    initialValues: initialValuePayment,
    // validationSchema: commissionSchema,
    onSubmit: async (values) => {
      console.log(typeof values.MALLID)
      const dataSend = {
        MALLID: values.MALLID,
        CHAINMERCHANT: values.CHAINMERCHANT,
        AMOUNT: values.AMOUNT,
        PURCHASEAMOUNT: values.PURCHASEAMOUNT,
        TRANSIDMERCHANT: values.TRANSIDMERCHANT,
        WORDS: values.WORDS ,
        REQUESTDATETIME: values.REQUESTDATETIME,
        CURRENCY: values.CURRENCY,
        PURCHASECURRENCY: values.PURCHASECURRENCY,
        SESSIONID: values.SESSIONID,
        NAME: values.NAME,
        EMAIL: values.EMAIL,
        BASKET: values.BASKET,
        CARDNUMBER: values.CARDNUMBER,
        EXPIRYDATE: values.EXPIRYDATE,
        CVV2: values.CVV2,
        CC_NAME: values.CC_NAME,
        PAYMENTCHANNEL: values.PAYMENTCHANNEL
      }
      // console.log("Data sebelum dikirim sebelum kirim", dataSend)
      // https://cors-anywhere.herokuapp.com/
      try {
      
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }

        const result = await axios.post("https://staging.doku.com/Suite/Receive", dataSend, config)
        // console.log("response", result.data)

      } catch (err) {
        console.log("respon errornya", err.response)
      }
    }
  });
  
  const randomString = (STRlen) => {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = STRlen;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum,rnum+1);
    }
  
    return randomstring;
  
  }
 
  const getWords = () => {
    const msg = document.MerchatPaymentPage.AMOUNT.value + document.MerchatPaymentPage.MALLID.value + "I8w6Qvm0ZTo6" + document.MerchatPaymentPage.TRANSIDMERCHANT.value;
  
    document.MerchatPaymentPage.WORDS.value = SHA1(msg);
  }

  const genInvoice = () => {
    document.MerchatPaymentPage.TRANSIDMERCHANT.value = randomString(12);
  }
  
  const genSessionID = () => {
    document.MerchatPaymentPage.SESSIONID.value = randomString(20);
  }

  useEffect(() => {
    const result = JSON.parse('{"' + location.search.substring(1).replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    // console.log("bismillah result", result)
    if(!result.TRANSIDMERCHANT) {
      genInvoice()
    } else {
      document.MerchatPaymentPage.TRANSIDMERCHANT.value = result.TRANSIDMERCHANT;
    }
    if(!result.SESSIONID) {
      genSessionID()
    } else {
      document.MerchatPaymentPage.SESSIONID.value = result.SESSIONID;
    }
    document.MerchatPaymentPage.MALLID.value = result.MALLID;
    document.MerchatPaymentPage.CHAINMERCHANT.value = result.CHAINMERCHANT;
    document.MerchatPaymentPage.AMOUNT.value = result.AMOUNT;
    document.MerchatPaymentPage.PURCHASEAMOUNT.value = result.PURCHASEAMOUNT;
    document.MerchatPaymentPage.REQUESTDATETIME.value = result.REQUESTDATETIME;
    document.MerchatPaymentPage.CURRENCY.value = result.CURRENCY;
    document.MerchatPaymentPage.PURCHASECURRENCY.value = result.PURCHASECURRENCY;
    document.MerchatPaymentPage.NAME.value = result.NAME;
    document.MerchatPaymentPage.EMAIL.value = result.EMAIL;
    document.MerchatPaymentPage.BASKET.value = result.BASKET;
    document.MerchatPaymentPage.PAYMENTCHANNEL.value = result.PAYMENTCHANNEL
    if(!result.WORDS) {
      if(document.MerchatPaymentPage.AMOUNT.value && document.MerchatPaymentPage.MALLID.value && document.MerchatPaymentPage.TRANSIDMERCHANT.value) {
        getWords()
      }
    } else {
      document.MerchatPaymentPage.WORDS.value = result.WORDS;
    }
  }, [])

  return (
    <div>
      <div className="container">
        <div className="row my-5">
          <div className="col-md-12">
          <form action="https://staging.doku.com/Suite/Receive" id="MerchatPaymentPage" name="MerchatPaymentPage" method="post" >
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>BASKET</Form.Label>
                    <Form.Control
                      id="basket"
                      type="text"
                      name="BASKET"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>PAYMENT TYPE</Form.Label>
                    <Form.Control
                      id="PAYMENTTYPE"
                      type="text"
                      name="PAYMENTTYPE"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>MALLID</Form.Label>
                    <Form.Control
                      id="MALLID"
                      type="text"
                      name="MALLID"
                      
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>CHAINMERCHANT</Form.Label>
                    <Form.Control
                      id="CHAINMERCHANT"
                      type="text"
                      name="CHAINMERCHANT"
                      
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>CURRENCY</Form.Label>
                    <Form.Control
                      id="CURRENCY"
                      type="text"
                      name="CURRENCY"
                      
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>PURCHASE CURRENCY</Form.Label>
                    <Form.Control
                      id="PURCHASECURRENCY"
                      type="text"
                      name="PURCHASECURRENCY"
                      
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>AMOUNT</Form.Label>
                    <Form.Control
                      id="AMOUNT"
                      type="text"
                      name="AMOUNT"
                      
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>PURCHASEAMOUNT</Form.Label>
                    <Form.Control
                      id="PURCHASEAMOUNT"
                      type="text"
                      name="PURCHASEAMOUNT"
                      
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>TRANSIDMERCHANT</Form.Label>
                    <Form.Control
                      id="TRANSIDMERCHANT"
                      type="text"
                      name="TRANSIDMERCHANT"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>WORDS</Form.Label>
                    <div className="d-flex align-items-center justify-content-between">
                      <Form.Control
                        id="WORDS"
                        type="text"
                        name="WORDS"
                        
                      />
                      <div className="btn btn-primary" style={{width: '120px'}} onClick={getWords}>Generate Words</div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>REQUEST DATE & TIME</Form.Label>
                    <div className="d-flex align-items-center justify-content-between">
                      <Form.Control
                        id="REQUESTDATETIME"
                        type="text"
                        name="REQUESTDATETIME"
                        
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>SESSION ID</Form.Label>
                    <Form.Control
                      id="SESSIONID"
                      type="text"
                      name="SESSIONID"
                      
                    />
                  </Form.Group>
                </Col>
              </Row>
            {/* <div className="d-flex justify-content-between align-items-end">
              <div className="title-payment">Payment</div>
              <div className="payment-method">{detailPayment.paymentMethod}</div>
            </div>
            <hr />
            <div className="payment-detail">
              <div className="sub-total">
                <h6>Sub Total</h6>
                <h4><NumberFormat value={detailPayment.subTotal} displayType={'text'} thousandSeparator={true} prefix="Rp. " /></h4>
              </div>
              <div className="tax my-1">
                <h6>Tax</h6>
                <h4><NumberFormat value={detailPayment.tax} displayType={'text'} thousandSeparator={true} prefix="Rp. " /></h4>
              </div>
              <div className="grand-total">
                <h6>Grand Total</h6>
                <h4><NumberFormat value={detailPayment.grandTotal} displayType={'text'} thousandSeparator={true} prefix="Rp. " /></h4>
              </div>
            </div>
            <hr />
            <p style={{fontSize: '10px'}}>Please fill in the form *</p> */}
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>EMAIL</Form.Label>
                  <Form.Control
                    id="EMAIL"
                    type="text"
                    name="EMAIL"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>NAME</Form.Label>
                  <Form.Control
                    id="NAME"
                    type="text"
                    name="NAME"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>MOBILEPHONE</Form.Label>
                  <Form.Control
                    id="MOBILEPHONE"
                    type="text"
                    name="MOBILEPHONE"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>PAYMENT CHANNEL</Form.Label>
                    <Form.Control
                      id="PAYMENTCHANNEL"
                      type="text"
                      name="PAYMENTCHANNEL"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>USERIDKLIKBCA</Form.Label>
                    <Form.Control
                      id="USERIDKLIKBCA"
                      type="text"
                      name="USERIDKLIKBCA"
                    />
                  </Form.Group>
                </Col>
              </Row>
            <tr>
              <td class="field_input" colspan="2">&nbsp;</td>
            </tr>
            <div className="wrapper-button">
              <input name="submit" type="submit" class="btn btn-primary" id="submit" value="SUBMIT" onClick={() => showModalPayment}/>
            </div>
          </form>
          </div>
        </div>
      </div>
        <Modal show={stateShowModal} onHide={cancleShowModalPayment} size="sm">
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Modal body text goes here.</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary">Close</Button>
            <Button variant="primary">Save changes</Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
}

export default OtherPaymentDoku;
