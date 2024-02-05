import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Switch} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {setLanguage} from '../store/slices/authSlice';
import { GlobalStyles } from '../colors';

const SwitchButton = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.auth.language);
  const switchValue = language === 'he';
  const languageText = language === 'he' ? 'עברית' : 'English';
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'he' : 'en';
    dispatch(setLanguage(newLanguage));
  };

  return (
    <View style={styles.lang}>
        <Text style={styles.langText}>{languageText}</Text>
        <Switch
      color={GlobalStyles.colors.colorPrimaryDark}
      value={switchValue}
      onValueChange={toggleLanguage}
    />
    </View>
  );
};

export default SwitchButton;

const styles = StyleSheet.create({
    lang:{
        flexDirection:'row',
        justifyContent:"flex-end",
        alignItems:"center"
    },
    langText:{
        color:GlobalStyles.colors.txtColor,
        fontFamily:"Medium"
    }
});
