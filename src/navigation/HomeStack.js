import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DetailsScreen from '../screens/DetailsScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator()

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} options={{headerShown:false} }  />
      <Stack.Screen name='Details' component={DetailsScreen} options={{headerShown:false}}/>
    </Stack.Navigator>
  )
}