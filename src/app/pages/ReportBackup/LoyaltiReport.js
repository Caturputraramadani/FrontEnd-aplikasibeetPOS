import React from "react";
import axios from "axios";
import { Row, Col, ListGroup } from "react-bootstrap";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const LoyaltiReport = ({selectedOutlet, startDate, endDate, endDateFilename}) => {
  const { t } = useTranslation();
     const kolom = [
       "No",
       "Nama Produk",
       "Kategori",
       "Jumlah Terjual",
       "Total Penjualan",
       "Point",
       "Point Terpakai"
     ];
     const columns = [
       "No",
       "Product Name",
       "Category",
       "Sold Quantity",
       "Total Sales",
       "Point",
       "Point Used",
     ];
  return (
    <>
      <div style={{ display: "none" }}>
        <table id="table-loyalty">
          <thead>
            <tr>
              <th>Laporan Loyalty</th>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>Outlet</th>
              <td>
                {selectedOutlet.id === " " ||
                selectedOutlet.id === null ||
                selectedOutlet.id === undefined
                  ? "Semua Outlet"
                  : selectedOutlet.name}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              <th>Tanggal</th>
              <td>{`${startDate} - ${endDateFilename}`}</td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
          <thead>
            <tr>
              {kolom.map((i) => (
                <th>{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* {dataInventory.length > 0 ? (
              dataInventory.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.outlet_name}</td>
                    <td>{item.name}</td>
                    <td>{item.stock_starting}</td>
                    <td>{item.stock}</td>
                    <td>{item.incoming_stock}</td>
                    <td>{item.outcoming_stock}</td>
                    <td>{item.adjusment}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>{t('dataNotFound')}</td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>
      <DataTable
        noHeader
        pagination
        columns={columns}
     //    data={dataInventory}
        style={{ minHeight: "100%" }}
        noDataComponent={t('thereAreNoRecordsToDisplay')}
      />
    </>
  );
};

export default LoyaltiReport;
