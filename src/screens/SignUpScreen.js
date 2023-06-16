import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {GlobalStyles} from '../colors';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import Animated, {SlideInDown} from 'react-native-reanimated';
import {Text, Image} from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {async} from '@firebase/util';
import api from '../api/api';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmpasswordError, setConfirmPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  const navigation = useNavigation();

  const registerData = {
    username: '',
    email: '',
    password: '',
  };

  const isValidEmail = email => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleRegister = async () => {
    try {
      setUsernameError('');
      setPasswordError('');
      setEmailError('');
      setConfirmPasswordError('');
      setAuthError('');

      let isValid = true;

      if (username.trim().length === 0) {
        setUsernameError('Username is required');
        isValid = false;
      }
      if (password.trim().length < 6) {
        setPasswordError('Password must be at least 6 characters long.');
        isValid = false;
      }
      if (!isValidEmail(email)) {
        setEmailError('Invalid email address.');
        isValid = false;
      }
      if (confirmpassword.trim().length === 0) {
        setConfirmPasswordError('Please confirm your password.');
        isValid = false;
      } else if (password !== confirmpassword) {
        setConfirmPasswordError('Passwords do not match.');
        isValid = false;
      }

      if (isValid) {
        registerData.email = email;
        registerData.username = username;
        registerData.password = password;

        const response = await api.post('/auth/register', registerData);
        if (response.data.message === 'Successful') {
          navigation.navigate('authStack', {screen: 'Login'});
        } else {
          console.log(response.data.message);
          setAuthError(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSignIn = () => {
    navigation.navigate('authStack', {screen: 'Login'});
  };

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
        <Text style={styles.text}>Create your account</Text>
      </View>
      <Animated.View
        entering={SlideInDown.duration(1000)}
        style={styles.footer}>
        <ScrollView>
        {authError ? (
            <Text style={styles.errorText}>{authError}</Text>
          ) : null}
          <CustomInput
            placeholder="Username"
            icon="person"
            value={username}
            onChangeText={setUsername}
            secureTextEntry={false}
          />
          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null}

          <CustomInput
            placeholder="Email"
            icon="mail"
            keyboard="email-address"
            value={email}
            onChangeText={setEmail}
            secureTextEntry={false}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <CustomInput
            placeholder="Password"
            icon="lock-closed"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <CustomInput
            placeholder="confirm password"
            icon="lock-closed"
            value={confirmpassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
          {confirmpasswordError ? (
            <Text style={styles.errorText}>{confirmpasswordError}</Text>
          ) : null}

          <CustomButton title="Register" onPress={handleRegister} />
          <View style={styles.signUpContainer}>
            <Text style={styles.forgot}>Privacy Policy</Text>
            <Text onPress={handleSignIn} style={styles.forgot}>
              Sign In
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
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
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: GlobalStyles.colors.white,
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
  errorText: {
    color: 'red',
    marginBottom: 1,
    fontSize: 10,
    fontFamily:"Medium"
  },
});

export default SignUpScreen;
