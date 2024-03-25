import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const LOGIN_URL = `${API_URL}/api/v1/auth/login`;
export const LOGIN_STAFF_URL = `${API_URL}/api/v1/auth/staff/login`;
export const REGISTER_URL = `${API_URL}/api/v1/auth/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/api/v1/forget-password`;
export const ME_URL = `${API_URL}/api/v1/business`;
export const LOGOUT_OWNER = `${API_URL}/api/v1/auth/logout`;
export const LOGOUT_STAFF = `${API_URL}/api/v1/auth/staff/logout`;
export const ROLLBACK_REGISTRATION = `${API_URL}/api/v1/auth/rollback`;

export function login(email, password, captcha) {
  return axios.post(LOGIN_URL, {
    email,
    password,
    "g-recaptcha-response": captcha
  });
}

export function loginStaff(staff_id, email, password, device) {
  return axios.post(LOGIN_STAFF_URL, {
    staff_id,
    email,
    password,
    // device_id: device
    device_id: null
  });
}

export function register(email, name, phone_number, password, captcha, language, country_code_iso3) {
  return axios.post(REGISTER_URL, {
    email,
    name,
    phone_number,
    password,
    language,
    country_code_iso3,
    "g-recaptcha-response": captcha
  });
}

export function cancelRegistration() {
  const { business_id } = JSON.parse(localStorage.getItem("user_info"));
  return axios.delete(`${ROLLBACK_REGISTRATION}?id=${business_id}`);
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  const { business_id } = JSON.parse(localStorage.getItem("user_info"));
  return axios.get(`${ME_URL}/${business_id}`);
}

export function logout() {
  const { privileges } = JSON.parse(localStorage.getItem("user_info"));
  const user = privileges ? "staff" : "owner";

  if (user === "staff") {
    console.log("LOGOUT STAFF")
    return axios.post(`${LOGOUT_STAFF}`);
  } else {
    console.log("LOGOUT OWNER")
    return axios.post(`${LOGOUT_OWNER}`);
  }
}
