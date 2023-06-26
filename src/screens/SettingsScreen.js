import {StyleSheet, View} from 'react-native';
import React from 'react';
import CustomButton from '../components/CustomButton';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {logout} from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SwitchButton from '../components/SwitchButton';
import { useSelector } from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';

const SettingsScreen = ({navigation}) => {
  const language = useSelector(state=>state.auth.language)
  const util = getLanguageObject(language)
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    AsyncStorage.clear()
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'SplashScreen'}],
      }),
    );
  };
 
 
  return (
    <View style={styles.container}>
      <View>
        <SwitchButton />
      </View>
      <View>
      <CustomButton title={util.logout} onPress={handleLogout} />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
});
