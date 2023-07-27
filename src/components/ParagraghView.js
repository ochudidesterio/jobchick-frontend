import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { GlobalStyles } from '../colors';

const ParagraghView = ({ paragraph }) => {
  return (
    <View>
      <Text style={styles.description} numberOfLines={4}>
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
