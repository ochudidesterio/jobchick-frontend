import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import EmailScreen from '../screens/EmailScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';



const AuthStack = () => {
    const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={SignUpScreen} />
      <Stack.Screen name='Email' component={EmailScreen}/>
      <Stack.Screen name='Reset' component={ResetPasswordScreen}/>
    </Stack.Navigator>
  )
}

export default AuthStack

