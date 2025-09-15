import I18n from '../i18n';

import {
  GET_AREAS,
  GET_EMPLOYEE,
  GET_MODULES,
  GET_NOTIFICATIONS,
  GET_PRODUCT_ID,
  GET_PRODUCTS,
  LOGIN_EMPLOYEE,
  LOGOUT_EMPLOYEE,
  SEND_CONTACT,
} from './graphql';

export const getModules = async (client) => {
  const result = await client
    .query({
      query: GET_MODULES,
      variables: { random: Math.random() },
    })
    .then(async (res) => res.data.getModules)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getEmployees = async (client) => {
  const result = await client
    .query({
      query: GET_EMPLOYEE,
      variables: { random: Math.random() },
    })
    .then(async (res) => res.data.getEmployee)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getAreas = async (client) => {
  const result = await client
    .query({
      query: GET_AREAS,
      variables: { random: Math.random() },
    })
    .then(async (res) => res.data.getAreas)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getNotifications = async (client) => {
  const result = await client
    .query({
      query: GET_NOTIFICATIONS,
      variables: { random: Math.random() },
    })
    .then(async (res) => res.data.getNotifications)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getProducts = async (client) => {
  const result = await client
    .query({
      query: GET_PRODUCTS,
      variables: { random: Math.random() },
    })
    .then(async (res) => res.data.getProducts)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const getProductId = async (client, { products_id }) => {
  const result = await client
    .query({
      query: GET_PRODUCT_ID,
      variables: { products_id, random: Math.random() },
    })
    .then(async (res) => res.data.getProducts)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const loginEmployee = async (client, { username, password }) => {
  const result = await client
    .mutate({
      mutation: LOGIN_EMPLOYEE,
      variables: {
        username: username,
        password: password,
      },
    })
    .then(async (res) => res.data.loginEmployee)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const logoutEmployee = async (client) => {
  const result = await client
    .mutate({
      mutation: LOGOUT_EMPLOYEE,
      variables: {},
    })
    .then(async (res) => res.data.logoutEmployee)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};

export const sendContact = async (client, { subject, message }) => {
  const result = await client
    .mutate({
      mutation: SEND_CONTACT,
      variables: { subject, message },
    })
    .then(async (res) => res.data.sendContact)
    .catch((err) => ({ status: false, error: I18n.t('ALERT_API') }));
  return result;
};
