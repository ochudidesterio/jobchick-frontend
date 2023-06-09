import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {GlobalStyles} from '../colors';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import Animated, {SlideInDown} from 'react-native-reanimated';
import {Image, Text} from 'react-native-animatable';
import api, { setAuthToken } from '../api/api';
import {useDispatch} from 'react-redux';
import {loginFailure, loginSuccess} from '../store/slices/authSlice';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = {
    email: '',
    password: '',
  };

  const handleLogin = async () => {
    user.email = email;
    user.password = password;
    try {
      const loginResponse = await api.post('/auth/authenticate', user);
      console.log(loginResponse.data.token)
      saveTokenToStorage(loginResponse.data.token)
      if (loginResponse.data.message === 'Successful') {
        dispatch(loginSuccess(loginResponse.data));
        navigation.navigate('HomeTabs');
      } else {
        dispatch(loginFailure(loginResponse.data.message));
      }
      
      
    } catch (error) {
      console.log(error);
    }
  };
  const saveTokenToStorage = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Token saved to AsyncStorage:', token);
    } catch (error) {
      console.log('Error saving token to AsyncStorage:', error);
    }
  };
  const handleSignUp = () => {
    navigation.navigate("authStack",{screen:'Register'});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoConatiner} >  
          <Image style={styles.logo} resizeMode='contain' source={require('../images/logo.png')} />
        </View>
        <Text style={styles.text}>Login</Text>
      </View>
      <Animated.View
        entering={SlideInDown.duration(1000)}
        style={styles.footer}>
        <CustomInput
          placeholder="Email"
          icon="mail"
          value={email}
          onChangeText={setEmail}
          secureTextEntry={false}
        />
        <CustomInput
          placeholder="Password"
          icon="lock-closed"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <CustomButton title="Login" onPress={handleLogin} />
        <View style={styles.signUpContainer}>
          <Text style={styles.forgot}>Forgot Password?</Text>
          <Text onPress={handleSignUp} style={styles.forgot}>
            Sign Up
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: GlobalStyles.colors.colorPrimaryDark,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 3,
    backgroundColor: GlobalStyles.colors.white,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 50,
  },
  logoConatiner: {
    height:100,
    width:200,
    marginTop:30,
  },
  logo:{
    flex:1,
    width: '100%',
    height: '100%',
  },
  text:{
    fontSize:16,
    fontWeight:'bold',
    paddingBottom:20,
  },
  forgot: {
    color: GlobalStyles.colors.forgot,
  },
  signUpContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginTop: 20,
  },
});

export default LoginScreen;
