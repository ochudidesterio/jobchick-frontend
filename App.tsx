import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from '../../jobfinder/jobfinder/src/screens/SplashScreen';
import LoginScreen from '../../jobfinder/jobfinder/src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import FavouritesScreen from './src/screens/FavouritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store, persistor} from './src/store/store.js';
import {loginSuccess} from './src/store/slices/authSlice';
import {PersistGate} from 'redux-persist/es/integration/react';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeStack from './src/navigation/HomeStack';
import {GlobalStyles} from './src/colors';
import ProfileStack from './src/navigation/ProfileStack';
import AuthStack from './src/navigation/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image,StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SettingsScreen from './src/screens/SettingsScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: GlobalStyles.colors.white,
        tabBarInactiveTintColor: GlobalStyles.colors.avatar,
        tabBarBackground:()=>(<LinearGradient
          colors={[GlobalStyles.colors.colorPrimaryDark, GlobalStyles.colors.colorPrimaryLight]}
          start={{ x: 1, y: 1}}
          end={{ x: 1, y: 0 }}
          style={styles.tabBarBackground}
        />),
        tabBarIcon: ({color, size}) => {
          let iconName;
          if (route.name === 'HomeStack') {
            iconName = 'home';
          } else if (route.name === 'Favourites') {
            iconName = 'heart';
          } else if (route.name === 'ProfileStack') {
            iconName = 'person';
          }
          else if (route.name === 'Settings') {
            iconName = 'settings';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        headerTitleAlign:"center",
        headerTitle:()=>(
          <Image style={{ width: 120, height: 40 }} resizeMode='contain' source={require('./src/images/logo.png')} />),
          headerBackground:()=>(
            <LinearGradient
            colors={[GlobalStyles.colors.colorPrimaryDark, GlobalStyles.colors.colorPrimaryLight]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1}}
            style={styles.headerBackground}
          />
          )
        
        
      })}
      
      >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen name="Favourites" component={FavouritesScreen} options={{
        tabBarLabel:"Likes"
      }}/>
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

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
const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarBackground: {
    flex: 1,
  },
})


export default function Main() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
}

