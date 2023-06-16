import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GlobalStyles} from '../colors';

const JobRolesList = ({roles}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Roles and Responsibilities:</Text>
      {roles.map((role, index) => (
        <View key={role.id} style={styles.roleConatiner}>
          <Text style={styles.role}>({`${index + 1}.`}) {role.role}</Text>
        </View>
      ))}
    </View>
  );
};

export default JobRolesList;

const styles = StyleSheet.create({
  container: {
   width:"100%"
  },
  title: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'ExtraBold',
    marginTop: 10,
    fontSize: 15,
  },
 
  role: {
    color: GlobalStyles.colors.txtColor,
    fontFamily: 'SemiBold',
    
    textAlign:"justify",
    fontSize: 15,
  },
  roleConatiner: {
    paddingVertical:3,
   
  },
});
