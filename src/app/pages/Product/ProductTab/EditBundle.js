import React from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import dayjs from "dayjs";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";
import { Delete } from "@material-ui/icons";

export const EditBundlePage = ({ match, location }) => {
  const history = useHistory();
  const { productId } = match.params;
  const {
    allOutlets,
    allCategories,
    allProducts,
    currProduct,
    bundleItems,
    initial_stock_id
  } = location.state;
  const { t } = useTranslation();

  const [photo, setPhoto] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [alertPhoto, setAlertPhoto] = React.useState("");
  const [photoPreview, setPhotoPreview] = React.useState("");

  const [isCustomPrice, setIsCustomPrice] = React.useState(
    currProduct.price !== currProduct.price_purchase ? true : false
  );

  const initialValueBundle = {
    outlet_id: currProduct.outlet_id,
    name: currProduct.name,
    product_category_id: currProduct.product_category_id || "",
    price: currProduct.price,
    price_purchase: currProduct.price_purchase,
    // stock: currProduct.stock,
    status: currProduct.status,
    description: currProduct.description || "",
    bundle_items: bundleItems
  };

  const ProductSchema = Yup.object().shape({
    outlet_id: Yup.string().required(`${t("pleaseChooseAnOutlet")}`),
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputABundleName")}
      `),
    product_category_id: Yup.string(),
    price: Yup.number()
      .integer()
      .min(1)
      .required(`${t("pleaseInputPrice")}
      `),
    price_purchase: Yup.number()
      .integer()
      .required(`${t("pleaseInputAPricePurchase")}
      `),
    // stock: Yup.number()
    //   .integer()
    //   .min(1)
    //   .required("Please input a stock."),
    status: Yup.string()
      .matches(/(active|inactive)/)
      .required(`${t("pleaseInputAStatus")}
      `),
    description: Yup.string().nullable(),
    bundle_items: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        stock_id: Yup.string().required(`${t("pleaseChooseProduct")}
        `),
        quantity: Yup.number()
          .integer()
          .min(0)
          .required(`${t("pleaseInputQuantity")}
          `)
      })
    )
  });

  const formikProduct = useFormik({
    initialValues: initialValueBundle,
    validationSchema: ProductSchema,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      const priceTotal = values.bundle_items.reduce(
        (init, curr) => (init += parseInt(curr.system_price)),
        0
      );
      if (!isCustomPrice) {
        values.price_purchase = priceTotal;
      }

      values.price = priceTotal;

      // const totalQuantity = values.bundle_items.reduce(
      //   (init, curr) => (init += parseInt(curr.quantity)),
      //   0
      // );

      const formData = new FormData();
      formData.append("outlet_id", values.outlet_id);
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("price_purchase", values.price_purchase);
      // formData.append("stock", values.stock);
      formData.append("status", values.status);
      formData.append("bundle_items", JSON.stringify(values.bundle_items));
      // formData.append("total_quantity", totalQuantity);
      formData.append("initial_stock_id", initial_stock_id);

      if (values.description)
        formData.append("description", values.description);
      if (values.product_category_id)
        formData.append("product_category_id", values.product_category_id);
      if (photo) formData.append("productImage", photo);

      try {
        enableLoading();
        await axios.put(
          `${API_URL}/api/v1/product/bundle/${productId}`,
          formData
        );
        disableLoading();
        history.push("/product");
      } catch (err) {
        setAlert(err.response.data.message);
        disableLoading();
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

  const handlePreviewPhoto = (file) => {
    setAlertPhoto("");

    let preview;
    let img;

    if (file.length) {
      preview = URL.createObjectURL(file[0]);
      img = file[0];
    } else {
      preview = "";
      setAlertPhoto("file is too large or not supported");
    }

    setPhotoPreview(preview);
    setPhoto(img);
  };

  const handleDeletePhoto = () => {
    setPhoto("");
    setPhotoPreview("");
  };

  // const handleStock = (e) => {
  //   const { value } = e.target;

  //   if (value && value > 0) {
  //     const totalQuantity = formikProduct.values.bundle_items.reduce(
  //       (init, curr) => (init += parseInt(curr.quantity)),
  //       0
  //     );
  //     const totalItems = formikProduct.values.bundle_items.length;
  //     const maxStock = Math.floor(totalQuantity / totalItems);

  //     if (value <= maxStock) {
  //       formikProduct.setFieldValue("stock", value);
  //     }
  //   }
  // };

  const handleChangeBundle = (value, index) => {
    formikProduct.setFieldValue(`bundle_items[${index}].stock_id`, value.value);
    // formikProduct.setFieldValue(`bundle_items[${index}].quantity`, 1);
    formikProduct.setFieldValue(
      `bundle_items[${index}].base_system_price`,
      value.system_price
    );
    formikProduct.setFieldValue(
      `bundle_items[${index}].system_price`,
      value.system_price
    );
    // formikProduct.setFieldValue(
    //   `bundle_items[${index}].max_quantity`,
    //   value.max_quantity
    // );

    formikProduct.setFieldValue("price", 1); // biar lolos validaiton aja
    formikProduct.setFieldValue("price_purchase", 1);
  };

  // const handleChangeQuantity = (e, index) => {
  //   const { value } = e.target;

  //   if (value && value > 0) {
  //     if (value <= formikProduct.values.bundle_items[index].max_quantity) {
  //       formikProduct.setFieldValue(`bundle_items[${index}].quantity`, value);

  //       const total_price =
  //         (formikProduct.values.bundle_items[index].base_system_price || 0) *
  //         value;

  //       formikProduct.setFieldValue(
  //         `bundle_items[${index}].system_price`,
  //         total_price
  //       );

  //       formikProduct.setFieldValue("price", 1);
  //       formikProduct.setFieldValue("price_purchase", 1);
  //     }
  //   }
  // };

  const filterProduct = allProducts
    .map((item) => {
      if (item.outlet_id === formikProduct.values.outlet_id) {
        return item;
      } else {
        return "";
      }
    })
    .filter((item) => item);

  const optionsProduct = filterProduct.map((item) => {
    return {
      label: item.name,
      options: item.Stocks.filter((val) => val.stock).map((val) => {
        return {
          value: val.id,
          label: `${item.name} | Stock: ${val.stock} | Expired: ${
            val.expired_date
              ? dayjs(val.expired_date).format("DD-MMM-YYYY")
              : "-"
          }`,
          system_price: item.price,
          max_quantity: val.stock
        };
      })
    };
  });

  const defaultValueProduct = (index) => {
    const output = optionsProduct.find((val) =>
      val.options.find(
        (opt) => opt.value === formikProduct.values.bundle_items[index].stock_id
      )
    );
    return output;
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

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 2 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  };
  const groupBadgeStyles = {
    backgroundColor: "#EBECF0",
    borderRadius: "2em",
    color: "#172B4D",
    display: "inline-block",
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: "1",
    minWidth: 1,
    padding: "0.16666666666667em 0.5em",
    textAlign: "center"
  };

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  return (
    <Row>
      <Col>
        <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
          <Form noValidate onSubmit={formikProduct.handleSubmit}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>Edit Product Bundle</h3>
              </div>
              <div className="headerEnd">
                <Link to="/product">
                  <Button variant="outline-secondary">{t("cancel")}</Button>
                </Link>
                <Button
                  variant="primary"
                  style={{ marginLeft: "0.5rem" }}
                  type="submit"
                >
                  {loading ? (
                    <Spinner animation="border" variant="light" size="sm" />
                  ) : (
                    `${t("save")}`
                  )}
                </Button>
              </div>
            </div>

            {alert ? <Alert variant="danger">{alert}</Alert> : ""}

            <Row style={{ padding: "1rem" }}>
              <Col>
                <Form.Group>
                  <Form.Label>Outlet*</Form.Label>
                  <Select
                    options={optionsOutlet}
                    placeholder={t('select')}
                    defaultValue={defaultValueOutlet}
                    name="outlet_id"
                    className="basic-single"
                    classNamePrefix="select"
                    onChange={(value) =>
                      formikProduct.setFieldValue("outlet_id", value.value)
                    }
                  />
                  {formikProduct.touched.outlet_id &&
                  formikProduct.errors.outlet_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikProduct.errors.outlet_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Bundle Name*</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    {...formikProduct.getFieldProps("name")}
                    onChange={(e) =>
                      formikProduct.setFieldValue("name", e.target.value)
                    }
                    className={validationProduct("name")}
                    required
                  />
                  {formikProduct.touched.name && formikProduct.errors.name ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikProduct.errors.name}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>

                {/* <Form.Group>
                  <Form.Label>Stock*</Form.Label>
                  <Form.Control
                    type="number"
                    {...formikProduct.getFieldProps("stock")}
                    className={validationProduct("stock")}
                    onChange={handleStock}
                    required
                  />
                  {formikProduct.touched.stock && formikProduct.errors.stock ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikProduct.errors.stock}
                      </div>
                    </div>
                  ) : null}
                </Form.Group> */}

                <Form.Group>
                  <Form.Label>Bundle Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    {...formikProduct.getFieldProps("description")}
                    className={validationProduct("description")}
                  />
                  {formikProduct.touched.description &&
                  formikProduct.errors.description ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikProduct.errors.description}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>

              <Col>
                <Form.Group>
                  <div>
                    <Form.Label>Bundle Status*</Form.Label>
                  </div>
                  <div style={{ marginTop: ".5rem" }}>
                    {["Active", "Inactive"].map((item, index) => {
                      return (
                        <Form.Check
                          key={index}
                          inline
                          type="radio"
                          name="status"
                          value={formikProduct.values.status}
                          onChange={(e) => {
                            if (e.target.value === "active") {
                              formikProduct.setFieldValue("status", "inactive");
                            } else {
                              formikProduct.setFieldValue("status", "active");
                            }
                          }}
                          label={item}
                          checked={
                            item.toLowerCase() === formikProduct.values.status
                              ? true
                              : false
                          }
                          required
                          className={validationProduct("status")}
                          feedback={formikProduct.errors.status}
                        />
                      );
                    })}
                  </div>
                </Form.Group>

                <Form.Group style={{ marginTop: "2.5rem" }}>
                  <Form.Label>Category</Form.Label>
                  <Select
                    options={optionsCategory}
                    defaultValue={defaultValueCategory}
                    placeholder={t('select')}
                    name="product_category_id"
                    className="basic-single"
                    classNamePrefix="select"
                    onChange={(value) =>
                      formikProduct.setFieldValue(
                        "product_category_id",
                        value.value
                      )
                    }
                  />
                  {formikProduct.touched.product_category_id &&
                  formikProduct.errors.product_category_id ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikProduct.errors.product_category_id}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Product Photo</Form.Label>
                  {alertPhoto ? (
                    <Alert variant="danger">{alertPhoto}</Alert>
                  ) : (
                    ""
                  )}
                  <div
                    {...getRootProps({
                      className: "boxDashed dropzone"
                    })}
                  >
                    <input {...getInputProps()} />
                    {!photoPreview ? (
                      <>
                        <p>
                          Drag 'n' drop some files here, or click to select
                          files
                        </p>
                        <p style={{ color: "gray" }}>File Size Limit: 2 MB</p>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            margin: "auto",
                            width: "120px",
                            height: "120px",
                            overflow: "hidden",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundImage: `url(${photoPreview || photo})`
                          }}
                        />
                        <small>
                          {photo?.name
                            ? `${photo.name} - ${photo.size} bytes`
                            : ""}
                        </small>
                      </>
                    )}
                  </div>
                  {photo ? (
                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleDeletePhoto}
                      >
                        Remove Photo
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </Form.Group>
              </Col>
            </Row>

            <FormikProvider value={formikProduct}>
              <FieldArray
                name="bundle_items"
                render={(arrayHelpers) => {
                  return (
                    <div>
                      <Row
                        style={{ padding: "1rem", margin: "0 1rem" }}
                        className="box"
                      >
                        <Col>
                          {formikProduct.values.bundle_items.map(
                            (item, index) => {
                              return (
                                <Row key={index}>
                                  <Col>
                                    <Form.Group>
                                      <Form.Label>Product*</Form.Label>
                                      <Select
                                        options={optionsProduct}
                                        placeholder={t('select')}
                                        formatGroupLabel={formatGroupLabel}
                                        defaultValue={defaultValueProduct(
                                          index
                                        )}
                                        name={`bundle_items[${index}].stock_id`}
                                        onChange={(value) =>
                                          handleChangeBundle(value, index)
                                        }
                                      />
                                      {formikProduct.touched.bundle_items &&
                                      formikProduct.errors.bundle_items ? (
                                        <div className="fv-plugins-message-container">
                                          <div className="fv-help-block">
                                            {
                                              formikProduct.errors.bundle_items[
                                                index
                                              ]?.stock_id
                                            }
                                          </div>
                                        </div>
                                      ) : null}
                                    </Form.Group>
                                  </Col>

                                  {/* <Col>
                                    <Form.Group>
                                      <Form.Label>Quantity*</Form.Label>
                                      <Form.Control
                                        type="number"
                                        {...formikProduct.getFieldProps(
                                          `bundle_items[${index}].quantity`
                                        )}
                                        onChange={(e) =>
                                          handleChangeQuantity(e, index)
                                        }
                                        required
                                      />
                                      {formikProduct.touched.bundle_items &&
                                      formikProduct.errors.bundle_items ? (
                                        <div className="fv-plugins-message-container">
                                          <div className="fv-help-block">
                                            {
                                              formikProduct.errors.bundle_items[
                                                index
                                              ]?.quantity
                                            }
                                          </div>
                                        </div>
                                      ) : null}
                                    </Form.Group>
                                  </Col> */}

                                  <Col>
                                    <Form.Group>
                                      <Form.Label>System Price*</Form.Label>
                                      <Form.Control
                                        type="number"
                                        value={
                                          formikProduct.values.bundle_items[
                                            index
                                          ].system_price
                                        }
                                        disabled
                                      />
                                    </Form.Group>
                                  </Col>

                                  <Col sm={1} style={{ alignSelf: "center" }}>
                                    <Button
                                      variant="danger"
                                      onClick={() => {
                                        arrayHelpers.remove(index);
                                      }}
                                    >
                                      <Delete />
                                    </Button>
                                  </Col>
                                </Row>
                              );
                            }
                          )}

                          <Row>
                            <Col sm={3}>
                              <Button
                                variant="primary"
                                onClick={() => {
                                  arrayHelpers.push({
                                    stock_id: "",
                                    // quantity: 0,
                                    base_system_price: 0,
                                    system_price: 0
                                    // max_quantity: 0
                                  });
                                }}
                              >
                                + Add Product
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  );
                }}
              />
            </FormikProvider>

            <Row style={{ padding: "1rem" }}>
              <Col>
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Custom Bundle Price"
                    value={isCustomPrice}
                    checked={isCustomPrice}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (value === "false") {
                        setIsCustomPrice(true);
                      } else {
                        setIsCustomPrice(false);
                      }
                    }}
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <Form.Control
                    type="number"
                    name="price_purchase"
                    {...formikProduct.getFieldProps("price_purchase")}
                    value={
                      isCustomPrice
                        ? formikProduct.values.price_purchase
                        : formikProduct.values.bundle_items.reduce(
                            (init, curr) =>
                              (init += parseInt(curr.system_price)),
                            0
                          )
                    }
                    className={validationProduct("price_purchase")}
                    disabled={isCustomPrice ? false : true}
                  />
                  {formikProduct.touched.price_purchase &&
                  formikProduct.errors.price_purchase ? (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        {formikProduct.errors.price_purchase}
                      </div>
                    </div>
                  ) : null}
                </Form.Group>
              </Col>

              {/* <Col>
                <Form.Group>
                  <Form.Label>Total Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={formikProduct.values.bundle_items.reduce(
                      (init, curr) => (init += parseInt(curr.quantity)),
                      0
                    )}
                    disabled
                  />
                </Form.Group>
              </Col> */}

              <Col>
                <Form.Group>
                  <Form.Label>Total System Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    {...formikProduct.getFieldProps("price")}
                    value={formikProduct.values.bundle_items.reduce(
                      (init, curr) => (init += parseInt(curr.system_price)),
                      0
                    )}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Paper>
      </Col>
    </Row>
  );
};
