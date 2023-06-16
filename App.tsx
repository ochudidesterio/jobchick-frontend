import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from '../../jobfinder/jobfinder/src/screens/SplashScreen';

import {Provider, useDispatch, useSelector} from 'react-redux';
import {store, persistor} from './src/store/store.js';
import {loginSuccess} from './src/store/slices/authSlice';
import {PersistGate} from 'redux-persist/es/integration/react';

import AuthStack from './src/navigation/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeTabs from './src/navigation/HomeTabs';


const Stack = createNativeStackNavigator();



function App() {
  const loggedIn = useSelector(state => state.auth.loggedIn);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    // Add your logic to check if the user is already logged in
    // If the user is logged in, dispatch an action to update the auth state
    if (loggedIn) {
      dispatch(loginSuccess(user));
    }
  }, []);
  console.log(loggedIn);
  console.log(user);
  console.log("Token",AsyncStorage.getItem('token'))
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        {loggedIn ? (
          <>
            <Stack.Screen name="HomeTabs" component={HomeTabs} />
          </>
        ) : (
          <>
            <Stack.Screen name="authStack" component={AuthStack} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}



export default function Main() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
}

