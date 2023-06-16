import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../colors';
import {Text} from 'react-native-animatable';

const CustomEditInput = ({placeholder, value, onChangeText,keyboard}) => {
  return (
    <View style={styles.container}>
        <Text style={styles.text}>{placeholder}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          textAlign="right"
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType ={keyboard}
          
          
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
    marginHorizontal:5,
  },
  text:{
    color:GlobalStyles.colors.txtColor,
    textAlign:"right",
    fontFamily:"Bold",
    fontSize:16,
    marginBottom:5,
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
    fontFamily:"Medium"
  },
});
