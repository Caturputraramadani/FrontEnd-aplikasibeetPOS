import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import { Row, Col, Button, Dropdown } from "react-bootstrap";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper
} from "@material-ui/core";
import DataTable from "react-data-table-component";
import { MoreHoriz } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import ShowConfirmModal from "../../../components/ConfirmModal";
import { weekdays } from "../const/weekdays";

import "../../style.css";

export const AutomaticPromoPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [automaticPromos, setAutomaticPromos] = React.useState([]);
  const [currPromo, setCurrPromo] = React.useState({
    id: "",
    name: ""
  });

  const getAutomaticPromos = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/automatic-promo`);
      setAutomaticPromos(data.data);
    } catch (err) {
      setAutomaticPromos([]);
    }
  };

  const getOutlet = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const getProduct = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(`${API_URL}/api/v1/product`);
      setAllProducts(data.data);
    } catch (err) {
      setAllProducts([]);
    }
  };

  React.useEffect(() => {
    getAutomaticPromos();
  }, [refresh]);

  React.useEffect(() => {
    getProduct();
    getOutlet();
  }, []);

  const handleChangeStatus = async (id) => {
    let currentStatus;

    const edited = automaticPromos.map((item) => {
      if (item.id === id) {
        if (item.status === "active") {
          item.status = "inactive";
          currentStatus = "inactive";
        } else {
          item.status = "active";
          currentStatus = "active";
        }
      }

      return item;
    });

    const API_URL = process.env.REACT_APP_API_URL;
    try {
      await axios.patch(`${API_URL}/api/v1/automatic-promo/${id}`, {
        status: currentStatus
      });
    } catch (err) {
      console.log(err);
    }

    setAutomaticPromos(edited);
  };

  const handleRefresh = () => setRefresh((state) => state + 1);

  const showDeleteModal = (data) => {
    setCurrPromo({ id: data.id, name: data.name });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => setStateDeleteModal(false);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleDeletePromo = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/automatic-promo/${currPromo.id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      disableLoading();
    }
  };

  const formatDate = (date) => dayjs(date).format("DD/MM/YYYY");

  const dataPromo = () => {
    const API_URL = process.env.REACT_APP_API_URL;

    return automaticPromos.map((item, index) => {
      const days = item.promo_days
        .split(",")
        .map((item) => weekdays[parseInt(item)]);

      return {
        id: item.id,
        no: index + 1,
        type: item.type,
        name: item.name,
        outlet_id: item.outlet_id,
        outlet_name: item.Outlet?.name,
        promo_date_start: item.promo_date_start,
        promo_date_end: item.promo_date_end,
        promo_days: item.promo_days,
        promo_hour_start: item.promo_hour_start,
        promo_hour_end: item.promo_hour_end,
        description_type: item.description_type,
        description: item.description,
        Automatic_Promo_Quantity: item.Automatic_Promo_Quantity,
        Automatic_Promo_Transaction: item.Automatic_Promo_Transaction,
        Automatic_Promo_XY: item.Automatic_Promo_XY,
        status: item.status,
        days: days.join(", "),
        image: item.image ? `${API_URL}${item.image}` : ""
      };
    });
  };
  const columns = [
    {
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "70px"
    },
    {
      name: `${t("outletName")}`,
      selector: "outlet_name",
      sortable: true
    },
    {
      name: `${t("name")}`,
      sortable: true,
      cell: (rows) => {
        return <div>{rows.name}</div>;
      }
    },
    {
      name: `${t("activeDate")}`,
      cell: (rows) => {
        return (
          <div style={{ padding: "5px 0" }}>
            {formatDate(rows.promo_date_start)} <br />
            until <br />
            {formatDate(rows.promo_date_end)}
          </div>
        );
      }
    },
    {
      name: `${t("activeDays")}`,
      cell: (rows) => {
        return <div>{rows.days}</div>;
      }
    },
    {
      name: `${t("activeHour")}`,
      sortable: true,
      cell: (rows) => {
        return (
          <div>
            {rows.promo_hour_start} <br />
            until <br />
            {rows.promo_hour_end}
          </div>
        );
      }
    },
    {
      name: `${t("promoStatus")}`,
      cell: (rows) => {
        return (
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value={rows.status}
                control={
                  <Switch
                    color="primary"
                    checked={rows.status === "active" ? true : false}
                    onChange={() => handleChangeStatus(rows.id)}
                    name=""
                  />
                }
              />
            </FormGroup>
          </FormControl>
        );
      }
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
              <Link
                to={{
                  pathname: `/promo/automatic-promo/${rows.id}`,
                  state: {
                    promoData: {
                      type: rows.type,
                      name: rows.name,
                      outlet_id: rows.outlet_id,
                      promo_date_start: rows.promo_date_start,
                      promo_date_end: rows.promo_date_end,
                      promo_days: rows.promo_days,
                      promo_hour_start: rows.promo_hour_start,
                      promo_hour_end: rows.promo_hour_end,
                      description_type: rows.description_type,
                      description: rows.description,
                      Automatic_Promo_Quantity: rows.Automatic_Promo_Quantity,
                      Automatic_Promo_Transaction:
                        rows.Automatic_Promo_Transaction,
                      Automatic_Promo_XY: rows.Automatic_Promo_XY,
                      image: rows.image
                    },
                    allOutlets,
                    allProducts
                  }
                }}
              >
                <Dropdown.Item as="button">{t("edit")}</Dropdown.Item>
              </Link>
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
                {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  return (
    <>
      <ShowConfirmModal
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`${t("deleteAutomaticPromo")} - ${currPromo.name}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={handleDeletePromo}
      />

      {/* <Row style={{ height: "100%" }}> */}
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("automaticPromo")}</h3>
              </div>
              <div className="headerEnd">
              <Link to={{ pathname: "/promo"}}>
                  <Button variant="outline-secondary">{t("backToMainView")}</Button>
                </Link>
                <Link
                  to={{
                    pathname: "/promo/automatic-promo/add-automatic-promo",
                    state: { allOutlets, allProducts }
                  }}
                >
                  <Button variant="primary" style={{ marginLeft: "0.5rem" }}>
                  {t("addNewAutomaticPromo")}
                  </Button>
                </Link>
              </div>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataPromo()}
              // style={{ minHeight: "80%" }}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
