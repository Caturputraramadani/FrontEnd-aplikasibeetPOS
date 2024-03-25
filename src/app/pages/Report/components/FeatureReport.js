import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper
} from "@material-ui/core";

import {
  Dropdown,
  Row,
  Col,
  DropdownButton,
  Form,
  InputGroup
} from "react-bootstrap";
import { CalendarToday, TodayOutlined, Schedule } from "@material-ui/icons";
import { SalesSummaryTab } from "../SalesSummaryTab";
import { PaymentMethodTab } from "../PaymentMethodTab";
import { SalesTypeTab } from "../SalesTypeTab";
import { CategorySalesTab } from "../CategorySalesTab";
import { TransactionHistoryTab } from "../TransactionHistoryTab";
import { AttendanceTab } from "../AttendanceTab";
import { DiscountSalesTab } from "../DiscountTab";
import { RecapTab } from "../RecapTab";
import { SalesPerProductTab } from "../SalesPerProductTab";
import COGSReport from "../COGSReport";
import ProfitReport from "../ProfitReport";
import StaffTransaction from "../StaffTransaction";
import VoidTransaction from "../VoidTransaction";
import CustomDateRange from "../../../components/CustomDateRange";
import CustomTimeRangePicker from "../../../components/CustomTimeRangePicker";
import ExportExcel from "react-html-table-to-excel";
import SalesPerHour from "../SalesPerHour";
import StockReport from "../StockReport";
import LoyaltiReport from "../LoyaltiReport";
import RawMaterial from "../RawMaterialTab"
import CommissionReport from "../CommissionReport";

