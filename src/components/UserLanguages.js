import { StyleSheet,  View } from 'react-native';
import React from 'react';
import CustomItem from './CustomItem';

const UserLanguages = ({langs}) => {
  

  return (
    <View style={styles.interestContainer}>
      {langs.length !== 0 &&
        langs.map((lang) => (
          <CustomItem key={lang} name={lang} />
        ))}
    </View>
  );
};

export default UserLanguages;

const styles = StyleSheet.create({
  interestContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    marginLeft: 20,
    flexWrap: 'wrap',
    flex: 1,
  },
});
