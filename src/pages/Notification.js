// src/pages/Notification.js
import GLOBALS from '../Globals';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { CardRow, InputSearch, Spinner, Table } from '../components';
import { createFilter } from 'react-native-search-filter';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { getFormatDate } from '../libraries/Helper';
import { getNotifications } from '../services/employeeService';
import { useApolloClient } from 'react-apollo';

const KEYS_TO_FILTERS = ['title', 'message'];

function Notification() {
  const { t } = useTranslation();
  const client = useApolloClient();

  const [notificationList, setNotificationList] = useState({ loading: false, data: [] });
  const [searchMessage, setSearchMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  async function handelGetNotifications() {
    let data = [];
    setNotificationList({ data, loading: true });
    const results = await getNotifications(client);
    if (results.status) {
      data = results.data;
    }
    setNotificationList({ data, loading: false });
  }

  useEffect(() => {
    handelGetNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await handelGetNotifications();
    setRefreshing(false);
  };

  function renderItem(rowData) {
    const date = moment(rowData.date).format('DD-MM-YYYY');
    const time = moment(rowData.date).format('HH:mm');
    return (
      <CardRow activeOpacity={1}>
        <View style={styles.leftStyle}>
          <Text style={styles.titleStyle}>
            <Icon name='megaphone' size={20} /> {rowData.title}
          </Text>
          <Text style={styles.descStyle}>{rowData.message}</Text>
        </View>
        <Text style={styles.dateStyle}>{getFormatDate(date) + ' ' + time}</Text>
      </CardRow>
    );
  }

  function renderContent() {
    if (notificationList.loading) {
      return <Spinner transparent={true} />;
    }
    if (notificationList.data.length > 0) {
      const filterStore = notificationList.data.filter(createFilter(searchMessage, KEYS_TO_FILTERS));
      return (
        <React.Fragment>
          {filterStore.length > 0 ? (
            <FlatList
              data={filterStore}
              renderItem={({ item }) => renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
              refreshControl={<RefreshControl title='Pull to refresh' titleColor={GLOBALS.COLOR_DESC} refreshing={refreshing} onRefresh={onRefresh} />}
            />
          ) : (
            <Table.Full textStyle={{ fontWeight: '500' }}>
              <Icon name='search' size={18} /> {t('ALERT_NODATA')}
            </Table.Full>
          )}
        </React.Fragment>
      );
    } else {
      return (
        <Table.Full textStyle={{ fontWeight: '500' }}>
          <Icon name='search' size={18} /> {t('ALERT_NODATA')}
        </Table.Full>
      );
    }
  }

  return (
    <React.Fragment>
      <View style={styles.container}>
        <InputSearch
          style={styles.inputSearch}
          inputStyle={styles.inputStyle}
          placeholder={`${t('TEXT_SEARCH')}...`}
          onChangeText={(searchMessage) => setSearchMessage(searchMessage)}
        />
        <Table>{renderContent()}</Table>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBALS.COLOR_GRAY,
    flex: 1,
    padding: 10,
  },
  leftStyle: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  titleStyle: {
    fontFamily: GLOBALS.FONT_NAME,
    fontSize: 16,
    color: GLOBALS.COLOR_MAIN,
    textAlign: 'left',
    marginBottom: 5,
  },
  descStyle: {
    fontFamily: GLOBALS.FONT_NAME,
    fontSize: 14,
    color: GLOBALS.COLOR_DESC,
    textAlign: 'left',
  },
  dateStyle: {
    fontFamily: GLOBALS.FONT_NAME,
    fontSize: 12,
    color: GLOBALS.COLOR_REMARK,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  fullStyle: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GLOBALS.COLOR_MAIN,
  },
  inputSearch: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: GLOBALS.COLOR_MAIN,
    marginBottom: 5,
    backgroundColor: GLOBALS.COLOR_GRAY,
  },
  inputStyle: {
    backgroundColor: GLOBALS.COLOR_GRAY,
  },
});

Notification.propTypes = {
  client: PropTypes.object,
};

export default Notification;
