import React from "react";
import { Button, Modal } from "react-bootstrap";
import { KeyboardTimePicker } from "@material-ui/pickers";
import { useTranslation } from "react-i18next";

const CustomTimeRangePicker = ({
  show,
  handleClose,
  handleSave,
  startTime,
  endTime,
  handleStartTime,
  handleEndTime
}) => {
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={handleClose}>
      <div
        style={{
          padding: "50px 10px",
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gridGap: "10px"
        }}
      >
        <KeyboardTimePicker
          margin="normal"
          id="start-time-picker"
          ampm={false}
          label="Start Time"
          value={startTime}
          onChange={handleStartTime}
          KeyboardButtonProps={{
            "aria-label": "change start time"
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id="end-time-picker"
          ampm={false}
          label="End Time"
          value={endTime}
          onChange={handleEndTime}
          KeyboardButtonProps={{
            "aria-label": "change end time"
          }}
        />
      </div>
      <Modal.Footer>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleClose} variant="secondary">
          {t("cancel")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomTimeRangePicker;
