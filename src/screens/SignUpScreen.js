import React, {useState} from 'react';
import {View, StyleSheet, ScrollView,Linking} from 'react-native';
import {GlobalStyles} from '../colors';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import Animated, {SlideInDown} from 'react-native-reanimated';
import {Text, Image} from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import api from '../api/api';
import { useSelector } from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';
import {CheckBox} from '@rneui/themed'
import { PRIVACY_POLICY } from '../util/util';
import { TouchableOpacity } from 'react-native';
import DropDownModal from '../components/DropDownModal';
import Icon from 'react-native-vector-icons/Ionicons';



const SignUpScreen = () => {
  const language = useSelector(state=>state.auth.language)
  const util = getLanguageObject(language)
  const [email, setEmail] = useState('');
  const [age,setAge] = useState('')
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmpasswordError, setConfirmPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [ageError,setAgeError] = useState('')
  const [educationError,setEducationError] = useState('')
  const [policyError, setPolicyError] = useState('')
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEducationModalVisible, setIsEducationModalVisible] = useState(false);
  const [checked, setChecked] = useState(false);


  const LEVELS =[
    {
      id: 1,
      name: util.elementaryEducation,
    },
    {id: 2, name: util.secondaryEducation},
    {
      id: 3,
      name: util.bachelorsDegree,
    },
    {
      id: 4,
      name: util.mastersDegree ,
    },
  ]

  const handleEducationSelect = item => {
    setSelectedItem(item.name);
  };

  const toggleEducationModal = () => {
    setIsEducationModalVisible(!isEducationModalVisible);
  };



  const navigation = useNavigation();

  const toggleCheckbox = () => setChecked(!checked);

  const navigateToPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_POLICY)
  };

  const registerData = {
    username: '',
    email: '',
    password: '',
    age:'',
    education:'',
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
      setAgeError('')
      setEducationError('')
      setPolicyError('')

      let isValid = true;

      if (username.trim().length === 0) {
        setUsernameError(util.usernameError);
        isValid = false;
      }
      if(age.trim().length === 0){
        setAgeError(util.ageError)
        isValid = false;
      }
      if(selectedItem === null){
        setEducationError(util.educationError)
        isValid = false
      }
      if (password.trim().length < 6) {
        setPasswordError(util.passlenthError);
        isValid = false;
      }
      if(!checked){
        setPolicyError(util.policyError)
        isValid = false
      }
      if (!isValidEmail(email)) {
        setEmailError(util.txtEmailError);
        isValid = false;
      }
      if (confirmpassword.trim().length === 0) {
        setConfirmPasswordError(util.txtConfirmpass);
        isValid = false;
      } else if (password !== confirmpassword) {
        setConfirmPasswordError(util.notmatch);
        isValid = false;
      }

      if (isValid) {
        registerData.email = email;
        registerData.username = username;
        registerData.password = password;
        registerData.age = age;
        registerData.education = selectedItem;

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
        <Text style={styles.text}>{util.createyouraccount}</Text>
      </View>
      <View
        style={styles.footer}>
        <ScrollView>
        {authError ? (
            <Text style={styles.errorText}>{authError}</Text>
          ) : null}
          <CustomInput
            placeholder={util.username}
            icon="person"
            value={username}
            onChangeText={setUsername}
            secureTextEntry={false}
          />
          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null}

          <CustomInput
            placeholder={util.email}
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
            placeholder={util.age}
            icon="body-sharp"
            keyboard='number-pad'
            value={age}
            onChangeText={setAge}
            secureTextEntry={false}
          />
          {ageError ? (
            <Text style={styles.errorText}>{ageError}</Text>
          ) : null}


          <TouchableOpacity
            style={styles.dropdownTrigger}
            onPress={toggleEducationModal}>
              <Icon
              name="school"
              size={20}
              color={GlobalStyles.colors.colorPrimaryLight}
            />
            <Text style={styles.txt}>
              {selectedItem !== null ? selectedItem : util.selectEducation}
            </Text>
            <Icon
              name="chevron-down-sharp"
              size={20}
              color={GlobalStyles.colors.colorPrimaryLight}
            />
          </TouchableOpacity>

          {educationError ? (
            <Text style={styles.errorText}>{educationError}</Text>
          ) : null}
        <DropDownModal
          data={LEVELS}
          handleSelect={handleEducationSelect}
          isModalVisible={isEducationModalVisible}
          toggleModal={toggleEducationModal}
          title={util.education}
        />

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

          
         <View style={styles.policyContainer}>
         <CheckBox
           checked={checked}
           onPress={toggleCheckbox}
           title="I accept the "
           iconType="material-community"
           checkedIcon="checkbox-outline"
           uncheckedIcon={'checkbox-blank-outline'}
           checkedColor={GlobalStyles.colors.colorPrimaryDark}
           uncheckedColor={GlobalStyles.colors.colorPrimaryLight}
           containerStyle={{padding:0,marginLeft: 0, margin:0}}
           textStyle={{color:GlobalStyles.colors.colorPrimaryDark,  marginRight:0, fontWeight:"bold"}}
         />
          <Text onPress={navigateToPrivacyPolicy} style={styles.forgot}>{util.privacy}</Text>

         </View>
         {policyError ? (
            <Text style={styles.errorText}>{policyError}</Text>
          ) : null}
          <CustomButton title={util.register} onPress={handleRegister} />
          <View style={styles.signUpContainer}>
            <Text style={styles.accountTxt}>Already have an account? </Text>
            <Text onPress={handleSignIn} style={styles.forgot}>
              {util.signIn}
            </Text>
          </View>
        </ScrollView>
      </View>
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
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: GlobalStyles.colors.white,
  },
  forgot: {
    color: GlobalStyles.colors.colorPrimaryDark,
    fontWeight:"bold",
    textDecorationLine:"underline"
  },
  signUpContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 5,
    marginTop: 25,
    marginBottom:25,
  },
  policyContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',

  },
  errorText: {
    color: 'red',
    marginBottom: 1,
    fontSize: 10,
    fontFamily:"Medium"
  },
  accountTxt: {
    fontWeight: 'bold',
    color: GlobalStyles.colors.txtColor,
  },
  dropdownTrigger: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical:10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  txt: {
    color: GlobalStyles.colors.hint,
    flex:1,
    marginLeft:10
  },
});

export default SignUpScreen;
