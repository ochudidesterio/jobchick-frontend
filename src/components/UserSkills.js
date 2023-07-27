import { StyleSheet,  View } from 'react-native';
import React from 'react';
import CustomItem from './CustomItem';

const UserSkills = ({skills}) => {
  

  return (
    <View style={styles.interestContainer}>
      {skills.length !== 0 &&
        skills.map((skill) => (
          <CustomItem key={skill} name={skill} />
        ))}
    </View>
  );
};

export default UserSkills;

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
