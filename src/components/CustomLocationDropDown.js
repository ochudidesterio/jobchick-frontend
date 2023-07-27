import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {GlobalStyles} from '../colors';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomLocationDropDown = ({options, defaultValue, onSelect}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionPress = option => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.select}>From</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.dropdownButtonText}>{defaultValue}</Text>
        <Icon
          name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color="#000"
          style={styles.dropdownIcon}
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownOptions}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.dropdownOptionButton}
              onPress={() => handleOptionPress(option)}>
              <Text style={styles.dropdownOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default CustomLocationDropDown;

const styles = StyleSheet.create({
  dropdownContainer: {
    // borderWidth: 1,
    // borderColor: GlobalStyles.colors.accent500,
    // borderRadius:5,
    marginVertical: 5,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 10,
    borderColor: GlobalStyles.colors.accent500,
    borderRadius: 5,
    borderWidth: 1,
  },
  dropdownIcon: {
    marginLeft: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: GlobalStyles.colors.txtColor,
  },
  dropdownOptions: {
    // marginTop: 5,
    borderWidth: 0.5,
    borderColor: GlobalStyles.colors.accent500,
    backgroundColor: 'white',
  },
  dropdownOptionButton: {
    height: 40,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: GlobalStyles.colors.txtColor,
  },
  select: {
    fontSize: 16,
    fontFamily:"Bold",
    color: GlobalStyles.colors.txtColor,
  },
});
