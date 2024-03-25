import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import dayjs from 'dayjs'
import { useFormik, FormikProvider, FieldArray } from "formik";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";

import {
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
  Dropdown,
  ButtonGroup,
  ListGroup
} from "react-bootstrap";
import { Paper } from "@material-ui/core";
import DatePicker from "react-datepicker";
import { CalendarToday, Delete } from "@material-ui/icons";
import ConfirmModal from "../../../components/ConfirmModal";

export const DetailProductAssembly = ({ location, match }) => {
  const { materialId } = match.params;
  console.group("materialId", materialId)
  const history = useHistory();
  const { allOutlets, allMaterials, allUnits } = location.state;
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [saveAsDraft, setSaveAsDraft] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [hasUnit, setHasUnit] = React.useState(false);

  const [productAssembly, setProductAssembly] = React.useState("")
  const [optionsRecipe, setOptionRecipe] = React.useState([])
  const [startDate, setStartDate] = React.useState(new Date());

  const initialValueAssembly = {
    outlet_id: "",
    notes: "",
    date: startDate,
    status: "",
    items: [
      {
        recipe_id: "",
        quantity: 0,
        expired_date: "",
        unit_id: ""
      }
    ]
  };

  const ProdductAssembly = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("minimum1Character")}`),
    notes: Yup.string(),
    date: Yup.string().required(`${t("pleaseInputDate")}`),
    items: Yup.array().of(
      Yup.object().shape({
        recipe_id: Yup.number()
          .min(1)
          .required(`${t("pleaseInputARawMaterial")}`),
        quantity: Yup.number()
          .min(1, `${t("minimum1Character")}`)
          .required(`${t("pleaseInputAQuantity ")}`)
      })
    )
  });

  const formikProductAssembly = useFormik({
    initialValues: initialValueAssembly,
    validationSchema: ProdductAssembly,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      console.log("data yang akan dikirim", values)

      const dataAssembly = {
        outlet_id: values.outlet_id,
        notes: values.notes,
        date: values.date,
        items: values.items,
        status: "done"
      };
      try {
        enableLoading();
        if(saveAsDraft) {
          await axios.post(`${API_URL}/api/v1/product-assembly/draft`, dataAssembly);
        } else {
          await axios.post(`${API_URL}/api/v1/product-assembly`, dataAssembly);
        }
        disableLoading();
        history.push("/ingredient-inventory");
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });
  
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleStatus = async () => {
    try {
      enableLoading()
      const API_URL = process.env.REACT_APP_API_URL;

      const sendAssembly = {
        outlet_id: productAssembly.outlet_id,
        items: productAssembly.Product_Assembly_Items,
        status: 'done'
      }
      console.log("sendAssembly", sendAssembly)

      await axios.patch(`${API_URL}/api/v1/product-assembly/status/${productAssembly.id}`, sendAssembly)
      disableLoading()
      history.push("/ingredient-inventory");
    } catch (error) {
      console.log(error)
    }
  }

  const handleShowConfirm = (e) => {
    setShowConfirm(true)
  }
  
  const handleConfirm = () => {
    console.log("trigger handleConfirm")
    handleStatus()
    closeConfirmModal()
  };

  const closeConfirmModal = () => setShowConfirm(false);
  
  const handleProductAssembly = async (materialId) => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product-assembly/${materialId}`)
      console.log("handleProductAssembly", data.data)
      setProductAssembly(data.data)
    } catch (error) {
      console.log("ERROR handleProductAssembly", error)
    }
  }

  React.useEffect(() => {
    handleProductAssembly(materialId)
  }, [materialId])

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
      name: `${t("expiredDate")}`,
      selector: "expired_date",
      sortable: true
    },
    {
      name: `${t("unit")}`,
      selector: "unit",
      sortable: true
    }
  ];

  console.log("productAssembly", productAssembly)

  const dataAssembly = productAssembly
    ? productAssembly.Product_Assembly_Items.map((item) => {
        return {
          product_name: item.Product?.name,
          quantity: item.quantity,
          expired_date: item.expired_date ? dayjs(item.expired_date).format("DD/MM/YYYY") : "-",
          unit: item.Unit?.name || "-"
        };
      })
    : [];

  return (
    <> 
      <ConfirmModal
        title={t("confirm")}
        body={t("areYouSureWantToAddProductAssembly")}
        buttonColor="warning"
        handleClick={handleConfirm}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />
      <Row style={{position: "relative"}}>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <Form noValidate>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>{t('detailProductAssembly')}</h3>
                </div>
                <div className="headerEnd d-flex">
                  <Dropdown className="ml-2">
                    <Button className="btn" className={productAssembly.status === "done" ? 'btn-secondary' : 'btn-primary'} disabled={productAssembly.status === "done"} onClick={handleShowConfirm}>{t(productAssembly.status)}</Button>
                    <Link
                      className="ml-2"
                      to={{
                        pathname: "/ingredient-inventory"
                      }}
                    >
                      <Button variant="outline-secondary">{t("back")}</Button>
                    </Link>
                  </Dropdown>
                  {/* <Button
                    variant="primary"
                    style={{ marginLeft: "0.5rem" }}
                    type="submit"
                  >
                    {loading ? (
                      <Spinner animation="border" variant="light" size="sm" />
                    ) : (
                      `${t("save")}`
                    )}
                  </Button> */}
                </div>
              </div>
  
              {alert ? <Alert variant="danger">{alert}</Alert> : ""}
  
              <Row style={{ padding: "1rem" }} className="lineBottom">
                <Col sm={3}>
                  <Form.Group>
                    <Form.Label>{t("location")}:</Form.Label>
                    <Form.Control
                      type="text"
                      value={productAssembly ? productAssembly.Outlet?.name : "-"}
                      disabled
                    />
                  </Form.Group>
  
                  <Form.Group>
                  <Form.Label>{t("date")}:</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      productAssembly
                        ? dayjs(productAssembly.date).format("DD/MM/YYYY")
                        : "-"
                    }
                    disabled
                  />
                </Form.Group>
                </Col>
  
                <Col>
                  <Form.Group>
                    <Form.Label>{t("notes")}:</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="notes"
                      value={productAssembly?.notes || "-"}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataAssembly}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
