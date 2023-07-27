import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import InterestItem from './InterestItem';

const UserInterests = ({interests}) => {
  

  return (
    <View style={styles.interestContainer}>
      {interests.length !== 0 &&
        interests.map((interest) => (
          <InterestItem key={interest.id} name={interest.name} />
        ))}
    </View>
  );
};

export default UserInterests;

const styles = StyleSheet.create({
  interestContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 15,
    flexWrap: 'wrap',
    flex: 1,
  },
});
