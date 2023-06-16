import React,{useState} from 'react';
import { View, TextInput, StyleSheet,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../colors';

const CustomInput = ({ placeholder, icon, value, onChangeText, secureTextEntry,keyboard }) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };
  return (
    <View style={styles.inputContainer}>
      {secureTextEntry && <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
          <Icon
            name={isPasswordVisible ?  'eye' : 'eye-off'}
            size={24}
            color={GlobalStyles.colors.iconColor}
          />
        </TouchableOpacity>}
      
      <TextInput 
      textAlign='right'
        style={styles.input}
        placeholder={placeholder}
        value={value}
        keyboardType ={keyboard}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        placeholderTextColor={GlobalStyles.colors.hint}
      />
      
        <Icon name={icon} size={24} color={GlobalStyles.colors.iconColor} style={styles.icon} />
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
    borderRadius:5,
    paddingHorizontal: 10,
    color:GlobalStyles.colors.hint,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color:GlobalStyles.colors.txtColor,
    padding:10,
    fontSize:16,
    
  },
  iconContainer: {
    padding: 5,
  },
});

export default CustomInput;

