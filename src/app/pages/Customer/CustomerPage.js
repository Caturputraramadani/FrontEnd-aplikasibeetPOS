import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import imageCompression from 'browser-image-compression';
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";
import CustomerModal from "./AddCustomerModal";
import ConfirmModal from "../../components/ConfirmModal";
import useDebounce from "../../hooks/useDebounce";

export const CustomerPage = () => {
  const [refresh, setRefresh] = React.useState(0);
  const [alert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const [filter, setFilter] = React.useState({
    time: "newest"
  });
  const { t } = useTranslation();
  const [customers, setCustomers] = React.useState([]);
  const [currCustomer, setCurrCustomer] = React.useState({
    id: "",
    name: ""
  });

  const initialValueCustomer = {
    name: "",
    email: "",
    phone_number: "",
    address: "",
    // no_rekening:"",
    bank:"",
    notes: ""
  
  };

  const CustomerSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputACustomerName")}`),
    email: Yup.string()
      .email()
      .required(`${t("pleaseInputAnEmail")}`),
    phone_number: Yup.number()
      .typeError("Please input a number only")
      .required(`${t("pleaseInputAPhoneNumber")}`),
    address: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAnAddress")}`),
    // Update norek bank - 240522
    // no_rekening:Yup.number()
    //   .min(3, `${t("minimum3Character")}`)
    //   .typeError("Please input a number only")
    //   .required(`${t("pleaseInputABankaccountnumber")}`),
    // bank:Yup.string()
    //   .required(`${t("pleaseInputABankName")}`),
    notes: Yup.string()
  });

  const formikCustomer = useFormik({
    enableReinitialize: true,
    initialValues: initialValueCustomer,
    validationSchema: CustomerSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (photo) {
        formData.append("profilePicture", photo);
      }
      formData.append("phone_number", values.phone_number);
      formData.append("address", values.address);
      // formData.append("no_rekening", values.no_rekening);
      formData.append("bank", values.bank);
      formData.append("notes", values.notes);

      try {
        enableLoading();
        // await axios.post(`${API_URL}/api/v1/customer/create-development`, formData);
        await axios.post(`${API_URL}/api/v1/customer`, formData);
        handleRefresh();
        disableLoading();
        setAlert("");
        closeAddModal();
      } catch (err) {
        setAlert(err.response.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationCustomer = (fieldname) => {
    if (formikCustomer.touched[fieldname] && formikCustomer.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikCustomer.touched[fieldname] &&
      !formikCustomer.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const getCustomer = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const filterCustomer = `?name=${search}&sort=${filter.time}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/customer${filterCustomer}`
      );
      setCustomers(data.data);
    } catch (err) {
      setCustomers([]);
    }
  };

  React.useEffect(() => {
    getCustomer(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);

  const handleDelete = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/customer/${id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      setAlert(err.response.data.message || err.message);
      disableLoading();
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const handleRefresh = () => setRefresh((state) => state + 1);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    formikCustomer.resetForm();
    setPhoto("");
    setPhotoPreview("");
    setStateAddModal(false);
  };

  const showDeleteModal = (data) => {
    setCurrCustomer({
      id: data.id,
      name: data.name
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => setStateDeleteModal(false);

  const handlePreviewPhoto = (e) => {
    setAlertPhoto("");

    let preview;
    let img;

    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          // console.log("reader.result", reader.result)
          setPhotoPreview(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0])
      img = e.target.files[0];
      // console.log("img", img)
      setPhoto(img)
    } else {
      preview = "";
      setAlertPhoto("file is too large or not supported");
    }
  };

  const columns = [
    {
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "70px"
    },
    {
      name: `${t("name")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("email")}`,
      selector: "email",
      sortable: true
    },
    {
      name: `${t("phoneNumber")}`,
      selector: "phone_number",
      sortable: true
    },
    {
      name: `${t("totalPoints")}`,
      selector: "points",
      sortable: true
    },
    {
      name: `${t("actions")}`,
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Link to={`/customer/${rows.id}`}>
                <Dropdown.Item as="button">{t("customerDetail")}</Dropdown.Item>
              </Link>
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
              {t("deleteCustomer")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const dataCustomer = customers.map((item, index) => {
    return {
      id: item.id,
      no: index + 1,
      name: item.name,
      email: item.email,
      phone_number: item.phone_number,
      points: item.points
    };
  });

  return (
    <>
      <CustomerModal
        t={t}
        stateModal={stateAddModal}
        cancelModal={closeAddModal}
        title={t("addNewCustomer")}
        alert={alert}
        loading={loading}
        formikCustomer={formikCustomer}
        validationCustomer={validationCustomer}
        alertPhoto={alertPhoto}
        photoPreview={photoPreview}
        photo={photo}
        handlePreviewPhoto={handlePreviewPhoto}
      />

      <ConfirmModal
        t={t}
        title={`${t("deleteCustomer")} - ${currCustomer.name}`}
        body={t("areYouSureWantToDelete?")}
        buttonColor="danger"
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        handleClick={() => handleDelete(currCustomer.id)}
        loading={loading}
        alert={alert}
      />

      <Row>
        <Col md={12}>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("customerManagement")}</h3>
              </div>
              <div className="headerEnd">
                <Button
                  variant="primary"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={showAddModal}
                >
                  {t("addCustomer")}
                </Button>
              </div>
            </div>

            <div className="filterSection lineBottom">
              <Row>
                <Col>
                  <InputGroup className="pb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text style={{ background: "transparent" }}>
                        <Search />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      placeholder={t("search")}
                      value={search}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </Col>

                <Col>
                  <Form.Group as={Row}>
                    <Form.Label
                      style={{ alignSelf: "center", marginBottom: "0" }}
                    >
                      {t("time")}:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="time"
                        value={filter.time}
                        onChange={handleFilter}
                      >
                        <option value="newest">{t("newest")}</option>
                        <option value="oldest">{t("oldest")}</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataCustomer}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
