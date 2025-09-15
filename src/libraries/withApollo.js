import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import GLOBALS from '../Globals';
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
// import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

// const httpLink = new HttpLink({ uri: GLOBALS.SERVER_API });
const httpLink = new createUploadLink({ uri: GLOBALS.SERVER_API });
const authLink = setContext(async (req, { headers }) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const LANG = await AsyncStorage.getItem('LANG');
  return {
    ...headers,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : null,
      Language: LANG ? LANG : 'TH',
      Appversion: DeviceInfo.getVersion(),
    },
  };
});

const link = authLink.concat(httpLink);

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
};

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions,
});
