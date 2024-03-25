import React from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Row, Col, ListGroup } from "react-bootstrap";
import DataTable from "react-data-table-component";

import "../style.css";

export const AttendanceTab = ({ selectedOutlet, startDate, endDate, endDateFilename }) => {
  const [allAttendances, setAllAttendances] = React.useState([]);
  const [reports, setReports] = React.useState([
    {
      user: {
        email: "",
        name: "",
        phone_number: ""
      },
      date: "",
      check_in: "",
      check_out: ""
    }
  ]);
  const { t } = useTranslation();
  const getAttendances = async (id, start_range, end_range) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const outlet_id = id ? `outlet_id=${id}` : "";

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

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/attendance?${outlet_id}&start_date=${start_range}&end_date=${end_range}`
      );
      setAllAttendances(data.data);

      const compileReports = data.data.map((item) => {
        return {
          user: {
            email: item.User.email,
            name: item.User.User_Profile.name,
            phone_number: item.User.User_Profile.phone_number
          },
          outlet: item.Outlet?.name,
          date: item.createdAt,
          check_in: item.clock_in,
          check_out: item.clock_out
        };
      });

      setReports(compileReports);
    } catch (err) {
      setAllAttendances([]);
      console.log(err);
    }
  };

  React.useEffect(() => {
    getAttendances(selectedOutlet.id, startDate, endDate);
  }, [selectedOutlet, startDate, endDate]);

  const columns = [
    {
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "70px"
    },
    {
      name: `${t("staffName")}`,
      selector: "staff_name",
      sortable: true
    },
    {
      name: `${t("outlet")}`,
      selector: "outlet_name",
      sortable: true
    },
    {
      name: `${t("checkInTime")}`,
      selector: "check_in",
      sortable: true
    },
    {
      name: `${t("checkOutTime")}`,
      selector: "check_out",
      sortable: true
    }
  ];

  const dataAttendances = () => {
    return allAttendances.map((item, index) => {
      return {
        id: item.id,
        no: index + 1,
        staff_name: item.User.User_Profile.name,
        outlet_name: item.Outlet?.name || "-",
        check_in: dayjs(item.clock_in).format("DD/MM/YYYY HH:mm"),
        check_out: item.clock_out
          ? dayjs(item.clock_out).format("DD/MM/YYYY HH:mm")
          : "-",
        check_in_image: item.image_in,
        check_out_image: item.image_out
      };
    });
  };

  const ExpandableComponent = ({ data }) => {
    const keys = [
      {
        key: "Check In Image",
        value: "check_in_image"
      },
      {
        key: "Check Out Image",
        value: "check_out_image"
      }
    ];

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          <ListGroup.Item>
            <Row>
              <Col sm={4}></Col>
              <Col style={{ fontWeight: "700" }}>Check In Image</Col>
              <Col style={{ fontWeight: "700" }}>Check Out Image</Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col sm={4}></Col>
              {keys.map((val, index) => {
                return (
                  <Col key={index}>
                    {data[val.value] ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${
                          data[val.value]
                        }`}
                        alt="attendance-img"
                        style={{
                          width: "120px",
                          height: "auto"
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </Col>
                );
              })}
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </>
    );
  };

  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-attendance-report">
          <thead>
            <tr>
              <th>{t("attendanceReport")}</th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>{t("date")}</th>
              <td>
                {startDate} - {endDateFilename}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>{t("date&Time")}</th>
              <th>{t("staffName")}</th>
              <th>{t("outlet")}</th>
              <th>{t("checkInTime")}</th>
              <th>{t("checkOutTime")}</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{dayjs(item.date).format("DD/MM/YYYY")}</td>
                  <td>{item.user.name}</td>
                  <td>{item.outlet}</td>
                  <td>
                    {item.check_in ? dayjs(item.check_in).format("HH:mm") : "-"}
                  </td>
                  <td>
                    {item.check_out
                      ? dayjs(item.check_out).format("HH:mm")
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DataTable
        noHeader
        pagination
        columns={columns}
        data={dataAttendances()}
        expandableRows
        expandableRowsComponent={ExpandableComponent}
        style={{ minHeight: "100%" }}
        noDataComponent={t('thereAreNoRecordsToDisplay')}
      />
    </>
  );
};
