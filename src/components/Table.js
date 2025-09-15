// src/components/Table.js

import CheckBox from 'react-native-checkbox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GLOBALS from '../Globals';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { ActivityIndicator, Dimensions, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Title = ({ children, style, textStyle }) => (
  <View style={[styles.title, style]}>
    <Text style={[styles.txtTitle, textStyle]}>{children}</Text>
  </View>
);
Title.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object
};

const Thead = ({ children, style }) => <View style={[styles.thead, style]}>{children}</View>;
Thead.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};

const TH = ({ children, style, textStyle, numberOfLines }) => (
  <View style={[styles.th, style]}>
    <Text style={[styles.txtTh, textStyle]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  </View>
);
TH.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  numberOfLines: PropTypes.any
};

const SORT = ({ children, style, textStyle, numberOfLines, onPress }) => (
  <View style={[styles.sort, style]}>
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.txtSort, textStyle]} numberOfLines={numberOfLines}>
        {children}
      </Text>
      <FontAwesome name='sort' color={GLOBALS.COLOR_MAIN} size={10} style={styles.iconSort} />
    </TouchableOpacity>
  </View>
);

TH.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  numberOfLines: PropTypes.any,
  onPress: PropTypes.func
};

const Tbody = ({ children, style, renderComponent, rowColor }) => {
  let rowStyle = {};
  if (rowColor !== undefined) {
    rowStyle = rowColor % 2 === 0 ? styles.oddStyle : styles.evenStyle;
  }
  return (
    <View style={[styles.tbody, rowStyle, style]}>
      <View style={{ flexDirection: 'row' }}>{children}</View>
      {renderComponent !== undefined ? <View style={{ flexDirection: 'row' }}>{renderComponent({ styles })}</View> : null}
    </View>
  );
};
Tbody.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  renderComponent: PropTypes.func,
  rowColor: PropTypes.number
};

const TD = ({ children, style, textStyle }) => (
  <View style={[styles.td, style]}>
    <Text style={[styles.txtTd, textStyle]}>{children}</Text>
  </View>
);
TD.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object
};

const Component = ({ children, style }) => <View style={[styles.td, style]}>{children}</View>;
Component.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};

const Link = ({ children, style, textStyle, onPress, disabled }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.td, style]}>
    <Text style={[styles.txtLink, textStyle]}>{children}</Text>
  </TouchableOpacity>
);
Link.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  onPress: PropTypes.func,
  disabled: PropTypes.bool
};

const Full = ({ children, style, textStyle }) => (
  <View style={[styles.full, style]}>
    <Text style={[styles.txtFull, textStyle]}>{children}</Text>
  </View>
);
Full.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  textStyle: PropTypes.object
};

const Loading = () => <ActivityIndicator style={{ marginVertical: 20 }} size='small' color='#cccccc' />;

const Input = ({ value, onChangeText, placeholder, secureTextEntry, refs, onFocus, onBlur, style, inputStyle, editable }) => (
  <View style={[styles.td, style]}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[styles.inputStyle, inputStyle]}
      autoCorrect={false}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      underlineColorAndroid='transparent'
      ref={refs}
      onBlur={onBlur}
      onFocus={onFocus}
      editable={editable}
    />
  </View>
);

Input.propTypes = {
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  refs: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  editable: PropTypes.bool
};

const Checkbox = ({ label, checked, onChange, style, chekcboxStyle, disabled }) => {
  label = label === undefined ? '' : label;
  return (
    <View style={[styles.td, style]}>
      <CheckBox disabled={disabled} label={label} checked={checked} onChange={onChange} checkboxStyle={[styles.chekcboxStyle, chekcboxStyle]} />
    </View>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  style: PropTypes.object,
  chekcboxStyle: PropTypes.object,
  disabled: PropTypes.bool
};

const Select = ({ placeholder, value, style, options, disabled, onValueChange }) => (
  <View style={[styles.td, style]}>
    {Platform.OS === 'ios' ? (
      <RNPickerSelect
        hideIcon={true}
        disabled={disabled}
        placeholder={{ label: placeholder }}
        placeholderTextColor={GLOBALS.COLOR_DESC}
        value={value}
        items={options}
        Icon={() => <Icon name='caret-down' color={GLOBALS.COLOR_THEAD} size={16} />}
        style={{ ...pickerSelectStyles }}
        onValueChange={onValueChange}
      />
    ) : (
      <RNPickerSelect
        hideIcon={true}
        disabled={disabled}
        placeholder={{ label: placeholder }}
        placeholderTextColor={GLOBALS.COLOR_DESC}
        value={value}
        items={options}
        style={{ ...pickerSelectStyles, placeholder: { ontSize: 12 } }}
        onValueChange={onValueChange}
      />
    )}
  </View>
);

Select.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  onValueChange: PropTypes.func
};

const Added = ({ style, textStyle, onPress, disabled, counter }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.btnAdd, style]}>
    {counter ? <Text style={[styles.counterAddStyle, textStyle]}>[ {counter} ]</Text> : null}
    <Icon name='add-circle' color={GLOBALS.COLOR_SUCCESS} size={25} />
  </TouchableOpacity>
);

