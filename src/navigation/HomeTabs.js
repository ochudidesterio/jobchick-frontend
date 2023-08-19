import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import {GlobalStyles} from '../colors';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import FavouritesScreen from '../screens/FavouritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
const Tab = createBottomTabNavigator();
const HomeTabs = () => {
  

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: GlobalStyles.colors.white,
        tabBarInactiveTintColor: GlobalStyles.colors.tabIconColor,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <LinearGradient
            colors={[
              GlobalStyles.colors.colorPrimaryDark,
              GlobalStyles.colors.colorPrimaryLight,
            ]}
            start={{x: 1, y: 1}}
            end={{x: 1, y: 0}}
            style={styles.tabBarBackground}
          />
        ),
        tabBarIcon: ({color, size}) => {
          let iconName;
          if (route.name === 'HomeStack') {
            iconName = 'home';
          } else if (route.name === 'Favourites') {
            iconName = 'heart';
          } else if (route.name === 'ProfileStack') {
            iconName = 'person';
          } else if (route.name === 'Settings') {
            iconName = 'settings-sharp';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarStyle: styles.tab,
        headerStyle:styles.tab,
        headerTitleAlign: 'center',
        headerTitle: () => (
          <Image
            style={{width: 120, height: 40}}
            resizeMode="contain"
            source={require('../images/logo.png')}
          />
        ),
        headerBackground: () => (
          <LinearGradient
            colors={[
              GlobalStyles.colors.colorPrimaryDark,
              GlobalStyles.colors.colorPrimaryLight,
            ]}
            start={{x: 1, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.headerBackground}
          />
        ),
        
        
      })}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        // options={{
        //   tabBarLabel: 'Home',
        // }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        
      />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default HomeTabs;

const styles = StyleSheet.create({
    headerBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      tabBarBackground: {
        flex: 1,
        
      },
      tab:{
        height:50
      }
});
