import { DateRangePicker } from 'react-date-range';
import dayjs from 'dayjs'

export default function setupAxios(axios, store) {
  axios.interceptors.request.use(
    (config) => {
      const {
        auth: { authToken }
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      return config;
    },
    (err) => Promise.reject(err)
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (err) => {
      let expired_app = false
      const dateNow = new Date()
      const dateNowFormat = dayjs(dateNow)
      const dateExpired = dayjs('2021-08-25')
      const resDate = dateExpired.diff(dateNowFormat, 'day')
      console.log("resDate", resDate)
      if(resDate < 1) {
        expired_app = true
      }
      
      // if (
      //   err.response?.status === 401 &&
      //   err.response?.data === "Unauthorized" || expired_app
      // ) {
      //   console.log("UNAUTHORIZED")
      //   localStorage.clear();
      //   window.location.replace("/auth/login");
      // } else if ( expired_app ) {
      //   if ( err.response?.status === 403 &&
      //     (err.response?.data.message === "token invalid" ||
      //       err.response?.data.message === "jwt expired")
      //   ) {
      //     console.log("TOKEN EXPIRED")
      //     localStorage.clear();
      //     window.location.replace("/auth/login");
      //   }
      // } else {
      //   return Promise.reject(err);
      // }

      if (
        err.response?.status === 401 &&
        err.response?.data === "Unauthorized"
      ) {
        localStorage.clear();
        window.location.replace("/auth/login");
      } else if (
        err.response?.status === 403 &&
        (err.response?.data.message === "token invalid" ||
          err.response?.data.message === "jwt expired")
      ) {
        localStorage.clear();
        window.location.replace("/auth/login");
      } else {
        return Promise.reject(err);
      }
      
    }
  );
}
