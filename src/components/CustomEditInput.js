import { StyleSheet, TextInput, View, I18nManager } from 'react-native';
import React from 'react';
import { GlobalStyles } from '../colors';
import { Text } from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextArea } from 'react-native';


const CustomEditInput = ({ placeholder, value, onChangeText, keyboard,icon,isMultline,inputHolder }) => {
  const isRTL = I18nManager.isRTL;
  const isNumericKeyboard = keyboard === 'numeric';
  const isRTLNumeric = isRTL && isNumericKeyboard;

  const getTextAlignStyle = () => {
    if (isRTLNumeric) {
      return styles.inputRTLNumeric;
    }
    if (isRTL) {
      return styles.inputRTL;
    }
    return styles.inputLTR;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{placeholder}</Text>
      <View style={styles.inputContainer}>
      <Icon name={icon} size={20} color={GlobalStyles.colors.hint} />

        <TextInput
          style={[styles.input, getTextAlignStyle()]}
          value={value}
          placeholder={inputHolder}
          onChangeText={onChangeText}
          keyboardType={keyboard}
          placeholderTextColor={GlobalStyles.colors.hint}
          multiline={isMultline}
          numberOfLines={isMultline ? 4 : 1} // Set the number of lines for TextArea

        />
      </View>
    </View>
  );
};

export default CustomEditInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  text: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'Bold',
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: GlobalStyles.colors.accent500,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal:7,
    color: GlobalStyles.colors.hint,
  },
  input: {
    flex: 1,
    color: GlobalStyles.colors.txtColor,
    padding: 5,
    fontSize: 16,
    fontFamily: 'Medium',
    marginLeft:2,
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  inputRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  inputLTR: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
  inputRTLNumeric: {
    textAlign: 'left',
    writingDirection: 'ltr',
  },
});
