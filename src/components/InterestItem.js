import { StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { GlobalStyles } from '../colors';

const InterestItem = ({ name, onPress, isSelected }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, isSelected && styles.selectedContainer]}>
      <Text style={[styles.name, isSelected && styles.selectedName]}>{name}</Text>
    </TouchableOpacity>
  );
};

export default InterestItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.hint,
    margin: 5,
    padding: 4,
  },
  selectedContainer: {
    borderColor: 'red',
  },
  name: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'Medium',
  },
  selectedName: {
    color: 'red',
  },
});
