import React, { useState, useEffect } from 'react'
import './style.css'

import ChatIcon from '../../../images/chat-bubble.png'

import { useTranslation } from "react-i18next";
import {
  Form
} from "react-bootstrap";

export default function ChatBox() {
  const { t } = useTranslation();
  const [openChatBox, setOpenChatBox] = useState(false)
  
  const handleToggleChatbox = () => setOpenChatBox(!openChatBox)
  const closeChatBox = () => setOpenChatBox(false)

  return (
    <div className="chatbox-background">
      {openChatBox ? (
        <div className="chatbox-form-container">
          {/* <div className="d-flex justify-content-end">
            <div className="chatbox-wrapper-icon-hide">
              <img src={HideBox} alt="Hide Box" />
            </div>
          </div> */}
          <div className="chatbox-form">
            <Form.Group>
              <Form.Label>{t("name")}*</Form.Label>
              <Form.Control
                type="text"
                name="name"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("Email")}*</Form.Label>
              <Form.Control
                type="text"
                name="email"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("phoneNumber")}*</Form.Label>
              <Form.Control
                type="number"
                name="name"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("message")}*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                as="textarea" 
                rows="3"
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <div className="chatbox-button">
                {t('send')}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="d-flex align-items-center">
        <div className="chatbox-wrapper-icon">
          <img src={ChatIcon} alt="Chat Icon" />
        </div>
        <div className="ml-2">Beetpos Support</div>
        <div className="chatbox-button ml-2" onClick={handleToggleChatbox}  onBlur={closeChatBox}>
          {t('chatNow')}
        </div>
      </div>
    </div>
  )
}
