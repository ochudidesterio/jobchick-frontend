import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingsScreen from '../screens/SettingsScreen';
import PrivacyPolicyWebview from '../screens/PrivacyPolicyWebview';
import TermsOfServiceWebview from '../screens/TermsOfServiceWebview';
import PaymentScreen from '../screens/PaymentScreen';




const SettingsStack = () => {
    const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='Settings' component={SettingsScreen} />
      <Stack.Screen name='privacyPolicy' component={PrivacyPolicyWebview} />
      <Stack.Screen name='termsOfService' component={TermsOfServiceWebview}/>
      <Stack.Screen name="payment" component={PaymentScreen}/>
      
    </Stack.Navigator>
  )
}

export default SettingsStack 

