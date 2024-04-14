// import React, {useEffect} from 'react';
// import {View, Image, StyleSheet} from 'react-native';
// import Animated, {BounceIn} from 'react-native-reanimated';
// import {GlobalStyles} from '../colors';
// import {useSelector} from 'react-redux';
// import { Dimensions } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { useDispatch } from 'react-redux';
// import { setLanguage } from '../store/slices/authSlice';


// const SplashScreen = ({navigation}) => {
//   const dispatch = useDispatch()
//   const loggedIn = useSelector(state => state.auth.loggedIn);
//   const colors = [GlobalStyles.colors.colorPrimaryDark,  GlobalStyles.colors.colorPrimaryLight];
//   const { width, height } = Dimensions.get('window');
//   useEffect(()=>{dispatch(setLanguage("en"))})
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       {
//         loggedIn
//           ? navigation.navigate('HomeTabs')
//           : navigation.navigate('authStack');
//       }
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [navigation]);

//   return (
//     <LinearGradient
//     colors={colors}
//     start={{ x: 0, y: 0 }} // Start from top left
//     end={{ x: 1, y: 1 }} // End at bottom right
//     style={{ width, height }}
//   >
//     <View style={styles.container}>
//       <Animated.View entering={BounceIn.duration(3000)}>
//       <View style={styles.logoContainer}>
//         <Image
//           source={require('../images/logo.png')}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       </View>
//       </Animated.View>
//     </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent:'center',
//     alignItems:'center',
//   },

//   logoContainer: {
//     width: 200,
//     height: 100,
//   },

//   logo: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   text: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: GlobalStyles.colors.colorPrimaryDark,
//     textAlign: 'center',
//   },
// });

// export default SplashScreen;


import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Animated, { BounceIn } from 'react-native-reanimated';
import { GlobalStyles } from '../colors';
import { useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
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
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setStoragePermissionGranted(true);
      } else {
        setStoragePermissionGranted(false);
        requestStoragePermission()
      }
    } catch (err) {
      console.warn(err);
      setStoragePermissionGranted(false);
      requestStoragePermission()
    }
  };
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setLocationPermissionGranted(true);
      } else {
        setLocationPermissionGranted(false);
        requestLocationPermission()
      }
    } catch (err) {
      console.warn(err);
      setLocationPermissionGranted(false);
      requestLocationPermission()
    }
  };

  useEffect(() => {
    dispatch(setLanguage('en'));
    if(Platform.OS === "android"){
      requestLocationPermission();
      requestStoragePermission()
    }
    
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationPermissionGranted && storagePermissionGranted) {
        loggedIn ? navigation.navigate('HomeTabs') : navigation.navigate('authStack');
      } else {
        // Handle the case when location permission is not granted
        // You can navigate to an error screen or display a message here.
        requestLocationPermission()
        requestStoragePermission()
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation, locationPermissionGranted,storagePermissionGranted, loggedIn]);

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
