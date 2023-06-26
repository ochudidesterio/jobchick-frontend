import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GlobalStyles} from '../colors';
import { Translation } from '../util/WordsUtil';
import { useSelector } from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';

const JobRolesList = ({roles}) => {
  const language = useSelector(state=>state.auth.language)
  const util = getLanguageObject(language)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{util.rolesandresponsibilities}</Text>
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
    textAlign:"left",
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
