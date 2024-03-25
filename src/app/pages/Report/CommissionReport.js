import React, {useEffect, useState} from 'react';
import axios from 'axios'
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import {
  Paper
} from "@material-ui/core";
import { FeatureReport } from './components/FeatureReport'

import {
  Button,
  InputGroup,
  Form,
  Row,
  Col,
  Dropdown,
  ListGroup
} from "react-bootstrap";

const CommissionReport = () => {
  const [refresh, setRefresh] = React.useState(0)
  const handleRefresh = () => setRefresh((state) => state + 1)

  const [selectedOutlet, setSelectedOutlet] = React.useState({
    id: "",
    name: "All Outlet"
  })
  const [startDate, setStartDate] = React.useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(dayjs().format("YYYY-MM-DD"));
  const [endDateFilename, setEndDateFilename] = React.useState("");
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());
  const [tabData, setTabData] = React.useState({
    no: 17,
    table: "table-commission-report",
    filename: `commission_report${startDate}-${endDateFilename}`,
  })
  const [status, setStatus] = React.useState("");

  const { t } = useTranslation();
  const API_URL = process.env.REACT_APP_API_URL;
  const [commissionReport, setCommissionReport] = useState([])

  const getStaffId = async () => {
    try {
    const dataCommission = await axios.get(`${API_URL}/api/v1/commission`)
    const dataTransaction = await axios.get(`${API_URL}/api/v1/transaction`)
    const resultStaffIdCommission = []
    const resultStaffIdTransaction = []
    const resultAllStaffId = []
    const resultCommission = []
    const resultCommissionClone = []

    const resultTuingtuing = []
    const resultTuingtuingClone = []

    dataCommission.data.data.map(value => {
      const result = JSON.parse(value.staff_id)
      result.map(value2 => {
        resultStaffIdCommission.push(value2)
      })
    })

    dataTransaction.data.data.map((value) => {
      dataCommission.data.data.map((value2) => {
        const staffId = JSON.parse(value2.staff_id)
        staffId.map(value3 => {
          console.log("value3", value3)
          if (value.user_id === value3) {
            resultCommissionClone.push(value)
            resultTuingtuingClone.push(value2)
            if (value2.commission_type === 'nominal') {
              if(value2.nominal < value.Payment.amount){
                value.totalCommission = value2.total
                value.groupCommissionName = value2.name
                value.commisisonDateTime = value2.createdAt
                value.dateCommission = dayjs(value2.createdAt).format('DD/MM/YYYY')
                value.timeCommission = dayjs(value2.createdAt).format('HH:mm:ss')
                resultCommission.push(value)
                resultTuingtuing.push(value2)
              }
            }
          }
        })
      })
    })

    // fungsi untuk 
    resultCommission.map((value, index) => {
      resultCommission[index].jumlah = 1
    })

    const resultDeret = []
    const sumDeret = []
    const deretClone = []
    resultCommission.map(value => {
      if (resultDeret.indexOf(value.user_id) === -1) {
        resultDeret.push(value.user_id)
        deretClone.push({...value, jumlah: 1})
        console.log("element doesn't exist");
      }
      else {
        if(deretClone.length > 0) {
          deretClone.map((value2, index) => {
            if(value.user_id === value2.user_id) {
              const resultSum = value.totalCommission + value2.totalCommission
              const resultJumlah = value.jumlah + value2.jumlah
              deretClone[index].totalAllCommission = resultSum
              deretClone[index].jumlah = resultJumlah
            }
          })
        }
      }
    })
    // end fungsi untuk

    setCommissionReport(deretClone)
    console.log("deretClone", deretClone)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getStaffId()
  }, [])

  const columns = [
    {
      name: `${t("employeesName")}`,
      selector: "employees_name",
      sortable: true
    },
    {
      name: `${t("outlet")}`,
      selector: "outlet",
      sortable: true
    },
    {
      name: `${t("commissionTransaction")}`,
      selector: "commission_transaction",
      sortable: true
    },
    {
      name: `${t("totalCommission")}`,
      selector: "total_commission",
      sortable: true
    }
  ];
  // const commissionReport = [
  //   {
  //     employees_name: "Hanif",
  //     outlet: "AVE 2",
  //     commission_transaction: 3,
  //     total_commission: 15000
  //   },
  //   {
  //     employees_name: "Anthony",
  //     outlet: "Green Lake",
  //     commission_transaction: 4,
  //     total_commission: 16000
  //   }
  // ]
  const data = commissionReport.map(value => {
    return {
      employees_name: value.User?.User_Profile.name,
      outlet: value.Outlet?.name,
      commission_transaction: value.jumlah,
      total_commission: value.totalCommission,
      total_all_commission: value.totalAllCommission,
      group_name: value.groupCommissionName,
      date_commission: value.dateCommission,
      time_commission: value.timeCommission
    }
  })

  const ExpandableComponent = ({ data }) => {
    // console.log("data apa", data)
    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              <Col style={{ fontWeight: "700" }}>{t("groupCommission")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("dateCommission")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("timeCommission")}</Col>
              <Col style={{ fontWeight: "700" }}>{t("totalCommission")}</Col>
            </Row>
          </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>{data.group_name}</Col>
                <Col>{data.date_commission}</Col>
                <Col>{data.time_commission}</Col>
                <Col>{data.total_all_commission}</Col>
              </Row>
            </ListGroup.Item>
        </ListGroup>
      </>
    );
  };

  const handleStartDate = (date) => setStartDate(date)
  const handleEndDate = (date) => setEndDate(date)
  const handleEndDateFilename = (date) => setEndDateFilename(date)
  const handleSelectedOutlet = (outlet) => setSelectedOutlet(outlet)
  const handleSelectStatus = (status) => setStatus(status.target.value)
  const handleTimeStart = (time) => setStartTime(time)
  const handleTimeEnd = (time) => setEndTime(time)

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <FeatureReport
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              tabData={tabData}
              handleEndDateFilename={handleEndDateFilename}
              handleSelectedOutlet={handleSelectedOutlet}
              titleReport="reportCommisison"
              handleSelectStatus={handleSelectStatus}
              handleTimeStart={handleTimeStart}
              handleTimeEnd={handleTimeEnd}
              stateShowMdr={true}
            />
            <div>
              <div style={{ display: "none" }}>
                <table id="table-commission-report">
                  <tr>
                    <th>{t("exportCommissionReport")}</th>
                  </tr>
                  <tr>
                    <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("groupCommission")}</th>
                    <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("dateCommission")}</th>
                    <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("timeCommission")}</th>
                    <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("totalCommission")}</th>
                  </tr>
                  {commissionReport ? (
                    commissionReport.map(item => 
                      <tr>
                        <td>{item.User?.User_Profile.name}</td>
                        <td>{item.dateCommission}</td>
                        <td>{item.timeCommission}</td>
                        <td>{item.totalCommission}</td>
                    </tr>
                    )
                  ) : null }
                </table>
              </div>
              <DataTable
                noHeader
                pagination
                columns={columns}
                expandableRows
                expandableRowsComponent={ExpandableComponent}
                data={data}
                style={{ minHeight: "100%" }}
                noDataComponent={t('thereAreNoRecordsToDisplay')}
              />
            </div>
          </Paper>
        </Col>
      </Row>
    </>
  );
}

export default CommissionReport;
