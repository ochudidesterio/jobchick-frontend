import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../colors';

const CustomInput = ({
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry,
  keyboard,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const getTextAlignStyle = () => {
    return I18nManager.isRTL ? styles.inputRTL : styles.inputLTR;
  };

  return (
    <View style={styles.inputContainer}>
      <Icon
        name={icon}
        size={24}
        color={GlobalStyles.colors.iconColor}
        style={styles.icon}
      />

      <TextInput
        style={[styles.input, getTextAlignStyle()]}
        placeholder={placeholder}
        value={value}
        keyboardType={keyboard}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        placeholderTextColor={GlobalStyles.colors.hint}
      />

      <View style={styles.helper}>
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.iconContainer}>
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color={GlobalStyles.colors.iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderColor: GlobalStyles.colors.accent500,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: GlobalStyles.colors.hint,
  },
  helper: {
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    color: GlobalStyles.colors.txtColor,
    fontSize: 16,
  },
  inputRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  inputLTR: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  iconContainer: {
    padding: 1,
  },
});

export default CustomInput;
