import React from "react";
import { Button, Modal } from "react-bootstrap";
import { DateRangePicker } from "react-date-range";
import { useTranslation } from "react-i18next";

const CustomDateRange = ({
  show,
  handleClose,
  handleSave,
  startRange,
  endRange,
  handleStartRange
}) => {
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={handleClose}>
      <DateRangePicker
        ranges={[
          {
            startDate: startRange,
            endDate: endRange,
            key: "selection"
          }
        ]}
        onChange={handleStartRange}
      />
      <Modal.Footer>
        <Button onClick={handleSave}>{t("save")}</Button>
        <Button onClick={handleClose} variant="secondary">
          {t("cancel")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomDateRange;
