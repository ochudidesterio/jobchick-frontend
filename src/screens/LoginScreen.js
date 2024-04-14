import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {GlobalStyles} from '../colors';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import {Image, Text} from 'react-native-animatable';
import api, {setAuthToken} from '../api/api';
import {useDispatch} from 'react-redux';
import {loginFailure, loginSuccess} from '../store/slices/authSlice';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';
import {CheckBox} from '@rneui/themed'

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const language = useSelector(state=>state.auth.language)
  const util = getLanguageObject(language)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [checked, setChecked] = useState(true);
  const toggleCheckbox = () => setChecked(!checked);

  const user = {
    email: '',
    password: '',
  };

  const handleLogin = async () => {
    setPasswordError('');
    setEmailError('');
    try {
      let isValid = true;

      if (email.trim().length === 0) {
        setEmailError(util.loginEmailError);
        isValid = false;
      }
      if (password.trim().length === 0) {
        setPasswordError(util.loginPassError);
        isValid = false;
      }

      if (isValid) {
        user.email = email;
        user.password = password;
        const loginResponse = await api.post('/auth/authenticate', user);
        if (loginResponse.data.message === 'Successful') {
          saveTokenToStorage(loginResponse.data.token);
          const loggedInUser = await api.get(`/user/${loginResponse.data.id}`);
          if (loggedInUser.data.message == 'Successful') {
            dispatch(loginSuccess(loggedInUser.data));
            navigation.navigate('HomeTabs');
          }
        } else {
          dispatch(loginFailure(loginResponse.data.message));
          setAuthError(loginResponse.data.message)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const saveTokenToStorage = async token => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.log('Error saving token to AsyncStorage:', error);
    }
  };
  const handleSignUp = () => {
    navigation.navigate('authStack', {screen: 'Register'});
  };
  const handleForgotPassword=()=>{
    navigation.navigate('authStack',{screen:"Email"})
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoConatiner}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('../images/logo.png')}
          />
        </View>
        <Text style={styles.text}>{util.login}</Text>
      </View>
      <View
        style={styles.footer}>
          {authError ? (
            <Text style={styles.errorText}>{authError}</Text>
          ) : null}
        <CustomInput
          placeholder={util.email}
          icon="mail"
          value={email}
          keyboard="email-address"
          onChangeText={setEmail}
          secureTextEntry={false}
        />
        {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        <CustomInput
          placeholder={util.password}
          icon="lock-closed"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}


        <View style={styles.remMeContainer}>
        <CheckBox
           checked={checked}
           onPress={toggleCheckbox}
           title="Remember me"
           iconType="material-community"
           checkedIcon="checkbox-outline"
           uncheckedIcon={'checkbox-blank-outline'}
           checkedColor={GlobalStyles.colors.colorPrimaryDark}
           uncheckedColor={GlobalStyles.colors.colorPrimaryLight}
           containerStyle={{padding:0,marginLeft: 0}}
           textStyle={{color:GlobalStyles.colors.colorPrimaryDark, fontWeight:"bold"}}
         />
        <Text onPress={handleForgotPassword} style={styles.forgot}>{util.forgotPassword}</Text>

        </View>
        <CustomButton title={util.login} onPress={handleLogin} />
        <View style={styles.signUpContainer}>
          <Text style={styles.accountTxt}>Dont have an account? </Text>
          <Text onPress={handleSignUp} style={styles.forgot}>
            {util.signUp}
          </Text>
        </View>
      </View>
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
     paddingVertical: 30,
     marginTop: 30,
  },
  logoConatiner: {
    height: 100,
    width: 200,
    marginTop: 30,
  },
  logo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: GlobalStyles.colors.white,
  },
  accountTxt: {
    fontWeight: 'bold',
    color: GlobalStyles.colors.txtColor,
  },
  forgot: {
    color: GlobalStyles.colors.colorPrimaryDark,
    fontWeight:"bold"
  },
  signUpContainer: {

    justifyContent: "center",
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginTop: 25,
  },
  remMeContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    paddingRight:5
  },
  errorText: {
    color: 'red',
    marginBottom: 1,
    fontSize: 10,
    fontFamily:"Medium"
  },
});

export default LoginScreen;