export const FeatureReport = ({
  handleStartDate, 
  handleEndDate, 
  tabData, 
  handleEndDateFilename, 
  handleSelectedOutlet, 
  titleReport, 
  handleSelectStatus,
  handleTimeStart,
  handleTimeEnd,
  handleMdr,
  stateShowMdr
}) => {
  const { t } = useTranslation();

  const [tabs, setTabs] = React.useState(tabData.no);
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());
  const [time, setTime] = React.useState("");
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [selectedOutlet, setSelectedOutlet] = React.useState({
    id: "",
    name: ""
  });

  console.log("tabs", tabs)

  const [refresh, setRefresh] = React.useState(0)
  const [startRange, setStartRange] = React.useState(new Date());
  const [endRange, setEndRange] = React.useState(new Date());
  const [showMdr, setShowMdr] = React.useState("Inactive")

  const [startDate, setStartDate] = React.useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(dayjs().format("YYYY-MM-DD"));

  const [endDateFilename, setEndDateFilename] = React.useState("");

  const [stateCustom, setStateCustom] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [showFeature, setShowFeature] = React.useState({
    mdr: false
  })

  const [subscriptionPartitoin, setSubscriptionPartitoin] = React.useState(null)

  // const [tabData, setTabData] = React.useState(
  //   [
  //     {
  //       no: 1,
  //       title: `${t("salesSummary")}`,
  //       table: "table-summary",
  //       filename: `transaksi-penjualan-produk_${startDate}-${endDateFilename}`,
  //       Component: SalesSummaryTab
  //     },
  //     {
  //       no: 2,
  //       title: `${t("paymentMethod")}`,
  //       table: "table-payment",
  //       filename: `payment-method_${startDate}-${endDateFilename}`,
  //       Component: PaymentMethodTab
  //     },
  //     {
  //       no: 3,
  //       title: `${t("salesType")}`,
  //       table: "table-sales",
  //       filename: `sales-type_${startDate}-${endDateFilename}`,
  //       Component: SalesTypeTab
  //     },
  //     {
  //       no: 4,
  //       title: `${t("categorySales")}`,
  //       table: "table-category",
  //       filename: `table-category_${startDate}-${endDateFilename}`,
  //       Component: CategorySalesTab
  //     },
  //     {
  //       no: 5,
  //       title: `${t("transactionHistory")}`,
  //       table: "table-history-transaction",
  //       filename: `riwayat-transaksi_${startDate}-${endDateFilename}`,
  //       Component: TransactionHistoryTab
  //     },
  //     {
  //       no: 8,
  //       title: `${t("recap")}`,
  //       table: "table-recap",
  //       filename: `laporan-rekap_${startDate}-${endDateFilename}`,
  //       Component: RecapTab
  //     },
  //     {
  //       no: 9,
  //       title: `${t("salesPerProduct")}`,
  //       table: "table-sales-per-product",
  //       filename: `laporan-penjualan-per-produk_${startDate}-${endDateFilename}`,
  //       Component: SalesPerProductTab
  //     },
  //     {
  //       no: 10,
  //       title: `${t("costOfGoodSold")}`,
  //       table: "table-cogs",
  //       filename: `laporan-COGS_${startDate}-${endDateFilename}`,
  //       Component: COGSReport
  //     },
  //     {
  //       no: 11,
  //       title: `${t("profitCalculation")}`,
  //       table: "table-profit",
  //       filename: `laporan-perhitunga-laba_${startDate}-${endDateFilename}`,
  //       Component: ProfitReport
  //     },
  //     {
  //       no: 12,
  //       title: `${t("staffTransaction")}`,
  //       table: "table-staff-transaction",
  //       filename: `laporan-penjualan-staff_${startDate}-${endDateFilename}`,
  //       Component: StaffTransaction
  //     },
  //     {
  //       no: 13,
  //       title: `${t("voidTransaction")}`,
  //       table: "table-void",
  //       filename: `laporan-transaksi-void/refund_${startDate}-${endDateFilename}`,
  //       Component: VoidTransaction
  //     },
  //     {
  //       no: 14,
  //       title: `${t("salesPerHour")}`,
  //       table: "table-sales-per-hour",
  //       filename: `laporan-transaksi-penjualan-per-jam_${startDate}-${endDateFilename}`,
  //       Component: SalesPerHour
  //     },
  //     {
  //       no: 15,
  //       title: `${t("stockReport")}`,
  //       table: "table-stock",
  //       filename: `laporan-stock-barang_${startDate}-${endDateFilename}`,
  //       Component: StockReport
  //     },
  //     // {
  //     //   no: 16,
  //     //   title: "Loyalty report",
  //     //   table: "table-loyalty",
  //     //   filename: `laporan-loyalty_${startDate}-${endDate}`,
  //     //   Component: LoyaltiReport
  //     // }
  //   ]
  // )  
  const handleRefresh = () => setRefresh((state) => state + 1)

  const getBusiness = async () => {
    const user_info = JSON.parse(localStorage.getItem("user_info"))
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/business/${user_info.business_id}`);
      if(data.data.show_mdr) setShowMdr("Active")
      if(!data.data.show_mdr) setShowMdr("Inactive")
      handleRefresh()
    } catch (err) {
      console.log(err);
    }
  }

  const handleShowMdr = async (params) => {
    const user_info = JSON.parse(localStorage.getItem("user_info"))
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      handleMdr(params)
      setShowMdr(params)
      const data = {}
      if(params === "Active") data.show_mdr = true
      if(params === "Inactive") data.show_mdr = false

      await axios.patch(`${API_URL}/api/v1/business/update-show-mdr/${user_info.business_id}`, data);
      getBusiness()
    } catch (error) {
      console.log(error)
    }
  }

  const getOutlets = async () => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubscriptionPartition = async () => {
    try {
      const tempTabData = tabData
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`
      );
      let mdr;
      if(data.data[0].subscription_partition_id === 3) {
        mdr = true
      }
      if(data.data[0].subscription_partition_id === 2) {
        mdr = true
      }
      if(data.data[0].subscription_partition_id === 1) {
        mdr = false
      }
      setShowFeature({
        mdr
      })
    } catch (error) {
      console.log("handleSubscriptionPartition error", error)
    }
  }

  React.useEffect(() => {
    handleSubscriptionPartition()
    getBusiness()
    getOutlets();
  }, []);

  const handleSelectTab = (e) => {
    const { value } = e.target;
    setTabs(value);
    setSelectedOutlet({
      id: "",
      name: "All Outlet"
    });

    const today = new Date();
    setStartRange(today);
    setEndRange(today);

    setStartDate(dayjs(today).format("YYYY-MM-DD"));
    setEndDate(dayjs(today).format("YYYY-MM-DD"));
  };

  const handleSelectOutlet = (e) => {
    const { value } = e.target;
    let outlet;
    if (value) {
      outlet = allOutlets.find((item) => item.id === parseInt(value));
    }

    handleSelectedOutlet({
      id: value,
      name: outlet ? outlet.Location?.name : "All Outlet"
    })
    setSelectedOutlet({
      id: value,
      name: outlet ? outlet.Location?.name : "All Outlet"
    });
  };

  const handleSelectStatusChild = (e) => {
    handleSelectStatus(e)
    setStatus(e.target.value)
  }

  const handleStartRange = ({ selection }) => {
    const { startDate: start, endDate: end } = selection;
    setStartRange(start);
    setEndRange(end);
  };
  const handleOpenCustom = () => setStateCustom(true);
  const handleCloseCustom = () => {
    setStartRange(new Date(startDate));
    setEndRange(new Date(endDate));
    setStateCustom(false);
  };
  const handleSaveCustom = () => {
    handleStartDate(dayjs(startRange).format("YYYY-MM-DD"))
    handleEndDate(dayjs(endRange).add(1, "days").format("YYYY-MM-DD"))
    handleEndDateFilename(
      dayjs(endRange)
      .format("YYYY-MM-DD")
    )

    setStartDate(dayjs(startRange).format("YYYY-MM-DD"));
    setEndDate(
      dayjs(endRange)
        .add(1, "days")
        .format("YYYY-MM-DD")
    );
    setEndDateFilename(
      dayjs(endRange)
      .format("YYYY-MM-DD")
    )
    setStateCustom(false);
  };

  const displayDate = () => {
    const start = dayjs(startDate).format("DD-MM-YYYY");
    const end = dayjs(endRange).format("DD-MM-YYYY");

    if (start === end) {
      return start;
    } else {
      return `${start} - ${end}`;
    }
  };
  const handleTimeStartChild = (date) => {
    handleTimeStart(date)
    setStartTime(date)
  };
  const handleTimeEndChild = (date) => {
    handleTimeEnd(date)
    setEndTime(date)
  };

  const handleSaveTime = () => {
    let time_start = dayjs(startTime).format("HH:mm");
    let end_time = dayjs(endTime).format("HH:mm");
    setTime(`${time_start} - ${end_time}`);
    setShowTimePicker(false);
  };
  return (
    <>
      <CustomDateRange
        show={stateCustom}
        handleClose={handleCloseCustom}
        handleSave={handleSaveCustom}
        startRange={startRange}
        endRange={endRange}
        handleStartRange={handleStartRange}
      />
      <CustomTimeRangePicker
        show={showTimePicker}
        handleClose={() => setShowTimePicker(false)}
        handleSave={handleSaveTime}
        startTime={startTime}
        endTime={endTime}
        handleStartTime={handleTimeStartChild}
        handleEndTime={handleTimeEndChild}
      />
      <Row>
        <Col>
          <div
            className="headerPage lineBottom"
            style={{ marginBottom: "1rem" }}
          >
            <div className="headerStart">
              <h3 style={{ margin: "0" }}>{t(titleReport)}</h3>
            </div>

            <div className="headerEnd">
              <Row>
                {showFeature.mdr && stateShowMdr ? (
                  <div className="d-flex align-items-center">
                    <Form.Label className="mr-1">{t("mdr")}</Form.Label>
                    <FormControl component="fieldset">
                      <FormGroup aria-label="position" row>
                        <FormControlLabel
                          value={showMdr}
                          control={
                            <Switch
                              color="primary"
                              checked={showMdr === "Active" ? true : false}
                              onChange={(e) => {
                                if (showMdr === e.target.value) {
                                  if (showMdr === "Active") {
                                    handleShowMdr("Inactive");
                                  } else {
                                    handleShowMdr("Active");
                                  }
                                }
                              }}
                            />
                          }
                        />
                      </FormGroup>
                    </FormControl>
                  </div>
                ) : null }
                
                <div>
                  <ExportExcel
                    className="btn btn-outline-primary ml-2"
                    table={tabData.table || ""}
                    filename={tabData.filename || `laporan_${startDate}-${endDateFilename}`}
                    sheet="transaction-report"
                    buttonText={t("export")}
                  />
                </div>
              </Row>
            </div>
          </div>

          <div className="filterSection lineBottom">
            <Row>
              <Col>
                <Form.Group as={Row}>
                  <Form.Label
                    style={{ alignSelf: "center", marginBottom: "0" }}
                  >
                    {t("outlet")}:
                  </Form.Label>
                  <Col>
                    <Form.Control
                      as="select"
                      name="outlet_id"
                      value={selectedOutlet.id}
                      onChange={handleSelectOutlet}
                    >
                      <option value="">{t("all")}</option>
                      {allOutlets.map((item) => {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Col>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group as={Row}>
                  <Form.Label
                    style={{ alignSelf: "center", marginBottom: "0" }}
                  >
                    {t("date")}:
                  </Form.Label>
                  <Col>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={displayDate()}
                        onClick={handleOpenCustom}
                        style={{
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0
                        }}
                        readOnly
                      />

                      <InputGroup.Append>
                        <InputGroup.Text>
                          <CalendarToday />
                        </InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </Col>
                </Form.Group>
              </Col>

              {tabs === 5 ? (
                <Col>
                  <Row>
                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label
                          style={{ alignSelf: "center", marginBottom: "0" }}
                        >
                          {t("status")}:
                        </Form.Label>
                        <Col>
                          <Form.Control
                            as="select"
                            name="status"
                            value={status}
                            onChange={handleSelectStatusChild}
                            onBlur={handleSelectStatusChild}
                          >
                            <option value={""}>{t("dashboard")}</option>
                            {[`${t("new")}`, `${t("done")}`, `${t("refund")}`, `${t("closed")}`].map(
                              (item, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={item.toLowerCase()}
                                  >
                                    {item}
                                  </option>
                                );
                              }
                            )}
                          </Form.Control>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              ) : tabs === 14 ? (
                <Col>
                  <Row>
                    <Col>
                      <Form.Group as={Row}>
                        <Form.Label
                          style={{ alignSelf: "center", marginBottom: "0" }}
                        >
                          {t("time")} :
                        </Form.Label>
                        <Col>
                          <InputGroup>
                            <Form.Control
                              type="text"
                              value={time}
                              onClick={() =>
                                setShowTimePicker(!showTimePicker)
                              }
                              style={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0
                              }}
                              readOnly
                            />

                            <InputGroup.Append>
                              <InputGroup.Text>
                                <Schedule />
                              </InputGroup.Text>
                            </InputGroup.Append>
                          </InputGroup>
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              ) : (
                ""
              )}
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};
