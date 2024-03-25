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
import { Link, useHistory, useLocation } from 'react-router-dom'
import './style.css'
import { useDropzone } from "react-dropzone";

export default function EditArticlePage() {
  const [deletePhoto, setDeletePhoto] = useState(false)

  const API_URL = process.env.REACT_APP_API_URL;
  const history = useHistory()
  const location = useLocation()
  const {
    allOutlets,
    rows
  } = location.state
  console.log('location', location)
  const { t } = useTranslation()

  const [content, setContent] = useState(rows.body)
  const [loading, setLoading] = useState(false)

  const [photo, setPhoto] = useState(rows.image ? `${API_URL}/${rows.image}` : "");
  const [photoPreview, setPhotoPreview] = useState(rows.image ? `${API_URL}/${rows.image}` : "");
  const [alertPhoto, setAlertPhoto] = useState("")

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
      setDeletePhoto(false)
    } else {
      preview = "";
      setAlertPhoto("file is too large or not supported");
    }
  };

  const handleDeletePhoto = () => {
    setPhoto("");
    setPhotoPreview("");
    setDeletePhoto(true)
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg,image/png",
    maxSize: 3 * 1000 * 1000,
    onDrop(file) {
      handlePreviewPhoto(file);
    }
  });

  const initialValues = {
    id: rows.id,
    business_id: rows.business_id,
    outlet_id: rows.outlet_id,
    title: rows.title,
    active: rows.active ? 'true' : 'false',
    hide: rows.hide ? 'true' : 'false'
  }

  const formikEdit = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (async (values) => {
      setLoading(true)
      const active = values.active === 'true' ? true : false;
      const hide = values.hide === 'true' ? true : false
      try {
        const formData = new FormData()
        formData.append("outlet_id", values.outlet_id)
        formData.append("business_id", values.business_id)
        formData.append("title", values.title)
        formData.append("image", photo)
        formData.append("body", content)
        formData.append("active", active)
        formData.append("hide", hide)
        formData.append('deletePhoto', deletePhoto)

        await axios.patch(`${API_URL}/api/v1/news-article/${values.id}`, formData)
        setLoading(false)
        history.push("/article");
      } catch (error) {
        setLoading(false)
        console.log('error', error)
      }
    })
  })

  const optionsOutlet = allOutlets.map(value => {
    return { value: value.id, label: value.name }
  })

  const defaultValueOutlet = optionsOutlet.find(
    (val) => val.value === formikEdit.values.outlet_id
  );

  return (
    <div>
      <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
        <Form onSubmit={formikEdit.handleSubmit}>
          <div className="headerPage mb-2">
            <div className="headerStart">
              <h3>{t('editArticle')}</h3>
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
              defaultValue={defaultValueOutlet}
              options={optionsOutlet}
              placeholder={t('select')}
              name="outlet_id"
              className="basic-single"
              classNamePrefix="select"
              onChange={(value) =>{
                formikEdit.setFieldValue("outlet_id", value.value)
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>{t("title")}</Form.Label>
            <Form.Control
              type="text"
              name="title"
              {...formikEdit.getFieldProps("title")}
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
                value={formikEdit.values.active}
                control={
                  <Switch
                    color="primary"
                    checked={formikEdit.values.active == 'true' ? true : false}
                    onChange={(e) => {
                      if (formikEdit.values.active == e.target.value) {
                        if (formikEdit.values.active == 'true') {
                          console.log('masuk true')
                          formikEdit.setFieldValue("active", 'false')
                        } else {
                          console.log('masuk false')
                          formikEdit.setFieldValue("active", 'true')
                        }
                      }
                    }}
                    name=""
                  />
                }
              />
              <div>{t("hide")}</div>
              <FormControlLabel 
                value={formikEdit.values.hide}
                control={
                  <Switch
                    color="primary"
                    checked={formikEdit.values.hide == 'true' ? true : false}
                    onChange={(e) => {
                      if (formikEdit.values.hide == e.target.value) {
                        if (formikEdit.values.hide == 'true') {
                          console.log('masuk true')
                          formikEdit.setFieldValue("hide", 'false')
                        } else {
                          console.log('masuk false')
                          formikEdit.setFieldValue("hide", 'true')
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
