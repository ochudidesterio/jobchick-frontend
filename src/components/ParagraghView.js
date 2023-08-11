import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { GlobalStyles } from '../colors';
import { useSelector } from 'react-redux';

const ParagraghView = ({ paragraph }) => {
  const user = useSelector(state=>state.auth.user)
  return (
    <View>
      <Text style={styles.description} numberOfLines={user && user.role=== "ADMIN" ? 3 : 4}>
        {paragraph}
      </Text>
    </View>
  );
};

export default ParagraghView;

const styles = StyleSheet.create({
  description: {
    fontSize: 15,
    // lineHeight: 24, // Set the line height here (adjust as needed)
    fontFamily: 'SemiBold',
    color: GlobalStyles.colors.txtColor,
    textAlign: 'justify',
  },
});
