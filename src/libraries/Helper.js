import GLOBALS from '../Globals';
import moment from 'moment';
import { Dimensions, Platform } from 'react-native';
import { includes, last } from 'lodash';
import { NOT_ZERO, OVER_ZERO, STATUS_COMPLETED, STATUS_PENDING, STATUS_PENDING_SALES, STATUS_PENDING_STORE } from './Constant';
import I18n from '../i18n';

export const getHeightScroll = () => {
  let minHeight;
  const maxHeight = Dimensions.get('window').height;
  if (Platform.OS === 'ios') {
    if (maxHeight < 750) {
      // < iphone X
      minHeight = 400;
    } else {
      minHeight = 460;
    }
  } else {
    minHeight = 430;
  }
  return maxHeight - minHeight;
};

export const getScrollKeyboard = ({ hideKeyboard, maxPaddingTop }) => {
  let styleExtra = {};
  if (hideKeyboard) {
    styleExtra = { paddingTop: maxPaddingTop };
  } else {
    styleExtra = Platform.OS === 'ios' ? { position: 'absolute', top: 0 } : { position: 'absolute', top: -80 };
  }
  return styleExtra;
};

export const getMaxPaddingTop = () => {
  let maxPaddingTop;
  const maxHeight = Dimensions.get('window').height;
  if (Platform.OS === 'ios') {
    if (maxHeight < 750) {
      // < iphone X
      maxPaddingTop = 20;
    } else {
      maxPaddingTop = 60;
    }
  } else {
    maxPaddingTop = 20;
  }
  return maxPaddingTop;
};

export const getTextProductItem = ({ value, stock_date }) => {
  value.stock_date = stock_date[value.products_id] ? stock_date[value.products_id] : moment().format('DD-MM-YYYY');
  value.stock_date = getFormatDate(value.stock_date);
  value.stock_remark = value.stock_remark === '' || value.stock_remark === null ? '-' : value.stock_remark;
  let name = `${I18n.t('TEXT_DOC_NO')} ${value.stock_doc_no} ${I18n.t('TEXT_DATE')} ${value.stock_date}`;
  name += `\n${I18n.t('TEXT_TYPE')} ${I18n.t(`TEXT_${value.stock_type}`)} ${I18n.t('TEXT_REMARK')} ${value.stock_remark}`;
  return name;
};

export const getStockCountDate = () => {
  const day = parseInt(moment().format('D'));
  if (includes(GLOBALS.DATE_ALLOWS, day)) {
    return GLOBALS.CUTOFF_DATE + '-' + moment().format('MM-YYYY');
  } else {
    return moment().format('DD-MM-YYYY');
  }
};

export const checkStockCountDate = (stock_date, app_roles_id) => {
  if (app_roles_id === 1) return true;
  const date_counter = GLOBALS.CUTOFF_DATE + '-' + moment().format('MM-YYYY');
  const day = parseInt(moment().format('D'));
  if (includes(GLOBALS.DATE_ALLOWS, day) && date_counter === stock_date) {
    return true;
  } else {
    return false;
  }
};

export const checkStockInOutDate = (stock_date, app_roles_id) => {
  if (app_roles_id === 1) return true;
  const dates = stock_date.split('-');
  const date = `${dates[2]}-${dates[1]}-${dates[0]}`;
  const day = parseInt(moment().format('D'));
  const cutoff_date = last(GLOBALS.DATE_ALLOWS);
  // วันที่ปัจจุบันเป็นวันที่ 1 - 15 วันที่ทำรายการต้องมากกว่าวันที่ 10 เดือนที่แล้ว
  if (day <= cutoff_date) {
    const select_date = parseInt(moment(date).format('YYYYMMDD'));
    const check_date = parseInt(moment().subtract(1, 'months').format('YYYYMM') + GLOBALS.CUTOFF_DATE);
    return select_date > check_date;
    // วันที่ทำรายการต้องมากกว่าวันที่  10 เดือนที่ปัจจุบัน
  } else {
    const select_date = parseInt(moment(date).format('YYYYMMDD'));
    const check_date = parseInt(moment().format('YYYYMM') + GLOBALS.CUTOFF_DATE);
    return select_date > check_date;
  }
};

export const setFormatDate = (date) => {
  const dates = date.split('-');
  const day = dates[0];
  const month = dates[1];
  let year = Number(dates[2]);
  if (year > 2500) year = year - 543;
  return `${day}-${month}-${year}`;
};

export const getFormatDate = (date) => {
  const dates = date.split('-');
  const day = dates[0];
  const month = dates[1];
  let year = Number(dates[2]);
  if (year < 2500) year = year + 543;
  return `${day}/${month}/${year}`;
};

export const setDBFormatDate = (date) => {
  const dates = date.split('-');
  const day = dates[0];
  const month = dates[1];
  let year = Number(dates[2]);
  if (year > 2500) year = year - 543;
  return `${year}-${month}-${day}`;
};

export const getDBFormatDate = (date) => {
  const dates = date.split('-');
  const day = dates[2];
  const month = dates[1];
  let year = Number(dates[0]);
  if (year > 2500) year = year - 543;
  return `${day}-${month}-${year}`;
};

export const getMonthName = (select_month) => {
  const months = select_month.split('-');
  const month = Number(months[0]);
  const startYear = Number(months[1]);
  const txtMonth = month < 10 ? `0${month}` : month;
  const endMonth = month + 1;
  let txtEndMonth = endMonth < 10 ? `0${endMonth}` : endMonth;
  let endYear = startYear;
  if (month === 12) {
    endYear = Number(endYear) + 1;
    txtEndMonth = '01';
  }
  return `11/${txtMonth}/${Number(startYear) + 543} - 10/${txtEndMonth}/${Number(endYear) + 543}`;
};

export const getCurrentMonth = () => {
  const day = parseInt(moment().format('DD'));
  if (day > 10) {
    return moment().format('MM-YYYY');
  } else {
    return moment().subtract(1, 'months').format('MM-YYYY');
  }
};

export const filterSumTotal = ({ count, isFilter }) => {
  let isStatus = true;
  if (isFilter === OVER_ZERO) {
    isStatus = count > 0;
  } else if (isFilter === NOT_ZERO) {
    isStatus = count !== 0;
  }
  return isStatus ? '1' : '0';
};

export const filterTotalActive = (fieldFilter, fieldActive) => {
  if (fieldFilter === fieldActive) {
    return {
      style: { backgroundColor: GLOBALS.COLOR_MAIN },
      textStyle: { color: GLOBALS.COLOR_WHITE },
    };
  } else {
    return { style: {}, textStyle: {} };
  }
};

export const getTextStatusPending = (stock_status) => {
  switch (stock_status) {
    case 'PENDING_SALES':
      return STATUS_PENDING_SALES;
    case 'PENDING_STORE':
      return STATUS_PENDING_STORE;
    case 'COMPLETED':
      return STATUS_COMPLETED;
    default:
      return STATUS_PENDING;
  }
};
