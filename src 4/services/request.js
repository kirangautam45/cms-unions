import axios from "axios";
import apiLinks from "global/apiLinks";
// import loggedUser from "global/loggedUser";
// import { removeCookie } from "./session";
import * as env from "../lib/environment";
import Cookie from "./cookie";

export const axiosClient = axios.create({
  baseURL: `${env.API_HOST}/`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const refreshTokenAPI = async () => {
  if (typeof window !== "undefined" && Cookie.checkCookie("refreshToken")) {
    fetch(`${env.API_HOST}/${apiLinks.refreshToken}`, {
      headers: { Authorization: `Bearer ${Cookie.getCookie("refreshToken")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.response) {
          const {
            response: { accessToken, refreshToken, userInfo },
          } = data;
          const expiredTime = 14 * 24 * 60; // 14 days
          Cookie.setCookie("token", accessToken, expiredTime);
          Cookie.setCookie("refreshToken", refreshToken, expiredTime);
          localStorage.setItem("loggedUser", JSON.stringify(userInfo));
          // eslint-disable-next-line no-use-before-define
          setHeader(accessToken);
          window.location.reload();
        }
      })
      .catch(() => {
        localStorage.clear();
        Cookie.removeCookie("token");
        Cookie.removeCookie("refreshToken");
        window.location.href = "/cms";
      });
  } else {
    localStorage.clear();
    window.location.href = "/cms";
  }
};

axiosClient.interceptors.response.use(
  (response) => response,
  // eslint-disable-next-line consistent-return
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        refreshTokenAPI();
      } else {
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export const setHeader = (token) => {
  axiosClient.defaults.headers.common.authorization = `Bearer ${token}`;
};

if (Cookie.checkCookie("token")) {
  setHeader(Cookie.getCookie("token"));
}

export const post = async (endpoint, data) => axiosClient.post(endpoint, data);

export const patch = async (endpoint, data) => axiosClient.patch(endpoint, data);

export const get = async (endpoint) => axiosClient.get(endpoint);

export const put = async (endpoint, data) => axiosClient.put(endpoint, data);

export const deleteReq = async (endpoint) => axiosClient.delete(endpoint);

export const postUploadImage = async (endpoint, data) =>
  axiosClient.post(endpoint, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const postBasicAuth = async (endpoint, data) => axiosClient.post(endpoint, data);

export const postWithToken = async (endpoint, data) => axiosClient.post(endpoint, data);

export const patchWithToken = async (endpoint, data) => axiosClient.patch(endpoint, data);

export const putWithToken = async (endpoint, data) => axiosClient.put(endpoint, data);

export const loadPublicData = (link, filters, FAfterLoadCompleted, FErrorMessage) => {
  post(link, filters)
    .then((responseData) => {
      FAfterLoadCompleted(responseData);
    })
    .catch((error) => {
      // apiLinks.setState({ errorMessage: error.toString() });
      console.error("There was an error after F::loadPublicData !: ", error);
      FErrorMessage(error);
      return "error";
    });
};

export const loadFilteredList = (link, filters, FAfterLoadCompleted) => {
  post(link, filters)
    .then((jsonData) => {
      FAfterLoadCompleted(jsonData);
    })
    .catch((error) => {
      console.error("There was an error!: ", error);
      return "error";
    });
};

export const loadObject = (link, objectID, FAfterLoadCompleted) => {
  get(`${link}${objectID}`)
    .then((responseData) => {
      FAfterLoadCompleted(responseData);
    })
    .catch((error) => {
      console.error("There was an error!: ", error);
      return "error";
    });
};

export const loadList = (link, FAfterLoadCompleted) => {
  get(link)
    .then((jsonData) => {
      FAfterLoadCompleted(jsonData);
    })
    .catch((error) => {
      console.error("There was an error!: ", error);
      FAfterLoadCompleted({});
      return "error";
    });
};

export const updateAPI = (link, id, details, FAfterLoadCompleted) => {
  post(`${link}${id}`, details)
    .then((jsonData) => {
      FAfterLoadCompleted(jsonData);
    })
    .catch((error) => {
      console.error("There was an error!: ", error);
      return "error";
    });
};

export const createAPI = (link, details, FAfterLoadCompleted) => {
  console.log("Details for creating: ", details);
  post(link, details)
    .then((jsonData) => {
      FAfterLoadCompleted(jsonData);
    })
    .catch((error) => {
      // apiLinks.setState({ errorMessage: error.toString() });
      console.error("There was an error!: ", error);
      return "error";
    });
};

export const deleteAPI = (link, id, FAfterDelete) => {
  deleteReq(`${link}${id}`)
    .then((jsonData) => {
      FAfterDelete(jsonData);
    })
    .catch((error) => {
      console.error("There was an error!: ", error);
      return "error";
    });
};
