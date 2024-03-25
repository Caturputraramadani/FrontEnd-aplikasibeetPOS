import React from 'react';
import SHA1 from 'sha1';
import axios from 'axios'

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

const CheckStatusDoku = () => {
  
  const getWords = () => {
    const msg = document.MerchatPaymentPage.MALLID.value + "I8w6Qvm0ZTo6" + document.MerchatPaymentPage.TRANSIDMERCHANT.value;  
    document.MerchatPaymentPage.WORDS.value = SHA1(msg);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      MALLID: document.MerchatPaymentPage.MALLID.value,
      CHAINMERCHANT: document.MerchatPaymentPage.CHAINMERCHANT.value,
      TRANSIDMERCHANT: document.MerchatPaymentPage.TRANSIDMERCHANT.value,
      SESSIONID: document.MerchatPaymentPage.SESSIONID.value,
      WORDS: document.MerchatPaymentPage.WORDS.value,
      CURRENCY: document.MerchatPaymentPage.CURRENCY.value,
      PURHCASECURRENCY: document.MerchatPaymentPage.PURHCASECURRENCY.value,
      PAYMENTTYPE: document.MerchatPaymentPage.PAYMENTTYPE.value,
    }
    // console.log("data sebelum dikirim", data)
    // console.log("Bismillah")

    try {
      const option = {
        headers: {
          "Accept": "*/*",
          "Content-Type": "text/xml;charset=UTF-8"
        }
      }
      const result = await axios.post("https://staging.doku.com/Suite/CheckStatus", data, option)
      console.log("result", result)
      // action="https://staging.doku.com/Suite/CheckStatus"
      // action="https://staging.doku.com/Suite/CheckStatus" method="POST" 
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="container">
      <div className="row my-5">
        <div className="col-md-12">
          <form id="MerchatPaymentPage" name="MerchatPaymentPage">
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>MALLID</Form.Label>
                  <Form.Control
                    id="MALLID"
                    type="text"
                    name="MALLID"
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
                  <Form.Label>TRANSIDMERCHANT</Form.Label>
                  <Form.Control
                    id="TRANSIDMERCHANT"
                    type="text"
                    name="TRANSIDMERCHANT"
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
                    id="SESSIONID"
                    type="text"
                    name="SESSIONID"
                    required
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
                      required
                    />
                    <div className="btn btn-primary" style={{width: '120px'}} onClick={getWords}>Generate Words</div>
                  </div>
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
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>PURHCASECURRENCY</Form.Label>
                  <Form.Control
                    id="PURHCASECURRENCY"
                    type="text"
                    name="PURHCASECURRENCY"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>PAYMENTTYPE</Form.Label>
                  <Form.Control
                    id="PAYMENTTYPE"
                    type="text"
                    name="PAYMENTTYPE"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <tr>
              <td class="field_input" colspan="2">&nbsp;</td>
            </tr>
            {/* <input name="submit" type="submit" class="bt_submit" id="submit" value="SUBMIT"/> */}
            <div className="btn btn-primary" onClick={handleSubmit}>Submit</div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckStatusDoku;
