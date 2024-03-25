import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import imageCompression from 'browser-image-compression';
import { useTranslation } from "react-i18next";

import { Tabs, Tab } from "react-bootstrap";

import QuantityTab from "./Tabs/QuantityTab";
import TransactionTab from "./Tabs/TransactionTab";
import XyTab from "./Tabs/XyTab";

export const AddAutomaticPromoPage = ({ location }) => {
  const [tabs, setTabs] = React.useState("quantity");
  const history = useHistory();
  const { allOutlets, allProducts } = location.state;
  const { t } = useTranslation()
  const [photo, setPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [alert, setAlert] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorDate, setErrorDate] = React.useState(false)

  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  // const [startHour, setStartHour] = React.useState(dayjs().format("HH:mm"));
  // const [endHour, setEndHour] = React.useState(dayjs().format("HH:mm"));
  const [startHour, setStartHour] = React.useState(new Date());
  const [endHour, setEndHour] = React.useState(new Date());

  const [weekdays, setWeekdays] = React.useState({
    monday: { checked: false },
    tuesday: { checked: false },
    wednesday: { checked: false },
    thursday: { checked: false },
    friday: { checked: false },
    saturday: { checked: false },
    sunday: { checked: false },
    everyday: { checked: false }
  });

  // promo time & location
  const valueTimeLocation = {
    name: "",
    outlet_id: "",
    promo_date_start: dayjs().format("YYYY-MM-DD"),
    promo_date_end: dayjs().format("YYYY-MM-DD"),
    promo_days: "",
    promo_hour_start: dayjs().format("HH:mm"),
    promo_hour_end: dayjs().format("HH:mm"),
    description_type: "regulation",
    description: ""
  };

  // quantity
  const initialValuePromoQuantity = {
    ...valueTimeLocation,
    type: "quantity",
    quantity_product_id: "",
    quantity_type: "percentage",
    quantity_value: 0,
    quantity_amount: 0
  };

  // transaction
  const initialValuePromoTransaction = {
    ...valueTimeLocation,
    type: "transaction",
    transaction_type: "percentage",
    transaction_value: 0,
    transaction_amount: 0
  };

  // xy
  const initialValuePromoXY = {
    ...valueTimeLocation,
    type: "xy",
    xy_product_x_id: [],
    xy_product_y_id: [],
    xy_amount_x: 0,
    xy_amount_y: 0,
    xy_apply_multiply: false,
    quantity_apply_multiply: false
  };

  // schema
  const valueTimeSchema = {
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAName")}`),
    outlet_id: Yup.array()
      .of(Yup.number().min(1))
      .required(`${t("pleaseChooseOutlet")}`),
    description_type: Yup.string()
      .matches(/regulation|how_to_use/)
      .required(`${t("pleaseChooseDescriptionType")}`),
    description: Yup.string().min(1, `${t("minimum1Character")}`),
    promo_date_start: Yup.date().required(`${t("pleaseInputDateStart")}`),
    promo_date_end: Yup.date().required(`${t("pleaseInputDateEnd")}`),
    promo_days: Yup.string()
      .min(1)
      .required(`${t("pleaseChoosePromoDays")}`),
    promo_hour_start: Yup.string()
      .min(1)
      .required(`${t("pleaseInputHourStart")}`),
    promo_hour_end: Yup.string()
      .min(1)
      .required(`${t("pleaseInputHourEnd")}`)
  };

  // quantity
  const PromoQuantitySchema = Yup.object().shape({
    ...valueTimeSchema,
    quantity_product_id: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseChooseAProduct")}`),
    quantity_type: Yup.string()
      .matches(/percentage|currency/)
      .required(`${t("pleaseChooseADiscountType")}`),
    quantity_value: Yup.number()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputaDiscountValue")}`),
    quantity_amount: Yup.number()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputPromoAmount")}`)
  });

  // transaction
  const PromoTransactionSchema = Yup.object().shape({
    ...valueTimeSchema,
    transaction_type: Yup.string()
      .matches(/percentage|currency/)
      .required(`${t("pleaseChooseADiscountType")}`),
    transaction_value: Yup.number()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputDiscountValue")}`),
    transaction_amount: Yup.number()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputAPromoAmount")}`)
  });

  // xy
  const PromoXYSchema = Yup.object().shape({
    ...valueTimeSchema,
    xy_product_x_id: Yup.array()
      .of(Yup.number())
      .required(`${t("pleaseInputProductX")}`),
    xy_product_y_id: Yup.array()
      .of(Yup.number())
      .required(`${t("pleaseInputProductY")}`),
    xy_amount_x: Yup.number()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputAmountX")}`),
    xy_amount_y: Yup.number()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputAmountY")}`),
    xy_apply_multiply: Yup.boolean(),
    quantity_apply_multiply: Yup.boolean()
    
  });

  const formikPromoQuantity = useFormik({
    initialValues: initialValuePromoQuantity,
    validationSchema: PromoQuantitySchema,
    // enableReinitialize: true,
    onSubmit: async (values) => {
      if(errorDate) {
        console.log("tanggal akhir harus lebih besar dari tanggal mulai")
      } else {
        const API_URL = process.env.REACT_APP_API_URL;
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("type", values.type);
        formData.append("outlet_id", JSON.stringify(values.outlet_id));
        formData.append("description_type", values.description_type);
        formData.append("promo_date_start", values.promo_date_start);
        formData.append("promo_date_end", values.promo_date_end);
        formData.append("promo_days", values.promo_days);

        const format_hour_start = dayjs(values.promo_hour_start).format("HH:mm")
        const format_hour_end = dayjs(values.promo_hour_end).format("HH:mm")

        formData.append("promo_hour_start", format_hour_start);
        formData.append("promo_hour_end", format_hour_end);

        // formData.append("promo_hour_start", values.promo_hour_start);
        // formData.append("promo_hour_end", values.promo_hour_end);

        formData.append("quantity_product_id", values.quantity_product_id);
        formData.append("quantity_value", values.quantity_value);
        formData.append("quantity_type", values.quantity_type);
        formData.append("quantity_amount", values.quantity_amount);
        formData.append("quantity_apply_multiply", values.quantity_apply_multiply);

        if (values.description) formData.append("description", values.description);
        if (photo) {
          formData.append("automaticPromoImage", photo);
        }

        try {
          enableLoading();
          await axios.post(`${API_URL}/api/v1/automatic-promo/create-development`, formData);
          disableLoading();
          history.push("/promo/automatic-promo");
        } catch (err) {
          setAlert(err.response?.data.message || err.message);
          disableLoading();
        }
      }
    }
  });

  const formikPromoTransaction = useFormik({
    initialValues: initialValuePromoTransaction,
    validationSchema: PromoTransactionSchema,
    onSubmit: async (values) => {
      
      if(errorDate) {
        console.log("tanggal akhir harus lebih besar dari tanggal mulai")
      } else {
        const API_URL = process.env.REACT_APP_API_URL;
        const formData = new FormData();
  
        formData.append("name", values.name);
        formData.append("type", values.type);
        formData.append("outlet_id", JSON.stringify(values.outlet_id));
        formData.append("description_type", values.description_type);
        formData.append("promo_date_start", values.promo_date_start);
        formData.append("promo_date_end", values.promo_date_end);
        formData.append("promo_days", values.promo_days);

        const format_hour_start = dayjs(values.promo_hour_start).format("HH:mm")
        const format_hour_end = dayjs(values.promo_hour_end).format("HH:mm")

        formData.append("promo_hour_start", format_hour_start);
        formData.append("promo_hour_end", format_hour_end);

        // formData.append("promo_hour_start", values.promo_hour_start);
        // formData.append("promo_hour_end", values.promo_hour_end);

        formData.append("transaction_value", values.transaction_value);
        formData.append("transaction_type", values.transaction_type);
        formData.append("transaction_amount", values.transaction_amount);
  
        if (values.description) formData.append("description", values.description);
        if (photo) {
          formData.append("automaticPromoImage", photo);
        }
  
        try {
          enableLoading();
          await axios.post(`${API_URL}/api/v1/automatic-promo/create-development`, formData);
          disableLoading();
          history.push("/promo/automatic-promo");
        } catch (err) {
          setAlert(err.response?.data.message || err.message);
          disableLoading();
        }
      }
    }
  });

  const formikPromoXY = useFormik({
    initialValues: initialValuePromoXY,
    validationSchema: PromoXYSchema,
    onSubmit: async (values) => {
      if(errorDate) {
        console.log("tanggal akhir harus lebih besar dari tanggal mulai")
      } else { 
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        }
        const API_URL = process.env.REACT_APP_API_URL;
        const formData = new FormData();
  
        formData.append("name", values.name);
        formData.append("type", values.type);
        formData.append("outlet_id", JSON.stringify(values.outlet_id));
        formData.append("description_type", values.description_type);
        formData.append("promo_date_start", values.promo_date_start);
        formData.append("promo_date_end",
         values.promo_date_end);
        formData.append("promo_days", values.promo_days);

        const format_hour_start = dayjs(values.promo_hour_start).format("HH:mm")
        const format_hour_end = dayjs(values.promo_hour_end).format("HH:mm")

        formData.append("promo_hour_start", format_hour_start);
        formData.append("promo_hour_end", format_hour_end);

        // formData.append("promo_hour_start", values.promo_hour_start);
        // formData.append("promo_hour_end", values.promo_hour_end);
        
        formData.append(
          "xy_product_x_id",
          JSON.stringify(values.xy_product_x_id)
        );
        formData.append(
          "xy_product_y_id",
          JSON.stringify(values.xy_product_y_id)
        );
        formData.append("xy_amount_x", values.xy_amount_x);
        formData.append("xy_amount_y", values.xy_amount_y);
        formData.append("xy_apply_multiply", values.xy_apply_multiply);
  
        if (values.description)
          formData.append("description", values.description);
        if (photo) {
          formData.append("automaticPromoImage", photo);
        }
  
        try {
          enableLoading();
          await axios.post(`${API_URL}/api/v1/automatic-promo/create-development`, formData);
          disableLoading();
          history.push("/promo/automatic-promo");
        } catch (err) {
          setAlert(err.response?.data.message || err.message);
          disableLoading();
        }
      }
    }
  });

  const validationPromoQuantity = (fieldname) => {
    if (
      formikPromoQuantity.touched[fieldname] &&
      formikPromoQuantity.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikPromoQuantity.touched[fieldname] &&
      !formikPromoQuantity.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const validationPromoTransaction = (fieldname) => {
    if (
      formikPromoTransaction.touched[fieldname] &&
      formikPromoTransaction.errors[fieldname]
    ) {
      return "is-invalid";
    }

    if (
      formikPromoTransaction.touched[fieldname] &&
      !formikPromoTransaction.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const validationPromoXY = (fieldname) => {
    if (formikPromoXY.touched[fieldname] && formikPromoXY.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikPromoXY.touched[fieldname] && !formikPromoXY.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handlePreviewPhoto = (file) => {
    setAlertPhoto("");

    let preview;
    let img;

    if (file.length) {
      const reader = new FileReader();
      reader.onload = () =>{
        if(reader.readyState === 2){
          console.log("reader.result", reader.result)
          setPhotoPreview(reader.result);
        }
      }
      reader.readAsDataURL(file[0])
      img = file[0];
      console.log("img", img)
      setPhoto(img)
    } else {
      preview = "";
      setAlertPhoto("file is too large or not supported");
    }
  };

  const handlePromoStartDate = (date) => {
    const formatStartDate = dayjs(date).format('YYYY-MM-DD')
    const formatEndDate = dayjs(endDate).format('YYYY-MM-DD')
    const startDateDiff = dayjs(formatStartDate)
    const resultCompare = startDateDiff.diff(formatEndDate, 'day')

    if(resultCompare > 0) {
      setErrorDate(true)
      console.log("silahkan masuk")
    } else {
      setErrorDate(false)
    }

    setStartDate(date);

    if (tabs === "quantity") {
      formikPromoQuantity.setFieldValue(
        "promo_date_start",
        dayjs(date).format("YYYY-MM-DD")
      );
    }

    if (tabs === "transaction") {
      formikPromoTransaction.setFieldValue(
        "promo_date_start",
        dayjs(date).format("YYYY-MM-DD")
      );
    }

    if (tabs === "xy") {
      formikPromoXY.setFieldValue(
        "promo_date_start",
        dayjs(date).format("YYYY-MM-DD")
      );
    }
  };

  const handlePromoEndDate = (date) => {
    const formatStartDate = dayjs(startDate).format('YYYY-MM-DD')
    const formatEndDate = dayjs(date).format('YYYY-MM-DD')
    const endDateDiff = dayjs(formatEndDate)
    const resultCompare = endDateDiff.diff(formatStartDate, 'day')

    if(resultCompare >= 0) {
      setErrorDate(false)
      console.log("silahkan masuk")
    } else {
      setErrorDate(true)
    }

    setEndDate(date);

    if (tabs === "quantity") {
      formikPromoQuantity.setFieldValue(
        "promo_date_end",
        dayjs(date).format("YYYY-MM-DD")
      );
    }

    if (tabs === "transaction") {
      formikPromoTransaction.setFieldValue(
        "promo_date_end",
        dayjs(date).format("YYYY-MM-DD")
      );
    }

    if (tabs === "xy") {
      formikPromoXY.setFieldValue(
        "promo_date_end",
        dayjs(date).format("YYYY-MM-DD")
      );
    }
  };

  const handlePromoDays = (e) => {
    const currWeekdays = { ...weekdays };
    const nameWeekdays = Object.keys(currWeekdays);

    const { name } = e.target;

    if (name === "everyday") {
      nameWeekdays
        .filter((item) => item !== "everyday")
        .forEach((item) => (currWeekdays[item].checked = false));
      currWeekdays.everyday.checked = !currWeekdays.everyday.checked;
    } else {
      currWeekdays[name].checked = !currWeekdays[name].checked;
    }

    const checkedWeekdays = nameWeekdays
      .filter((item) => currWeekdays[item].checked)
      .map((item) => item);

    const indexWeekdays = checkedWeekdays.map((item) =>
      nameWeekdays.indexOf(item)
    );

    setWeekdays(currWeekdays);

    if (tabs === "quantity") {
      formikPromoQuantity.setFieldValue("promo_days", indexWeekdays.join(","));
    }

    if (tabs === "transaction") {
      formikPromoTransaction.setFieldValue(
        "promo_days",
        indexWeekdays.join(",")
      );
    }

    if (tabs === "xy") {
      formikPromoXY.setFieldValue("promo_days", indexWeekdays.join(","));
    }
  };

  const handlePromoHour = (date, value, name) => {
    // const { name, value } = e.target;

    const format_hour = dayjs(date).format()
    // format_hour ("HH:mm")

    if (name === "promo_hour_start") {
      setStartHour(format_hour);

      if (tabs === "quantity") {
        formikPromoQuantity.setFieldValue("promo_hour_start", format_hour);
      }

      if (tabs === "transaction") {
        formikPromoTransaction.setFieldValue("promo_hour_start", format_hour);
      }

      if (tabs === "xy") {
        formikPromoXY.setFieldValue("promo_hour_start", format_hour);
      }
    } else {
      setEndHour(format_hour);

      if (tabs === "quantity") {
        formikPromoQuantity.setFieldValue("promo_hour_end", format_hour);
      }

      if (tabs === "transaction") {
        formikPromoTransaction.setFieldValue("promo_hour_end", format_hour);
      }

      if (tabs === "xy") {
        formikPromoXY.setFieldValue("promo_hour_end", format_hour);
      }
    }
  };

  const handleSelectX = (value) => {
    if (value) {
      const productXId = value.map((item) => item.value);
      formikPromoXY.setFieldValue("xy_product_x_id", productXId);
    } else {
      formikPromoXY.setFieldValue("xy_product_x_id", []);
    }
  };

  const handleSelectY = (value) => {
    if (value) {
      const productYId = value.map((item) => item.value);
      formikPromoXY.setFieldValue("xy_product_y_id", productYId);
    } else {
      formikPromoXY.setFieldValue("xy_product_y_id", []);
    }
  };

  const handleSelectOutlet = (value, formik) => {
    if (value) {
      const outlet = value.map((item) => item.value);
      formik.setFieldValue("outlet_id", outlet);
    } else {
      formik.setFieldValue("outlet_id", []);
    }
  };

  const handleTabs = (value) => {
    setTabs(value);
    formikPromoQuantity.resetForm();
    formikPromoTransaction.resetForm();
    formikPromoXY.resetForm();

    setStartDate(new Date());
    setEndDate(new Date());
    // setStartHour(dayjs().format("HH:mm"));
    // setEndHour(dayjs().format("HH:mm"));
    setStartHour(dayjs().format());
    setEndHour(dayjs().format());

    setWeekdays({
      monday: { checked: false },
      tuesday: { checked: false },
      wednesday: { checked: false },
      thursday: { checked: false },
      friday: { checked: false },
      saturday: { checked: false },
      sunday: { checked: false },
      everyday: { checked: false }
    });

    setPhoto("");
    setPhotoPreview("");
    setAlert("");
    setAlertPhoto("");
  };

  return (
    <Tabs activeKey={tabs} onSelect={handleTabs}>
      <Tab eventKey="quantity" title={t("promoWithMinimumQuantity")}>
        <QuantityTab
          t={t}
          title={t("addNewAutomaticPromo")}
          formikPromo={formikPromoQuantity}
          validationPromo={validationPromoQuantity}
          allProducts={allProducts}
          allOutlets={allOutlets}
          weekdays={weekdays}
          photo={photo}
          photoPreview={photoPreview}
          alert={alert}
          alertPhoto={alertPhoto}
          loading={loading}
          startDate={startDate}
          endDate={endDate}
          startHour={startHour}
          endHour={endHour}
          handlePreviewPhoto={handlePreviewPhoto}
          handlePromoStartDate={handlePromoStartDate}
          handlePromoEndDate={handlePromoEndDate}
          handlePromoDays={handlePromoDays}
          handlePromoHour={handlePromoHour}
          handleSelectOutlet={handleSelectOutlet}
          mode="add"
          errorDate={errorDate}
        />
      </Tab>

      <Tab eventKey="transaction" title={t("promoWithMinimumTranasction")}>
        <TransactionTab
          t={t}
          title={t("addNewAutomaticPromo")}
          formikPromo={formikPromoTransaction}
          validationPromo={validationPromoTransaction}
          allProducts={allProducts}
          allOutlets={allOutlets}
          weekdays={weekdays}
          photo={photo}
          photoPreview={photoPreview}
          alert={alert}
          alertPhoto={alertPhoto}
          loading={loading}
          startDate={startDate}
          endDate={endDate}
          startHour={startHour}
          endHour={endHour}
          handlePreviewPhoto={handlePreviewPhoto}
          handlePromoStartDate={handlePromoStartDate}
          handlePromoEndDate={handlePromoEndDate}
          handlePromoDays={handlePromoDays}
          handlePromoHour={handlePromoHour}
          handleSelectOutlet={handleSelectOutlet}
          mode="add"
          errorDate={errorDate}
        />
      </Tab>

      <Tab eventKey="xy" title={t("buyXGetYPromo")}>
        <XyTab
          t={t}
          title={t("addNewAutomaticPromo")}
          formikPromo={formikPromoXY}
          validationPromo={validationPromoXY}
          allProducts={allProducts}
          allOutlets={allOutlets}
          weekdays={weekdays}
          photo={photo}
          photoPreview={photoPreview}
          alert={alert}
          alertPhoto={alertPhoto}
          loading={loading}
          startDate={startDate}
          endDate={endDate}
          startHour={startHour}
          endHour={endHour}
          handlePreviewPhoto={handlePreviewPhoto}
          handlePromoStartDate={handlePromoStartDate}
          handlePromoEndDate={handlePromoEndDate}
          handlePromoDays={handlePromoDays}
          handlePromoHour={handlePromoHour}
          handleSelectX={handleSelectX}
          handleSelectY={handleSelectY}
          handleSelectOutlet={handleSelectOutlet}
          mode="add"
          errorDate={errorDate}
        />
      </Tab>
    </Tabs>
  );
};
