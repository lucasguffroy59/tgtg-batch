const axios = require("axios");
const jwt = require("jsonwebtoken");

const URL = process.env.API_URL;
const LOGIN_ROUTE = process.env.API_LOGIN_ROUTE;
const ITEMS_ROUTE = process.env.API_ITEMS_ROUTE;
const LOGIN_DATA = {
  device_type: "ANDROID",
  email: process.env.LOGIN_EMAIL,
  password: process.env.LOGIN_PASSWORD,
};

let AUTH_INFO = null;
let AUTH_VALIDITY = null;

const BASE_ITEMS_BODY = {
  page_size: 400,
  page: 1,
  discover: false,
  favorites_only: false,
  item_categories: [],
  diet_categories: [],
  pickup_earliest: null,
  pickup_latest: null,
  search_phrase: null,
  with_stock_only: false,
  hidden_only: false,
  we_care_only: false,
};

/**
 * TGTG API - Login and put Auth info in memory
 */
const login = async () => {
  if (AUTH_VALIDITY > Date.now() + 60 * 60 * 1000) {
    // If token is still valid (with a 1 hour safe margin)
    console.log("Token is still valid. Skip login.");
    return;
  }
  console.log("First login or token expired. Proceeding to login ...");
  const result = await axios({
    method: "post",
    url: URL + LOGIN_ROUTE,
    data: LOGIN_DATA,
  });
  console.log(
    "Login successfull. Storing auth info and token expiration date in memory."
  );
  AUTH_INFO = result.data;
  AUTH_VALIDITY = new Date(jwt.decode(AUTH_INFO.access_token).exp * 1000);
};

/**
 * TGTG API - Fetch available baskets from businesses in an area
 * @param {number} latitude Geolocalization latitude
 * @param {number} longitude  Geolocalization longitude
 * @param {number} radius Radius, in kilometers
 * @returns {Promise<array>} Available baskets
 */
const getAvailableBaskets = async (latitude, longitude, radius) => {
  await login();
  const body = {
    ...BASE_ITEMS_BODY,
    user_id: AUTH_INFO?.startup_data?.user?.user_id,
    origin: { latitude, longitude },
    radius,
  };
  const options = {
    method: "post",
    url: URL + ITEMS_ROUTE,
    data: body,
    headers: {
      Authorization: `Bearer ${AUTH_INFO?.access_token}`,
    },
  };
  console.log("Fetching TGTG API items ...", options);
  const result = await axios(options);
  console.log("Number of items fetched", result.data.items.length);
  const { items } = result.data;
  const validItems = items.filter((anItem) => anItem.items_available > 0);
  console.log("Number of available items", validItems.length);
  return validItems;
};

module.exports = { getAvailableBaskets };
