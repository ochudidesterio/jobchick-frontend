import React, {useState} from 'react';
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




const EmailScreen = () => {
  const navigation = useNavigation();
  const language = useSelector(state=>state.auth.language)
  const util = getLanguageObject(language)
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [authError, setAuthError] = useState('');


 

  const handleVerify = async () => {
    // setPasswordError('');
     setEmailError('');
    try {
      let isValid = true;

      if (email.trim().length === 0) {
        setEmailError(util.loginEmailError);
        isValid = false;
      }

      if(isValid){
        const response = await api.get(`/user/get/email/${email}`)
        if(response.data === "not found"){
            setAuthError("User with email does not exist!! Try again!!")
        }
        if(response.data === "found"){
            setAuthError('')
            setEmail('')
            navigation.navigate('authStack',{screen:"Reset",params:{email:email}})
        }
        
      }
      

      
    } catch (error) {
      console.log(error);
    }
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
        <Text style={styles.text}>Enter Your Email</Text>
      </View>
      <Animated.View
        entering={SlideInDown.duration(1000)}
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
        

        <CustomButton title="Verify" onPress={handleVerify} />

        
        
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
  }
});

export default EmailScreen;
