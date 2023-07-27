import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Switch } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { setHideProfile } from '../store/slices/authSlice';
import { GlobalStyles } from '../colors';

const HideProfileSwitch = () => {
  const dispatch = useDispatch();
  const hide = useSelector(state => state.auth.hideProfile);
  const switchValue = !hide; // Use the negation of hide to get the switch value

  const languageText = hide ? 'View Profile' : 'Hide Profile'; // Modify the languageText logic

  const toggleHideProfile = () => {
    dispatch(setHideProfile(!hide)); // Toggle the hide profile value
  };

  return (
    <View style={styles.lang}>
      <Text style={styles.langText}>{languageText}</Text>
      <Switch
        color={GlobalStyles.colors.colorPrimaryDark}
        value={switchValue}
        onValueChange={toggleHideProfile} // Use the toggleHideProfile function
      />
    </View>
  );
};

export default HideProfileSwitch;

const styles = StyleSheet.create({
  lang: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langText: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'Bold',
    fontSize:16,
  },
});
