import React, {useEffect} from "react";
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
const EditGroupCommission = ({location, match}) => {
  
  const API_URL = process.env.REACT_APP_API_URL;
  // const [allOutlets, setAllOutlets] = React.useState([])
  // const [allProducts, setAllProducts] = React.useState([])
  // const [allStaff, setAllStaff] = React.useState([])
  const [currCommission, setCurrCommission] = React.useState([])
  const [alert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [listStaffCommission, setListStaffCommission] = React.useState([])
  const [listProduct, setListProduct] = React.useState([])
  const { t } = useTranslation();
  const history = useHistory();
  const [statusGroup, setStatusGroup] = React.useState("Active")

  const handleStatusGroup = (status) => {
    setStatusGroup(status)
  }
  const {
    product_id,
    staff_id,
    outlet_id,
    type_total,
    type,
    allStaff,
    allOutlets,
    allProducts
  } = location.state;
  // console.log("bismillah", location.state)
  const commission_id = match.params.commissionId;

  // console.log("commission_id", commission_id)

  const getCurrentCommission = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/commission/${commission_id}`)
      // console.log("curr Commission", data.data)
      setStatusGroup(data.data.status)
      setCurrCommission(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getOutlets = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/outlet`)
      // console.log("all outlet", data.data)
      // setAllOutlets(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getStaff = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/staff`)
      // console.log("all staff", data.data)
      // setAllStaff(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getProducts = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/product`)
      // setAllProducts(data.data)
    } catch (error) {
      console.log(error)
    }
  }

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

  // const default =

  // console.log("currCommission staff_id", )
  // console.log("cek product_id", product_id)
  const initialValueCommission = {
    outlet_id,
    name_group_commission: currCommission.name,
    type_commission_total: type_total, //Rupiah atau persentase
    staff_id: JSON.parse(staff_id),
    status: currCommission.status,
    commission_type: type, //Produk atau Nominal
    total_commission: currCommission.total,
    nominal_commission: currCommission.nominal,
    product_id: product_id === 0 ? [] : JSON.parse(product_id)
  };


  // console.log("currCommission", currCommission)
  // console.log("initialValueCommission", initialValueCommission)

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  // const commissionSchema = Yup.object().shape({
  //   outlet_id: Yup.number()
  //     .integer()
  //     .min(1, `${t("minimum1Character")}`)
  //     .required(`${t("pleaseChooseAnOutlet")}`),
  //   name_group_commission: Yup.string()
  //     .min(3, `${t("minimum3Character")}`)
  //     .max(50, `${t("maximum50Character")}`)
  //     .required(`${t("pleaseInputGroupCommission")}`),
  //   type_commission_total: Yup.string()
  //     .min(3, `${t("minimum3Character")}`)
  //     .max(200, `${t("maximum100Character")}`)
  //     .required(`${t("pleaseInputTypeCommission")}`),
  //   staff_id: Yup.array()
  //     .of(Yup.number().min(1))
  //     .required(`${t("pleaseChooseStaff")}`),
  //   status: Yup.string()
  //     .matches(/(active|inactive)/),
  //   commission_type: Yup.string()
  //     .min(3, `${t("minimum3Character")}`)
  //     .max(200, `${t("maximum100Character")}`),
  //   total_commission: Yup.number()
  //     .required(`${t("pleaseInputATotalCommission")}`),
  // });

  const formikCommission = useFormik({
    enableReinitialize: true,
    initialValues: initialValueCommission,
    // validationSchema: commissionSchema,
    onSubmit: async (values) => {
      // console.log("Data sebelum diedit", values)
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
      // console.log("persiapan edit data", data)
      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/commission/${commission_id}`, data);
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
  // console.log("outlet id nya bree", formikCommission.values.outlet_id)


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

  const defaultValueStaff = formikCommission.values.staff_id.map((item) => {
    return optionsStaff.find((val) => val.value === item);
  });

  const defaultCommissionType = optionsTypeTotalCommission.find(
    (value) => value.label === type_total )

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

  const defaultValueProduct = formikCommission.values.product_id.map((item) => {
    return optionsProduct.find((val) => val.value === item);
  });

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
  

  const handleListStaffCommission = () => {
    const resultListStaff = []
    defaultValueStaff.map(item => {
      allStaff.map(item2 => {
        if(item.value === item2.id) {
          resultListStaff.push(item2)
        }
      })
    })
    // console.log("pertama di render", resultListStaff)
    setListStaffCommission(resultListStaff)
  }
  // console.log("defaultValueProduct", defaultValueProduct)

  const handleListProduct = () => {
    const resultListProduct = []
    defaultValueProduct.map(item => {
      allProducts.map(item2 => {
        if(item.value === item2.id) {
          resultListProduct.push(item2)
        }
      })
    })
    // console.log("pertama di render product", resultListProduct)
    setListProduct(resultListProduct)
  }

  useEffect(() => {
    handleListProduct()
    handleListStaffCommission()
    getCurrentCommission()
    getOutlets()
    getStaff()
    getProducts()
  }, [])

  return (
    <div>
      <Row>
        <Col>
          <FormTemplate
            statusGroup={statusGroup}
            handleStatusGroup={handleStatusGroup}
            title={t("editGroupCommission")}
            loading={loading}
            validationCommission={validationCommission}
            formikCommission={formikCommission}
            alert={alert}
            optionsOutlet={optionsOutlet}
            optionsStaff={optionsStaff}
            defaultValueStaff={defaultValueStaff}
            optionsProduct={optionsProduct}
            defaultValueProduct={defaultValueProduct}
            listStaffCommission={listStaffCommission}
            listProduct={listProduct}
            handleSelectOutlet={handleSelectOutlet}
            handleSelectProduct={handleSelectProduct}
            optionsTypeTotalCommission={optionsTypeTotalCommission}
            defaultCommissionType={defaultCommissionType}
            t={t}
          />
        </Col>
      </Row>
    </div>
  );
}

export default EditGroupCommission;
