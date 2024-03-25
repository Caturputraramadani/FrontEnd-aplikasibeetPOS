import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { 
  Paper, 
  Switch,
  FormControlLabel
} from "@material-ui/core";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Form, Button, Spinner, Row, Col, Alert } from 'react-bootstrap'
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import Select from 'react-select'
import { Link, useHistory } from 'react-router-dom'
import './style.css'
import { useDropzone } from "react-dropzone";
export default function AddArticlesPage() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { t } = useTranslation()
  const [allOutlets, setAllOutlets] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [alertPhoto, setAlertPhoto] = useState("")

  const history = useHistory()

  const handlePreviewPhoto = (file) => {
    setAlertPhoto("");
    let preview;
    let img;

    if (file.length) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          console.log("reader.result", reader.result);
          setPhotoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file[0]);
      img = file[0];
      console.log("img", img);
      setPhoto(img);
    } else {
      preview = "";
      setAlertPhoto("file is too large or not supported");
    }
  };

  const handleDeletePhoto = () => {
    setPhoto("");
    setPhotoPreview("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 3 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

  const initialValues = {
    outlet_id: '',
    title: '',
    active: 'true',
    hide: 'false'
  }

  const formikAdd = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (async (values) => {
      setLoading(true)
      console.log('Data sebelm dikirim', values, content)
      const user_info = JSON.parse(localStorage.getItem('user_info'))
      try {
        const hide = values.hide === 'true' ? true : false
        const active = values.active === 'true' ? true : false

        const formData = new FormData()
        formData.append("outlet_id", values.outlet_id);
        formData.append("business_id", user_info.business_id);
        formData.append("title", values.title);
        formData.append("image", photo);
        formData.append("body", content);
        formData.append("active", active);
        formData.append("hide", hide);

        await axios.post(`${API_URL}/api/v1/news-article`, formData)
        setLoading(false)
        history.push("/article");
      } catch (error) {
        setLoading(false)
        console.log('error', error)
      }
    })
  })

  const getOutlet = async () => {
    try {
      const outlets = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(outlets.data.data);
    } catch (err) {
      setAllOutlets([]);
    }
  };

  useEffect(() => {
    getOutlet()
  }, [])

  const optionsOutlet = allOutlets.map(value => {
    return { value: value.id, label: value.name }
  })

  return (
    <div>
      <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
        <Form onSubmit={formikAdd.handleSubmit}>
          <div className="headerPage mb-2">
            <div className="headerStart">
              <h3>{t('addArticle')}</h3>
            </div>
            <div className="headerEnd">
              <Link to="/article">
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

          <Form.Group>
            <Form.Label>{t("outlet")}</Form.Label>
            <Select
              options={optionsOutlet}
              placeholder={t('select')}
              name="outlet_id"
              className="basic-single"
              classNamePrefix="select"
              onChange={(value) =>{
                formikAdd.setFieldValue("outlet_id", value.value)
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t("title")}</Form.Label>
            <Form.Control
              type="text"
              name="title"
              {...formikAdd.getFieldProps("title")}
              required
            />
          </Form.Group>

          <div className="App">
          <Form.Label>{t("body")}</Form.Label>
            <CKEditor
              editor={ ClassicEditor }
              data={content}
              onReady={ editor => {
                  // You can store the "editor" and use when it is needed.
                  console.log( 'Editor is ready to use!', editor );
              } }
              onChange={ ( event, editor ) => {
                  const data = editor.getData();
                  console.log( { event, editor, data } );
                  setContent(data)
              } }
              onBlur={ ( event, editor ) => {
                  console.log( 'Blur.', editor );
              } }
              onFocus={ ( event, editor ) => {
                  console.log( 'Focus.', editor );
              } }
            />
          </div>

          <Row className='mt-5'>
            <Col>
              {alertPhoto ? (
                <Alert variant="danger">{alertPhoto}</Alert>
              ) : (
                ""
              )}
              <div
                {...getRootProps({
                  className: "boxDashed dropzone article-image"
                })}
              >
                <input {...getInputProps()} />
                {!photoPreview ? (
                  <>
                    <p>{t("dragAndDrop")}</p>
                    <p style={{ color: "gray" }}>{t("fileSizeLimit")}</p>
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
                    {t("removePhoto")}
                  </Button>
                </div>
              ) : (
                ""
              )}
            </Col>
            <Col>
              <div className='mt-2'>{t("active")}</div>
              <FormControlLabel 
                value={formikAdd.values.active}
                control={
                  <Switch
                    color="primary"
                    checked={formikAdd.values.active == 'true' ? true : false}
                    onChange={(e) => {
                      if (formikAdd.values.active == e.target.value) {
                        if (formikAdd.values.active == 'true') {
                          console.log('masuk true')
                          formikAdd.setFieldValue("active", 'false')
                        } else {
                          console.log('masuk false')
                          formikAdd.setFieldValue("active", 'true')
                        }
                      }
                    }}
                    name=""
                  />
                }
              />
              <div>{t("hide")}</div>
              <FormControlLabel 
                value={formikAdd.values.hide}
                control={
                  <Switch
                    color="primary"
                    checked={formikAdd.values.hide == 'true' ? true : false}
                    onChange={(e) => {
                      if (formikAdd.values.hide == e.target.value) {
                        if (formikAdd.values.hide == 'true') {
                          console.log('masuk true')
                          formikAdd.setFieldValue("hide", 'false')
                        } else {
                          console.log('masuk false')
                          formikAdd.setFieldValue("hide", 'true')
                        }
                      }
                    }}
                    name=""
                  />
                }
              />
            </Col>
          </Row>
        </Form>
      </Paper>
    </div>
  )
}
