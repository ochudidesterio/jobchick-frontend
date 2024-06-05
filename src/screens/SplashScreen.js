import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import Animated, { BounceIn } from 'react-native-reanimated';
import { GlobalStyles } from '../colors';
import { useSelector, useDispatch } from 'react-redux';
import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { setLanguage } from '../store/slices/authSlice';

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const colors = [GlobalStyles.colors.colorPrimaryDark, GlobalStyles.colors.colorPrimaryLight];
  const { width, height } = Dimensions.get('window');

  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [storagePermissionGranted, setStoragePermissionGranted] = useState(false);

  const requestStoragePermission = async () => {
    try {
      if (Platform.Version >= 34) { // Android 14
        const imagesGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
      
        if (imagesGranted === PermissionsAndroid.RESULTS.GRANTED) {
          setStoragePermissionGranted(true);
        } else {
          Alert.alert('Permission Denied', 'Storage permissions are required to use this app.');
          setStoragePermissionGranted(false);
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setStoragePermissionGranted(true);
        } else {
          Alert.alert('Permission Denied', 'Storage permission is required to use this app.');
          setStoragePermissionGranted(false);
        }
      }
    } catch (err) {
      console.warn(err);
      Alert.alert('Permission Error', 'An error occurred while requesting storage permission.');
      setStoragePermissionGranted(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const fineLocationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (Platform.Version >= 29) {
        const backgroundLocationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );
        if (fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED &&
            backgroundLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermissionGranted(true);
        } else {
          Alert.alert('Permission Denied', 'Location permission is required to use this app.');
          setLocationPermissionGranted(false);
        }
      } else {
        if (fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
          setLocationPermissionGranted(true);
        } else {
          Alert.alert('Permission Denied', 'Location permission is required to use this app.');
          setLocationPermissionGranted(false);
        }
      }
    } catch (err) {
      console.warn(err);
      Alert.alert('Permission Error', 'An error occurred while requesting location permission.');
      setLocationPermissionGranted(false);
    }
  };

  useEffect(() => {
    dispatch(setLanguage('en'));
    if (Platform.OS === 'android') {
      requestLocationPermission();
      requestStoragePermission();
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationPermissionGranted && storagePermissionGranted) {
        loggedIn ? navigation.navigate('HomeTabs') : navigation.navigate('authStack');
      } else {
        // Handle the case when permissions are not granted
        Alert.alert('Permissions Required', 'Both location and storage permissions are required to use this app.');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation, locationPermissionGranted, storagePermissionGranted, loggedIn]);

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }} // Start from top left
      end={{ x: 1, y: 1 }} // End at bottom right
      style={{ width, height }}
    >
      <View style={styles.container}>
        <Animated.View entering={BounceIn.duration(3000)}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    width: 200,
    height: 100,
  },

  logo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: GlobalStyles.colors.colorPrimaryDark,
    textAlign: 'center',
  },
});

export default SplashScreen;
