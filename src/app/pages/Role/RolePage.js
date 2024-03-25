import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  InputGroup
  // ListGroup,
  // Container
} from "react-bootstrap";
import DataTable from "react-data-table-component";

import {
  Paper
  // FormGroup,
  // FormControl,
  // FormControlLabel,
  // Switch
} from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import ModalRole from "./ModalRole";
import ConfirmModal from "../../components/ConfirmModal";

import useDebounce from "../../hooks/useDebounce";
import "../style.css";

export const RolePage = () => {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [refresh, setRefresh] = React.useState(0);
  const { t } = useTranslation();
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [allRoles, setAllRoles] = React.useState([]);
  const [allPrivileges, setAllPrivileges] = React.useState([]);
  const [allAccessLists, setAllAccessLists] = React.useState([]);
  const [selectedRole, setSelectedRole] = React.useState({
    id: "",
    name: ""
  });

  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebounce(search, 1000);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const initialRole = {
    id: "",
    name: "",
    privileges: [
      {
        id: "",
        allow: false
      }
    ]
  };

  const RoleSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputARoleName")}`),
    privileges: Yup.array().of(
      Yup.object().shape({
        id: Yup.number(),
        allow: Yup.boolean()
      })
    )
  });
  const formikAddRole = useFormik({
    initialValues: initialRole,
    validationSchema: RoleSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      console.log("Data yang ditambahkan", values)

      try {
        setAlert("");
        enableLoading();
        await axios.post(`${API_URL}/api/v1/role`, values);
        disableLoading();
        handleRefresh();
        closeAddModal();
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationAddRole = (fieldname) => {
    if (formikAddRole.touched[fieldname] && formikAddRole.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikAddRole.touched[fieldname] && !formikAddRole.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formikEditRole = useFormik({
    initialValues: initialRole,
    validationSchema: RoleSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      console.log("values role yang akan di edit", values)

      try {
        setAlert("");
        enableLoading();
        await axios.put(`${API_URL}/api/v1/role/${values.id}`, values);


        const localPrivileges = values.privileges.map((item) => {
          const lowerName = item.name
            .split(" ")
            .join("_")
            .toLowerCase();

          return { name: lowerName, allow: item.allow, access: item.access };
        });

        const currLocalStorage = JSON.parse(localStorage.getItem("user_info"));

        if (currLocalStorage.privileges) {
          currLocalStorage.privileges = localPrivileges;
          localStorage.setItem("user_info", JSON.stringify(currLocalStorage));

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          handleRefresh();
          disableLoading();
          closeEditModal();
        }
      } catch (err) {
        console.log("error edit rolePage", err)
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationEditRole = (fieldname) => {
    if (formikEditRole.touched[fieldname] && formikEditRole.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikEditRole.touched[fieldname] &&
      !formikEditRole.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const handleDeleteRole = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      setAlert("");
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/role/${id}`);
      disableLoading();
      handleRefresh();
      closeDeleteModal();
    } catch (err) {
      setAlert(err.response?.data.message || err.message);
      disableLoading();
    }
  };

  const getRoles = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const filter = search ? `?name=${search}` : "";

    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info'))
      const token = localStorage.getItem('token')

      const resPartition = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`, {
        headers: { Authorization: token } 
       })
      const subPartitionId = resPartition.data.data[0].subscription_partition_id 
      const resSubsPartitionPrivileges = await axios.get(`${API_URL}/api/v1/subscription-partition-privilege?subscription_partition_id=${subPartitionId}`, {
        headers: {
          Authorization: token
        }
      });
      const privilegeDataOwner = resSubsPartitionPrivileges.data.data.map((item) => {
        return {
          id: item.Privilege.id,
          allow: false,
          name: item.Privilege.name,
          access: item.Privilege.Access.name,
          allowShow: item.allow
        };
      });

      console.log("data compare", privilegeDataOwner)

      // const { data } = await axios.get(`${API_URL}/api/v1/role${filter}`);
      const { data } = await axios.get(`${API_URL}/api/v1/role/development${filter}`);

      console.log("data all roles", data.data)
      // data.data[0].Role_Privileges[0].privilege_id
      // iniPrivilegenya[0].id && iniPrivilegenya[0].allowShow
      const array1 = []
      for (const data of data.data) {
        const cobi = data.Role_Privileges.slice(0, 0)
        array1.push(cobi)
      }
      console.log("array 1 sebelum", array1)

      for (const [index, value] of data.data.entries()) {
        for(const value2 of privilegeDataOwner) {
          for (const value3 of value.Role_Privileges) {
            if(value2.id === value3.privilege_id && value2.allowShow) {
              array1[index].push(value3)
            } 
            if(value2.id === value3.privilege_id && !value2.allowShow) {
              console.log("yang tidak masuk pengkondisian", value3)
              await axios.put(`${API_URL}/api/v1/role/update-privilege`, {
                id: value3.id,
                allow: false
              })
            }
          }
        }
      }

      console.log("array 1 sesudah", array1)

      const array2 = []
      data.data.map(value => {
        value.Role_Privileges = []
        array2.push(value)
      })
      array2.map((value, index) => {
        value.Role_Privileges = array1[index]
      })
      console.log("data akhir", data.data)
      setAllRoles(data.data);
    } catch (err) {
      setAllRoles([]);
    }
  };

  // const getAccess = async () => {
  //   const API_URL = process.env.REACT_APP_API_URL;
  //   try {
  //     const { data } = await axios.get(`${API_URL}/api/v1/access`);
  //     setAllAccessLists(data.data);
  //   } catch (err) {
  //     setAllAccessLists([]);
  //   }
  // };

  const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  const getPrivileges = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info'))
      const token = localStorage.getItem('token')

      const resPartition = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`, {
        headers: { Authorization: token } 
       })
      const subPartitionId = resPartition.data.data[0].subscription_partition_id 
      const resSubsPartitionPrivileges = await axios.get(`${API_URL}/api/v1/subscription-partition-privilege?subscription_partition_id=${subPartitionId}&allow=1`, {
        headers: {
          Authorization: token
        }
      });
      const { data } = await axios.get(`${API_URL}/api/v1/privilege`);

      const accesses = [...new Set(data.data.map((item) => item.Access.name))];

      console.log("accesses", accesses)
      // output => ["Cashier", "Backend"]

      const privilegeData = data.data.map((item) => {
        return {
          id: item.id,
          allow: false,
          name: item.name,
          access: item.Access.name
        };
      });
      const privilegeDataOwner = resSubsPartitionPrivileges.data.data.map((item) => {
        return {
          id: item.Privilege.id,
          allow: false,
          name: camelize(item.Privilege.name),
          access: item.Privilege.Access.name,
          allowShow: item.allow
        };
      });

      // handle hide commisison management
      privilegeDataOwner.map((value, index) => {
        if(value.name === 'commissionManagement') {
          delete privilegeDataOwner[index]
        }
      })

      console.log("privilegeDataOwner", privilegeDataOwner)
      // output => {id: 1, allow: false, name: "Cashier Transaction", access: "Cashier"}

      formikAddRole.setFieldValue("privileges", privilegeDataOwner);

      setAllAccessLists(accesses);
      setAllPrivileges(privilegeDataOwner);
    } catch (err) {
      setAllPrivileges([]);
    }
  };


  React.useEffect(() => {
    getPrivileges();
  }, []);

  React.useEffect(() => {
    getRoles(debouncedSearch);
  }, [debouncedSearch, refresh]);

  const handleRefresh = () => setRefresh(refresh + 1);

  const handleSearch = (e) => setSearch(e.target.value);

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    formikAddRole.resetForm();
    formikAddRole.setFieldValue("privileges", allPrivileges);
    setStateAddModal(false);
  };

  const showEditModal = (data) => {
    formikEditRole.setFieldValue("id", data.id);
    formikEditRole.setFieldValue("name", data.name);
    formikEditRole.setFieldValue("privileges", data.privileges);

    setStateEditModal(true);
  };
  const closeEditModal = () => setStateEditModal(false);

  const showDeleteModal = (data) => {
    setAlert("");
    setSelectedRole({
      id: data.id,
      name: data.name
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => setStateDeleteModal(false);

  const dataRole = () => {
    return allRoles.map((item, index) => {
      const access = item.Role_Privileges.filter((item) => item.allow).map(
        (item) => item.Privilege?.Access.name
      );
      const filterAccess = [...new Set(access)];
      const privilegeData = item.Role_Privileges.map((val) => {
        return {
          id: val.privilege_id,
          name: camelize(val.Privilege.name),
          allow: val.allow,
          access: val.Privilege?.Access.name
        };
      });

      // handle hide commisison management
      privilegeData.map((value, index) => {
        if(value.name === 'commissionManagement') {
          delete privilegeData[index]
        }
      })

      return {
        id: item.id,
        no: index + 1,
        name: camelize(item.name) === 'superadmin' ? t('superadmin') : camelize(item.name) === 'admin' ? t('admin') : camelize(item.name) === 'common' ? t('common') : item.name,
        access: filterAccess.join(", "),
        privileges: privilegeData,
        default: item.is_deletable ? "No" : "Yes"
      };
    });
  };

  const columns = [
    {
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "70px"
    },
    {
      name: `${t("name")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("access")}`,
      selector: "access",
      sortable: true
    },
    {
      name: `${t("default")}`,
      selector: "default",
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
              <Dropdown.Item as="button" onClick={() => showEditModal(rows)}>
              {t("edit")}
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
              {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  // const ExpandableComponent = ({ data }) => {
  //   return (
  //     <>
  //       <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
  //         <ListGroup.Item>
  //           <Row>
  //             {data.privileges.length
  //               ? allAccessLists.map((access) => {
  //                   return (
  //                     <Col key={access.id}>
  //                       <Paper
  //                         elevation={2}
  //                         style={{ padding: "1rem", height: "100%" }}
  //                       >
  //                         <h5>{access.name} Access List</h5>

  //                         <FormControl
  //                           component="fieldset"
  //                           style={{ width: "100%" }}
  //                         >
  //                           <FormGroup row>
  //                             <Container style={{ padding: "0" }}>
  //                               {data.privileges.map((privilege, index) => {
  //                                 if (access.name === privilege.Access.name) {
  //                                   return (
  //                                     <Row
  //                                       key={index}
  //                                       style={{ padding: "0.5rem 1rem" }}
  //                                     >
  //                                       <Col style={{ alignSelf: "center" }}>
  //                                         <Form.Label>
  //                                           {privilege.Privilege.name}
  //                                         </Form.Label>
  //                                       </Col>
  //                                       <Col style={{ textAlign: "end" }}>
  //                                         <FormControlLabel
  //                                           key={privilege.Privilege.id}
  //                                           control={
  //                                             <Switch
  //                                               key={privilege.Privilege.id}
  //                                               value={privilege.Privilege.name}
  //                                               color="primary"
  //                                               checked={privilege.allow}
  //                                               style={{
  //                                                 cursor: "not-allowed"
  //                                               }}
  //                                             />
  //                                           }
  //                                         />
  //                                       </Col>
  //                                     </Row>
  //                                   );
  //                                 } else {
  //                                   return "";
  //                                 }
  //                               })}
  //                             </Container>
  //                           </FormGroup>
  //                         </FormControl>
  //                       </Paper>
  //                     </Col>
  //                   );
  //                 })
  //               : ""}
  //           </Row>
  //         </ListGroup.Item>
  //       </ListGroup>
  //     </>
  //   );
  // };

  const handleSelectAll = (state) => {
    let temp_field_props;
    let formik;
    if(stateAddModal) {
      temp_field_props = formikAddRole.getFieldProps("privileges").value
      formik = formikAddRole
    }
    if(stateEditModal) {
      temp_field_props = formikEditRole.getFieldProps("privileges").value
      formik = formikEditRole
    }
    let allow_false = 0
  
    temp_field_props.map(value => {
      if(value.access === state) {
        if(!value.allow) {
          allow_false += 1
        }
      }
    })

    if(allow_false === 0) {
      temp_field_props.map(value => {
          if(value.access === state) {
            value.allow = false
          }
        })
    } else {
      temp_field_props.map(value => {
        if(value.access === state) {
          value.allow = true
        }
      })
    }
    formik.setFieldValue("privileges", temp_field_props);
  }

  return (
    <>
      <ModalRole
        t={t}
        state={stateAddModal}
        closeModal={closeAddModal}
        loading={loading}
        alert={alert}
        title={t("addNewRole")}
        formikRole={formikAddRole}
        validationRole={validationAddRole}
        accessLists={allAccessLists}
        handleSelectAll={handleSelectAll}
      />

      <ModalRole
        t={t}
        state={stateEditModal}
        closeModal={closeEditModal}
        loading={loading}
        alert={alert}
        title={`${t("editRole")} - ${formikEditRole.getFieldProps("name").value}`}
        formikRole={formikEditRole}
        validationRole={validationEditRole}
        accessLists={allAccessLists}
        handleSelectAll={handleSelectAll}
      />

      <ConfirmModal
        title={`${t("deleteRole")} - ${selectedRole.name}`}
        body={t("areYouSureWantToDelete?")}
        buttonColor="danger"
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        handleClick={() => handleDeleteRole(selectedRole.id)}
        loading={loading}
        alert={alert}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("roleManagement")}</h3>
              </div>
              <div className="headerEnd">
                <Button
                  variant="primary"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={showAddModal}
                >
                  {t("addNewRole")}
                </Button>
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
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataRole()}
              // expandableRows
              // expandableRowsComponent={ExpandableComponent}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
