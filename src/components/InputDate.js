// src/components/InputDate.js
// import DatePicker from 'react-native-datepicker';
import DatePicker from 'react-native-date-picker';

import GLOBALS from '../Globals';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { setDBFormatDate, getFormatDate } from '../libraries/Helper';

const InputDate = ({ format, date, placeholder, onDateChange, mode, disabled, hideIcon }) => {
  const width = hideIcon === true ? 120 : 160;
  const showIcon = hideIcon !== true;
  const customStyles = hideIcon === true ? hideStyles : styles.dateInput;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const newDate = date ? moment(setDBFormatDate(date)).toDate() : new Date();
  const showDate = date ? getFormatDate(date) : placeholder;
  const newFormat = format ? format : 'DD-MM-YYYY';

  return (
    <>
      <View style={{ position: 'relative', width }}>
        {showIcon && <Icon style={styles.dateIcon} name='calendar' size={35} color={GLOBALS.COLOR_MAIN} />}
        <TouchableOpacity
          activeOpacity={disabled ? 1 : 0.5}
          onPress={() => {
            if (!disabled) {
              setOpen(true);
            }
          }}
        >
          <View style={customStyles}>
            <Text style={styles.dateText}>{showDate}</Text>

            {!disabled && <Icon style={styles.selectIcon} name='chevron-down-outline' size={17} color={GLOBALS.COLOR_BLACK} />}
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
  //
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
    height: 35,
    marginLeft: 40,
    marginTop: 0,
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
    fontSize: 14,
  },
  dateText: {
    color: GLOBALS.COLOR_MAIN,
    fontSize: 14,
    marginLeft: 10,
  },
  btnTextConfirm: {
    color: GLOBALS.COLOR_MAIN,
  },
  selectIcon: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
});

const hideStyles = cloneDeep(styles.dateInput);
hideStyles.marginLeft = 0;

InputDate.propTypes = {
  format: PropTypes.string,
  date: PropTypes.string,
  placeholder: PropTypes.string,
  onDateChange: PropTypes.func,
  mode: PropTypes.string,
  disabled: PropTypes.bool,
  hideIcon: PropTypes.bool,
};

export { InputDate };
