import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GlobalStyles } from '../colors';

const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: GlobalStyles.colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderColor:GlobalStyles.colors.colorPrimaryLight,
    borderWidth:1,
    alignItems: 'center',
    marginTop: 20,
    width:"100%"
  },
  buttonText: {
    color: GlobalStyles.colors.txtColor,
    fontSize: 16,
    fontFamily:"Bold"
  },
});

export default CustomButton;
