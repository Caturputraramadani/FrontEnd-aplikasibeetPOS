import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import FormTemplate from "./FormTemplate"
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

import {
  Row,
  Col
} from "react-bootstrap";
const AddGroupCommission = ({location}) => {
  
  const [alert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [listStaffCommission, setListStaffCommission] = React.useState([])
  const [listProduct, setListProduct] = React.useState([])
  const [statusGroup, setStatusGroup] = React.useState("Active")

  const handleStatusGroup = (status) => {
    setStatusGroup(status)
  }
  const { t } = useTranslation();
  const history = useHistory();

  const {
    allOutlets,
    allStaff,
    allProducts
  } = location.state;

  const optionsTypeTotalCommission = [
    {
      value: 0,
      label: "Rupiah"
    },
    {
      value: 1,
      label: "Percentage"
    }
  ]
  
  // console.log("optionsOutlet", optionsOutlet)
  // console.log("allOutlets", allOutlets)

  const initialValueCommission = {
    outlet_id: 0,
    name_group_commission: "",
    type_commission_total: "", //Rupiah atau persentase
    staff_id: [],
    status: "Active",
    commission_type: "product", //Produk atau Nominal
    total_commission: 0,
    nominal_commission: 0,
    product_id: []
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const commissionSchema = Yup.object().shape({
    outlet_id: Yup.number()
      .integer()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseChooseAnOutlet")}`),
    name_group_commission: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputGroupCommission")}`),
    type_commission_total: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(200, `${t("maximum100Character")}`)
      .required(`${t("pleaseInputTypeCommission")}`),
    staff_id: Yup.array()
      .of(Yup.number().min(1))
      .required(`${t("pleaseChooseStaff")}`),
    commission_type: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(200, `${t("maximum100Character")}`),
    total_commission: Yup.number()
      .required(`${t("pleaseInputATotalCommission")}`),
  });

  const formikCommission = useFormik({
    initialValues: initialValueCommission,
    validationSchema: commissionSchema,
    onSubmit: async (values) => {
      // console.log("Data sebelum dikirim", values)
      const API_URL = process.env.REACT_APP_API_URL;
      const data = {
        outlet_id: values.outlet_id,
        product_id: JSON.stringify(values.product_id),
        staff_id: JSON.stringify(values.staff_id),
        name: values.name_group_commission,
        status: values.status,
        commission_type: values.commission_type,
        type_total: values.type_commission_total,
        total: values.total_commission,
      }
      if(values.nominal_commission) {
        data.nominal = values.nominal_commission
      }
      // console.log("persiapan kirim", data)
      try {
        enableLoading();
        await axios.post(`${API_URL}/api/v1/commission`, data);
        history.push("/commission")
        disableLoading();
      } catch (err) {
        setAlert(err.response.data.message);
        disableLoading();
      }
    }
  });

  const validationCommission = (fieldname) => {
    if (formikCommission.touched[fieldname] && formikCommission.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikCommission.touched[fieldname] && !formikCommission.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });

  const optionsStaff = allStaff.map((value) => {
    if(parseInt(value.outlet_id) === formikCommission.values.outlet_id) {
      return value
    } else {
      return ""
    }
  })
  .filter(value => value)
  .map((val) => {
      return {value: val.id, label: val.name}
    }
  )

  const optionsProduct = allProducts.map((value) => {
    if(parseInt(value.outlet_id) === formikCommission.values.outlet_id) {
      return value
    } else {
      return ""
    }
  })
  .filter(value => value)
  .map((val) => {
      return {value: val.id, label: val.name}
    }
  )
  // const 
  // const optionsStaff = allStaff.map((value) => {
  //   if(value.outlet_id === formikCommission.values.outlet_id) {
  //     return value
  //   } else {
  //     return ""
  //   }
  // })
  // .filter(value => value)
  // .map((val) => {
  //     return {value: val.id, label: val.name}
  //   }
  // )

  const handleSelectOutlet = (value, formik) => {
    // console.log("valuenya", value)
    if (value) {
      // console.log("handleSelectOutlet", value)
      const outlet = value.map((item) => item.value);
      formik.setFieldValue("staff_id", outlet);
      const resultListStaff = []
      value.map(item => {
        allStaff.map(item2 => {
          if(item.value === item2.id) {
            resultListStaff.push(item2)
          }
        })
      })
      setListStaffCommission(resultListStaff)
    } else {
      setListStaffCommission([])
      formik.setFieldValue("staff_id", []);
    }
  };

  const handleSelectProduct = (value, formik) => {
    if (value) {
      // console.log("handleSelectProduct", value)
      const outlet = value.map((item) => item.value);
      formik.setFieldValue("product_id", outlet);
      const resultListProduct = []
      value.map(item => {
        allProducts.map(item2 => {
          if(item.value === item2.id) {
            resultListProduct.push(item2)
          }
        })
      })
      setListProduct(resultListProduct)
    } else {
      setListProduct([])
      formik.setFieldValue("product_id", []);
    }
  };

  // console.log("listStaffCommission", listStaffCommission)
  // console.log("listProduct", listProduct)
  return (
    <div>
      <Row>
        <Col>
          <FormTemplate
            statusGroup={statusGroup}
            handleStatusGroup={handleStatusGroup}
            title={t("addGroupCommission")}
            loading={loading}
            validationCommission={validationCommission}
            formikCommission={formikCommission}
            alert={alert}
            optionsOutlet={optionsOutlet}
            optionsStaff={optionsStaff}
            optionsProduct={optionsProduct}
            listStaffCommission={listStaffCommission}
            listProduct={listProduct}
            handleSelectOutlet={handleSelectOutlet}
            handleSelectProduct={handleSelectProduct}
            optionsTypeTotalCommission={optionsTypeTotalCommission}
            t={t}
          />
        </Col>
      </Row>
    </div>
  );
}

export default AddGroupCommission;