Added.propTypes = {
  style: PropTypes.object,
  textStyle: PropTypes.object,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  counter: PropTypes.any
};

const Counter = ({ style, textStyle, counter }) => (
  <View style={[styles.btnAdd, style]}>{counter ? <Text style={[styles.counterStyle, textStyle]}>[ {counter} ]</Text> : null}</View>
);

Counter.propTypes = {
  style: PropTypes.object,
  textStyle: PropTypes.object,
  counter: PropTypes.any
};

const Deleted = ({ style, onPress, disabled }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.td, style]}>
    <Icon name='trash-bin' color={GLOBALS.COLOR_MAIN} size={20} />
  </TouchableOpacity>
);

Deleted.propTypes = {
  style: PropTypes.object,
  onPress: PropTypes.func,
  disabled: PropTypes.bool
};

const Button = ({ children, style, onPress, disabled }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.td, style]}>
    {children}
  </TouchableOpacity>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  onPress: PropTypes.func,
  disabled: PropTypes.bool
};

class Table extends React.Component {
  static Title = Title;
  static Thead = Thead;
  static TH = TH;
  static SORT = SORT;
  static Tbody = Tbody;
  static TD = TD;
  static Component = Component;
  static Link = Link;
  static Full = Full;
  static Loading = Loading;
  static Input = Input;
  static Checkbox = Checkbox;
  static Select = Select;
  static Added = Added;
  static Deleted = Deleted;
  static Button = Button;
  static Counter = Counter;

  render() {
    const { children, style } = this.props;
    return <View style={[styles.table, style]}>{React.Children.map(children, (child) => child)}</View>;
  }
}

const styles = StyleSheet.create({
  table: {
    marginTop: 10,
    marginBottom: 10
  },
  title: {
    paddingVertical: 20,
    paddingHorizontal: 5
  },
  txtTitle: {
    color: GLOBALS.COLOR_MAIN,
    fontSize: 20,
    fontWeight: '500'
  },
  thead: {
    flexDirection: 'row',
    borderBottomColor: GLOBALS.COLOR_GRAY2,
    borderBottomWidth: 1,
    borderTopColor: GLOBALS.COLOR_GRAY2,
    borderTopWidth: 1
  },
  th: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center'
  },
  sort: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: 'center'
  },
  txtSort: {
    color: GLOBALS.COLOR_MAIN,
    fontSize: 14,
    fontWeight: '500'
  },
  iconSort: {
    position: 'absolute',
    right: -10,
    top: 4
  },
  txtTh: {
    color: GLOBALS.COLOR_THEAD,
    fontSize: 14,
    fontWeight: '500'
  },
  tbody: {
    borderBottomColor: GLOBALS.COLOR_GRAY,
    borderBottomWidth: 1
  },
  td: {
    paddingVertical: 5,
    paddingHorizontal: 2,
    justifyContent: 'center'
  },
  txtTd: {
    color: GLOBALS.COLOR_TBODY,
    fontSize: 14
  },
  txtRemark: {
    color: GLOBALS.COLOR_CANCEL,
    fontSize: 12
  },
  txtLink: {
    color: GLOBALS.COLOR_MAIN,
    fontSize: 14
  },
  full: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center'
  },
  txtFull: {
    color: GLOBALS.COLOR_MAIN,
    fontSize: 14
  },
  inputStyle: {
    fontFamily: GLOBALS.FONT_NAME,
    fontWeight: GLOBALS.FONT_REG,
    fontSize: 14,
    color: GLOBALS.COLOR_TBODY,
    borderBottomWidth: 1,
    paddingVertical: 1,
    paddingHorizontal: 1,
    borderColor: GLOBALS.COLOR_GRAY2,
    width: '100%'
  },
  chekcboxStyle: {
    marginTop: 10,
    width: 20,
    height: 20
  },
  selectInput: {
    color: '#FFFFFF'
  },
  selectStyle: {
    backgroundColor: GLOBALS.COLOR_BLACK,
    height: 20,
    width: '100%'
  },
  oddStyle: {
    backgroundColor: GLOBALS.COLOR_WHITE
  },
  evenStyle: {
    backgroundColor: '#fafafa'
  },
  btnAdd: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  counterAddStyle: {
    position: 'relative',
    top: -7,
    marginRight: 5,
    fontSize: 14,
    color: GLOBALS.COLOR_REMARK
  },
  counterStyle: {
    position: 'relative',
    top: -7,
    right: -11,
    fontSize: 14,
    color: GLOBALS.COLOR_REMARK
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: GLOBALS.COLOR_DESC,
    fontSize: 12,
    width: 120
  },
  inputAndroid: {
    color: GLOBALS.COLOR_DESC,
    width: 120,
    fontSize: 12
  },
  placeholder: { color: GLOBALS.COLOR_DESC, fontSize: 12 },
  underline: { borderTopWidth: 0 },
  iconContainer: {
    top: 0,
    right: 15
  }
});

Table.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};

export default Table;
