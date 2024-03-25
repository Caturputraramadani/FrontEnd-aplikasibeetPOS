import React from 'react';
import SHA1 from 'sha1';

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
const RefundDoku = () => {
  const getWords = () => {
    const msg = document.MerchatPaymentPage.AMOUNT.value + document.MerchatPaymentPage.MALLID.value + "I8w6Qvm0ZTo6" + document.MerchatPaymentPage.REFIDMERCHANT.value + document.MerchatPaymentPage.SESSIONID.value;  
    document.MerchatPaymentPage.WORDS.value = SHA1(msg);
  }
  return (
    <div>
      <div className="container">
        <div className="row my-5">
          <div className="col-md-12">
            <form action="https://pay.doku.com/Suite/DoRefundRequest" id="MerchatPaymentPage" name="MerchatPaymentPage" method="post" >
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
                    <Form.Label>REFIDMERCHANT</Form.Label>
                    <Form.Control
                      id="REFIDMERCHANT"
                      type="text"
                      name="REFIDMERCHANT"
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
                    <Form.Label>APPROVALCODE</Form.Label>
                    <Form.Control
                      id="APPROVALCODE"
                      type="text"
                      name="APPROVALCODE"
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
                      id="AMOUNT"
                      type="text"
                      name="AMOUNT"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>REFUNDTYPE</Form.Label>
                    <Form.Control
                      id="REFUNDTYPE"
                      type="text"
                      name="REFUNDTYPE"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>REASON</Form.Label>
                    <Form.Control
                      id="REASON"
                      type="text"
                      name="REASON"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>BANKDATA</Form.Label>
                    <Form.Control
                      id="BANKDATA"
                      type="text"
                      name="BANKDATA"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <tr>
                <td class="field_input" colspan="2">&nbsp;</td>
              </tr>

              <input name="submit" type="submit" class="bt_submit" id="submit" value="SUBMIT"/>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefundDoku;
