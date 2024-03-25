import React, { useEffect, useState } from 'react'
import { Paper, FormControlLabel, Switch } from "@material-ui/core";
import { MoreHoriz } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dropdown,
  Row,
  Col,
  FormControl,
  FormGroup
} from 'react-bootstrap'
import DataTable from "react-data-table-component";
import axios from 'axios';
import dayjs from 'dayjs'
import {
  Link
} from 'react-router-dom'
import ConfirmModal from "../../components/ConfirmModal";

export default function ArticlesPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [allOutlets, setAllOutlets] = useState([])
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectArticle, setSelectArticle] = useState({}) 
  const [refresh, setRefresh] = useState(0)

  const handleRefresh = () => setRefresh(state => state + 1)

  const { t } = useTranslation()
  const [article, setArticle] = useState([])

  const getOutlet = async () => {
    try {
      const outlets = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(outlets.data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  useEffect(() => {
    getOutlet()
  }, [])

  const handleChangeStatus = async (row) => {
    try {
      const currActive = row.active === 'active' ? 0 : 1
      console.log('currActive', currActive)
      await axios.patch(`${API_URL}/api/v1/news-article/patch-active/${row.id}`, {active: currActive})
      handleRefresh()
    } catch (error) {
      console.log(error)
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
      name: `${t("outletName")}`,
      selector: "outlet_name",
      sortable: true
    },
    {
      name: `${t("title")}`,
      selector: "title",
      sortable: true
    },
    { 
      name: `${t("publishedAt")}`,
      selector: "published_at",
      sortable: true
    },
    {
      name: `${t("status")}`,
      grow: 1,
      cell: (row) => {
        return (
          <FormControlLabel
            value={row.active}
            control={
              <Switch
                color="primary"
                checked={row.active === "active" ? true : false}
                onChange={() => handleChangeStatus(row)}
                name=""
              />
            }
          />
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
              <Link to={{
                pathname: "/article/edit",
                state: {
                  rows,
                  allOutlets
                }
              }}>
                <Dropdown.Item
                  as="button"
                >
                  {t("edit")}
                </Dropdown.Item>
              </Link>
              <Dropdown.Item
                as="button"
                onClick={() => showConfirmModal(rows)}
              >
                {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const getArticle = async () => {
    const user_info = JSON.parse(localStorage.getItem('user_info'))
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/news-article?business_id=${user_info.business_id}`)
      setArticle(data.data)
    } catch (error) {
      setArticle([])
      console.log(error)
    }
  }

  const dataArticle = article.map((value, index) => {
    return {
      no: index + 1,
      id: value.id,
      business_id: value.business_id,
      outlet_id: value.outlet_id,
      outlet_name: value.Outlet?.name,
      title: value.title,
      image: value.image,
      body: value.body,
      active: value.active ? 'active' : 'inactive',
      hide: value.hide,
      published_at: dayjs(value.createdAt).format('DD/MM/YYYY')
    }
  })

  useEffect(() => {
    getArticle()
  }, [refresh])

  const handleDelete = async () => {
    setLoading(true)
    try {
      await axios.delete(`${API_URL}/api/v1/news-article/${selectArticle.id}`)
      handleRefresh()
      closeConfirmModal()
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const showConfirmModal = (data) => {
    setSelectArticle({ id: data.id, title: data.title });
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

  return (
    <>
      <ConfirmModal
        title={`${t('deleteArticle')} - ${selectArticle.title}`}
        body={t('areYouSureWantToDelete?')}
        buttonColor="danger"
        handleClick={handleDelete}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("Article")}</h3>
              </div>
              <div className="headerEnd">
                <Link to="/article/add">
                  <Button
                    variant="primary"
                    style={{ marginLeft: "0.5rem" }}
                  >
                    {t("addArticle")}
                  </Button>
                </Link>
              </div>
            </div>
            <DataTable 
              noHeader
              pagination
              columns={columns}
              data={dataArticle}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  )
}
