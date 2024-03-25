import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import InventoryTab from "./InventoryTab/InventoryTab";
import SupplierTab from "./SupplierTab/SupplierTab";
import PurchaseTab from "./PurchaseOrderTab/PurchaseOrderPage";
import SalesTab from "./SalesOrderTab/SalesOrderPage";

export const InventoryPage = () => {
  const [tabs, setTabs] = React.useState("inventory");
  const [refresh, setRefresh] = React.useState(0);

  const handleRefresh = () => setRefresh((state) => state + 1);
  const { t } = useTranslation();

  return (
    <Tabs activeKey={tabs} onSelect={(v) => setTabs(v)}>
      <Tab eventKey="inventory" title={t("inventory")}>
        <InventoryTab t={t} refresh={refresh} handleRefresh={handleRefresh}/>
      </Tab>

      <Tab eventKey="supplier" title={t("supplier")}>
        <SupplierTab t={t} refresh={refresh} handleRefresh={handleRefresh} />
      </Tab>

      <Tab eventKey="purchase" title={t("purchaseOrder")}>
        <PurchaseTab t={t} refresh={refresh} handleRefresh={handleRefresh} />
      </Tab>

      <Tab eventKey="sales" title={t("salesOrder")}>
        <SalesTab t={t} refresh={refresh} handleRefresh={handleRefresh} />
      </Tab>
    </Tabs>
  );
};
