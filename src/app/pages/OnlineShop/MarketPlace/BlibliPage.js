import React, { useEffect, useState } from 'react'
import { Paper } from "@material-ui/core"
import {
  Row,
  Col,
  InputGroup,
  Form,
  Dropdown
} from 'react-bootstrap'
import { Search, MoreHoriz } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import axios from 'axios'
import DataTable from "react-data-table-component";
import useDebounce from "../../../hooks/useDebounce";
import '../style.css'
import dayjs from "dayjs";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmModal from "../../../components/ConfirmModal";

toast.configure()
export default function BlibliPage() {
  const { t } = useTranslation();
  const [allOutlets, setAllOutlets] = useState([])
  const [refresh, setRefresh] = React.useState(0);
  const [filter, setFilter] = React.useState({
    time: "newest"
  });
  const [search, setSearch] = React.useState("");
  const allStatuses = ["Newest", "Oldest"];

  const [showConfirmIntegration, setShowConfirmIntegration] = React.useState(false)
  const [showCancelIntegration, setShowCancelIntegration] = React.useState(false)
  
  const [loading, setLoading] = React.useState(false) 
  const [dataOutlet, setDataOutlet] = React.useState({})

  const handleRefresh = () => setRefresh((state) => state + 1);
  const debouncedSearch = useDebounce(search, 1000);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const getOutlets = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterOutlet = `?name=${search}&order=${filter.time}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/outlet${filterOutlet}`
      );
      setAllOutlets(data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  const dataOutlets = () => {
    return allOutlets.map((item, index) => {

      let status_integrate = {
        key: false,
        label: t('notYetIntegrated')
      }
      // Cek duls, apakah status_integrate_beetstorenya true?
      console.log("semua outlet", item)

      if(item.Request_Integration_Online_Shops) {
        const find_online_shop_name = item.Request_Integration_Online_Shops.find(
          (val) => val.online_shop_name === 'blibli'
        )
        if(find_online_shop_name){
          if(find_online_shop_name.status === 'done' && item.status_integrate_blibli) {
            status_integrate = {
              key: true,
              label: t('alreadyIntegrated')
            }
          } else {
            status_integrate = {
              key: false,
              label: t('pending')
            }
          }
        }
      }

      if (item.Location) {
        const location = `${item.Location.name}, ${item.Location.City.name}, ${item.Location.City.Province.name}`;
        const capitalize = location
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        return {
          id: item.id,
          no: index + 1,
          name: item.name,
          location: item.Location.name,
          address: item.address || "",
          payment_description: item.payment_description,
          postcode: item.postcode || "",
          location_id: item.Location.id,
          city_id: item.Location.City.id,
          province_id: item.Location.City.Province.id,
          locationFull: capitalize,
          latitude: item.latitude,
          longitude: item.longitude,
          image: item.image,
          phone_number: item.phone_number || "",
          status: item.status,
          open_days: item.open_days,
          open_hour: item.open_hour,
          close_hour: item.close_hour,
          tax: item.Outlet_Taxes.length ? "Taxable" : "No Tax",
          allTaxes: item.Outlet_Taxes.map((item) => item.Tax.name).join(", "),
          vacation: item.vacation,
          sosmed: item.sosmed ? JSON.parse(item.sosmed) : [],
          sosmed_name: item.sosmed_name,
          status_integrate,
          activation_date_blibli: item.activation_date_blibli ? dayjs(item.activation_date_blibli).format('DD MMMM YYYY') : "-",
          update_date_blibli: item.update_date_blibli ? dayjs(item.update_date_blibli).format('DD MMMM YYYY') : "-"
        };
      } else {
        console.log("jika tidak ada");
        return {
          id: item.id,
          no: index + 1,
          name: item.name,
          address: item.address || "",
          payment_description: item.payment_description,
          postcode: item.postcode || "",
          province: item.province,
          city: item.city,
          location: item.location,
          latitude: item.latitude,
          longitude: item.longitude,
          image: item.image,
          phone_number: item.phone_number || "",
          status: item.status,
          open_days: item.open_days,
          open_hour: item.open_hour,
          close_hour: item.close_hour,
          tax: item.Outlet_Taxes.length ? "Taxable" : "No Tax",
          allTaxes: item.Outlet_Taxes.map((item) => item.Tax.name).join(", "),
          vacation: item.vacation,
          sosmed: item.sosmed ? JSON.parse(item.sosmed) : [],
          sosmed_name: item.sosmed_name,
          activation_date_blibli: item.activation_date_blibli ? dayjs(item.activation_date_blibli).format('DD MMMM YYYY') : "-",
          update_date_blibli: item.update_date_blibli ? dayjs(item.update_date_blibli).format('DD MMMM YYYY') : "-",
          status_integrate
        };
      }
    });
  };

  const openConfirmIntegration = () => setShowConfirmIntegration(true)
  const closeConfirmIntegration = () => setShowConfirmIntegration(false)

  const openCancelIntegration = () => setShowCancelIntegration(true)
  const closeCancelIntegration = () => setShowCancelIntegration(false)
  
  const handleConfirmIntegration = (data_outlet) => {
    setDataOutlet(data_outlet)
    openConfirmIntegration()
  }

  const handleCancleIntegration = (data_outlet) => {
    setDataOutlet(data_outlet)
    openCancelIntegration()
  }

  const handleCancel = async () => {
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    const API_URL = process.env.REACT_APP_API_URL;
    console.log("dataOutlet", dataOutlet)
    try {
      await axios.delete(`${API_URL}/api/v1/request-integration-online-shop/delete-by-outlet?business_id=${userInfo.business_id}&outlet_id=${dataOutlet.id}&online_shop_name=blibli`)

      handleRefresh()
      closeCancelIntegration()

      toast.success(t('successCancelIntegration'), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log("error ", error)
      toast.error(t('cancelIntegrationFailed'), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  const handleaAction = (data_outlet) => {
    // Jika status integrasinya masih pending, bisa di cancel
    if(data_outlet.status_integrate.label === t('pending')) {
      handleCancleIntegration(data_outlet)
    } else {
    // Jika statusnya sudah terintegrasi, maka tidak bisa di cancel dan buttonya jadi disable
      handleConfirmIntegration(data_outlet)
    }
  }

  const handleApply = async () => {
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const data = {
        business_id: userInfo.business_id,
        outlet_id : dataOutlet.id,
        online_shop_name: 'blibli',
        status: 'pending'
      }
      console.log("data sebelum dikirim", data)
      await axios.post(`${API_URL}/api/v1/request-integration-online-shop`, data)
      toast.success(t('successApplyForIntegration'), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      closeConfirmIntegration()
      handleRefresh()
    } catch (error) {
      toast.error(t('somethingWentWrong'), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log("error handleApply", error)
    }
  }

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
      name: `${t("integrationStatus")}`,
      cell: (rows) => {
        return (
          <div className={rows.status_integrate.key ? 'integrated' : rows.status_integrate.label === t('pending') ? 'pendingIntegration' : 'notIntegrated'}>{rows.status_integrate.label}</div>
        );
      }
    },
    {
      name: t('activationDate'),
      sortable: true,
      cell: (rows) => {
        return (
          rows.status_integrate.key ? (
            <div>{rows.activation_date_blibli}</div>
          ): "-"
        )
      }
    },
    {
      name: t('updateDate'),
      sortable: true,
      cell: (rows) => {
        return (
          rows.status_integrate.key ? (
            <div>{rows.update_date_blibli}</div>
          ): "-"
        )
      }
    },
    {
      name: `${t("actions")}`,
      cell: (rows) => {
        return (
          // Tombol disable ketika status integrasi sudah aktif
          // Jika status integrasi pending, maka muncul 'Cancel Integration'
          // Jika status integrasinya 'belum integrasi' maka muncul 'Apply for Integration'

          <button onClick={() => handleaAction(rows)} style={{padding:"5px 7px"}} className='btn btn-primary' disabled={rows.status_integrate.key}>{rows.status_integrate.label === t('pending') || rows.status_integrate.key ?  t('cancelIntegration') : t('applyForIntegration')}</button>
        );
      }
    }
  ];

  useEffect(() => {
    getOutlets(debouncedSearch, filter);
  }, [refresh, debouncedSearch, filter]);

  return (
    <div>
      <ConfirmModal
        title={t('blibliIntegration')}
        body={t('areYouSureAboutApplyingForBlibliIntegration')}
        buttonColor="danger"
        handleClick={handleApply}
        state={showConfirmIntegration}
        closeModal={closeConfirmIntegration}
        loading={loading}
      />
      <ConfirmModal
        title={t('cancelApplyForIntegration')}
        body={t('areYouSureCancelingApplyingIntegrationBlibli')}
        buttonColor="danger"
        handleClick={handleCancel}
        state={showCancelIntegration}
        closeModal={closeCancelIntegration}
        loading={loading}
      />
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t('chooseOutlet')} - {t('blibliIntegration')}</h3>
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
                  <Row>
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
                            {allStatuses.map((item, index) => {
                              return (
                                <option key={index} value={item.toLowerCase()}>
                                  {t(item.toLowerCase())}
                                </option>
                              );
                            })}
                          </Form.Control>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataOutlets()}
              // expandableRows
              // expandableRowsComponent={ExpandableComponent}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </div>
  )
}
