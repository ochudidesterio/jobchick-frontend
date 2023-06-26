import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GlobalStyles} from '../colors';
import { useSelector } from 'react-redux';
import getLanguageObject from '../util/LanguageUtil';

const QualificationList = ({qualifications}) => {
  const language = useSelector(state=>state.auth.language)
  const util = getLanguageObject(language)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{util.qualifcations}</Text>
      {qualifications.map((qualification, index) => (
        <View key={qualification.id} style={styles.roleConatiner}>
          <Text style={styles.role}>({`${index + 1}.`}) {qualification.qualification}</Text>
        </View>
      ))}
    </View>
  );
};

export default QualificationList;

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
