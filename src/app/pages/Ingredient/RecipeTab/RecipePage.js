import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Paper } from "@material-ui/core";
import { Button, InputGroup, Form, Row, Col, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";

import { Search, MoreHoriz } from "@material-ui/icons";
import useDebounce from "../../../hooks/useDebounce";

import ConfirmModal from "../../../components/ConfirmModal";

const RecipeTab = ({
  allOutlets,
  allMaterials,
  allUnits,
  allCategories,
  refresh,
  handleRefresh,
  t,
  totalRecipePrice
}) => {
  const [alert, setAlert] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 1000);

  const [filter, setFilter] = React.useState({
    time: "newest"
  });

  const [allRecipes, setAllRecipes] = React.useState([]);
  const [currRecipe, setCurrRecipe] = React.useState({
    id: "",
    name: ""
  });

  const getRecipe = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const filter = `?name=${search}`;

    try {
      const { data } = await axios.get(`${API_URL}/api/v1/recipe${filter}`);
      // console.log('ini all recipe', data.data)
      setAllRecipes(data.data);
    } catch (err) {
      setAllRecipes([]);
    }
  };

  React.useEffect(() => {
    getRecipe(debouncedSearch);
  }, [refresh, debouncedSearch]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const handleSearch = (e) => setSearch(e.target.value);
  // const handleFilter = (e) => {
  //   const { name, value } = e.target;
  //   const filterData = { ...filter };
  //   filterData[name] = value;
  //   setFilter(filterData);
  // };

  const showDeleteModal = (data) => {
    setCurrRecipe({
      id: data.id,
      name: data.name
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setAlert("");
    setStateDeleteModal(false);
  };

  // console.log('ini curr recipe di recipe page', currRecipe)

  const handleDeleteRecipe = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/recipe/${id}`);
      handleRefresh();
      disableLoading();
      closeDeleteModal();
    } catch (err) {
      setAlert(err.response?.data.message || err.message);
      disableLoading();
    }
  };

  const columns = [
    {
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "70px"
    },
    {
      name: `${t("product")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("ingredientsUsed")}`,
      selector: "raw_material",
      sortable: true
    },
    // {
    //   name: `${t("totalNutrition")}`,
    //   selector: "total_nutrition",
    //   sortable: true
    // },
    {
      name: `${t(totalRecipePrice)}`,
      selector: "total_recipe_price",
      sortable: true
    },
    {
      name: `${t("actions")}`,
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Link
                to={{
                  pathname: `/ingredient-inventory/recipe/${rows.id}`,
                  state: {
                    allOutlets,
                    allMaterials,
                    allUnits,
                    allCategories,
                    currRecipe: rows
                  }
                }}
              >
                <Dropdown.Item as="button">{t("edit")}</Dropdown.Item>
              </Link>

              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
              {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  console.log("allRecipes", allRecipes)

  const dataUnit = allRecipes.map((item, index) => {
    // const total_nutrition = item.Recipe_Materials?.reduce(
    //   (init, curr) => (init += curr.calorie_per_unit || 0),
    //   0
    // );
    // const total_recipe_price = item.Recipe_Materials?.reduce(
    //   (init, curr) => (init += curr.ingredient_price || 0),
    //   0
    // );
    return {
      id: item.id,
      no: index + 1,
      name: item.Product?.name || "-",
      raw_material: item.Recipe_Materials?.length || 0,
      total_nutrition: item.total_calorie || 0,
      total_recipe_price: item.total_ingredient_price,
      outlet_id: item.outlet_id,
      product_id: item.product_id,
      total_calorie: item.total_calorie || 0,
      total_ingredient_price: item.total_ingredient_price,
      notes: item.notes,
      materials: item.Recipe_Materials.map((val) => {
        return {
          id: val.id,
          raw_material_id: val.raw_material_id || 0,
          quantity: val.quantity || 0,
          unit_id: val.unit_id || 0,
          is_custom_material: val.is_custom_material,
          calorie_per_unit: val.calorie_per_unit || 0,
          ingredient_price: val.ingredient_price || 0,
          custom_material_name: val.custom_material_name,
          custom_material_price: val.custom_material_price,
          raw_material_category_id:
            val.Raw_Material?.raw_material_category_id || 0
        };
      }),
      currProduct: {
        name: item.Product?.name,
        price: item.Product?.price
      }
    };
  });

  console.log("dataUnit", dataUnit)

  return (
    <>
      <ConfirmModal
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        title={`${t("deleteRecipe")} - ${currRecipe.name}`}
        body={t("areYouSureWantToDelete?")}
        loading={loading}
        buttonColor="danger"
        handleClick={() => handleDeleteRecipe(currRecipe.id)}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("recipe")}</h3>
              </div>
            </div>

            <div className="filterSection lineBottom">
              <Row>
                <Col>
                  <InputGroup className="pb-3">
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

                {/* <Col>
                  <Form.Group as={Row}>
                    <Form.Label
                      style={{ alignSelf: "center", marginBottom: "0" }}
                    >
                      Time:
                    </Form.Label>
                    <Col>
                      <Form.Control
                        as="select"
                        name="time"
                        value={filter.time}
                        onChange={handleFilter}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </Form.Control>
                    </Col>
                  </Form.Group>
                </Col> */}
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataUnit}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};

export default RecipeTab;
