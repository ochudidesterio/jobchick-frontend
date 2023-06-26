import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomButton from '../components/CustomButton';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {logout} from '../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Translation } from '../util/WordsUtil';

const SettingsScreen = ({navigation}) => {
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
      <CustomButton title={Translation.word.logout} onPress={handleLogout} />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
});
