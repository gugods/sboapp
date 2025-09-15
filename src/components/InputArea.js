// src/components/InputArea.js
import GLOBALS from '../Globals';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { GET_AREAS } from '../services/graphql';
import { getList } from '../libraries/Array';
import { Query } from 'react-apollo';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class InputArea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    const { selectedItems, onSelectedItemsChange, onSelectedItemObjectsChange, variables } = this.props;
    return (
      <View>
        <Query query={GET_AREAS} variables={{ ...variables, random: Math.random() }}>
          {({ loading, error, data }) => {
            let branchs = [];
            if (data && data.getAreas) {
              branchs = getList({ list: data.getAreas.data, id: 'branchs_id', name: 'branch_name' });
            }
            return (
              <SectionedMultiSelect
                ref={(ref) => (this.branchSelect = ref)}
                items={branchs}
                uniqueKey='id'
                selectText={t('TEXT_SEARCH_BRANCH') + '...'}
                showDropDowns={true}
                single={true}
                onSelectedItemsChange={onSelectedItemsChange}
                onSelectedItemObjectsChange={onSelectedItemObjectsChange}
                selectedItems={selectedItems}
                hideConfirm={false}
                confirmText={t('BUTTON_CLOSE')}
                searchPlaceholderText={t('TEXT_SEARCH_BRANCH') + '...'}
                styles={selectStyle}
                colors={selectColor}
                IconRenderer={Icon}
                icons={GLOBALS.ICONS}
              />
            );
          }}
        </Query>
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

InputArea.propTypes = {
  selectedItems: PropTypes.array,
  onSelectedItemsChange: PropTypes.func.isRequired,
  onSelectedItemObjectsChange: PropTypes.func,
  variables: PropTypes.object,
};

export default withTranslation()(InputArea);
