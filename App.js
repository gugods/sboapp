import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
// import SplashScreen from 'react-native-splash-screen';

export let reloadScreen;

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handelOnloadApp = async () => {
      reloadScreen = setLoading;
      // SplashScreen.hide();
      setLoading(false);
    };

    handelOnloadApp();
  }, []);
  return (
    !loading && (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Hello</Text>
      </View>
    )
  );
}

export default App;
