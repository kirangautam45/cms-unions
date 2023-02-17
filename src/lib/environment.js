/* eslint-disable prettier/prettier */
// export const API_HOST='https://reqres.in/api';

export const API_HOST =
  process.env.REACT_APP_API_URL || "https://staging-api.wevolv.net/api/latest";
export const WSS_HOST = process.env.REACT_APP_WSS_URL || "wss://staging-api.wevolv.net/api/latest";
