// src/components/ShowItem.js
import GLOBALS from '../Globals';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class ShowItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    const { items, title } = this.props;
    return (
      <View>
        <SectionedMultiSelect
          ref={(ref) => (this.employeeSelect = ref)}
          items={items}
          uniqueKey='id'
          selectText={''}
          showDropDowns={true}
          single={true}
          onSelectedItemsChange={() => {}}
          hideConfirm={false}
          confirmText={t('BUTTON_CLOSE')}
          styles={selectStyle}
          colors={selectColor}
          readOnlyHeadings={true}
          headerComponent={
            <View style={styles.headerBox}>
              <Text style={styles.headerText}>{`${t('TEXT_PRODUCT')} ${title}`}</Text>
            </View>
          }
          hideSearch={true}
          IconRenderer={Icon}
          icons={GLOBALS.ICONS}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerBox: {
    backgroundColor: GLOBALS.COLOR_MAIN,
  },
  headerText: {
    textAlign: 'center',
    color: GLOBALS.COLOR_WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
});

const selectStyle = {
  selectToggle: {
    borderWidth: 0,
  },
  selectToggleText: {
    fontSize: 14,
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

ShowItem.propTypes = {
  items: PropTypes.any,
  title: PropTypes.string,
};

export default withTranslation()(ShowItem);
