import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Animated, {BounceIn, SlideInDown} from 'react-native-reanimated';
import {GlobalStyles} from '../colors';
import {useSelector} from 'react-redux';
import { Text } from 'react-native-animatable';
import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const SplashScreen = ({navigation}) => {
  const loggedIn = useSelector(state => state.auth.loggedIn);
  const colors = [GlobalStyles.colors.colorPrimaryDark,  GlobalStyles.colors.colorPrimaryLight];
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const timer = setTimeout(() => {
      {
        loggedIn
          ? navigation.navigate('HomeTabs')
          : navigation.navigate('authStack');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

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
    justifyContent:'center',
    alignItems:'center',
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
