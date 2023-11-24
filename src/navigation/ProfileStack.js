import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../colors';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InterestScreen from '../screens/InterestScreen';
import UploadImages from '../screens/UploadImages';




const Stack = createNativeStackNavigator()

export default function ProfileStack() {
    const dispatch = useDispatch()
  return (
    <Stack.Navigator >
        <Stack.Screen name='Profile' component={ProfileScreen} options={({navigation})=>({
          headerShown:false,
            
        })}/>
        <Stack.Screen name='editProfile' component={EditProfileScreen} options={{headerShown:false}}/>
        <Stack.Screen name='interests' component={InterestScreen} options={{headerShown:false}}/>
        <Stack.Screen name='uploads' component={UploadImages} options={{headerShown:false}}/>

    </Stack.Navigator>
  )
}