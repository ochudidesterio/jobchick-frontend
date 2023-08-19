import React, {useState,useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {GlobalStyles} from '../colors';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import Animated, {SlideInDown} from 'react-native-reanimated';
import {Image, Text} from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';
import api from '../api/api';
import Icon from 'react-native-vector-icons/Ionicons';




const ResetPasswordScreen = ({route}) => {
  const navigation = useNavigation();
  const language = useSelector(state=>state.auth.language)
  const util = getLanguageObject(language)
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmpasswordError, setConfirmPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [timerId, setTimerId] = useState(null);


 const {email} =route.params

  const handleReset =async  () => {
    // setPasswordError('');
    try {
      let isValid = true;

      if (password.trim().length < 6) {
        setPasswordError(util.passlenthError);
        isValid = false;
      }

      if (confirmpassword.trim().length === 0) {
        setConfirmPasswordError(util.txtConfirmpass);
        isValid = false;
      } else if (password !== confirmpassword) {
        setConfirmPasswordError(util.notmatch);
        isValid = false;
      }

      if(isValid){
        
      const response = await api.post(`/user/reset/${email}/password/${password}`)
      console.log(response.data)
      if(response.data === "changed"){
        setShowSuccess(true);
        const timer = setTimeout(() => {
          //setShowSuccess(false);
          navigation.navigate('authStack',{screen:"Login"})

        }, 2000); // 3 seconds
        setTimerId(timer);
      }
      }
      

    
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, []);
  

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
        <Text style={styles.text}>Reset Your Password</Text>
      </View>
      <Animated.View
        entering={SlideInDown.duration(1000)}
        style={styles.footer}>

      {showSuccess ? (
        <View style={styles.successContainer}>
          <Icon name="checkmark-circle" size={60} color={GlobalStyles.colors.green}/>
          <Text style={styles.successText}>Successfully Changed</Text>

        </View>
      ) : <>
      {authError ? (
          <Text style={styles.errorText}>{authError}</Text>
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

        <CustomInput
          placeholder={util.confirmPassword}
          icon="lock-closed"
          value={confirmpassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />
        {confirmpasswordError ? (
          <Text style={styles.errorText}>{confirmpasswordError}</Text>
        ) : null}
      

      <CustomButton title="Reset Password" onPress={handleReset} />
      </>}

        
          

        
        
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
  

  errorText: {
    color: 'red',
    marginBottom: 1,
    fontSize: 10,
    fontFamily:"Medium"
  },
  arrow:{
    marginTop:20
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  successIcon: {
    width: 20,
    height: 20,
    tintColor: 'green', // Change the color as needed
    marginRight: 8,
  },
  successText: {
    color: 'green', // Change the color as needed
    fontFamily: 'Medium',
  },
});

export default ResetPasswordScreen;
