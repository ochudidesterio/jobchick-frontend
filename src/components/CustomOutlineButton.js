import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GlobalStyles } from '../colors';

const CustomOutLineButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderColor:GlobalStyles.colors.accent500,
    borderWidth:1,
    alignItems: 'center',
    marginTop: 20,
    width:"100%",
  },
  buttonText: {
    color: GlobalStyles.colors.error500,
    fontSize: 14,
    fontFamily:"SemiBold"
  },
});

export default CustomOutLineButton;
