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
import { constant } from 'lodash-es';

const PaymentDoku = () => {
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

  const [defaultValue, setDefaultValue] = useState({
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
  })

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
      console.log("Data sebelum dikirim sebelum kirim", dataSend)
      try {
      
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }

        const result = await axios.post("https://staging.doku.com/Suite/Receive", dataSend, config)
        console.log("response", result.data)

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

  const getWords = (sharedkey) => {
    const msg = document.MerchatPaymentPage.AMOUNT.value + document.MerchatPaymentPage.MALLID.value + sharedkey + document.MerchatPaymentPage.TRANSIDMERCHANT.value;
  
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
    if(result.TAXSERVICE || result.SUBTOTAL) {
      console.log("result.TAXSERVICE", result.TAXSERVICE)
      setDetailPayment({
        subTotal: result.SUBTOTAL,
        tax: result.TAXSERVICE,
        grandTotal: parseInt(result.SUBTOTAL) + parseInt(result.TAXSERVICE),
        paymentMethod: result.PAYMENTMETHOD
      })
    }
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
    // document.MerchatPaymentPage.PAYMENTTYPE.value = result.PAYMENTTYPE;
    document.MerchatPaymentPage.CHAINMERCHANT.value = result.CHAINMERCHANT;
    document.MerchatPaymentPage.AMOUNT.value = result.AMOUNT;
    document.MerchatPaymentPage.PURCHASEAMOUNT.value = result.PURCHASEAMOUNT;
    document.MerchatPaymentPage.REQUESTDATETIME.value = result.REQUESTDATETIME;
    document.MerchatPaymentPage.CURRENCY.value = result.CURRENCY;
    document.MerchatPaymentPage.PURCHASECURRENCY.value = result.PURCHASECURRENCY;
    document.MerchatPaymentPage.BASKET.value = result.BASKET;
    document.MerchatPaymentPage.COUNTRY.value = result.COUNTRY;
    document.MerchatPaymentPage.ADDRESS.value = result.ADDRESS;
    document.MerchatPaymentPage.STATE.value = result.STATE;
    document.MerchatPaymentPage.CITY.value = result.CITY;
    document.MerchatPaymentPage.PROVINCE.value = result.PROVINCE;
    document.MerchatPaymentPage.MOBILEPHONE.value = result.MOBILEPHONE;
    document.MerchatPaymentPage.ZIPCODE.value = result.ZIPCODE;
    document.MerchatPaymentPage.EMAIL.value = result.EMAIL;
    if(result.PHONENUMBER !== "null") {
      document.MerchatPaymentPage.MOBILEPHONE.value = result.PHONENUMBER;
    }
    if(result.NAME !== "null") {
      document.MerchatPaymentPage.NAME.value = result.NAME;
    }

    document.MerchatPaymentPage.PAYMENTCHANNEL.value = result.PAYMENTCHANNEL
    if(!result.WORDS) {
      if(document.MerchatPaymentPage.AMOUNT.value && document.MerchatPaymentPage.MALLID.value && document.MerchatPaymentPage.TRANSIDMERCHANT.value) {
        getWords(result.SHAREDKEY)
      }
    } else {
      document.MerchatPaymentPage.WORDS.value = result.WORDS;
    }
  }, [])

  return (
    <div>
      <div class="top-color" />
      <div className="wrapper-content-payment">
        <div className="container">
          <div className="row my-5">
            <div className="col-md-12">
            <form action={process.env.REACT_APP_PAYMENT_DOKU} id="MerchatPaymentPage" name="MerchatPaymentPage" method="post" >
              <div style={{display: 'none'}}>
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
                        defaultValue="SALE"
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
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>ADDRESS</Form.Label>
                      <Form.Control
                        id="ADDRESS"
                        type="text"
                        name="ADDRESS"
                        
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>COUNTRY</Form.Label>
                      <Form.Control
                        id="COUNTRY"
                        type="text"
                        name="COUNTRY"
                        
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>STATE</Form.Label>
                      <Form.Control
                        id="STATE"
                        type="text"
                        name="STATE"
                        
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>CITY</Form.Label>
                      <Form.Control
                        id="CITY"
                        type="text"
                        name="CITY"
                        
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>PROVINCE</Form.Label>
                      <Form.Control
                        id="PROVINCE"
                        type="text"
                        name="PROVINCE"
                        
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>ZIPCODE</Form.Label>
                      <Form.Control
                        id="ZIPCODE"
                        type="text"
                        name="ZIPCODE"
                        
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>HOMEPHONE</Form.Label>
                      <Form.Control
                        id="HOMEPHONE"
                        type="text"
                        name="HOMEPHONE"
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
                    <Form.Label>PAYMENT CHANNEL</Form.Label>
                    <Form.Control
                      id="PAYMENTCHANNEL"
                      type="text"
                      name="PAYMENTCHANNEL"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
              <div className="d-flex justify-content-between align-items-end">
                <div className="title-payment">Payment</div>
                <div className="payment-method d-flex justify-content-end">{detailPayment.paymentMethod}</div>
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
              <p style={{fontSize: '10px'}}>Please fill in the form *</p>
              <Row>
                <Col>
                  <div className="wrapper-input">
                    <label for="EMAIL">EMAIL</label>
                    <input className="doku" id="EMAIL" type="text" name="EMAIL" required/>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                <div className="wrapper-input">
                  <label for="NAME">NAME</label>
                  <input className="doku" id="NAME" type="text" name="NAME" required/>
                </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="wrapper-input">
                    <label for="MOBILEPHONE">MOBILEPHONE</label>
                    <input className="doku" id="MOBILEPHONE" type="text" name="MOBILEPHONE" required/>
                  </div>
                </Col>
              </Row>
              {/* <tr>
                <td class="field_label">ADDITIONAL DATA</td>
                <td class="field_input"><input name="ADDITIONALDATA" type="text" id="ADDITIONALDATA" value="yogi bagas;2;Cuca Jimbaran - Bali;" size="12" maxlength="20" /></td>
              </tr>
              <tr>
                <td class="field_label">WORKPHONE</td>
                <td class="field_input"><input name="WORKPHONE" type="text" id="WORKPHONE" value="0217998391" size="12" maxlength="20" /></td>
              </tr>
              <tr>
                <td class="field_label">BIRTHDATE</td>
                <td class="field_input"><input name="BIRTHDATE" type="text" id="BIRTHDATE" value="19880101" size="12" maxlength="8" /></td>
              </tr>
              <tr>
                <td class="field_label">CUSTOMER ID</td>
                <td class="field_input"><input name="CUSTOMERID" type="text" id="CUSTOMERID" value="" size="12" maxlength="8" /></td>
              </tr>
              <tr>
                <td class="field_label">TOKEN ID</td>
                <td class="field_input"><input name="TOKENID" type="text" id="TOKENID" value="" size="12" maxlength="8" /></td>
              </tr> */}
              {/* <tr>
                <td class="field_label">CARDNUMBER</td>
                <td class="field_input"><input name="CARDNUMBER" type="text" id="CARDNUMBER" size="12" maxlength="20" /></td>
              </tr>
              <tr>
                <td class="field_label">EXPIRYDATE</td>
                <td class="field_input"><input name="EXPIRYDATE" type="text" id="EXPIRYDATE" size="12" maxlength="20" /></td>
              </tr>
              <tr>
                <td class="field_label">CVV2</td>
                <td class="field_input"><input name="CVV2" type="text" id="CVV2" size="12" maxlength="20" /></td>
              </tr>
              <tr>
                <td class="field_label">CC_NAME</td>
                <td class="field_input"><input name="CC_NAME" type="text" id="CC_NAME" size="12" maxlength="20" /></td>
              </tr> */}
              <tr>
                <td class="field_input" colspan="2">&nbsp;</td>
              </tr>
              <div className="wrapper-button">
                <input className="doku" name="submit" type="submit" class="button-submit-payment" id="submit" value="SUBMIT" onClick={() => showModalPayment}/>
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
        {/* <div className="container">
          <div className="row my-5">
            <div className="col-md-12">
              <Form onSubmit={formikPayment.handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>MALLID</Form.Label>
                      <Form.Control
                        type="text"
                        name="MALLID"
                        {...formikPayment.getFieldProps("MALLID")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>CHAINMERCHANT</Form.Label>
                      <Form.Control
                        type="text"
                        name="CHAINMERCHANT"
                        {...formikPayment.getFieldProps("CHAINMERCHANT")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>AMOUNT</Form.Label>
                      <Form.Control
                        type="text"
                        name="AMOUNT"
                        {...formikPayment.getFieldProps("AMOUNT")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>PURCHASEAMOUNT</Form.Label>
                      <Form.Control
                        type="text"
                        name="PURCHASEAMOUNT"
                        {...formikPayment.getFieldProps("PURCHASEAMOUNT")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>TRANSIDMERCHANT</Form.Label>
                      <Form.Control
                        type="text"
                        name="TRANSIDMERCHANT"
                        {...formikPayment.getFieldProps("TRANSIDMERCHANT")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>WORDS</Form.Label>
                      <Form.Control
                        type="text"
                        name="WORDS"
                        {...formikPayment.getFieldProps("WORDS")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>REQUESTDATETIME</Form.Label>
                      <Form.Control
                        type="text"
                        name="REQUESTDATETIME"
                        {...formikPayment.getFieldProps("REQUESTDATETIME")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>CURRENCY</Form.Label>
                      <Form.Control
                        type="text"
                        name="CURRENCY"
                        {...formikPayment.getFieldProps("CURRENCY")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>PURCHASECURRENCY</Form.Label>
                      <Form.Control
                        type="text"
                        name="PURCHASECURRENCY"
                        {...formikPayment.getFieldProps("PURCHASECURRENCY")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>SESSIONID</Form.Label>
                      <Form.Control
                        type="text"
                        name="SESSIONID"
                        {...formikPayment.getFieldProps("SESSIONID")}
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
                        type="text"
                        name="NAME"
                        {...formikPayment.getFieldProps("NAME")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>EMAIL</Form.Label>
                      <Form.Control
                        type="text"
                        name="EMAIL"
                        {...formikPayment.getFieldProps("EMAIL")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>BASKET</Form.Label>
                      <Form.Control
                        type="text"
                        name="BASKET"
                        {...formikPayment.getFieldProps("BASKET")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>CARDNUMBER</Form.Label>
                      <Form.Control
                        type="text"
                        name="CARDNUMBER"
                        {...formikPayment.getFieldProps("CARDNUMBER")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>EXPIRYDATE</Form.Label>
                      <Form.Control
                        type="text"
                        name="EXPIRYDATE"
                        {...formikPayment.getFieldProps("EXPIRYDATE")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>CVV2</Form.Label>
                      <Form.Control
                        type="text"
                        name="CVV2"
                        {...formikPayment.getFieldProps("CVV2")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>CC_NAME</Form.Label>
                      <Form.Control
                        type="text"
                        name="CC_NAME"
                        {...formikPayment.getFieldProps("CC_NAME")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>PAYMENTCHANNEL</Form.Label>
                      <Form.Control
                        type="text"
                        name="PAYMENTCHANNEL"
                        {...formikPayment.getFieldProps("PAYMENTCHANNEL")}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button variant="outline-secondary">Cancel</Button>
                    <Button variant="primary"
                      style={{ marginLeft: "0.5rem" }}
                      type="submit"
                    >
                    Save
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default PaymentDoku;
