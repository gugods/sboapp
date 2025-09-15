// src/components/InputMonth.js
import GLOBALS from '../Globals';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { getMonthName } from '../libraries/Helper';
import { last } from 'lodash';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class InputMonth extends Component {
  constructor(props) {
    super(props);
  }

  getDateList() {
    const results = [];
    const startYear = parseInt(moment().format('YYYY') - 3);
    const endYear = parseInt(moment().format('YYYY'));
    const currentValue = parseInt(moment().format('YYYYMMDD'));
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const txtMonth = month < 10 ? `0${month}` : month;
        const id = `${txtMonth}-${year}`;
        const name = getMonthName(id);
        const value = parseInt(`${year}${txtMonth}${GLOBALS.CUTOFF_DATE}`);
        if (value >= 20190810 && value < currentValue) {
          results.push({ id, name });
        }
      }
    }
    return results;
  }

  render() {
    const { t } = this.props;
    const { selectedItems, onSelectedItemsChange } = this.props;
    const items = this.getDateList();
    const currentMonth = items.length > 0 ? last(items).name : null;
    return (
      <View>
        <SectionedMultiSelect
          ref={(ref) => (this.monthSelect = ref)}
          items={items}
          uniqueKey='id'
          selectText={currentMonth}
          showDropDowns={true}
          single={true}
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedItems}
          hideConfirm={false}
          confirmText={t('BUTTON_CLOSE')}
          searchPlaceholderText={t('TEXT_SEARCH') + '...'}
          styles={selectStyle}
          colors={selectColor}
          showChips={false}
          IconRenderer={Icon}
          icons={GLOBALS.ICONS}
        />
      </View>
    );
  }
}

const selectStyle = {
  selectToggle: {
    backgroundColor: GLOBALS.COLOR_GRAY,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: GLOBALS.COLOR_MAIN,
    borderWidth: 1,
  },
  selectToggleText: {
    fontSize: 12,
    color: GLOBALS.COLOR_MAIN,
  },
  button: {
    backgroundColor: GLOBALS.COLOR_MAIN,
  },
  confirmText: {
    fontWeight: '100',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '100',
    paddingVertical: 5,
    color: GLOBALS.COLOR_DESC,
  },
};

const selectColor = {
  success: GLOBALS.COLOR_MAIN,
  text: GLOBALS.COLOR_DESC,
};

InputMonth.propTypes = {
  selectedItems: PropTypes.array,
  onSelectedItemsChange: PropTypes.func.isRequired,
};

export default withTranslation()(InputMonth);
