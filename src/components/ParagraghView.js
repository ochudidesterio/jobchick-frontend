import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {GlobalStyles} from '../colors';

const ParagraghView = ({paragraph,onPress}) => {
  const navigation = useNavigation();

 
  return (
    <View>
      <Text style={styles.description}>
        {`${paragraph.substring(0, 220)}...`}
      </Text>
      {paragraph.length > 220 && (
        <View style={styles.chevron}>
          <TouchableOpacity onPress={onPress}>
            <Icon name={'chevron-down'} size={35} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ParagraghView;

const styles = StyleSheet.create({
  description: {
    fontSize: 15,
    fontFamily: 'SemiBold',
    color: GlobalStyles.colors.txtColor,
    textAlign: 'justify',
    paddingHorizontal:16,
  },
  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
