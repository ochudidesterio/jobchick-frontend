import { StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { GlobalStyles } from '../colors';

const CustomItem = ({ name}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

export default CustomItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.hint,
    margin: 5,
    padding: 4,
  },
  
  name: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'Medium',
  },
 
});
