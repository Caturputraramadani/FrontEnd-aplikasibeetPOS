import React, {useEffect, useState} from 'react';
import { useLocation } from "react-router";
import { useFormik } from "formik";
import SHA1 from 'sha1';
import "../style.css"
import NumberFormat from 'react-number-format'
import hmacsha1 from 'hmacsha1'
import dayjs from 'dayjs';
import hmac from 'js-crypto-hmac'

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

const GeneratorQRString = () => {
  const location = useLocation();

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

  const getWords = async () => {
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/auth/guest/login`)
    
    const words = "3254" + "20210622110621" + "3254" + "L4qEmvb7ZFSBtTx0"
    const resGenerator = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/payment/generate-doku-qris/${words}`, {
      headers: {
        Authorization: `Bearer ${data.data}`
      }
    })

    console.log("resGenerator.data", resGenerator.data)

    document.GeneratorQRString.words.value = resGenerator.data.data;
  }

  useEffect(() => {
    const result = JSON.parse('{"' + location.search.substring(1).replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    console.log("bismillah result", result)
    document.GeneratorQRString.clientId.value = result.clientId;
    document.GeneratorQRString.dpMallId.value = result.dpMallId;
    document.GeneratorQRString.version.value = result.version;
    document.GeneratorQRString.terminalId.value = result.terminalId;
    document.GeneratorQRString.amount.value = result.amount;
    document.GeneratorQRString.postalCode.value = result.postalCode;
    document.GeneratorQRString.merchantCriteria.value = result.merchantCriteria;
    document.GeneratorQRString.feeType.value = result.feeType;
    getWords()
  }, [])

  return (
    <div>
      <div className="container">
        <div className="row my-5">
          <div className="col-md-12">
          <form action="https://staging.doku.com/dokupay/h2h/generateQris" id="GeneratorQRString" name="GeneratorQRString" method="post" >
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Client Id</Form.Label>
                  <Form.Control
                    id="clientId"
                    type="text"
                    name="clientId"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Access Token</Form.Label>
                  <Form.Control
                    id="accessToken"
                    type="text"
                    name="accessToken"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>DP Mall ID</Form.Label>
                  <Form.Control
                    id="dpMallId"
                    type="text"
                    name="dpMallId"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Words</Form.Label>
                    <Form.Control
                      id="words"
                      type="text"
                      name="words"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Version</Form.Label>
                    <Form.Control
                      id="version"
                      type="text"
                      name="version"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Terminal ID</Form.Label>
                    <Form.Control
                      id="terminalId"
                      type="text"
                      name="terminalId"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      id="amount"
                      type="text"
                      name="amount"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control
                      id="postalCode"
                      type="text"
                      name="postalCode"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Merchant Criteria</Form.Label>
                    <Form.Control
                      id="merchantCriteria"
                      type="text"
                      name="merchantCriteria"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Fee Type</Form.Label>
                    <Form.Control
                      id="feeType"
                      type="text"
                      name="feeType"
                    />
                  </Form.Group>
                </Col>
              </Row>
            <tr>
              <td class="field_input" colspan="2">&nbsp;</td>
            </tr>
            <div className="wrapper-button">
              <input name="submit" type="submit" class="btn btn-primary" id="submit" value="SUBMIT" />
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneratorQRString;
