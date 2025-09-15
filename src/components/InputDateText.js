// src/components/InputDateText.js
// import DatePicker from 'react-native-datepicker';
import DatePicker from 'react-native-date-picker';

import GLOBALS from '../Globals';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { setDBFormatDate, getFormatDate } from '../libraries/Helper';

const InputDateText = ({ format, date, placeholder, onDateChange, mode, disabled, hide }) => {
  const width = 80;
  const opacity = hide === true ? 0 : 1;
  const customStyles = disabled === true ? disabledStyles : styles.dateInput;

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const newDate = date ? moment(setDBFormatDate(date)).toDate() : new Date();
  const showDate = date ? getFormatDate(date) : placeholder;
  const newFormat = format ? format : 'DD-MM-YYYY';
  const dateTextStyled = disabled === true ? { ...styles.dateText, color: GLOBALS.COLOR_DESC } : styles.dateText;

  return (
    <>
      <View style={{ position: 'absolute', width, opacity }}>
        <TouchableOpacity
          activeOpacity={disabled ? 1 : 0.5}
          onPress={() => {
            if (!disabled) {
              setOpen(true);
            }
          }}
        >
          <View style={customStyles}>
            <Text style={dateTextStyled}>{showDate}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <DatePicker
        modal
        open={open}
        date={newDate}
        onConfirm={(date) => {
          setOpen(false);
          const nextDate = moment(date).format(newFormat);
          onDateChange(nextDate);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        mode='date'
        locale='th_TH'
        confirmText={t('BUTTON_CONFIRM')}
        cancelText={t('BUTTON_CANCEL')}
        title={t('SELECT_DATE')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dateIcon: {
    position: 'absolute',
    left: 0,
    top: -2,
  },
  dateInput: {
    backgroundColor: GLOBALS.COLOR_GRAY,
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingLeft: 10,
    height: 25,
    marginLeft: 0,
    borderRadius: 8,
    borderColor: GLOBALS.COLOR_MAIN,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  disabled: {
    backgroundColor: GLOBALS.COLOR_GRAY,
  },
  placeholderText: {
    color: GLOBALS.COLOR_DESC,
    fontSize: 12,
  },
  dateText: {
    color: GLOBALS.COLOR_MAIN,
    fontSize: 12,
    marginLeft: 0,
  },
  btnTextConfirm: {
    color: GLOBALS.COLOR_MAIN,
  },
});

const disabledStyles = cloneDeep(styles.dateInput);
disabledStyles.backgroundColor = 'transparent';
disabledStyles.borderColor = 'transparent';
// disabledStyles.dateText.color = GLOBALS.COLOR_DESC;

InputDateText.propTypes = {
  format: PropTypes.string,
  date: PropTypes.string,
  placeholder: PropTypes.string,
  onDateChange: PropTypes.func,
  mode: PropTypes.string,
  disabled: PropTypes.bool,
  hide: PropTypes.bool,
};

export { InputDateText };
