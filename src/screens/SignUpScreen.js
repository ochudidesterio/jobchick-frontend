import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {GlobalStyles} from '../colors';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import Animated, {SlideInDown} from 'react-native-reanimated';
import {Text,Image} from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword,setConfirmPassword] = useState('');
  const [username,setUsername]=useState('')
  
  const navigation = useNavigation()

  const handleRegister = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    console.log("cp",confirmpassword)
    console.log("cp",username)
    // Add your login logic here
  };
  const handleSignIn=()=>{
    navigation.navigate("authStack",{screen:'Login'});
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <View style={styles.logoConatiner} >  
          <Image style={styles.logo} resizeMode='contain' source={require('../images/logo.png')} />
        </View>
        <Text style={styles.text}>Create your account</Text>
      </View>
      <Animated.View
        entering={SlideInDown.duration(1000)}
        style={styles.footer}>
            <CustomInput
          placeholder="Username"
          icon="person"
          value={username}
          onChangeText={setUsername}
          secureTextEntry={false}
        />
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
        <CustomInput
          placeholder="confirm password"
          icon="lock-closed"
          value={confirmpassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />
        
        <CustomButton title="Register" onPress={handleRegister} />
        <View style={styles.signUpContainer}>
          <Text style={styles.forgot}>Privacy Policy</Text>
          <Text onPress={handleSignIn} style={styles.forgot}>Sign In</Text>
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
    flexDirection:"row",
    paddingHorizontal:5,
    marginTop:20,

  },
});

export default SignUpScreen;
