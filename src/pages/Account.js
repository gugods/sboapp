// src/pages/Account.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import GLOBALS from '../Globals';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import React from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { reloadScreen } from '../../App';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '../libraries/StoreContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const languageList = [
  { id: 'EN', name: 'English' },
  { id: 'TH', name: 'ภาษาไทย' },
];

function Account() {
  const { t } = useTranslation();
  const { users } = useUserContext();

  function renderAvatar(image) {
    if (image === null || image === '') {
      return <Icon name='person-circle-outline' size={120} style={styles.iconAvatar} />;
    } else {
      return <Image source={{ uri: image }} style={styles.imageAvatar} />;
    }
  }

  async function onSelectedLang(LANG) {
    reloadScreen(true);

    let lang = await AsyncStorage.getItem('LANG');
    if (lang !== LANG[0]) {
      await AsyncStorage.setItem('LANG', LANG[0]);
      lang = LANG[0].toUpperCase();
    }

    i18next.changeLanguage(lang.toLowerCase());

    reloadScreen(false);
  }

  function renderArea() {
    if (users.app_roles_id === 2) {
      const areaItems = [];
      const employeeItems = [];
      users.areas.map((value) => {
        areaItems.push({ id: value.branchs_id, name: `${value.store_name} / ${value.branch_name}` });
      });
      users.employees.map((value) => {
        employeeItems.push({ id: value.employees_id, name: `${value.fullname} / ${t('TEXT_BRANCH')} ${value.branch_name}` });
      });
      return (
        <React.Fragment>
          <View style={styles.rowStyle}>
            <Icon name='home' size={25} style={styles.iconInfo} />
            <SectionedMultiSelect
              items={areaItems}
              uniqueKey='id'
              selectText={t('TEXT_BRANCH_UNDER')}
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
                  <Text style={styles.headerText}>{`${t('TEXT_BRANCH_UNDER')}`}</Text>
                </View>
              }
              hideSearch={true}
              IconRenderer={Icon}
              icons={GLOBALS.ICONS}
            />
          </View>
          <View style={styles.rowStyle}>
            <Icon name='people' size={25} style={styles.iconInfo} />
            <SectionedMultiSelect
              items={employeeItems}
              uniqueKey='id'
              selectText={t('TEXT_EMPLOYEE_UNDER')}
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
                  <Text style={styles.headerText}>{`${t('TEXT_EMPLOYEE_UNDER')}`}</Text>
                </View>
              }
              hideSearch={true}
              IconRenderer={Icon}
              icons={GLOBALS.ICONS}
            />
          </View>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  function renderPc() {
    if (users.app_roles_id === 3) {
      const areaName = users.area_name && users.area_name !== '' ? users.area_name : '-';
      return (
        <React.Fragment>
          <View style={styles.rowStyle}>
            <Icon name='home' size={25} style={styles.iconInfo} />
            <Text style={styles.textInfo}>{`${users.store_name} / ${users.branch_name}`}</Text>
          </View>
          <View style={styles.rowStyle}>
            <Icon name='person' size={25} style={styles.iconInfo} />
            <Text style={styles.textInfo}>{`${t('TEXT_AREA')} ${areaName}`}</Text>
          </View>
          <View style={styles.rowStyle}>
            <Icon name='folder' size={25} style={styles.iconInfo} />
            <Text style={styles.textInfo}>{users.section_name}</Text>
          </View>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  return (
    <ScrollView style={{ backgroundColor: GLOBALS.COLOR_WHITE }}>
      <View style={styles.container}>
        {renderAvatar(users.image)}
        <Text style={styles.titleStyle}>
          {t('TEXT_ID')} {users.username}
        </Text>
        <View style={styles.rowStyle}>
          <Icon name='person-circle-outline' size={25} style={styles.iconInfo} />
          <Text style={styles.textInfo}>{users.fullname}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Icon name='ribbon' size={25} style={styles.iconInfo} />
          <Text style={styles.textInfo}>{`${t('TEXT_POSITION')} ${users.roles_name}`}</Text>
        </View>
        {renderArea()}
        {renderPc()}
        <View style={styles.rowStyle}>
          <Icon name='call' size={25} style={styles.iconInfo} />
          <Text style={styles.textInfo}>{users.phone}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Icon name='flag' size={25} style={styles.iconInfo} />
          <SectionedMultiSelect
            items={languageList}
            uniqueKey='id'
            selectText={t('TEXT_LANGUAGE')}
            showDropDowns={true}
            single={true}
            onSelectedItemsChange={onSelectedLang}
            hideConfirm={false}
            confirmText={t('BUTTON_CLOSE')}
            styles={selectStyle}
            colors={selectColor}
            hideSearch={true}
            headerComponent={
              <View style={styles.headerBox}>
                <Text style={styles.headerText}>{`${t('TEXT_CHANGE_LANGUAGE')}`}</Text>
              </View>
            }
            IconRenderer={Icon}
            icons={GLOBALS.ICONS}
          />
        </View>
        <View style={styles.rowStyle}>
          <Icon name='information-circle' size={25} style={styles.iconInfo} />
          <Text style={styles.textInfo}>Version {DeviceInfo.getVersion()}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  titleStyle: {
    fontSize: 20,
    marginVertical: 20,
    color: GLOBALS.COLOR_TITLE,
  },
  iconAvatar: {
    color: GLOBALS.COLOR_MAIN,
  },
  imageAvatar: {
    marginTop: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: GLOBALS.COLOR_GRAY,
  },
  rowStyle: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    height: 50,
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: GLOBALS.COLOR_LINE,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconInfo: {
    marginRight: 20,
    width: 25,
    color: GLOBALS.COLOR_MAIN,
  },
  textInfo: {
    color: GLOBALS.COLOR_DESC,
    fontSize: 16,
  },
  btnSignOut: {
    backgroundColor: GLOBALS.COLOR_ACTIVE,
    height: 50,
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 50,
    borderBottomColor: GLOBALS.COLOR_LINE,
    alignItems: 'center',
    width: '100%',
  },
  textSignOut: {
    height: 30,
    textAlign: 'center',
    width: SCREEN_WIDTH - 20,
    color: GLOBALS.COLOR_WHITE,
    fontSize: 18,
  },
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
  listContainer: {
    height: 100,
  },
  selectToggle: {
    backgroundColor: GLOBALS.COLOR_WHITE,
    width: SCREEN_WIDTH - 80,
  },
  selectToggleText: {
    fontSize: 16,
    color: GLOBALS.COLOR_MAIN,
  },
  button: {
    backgroundColor: GLOBALS.COLOR_MAIN,
  },
  confirmText: {
    fontWeight: '100',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '100',
    paddingVertical: 5,
    color: GLOBALS.COLOR_DESC,
  },
};

const selectColor = {
  success: GLOBALS.COLOR_MAIN,
  text: GLOBALS.COLOR_DESC,
};

Account.propTypes = {
  userStore: PropTypes.object,
};

export default Account;
