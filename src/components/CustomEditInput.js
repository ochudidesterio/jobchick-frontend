import { StyleSheet, TextInput, View, I18nManager } from 'react-native';
import React from 'react';
import { GlobalStyles } from '../colors';
import { Text } from 'react-native-animatable';

const CustomEditInput = ({ placeholder, value, onChangeText, keyboard }) => {
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
        <TextInput
          style={[styles.input, getTextAlignStyle()]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboard}
          multiline={true}
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
    color: GlobalStyles.colors.hint,
  },
  input: {
    flex: 1,
    color: GlobalStyles.colors.txtColor,
    padding: 5,
    fontSize: 16,
    fontFamily: 'Medium',
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
