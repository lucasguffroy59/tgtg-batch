const axios = require("axios");
const jwt = require("jsonwebtoken");
const secretUtil = require("../utils/secret");
const log = require("../utils/logger");

const URL = process.env.API_URL;
const LOGIN_ROUTE = process.env.API_LOGIN_ROUTE;
const ITEMS_ROUTE = process.env.API_ITEMS_ROUTE;

let AUTH_INFO = null;
let AUTH_VALIDITY = null;
let LOGIN_INFO = null;

// Value of secret for local execution
const DEFAULT = {
  LOGIN_EMAIL: process.env.LOGIN_EMAIL,
  LOGIN_PASSWORD: process.env.LOGIN_PASSWORD,
};

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
  if (AUTH_VALIDITY > Date.now() + 1 * 60 * 60 * 1000) {
    // If token is still valid (with a 1 hour safe margin)
    log.info("Token is still valid. Skip login.");
    return;
  }

  log.info("First login or token expired. Proceeding to login ...");
  LOGIN_INFO =
    process.env.STAGE === "localhost"
      ? DEFAULT
      : await secretUtil.getSecretContent(process.env.LOGIN_SECRET_TAG);
  const loginBody = {
    device_type: "ANDROID",
    email: LOGIN_INFO.LOGIN_EMAIL,
    password: LOGIN_INFO.LOGIN_PASSWORD,
  };
  const result = await axios({
    method: "post",
    url: URL + LOGIN_ROUTE,
    data: loginBody,
  });
  log.info(
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
  const result = await axios(options);
  const { items } = result.data;
  const validItems = items.filter((anItem) => anItem.items_available > 0);
  return validItems;
};

module.exports = { login, getAvailableBaskets };
