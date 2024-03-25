import React, {useEffect, useState} from 'react';
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import axios from 'axios'
import dayjs from "dayjs";
import {
  Paper
} from "@material-ui/core";
import { FeatureReport } from './components/FeatureReport'
import {
  Row,
  Col
} from "react-bootstrap";

const RawMaterialTab = () => {
  const [mdr, setMdr] = React.useState("")
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
    no: 16,
    table: "table-raw-material-report",
    filename: `raw_material_report_${startDate}-${endDateFilename}`,
  })
  const [status, setStatus] = React.useState("");

  const { t } = useTranslation();
  const [dataExport, setDataExport] = useState([])

  const columns = [
    {
      name: `${t("rawMaterial")}`,
      selector: "raw_material",
      sortable: true
    },
    {
      name: `${t("usedAmount")}`,
      selector: "used_amount",
      sortable: true
    },
    {
      name: `${t("remainingAmount")}`,
      selector: "remaining_amount",
      sortable: true
    },
    {
      name: `${t("unit")}`,
      selector: "unit",
      sortable: true
    }
  ];
  const getRecipe = async (id, start_range, end_range) => {
    if (start_range === end_range) {
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }
    if (new Date(start_range) > new Date(end_range)) {
      start_range = dayjs(start_range)
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      end_range = dayjs(end_range)
        .add(1, "day")
        .format("YYYY-MM-DD");
    }

    console.log("id outlet raw material report", id)
    console.log("start_range raw material report", start_range)
    console.log("end_range raw material report", end_range)

    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = id ? `outlet_id=${id}` : "";

    try {
      // const transaction = await axios.get(`${API_URL}/api/v1/transaction?${outlet_id}&date_start=${start_range}&date_end=${end_range}`)
      // const { data } = await axios.get(`${API_URL}/api/v1/recipe`)
      // const rawMaterials = await axios.get(`${API_URL}/api/v1/raw-material`)

      // console.log("recipe data data", data.data)
      // console.log("transaction.data.data", transaction.data.data)
      // console.log("rawMaterials.data.data", rawMaterials.data.data)
      // const idProductTransaction = []
      // transaction.data.data.map(value => {
      //   value.Transaction_Items.map(value2 => {
      //     console.log("looping transaction", value2)
      //     idProductTransaction.push({product_id: value2.product_id, quantity: value2.quantity, recipe_id: value2.Product?.recipe_id})
      //   })
      // })

      // console.log("idProductTransaction", idProductTransaction)
      // const resultRecipeMaterials = []
      // const separetedRawMaterials = []

      // for ( const value of idProductTransaction) {
      //   const recipeMaterials = await axios.get(`${API_URL}/api/v1/recipe-materials?recipe_id=${value.recipe_id}`)
      //   for (const value2 of recipeMaterials.data.data) {
      //     if(value.recipe_id === value2.recipe_id) {
      //       console.log("sebelum mantul", value2)
      //       value2.salto = value2.quantity * value.quantity
      //       console.log("sesudah mantul", value2)
      //       separetedRawMaterials.push(value2)
      //     }
      //   }
      //   if(recipeMaterials.data.data.Raw_Material.length > 0) {
      //     for (const value2 of recipeMaterials.data.data.Raw_Material) {
      //       resultRecipeMaterials.push({stock: value2.stock, name: value2.name})
      //     }
      //   } else {
      //     resultRecipeMaterials.push({stock: recipeMaterials.data.data.Raw_Material.stock, name: recipeMaterials.data.data.Raw_Material.name})
      //   }
      // }

      // console.log("resultRecipeMaterials", resultRecipeMaterials)
      // console.log("separetedRawMaterials", separetedRawMaterials)

      // const recipeMaterials = []
      // data.data.map(value => {
      //   idProductTransaction.map(value2 => {
      //     if(value.product_id === value2.product_id) {
      //       console.log("value recipe bismillah", value.Recipe_Materials)
      //       console.log("value2.quantity", value2.quantity)
      //       if(value.Recipe_Materials.length > 0) {
      //         console.log("value.Recipe_Materials.quantity", value.Recipe_Materials[0].quantity)
      //         value.Recipe_Materials[0].salto = value.Recipe_Materials[0].quantity * value2.quantity
      //         console.log("value aslinya", value.Recipe_Materials)
      //         recipeMaterials.push(value.Recipe_Materials[0])
      //       }
      //     }
      //   })
      // })

      // console.log("idProductTransaction", idProductTransaction)
      // console.log("recipeMaterials", recipeMaterials)
      
      const resultRawMaterialReport = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/raw-material-report?${outlet_id}&date_start=${start_range}&date_end=${end_range}`)
      console.log("resultRawMaterialReport", resultRawMaterialReport)

      const deret_raw_materials = []
      const sum_raw_materials_amount = []

      resultRawMaterialReport.data.data.map(value => {
        if (deret_raw_materials.indexOf(value.raw_material_id) === -1) {
          deret_raw_materials.push(value.raw_material_id)
          sum_raw_materials_amount.push({raw_material_id: value.raw_material_id, used_amount: value.used_amount, raw_material_name: value.raw_material_name, remaining_amount: value.remaining_amount, unit: value.Unit?.name})
        }
        else {
          if(sum_raw_materials_amount.length > 0) {
            sum_raw_materials_amount.map((value2, index) => {
              if(value.raw_material_id === value2.raw_material_id) {
                const resultSum = value.used_amount + value2.used_amount
                console.log("value result raw material report", value)
                sum_raw_materials_amount[index].used_amount = resultSum
              }
            })
          }
        }
      })

      console.log("sum_raw_materials_amount", sum_raw_materials_amount)
      setDataExport(sum_raw_materials_amount)
    } catch (err) {
      setDataExport([])
      console.error(err)
    }
  };

  useEffect(() => {
    getRecipe(selectedOutlet.id, startDate, endDate)
    setTabData({
      ...tabData,
      filename: `raw_material_report_${startDate}-${endDateFilename}`
    })
  }, [selectedOutlet, startDate, endDate, endDateFilename, mdr])

  const rawMaterialReport = dataExport.map(value => {
    return {
      raw_material: value.raw_material_name,
      used_amount: value.used_amount,
      remaining_amount: value.remaining_amount,
      unit: value.unit
    }
  })

  const handleStartDate = (date) => setStartDate(date)
  const handleEndDate = (date) => setEndDate(date)
  const handleEndDateFilename = (date) => setEndDateFilename(date)
  const handleSelectedOutlet = (outlet) => setSelectedOutlet(outlet)
  const handleSelectStatus = (status) => setStatus(status.target.value)
  const handleTimeStart = (time) => setStartTime(time)
  const handleTimeEnd = (time) => setEndTime(time)
  const handleMdr = (params) => setMdr(params)

  return (
    <>
      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <FeatureReport
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              tabData={tabData}
              handleMdr={handleMdr}
              handleEndDateFilename={handleEndDateFilename}
              handleSelectedOutlet={handleSelectedOutlet}
              titleReport="ingredientsReport"
              handleSelectStatus={handleSelectStatus}
              handleTimeStart={handleTimeStart}
              handleTimeEnd={handleTimeEnd}
              stateShowMdr={true}
            />

            <div style={{ display: "none" }}>
              <table id="table-raw-material-report">
                <tr>
                  <th>{t("exportRawMaterialResult")}</th>
                </tr>
                <tr>
                  <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("rawMaterial")}</th>
                  <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("usedAmount")}</th>
                  <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("remainingAmount")}</th>
                  <th scope="col" style={{ backgroundColor: "yellow", fontWeight: "700"}}>{t("unit")}</th>
                </tr>
                {dataExport ? (
                  dataExport.map(item => 
                    <tr>
                      <td>{item.raw_material_name}</td>
                      <td>{item.used_amount}</td>
                      <td>{item.remaining_amount}</td>
                      <td>{item.unit}</td>
                  </tr>
                  )
                ) : null }
              </table>
            </div>
            <div>
              <DataTable
                noHeader
                pagination
                columns={columns}
                data={rawMaterialReport}
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

export default RawMaterialTab;
