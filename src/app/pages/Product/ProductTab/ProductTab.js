import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { ExcelRenderer } from "react-excel-renderer";
import dayjs from "dayjs";
import Select from "react-select";
import NumberFormat from 'react-number-format'

import {
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  InputGroup,
  ButtonGroup,
  ListGroup
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import {
  Switch,
  FormGroup,
  FormControl,
  FormControlLabel,
  Paper
} from "@material-ui/core";
import { Search, MoreHoriz, Delete } from "@material-ui/icons";

import rupiahFormat from "rupiah-format";
import useDebounce from "../../../hooks/useDebounce";

import ConfirmModal from "../../../components/ConfirmModal";
import ImportModalAdd from "./ImportModal";
import ImportModalEdit from "./ImportModalEdit";
import ImportModalAddons from "./ImportModalAddons";
import ImportModalAddonsEdit from "./ImportModalAddonsEdit";

import ExportModal from "./ExportModal"
import ExportModalAddons from "./ExportModalAddons"

import ModalSyncBlibli from "./ModalSyncBlibli";
import LogoSync from "../../../../images/cloud-sync-100.png"
import { ToastContainer, toast } from "react-toastify"
import "../../style.css";;

toast.configure();
const ProductTab = ({
  t,
  refresh,
  handleRefresh,
  allCategories,
  allOutlets,
  allTaxes,
  allUnit,
  allMaterials,
  userInfo
}) => {
  const [loading, setLoading] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showConfirmBulk, setShowConfirmBulk] = React.useState(false);
  const [stateImportAdd, setStateImportAdd] = React.useState(false);
  const [stateImportEdit, setStateImportEdit] = React.useState(false);
  const [stateImportAddons, setStateImportAddons] = React.useState(false);
  const [stateImportAddonsEdit, setStateImportAddonsEdit] = React.useState(false);
  
  const [stateExport, setStateExport] = React.useState(false);
  const [stateExportAddons, setStateExportAddons] = React.useState(false);

  const [stateModalSyncBlibli, setStateModalSyncBlibli] = React.useState(false);
  const [productOfOutlet, setProductOfOutlet] = React.useState([])
  const [integratedName, setIntegratedName] = React.useState({
    shopee: false,
    blibli: false,
    show_sync_product: false
  })
  const [outletIntegratedShopee, setOutletIntegratedShopee] = React.useState([])
  const [outletIntegratedBlibli, setOutletIntegratedBlibli] = React.useState([])

  const [dataBusiness, setDataBusiness] = React.useState({})

  const [alert, setAlert] = React.useState("");
  const [filename, setFilename] = React.useState("");
  const [outletProduct, setOutletProduct] = React.useState([])
  const [dataProduct, setDataProduct] = React.useState([])
  const [dataAddonsProduct, setDataAddonsProduct] = React.useState([])
  
  const [dataAddons, setDataAddons] = React.useState([])
  const [currency, setCurrency] = React.useState("")

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState({
    category: "",
    status: "",
    outlet: ""
  });

  const [allProducts, setAllProducts] = React.useState([]);
  const [product, setProduct] = React.useState({
    id: "",
    name: ""
  });

  const [multiSelect, setMultiSelect] = React.useState(false);
  const [clearRows, setClearRows] = React.useState(true);
  const [selectedData, setSelectedData] = React.useState([]);

  const [showFeature, setShowFeature] = React.useState({
    supplier: false,
    expired: false,
    recipe: false,
    has_assembly: false
  })
  const [subscriptionType, setSubscriptionType] = React.useState(null)

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleOutletProduct = (data) => {
    var uniqueArray = [];
    for(let i = 0; i < data.length; i++){
      if(uniqueArray.indexOf(data[i].Outlet.name) === -1) {
        uniqueArray.push(data[i].Outlet.name);
      }
    }
    setOutletProduct(uniqueArray)
  }

  const handleExports = (data) => {
    if (data) {
      const result = []
      allProducts.map((value) => {
        data.map(value2 => {
          if (value.Outlet.name === value2.label) {
            result.push(value)
          }
        })
      })
      setDataProduct(result)
    } else {
      setDataProduct([])
    }
  }

  const handleExportsAddons = (data) => {
    if (data) {
      const product_outlet = []
      allProducts.map((value) => {
        data.map(value2 => {
          if (value.Outlet.name === value2.label) {
            product_outlet.push(value)
          }
        })
      })
      console.log("product_outlet", product_outlet)
      const result = []
      product_outlet.map(value => {
        if(value.Group_Addons.length) {
          let group_name, group_type, addon_name, price, status_addon
          const sku_product = value.sku
          const name_product = value.name

          value.Group_Addons.map((value2, index) => {
            let temp_addon_name, temp_price, temp_status_addon
      
            if(group_name) {
              group_name += `|${value2.name}`
            } else {
              group_name = value2.name
            }
      
            if(group_type) {
              group_type += `|${value2.type}`
            } else {
              group_type = value2.type
            }
      
            if(value2.Addons) {
              value2.Addons.map(value3 => {
                if(temp_addon_name) {
                  temp_addon_name += `,${value3.name}`
                } else {
                  temp_addon_name = value3.name
                }
                
                if(temp_price) {
                  temp_price += `,${value3.price}`
                } else {
                  temp_price = value3.price
                }
      
      
                if(temp_status_addon) {
                  temp_status_addon += `,${value3.status}`
                } else {
                  temp_status_addon = value3.status
                }
              })
            }
      
            if(addon_name) {
              addon_name += `|${temp_addon_name}`
            } else {
              addon_name = temp_addon_name
            }
      
            if(price) {
              price += `|${temp_price}`
            } else {
              price = temp_price
            }
      
            if(status_addon) {
              status_addon += `|${temp_status_addon}`
            } else {
              status_addon = temp_status_addon
            }
      
          })
          result.push({
            name_product: name_product,
            sku_product: sku_product,
            group_name: group_name,
            group_type: group_type,
            addon_name: addon_name,
            price: `"${price}"`,
            status_addon: status_addon
          })
        }
        return true
      })
      console.log("result",result)
      setDataProduct(product_outlet)
      setDataAddonsProduct(result)
    } else {
      setDataProduct([])
      setDataAddonsProduct([])
    }
  }

  const avoidExport = () => {
    setTimeout(() => {
      setDataProduct([])
    }, 2000);
  }

  const showConfirmBulkModal = (data) => {
    if (!data.length) {
      return handleMode();
    }
    setShowConfirmBulk(true);
  };
  const closeConfirmBulkModal = () => {
    handleMode();
    setShowConfirmBulk(false);
  };

  const showConfirmModal = (data) => {
    setProduct({ id: data.id, name: data.name });
    setShowConfirm(true);
  };
  const closeConfirmModal = () => setShowConfirm(false);

  const debouncedSearch = useDebounce(search, 1000);

  const getProduct = async (search, filter) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filterProduct = `?name=${search}&product_category_id=${filter.category}&outlet_id=${filter.outlet}&status=${filter.status}`;

    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/product/back-office${filterProduct}`
        // `${API_URL}/api/v1/product${filterProduct}`
      );
      data.data.map(value => {
        if(value.Sales_Type_Products) {
          value.Sales_Type_Products.map(value2 => {
            value2.active = value2.active ? "Active" : "Inactive"
          })
        }
      })
      setAllProducts(data.data);
      handleOutletProduct(data.data)
    } catch (err) {
      setAllProducts([]);
    }
  };

  const handleCurrency = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    const {data} = await axios.get(`${API_URL}/api/v1/business/${userInfo.business_id}`)
    setCurrency(data.data.Currency.name)
    setDataBusiness(data.data)
  }

  
  const handleSubscriptionPartition = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`
      );

      let supplier;
      let recipe;
      let expired;
      let has_assembly;

      if(data.data[0].subscription_partition_id === 3) {
        supplier = true
        recipe = true
        expired = true
        has_assembly = true
      }
      if(data.data[0].subscription_partition_id === 2) {
        supplier = true
        recipe = false
        expired = true
        has_assembly = false
      }
      if(data.data[0].subscription_partition_id === 1) {
        supplier = false
        recipe = false
        expired = false
        has_assembly = false
      }
      setSubscriptionType(data.data[0].subscription_partition_id)
      setShowFeature({
        supplier,
        expired,
        recipe,
        has_assembly
      })
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    handleSubscriptionPartition()
    handleCurrency()
  }, [])

  React.useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    getProduct(debouncedSearch, filter);
    return () => { isMounted = false }; // use effect cleanup to set flag false, if unmounted
  }, [refresh, debouncedSearch, filter]);

  const handleMode = () => {
    setSelectedData([]);
    setMultiSelect((state) => !state);
    setClearRows((state) => !state);
  };

  const handleSelected = (state) => {
    setSelectedData(state.selectedRows);
  };

  const handleBulkDelete = async (data) => {
    if (!data.length) {
      return handleMode();
    }

    const API_URL = process.env.REACT_APP_API_URL;
    const product_id = data.map((item) => item.id);

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/product/bulk-delete`, {
        data: { product_id }
      });
      disableLoading();
      handleRefresh();
      closeConfirmBulkModal();
      responseToast('success', t('successDeleteProduct'))
    } catch (err) {
      console.log(err);
      responseToast('error', t('failedDeleteProduct'))
      disableLoading();
      closeConfirmBulkModal();
    }
  };

  const handleChangeStatus = async (id) => {
    let currentStatus;

    const edited = allProducts.map((item) => {
      if (item.id === id) {
        if (item.status === "active") {
          item.status = "inactive";
          currentStatus = "inactive";
        } else {
          item.status = "active";
          currentStatus = "active";
        }
      }

      return item;
    });

    const API_URL = process.env.REACT_APP_API_URL;
    try {
      await axios.patch(`${API_URL}/api/v1/product/status/${id}`, {
        status: currentStatus
      });
      responseToast('success', t('successChangeProductStatus'))
    } catch (err) {
      console.log(err);
      responseToast('error', t('failedChangeProductStatus'))
    }

    setAllProducts(edited);
  };

  const handleSearch = (e) => setSearch(e.target.value);
  const handleFilter = (e) => {
    const { name, value } = e.target;
    const filterData = { ...filter };
    filterData[name] = value;
    setFilter(filterData);
  };

  const productData = (data) => {
    if (!data.length) {
      return;
    }

    return data.map((item, index) => {
      const groupAddons = item.Group_Addons.map((group) => {
        return {
          id: group.id,
          group_name: group.name,
          group_type: group.type,
          addons: group.Addons.map((addon) => {
            return {
              id: addon.id,
              name: addon.name,
              price: addon.price,
              has_raw_material: addon.has_raw_material,
              raw_material_id: addon.raw_material_id,
              quantity: addon.quantity,
              unit_id: addon.unit_id,
              status: addon.status
            };
          })
        };
      });

      const bundleItems = [];
      let initial_stock_id;
      if (item.has_stock) {
        if (item.Stocks.length) {
          const currStock = item.Stocks.find((val) => val.is_initial);

          if (currStock) {
            initial_stock_id = currStock.id;

            for (const bundle of currStock.Product_Bundle) {
              bundleItems.push({
                id: bundle.id,
                stock_id: bundle.stock_child_id,
                // quantity: bundle.quantity,
                base_system_price: bundle.Bundle_Items.Product.price,
                system_price: bundle.Bundle_Items.Product.price
                // system_price:
                //   bundle.Bundle_Items.Product.price * bundle.quantity,
                // max_quantity: bundle.Bundle_Items.stock
              });
            }
          }
        }
      }
      return {
        id: item.id,
        no: index + 1,
        name: item.name,
        category: item.Product_Category ? item.Product_Category.name : "-",
        // purchase_price: item.price_purchase
        //   ? rupiahFormat.convert(item.price_purchase)
        //   : rupiahFormat.convert(0),
        price: <NumberFormat value={item.price} displayType={'text'} thousandSeparator={true} prefix={currency} />,
        sku: item.sku,
        stock: item.stock,
        outlet: item.Outlet?.name,
        all_outlet: item.all_outlet,
        unit: item.Unit?.name || "-",
        status: item.status,
        currProduct: item,
        groupAddons,
        bundleItems,
        initial_stock_id,
        sales_types: item.sales_types
      };
    });
  };
  const handleOptionsOutlet = () => {
    const uniqueArray = [];
    allProducts.map(value => {
      if(uniqueArray.indexOf(value.Outlet.name) === -1) {
        uniqueArray.push(value.Outlet.name);
      }
    })
    const result = []
    allOutlets.map(value => {
      uniqueArray.map(value2 => {
        if(value.name === value2) {
          result.push(value)
        }
      })
    })
    return result
  }
  const tempOptionOutlet = handleOptionsOutlet()

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

  const optionsOutlet = tempOptionOutlet.map((item) => {
    return { value: item.id, label: item.name };
  });
  const columns = [
    {
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "70px",
      grow: 1
    },
    {
      name: `${t("titleTabProduct")}`,
      selector: "name",
      sortable: true,
      wrap: true,
      grow: 4
    },
    {
      name: `${t("category")}`,
      selector: "category",
      sortable: true,
      grow: 2
    },
    {
      name: `${t("price")}`,
      selector: "price",
      sortable: true,
      grow: 3
    },
    {
      name: `${t("outlet")}`,
      cell: (row) => {
        return (
          <div>
            {row.all_outlet ? t('allOutlet') : row.outlet}
          </div>
        )
      },
      sortable: true,
      wrap: true,
      grow: 4
    },
    // {
    //   name: `${t("stock")}`,
    //   selector: "stock",
    //   sortable: true,
    //   grow: 1
    // },
    // {
    //   name: `${t("unit")}`,
    //   selector: "unit",
    //   sortable: true,
    //   grow: 2
    // },
    {
      name: `${t("status")}`,
      grow: 1,
      cell: (rows) => {
        return (
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value={rows.status}
                control={
                  <Switch
                    color="primary"
                    checked={rows.status === "active" ? true : false}
                    onChange={() => handleChangeStatus(rows.id)}
                    name=""
                  />
                }
              />
            </FormGroup>
          </FormControl>
        );
      }
    },
    {
      name: `${t("actions")}`,
      grow: 1,
      cell: (rows) => {
        console.log("data yang akan di edit", rows)
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>

              <Link
                to={{
                  pathname: rows.currProduct.is_bundle
                    ? `/product-bundle/${rows.id}`
                    : `/product/${rows.id}`,
                  state: {
                    allOutlets,
                    allCategories,
                    allTaxes,
                    allUnit,
                    allMaterials,
                    allProducts,
                    currProduct: rows.currProduct,
                    groupAddons: rows.groupAddons,
                    bundleItems: rows.bundleItems,
                    initial_stock_id: rows.initial_stock_id,
                    showFeature
                  }
                }}
              >
                <Dropdown.Item as="button">{t("edit")}</Dropdown.Item>
              </Link>
              <Dropdown.Item as="button" onClick={() => showConfirmModal(rows)}>
                {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  const handleDelete = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/product/${product.id}`);
      handleRefresh();
      disableLoading();
      closeConfirmModal();
      responseToast('success', t('successDeleteProduct'))
    } catch (err) {
      console.log(err);
      responseToast('error', t('failedDeleteProduct'))
      disableLoading();
      closeConfirmModal();
    }
  };

  const initialValueImportProductAdd = {
    outlet_id: [],
    products: [
      {
        outlet: "",
        name: "",
        category: "",
        price: 0,
        price_purchase: 0,
        description: "",
        status: false,
        is_favorite: false,
        sku: 0,
        barcode: 0,
        pajak: 0,
        with_recipe: false,
        stok_awal: 0
      }
    ]
  };

  const initialValueImportProductEdit = {
    outlet_id: [],
    products: [
      {
        outlet: "",
        name: "",
        category: "",
        price: 0,
        price_purchase: 0,
        description: "",
        status: false,
        is_favorite: false,
        sku: 0,
        barcode: 0,
        pajak: 0,
        with_recipe: false,
        stok_awal: 0
      }
    ]
  };

  const initialValueImportAddons = {
    outlet_id: [],
    groupAddons: []
  };

  const initialValueImportAddonsEdit = {
    outlet_id: [],
    groupAddons: []
  };

  const formikImportProductAdd = useFormik({
    initialValues: initialValueImportProductAdd,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        if (!values.outlet_id.length) {
          throw new Error(`${t("pleaseChooseOutlet")}`);
        }

        // console.log("values.products", values.products)
        const merged = values.outlet_id.map((item) => {
          const output = [];
          for (const [index, val] of values.products.entries()) {
            // if(val.name && val.sku) {
            if(true) {
              if(!val.price) throw new Error(t('thereIsProductWithoutPrice'));
              if(!val.category) throw new Error(t('thereIsProductWithoutCategory'));

              // Fungsi untuk check price & price purchase apakah ada prefix currency  e.g Rp. 12.000
              const get_prefix_price = val.price.toString().split(" ")
              if(get_prefix_price.length > 1) {
                const get_price = get_prefix_price[1].replace(/\,/g,'')
                values.products[index].price = parseInt(get_price)
              }
              const get_prefix_price_purchase = val.price_purchase.toString().split(" ")
              if(get_prefix_price_purchase.length > 1) {
                const get_price_purchase = get_prefix_price_purchase[1].replace(/\,/g,'')
                values.products[index].price_purchase = parseInt(get_price_purchase)
              }

              const obj = {
                ...val,
                outlet_id: item,
                stock: val.stock === "-" ? 0 : val.stock,
                expired_date: val.expired_date !== "-"
                  ? dayjs(val.expired_date)
                      .subtract(1, "days")
                      .format("YYYY-MM-DD")
                  : ""
              };

              // Jika sku nya selain "-" atau kosong, maka diisi sesuai sku yg di masukkan
              obj.sku = obj.sku ? obj.sku : obj.sku === '-' ? '-' : '-'

              // if (!val.barcode) delete obj.barcode;
              // if (!val.category) delete obj.category;
              if (!val.with_recipe) delete obj.with_recipe;
              if (!val.stock) delete obj.stock;
              if (!val.unit) delete obj.unit;
              if (!val.expired_date) delete obj.expired_date;
              output.push(obj);
            }
            // else 
            // {
            //   console.log("SKU atau Nama produk tidak ada")
            //   throw new Error(t('thereIsProductWithoutNameOrSku'));
            // }
          }
          return output;
        });
        enableLoading();
        for (const item of merged.flat(1)) {
          if (!item.name) {
            throw new Error("there is product without name");
          }
          // if (!item.sku) {
          //   throw new Error("there is product without sku");
          // }
        }
        console.log("product nya", merged.flat(1))
        await axios.post(`${API_URL}/api/v1/product/bulk-create`, {
          products: merged.flat(1)
        });
        disableLoading();
        handleRefresh();
        handleCloseImportAdd();
        responseToast('success', t('successImportAddProduct'))
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
        responseToast('error', t('failedImportAddProduct'))
      }
    }
  });

  const formikImportProductEdit = useFormik({
    initialValues: initialValueImportProductEdit,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      try {
        if (!values.outlet_id.length) {
          throw new Error(`${t("pleaseChooseOutlet")}`);
        }

        console.log("values.products", values.products)

        const merged = values.outlet_id.map((item) => {
          const output = [];
          for (const [index, val] of values.products.entries()) {
            // if(val.name && val.sku) {
            if(true) {
              if(!val.price_purchase) throw new Error(t('thereIsProductWithoutPrice'));
              if(!val.category) throw new Error(t('thereIsProductWithoutCategory'));

              // Fungsi untuk check price & price purchase apakah ada prefix currency  e.g Rp. 12.000
              const get_prefix_price = val.price.toString().split(" ")
              if(get_prefix_price.length > 1) {
                const get_price = get_prefix_price[1].replace(/\,/g,'')
                values.products[index].price = parseInt(get_price)
              }
              const get_prefix_price_purchase = val.price_purchase.toString().split(" ")
              if(get_prefix_price_purchase.length > 1) {
                const get_price_purchase = get_prefix_price_purchase[1].replace(/\,/g,'')
                values.products[index].price_purchase = parseInt(get_price_purchase)
              }
              
              const obj = {
                ...val,
                outlet_id: item,
                stock: val.stock === "-" ? 0 : val.stock,
                expired_date: val.expired_date !== '-'
                  ? dayjs(val.expired_date)
                      .subtract(1, "days")
                      .format("YYYY-MM-DD")
                  : ""
              };

              // Jika sku nya selain "-" atau kosong, maka diisi sesuai sku yg di masukkan
              obj.sku = obj.sku ? obj.sku : obj.sku === '-' ? '-' : '-'

              // if (!val.barcode) delete obj.barcode;
              // if (!val.category) delete obj.category;
              if (!val.with_recipe) delete obj.with_recipe;
              // if (!val.stock) delete obj.stock;
              if (!val.unit) delete obj.unit;
              if (!val.expired_date) delete obj.expired_date;
              output.push(obj);
            } 
            // else 
            // {
            //   console.log("SKU atau Nama produk tidak ada")
            //   throw new Error(t('thereIsProductWithoutNameOrSku'));
            // }
          }
          return output;
        });
        console.log("merged", merged)
        enableLoading();
        for (const item of merged.flat(1)) {
          if (!item.name) {
            throw new Error("there is product without name");
          }
          // if (!item.sku) {
          //   throw new Error("there is product without sku");
          // }
        }
        console.log("product update nya", merged.flat(1))
        await axios.put(`${API_URL}/api/v1/product/bulk-update`, {
          products: merged.flat(1)
        });
        disableLoading();
        handleRefresh();
        handleCloseImportEdit();
        responseToast('success', t('successImportUpdateProduct'))
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
        responseToast('error', t('failedImportUpdateProduct'))
        disableLoading();
        handleCloseImportEdit();
      }
    }
  });

  const formikImportAddons = useFormik({
    initialValues: initialValueImportAddons,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        if (!values.outlet_id.length) {
          throw new Error(`${t("pleaseChooseOutlet")}`);
        }
        const data = {
          outlet_id: JSON.stringify(values.outlet_id),
          groupAddons: JSON.stringify(values.groupAddons)
        }

        enableLoading();
        await axios.post(`${API_URL}/api/v1/addons/bulk-create`, data);
        disableLoading();
        handleRefresh();
        handleCloseImportAddons();
        responseToast('success', t('successImportAddAddons'))
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
        responseToast('error', t('failedImportAddAddons'))
      }
    }
  });

  const formikImportAddonsEdit = useFormik({
    initialValues: initialValueImportAddonsEdit,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        if (!values.outlet_id.length) {
          throw new Error(`${t("pleaseChooseOutlet")}`);
        }
        const data = {
          outlet_id: JSON.stringify(values.outlet_id),
          groupAddons: JSON.stringify(values.groupAddons)
        }

        enableLoading();
        await axios.post(`${API_URL}/api/v1/addons/bulk-create`, data);
        disableLoading();
        handleRefresh();
        handleCloseImportAddons();
        responseToast('success', t('successImportEditAddons'))
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
        responseToast('error', t('failedImportEditAddons'))
      }
    }
  });

  const handleOpenImportAdd = () => setStateImportAdd(true);
  const handleOpenImportEdit = () => setStateImportEdit(true);
  const handleOpenImportAddons = () => setStateImportAddons(true);
  const handleOpenImportAddonsEdit = () => setStateImportAddonsEdit(true);

  const handleCloseImportAdd = () => {
    setStateImportAdd(false);
    setFilename("");
    setAlert("")
    formikImportProductAdd.setFieldValue("outlet_id", []);
    formikImportProductAdd.setFieldValue("products", []);
  };
  const handleCloseImportEdit = () => {
    setStateImportEdit(false);
    setFilename("");
    setAlert("")
    formikImportProductEdit.setFieldValue("outlet_id", []);
    formikImportProductEdit.setFieldValue("products", []);
  };
  const handleCloseImportAddons = () => {
    setStateImportAddons(false);
    setFilename("");
    setAlert("")
    formikImportAddons.setFieldValue("outlet_id", []);
    formikImportAddons.setFieldValue("groupAddons", []);
  };
  const handleCloseImportAddonsEdit = () => {
    setStateImportAddonsEdit(false);
    setFilename("");
    setAlert("")
    formikImportAddonsEdit.setFieldValue("outlet_id", []);
    formikImportAddonsEdit.setFieldValue("groupAddons", []);
  };

  const handleCloseExport = () => {
    setStateExport(false);
    setDataProduct([])
  };

  const handleCloseExportAddons = () => {
    setStateExportAddons(false);
    setDataAddons([])
  };

  const handleCloseModalSyncBlibli = () => {
    setStateModalSyncBlibli(false);
    setDataProduct([])
  };
  const getJsDateFromExcel = (excelDate) => {
    return new Date((excelDate - (25567 + 1)) * 86400 * 1000);
  };

  const handleFileAdd = (file) => {
    setFilename(file[0].name);
    ExcelRenderer(file[0], (err, resp) => {
      if (err) {
        setAlert(err);
      } else {
        const { rows } = resp;
        console.log("response", rows)
        const keys = [
          "name",
          "description",
          "barcode",
          "sku",
          "price",
          "price_purchase",
          "is_favorite",
          "category",
          // "with_recipe",
          "stock",
          "unit",
          // "expired_date"
        ];
        if(subscriptionType === 3) {
          keys.splice(8, 0, "with_recipe")
          keys.splice(11, 0, "expired_date")
        }
        if(subscriptionType === 2) {
          keys.splice(11, 0, "expired_date")
        }
        const data = [];
        const obj = {};
        rows.slice(4).map((j) => {
          keys.map((i, index) => {
            if (i === "barcode") {
              if (j[index]) {
                obj[i] = j[index].toString();
              } else {
                obj[i] = "-";
              }
            } else if (i === "expired_date") {
              if (j[index]) {
                obj[i] = j[index];
              } else {
                obj[i] = "-";
              }
            } else {
              obj[i] = j[index];
            }
          });
          if(obj.name && obj.price) {
            data.push({
              name: obj.name,
              category: obj.category,
              price: obj.price,
              price_purchase: obj.price_purchase,
              description: obj.description,
              is_favorite: obj.is_favorite,
              sku: obj.sku,
              barcode: obj.barcode,
              with_recipe: obj.with_recipe,
              stock: obj.stock,
              unit: obj.unit,
              expired_date: getJsDateFromExcel(obj.expired_date)
            });
          }
          console.log("data excel", data)
        });
        formikImportProductAdd.setFieldValue("products", data);
      }
    });
  };

  const handleFileEdit = (file) => {
    setFilename(file[0].name);
    ExcelRenderer(file[0], (err, resp) => {
      if (err) {
        setAlert(err);
      } else {
        const { rows } = resp;
        const keys = [
          "name",
          "description",
          "barcode",
          "sku",
          "price_purchase",
          "price",
          "is_favorite",
          "category",
          // "with_recipe",
          "stock",
          "unit",
          // "expired_date"
        ];
        if(subscriptionType === 3) {
          keys.splice(8, 0, "with_recipe")
          keys.splice(11, 0, "expired_date")
        }
        if(subscriptionType === 2) {
          keys.splice(11, 0, "expired_date")
        }
        const data = [];
        const obj = {};
        rows.slice(4).map((j) => {
          keys.map((i, index) => {
            if (i === "barcode") {
              if (j[index]) {
                obj[i] = j[index].toString();
              } else {
                obj[i] = "-";
              }
            } else if (i === "expired_date") {
              if (j[index]) {
                obj[i] = j[index];
              } else {
                obj[i] = "-";
              }
            } else {
              obj[i] = j[index];
            }
          });
          data.push({
            name: obj.name,
            category: obj.category,
            price: obj.price,
            price_purchase: obj.price_purchase,
            description: obj.description,
            is_favorite: obj.is_favorite,
            sku: obj.sku,
            barcode: obj.barcode,
            with_recipe: obj.with_recipe,
            stock: obj.stock,
            unit: obj.unit,
            expired_date: getJsDateFromExcel(obj.expired_date)
          });
          // console.log("data excel", data)
        });
        formikImportProductEdit.setFieldValue("products", data);
      }
    });
  };

  const handleFileAddons = (file) => {
    setFilename(file[0].name);
    ExcelRenderer(file[0], (err, resp) => {
      if (err) {
        setAlert(err);
      } else {
        const obj = {}
        const data = []
        const {rows} = resp
        const keys = [
          "product_name",
          "sku_product",
          "group_name",
          "group_type",
          "addon_name",
          "price",
          "status_addon"
        ]
        rows.slice(3).map((value) => {
          keys.map((value2, index) => {
            obj[value2] = value[index]
          })
          if(value.length) {
            data.push({
              product_name: obj.product_name,
              sku_product: obj.sku_product,
              group_name: obj.group_name,
              group_type: obj.group_type,
              addon_name: obj.addon_name,
              price: obj.price,
              status_addon: obj.status_addon
            })
          }
        })
        
        const result = []
        
        console.log("data import addons", data)

        data.map(value => {
          if(typeof value.group_name !== 'string' || 
            typeof value.group_type !== 'string' || 
            typeof value.addon_name !== 'string' || 
            typeof value.price !== 'string' || 
            typeof value.status_addon !== 'string' 
          ) {
            setAlert(t("somethingWentWrongPleaseCheckTheExcelTemplate"))
            return 
          } else {
            const group_name = value.group_name.split("|")
            const group_type = value.group_type.split("|")
            const addon_name = value.addon_name.split("|")
            const price = value.price.split("|")
            const status_addon = value.status_addon.split("|")
          
            group_name.map((value2, index) => {
              const addons = []
              const every_addon_name = addon_name[index].split(',')
              const every_price = price[index].split(',')
              const every_status_addon = status_addon[index].split(',')
          
              every_addon_name.map((value2, index2) => {
                addons.push({
                  has_raw_material: false,
                  id: "",
                  raw_material_id: "",
                  unit_id: "",
                  name: value2,
                  price: every_price[index2],
                  status: every_status_addon[index2]
                })
              })
          
              result.push({
                sku_product: value.sku_product,
                group_name: value2,
                group_type: group_type[index],
                addons
              })
            })
          }
          
        })
        formikImportAddons.setFieldValue("groupAddons", result);
      }
    });
  };

  const handleFileAddonsEdit = (file) => {
    setFilename(file[0].name);
    ExcelRenderer(file[0], (err, resp) => {
      if (err) {
        setAlert(err);
      } else {
        const obj = {}
        const data = []
        const {rows} = resp
        const keys = [
          "product_name",
          "sku_product",
          "group_name",
          "group_type",
          "addon_name",
          "price",
          "status_addon"
        ]
        rows.slice(3).map((value) => {
          keys.map((value2, index) => {
            obj[value2] = value[index]
          })
          if(value.length) {
            data.push({
              product_name: obj.product_name,
              sku_product: obj.sku_product,
              group_name: obj.group_name,
              group_type: obj.group_type,
              addon_name: obj.addon_name,
              price: obj.price,
              status_addon: obj.status_addon
            })
          }
        })
        
        const result = []
        
        data.map(value => {
          const group_name = value.group_name.split("|")
          const group_type = value.group_type.split("|")
          const addon_name = value.addon_name.split("|")
          const price = value.price.split("|")
          const status_addon = value.status_addon.split("|")
        
          group_name.map((value2, index) => {
            const addons = []
            const every_addon_name = addon_name[index].split(',')
            const every_price = price[index].split(',')
            const every_status_addon = status_addon[index].split(',')
        
            every_addon_name.map((value2, index2) => {
              addons.push({
                has_raw_material: false,
                id: "",
                raw_material_id: "",
                unit_id: "",
                name: value2,
                price: every_price[index2],
                status: every_status_addon[index2]
              })
            })
        
            result.push({
              sku_product: value.sku_product,
              group_name: value2,
              group_type: group_type[index],
              addons
            })
          })
        })
        formikImportAddons.setFieldValue("groupAddons", result);
      }
    });
  };

  const handleOptionOutlet = async (outlet_id) => {
    console.log("Call handleOptionOutlet", outlet_id)
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/product?outlet_id=${outlet_id}`
      );
      setProductOfOutlet(data.data)
    } catch (err) {
      setAllProducts([]);
    }
  }

  const ExpandableComponent = ({ data }) => {
    const keys = [
      {
        key: t('unit'),
        value: "unit"
      },
      {
        key: t('stock'),
        value: "stock"
      },
      {
        key: t('sku'),
        value: "sku"
      }
    ];

    return (
      <>
        <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
          {keys.map((val, index) => {
            return (
              <ListGroup.Item key={index}>
                <Row>
                  <Col md={3} style={{ fontWeight: "700" }}>
                    {val.key}
                  </Col>
                  <Col>{data[val.value] || "-"}</Col>
                  <Col>{data[val.sku] || "-"}</Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </>
    );
  };

  const handleShowSyncProduct = (allOutlets) => {
    let status_integrate_shopee = {
      key: false,
      label: t('notYetIntegrated')
    }
    let status_integrate_blibli = {
      key: false,
      label: t('notYetIntegrated')
    }
    const temp_outlet_integrated_blibli = []
    const temp_outlet_integrated_shopee = []
    let count = 0 
    allOutlets.map(item => {
      // Cek duls, apakah status_integrate_beetstorenya true?
      if(item.Request_Integration_Online_Shops) {
        // Shopee
        const find_online_shop_name_shopee = item.Request_Integration_Online_Shops.find(
          (val) => val.online_shop_name === 'shopee'
        )
        if(find_online_shop_name_shopee){
          if(find_online_shop_name_shopee.status === 'done' && item.status_integrate_blibli) {
            // Cari semua outlet yang status request integrasi dan status integrasi nya true 
            temp_outlet_integrated_shopee.push(item.name)
          }
          if(!status_integrate_shopee.key) {
            // Cari semua outlet yang status request integrasi dan status integrasi nya true, jika sudah ada yang true, maka tidak diproses lagi
            if(find_online_shop_name_shopee.status === 'done' && item.status_integrate_shopee) {
              status_integrate_shopee = {
                key: true,
                label: t('alreadyIntegrated')
              }
            } else {
              status_integrate_shopee = {
                key: false,
                label: t('pending')
              }
            }
          }
        }
        // End Shopee
        // Blibli
        const find_online_shop_name_blibli = item.Request_Integration_Online_Shops.find(
          (val) => val.online_shop_name === 'blibli'
        )
        if(find_online_shop_name_blibli){
          if(find_online_shop_name_blibli.status === 'done' && item.status_integrate_blibli) {
            // Cari semua outlet yang status request integrasi dan status integrasi nya true 
            temp_outlet_integrated_blibli.push(item.name)
          }
          if(!status_integrate_blibli.key){
            // Cari semua outlet yang status request integrasi dan status integrasi nya true, jika sudah ada yang true, maka tidak diproses lagi
            if(find_online_shop_name_blibli.status === 'done' && item.status_integrate_blibli) {
              status_integrate_blibli = {
                key: true,
                label: t('alreadyIntegrated')
              }
            } else {
              status_integrate_blibli = {
                key: false,
                label: t('pending')
              }
            }
          }
        }
        // End Blibli
      }
    })

    const result_status_integrate = {
      shopee: status_integrate_shopee.key,
      blibli: status_integrate_blibli.key
    }

    const keys = Object.keys(result_status_integrate)
    console.log("keys", keys)
    const result = keys.find(value => {
      console.log("result_status_integrate[value]", result_status_integrate[value])
      return result_status_integrate[value] === true
    })
    setIntegratedName({
      ...integratedName,
      ...result_status_integrate,
      show_sync_product: result ? true : false
    })
    setOutletIntegratedShopee(temp_outlet_integrated_shopee)
    setOutletIntegratedBlibli(temp_outlet_integrated_blibli)
  }

  React.useEffect(() => {
    handleShowSyncProduct(allOutlets)
  }, [allOutlets])

  const paginationComponentOptions = {
    rowsPerPageText: t('rowsPerPage'),
    rangeSeparatorText: t('of'),
    selectAllRowsItem: true,
    selectAllRowsItemText: t('showAll'),
  };
  
  return (
    <Row>
      <ConfirmModal
        title={`${t('deleteProduct')} - ${product.name}`}
        body={t('areYouSureWantToDelete?')}
        buttonColor="danger"
        handleClick={handleDelete}
        state={showConfirm}
        closeModal={closeConfirmModal}
        loading={loading}
      />

      <ConfirmModal
        title={`${t('delete')} ${selectedData.length} Selected Products`}
        body={t('areYouSureWantToDelete?')}
        buttonColor="danger"
        handleClick={() => handleBulkDelete(selectedData)}
        state={showConfirmBulk}
        closeModal={closeConfirmBulkModal}
        loading={loading}
      />

      <ImportModalAdd
        title={t('importAddProduct')}
        state={stateImportAdd}
        loading={loading}
        alert={alert}
        closeModal={handleCloseImportAdd}
        formikImportProduct={formikImportProductAdd}
        allOutlets={allOutlets}
        handleFile={handleFileAdd}
        filename={filename}
        subscriptionType={subscriptionType}
      />

      <ImportModalEdit
        title={t('importEditProduct')}
        state={stateImportEdit}
        loading={loading}
        alert={alert}
        closeModal={handleCloseImportEdit}
        formikImportProduct={formikImportProductEdit}
        allOutlets={allOutlets}
        handleFile={handleFileEdit}
        filename={filename}
        subscriptionType={subscriptionType}
        showFeature={showFeature}
        handleExports={handleExports}
        dataProduct={dataProduct}
        optionsOutlet={optionsOutlet}
        dataBusiness={dataBusiness}
      />

      <ImportModalAddons
        title={t('importAddAddons')}
        state={stateImportAddons}
        loading={loading}
        alert={alert}
        closeModal={handleCloseImportAddons}
        formikImportProduct={formikImportAddons}
        allOutlets={allOutlets}
        handleFile={handleFileAddons}
        filename={filename}
        subscriptionType={subscriptionType}
      />

      <ImportModalAddonsEdit
        title={t('importEditAddons')}
        state={stateImportAddonsEdit}
        loading={loading}
        alert={alert}
        closeModal={handleCloseImportAddonsEdit}
        formikImportProduct={formikImportAddonsEdit}
        allOutlets={allOutlets}
        handleFile={handleFileAddonsEdit}
        filename={filename}
        subscriptionType={subscriptionType}
        dataAddonsProduct={dataAddonsProduct}
        dataProduct={dataProduct}
        dataBusiness={dataBusiness}
        handleExports={handleExportsAddons}
      />

      <ExportModal 
        loading={loading}
        state={stateExport}
        closeModal={handleCloseExport}
        optionsOutlet={optionsOutlet}
        handleExports={handleExports}
        dataProduct={dataProduct}
        showFeature={showFeature}
      />

      <ExportModalAddons 
        loading={loading}
        state={stateExportAddons}
        closeModal={handleCloseExportAddons}
        optionsOutlet={optionsOutlet}
        handleExports={handleExportsAddons}
        dataProduct={dataProduct}
        dataAddonsProduct={dataAddonsProduct}
        showFeature={showFeature}
      />

      <ModalSyncBlibli 
        loading={loading}
        state={stateModalSyncBlibli}
        closeModal={handleCloseModalSyncBlibli}
        optionsOutlet={optionsOutlet}
        handleExports={handleExports}
        dataProduct={dataProduct}
        showFeature={showFeature}
        handleOptionOutlet={handleOptionOutlet}
        productOfOutlet={productOfOutlet}
        tempOptionOutlet={tempOptionOutlet}
        outletIntegratedBlibli={outletIntegratedBlibli}
      />

      <Col md={12}>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <div className="headerPage">
            <div className="headerStart">
              {!selectedData.length ? (
                <h3>{t("productTitle")}</h3>
              ) : (
                <h3>{selectedData.length} {t("itemSelected")}</h3>
              )}
            </div>
            <div className="headerEnd" style={{ display: "flex" }}>
              {!multiSelect ? (
                <>
                  {integratedName.show_sync_product ? (
                    <>
                      <Dropdown className="mr-2">
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                          {t("syncProduct")}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {integratedName.shopee ? 
                          (
                            <Dropdown.Item>Shopee</Dropdown.Item>
                          ) : null}
                          {integratedName.blibli ? 
                          (
                            <Dropdown.Item onClick={() => setStateModalSyncBlibli(true)}>Blibli</Dropdown.Item>
                          ) : null}
                        </Dropdown.Menu>
                      </Dropdown>
                      {/* <div style={{width: '150px'}} className="mr-2">
                        <Select
                          placeholder={<div>{t('syncProduct')}</div>}
                          options={optionsOutlet}
                          // defaultValue={defaultValueOutlet}
                          name="outlet_id"
                          className="basic-single"
                          classNamePrefix="select"
                          onChange={(value) =>{
                            console.log("value.value", value.value)
                          }}
                        />
                      </div> */}
                    </>
                  ) : null }
                  {/* <div className="btn btn-info mr-2" onClick={() => setStateModalSyncBlibli(true)}>
                    {t('syncProduct')}
                  </div> */}
                  <Dropdown className='mr-2'>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      {t("export")}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setStateExport(true)}>{t("exportProduct")}</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStateExportAddons(true)}>{t("exportAddons")}</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      {t("import")}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={handleOpenImportAdd}>{t("addProduct")}</Dropdown.Item>
                      <Dropdown.Item onClick={handleOpenImportEdit}>{t("editProduct")}</Dropdown.Item>
                      <Dropdown.Item onClick={handleOpenImportAddons}>{t("addAddons")}</Dropdown.Item>
                      {/* <Dropdown.Item onClick={handleOpenImportAddonsEdit}>{t("editAddAddons")}</Dropdown.Item> */}
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* <Button variant="secondary" onClick={handleOpenImportAdd}>
                    {t("import")}
                  </Button> */}

                  <Dropdown as={ButtonGroup} style={{ marginLeft: "0.5rem" }}>
                    <Link
                      to={{
                        pathname: "/product/add-product",
                        state: {
                          allCategories,
                          allTaxes,
                          allOutlets,
                          allUnit,
                          allMaterials,
                          userInfo,
                          showFeature
                        }
                      }}
                      className="btn btn-primary"
                    >
                      <div>{t("addNewProduct")}</div>
                    </Link>

                    <Dropdown.Toggle split variant="primary" />

                    <Dropdown.Menu>
                      <Link
                        to={{
                          pathname: "/product-bundle/add",
                          state: {
                            allCategories,
                            allOutlets,
                            allProducts
                          }
                        }}
                      >
                        <Dropdown.Item as="button">
                          {t("addNewProductBundle")}
                        </Dropdown.Item>
                      </Link>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Button
                  variant="danger"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={() => showConfirmBulkModal(selectedData)}
                >
                  {t("delete")}
                </Button>
              )}
              {allProducts.length ? (
                <Button
                  variant={!multiSelect ? "danger" : "secondary"}
                  style={{ marginLeft: "0.5rem" }}
                  onClick={handleMode}
                >
                  {!multiSelect ? <Delete /> : `${t("cancel")}`}
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="filterSection lineBottom">
            <Row>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{ background: "transparent" }}>
                      <Search />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    placeholder={t("search")}
                    value={search}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </Col>

              <Col>
                <Row>
                  <Col>
                    <Form.Group as={Row}>
                      <Form.Label
                        style={{ alignSelf: "center", marginBottom: "0" }}
                      >
                        {t("category")}
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="category"
                          value={filter.category}
                          onChange={handleFilter}
                        >
                          <option value="">{t("all")}</option>
                          {allCategories.map((item) => {
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
                        {t("outlet")}
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="outlet"
                          value={filter.outlet}
                          onChange={handleFilter}
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
                        {t("status")}
                      </Form.Label>
                      <Col>
                        <Form.Control
                          as="select"
                          name="status"
                          value={filter.status}
                          onChange={handleFilter}
                        >
                          <option value="">{t("all")}</option>
                          <option value="active">{t("active")}</option>
                          <option value="inactive">{t("inactive")}</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <DataTable
            noHeader
            pointerOnHover
            highlightOnHover
            pagination
            paginationComponentOptions={paginationComponentOptions}
            responsive
            columns={columns}
            data={productData(allProducts)}
            expandableRows
            expandableRowsComponent={ExpandableComponent}
            style={{ minHeight: "100%" }}
            selectableRows={multiSelect}
            onSelectedRowsChange={handleSelected}
            clearSelectedRows={clearRows}
            noDataComponent={t('thereAreNoRecordsToDisplay')}
          />
        </Paper>
      </Col>
    </Row>
  );
};

export default ProductTab;
