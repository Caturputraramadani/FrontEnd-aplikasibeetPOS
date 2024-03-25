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

const PaymentDokuQris = () => {
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
    const systrace = document.PaymentDokuQris.systrace.value
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/auth/guest/login`)
    console.log("data", data.data)
    const words = "3254" + "L4qEmvb7ZFSBtTx0" + document.PaymentDokuQris.systrace.value
    const resGenerator = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/payment/generate-doku-qris/${words}`, {
      headers: {
        Authorization: `Bearer ${data.data}`
      }
    })

    console.log("resGenerator.data", resGenerator.data)

    document.PaymentDokuQris.words.value = resGenerator.data.data;
  }

  const systrace = () => {
    const date = new Date()
    const dateFormated = dayjs(date).format('YYYYMMDDHHMMss')
    document.PaymentDokuQris.systrace.value = dateFormated;
  }

  useEffect(() => {
    const result = JSON.parse('{"' + location.search.substring(1).replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    console.log("bismillah result", result)
    document.PaymentDokuQris.clientId.value = result.clientId;
    document.PaymentDokuQris.clientSecret.value = result.clientSecret;
    document.PaymentDokuQris.version.value = result.version;
    document.PaymentDokuQris.responseType.value = result.responseType;
    systrace()
    getWords()
  }, [])

  return (
    <div>
      <div className="container">
        <div className="row my-5">
          <div className="col-md-12">
          <form action="https://staging.doku.com/dokupay/h2h/signon" id="PaymentDokuQris" name="PaymentDokuQris" method="post" >
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
                  <Form.Label>Client Secret</Form.Label>
                  <Form.Control
                    id="clientSecret"
                    type="text"
                    name="clientSecret"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Systrace</Form.Label>
                  <Form.Control
                    id="systrace"
                    type="text"
                    name="systrace"
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
                    <Form.Label>Response Type</Form.Label>
                    <Form.Control
                      id="responseType"
                      type="text"
                      name="responseType"
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

export default PaymentDokuQris;
