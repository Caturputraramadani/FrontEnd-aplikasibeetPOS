import React, { useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import imageCompression from 'browser-image-compression';
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";

import { ToastContainer, toast } from "react-toastify";

import ModalManageAddons from "./ModalManageAddons";
import ModalSalesType from "./ModalSalesType";

import FormTemplate from "./Form";
import dayjs from "dayjs";

const API_URL = process.env.REACT_APP_API_URL;
export const AddProductPage = ({ location }) => {
  const history = useHistory();
  const {
    allOutlets,
    allCategories,
    allTaxes,
    allMaterials,
    showFeature
  } = location.state;
  const { t } = useTranslation();
  const [hideSelectOutlet, setHideSelectOutlet] = React.useState(false)

  const [photo, setPhoto] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [allSupplier, setAllSupplier] = React.useState([])
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [showManageAddons, setShowManageAddons] = React.useState(false);
  const [photoPreview, setPhotoPreview] = React.useState("");
  const [expiredDate, setExpiredDate] = React.useState("");
  const [hasExpiredDate, setHasExpiredDate] = React.useState(false);
  const [allUnit, setAllUnit] = React.useState([])
  const [defaultWeight, setDefaultWeight] = React.useState("kg")

  const [openSalesType, setOpenSalesType] = React.useState(false)
  const [allSalesTypes, setAllSalesTypes] = React.useState([])

  const [syncEcommerce, setSyncEcommerce] = React.useState([])
  const [thereShowSync, setThereShowSync] = React.useState(false)
  const [allIdDelete, setAllIdDelete] = React.useState([])

  const [savedAddons, setSavedAddons] = React.useState([
    {
      group_name: "",
      group_type: "",
      addons: [
        {
          name: "",
          price: "",
          has_raw_material: false,
          raw_material_id: "",
          quantity: 0,
          unit_id: "",
          status: "active"
        }
      ]
    }
  ]);

  const [savedSalesTypes, setSavedSalesTypes] = React.useState(
    [{
      sales_type_id: "",
      price: 0,
      active: "Active"
    }]
  );
  
  const responseToast = (status, message, position = 'top-right', autoClose = 4500) => {
    if(status === 'success') {
      return toast.success(message, {
        position,
        autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } else if (status === 'error') {
      return toast.error(message, {
        position,
        autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  }

  const initialValueProduct = {
    all_outlet: false,
    outlet_id: "",
    name: "",
    product_category_id: "",
    price: 0,
    price_purchase: 0,
    mark_up_price: "",
    max_quantity: "",
    max_range: "",
    stock: 0,
    product_tax_id: "",
    status: "active",
    supplier_id: "",
    supplier: "",
    barcode: "",
    sku: "",
    is_favorite: false,
    has_raw_material: false,
    raw_material_id: "",
    has_recipe: false,
    has_stock: false,
    recipe_id: "",
    unit_id: "",
    expired_date: "",
    description: "",
    groupAddons: [],
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    sync_ecommerce: [],
    has_assembly: false,
    sell_by_weight: false,
    sales_types: []
  };

  const ProductSchema = Yup.object().shape({
    // outlet_id: Yup.number()
    //   .integer()
    //   .min(1, `${t("minimum1Character")}`)
    //   .required(`${t("pleaseChooseAnOutlet")}`),
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputAProductName")}`),
    product_category_id: Yup.number()
      .integer()
      .min(1, `${t("minimum1Character")}`),
    price: Yup.number()
      .min(1, `${t("minimum1Character")}`)
      .required(`${t("pleaseInputAPrice")}`),
    price_purchase: Yup.number()
      .required(`${t("pleaseInputAPricePurchase")}`),
    stock: Yup.number()
      .integer()
      .min(0)
      .required(`${t("pleaseInputAStock")}`),
    // product_tax_id: Yup.number()
    //   .integer()
    //   .min(1)
    //   .required("Please choose a tax."),
    status: Yup.string()
      .matches(/(active|inactive)/)
      .required(`${t("pleaseInputAStatus")}`),
    supplier_id: Yup.number()
      .integer()
      .min(1, `${t("minimum1Character")}`),
    supplier: Yup.string(),
    // barcode: Yup.string()
    //   .min(3, `${t("minimum3Character")}`)
    //   .max(50, `${t("maximum50Character")}`),
    sku: Yup.string()
      .min(1, `${t("minimum1Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputSku")}`),
    is_favorite: Yup.boolean().required(),
    has_raw_material: Yup.boolean().required(),
    has_recipe: Yup.boolean().required(),
    // has_assembly: Yup.boolean().required(),
    sell_by_weight: Yup.boolean().required(),
    has_stock: Yup.boolean().required(),
    recipe_id: Yup.number().nullable(),
    raw_material_id: Yup.number().nullable(),
    unit_id: Yup.string().nullable(),
    expired_date: Yup.string(),
    description: Yup.string().nullable(),
    groupAddons: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        group_name: Yup.string()
          .min(3, `${t("minimum3Character")}`)
          .max(50, `${t("maximum50Character")}`)
          .required(`${t("pleaseInputGroupName")}`),
        group_type: Yup.string()
          .matches(/single|multi/)
          .required(`${t("pleaseInputGroupType")}`),
        addons: Yup.array().of(
          Yup.object().shape({
            id: Yup.string(),
            name: Yup.string(),
            price: Yup.number().nullable(),
            has_raw_material: Yup.boolean(),
            quantity: Yup.number().nullable(),
            unit_id: Yup.string().nullable(),
            status: Yup.string()
          })
        )
      })
    ),
    sales_types: Yup.array().of(
      Yup.object().shape({
        sales_type_id: Yup.number()
          .integer()
          .min(1, `${t("minimum1Character")}`),
        price: Yup.number()
          .min(1, `${t("minimum1Character")}`)
          .required(`${t("pleaseInputPrice")}`)
      })
    )
  });

  const formikProduct = useFormik({
    initialValues: initialValueProduct,
    validationSchema: ProductSchema,
    onSubmit: async (values) => {

      // fungsi untuk check jika outlet_id nya kosong, ambil salah satu dari semua outlet
      const outlet_id = values.outlet_id ? values.outlet_id : optionsOutlet[0].value

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }

      const formData = new FormData();
      formData.append("outlet_id", outlet_id);
      formData.append("all_outlet", values.all_outlet);
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("price_purchase", values.price_purchase);
      formData.append("stock", values.stock);
      formData.append("is_favorite", values.is_favorite);
      formData.append("has_recipe", values.has_recipe);
      formData.append("has_stock", values.has_stock);
      formData.append("status", values.status);
      formData.append("supplier_id", values.supplier_id);
      formData.append("supplier", values.supplier);

      if(values.mark_up_price) {
        formData.append("mark_up_price", values.mark_up_price);
      }
      if(values.max_quantity) {
        formData.append("max_quantity", values.max_quantity);
      }
      if(values.max_range) {
        formData.append("max_range", values.max_range);
      }

      if (values.groupAddons.length) formData.append("groupAddons", JSON.stringify(values.groupAddons));
      if (values.barcode) formData.append("barcode", values.barcode);
      if (values.sku) formData.append("sku", values.sku);
      if (values.description)
        formData.append("description", values.description);
      if (values.product_category_id)
        formData.append("product_category_id", values.product_category_id);
      if (photo) {
        // dihapus
        // console.log("jika photo dan photo previewnya ada", photo)
        // console.log('originalFile instanceof Blob', photo instanceof Blob)
        // const compressedPhoto = await imageCompression(photo, options)
        // console.log("compressedPhoto", compressedPhoto)
        formData.append("productImage", photo);
      }

      if (values.has_raw_material)
        formData.append("has_raw_material", values.has_raw_material);
      if (values.raw_material_id)
        formData.append("raw_material_id", values.raw_material_id);

      if (values.unit_id) formData.append("unit_id", values.unit_id);
      if (values.expired_date)
        formData.append("expired_date", values.expired_date);
      if (values.recipe_id) formData.append("recipe_id", values.recipe_id);
      if (values.product_tax_id)
        formData.append("product_tax_id", values.product_tax_id);
      if(values.weight) {
        let resultWeight
        if(defaultWeight === 'gram') {
          resultWeight = values.weight / 1000
        } else {
          resultWeight = values.weight
        }
        formData.append("weight", resultWeight);
      }
      
      if (values.length) formData.append("length", values.length)
      if (values.width) formData.append("width", values.width)
      if (values.height) formData.append("height", values.height)
      if (values.has_assembly) formData.append("has_assembly", values.has_assembly)
      if (values.sell_by_weight) formData.append("sell_by_weight", values.sell_by_weight)

      formData.append("sync_ecommerce", JSON.stringify(values.sync_ecommerce))
      
      try {
        enableLoading();
        const {data} = await axios.post(`${API_URL}/api/v1/product/`, formData);
        
        // Proses looping untuk mengubah (Active / Inactive) sales product menjadi true (active) / false (inactive)
        values.sales_types.map(value => {
          value.active = value.active === 'Active' ? true : false
        })

        // Cek dlu apakah sales types nya ada isinya
        if(values.sales_types.length) {
          const data_sales_type_product = {
            product_id: data.data.id,
            items: values.sales_types
          }
          console.log("data_sales_type_product", data_sales_type_product)
          await axios.post(`${API_URL}/api/v1/sales-type-product/create-array`, data_sales_type_product);
        }
        disableLoading();
        responseToast('success', t('successAddProduct'))
        history.push("/product");
      } catch (err) {
        console.log("error", err)
        setAlert(err.response.data.message);
        disableLoading();
        responseToast('error', t('failedAddProduct'))
      }
    }
  });

  const validationProduct = (fieldname) => {
    if (formikProduct.touched[fieldname] && formikProduct.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikProduct.touched[fieldname] && !formikProduct.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const showModalAddons = () => {
    if (!formikProduct.values.groupAddons.length) {
      formikProduct.setFieldValue("groupAddons", savedAddons);
    }
    setShowManageAddons(true);
  };

  const cancelModalAddons = () => {
    // if (!formikProduct.values.groupAddons.length) {
    if (!savedAddons.group_name || !savedAddons.group_type || !savedAddons.addons[0].name || !savedAddons.addons[0].price) {
      formikProduct.setFieldValue("groupAddons", []);
    } else {
      formikProduct.setFieldValue("groupAddons", savedAddons);
    }
    setShowManageAddons(false);
  };

  const saveChangesAddons = (e) => {
    e.preventDefault();
    setSavedAddons(formikProduct.values.groupAddons);
    setShowManageAddons(false);
  };
  const handlePreviewPhoto = (file) => {
    setAlertPhoto("");

    let preview;
    let img;
    console.log("gambarnya", file[0])
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

  const handleDeletePhoto = () => {
    setPhoto("");
    setPhotoPreview("");
  };

  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueOutlet = optionsOutlet.find(
    (val) => val.value === formikProduct.values.outlet_id
  );

  const optionsCategory = allCategories.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueCategory = optionsCategory.find(
    (val) => val.value === formikProduct.values.product_category_id
  );

  const getAllSupplier = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/supplier`)
      setAllSupplier(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const optionsSupplier = allSupplier.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueSupplier = optionsSupplier.find(
    (val) => val.value === formikProduct.values.supplier_id
  );
  useEffect(() => {
    getAllSupplier()
  }, [])
  const optionsUnit = allUnit.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueUnit = (key) =>
    optionsUnit.find((val) => val.value === key);

  const optionsMaterial = allMaterials.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueMaterial = (key) =>
    optionsMaterial.find((val) => val.value === key);

  const handleExpiredDate = (date) => {
    setExpiredDate(date);
    formikProduct.setFieldValue(
      "expired_date",
      dayjs(date).format("YYYY-MM-DD")
    );
  };

  const handleHasExpired = (e) => {
    const { value } = e.target;
    if (value === "false") {
      setHasExpiredDate(true);
      setExpiredDate(new Date());
    } else {
      setHasExpiredDate(false);
      setExpiredDate("");
    }
  };
  const handleAllUnit = async () => {
    const {data} = await axios.get(`${API_URL}/api/v1/unit`) 
    setAllUnit(data.data)
  }
  useEffect(() => {
    console.log("showFeature", showFeature)
    handleAllUnit()
  }, [])

  const handleSelectWeight = (e) => {
    setDefaultWeight(e.target.value)
  }

  const handleOptionSync = async (outlet_id) => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/outlet/credentials/${outlet_id}`)
      console.log("handleOptionSync", data.data)
      formikProduct.setFieldValue("sync_ecommerce", data.data);
      let temp_boolean;
      data.data.map(value => {
        if(value.show) {
          temp_boolean = true
        }
      })

      setThereShowSync(temp_boolean)
      setSyncEcommerce(data.data)
    } catch (error) {
      console.log("error getSyncEcommerce", error) 
    }
  }

  const showModalSalesType = () => {
    if (!formikProduct.values.sales_types.length) {
      formikProduct.setFieldValue("sales_types", savedSalesTypes);
    }
    setOpenSalesType(true)
  }

  const closeModalSalesType = () => {
    if (!savedSalesTypes[0].price) {
      formikProduct.setFieldValue("sales_types", []);
    } else {
      formikProduct.setFieldValue("sales_types", savedSalesTypes);
    }
    setOpenSalesType(false)
  }

  const handleSalesTypes = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/v1/sales-type`)
      setAllSalesTypes(data.data)
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    handleSalesTypes()
  }, [])

  const optionsSalesTypes = allSalesTypes
    .map((item) => {
      return {
        value: item.id,
        label: item.name
      }
    })
    .filter((item) => item);

   const defaultValueSalesTypes = (key) =>
   optionsSalesTypes.find((val) => val.value === key);

  const saveChangesSalesTypes = (e) => {
    e.preventDefault();
    
    // Check duplicate sales type product id
    const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index)
    const get_sales_type_id = formikProduct.values.sales_types.map(value => {
      return value.sales_type_id
    } ) 
    console.log("get_sales_type_id", get_sales_type_id)
    const temp_check = findDuplicates(get_sales_type_id)

    console.log("temp_check", temp_check)
    console.log("formikProduct.values.sales_types", formikProduct.values.sales_types)

    if(temp_check.length > 0) {
      toast.warn(t('theTypeOfSaleCannotBeTheSame'), {
        position: "top-right",
        autoClose: 4500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      return
    }
    // End Check Duplicate

    console.log("Jika tidak duplikat")

    setSavedSalesTypes(formikProduct.values.sales_types);
    setOpenSalesType(false);
  };
  
  const handleActiveSalesType = async (params, index, formik) => {
    try {
      formik.setFieldValue(`sales_types[${index}].active`, params)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteArayHelper = (id) => {
    const temp_id = allIdDelete
    temp_id.push(id)
    setAllIdDelete(temp_id)
    console.log("temp_id", temp_id)
  }

  const handleSetAlert = () => setAlert('')

  return (
    <Row>
      <ModalManageAddons
        title={`${t("addProductAddonsFor")} - ${formikProduct.values.name}`}
        showManageAddons={showManageAddons}
        cancelModalAddons={cancelModalAddons}
        saveChangesAddons={saveChangesAddons}
        formikProduct={formikProduct}
        optionsMaterial={optionsMaterial}
        optionsUnit={optionsUnit}
        defaultValueMaterial={defaultValueMaterial}
        defaultValueUnit={defaultValueUnit}
      />

      <ModalSalesType
        title={`${t("addProductSalesType")} - ${formikProduct.values.name}`}
        closeModalSalesType={closeModalSalesType}
        openSalesType={openSalesType}
        formikProduct={formikProduct}
        savedSalesTypes={savedSalesTypes}
        optionsSalesTypes={optionsSalesTypes}
        initialValueProduct={initialValueProduct}
        saveChangesSalesTypes={saveChangesSalesTypes}
        defaultValueSalesTypes={defaultValueSalesTypes}
        handleActiveSalesType={handleActiveSalesType}
        handleDeleteArayHelper={handleDeleteArayHelper}
      />

      <Col>
        <FormTemplate
          title={t("addProduct")}
          loading={loading}
          allTaxes={allTaxes}
          alertPhoto={alertPhoto}
          photoPreview={photoPreview}
          photo={photo}
          handlePreviewPhoto={handlePreviewPhoto}
          showModalAddons={showModalAddons}
          formikProduct={formikProduct}
          validationProduct={validationProduct}
          alert={alert}
          handleDeletePhoto={handleDeletePhoto}
          optionsOutlet={optionsOutlet}
          optionsCategory={optionsCategory}
          optionsUnit={optionsUnit}
          optionsSupplier={optionsSupplier}
          defaultValueSupplier={defaultValueSupplier}
          defaultValueOutlet={defaultValueOutlet}
          defaultValueCategory={defaultValueCategory}
          defaultValueUnit={defaultValueUnit}
          expiredDate={expiredDate}
          handleExpiredDate={handleExpiredDate}
          hasExpiredDate={hasExpiredDate}
          handleHasExpired={handleHasExpired}
          showFeature={showFeature}
          handleSelectWeight={handleSelectWeight}
          defaultWeight={defaultWeight}
          handleOptionSync={handleOptionSync}
          syncEcommerce={syncEcommerce}
          thereShowSync={thereShowSync}
          showModalSalesType={showModalSalesType}
          handleSetAlert={handleSetAlert}
          setHideSelectOutlet={setHideSelectOutlet}
          hideSelectOutlet={hideSelectOutlet}
        />
      </Col>
    </Row>
  );
};
