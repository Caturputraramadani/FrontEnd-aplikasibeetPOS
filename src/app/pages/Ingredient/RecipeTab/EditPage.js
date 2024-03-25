import React, { useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, FormikProvider, FieldArray } from "formik";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Paper } from "@material-ui/core";
import { CropLandscapeOutlined, Delete } from "@material-ui/icons";

import CustomModal from "./CustomModal";

export const EditRecipePage = ({ location, match }) => {
  const history = useHistory();
  const {
    allOutlets,
    allMaterials,
    allUnits,
    allCategories,
    currRecipe
  } = location.state;
  const { recipeId } = match.params;
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [currTotalPrice, setCurrTotalPrice] = React.useState(0);
  const [currTotalCalorie, setCurrTotalCalorie] = React.useState(0);

  const [totalCalorie, setTotalCalorie] = React.useState([])
  const [totalIngrendients, setTotalIngrendients] = React.useState([])

  const [valueMaterial, setValueMaterial] = React.useState({})

  const [stateCustom, setStateCustom] = React.useState(false);

  const initialValueRecipe = {
    outlet_id: currRecipe.outlet_id,
    product_id: currRecipe.product_id,
    total_calorie: currRecipe.total_calorie,
    total_cogs: currRecipe.total_cogs,
    total_ingredient_price: currRecipe.total_ingredient_price,
    notes: currRecipe.notes,
    materials: currRecipe.materials
  };

  const materialValue = {
    id: "",
    raw_material_category_id: "",
    raw_material_id: "",
    quantity: 0,
    unit_id: 0,
    calorie_per_unit: 0,
    ingredient_price: 0,
    is_custom_material: false
  };

  const handleMaterial = async (value) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const result = await axios.get(`${API_URL}/api/v1/raw-material`);
      result.data.data.map((item) => {
        if (item.name === value.label) {
          setValueMaterial(item);
        }
      });
    } catch (err) {
      setAlert(err.response?.data.message || err.message);
    }
  };

  const RecipeSchema = Yup.object().shape({
    outlet_id: Yup.number().required(`${t("pleaseChooseAnOutlet")}`),
    total_calorie: Yup.number(),
    total_cogs: Yup.number(),
    notes: Yup.string().nullable(),
    product_id: Yup.number().required(`${t("pleaseChooseAProduct")}`),
    materials: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().nullable(),
        raw_material_category_id: Yup.number()
          .typeError(`${t("pleaseInputACategory")}`)
          .required(`${t("pleaseInputACategory")}`),
        raw_material_id: Yup.number()
          .typeError(`${t("pleaseInputARawMaterial")}`)
          .required(`${t("pleaseInputARawMaterial")}`),
        quantity: Yup.number()
          .min(0, `${t("minimum0Character")}`)
          .typeError(`${t("pleaseInputAQuantity")}`)
          .required(`${t("pleaseInputAQuantity")}`),
        unit_id: Yup.number(),
        calorie_per_unit: Yup.number()
          .min(0, `${t("minimum0Character")}`)
          .typeError(`${t("pleaseInputACalorie")}`)
          .required(`${t("pleaseInputACalorie")}`),
        ingredient_price: Yup.number()
          .min(0, `${t("minimum0Character")}`)
          .typeError(`${t("pleaseInputAPrice")}`)
          .required(`${t("pleaseInputAPrice")}`),
        is_custom_material: Yup.boolean()
      })
    )
  });

  const formikRecipe = useFormik({
    initialValues: initialValueRecipe,
    validationSchema: RecipeSchema,
    onSubmit: async (values) => {
      // const resultCalorie = handleTotalCalorie();
      const recipeData = {
        outlet_id: values.outlet_id,
        product_id: values.product_id,
        total_calorie: values.total_calorie,
        total_cogs: values.total_ingredient_price,
        total_ingredient_price: values.total_ingredient_price,
        notes: values.notes || "",
        materials: values.materials
      };

      const API_URL = process.env.REACT_APP_API_URL;
      try {
        enableLoading();
        await axios.put(`${API_URL}/api/v1/recipe/${recipeId}`, recipeData);
        disableLoading();
        history.push("/ingredient-inventory");
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const handleTotalCalorie = () => {
    const resultCalorie = formikRecipe.values.materials.reduce(
      (init, curr) => (init += curr.calorie_per_unit),
      0
    );
    return resultCalorie;
  };

  const validationRecipe = (fieldname) => {
    if (formikRecipe.touched[fieldname] && formikRecipe.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikRecipe.touched[fieldname] && !formikRecipe.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const initialValueCustom = {
    name: "",
    price: 0
  };

  const CustomSchema = Yup.object().shape({
    name: Yup.string().required("Please input name"),
    price: Yup.number().required("Please input price")
  });

  const formikCustom = useFormik({
    initialValues: initialValueCustom,
    validationSchema: CustomSchema,
    onSubmit: (values) => {
      const customData = {
        id: "",
        raw_material_category_id: 0,
        raw_material_id: 0,
        quantity: 0,
        unit_id: 0,
        calorie_per_unit: 0,
        ingredient_price: 0,
        is_custom_material: true,
        custom_material_name: values.name,
        custom_material_price: values.price
      };

      formikRecipe.values.materials.push(customData);
      closeCustomModal();
    }
  });

  const validationCustom = (fieldname) => {
    if (formikCustom.touched[fieldname] && formikCustom.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikCustom.touched[fieldname] && !formikCustom.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const showCustomModal = () => setStateCustom(true);
  const closeCustomModal = () => {
    formikCustom.resetForm();
    setStateCustom(false);
  };

  //
  const optionsOutlet = allOutlets.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueOutlet = optionsOutlet.find(
    (val) => val.value === formikRecipe.values.outlet_id
  );

  const optionsCategory = allCategories.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueCategory = (index) =>
    optionsCategory.find(
      (val) =>
        val.value ===
        formikRecipe.values.materials[index].raw_material_category_id
    );
  const optionsRaw = (index) =>
    allCategories
      .filter(
        (item) =>
          item.id ===
          formikRecipe.values.materials[index].raw_material_category_id
      )
      .map((item) => {
        return item.Raw_Materials.filter(
          (val) => val.outlet_id === formikRecipe.values.outlet_id
        ).map((val) => {
          return {
            value: val.id,
            label: val.name,
            unit_id: val.unit_id,
            calorie: val.calorie_per_unit,
            total_price: val.price_per_unit,
            calorie_unit: val.calorie_unit
          };
        });
      })
      .flat(1);

  const defaultValueRaw = (index) =>
    optionsRaw(index).find(
      (val) =>
        val.value === formikRecipe.values.materials[index].raw_material_id
    );
  const optionsUnit = allUnits.map((item) => {
    return { value: item.id, label: item.name };
  });
  const defaultValueUnit = (index) => {
    let result;
    optionsUnit.map((item) => {
      if (item.value === formikRecipe.values.materials[index].unit_id) {
        result = item.label;
      }
    });
    return result;
  };

  const total_cogs = formikRecipe.values.materials.reduce(
    (init, curr) => (init += curr.ingredient_price),
    0
  );
  
  React.useEffect(() => {
    if(currRecipe.materials.length) {
      const containerIngrendient = []
      const containerCalorie = []
      currRecipe.materials.map(value => {
        containerIngrendient.push(value.ingredient_price)
        containerCalorie.push(value.calorie_per_unit)
      })
      setTotalIngrendients(containerIngrendient)
      setTotalCalorie(containerCalorie)
    }
  }, [])

  const calculateIngerndients = (index, value) => {
    console.log("totalIngrendients", totalIngrendients)
    const temp_data = totalIngrendients
    temp_data[index] = value
    setTotalIngrendients(temp_data)
    console.log("temp_data", temp_data)
    const result = temp_data.reduce((acc, curr) => {
      return acc + parseInt(curr)
    }, 0)
    formikRecipe.setFieldValue(
      `total_ingredient_price`,
      result
    );
  }

  const calculateCalorie = (index, value) => {
    const temp_data = totalCalorie
    temp_data[index] = value
    setTotalCalorie(temp_data)
    console.log("temp_data", temp_data)
    const result = temp_data.reduce((acc, curr) => {
      return acc + parseInt(curr)
    }, 0)
    formikRecipe.setFieldValue(
      `total_calorie`,
      result
    );
  }

  return (
    <>
      <CustomModal
        stateModal={stateCustom}
        cancelModal={closeCustomModal}
        title={t("addCustomMaterial")}
        loading={loading}
        alert={alert}
        formikCustom={formikCustom}
        validationCustom={validationCustom}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <Form noValidate onSubmit={formikRecipe.handleSubmit}>
              <div className="headerPage">
                <div className="headerStart">
                  <h3>{t("editRecipe")}</h3>
                </div>
                <div className="headerEnd">
                  <Link to="/ingredient-inventory">
                    <Button variant="secondary">{t("cancel")}</Button>
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

              <Row style={{ padding: "1rem" }} className="lineBottom">
                <Col>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>{t("location")}:</Form.Label>
                        <Select
                          options={optionsOutlet}
                          placeholder={t('select')}
                          defaultValue={defaultValueOutlet}
                          name="outlet_id"
                          className="basic-single"
                          classNamePrefix="select"
                          // onChange={(value) => {
                          //   formikRecipe.setFieldValue(
                          //     "outlet_id",
                          //     value.value
                          //   );
                          //   formikRecipe.setFieldValue("materials", []);
                          // }}
                          isDisabled={true}
                        />
                        {formikRecipe.touched.outlet_id &&
                        formikRecipe.errors.outlet_id ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikRecipe.errors.outlet_id}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>{t("productName")}:</Form.Label>
                        <Form.Control
                          type="text"
                          value={currRecipe.currProduct.name}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>{t("productPrice")}:</Form.Label>
                        <Form.Control
                          type="text"
                          value={currRecipe.currProduct.price}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label>{t("notes")}:</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="notes"
                          {...formikRecipe.getFieldProps("notes")}
                          className={validationRecipe("notes")}
                        />
                        {formikRecipe.touched.notes &&
                        formikRecipe.errors.notes ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formikRecipe.errors.notes}
                            </div>
                          </div>
                        ) : null}
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={{ padding: "1rem" }} className="lineBottom">
                <Col>
                  <Row>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t("category")}</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t("ingredients")}</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t("quantity")}</h6>
                    </Col>
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t("unit")}</h6>
                    </Col>
                    {/* <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t("materialCalorie")}</h6>
                    </Col> */}
                    <Col style={{ padding: "1rem", textAlign: "center" }}>
                      <h6>{t("ingredientPrice")}</h6>
                    </Col>
                    <Col sm={1}></Col>
                  </Row>

                  <FormikProvider value={formikRecipe}>
                    <FieldArray
                      name="materials"
                      render={(arrayHelpers) => {
                        return (
                          <div>
                            {formikRecipe.values.materials.map(
                              (item, index) => {
                                if (!item.is_custom_material) {
                                  return (
                                    <Row key={index}>
                                      <Col>
                                        <Form.Group>
                                          <Select
                                            options={optionsCategory}
                                            placeholder={t('select')}
                                            defaultValue={defaultValueCategory(
                                              index
                                            )}
                                            name={`materials[${index}].raw_material_category_id`}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            onChange={(value) => {
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].raw_material_category_id`,
                                                value.value
                                              );
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].raw_material_id`,
                                                null
                                              );
                                            }}
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.raw_material_category_id
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>

                                      <Col>
                                        <Form.Group>
                                          <Select
                                            options={optionsRaw(index)}
                                            placeholder={t('select')}
                                            defaultValue={defaultValueRaw(
                                              index
                                            )}
                                            name={`materials[${index}].raw_material_id`}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            onChange={(value) => {
                                              handleMaterial(value);
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].raw_material_id`,
                                                value.value
                                              );
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].unit_id`,
                                                value.unit_id
                                              );
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].quantity`,
                                                1
                                              );

                                              const resultPriceIngredient = optionsRaw(
                                                index
                                              ).find(
                                                (val) =>
                                                  val.value === value.value
                                              );

                                              let price = 0;
                                              if (
                                                resultPriceIngredient.total_price
                                              ) {
                                                price =
                                                  resultPriceIngredient.total_price;
                                              }

                                              formikRecipe.setFieldValue(
                                                `materials[${index}].total_price`,
                                                price
                                              );
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].ingredient_price`,
                                                price
                                              );
                                              const rawMaterial = optionsRaw(
                                                index
                                              ).find(
                                                (val) =>
                                                  val.value === value.value
                                              );

                                              // default calorie
                                              let calorie = 0;
                                              if (rawMaterial.calorie) {
                                                calorie = rawMaterial.calorie;
                                                if (
                                                  rawMaterial.calorie_unit ===
                                                  "kcal"
                                                ) {
                                                  calorie *= 1000;
                                                }
                                              }

                                              formikRecipe.setFieldValue(
                                                `materials[${index}].calorie`,
                                                calorie
                                              );
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].calorie_per_unit`,
                                                calorie
                                              );

                                              calculateIngerndients(index, price)
                                              calculateCalorie(index, calorie)
                                            }}
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.raw_material_id
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Control
                                            type="number"
                                            name={`materials[${index}].quantity`}
                                            {...formikRecipe.getFieldProps(
                                              `materials[${index}].quantity`
                                            )}
                                            onChange={(e) => {
                                              const { value } = e.target;
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].quantity`,
                                                value
                                              );

                                              const calorie =
                                                (formikRecipe.values.materials[
                                                  index
                                                ].calorie || 0) * value;

                                              formikRecipe.setFieldValue(
                                                `materials[${index}].calorie_per_unit`,
                                                calorie
                                              );

                                              const price =
                                                (formikRecipe.values.materials[
                                                  index
                                                ].total_price || 0) * value;

                                              formikRecipe.setFieldValue(
                                                `materials[${index}].ingredient_price`,
                                                price
                                              );
                                              calculateIngerndients(index, price)
                                              calculateCalorie(index, calorie)
                                            }}
                                            required
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.quantity
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Control
                                            type="text"
                                            value={defaultValueUnit(index)}
                                            disabled
                                            name={`materials[${index}].unit_id`}
                                          />
                                        </Form.Group>
                                        {/* <Form.Group>
                                          <Form.Control
                                            type="text"
                                            value={valueMaterial.Unit ? valueMaterial.Unit.name : ""}
                                            disabled
                                            name={`materials[${index}].unit_id`}
                                            onChange={() => 
                                              valueMaterial.Unit ? formikRecipe.setFieldValue(
                                                `materials[${index}].unit_id`,
                                                valueMaterial.Unit.name
                                              ) : ""
                                            }
                                          />
                                          {formikRecipe.touched.materials &&
                                            formikRecipe.errors.materials ? (
                                              <div className="fv-plugins-message-container">
                                                <div className="fv-help-block">
                                                  {
                                                    formikRecipe.errors.materials[
                                                      index
                                                    ]?.unit_id
                                                  }
                                                </div>
                                              </div>
                                            ) : null}
                                          </Form.Group> */}
                                        {/* <Form.Group>
                                          <Select
                                            options={optionsUnit}
                                            defaultValue={defaultValueUnit(
                                              index
                                            )}
                                            name={`materials[${index}].unit_id`}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            onChange={(value) =>
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].unit_id`,
                                                value.value
                                              )
                                            }
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.unit_id
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group> */}
                                      </Col>
                                      {/* <Col>
                                        <Form.Group>
                                          <Form.Control
                                            type="number"
                                            name={`materials[${index}].calorie_per_unit`}
                                            {...formikRecipe.getFieldProps(
                                              `materials[${index}].calorie_per_unit`
                                            )}
                                            onChange={(e) => {
                                              const { value } = e.target;
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].calorie_per_unit`,
                                                value
                                              );
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].calorie`,
                                                value
                                              );
                                              calculateCalorie(index, value)
                                            }}
                                            required
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.calorie_per_unit
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col> */}
                                      <Col>
                                        <Form.Group>
                                          <Form.Control
                                            type="number"
                                            name={`materials[${index}].ingredient_price`}
                                            {...formikRecipe.getFieldProps(
                                              `materials[${index}].ingredient_price`
                                            )}
                                            onChange={(e) => {
                                              const { value } = e.target;
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].ingredient_price`,
                                                value
                                              );
                                              formikRecipe.setFieldValue(
                                                `materials[${index}].total_price`,
                                                value
                                              );
                                              calculateIngerndients(index, value)
                                            }}
                                            required
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.ingredient_price
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>

                                      <Col sm={1}>
                                        <Button
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                          variant="danger"
                                        >
                                          <Delete />
                                        </Button>
                                      </Col>
                                    </Row>
                                  );
                                } else {
                                  return (
                                    <Row key={index}>
                                      <Col></Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Control
                                            type="text"
                                            name={`materials[${index}].custom_material_name`}
                                            {...formikRecipe.getFieldProps(
                                              `materials[${index}].custom_material_name`
                                            )}
                                            disabled
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.custom_material_name
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>
                                      <Col></Col>
                                      <Col></Col>
                                      <Col></Col>
                                      <Col>
                                        <Form.Group>
                                          <Form.Control
                                            type="number"
                                            name={`materials[${index}].custom_material_price`}
                                            {...formikRecipe.getFieldProps(
                                              `materials[${index}].custom_material_price`
                                            )}
                                            disabled
                                          />
                                          {formikRecipe.touched.materials &&
                                          formikRecipe.errors.materials ? (
                                            <div className="fv-plugins-message-container">
                                              <div className="fv-help-block">
                                                {
                                                  formikRecipe.errors.materials[
                                                    index
                                                  ]?.custom_material_price
                                                }
                                              </div>
                                            </div>
                                          ) : null}
                                        </Form.Group>
                                      </Col>

                                      <Col sm={1}>
                                        <Button
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                          variant="danger"
                                        >
                                          <Delete />
                                        </Button>
                                      </Col>
                                    </Row>
                                  );
                                }
                              }
                            )}

                            <Row style={{ padding: "1rem" }}>
                              <Button
                                onClick={() => arrayHelpers.push(materialValue)}
                                variant="primary"
                              >
                                + {t("addIngredients")}
                              </Button>

                              <Button
                                onClick={showCustomModal}
                                variant="secondary"
                                style={{ marginLeft: "0.5rem" }}
                              >
                                + {t("addCustomMaterial")}
                              </Button>
                            </Row>
                          </div>
                        );
                      }}
                    />
                  </FormikProvider>
                </Col>
              </Row>

              <Row style={{ padding: "1rem" }}>
                <Col></Col>
                <Col></Col>
                <Col></Col>
                <Col style={{ textAlign: "right", alignSelf: "center" }}>
                  <h6>{t("total")}</h6>
                </Col>
                {/* <Col>
                  <Form.Control
                    type="number"
                    name="total_calorie"
                    {...formikRecipe.getFieldProps("total_calorie")}
                  />
                </Col> */}
                <Col>
                  <Form.Control
                    type="number"
                    name="total_cogs"
                    {...formikRecipe.getFieldProps("total_ingredient_price")}
                  />
                </Col>
                <Col sm={1}></Col>
              </Row>
            </Form>
          </Paper>
        </Col>
      </Row>
    </>
  );
};
