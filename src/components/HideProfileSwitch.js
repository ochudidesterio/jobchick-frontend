import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Switch } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { setHideProfile } from '../store/slices/authSlice';
import { GlobalStyles } from '../colors';
import { async } from '@firebase/util';
import api from '../api/api';

const HideProfileSwitch = ({id}) => {
  const dispatch = useDispatch();
 const hideProfile = async ()=>{
  try {
    await api.post(`/user/showprofile/${id}`)

  } catch (error) {
    console.log("Error hiding profile")
  }
 }
  
  const hide = useSelector(state => state.auth.hideProfile);
  const switchValue = !hide; // Use the negation of hide to get the switch value

  const languageText = hide ? 'Hide Profile' : 'View Profile'; // Modify the languageText logic

  const toggleHideProfile = () => {
    console.log("Profile",hide)
    dispatch(setHideProfile(!hide)); // Toggle the hide profile value
    hideProfile()
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
